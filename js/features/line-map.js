// ========================================
// FEATURE: Line Map
// Gestisce mappa fermate per linea (Leaflet + OSM)
// Versione 1.0.0
// ========================================

(function () {
  'use strict';

  // Funzione di inizializzazione che aspetta Leaflet
  function initLineMap() {
    if (typeof L === 'undefined') {
      console.warn('⏳ Leaflet non ancora caricato, riprovo tra 100ms...');
      setTimeout(initLineMap, 100);
      return;
    }

    console.log('✅ Leaflet disponibile, inizializzo line-map...');

    const section = document.getElementById('line-map-section');
    const infoTitle = document.getElementById('line-map-title');
    const infoSummary = document.getElementById('line-map-summary');
    const stopList = document.getElementById('line-map-stops');
    const toggleBtn = document.getElementById('toggle-map-btn');

    if (!section || !infoTitle || !stopList) {
      console.warn('Elementi mappa fermate non trovati');
      return;
    }

    let mapInitialized = false;
    let mapInstance = null;
    let markerLayer = null;
    let routeLine = null;
    let stopsData = [];
    let currentTileLayer = null;
    let isSatelliteMode = false;
    let currentMapSize = 'medium'; // 'small', 'medium', 'large', 'fullwidth'
    let mapSizeControlsInitialized = false;

    function initMap() {
      if (mapInitialized) return;

      const mapElement = document.getElementById('line-map');
      if (!mapElement) {
        console.error('❌ Elemento #line-map non trovato');
        return;
      }

      // Assicura che l'elemento abbia dimensioni visibili
      if (mapElement.offsetHeight === 0 || mapElement.offsetWidth === 0) {
        console.warn('⚠️ Elemento mappa ha dimensioni zero, imposto dimensioni minime');
        mapElement.style.minHeight = '320px';
        mapElement.style.height = '100%';
      }

      mapInstance = L.map('line-map', { 
        scrollWheelZoom: true,
        zoomControl: true
      });
      
      // Layer mappa standard (OpenStreetMap)
      const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
      });
      
      // Layer mappa satellite (Esri World Imagery)
      const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: '© Esri, Maxar, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, IGP',
        maxZoom: 19
      });
      
      // Aggiungi il layer standard di default
      currentTileLayer = osmLayer;
      currentTileLayer.addTo(mapInstance);

      markerLayer = L.layerGroup().addTo(mapInstance);
      mapInitialized = true;
      
      // Setup pulsante cambio tipo mappa
      setupMapTypeToggle(osmLayer, satelliteLayer);
      
      console.log('✅ Mappa Leaflet inizializzata');
    }

    function clearMap() {
      if (markerLayer) markerLayer.clearLayers();
      if (routeLine) {
        routeLine.remove();
        routeLine = null;
      }
      stopList.innerHTML = '';
    }

    /**
     * Ottiene il percorso stradale reale tra le fermate usando OSRM
     * @param {Array<Array<number>>} coordinates - Array di [lat, lng]
     * @returns {Promise<Array<Array<number>>|null>} Array di coordinate del percorso o null se errore
     */
    async function getRoutePath(coordinates) {
      if (!coordinates || coordinates.length < 2) return null;

      try {
        // OSRM richiede formato: {lon},{lat};{lon},{lat};...
        const coordsString = coordinates
          .map(coord => `${coord[1]},${coord[0]}`) // [lat, lng] -> "lng,lat"
          .join(';');

        const url = `https://router.project-osrm.org/route/v1/driving/${coordsString}?overview=full&geometries=geojson`;
        
        // NOTA: OSRM (Open Source Routing Machine) è un servizio esterno.
        // I warning sugli header HTTP (es. "server header should only contain the server name")
        // sono attesi e normali perché non possiamo controllare gli header delle risposte di servizi esterni.
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 secondi timeout

        const response = await fetch(url, {
          signal: controller.signal,
          headers: {
            'Accept': 'application/json'
          }
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`OSRM API error: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
          throw new Error('OSRM: nessun percorso trovato');
        }

        // Estrai le coordinate dal percorso (formato GeoJSON: [lon, lat])
        const routeCoordinates = data.routes[0].geometry.coordinates;
        
        // Converti da [lon, lat] a [lat, lon] per Leaflet
        return routeCoordinates.map(coord => [coord[1], coord[0]]);
      } catch (error) {
        console.warn('⚠️ Errore nel calcolo percorso OSRM, uso percorso diretto:', error.message);
        return null; // Fallback alla linea diretta
      }
    }

    async function renderStops(stops) {
      clearMap();
      if (!mapInitialized || !Array.isArray(stops) || stops.length === 0) return;

      const bounds = [];
      const stopCoords = [];
      
      // Aggiorna il contatore delle fermate nel titolo
      const sidebarTitle = document.querySelector('#line-map-sidebar h3');
      if (sidebarTitle) {
        const totalStops = stops.filter(stop => stop && stop.coords).length;
        const existingBadge = sidebarTitle.querySelector('.stops-count-badge');
        if (existingBadge) {
          existingBadge.textContent = totalStops;
        } else {
          const badge = document.createElement('span');
          badge.className = 'stops-count-badge';
          badge.textContent = totalStops;
          badge.setAttribute('aria-label', `${totalStops} fermate totali`);
          sidebarTitle.appendChild(badge);
        }
      }

      stops.forEach((stop, index) => {
        if (!stop || !stop.coords) return;

        // Estrai il nome della fermata (gestisce sia oggetti che stringhe)
        let stopName = 'Fermata sconosciuta';
        if (typeof stop === 'string') {
          stopName = stop;
        } else if (stop && typeof stop === 'object') {
          stopName = stop.name || stop.nome || (typeof stop === 'string' ? stop : 'Fermata sconosciuta');
        }
        
        // Assicura che stopName sia una stringa
        if (typeof stopName !== 'string') {
          console.warn('⚠️ Nome fermata non valido:', stopName, 'per stop:', stop);
          stopName = `Fermata ${index + 1}`;
        }
        
        const marker = L.marker(stop.coords)
          .addTo(markerLayer)
          .bindPopup(`<strong>${stopName}</strong>`);

        bounds.push(stop.coords);
        stopCoords.push(stop.coords);

        const li = document.createElement('li');
        li.setAttribute('data-stop-index', index);
        li.setAttribute('aria-label', `Fermata ${index + 1}: ${stopName}`);
        
        // Crea struttura più elegante con indicatore numerico
        const stopNumber = document.createElement('span');
        stopNumber.className = 'stop-number';
        stopNumber.textContent = index + 1;
        
        const stopNameSpan = document.createElement('span');
        stopNameSpan.className = 'stop-name';
        stopNameSpan.textContent = stopName;
        
        li.appendChild(stopNumber);
        li.appendChild(stopNameSpan);
        
        li.addEventListener('click', () => {
          marker.openPopup();
          mapInstance.setView(stop.coords, Math.max(mapInstance.getZoom(), 15));
          
          // Rimuovi active da tutti gli altri
          stopList.querySelectorAll('li').forEach(item => item.classList.remove('active'));
          // Aggiungi active a questo
          li.classList.add('active');
          
          // Rimuovi active dopo l'animazione (opzionale)
          setTimeout(() => {
            if (li.classList.contains('active')) {
              li.classList.remove('active');
            }
          }, 2000);
        });
        
        stopList.appendChild(li);
      });

      // Calcola il percorso stradale reale
      if (stopCoords.length > 1 && mapInstance) {
        console.log('🛣️ Calcolo percorso stradale con OSRM...');
        const routePath = await getRoutePath(stopCoords);
        
        // Usa il percorso OSRM se disponibile, altrimenti fallback alla linea diretta
        const pathCoords = routePath || stopCoords;
        
        routeLine = L.polyline(pathCoords, {
          color: '#0ea5e9',
          weight: 4,
          opacity: 0.85,
          lineCap: 'round',
          lineJoin: 'round'
        }).addTo(mapInstance);
        
        if (routePath) {
          console.log('✅ Percorso stradale calcolato con successo');
        } else {
          console.log('ℹ️ Uso percorso diretto (OSRM non disponibile)');
        }
      }

      if (bounds.length > 0 && mapInstance) {
        mapInstance.fitBounds(bounds, { padding: [40, 40] });
        setTimeout(() => mapInstance.invalidateSize(), 250);
      }
    }

    function formatSummary(lineData) {
      if (!lineData) return 'Visualizza fermate sulla mappa interattiva.';
      if (lineData.summary) return lineData.summary;
      if (lineData.length && lineData.duration) {
        return `Percorso di ${lineData.length} km • ${lineData.duration} min • ${lineData.direction || 'andata/ritorno'}`;
      }
      return 'Percorso con tutte le fermate evidenziate.';
    }

    function showSection(show) {
      section.style.display = show ? 'block' : 'none';
    }

    function setupMapTypeToggle(osmLayer, satelliteLayer) {
      const mapTypeBtn = document.getElementById('toggle-map-type-btn');
      const mapTypeIcon = mapTypeBtn?.querySelector('.map-type-icon');
      const mapTypeText = mapTypeBtn?.querySelector('.map-type-text');
      
      if (!mapTypeBtn) {
        console.warn('⚠️ Pulsante cambio tipo mappa non trovato');
        return;
      }
      
      mapTypeBtn.addEventListener('click', () => {
        if (!mapInstance || !currentTileLayer) return;
        
        // Rimuovi il layer corrente
        mapInstance.removeLayer(currentTileLayer);
        
        // Cambia layer
        isSatelliteMode = !isSatelliteMode;
        currentTileLayer = isSatelliteMode ? satelliteLayer : osmLayer;
        currentTileLayer.addTo(mapInstance);
        
        // Aggiorna UI
        if (mapTypeIcon) {
          mapTypeIcon.textContent = isSatelliteMode ? '🗺️' : '🛰️';
        }
        if (mapTypeText) {
          mapTypeText.textContent = isSatelliteMode ? 'Mappa' : 'Satellite';
        }
        
        // Aggiorna aria-label
        mapTypeBtn.setAttribute('aria-label', `Passa a ${isSatelliteMode ? 'mappa standard' : 'vista satellite'}`);
        
        console.log(`✅ Mappa cambiata a: ${isSatelliteMode ? 'Satellite' : 'Standard'}`);
      });
    }

    function applyMapSize(size) {
      const mapWrapper = document.querySelector('.line-map-wrapper');
      const sidebar = document.getElementById('line-map-sidebar');
      
      if (!mapWrapper) {
        console.warn('⚠️ applyMapSize: mapWrapper non trovato');
        return;
      }
      
      console.log(`📐 Applico dimensione mappa: ${size}`);
      
      // Rimuovi tutte le classi di dimensione
      mapWrapper.classList.remove('map-size-small', 'map-size-medium', 'map-size-large', 'map-size-fullwidth');
      
      // Aggiungi la classe corrispondente
      mapWrapper.classList.add(`map-size-${size}`);
      
      console.log(`✅ Classe aggiunta: map-size-${size}`, mapWrapper.classList.toString());
      
      // Gestisci sidebar in base alla dimensione
      if (size === 'fullwidth' && sidebar) {
        sidebar.style.display = 'none';
        console.log('📐 Sidebar nascosta (fullwidth)');
      } else if (sidebar) {
        sidebar.style.display = '';
        console.log('📐 Sidebar visibile');
      }
    }

    function setupMapSizeControls() {
      console.log('🔧 setupMapSizeControls chiamata');
      
      const mapSizeBtn = document.getElementById('map-size-btn');
      const mapSizeMenu = document.getElementById('map-size-menu');
      const mapSizeOptions = mapSizeMenu?.querySelectorAll('.map-size-option');
      const mapWrapper = document.querySelector('.line-map-wrapper');
      const sidebar = document.getElementById('line-map-sidebar');
      
      console.log('🔍 Elementi trovati:', {
        mapSizeBtn: !!mapSizeBtn,
        mapSizeMenu: !!mapSizeMenu,
        mapSizeOptions: mapSizeOptions?.length || 0,
        mapWrapper: !!mapWrapper,
        sidebar: !!sidebar
      });
      
      if (!mapSizeBtn || !mapSizeMenu || !mapWrapper) {
        console.warn('⚠️ Elementi controllo dimensioni mappa non trovati');
        console.warn('⚠️ Dettagli:', {
          mapSizeBtn: mapSizeBtn ? 'OK' : 'MISSING',
          mapSizeMenu: mapSizeMenu ? 'OK' : 'MISSING',
          mapWrapper: mapWrapper ? 'OK' : 'MISSING'
        });
        return;
      }
      
      // Se gli event listener sono già stati attaccati, non riattaccarli
      if (mapSizeBtn.dataset.listenerAttached === 'true') {
        console.log('ℹ️ Event listener già attaccati, salto');
        return;
      }
      
      console.log('✅ Tutti gli elementi trovati, procedo con setup');
      
      // Carica dimensione salvata
      const savedSize = localStorage.getItem('tpl.mapSize');
      if (savedSize && ['small', 'medium', 'large', 'fullwidth'].includes(savedSize)) {
        currentMapSize = savedSize;
        applyMapSize(currentMapSize);
      }
      
      const menuState = {
        isOpen: false,
        justOpened: false,
        outsideClickHandler: null,
        keydownHandler: null,
        hideTimeout: null
      };
      
      function updateMenuVisibility(open) {
        mapSizeBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
        
        if (menuState.hideTimeout) {
          clearTimeout(menuState.hideTimeout);
          menuState.hideTimeout = null;
        }
        
        if (open) {
          // Rimuovi aria-hidden quando il menu è aperto (non impostarlo a "false")
          mapSizeMenu.removeAttribute('aria-hidden');
          mapSizeMenu.classList.add('is-open');
          mapSizeMenu.style.display = 'flex';
          mapSizeMenu.style.opacity = '1';
          mapSizeMenu.style.visibility = 'visible';
          mapSizeMenu.style.pointerEvents = 'auto';
        } else {
          mapSizeMenu.classList.remove('is-open');
          mapSizeMenu.style.opacity = '0';
          mapSizeMenu.style.visibility = 'hidden';
          mapSizeMenu.style.pointerEvents = 'none';
          
          // Imposta aria-hidden solo dopo che la transizione è completata
          // e assicurati che nessun elemento interno abbia il focus
          menuState.hideTimeout = setTimeout(() => {
            if (!menuState.isOpen) {
              // Verifica che nessun elemento interno abbia il focus prima di nascondere
              const activeElement = document.activeElement;
              if (!mapSizeMenu.contains(activeElement)) {
                mapSizeMenu.style.display = 'none';
                mapSizeMenu.setAttribute('aria-hidden', 'true');
              }
            }
          }, 180);
        }
      }
      
      function attachOutsideHandlers() {
        if (menuState.outsideClickHandler || menuState.keydownHandler) return;
        
        menuState.outsideClickHandler = (event) => {
          if (menuState.justOpened) return;
          if (mapSizeBtn.contains(event.target) || mapSizeMenu.contains(event.target)) {
            return;
          }
          closeMenu();
        };
        
        menuState.keydownHandler = (event) => {
          if (event.key === 'Escape') {
            closeMenu();
          }
        };
        
        document.addEventListener('click', menuState.outsideClickHandler, true);
        document.addEventListener('keydown', menuState.keydownHandler, true);
      }
      
      function detachOutsideHandlers() {
        if (menuState.outsideClickHandler) {
          document.removeEventListener('click', menuState.outsideClickHandler, true);
          menuState.outsideClickHandler = null;
        }
        if (menuState.keydownHandler) {
          document.removeEventListener('keydown', menuState.keydownHandler, true);
          menuState.keydownHandler = null;
        }
      }
      
      function determineMenuDirection() {
        const previousDisplay = mapSizeMenu.style.display;
        const previousVisibility = mapSizeMenu.style.visibility;
        const previousOpacity = mapSizeMenu.style.opacity;
        const previousPointerEvents = mapSizeMenu.style.pointerEvents;
        
        mapSizeMenu.classList.remove('open-up');
        mapSizeMenu.style.display = 'flex';
        mapSizeMenu.style.visibility = 'hidden';
        mapSizeMenu.style.opacity = '0';
        mapSizeMenu.style.pointerEvents = 'none';
        
        const menuRect = mapSizeMenu.getBoundingClientRect();
        const btnRect = mapSizeBtn.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const spaceBelow = viewportHeight - btnRect.bottom;
        const spaceAbove = btnRect.top;
        const shouldOpenUp = spaceBelow < menuRect.height + 16 && spaceAbove > spaceBelow;
        
        if (shouldOpenUp) {
          mapSizeMenu.classList.add('open-up');
        } else {
          mapSizeMenu.classList.remove('open-up');
        }
        
        mapSizeMenu.style.display = previousDisplay;
        mapSizeMenu.style.visibility = previousVisibility;
        mapSizeMenu.style.opacity = previousOpacity;
        mapSizeMenu.style.pointerEvents = previousPointerEvents;
      }
      
      function openMenu() {
        if (menuState.isOpen) return;
        console.log('✅ Apro menu dimensioni (inline)');
        
        determineMenuDirection();
        menuState.isOpen = true;
        menuState.justOpened = true;
        
        // Rimuovi aria-hidden PRIMA di mostrare il menu
        mapSizeMenu.removeAttribute('aria-hidden');
        updateMenuVisibility(true);
        attachOutsideHandlers();
        
        requestAnimationFrame(() => {
          menuState.justOpened = false;
        });
      }
      
      function closeMenu() {
        if (!menuState.isOpen) return;
        console.log('❌ Chiudo menu dimensioni (inline)');
        
        // Rimuovi il focus da qualsiasi elemento interno prima di chiudere
        const activeElement = document.activeElement;
        if (mapSizeMenu.contains(activeElement)) {
          mapSizeBtn.focus();
        }
        
        menuState.isOpen = false;
        menuState.justOpened = false;
        
        updateMenuVisibility(false);
        detachOutsideHandlers();
      }
      
      mapSizeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        
        console.log('🔘 Click su pulsante Dimensioni');
        console.log('📊 Stato menu:', {
          open: menuState.isOpen,
          display: mapSizeMenu.style.display,
          computedDisplay: window.getComputedStyle(mapSizeMenu).display
        });
        
        if (menuState.isOpen) {
          closeMenu();
        } else {
          openMenu();
        }
      });
      
      // Gestisci selezione dimensione
      mapSizeOptions?.forEach(option => {
        option.addEventListener('click', (e) => {
          e.stopPropagation();
          const size = option.getAttribute('data-size');
          console.log(`🔘 Click su opzione dimensione: ${size}`);
          
          if (size) {
            currentMapSize = size;
            console.log(`📐 Cambio dimensione a: ${size}`);
            
            applyMapSize(size);
            localStorage.setItem('tpl.mapSize', size);
            closeMenu();
            
            // Aggiorna stato attivo
            mapSizeOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            
            // Aggiorna testo pulsante
            const sizeLabels = {
              small: 'Piccola',
              medium: 'Media',
              large: 'Grande',
              fullwidth: 'Larghezza piena'
            };
            const mapSizeText = mapSizeBtn.querySelector('.map-size-text');
            if (mapSizeText) {
              mapSizeText.textContent = sizeLabels[size] || 'Dimensioni';
              console.log(`✅ Testo pulsante aggiornato: ${sizeLabels[size]}`);
            }
            
            // Invalida dimensioni mappa dopo il cambio
            if (mapInitialized && mapInstance) {
              setTimeout(() => {
                mapInstance.invalidateSize();
                console.log('✅ Dimensioni mappa invalidate');
              }, 200);
            }
          } else {
            console.warn('⚠️ Dimensione non valida:', size);
          }
        });
      });
      
      // Imposta dimensione iniziale
      applyMapSize(currentMapSize);
      
      // Segna l'opzione attiva
      mapSizeOptions?.forEach(option => {
        if (option.getAttribute('data-size') === currentMapSize) {
          option.classList.add('active');
        }
      });
      
      // Segna che gli event listener sono stati attaccati
      mapSizeBtn.dataset.listenerAttached = 'true';
    }

    function setupAdditionalControls() {
      // Pulsante Centra Mappa
      const centerMapBtn = document.getElementById('center-map-btn');
      if (centerMapBtn) {
        centerMapBtn.addEventListener('click', () => {
          if (!mapInstance || !stopsData || stopsData.length === 0) {
            console.warn('⚠️ Impossibile centrare: mappa o fermate non disponibili');
            return;
          }
          
          const bounds = stopsData
            .filter(stop => stop && stop.coords)
            .map(stop => stop.coords);
          
          if (bounds.length > 0) {
            mapInstance.fitBounds(bounds, { padding: [40, 40] });
            setTimeout(() => mapInstance.invalidateSize(), 250);
            console.log('✅ Mappa centrata su tutte le fermate');
          }
        });
      }

      // Pulsante La Mia Posizione
      const myLocationBtn = document.getElementById('my-location-btn');
      if (myLocationBtn) {
        myLocationBtn.addEventListener('click', async () => {
          if (!mapInstance) {
            console.warn('⚠️ Mappa non inizializzata');
            return;
          }

          try {
            // Usa il modulo geolocation se disponibile
            if (window.Geolocation && typeof window.Geolocation.getUserPosition === 'function') {
              const position = await window.Geolocation.getUserPosition();
              if (position && position.coords) {
                const { latitude, longitude } = position.coords;
                mapInstance.setView([latitude, longitude], 15);
                
                // Aggiungi marker temporaneo per la posizione utente
                if (markerLayer) {
                  // Rimuovi marker precedente se esiste
                  markerLayer.eachLayer((layer) => {
                    if (layer.options && layer.options.isUserLocation) {
                      markerLayer.removeLayer(layer);
                    }
                  });
                  
                  // Aggiungi nuovo marker
                  const userMarker = L.marker([latitude, longitude], {
                    isUserLocation: true
                  })
                    .addTo(markerLayer)
                    .bindPopup('<strong>La tua posizione</strong>');
                  
                  // Usa icona personalizzata per la posizione utente
                  userMarker.setIcon(L.divIcon({
                    className: 'user-location-marker',
                    html: '<div style="background: #007bff; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>',
                    iconSize: [20, 20],
                    iconAnchor: [10, 10]
                  }));
                  
                  userMarker.openPopup();
                }
                
                console.log('✅ Mappa centrata sulla posizione utente');
              }
            } else {
              // Fallback: usa l'API nativa del browser
              navigator.geolocation.getCurrentPosition(
                (position) => {
                  const { latitude, longitude } = position.coords;
                  mapInstance.setView([latitude, longitude], 15);
                  console.log('✅ Mappa centrata sulla posizione utente (API nativa)');
                },
                (error) => {
                  console.warn('⚠️ Errore geolocalizzazione:', error.message);
                  alert('Impossibile ottenere la tua posizione. Verifica i permessi del browser.');
                }
              );
            }
          } catch (error) {
            console.error('❌ Errore geolocalizzazione:', error);
            alert('Impossibile ottenere la tua posizione.');
          }
        });
      }

      // Pulsante Mostra/Nascondi Sidebar
      const toggleSidebarBtn = document.getElementById('toggle-sidebar-btn');
      const sidebar = document.getElementById('line-map-sidebar');
      if (toggleSidebarBtn && sidebar) {
        let sidebarVisible = true;
        
        toggleSidebarBtn.addEventListener('click', () => {
          sidebarVisible = !sidebarVisible;
          
          if (sidebarVisible) {
            sidebar.style.display = '';
            toggleSidebarBtn.setAttribute('aria-label', 'Nascondi lista fermate');
            toggleSidebarBtn.querySelector('.map-sidebar-text').textContent = 'Fermate';
            console.log('✅ Sidebar mostrata');
          } else {
            sidebar.style.display = 'none';
            toggleSidebarBtn.setAttribute('aria-label', 'Mostra lista fermate');
            toggleSidebarBtn.querySelector('.map-sidebar-text').textContent = 'Mostra';
            console.log('❌ Sidebar nascosta');
          }
          
          // Invalida dimensioni mappa dopo il cambio
          if (mapInitialized && mapInstance) {
            setTimeout(() => mapInstance.invalidateSize(), 200);
          }
        });
      }
    }

    function attachToggle() {
      if (!toggleBtn) return;
      toggleBtn.addEventListener('click', () => {
        const mapContainer = document.querySelector('.line-map-container');
        const mapControls = document.querySelector('.line-map-controls');
        const sidebar = document.getElementById('line-map-sidebar');
        
        if (!mapContainer) return;
        
        const hidden = mapContainer.style.display === 'none';
        
        // Nascondi/mostra solo il container della mappa
        mapContainer.style.display = hidden ? 'block' : 'none';
        
        // I controlli rimangono sempre visibili
        if (mapControls) {
          mapControls.style.display = 'flex';
        }
        
        // La sidebar rimane sempre visibile
        if (sidebar) {
          sidebar.style.display = '';
        }
        
        toggleBtn.textContent = hidden ? 'Nascondi mappa' : 'Mostra mappa';
        
        if (hidden && mapInitialized && mapInstance) {
          setTimeout(() => mapInstance.invalidateSize(), 150);
        }
      });
    }

    function enhanceLineData(lineKey, rawData) {
      if (!rawData) return null;
      
      // Se i dati sono già completi con coordinate, verifica che abbiano anche il nome
      if (rawData.stops && Array.isArray(rawData.stops) && rawData.stops.length > 0) {
        // Assicura che ogni stop abbia un nome valido (anche se coords è null)
        const stopsWithNames = rawData.stops.map((stop, idx) => {
          if (typeof stop === 'string') {
            return { name: stop, coords: null };
          }
          if (stop && typeof stop === 'object') {
            const name = stop.name || stop.nome || `Fermata ${idx + 1}`;
            return { ...stop, name };
          }
          return { name: `Fermata ${idx + 1}`, coords: null };
        });
        
        // Se tutti gli stop hanno coordinate, ritorna i dati così come sono
        if (stopsWithNames.every(stop => stop.coords)) {
          return { ...rawData, stops: stopsWithNames };
        }
        
        // Altrimenti continua con la logica per aggiungere coordinate
        rawData = { ...rawData, stops: stopsWithNames };
      }

      const fermateNomi = rawData.stops || [];
      let stops = [];

      // Se lineKey è 0 (Linea 400 Udine-Grado) e abbiamo coordinate reali, usale
      if (lineKey === 0 && typeof window.CoordinatesLinea400 !== 'undefined') {
        console.log('🗺️ Uso coordinate reali Linea 400');
        stops = fermateNomi.map((stop, index) => {
          // Estrai il nome (gestisce sia stringhe che oggetti)
          const nome = typeof stop === 'string' ? stop : (stop.name || stop.nome || `Fermata ${index + 1}`);
          const coords = window.CoordinatesLinea400.get(nome);
          if (coords) {
            return {
              name: nome,
              coords: [coords.lat, coords.lng],
              descrizione: coords.descrizione
            };
          } else {
            console.warn(`⚠️ Coordinate mancanti per fermata: ${nome}`);
            return null;
          }
        }).filter(stop => stop !== null); // Rimuovi fermate senza coordinate
      } else {
        // Mock coords come fallback per altre linee
        console.log('🗺️ Uso coordinate mock (linea diversa da 400 o coordinate non disponibili)');
        const baseCoord = [46.062, 13.235];
        const offset = 0.01;
        stops = fermateNomi.map((stop, index) => {
          // Estrai il nome (gestisce sia stringhe che oggetti)
          const name = typeof stop === 'string' ? stop : (stop.name || stop.nome || `Fermata ${index + 1}`);
          return {
            name,
            coords: [
              baseCoord[0] + (Math.random() - 0.5) * offset,
              baseCoord[1] + (Math.random() - 0.5) * offset
            ]
          };
        });
      }

      return {
        name: rawData.name || lineKey,
        summary: rawData.summary,
        stops
      };
    }

    window.LineMap = {
      update(lineKey, rawData) {
        console.log('🗺️ LineMap.update chiamato con:', { lineKey, rawData });
        
        if (lineKey === undefined || lineKey === null || !rawData) {
          console.warn('⚠️ LineMap: dati mancanti, nascondo sezione');
          showSection(false);
          return;
        }

        console.log('🗺️ Elaboro dati linea...');
        const lineData = enhanceLineData(lineKey, rawData);
        console.log('🗺️ Dati elaborati:', lineData);
        
        if (!lineData || !lineData.stops || lineData.stops.length === 0) {
          console.warn('⚠️ LineMap: nessuna fermata valida, nascondo sezione');
          showSection(false);
          return;
        }

        // Mostra la sezione PRIMA di inizializzare la mappa per evitare dimensioni zero
        console.log('🗺️ Mostro sezione mappa prima di inizializzare');
        showSection(true);
        
        // Inizializza i controlli dimensioni se non già fatto (dopo che la sezione è visibile)
        if (!mapSizeControlsInitialized) {
          setTimeout(() => {
            setupMapSizeControls();
            setupAdditionalControls();
            mapSizeControlsInitialized = true;
          }, 100);
        }
        
        // Aspetta un frame per assicurarsi che la sezione sia visibile
        requestAnimationFrame(async () => {
          console.log('🗺️ Inizializzo mappa...');
          initMap();

          console.log('🗺️ Aggiorno UI e rendering marker...');
          infoTitle.textContent = lineData.name;
          infoSummary.textContent = formatSummary(lineData);
          stopsData = lineData.stops;
          await renderStops(stopsData);
          
          // Forza il ridimensionamento della mappa dopo che è visibile
          setTimeout(() => {
            if (mapInstance) {
              mapInstance.invalidateSize();
              console.log('✅ Mappa ridimensionata');
            }
            
            // Scroll automatico alla mappa
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
            console.log('📍 Scroll automatico alla mappa eseguito');
          }, 300);
        });
        
        console.log('✅ LineMap.update completato');
      }
    };

    attachToggle();
    // setupMapSizeControls() viene chiamata quando la sezione viene mostrata
    // per assicurarsi che gli elementi siano disponibili
    console.log('✅ LineMap inizializzato e pronto');
  }

  // Avvia l'inizializzazione
  initLineMap();
})();
