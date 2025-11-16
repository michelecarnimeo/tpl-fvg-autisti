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
    let stopsData = [];

    function initMap() {
      if (mapInitialized) return;

      mapInstance = L.map('line-map', { scrollWheelZoom: true });
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapInstance);

      markerLayer = L.layerGroup().addTo(mapInstance);
      mapInitialized = true;
    }

    function clearMap() {
      if (markerLayer) markerLayer.clearLayers();
      stopList.innerHTML = '';
    }

    function renderStops(stops) {
      clearMap();
      if (!mapInitialized || !Array.isArray(stops) || stops.length === 0) return;

      const bounds = [];

      stops.forEach((stop, index) => {
        if (!stop.coords) return;

        const marker = L.marker(stop.coords)
          .addTo(markerLayer)
          .bindPopup(`<strong>${stop.name}</strong>`);

        bounds.push(stop.coords);

        const li = document.createElement('li');
        li.textContent = `${index + 1}. ${stop.name}`;
        li.addEventListener('click', () => {
          marker.openPopup();
          li.classList.add('active');
          setTimeout(() => li.classList.remove('active'), 1200);
        });
        stopList.appendChild(li);
      });

      if (bounds.length > 0) {
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

    function attachToggle() {
      if (!toggleBtn) return;
      toggleBtn.addEventListener('click', () => {
        const mapWrapper = document.querySelector('.line-map-wrapper');
        const hidden = mapWrapper.style.display === 'none';
        mapWrapper.style.display = hidden ? 'grid' : 'none';
        toggleBtn.textContent = hidden ? 'Nascondi mappa' : 'Mostra mappa';
        if (hidden && mapInitialized) {
          setTimeout(() => mapInstance.invalidateSize(), 150);
        }
      });
    }

    function enhanceLineData(lineKey, rawData) {
      if (!rawData) return null;
      if (rawData.stops && rawData.stops[0]?.coords) return rawData; // già tutto

      // mock coords come fallback (da sostituire con coordinate reali)
      const baseCoord = [46.062, 13.235];
      const offset = 0.01;
      const stops = (rawData.stops || []).map((name, index) => ({
        name,
        coords: [
          baseCoord[0] + (Math.random() - 0.5) * offset,
          baseCoord[1] + (Math.random() - 0.5) * offset
        ]
      }));

      return {
        name: rawData.name || lineKey,
        summary: rawData.summary,
        stops
      };
    }

    window.LineMap = {
      update(lineKey, rawData) {
        console.log('🗺️ LineMap.update chiamato con:', { lineKey, rawData });
        
        if (!lineKey || !rawData) {
          console.warn('⚠️ LineMap: dati mancanti, nascondo sezione');
          showSection(false);
          return;
        }

        console.log('🗺️ Inizializzo mappa...');
        initMap();

        console.log('🗺️ Elaboro dati linea...');
        const lineData = enhanceLineData(lineKey, rawData);
        console.log('🗺️ Dati elaborati:', lineData);
        
        if (!lineData || !lineData.stops || lineData.stops.length === 0) {
          console.warn('⚠️ LineMap: nessuna fermata valida, nascondo sezione');
          showSection(false);
          return;
        }

        console.log('🗺️ Aggiorno UI e rendering marker...');
        infoTitle.textContent = lineData.name;
        infoSummary.textContent = formatSummary(lineData);
        stopsData = lineData.stops;
        renderStops(stopsData);
        
        console.log('🗺️ Mostro sezione mappa');
        showSection(true);
        
        // Scroll automatico alla mappa dopo un breve delay
        setTimeout(() => {
          section.scrollIntoView({ behavior: 'smooth', block: 'start' });
          console.log('📍 Scroll automatico alla mappa eseguito');
        }, 300);
        
        console.log('✅ LineMap.update completato');
      }
    };

    attachToggle();
    console.log('✅ LineMap inizializzato e pronto');
  }

  // Avvia l'inizializzazione
  initLineMap();
})();
