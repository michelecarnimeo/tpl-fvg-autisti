/**
 * Geolocation Module
 * Gestione geolocalizzazione e ordinamento fermate per distanza
 * 
 * Funzionalità:
 * - Calcolo distanza tra coordinate (formula di Haversine)
 * - Richiesta posizione utente
 * - Ordinamento fermate per distanza
 * - Gestione UI (pulsanti, notifiche)
 * - Gestione permessi e errori
 * 
 * Utilizzato principalmente in:
 * - index.html (home) - Pulsanti geolocalizzazione
 * - fermate.html - Ordinamento fermate per distanza
 * - Modal fermate - Ordinamento fermate nel modal
 */

(function () {
  'use strict';

  // Helper per ottenere Storage (gestisce caricamento asincrono)
  function getStorage() {
    if (typeof window.Storage !== 'undefined' && window.Storage.getItem) {
      return window.Storage;
    }
    // Fallback se Storage non è ancora disponibile
    return {
      getItem: function(key, defaultValue = null) {
        try {
          const item = localStorage.getItem(key);
          return item !== null ? item : defaultValue;
        } catch (e) {
          console.warn('⚠️ Errore nel fallback Storage.getItem:', e);
          return defaultValue;
        }
      },
      setItem: function(key, value) {
        try {
          localStorage.setItem(key, value);
          return true;
        } catch (e) {
          console.warn('⚠️ Errore nel fallback Storage.setItem:', e);
          return false;
        }
      },
      removeItem: function(key) {
        try {
          localStorage.removeItem(key);
          return true;
        } catch (e) {
          console.warn('⚠️ Errore nel fallback Storage.removeItem:', e);
          return false;
        }
      }
    };
  }

  // Stato geolocalizzazione
  let userPosition = null;
  let locationPermissionGranted = false;
  const reverseGeocodeCache = new Map();

  // Coordinate fermate (da aggiornare con dati reali se disponibili)
  const FERMATE_COORDINATES = {
    "Udine": { lat: 46.0625, lon: 13.2354 },
    "Lauzacco": { lat: 45.9833, lon: 13.2833 },
    "S. Stefano Udinese": { lat: 45.9667, lon: 13.3000 },
    "S. Maria La Longa": { lat: 45.9333, lon: 13.3167 },
    "Mereto Di Capitolo": { lat: 45.9167, lon: 13.3333 },
    "Palmanova": { lat: 45.9000, lon: 13.3500 },
    "Sevegliano": { lat: 45.8833, lon: 13.3667 },
    "Strassoldo": { lat: 45.8667, lon: 13.3833 },
    "Muscoli": { lat: 45.8500, lon: 13.4000 },
    "Cervignano SS14": { lat: 45.8333, lon: 13.4167 },
    "Cervignano FS": { lat: 45.8300, lon: 13.4200 },
    "Cervignano AUT": { lat: 45.8275, lon: 13.4225 },
    "Terzo Di Aquileia": { lat: 45.8167, lon: 13.4333 },
    "Aquileia": { lat: 45.8000, lon: 13.4500 },
    "Belvedere": { lat: 45.7833, lon: 13.4667 },
    "Grado": { lat: 45.7667, lon: 13.4833 }
  };

  /**
   * Calcola la distanza tra due coordinate usando la formula di Haversine
   * @param {number} lat1 - Latitudine punto 1
   * @param {number} lon1 - Longitudine punto 1
   * @param {number} lat2 - Latitudine punto 2
   * @param {number} lon2 - Longitudine punto 2
   * @returns {number} Distanza in km
   */
  function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Raggio della Terra in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distanza in km
  }

  /**
   * Verifica se la geolocalizzazione è supportata dal browser
   * @returns {boolean}
   */
  function isGeolocationSupported() {
    return 'geolocation' in navigator;
  }

  /**
   * Richiede la posizione dell'utente
   * @param {Object} options - Opzioni geolocalizzazione (opzionale)
   * @returns {Promise<Object>} Promise che risolve con la posizione {latitude, longitude, accuracy}
   */
  function requestUserLocation(options = {}) {
    return new Promise((resolve, reject) => {
      if (!isGeolocationSupported()) {
        const error = new Error('Geolocalizzazione non supportata dal browser');
        error.code = 0;
        reject(error);
        return;
      }

      const defaultOptions = {
        enableHighAccuracy: true,
        timeout: 15000, // 15 secondi
        maximumAge: 300000 // 5 minuti
      };

      const geoOptions = { ...defaultOptions, ...options };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Verifica che la posizione sia valida
          if (!position.coords.latitude || !position.coords.longitude) {
            const error = new Error('Coordinate non valide');
            error.code = 2;
            reject(error);
            return;
          }

          const positionData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          };

          userPosition = positionData;
          locationPermissionGranted = true;
          console.log('📍 Posizione rilevata:', positionData);
          resolve(positionData);
        },
        (error) => {
          console.error('❌ Errore geolocalizzazione:', error);
          locationPermissionGranted = false;

          // Aggiungi codice errore se non presente
          if (!error.code) {
            error.code = 0; // Errore sconosciuto
          }

          reject(error);
        },
        geoOptions
      );
    });
  }

  /**
   * Recupera il nome della città a partire da coordinate (reverse geocoding)
   * Usa OpenStreetMap (Nominatim) con una semplice cache in-memory
   * @param {number} latitude
   * @param {number} longitude
   * @returns {Promise<string|null>}
   */
  async function reverseGeocode(latitude, longitude) {
    const cacheKey = `${latitude.toFixed(3)}:${longitude.toFixed(3)}`;
    if (reverseGeocodeCache.has(cacheKey)) {
      return reverseGeocodeCache.get(cacheKey);
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    try {
      // NOTA: Nominatim (OpenStreetMap) è un servizio esterno.
      // I warning "x-content-type-options header missing" e "cache-control header missing"
      // sono attesi e normali perché non possiamo controllare gli header delle risposte di servizi esterni.
      const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(latitude)}&lon=${encodeURIComponent(longitude)}&zoom=12&addressdetails=1`;
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json'
        },
        signal: controller.signal
      });

      if (!response.ok) {
        throw new Error(`Reverse geocoding fallito (${response.status})`);
      }

      const data = await response.json();
      const address = data.address || {};
      const cityName =
        address.city ||
        address.town ||
        address.village ||
        address.municipality ||
        address.county ||
        data.display_name ||
        null;

      reverseGeocodeCache.set(cacheKey, cityName);
      return cityName;
    } catch (error) {
      console.warn('⚠️ Reverse geocoding non riuscito:', error);
      return null;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Calcola le distanze reali lungo le strade usando OSRM
   * @param {Object} userPos - Posizione utente {latitude, longitude}
   * @param {Array<Object>} stops - Array di {name, coordinates: {lat, lon}}
   * @param {number} maxRetries - Numero massimo di tentativi (default: 2)
   * @returns {Promise<Array<number>|null>} Array di distanze in km o null se errore
   */
  async function getRouteDistances(userPos, stops, maxRetries = 2) {
    if (!userPos || !stops || stops.length === 0) return null;

    // Se ci sono troppe fermate, limita alle prime 30 per evitare timeout
    // Le altre useranno la distanza Haversine
    const MAX_STOPS_FOR_OSRM = 30;
    const stopsToProcess = stops.length > MAX_STOPS_FOR_OSRM 
      ? stops.slice(0, MAX_STOPS_FOR_OSRM)
      : stops;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        // Prepara le coordinate: posizione utente + tutte le fermate
        const coordinates = [
          [userPos.longitude, userPos.latitude], // [lon, lat] per OSRM
          ...stopsToProcess.map(stop => [stop.coordinates.lon, stop.coordinates.lat])
        ];

        // Formato OSRM: {lon},{lat};{lon},{lat};...
        const coordsString = coordinates.map(coord => `${coord[0]},${coord[1]}`).join(';');
        
        // Usa l'endpoint 'table' per calcolare tutte le distanze in una volta
        // sources=0 significa che partiamo dalla posizione utente (indice 0)
        // destinations=1,2,3,... sono tutte le fermate
        const destinations = Array.from({ length: stopsToProcess.length }, (_, i) => i + 1).join(';');
        const url = `https://router.project-osrm.org/table/v1/driving/${coordsString}?sources=0&destinations=${destinations}&annotations=distance`;
        
        // NOTA: OSRM (Open Source Routing Machine) è un servizio esterno.
        // I warning sugli header HTTP (es. "server header should only contain the server name")
        // sono attesi e normali perché non possiamo controllare gli header delle risposte di servizi esterni.
        
        const controller = new AbortController();
        let timeoutId = null;
        let isAborted = false;

        // Timeout progressivo: 30s al primo tentativo, 40s ai successivi
        const timeoutDuration = attempt === 0 ? 30000 : 40000;
        timeoutId = setTimeout(() => {
          isAborted = true;
          controller.abort();
        }, timeoutDuration);

        try {
          const response = await fetch(url, {
            signal: controller.signal,
            headers: {
              'Accept': 'application/json'
            }
          });

          // Pulisci il timeout se la richiesta è completata
          if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = null;
          }

          if (!response.ok) {
            // Se è un errore 429 (troppe richieste), aspetta prima di riprovare
            if (response.status === 429 && attempt < maxRetries) {
              const waitTime = (attempt + 1) * 2000; // 2s, 4s, 6s...
              console.log(`⏳ OSRM: troppe richieste, aspetto ${waitTime}ms prima di riprovare...`);
              await new Promise(resolve => setTimeout(resolve, waitTime));
              continue; // Riprova
            }
            throw new Error(`OSRM API error: ${response.status}`);
          }

          const data = await response.json();
          
          if (data.code !== 'Ok' || !data.distances || !data.distances[0]) {
            throw new Error('OSRM: nessuna distanza calcolata');
          }

          // data.distances[0] contiene le distanze (metri) dalla posizione utente a tutte le fermate
          const distanceRow = data.distances[0];
          if (!Array.isArray(distanceRow) || distanceRow.length !== stopsToProcess.length) {
            throw new Error('OSRM: dimensioni matrice distanze non valide');
          }

          // Converte le distanze in chilometri
          const distances = distanceRow.map(value => {
            if (typeof value !== 'number' || value < 0 || !Number.isFinite(value)) {
              return null;
            }
            return value / 1000;
          });

          // Se abbiamo limitato le fermate, aggiungi null per le altre
          if (stops.length > MAX_STOPS_FOR_OSRM) {
            const remaining = new Array(stops.length - MAX_STOPS_FOR_OSRM).fill(null);
            return [...distances, ...remaining];
          }

          return distances;
        } catch (fetchError) {
          // Pulisci il timeout anche in caso di errore
          if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = null;
          }

          // Distingui tra timeout e altri errori
          if (fetchError.name === 'AbortError' || isAborted) {
            // Se non è l'ultimo tentativo, riprova
            if (attempt < maxRetries) {
              console.log(`⏳ OSRM: timeout (${timeoutDuration}ms), riprovo... (tentativo ${attempt + 2}/${maxRetries + 1})`);
              await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1))); // Backoff: 1s, 2s, 3s...
              continue;
            }
            throw new Error(`OSRM: timeout nella richiesta (${timeoutDuration}ms)`);
          }
          
          // Gestisci errori di connessione (ERR_CONNECTION_TIMED_OUT, ERR_NETWORK_CHANGED, ecc.)
          if (fetchError.message && (
            fetchError.message.includes('ERR_CONNECTION_TIMED_OUT') ||
            fetchError.message.includes('ERR_NETWORK_CHANGED') ||
            fetchError.message.includes('Failed to fetch') ||
            fetchError.message.includes('NetworkError')
          )) {
            // Se non è l'ultimo tentativo, riprova dopo un breve delay
            if (attempt < maxRetries) {
              const waitTime = (attempt + 1) * 2000; // 2s, 4s, 6s...
              console.log(`⏳ OSRM: errore di connessione, aspetto ${waitTime}ms prima di riprovare... (tentativo ${attempt + 2}/${maxRetries + 1})`);
              await new Promise(resolve => setTimeout(resolve, waitTime));
              continue;
            }
            throw new Error('OSRM: errore di connessione dopo tutti i tentativi');
          }
          
          // Se non è l'ultimo tentativo e l'errore è recuperabile, riprova
          if (attempt < maxRetries && !fetchError.message.includes('429')) {
            console.log(`⏳ OSRM: errore, riprovo... (tentativo ${attempt + 2}/${maxRetries + 1})`);
            await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
            continue;
          }
          
          // Rilancia l'errore originale
          throw fetchError;
        }
      } catch (error) {
        // Se è l'ultimo tentativo, fallback
        if (attempt === maxRetries) {
          const errorMessage = error.message || 'Errore sconosciuto';
          if (errorMessage.includes('timeout')) {
            console.warn('⚠️ Timeout nel calcolo distanze OSRM dopo tutti i tentativi, uso distanza in linea d\'aria');
          } else if (errorMessage.includes('429')) {
            console.warn('⚠️ OSRM: troppe richieste dopo tutti i tentativi, uso distanza in linea d\'aria');
          } else {
            console.warn('⚠️ Errore nel calcolo distanze OSRM dopo tutti i tentativi, uso distanza in linea d\'aria:', errorMessage);
          }
          return null; // Fallback alla distanza Haversine
        }
        // Altrimenti continua il loop per riprovare
      }
    }

    return null; // Non dovrebbe mai arrivare qui, ma per sicurezza
  }

  /**
   * Ordina fermate per distanza dalla posizione utente
   * Usa OSRM per calcolare le distanze reali lungo le strade (per pullman)
   * @param {Array<string>} fermate - Array di nomi fermate
   * @param {Object} userPos - Posizione utente {latitude, longitude}
   * @returns {Promise<Array<Object>>} Array di oggetti {name, index, distance, coordinates}
   */
  async function sortFermateByDistance(fermate, userPos) {
    if (!userPos || !fermate || fermate.length === 0) {
      return fermate.map((name, index) => ({ name, index, distance: null, coordinates: null }));
    }

    // Prepara i dati delle fermate con coordinate
    // Usa CoordinatesLinea400 se disponibile (coordinate reali per linea Udine-Grado)
    const stopsWithCoords = fermate.map((fermata, index) => {
      let coords = null;
      
      // Prova prima con CoordinatesLinea400 (coordinate reali)
      if (typeof window.CoordinatesLinea400 !== 'undefined' && window.CoordinatesLinea400.get) {
        const coordData = window.CoordinatesLinea400.get(fermata);
        if (coordData) {
          coords = { lat: coordData.lat, lon: coordData.lng };
        }
      }
      
      // Fallback a FERMATE_COORDINATES se CoordinatesLinea400 non ha la fermata
      if (!coords) {
        coords = FERMATE_COORDINATES[fermata];
      }
      
      return {
        name: fermata,
        index: index,
        coordinates: coords
      };
    }).filter(stop => stop.coordinates !== undefined);

    // Prima calcola le distanze Haversine per tutte le fermate (veloce)
    const stopsWithHaversine = stopsWithCoords.map(stop => {
      const haversineDistance = stop.coordinates 
        ? calculateDistance(
            userPos.latitude,
            userPos.longitude,
            stop.coordinates.lat,
            stop.coordinates.lon
          )
        : null;
      
      return {
        ...stop,
        haversineDistance
      };
    });

    // Ordina per distanza Haversine per trovare le fermate più vicine
    const sortedByHaversine = [...stopsWithHaversine].sort((a, b) => {
      if (a.haversineDistance === null && b.haversineDistance === null) return 0;
      if (a.haversineDistance === null) return 1;
      if (b.haversineDistance === null) return -1;
      return a.haversineDistance - b.haversineDistance;
    });

    // Calcola con OSRM solo le prime 15 fermate più vicine (per ridurre tempo e carico)
    const TOP_STOPS_FOR_OSRM = 15;
    const topStopsForOSRM = sortedByHaversine.slice(0, TOP_STOPS_FOR_OSRM);

    // Calcola distanze OSRM solo per le fermate più vicine
    let routeDistances = null;
    const oosmStopsMap = new Map(); // Mappa nome -> distanza OSRM
    
    if (topStopsForOSRM.length > 0) {
      try {
        console.log(`🛣️ Calcolo distanze reali con OSRM per le prime ${topStopsForOSRM.length} fermate più vicine...`);
        const oosmDistances = await getRouteDistances(userPos, topStopsForOSRM);
        
        if (oosmDistances && oosmDistances.length === topStopsForOSRM.length) {
          // Crea mappa nome -> distanza OSRM
          topStopsForOSRM.forEach((stop, idx) => {
            if (oosmDistances[idx] !== null && oosmDistances[idx] !== undefined) {
              oosmStopsMap.set(stop.name, oosmDistances[idx]);
            }
          });
          console.log(`✅ Distanze OSRM calcolate per ${oosmStopsMap.size} fermate`);
        }
      } catch (error) {
        console.warn('⚠️ Errore nel calcolo OSRM:', error.message);
      }
    }

    // Mappa le distanze alle fermate (OSRM se disponibile, altrimenti Haversine)
    const stopsWithDistance = stopsWithHaversine.map(stop => {
      let distance = null;
      
      // Prova prima con OSRM (se disponibile per questa fermata)
      if (oosmStopsMap.has(stop.name)) {
        distance = oosmStopsMap.get(stop.name);
      } else if (stop.haversineDistance !== null) {
        // Fallback alla distanza Haversine
        distance = stop.haversineDistance;
      }

      return {
        name: stop.name,
        index: stop.index,
        distance: distance,
        coordinates: stop.coordinates
      };
    });

    // Aggiungi fermate senza coordinate
    const stopsWithoutCoords = fermate
      .map((fermata, index) => {
        if (!FERMATE_COORDINATES[fermata]) {
          return { name: fermata, index, distance: null, coordinates: null };
        }
        return null;
      })
      .filter(stop => stop !== null);

    // Combina e ordina
    const allStops = [...stopsWithDistance, ...stopsWithoutCoords].sort((a, b) => {
      if (a.distance === null && b.distance === null) return 0;
      if (a.distance === null) return 1;
      if (b.distance === null) return -1;
      return a.distance - b.distance;
    });

    // 🐛 DEBUG PANEL: Mostra fermata più vicina
    if (allStops.length > 0 && allStops[0].distance !== null && window.GPSDebugPanel) {
      const nearest = allStops[0];
      window.GPSDebugPanel.addLog('distance', 'Fermata Più Vicina', {
        'Fermata': nearest.name,
        'Distanza': `${nearest.distance.toFixed(2)} km`,
        'Metri': `${Math.round(nearest.distance * 1000)}m`,
        'Coordinate': `${nearest.coordinates.lat}, ${nearest.coordinates.lon}`
      });
      
      // Mostra anche le prime 3 fermate
      console.log('📏 Top 3 fermate più vicine:', allStops.slice(0, 3).map(f => ({
        nome: f.name,
        distanza: `${f.distance.toFixed(2)} km`
      })));
    }

    return allStops;
  }

  /**
   * Mostra una notifica di geolocalizzazione
   * @param {string} message - Messaggio da mostrare
   * @param {string} type - Tipo notifica ('info', 'success', 'error')
   */
  function showLocationNotification(message, type = 'info') {
    // Crea elemento notifica se non esiste
    let notification = document.getElementById('location-notification');
    if (!notification) {
      notification = document.createElement('div');
      notification.id = 'location-notification';
      notification.className = 'location-notification';
      document.body.appendChild(notification);
    }

    // Aggiorna contenuto e stile
    notification.textContent = message;
    notification.className = `location-notification ${type}`;
    notification.style.display = 'block';

    // Auto-hide dopo 3 secondi
    setTimeout(() => {
      if (notification) {
        notification.style.display = 'none';
      }
    }, 3000);
  }

  /**
   * Aggiorna l'icona del pulsante geolocalizzazione
   * @param {HTMLElement} iconElement - Elemento icona
   * @param {boolean} hasLocation - Se true, mostra icona posizione; altrimenti icona default
   */
  function updateLocationButtonIcon(iconElement, hasLocation = false) {
    if (iconElement) {
      iconElement.textContent = hasLocation ? '📍' : '📍';
    }
  }

  /**
   * Mostra/nasconde il pulsante di geolocalizzazione
   * @param {boolean} show - Se true, mostra il pulsante
   */
  function toggleLocationButton(show) {
    const locationBtn = document.getElementById('location-btn');
    if (locationBtn) {
      // Mostra solo se la geolocalizzazione è supportata
      const shouldShow = show && isGeolocationSupported();
      if (shouldShow) {
        locationBtn.classList.remove('hidden');
      } else {
        locationBtn.classList.add('hidden');
      }
    }
  }

  /**
   * Disabilita l'ordinamento per distanza
   */
  function disableLocationSorting() {
    const locationBtn = document.getElementById('location-btn');
    const locationIcon = document.getElementById('location-icon');
    const locationText = document.getElementById('location-text');

    if (locationBtn) {
      locationBtn.classList.remove('active');
      locationBtn.disabled = false;
    }

    if (locationIcon) locationIcon.textContent = '📍';
    if (locationText) locationText.textContent = 'Rileva posizione';

    // Rimuovi preferenza
    const Storage = getStorage();
    Storage.removeItem('tpl.locationEnabled');
  }

  /**
   * Resetta solo lo stato UI del pulsante GPS (senza resettare lo stato interno)
   * Utile quando l'utente modifica manualmente la partenza dopo l'auto-assegnazione GPS
   * Permette di ri-premere il pulsante GPS per ri-assegnare la partenza
   */
  function resetLocationButtonUI() {
    // Reset pulsante GPS home page
    const locationBtn = document.getElementById('location-btn');
    const locationIcon = document.getElementById('location-icon');
    const locationText = document.getElementById('location-text');

    if (locationBtn) {
      locationBtn.classList.remove('active');
      locationBtn.disabled = false;
    }
    if (locationIcon) locationIcon.textContent = '📍';
    if (locationText) locationText.textContent = 'Rileva posizione';

    console.log('✅ UI pulsante GPS resettata (stato interno preservato)');
  }

  /**
   * Resetta completamente lo stato della geolocalizzazione
   * Utile quando si fa "Riparti da capo"
   */
  function resetLocationState() {
    // Reset stato interno
    userPosition = null;
    locationPermissionGranted = false;

    // Reset pulsante GPS home page
    const locationBtn = document.getElementById('location-btn');
    const locationIcon = document.getElementById('location-icon');
    const locationText = document.getElementById('location-text');

    if (locationBtn) {
      locationBtn.classList.remove('active');
      locationBtn.disabled = false;
    }
    if (locationIcon) locationIcon.textContent = '📍';
    if (locationText) locationText.textContent = 'Rileva posizione';

    // Reset pulsante GPS modal fermate
    const fermateLocationBtn = document.getElementById('fermate-location-btn');
    const fermateLocationIcon = document.getElementById('fermate-location-icon');
    const fermateLocationText = document.getElementById('fermate-location-text');

    if (fermateLocationBtn) {
      fermateLocationBtn.classList.remove('active');
      fermateLocationBtn.disabled = false;
    }
    if (fermateLocationIcon) fermateLocationIcon.textContent = '📍';
    if (fermateLocationText) fermateLocationText.textContent = 'Rileva';

    // Rimuovi preferenza (opzionale - commentato per mantenere la preferenza utente)
    // Storage.removeItem('tpl.locationEnabled');

    console.log('✅ Stato geolocalizzazione resettato');
  }

  /**
   * Trova la fermata più vicina tra quelle prioritarie per la linea Udine-Grado
   * Usa distanze reali lungo le strade (OSRM) per determinare la fermata più vicina
   * @param {Object} userPos - Posizione utente {latitude, longitude}
   * @param {Array} fermate - Array di nomi fermate della linea
   * @returns {Promise<Object|null>} {name, index, distance} della fermata più vicina, o null
   */
  async function findNearestPriorityStop(userPos, fermate) {
    // Fermate prioritarie per la linea Udine-Grado
    const priorityStops = ['Udine', 'Palmanova', 'Cervignano FS', 'Grado'];
    
    // Filtra solo le fermate prioritarie presenti nella linea
    const availablePriorityStops = priorityStops.filter(stop => fermate.includes(stop));
    
    if (availablePriorityStops.length === 0) {
      return null;
    }

    // Verifica disponibilità CoordinatesLinea400
    const hasCoordinatesLinea400 = typeof window.CoordinatesLinea400 !== 'undefined' && 
                                     window.CoordinatesLinea400 && 
                                     typeof window.CoordinatesLinea400.get === 'function';
    
    if (!hasCoordinatesLinea400) {
      console.warn('⚠️ CoordinatesLinea400 non disponibile, uso solo FERMATE_COORDINATES');
    } else {
      console.log('✅ CoordinatesLinea400 disponibile, verifico coordinate per fermate prioritarie...');
    }

    // Prepara le fermate prioritarie con coordinate
    const priorityStopsWithCoords = availablePriorityStops.map(stopName => {
      const stopIndex = fermate.indexOf(stopName);
      let coords = null;
      let coordSource = 'none';
      
      // Prova prima con CoordinatesLinea400 (coordinate reali)
      if (hasCoordinatesLinea400) {
        const coordData = window.CoordinatesLinea400.get(stopName);
        if (coordData) {
          coords = { lat: coordData.lat, lon: coordData.lng };
          coordSource = 'CoordinatesLinea400';
          console.log(`✅ ${stopName} trovato in CoordinatesLinea400: (${coords.lat.toFixed(4)}, ${coords.lon.toFixed(4)})`);
        } else {
          console.log(`⚠️ CoordinatesLinea400.get("${stopName}") ha restituito null/undefined, uso FERMATE_COORDINATES`);
        }
      }
      
      // Fallback a FERMATE_COORDINATES
      if (!coords) {
        coords = FERMATE_COORDINATES[stopName];
        if (coords) {
          coordSource = 'FERMATE_COORDINATES';
        }
      }
      
      if (!coords || stopIndex === -1) {
        console.warn(`⚠️ Coordinate non trovate per "${stopName}" o indice non valido (${stopIndex})`);
        return null;
      }

      console.log(`📍 ${stopName}: (${coords.lat.toFixed(4)}, ${coords.lon.toFixed(4)}) [${coordSource}]`);

      return {
        name: stopName,
        index: stopIndex,
        coordinates: coords
      };
    }).filter(stop => stop !== null);

    if (priorityStopsWithCoords.length === 0) {
      return null;
    }

    // Calcola distanze reali lungo le strade usando OSRM
    let routeDistances = null;
    try {
      console.log('🛣️ Calcolo distanze reali per fermate prioritarie con OSRM...');
      console.log(`📍 Fermate da calcolare (${priorityStopsWithCoords.length}):`, 
        priorityStopsWithCoords.map(s => `${s.name} (${s.coordinates.lat.toFixed(4)}, ${s.coordinates.lon.toFixed(4)})`).join(', '));
      console.log(`📍 Posizione utente: (${userPos.latitude.toFixed(4)}, ${userPos.longitude.toFixed(4)})`);
      routeDistances = await getRouteDistances(userPos, priorityStopsWithCoords);
      if (routeDistances) {
        console.log('✅ Distanze OSRM calcolate:', routeDistances.map((d, i) => 
          `${priorityStopsWithCoords[i].name}: ${d !== null ? d.toFixed(2) + ' km' : 'null'}`).join(', '));
      }
    } catch (error) {
      console.warn('⚠️ Errore nel calcolo OSRM per fermate prioritarie, uso distanza in linea d\'aria:', error.message);
    }

    // Mappa le distanze alle fermate (OSRM se disponibile, altrimenti Haversine)
    const stopsWithDistance = priorityStopsWithCoords.map((stop, idx) => {
      let distance = null;
      let distanceType = 'none';
      
      if (routeDistances && routeDistances[idx] !== null && routeDistances[idx] !== undefined) {
        // Usa distanza OSRM (in km)
        distance = routeDistances[idx];
        distanceType = 'OSRM';
      } else if (stop.coordinates) {
        // Fallback alla distanza Haversine (in linea d'aria)
        distance = calculateDistance(
          userPos.latitude,
          userPos.longitude,
          stop.coordinates.lat,
          stop.coordinates.lon
        );
        distanceType = 'Haversine';
      }

      return {
        name: stop.name,
        index: stop.index,
        distance: distance,
        distanceType: distanceType
      };
    }).filter(stop => stop.distance !== null);

    if (stopsWithDistance.length === 0) {
      return null;
    }

    // Log delle distanze calcolate per debug
    console.log('📊 Distanze fermate prioritarie:');
    stopsWithDistance.forEach(stop => {
      console.log(`  - ${stop.name}: ${stop.distance.toFixed(2)} km (${stop.distanceType})`);
    });

    // Trova la fermata più vicina
    const nearest = stopsWithDistance.reduce((prev, current) => {
      if (!prev || !current || prev.distance === null || current.distance === null) {
        return prev || current;
      }
      return (prev.distance < current.distance) ? prev : current;
    });

    console.log(`✅ Fermata più vicina selezionata: ${nearest.name} (${nearest.distance.toFixed(2)} km, ${nearest.distanceType})`);

    return nearest;
  }

  /**
   * Determina il capolinea opposto basandosi sulla fermata di partenza
   * @param {string} partenzaName - Nome della fermata di partenza
   * @param {Array} fermate - Array di nomi fermate della linea
   * @returns {Object|null} {name, index} del capolinea opposto, o null
   */
  function getOppositeTerminus(partenzaName, fermate) {
    // Capolinea della linea Udine-Grado
    const udineIndex = fermate.indexOf('Udine');
    const gradoIndex = fermate.indexOf('Grado');

    if (udineIndex === -1 || gradoIndex === -1) {
      return null;
    }

    // Se la partenza è Udine, l'arrivo è Grado
    if (partenzaName === 'Udine') {
      return { name: 'Grado', index: gradoIndex };
    }
    
    // Se la partenza è Grado, l'arrivo è Udine
    if (partenzaName === 'Grado') {
      return { name: 'Udine', index: udineIndex };
    }

    // Per Palmanova e Cervignano FS, determina il capolinea in base alla posizione
    const partenzaIndex = fermate.indexOf(partenzaName);
    
    if (partenzaIndex === -1) {
      return null;
    }

    // Calcola la distanza dalla partenza ai due capolinea
    const distanzaDaUdine = Math.abs(partenzaIndex - udineIndex);
    const distanzaDaGrado = Math.abs(partenzaIndex - gradoIndex);

    // Se più vicino a Udine, arrivo = Grado
    if (distanzaDaUdine < distanzaDaGrado) {
      return { name: 'Grado', index: gradoIndex };
    }
    
    // Altrimenti, arrivo = Udine
    return { name: 'Udine', index: udineIndex };
  }

  /**
   * Auto-assegna solo la partenza basandosi sulla posizione GPS
   * Funziona solo per la linea Udine-Grado
   * Usa distanze reali lungo le strade (OSRM) per determinare la fermata più vicina
   * @param {Object} userPos - Posizione utente {latitude, longitude}
   * @returns {Promise<Object|null>} {name, index, distance} della fermata più vicina, o null se non possibile
   */
  async function autoAssignRoute(userPos) {
    // Verifica che RouteSelector e Tariffario siano disponibili
    if (!window.RouteSelector || !window.RouteSelector.getLineaIdx) {
      console.warn('⚠️ RouteSelector non disponibile per auto-assegnazione');
      return null;
    }

    // Ottieni la linea selezionata
    const lineaIdx = window.RouteSelector.getLineaIdx();
    
    // Verifica che una linea sia selezionata
    if (lineaIdx === '' || lineaIdx === null || lineaIdx === undefined) {
      console.log('ℹ️ Nessuna linea selezionata per auto-assegnazione');
      return null;
    }
    
    // Ottieni il tariffario
    let tariffario = [];
    if (typeof window.Tariffario !== 'undefined' && window.Tariffario.getData) {
      tariffario = window.Tariffario.getData();
    } else if (typeof window.tariffario !== 'undefined') {
      tariffario = window.tariffario;
    }

    if (!tariffario || !tariffario[lineaIdx]) {
      console.warn('⚠️ Tariffario non disponibile per auto-assegnazione');
      return null;
    }

    const linea = tariffario[lineaIdx];
    
    // Verifica che sia la linea Udine-Grado
    if (!linea.nome || (!linea.nome.includes('Udine-Grado') && !linea.nome.includes('400'))) {
      console.log('ℹ️ Auto-assegnazione disponibile solo per la linea Udine-Grado');
      return null;
    }

    const fermate = linea.fermate;
    
    if (!fermate || fermate.length === 0) {
      console.warn('⚠️ Fermate non disponibili per auto-assegnazione');
      return null;
    }

    // Trova la fermata più vicina tra quelle prioritarie (usa OSRM per distanze reali)
    const nearestStop = await findNearestPriorityStop(userPos, fermate);
    
    if (!nearestStop) {
      console.warn('⚠️ Impossibile trovare fermata prioritaria più vicina');
      return null;
    }

    // Restituisci solo la fermata più vicina (partenza)
    return {
      name: nearestStop.name,
      index: nearestStop.index,
      distance: nearestStop.distance
    };
  }

  /**
   * Gestisce il click del pulsante geolocalizzazione (home page)
   * Auto-assegna solo la partenza per la linea Udine-Grado
   * @returns {Promise<void>}
   */
  async function handleLocationClick() {
    const locationBtn = document.getElementById('location-btn');
    const locationIcon = document.getElementById('location-icon');
    const locationText = document.getElementById('location-text');

    if (!locationBtn) return;

    // Mostra stato di caricamento
    if (locationIcon) locationIcon.textContent = '⏳';
    if (locationText) locationText.textContent = 'Rilevamento...';
    locationBtn.disabled = true;

    try {
      // Richiedi posizione GPS
      const position = await requestUserLocation();
      userPosition = position;
      locationPermissionGranted = true;

      // Prova auto-assegnazione partenza (solo per linea Udine-Grado)
      // Usa distanze reali lungo le strade (OSRM)
      const nearestStop = await autoAssignRoute(position);

      if (nearestStop) {
        // Auto-assegna solo la partenza usando RouteSelector
        // Passa isAutoAssignment=true per non resettare il pulsante GPS
        if (window.RouteSelector && window.RouteSelector.selectFermata) {
          window.RouteSelector.selectFermata(nearestStop.index, 'partenza', true);

          // Aggiorna UI - mantieni testo neutro sul pulsante
          if (locationIcon) locationIcon.textContent = '📍';
          if (locationText) locationText.textContent = 'Rilevata';
          locationBtn.classList.add('active');

          // Mostra notifica di successo con solo la partenza
          const distanceText = nearestStop.distance.toFixed(1);
          showLocationNotification(
            `Partenza selezionata: ${nearestStop.name} (${distanceText} km)`,
            'success'
          );
        } else {
          console.warn('⚠️ RouteSelector non disponibile per auto-assegnazione');
          // Fallback: mostra notifica normale
          if (locationIcon) locationIcon.textContent = '📍';
          if (locationText) locationText.textContent = 'Rilevata';
          showLocationNotification('Posizione rilevata!', 'success');
        }
      } else {
        // Se non è possibile auto-assegnare (linea diversa o errore), comportamento normale
        // Aggiorna UI
        if (locationIcon) locationIcon.textContent = '📍';
        if (locationText) locationText.textContent = 'Rilevata';
        locationBtn.classList.add('active');

        // Mostra notifica di successo
        showLocationNotification('Posizione rilevata!', 'success');
      }

      // Salva preferenza
      const Storage = getStorage();
      Storage.setItem('tpl.locationEnabled', 'true');

    } catch (error) {
      console.error('❌ Errore geolocalizzazione:', error);

      // Determina il tipo di errore
      let errorMessage = 'Errore nel rilevamento della posizione';
      if (error.code === 1) {
        errorMessage = 'Permesso di geolocalizzazione negato. Abilita la posizione nelle impostazioni del browser.';
      } else if (error.code === 2) {
        errorMessage = 'Posizione non disponibile. Verifica la connessione GPS.';
      } else if (error.code === 3) {
        errorMessage = 'Timeout nel rilevamento. Riprova più tardi.';
      }

      // Mostra errore
      if (locationIcon) locationIcon.textContent = '❌';
      if (locationText) locationText.textContent = 'Errore rilevamento';

      // Mostra notifica di errore
      showLocationNotification(errorMessage, 'error');

      // Reset dopo 3 secondi
      setTimeout(() => {
        if (locationIcon) locationIcon.textContent = '📍';
        if (locationText) locationText.textContent = 'Rileva posizione';
        locationBtn.disabled = false;
        locationBtn.classList.remove('active');
      }, 3000);
    }
  }

  /**
   * Gestisce il click del pulsante geolocalizzazione nel modal fermate
   * @returns {Promise<void>}
   */
  async function handleFermateLocationClick() {
    const fermateLocationBtn = document.getElementById('fermate-location-btn');
    const fermateLocationIcon = document.getElementById('fermate-location-icon');
    const fermateLocationText = document.getElementById('fermate-location-text');
    const fermateModalList = document.getElementById('fermate-modal-list');

    if (!fermateLocationBtn) return;

    if (!isGeolocationSupported()) {
      showLocationNotification('Geolocalizzazione non supportata dal browser', 'error');
      return;
    }

    try {
      // Mostra stato di caricamento
      if (fermateLocationIcon) fermateLocationIcon.textContent = '⏳';
      if (fermateLocationText) fermateLocationText.textContent = 'Rilevamento...';
      fermateLocationBtn.disabled = true;

      // Richiedi posizione
      const position = await requestUserLocation();
      
      // 🐛 DEBUG: Verifica posizione ricevuta
      console.group('📍 DEBUG GEOLOCALIZZAZIONE');
      console.log('🔍 Posizione ricevuta da requestUserLocation:', position);
      
      if (!position || !position.latitude || !position.longitude) {
        console.error('❌ Posizione non valida:', position);
        console.groupEnd();
        throw new Error('Posizione non valida ricevuta');
      }
      
      userPosition = position;
      locationPermissionGranted = true;

      let cityName = null;
      try {
        cityName = await reverseGeocode(position.latitude, position.longitude);
        if (cityName) {
          console.log('🏙️ Località rilevata:', cityName);
        }
      } catch (reverseError) {
        console.warn('⚠️ Impossibile determinare la località:', reverseError);
      }

      console.log('✅ Posizione acquisita:', {
        latitudine: position.latitude,
        longitudine: position.longitude,
        precisione: `${position.accuracy.toFixed(2)} metri`,
        localita: cityName || 'Non disponibile'
      });
      console.groupEnd();

      // 🐛 DEBUG PANEL: Mostra nel pannello debug se disponibile
      if (window.GPSDebugPanel) {
        window.GPSDebugPanel.show();
        window.GPSDebugPanel.addLog('position', 'Posizione GPS Acquisita', {
          'Latitudine': position.latitude.toFixed(6),
          'Longitudine': position.longitude.toFixed(6),
          'Precisione': `${position.accuracy.toFixed(0)}m`,
          'Località': cityName || 'Non disponibile'
        });
      }

      // Verifica che il modale delle fermate sia effettivamente aperto (non il modale delle linee)
      const fermateModal = document.getElementById('fermate-modal');
      const lineeModal = document.getElementById('linee-modal');
      const isFermateModalOpen = fermateModal && fermateModal.classList.contains('show');
      const isLineeModalOpen = lineeModal && lineeModal.classList.contains('show');

      // Prova auto-assegnazione partenza solo se il modale delle fermate è aperto
      // (non fare auto-assegnazione se il modale delle linee è aperto)
      // Usa distanze reali lungo le strade (OSRM)
      let nearestStop = null;
      if (isFermateModalOpen && !isLineeModalOpen) {
        nearestStop = await autoAssignRoute(userPosition);
      }

      // Aggiorna UI - mantieni testo neutro sul pulsante
      if (fermateLocationIcon) fermateLocationIcon.textContent = '📍';
      if (fermateLocationText) fermateLocationText.textContent = 'Rilevata';
      
      if (nearestStop) {
        // Mostra notifica di successo con auto-assegnazione
        const distanceText = nearestStop.distance.toFixed(1);
        showLocationNotification(
          `Partenza selezionata: ${nearestStop.name} (${distanceText} km)`,
          'success'
        );
      } else {
        showLocationNotification('Posizione rilevata! Ordinando fermate per distanza...', 'success');
      }

      // Salva preferenza
      const Storage = getStorage();
      Storage.setItem('tpl.locationEnabled', 'true');

      // Ri-ordina le fermate per distanza usando il modal
      // Usa FermateModal.sortByDistance() se disponibile (preserva indici e event listener)
      if (window.FermateModal && window.FermateModal.sortByDistance) {
        const sorted = await window.FermateModal.sortByDistance(userPosition);
        if (sorted) {
          console.log('✅ Fermate ordinate per distanza nel modal');
        } else {
          console.warn('⚠️ Impossibile ordinare fermate (lista vuota o posizione non disponibile)');
        }
      } else {
        console.warn('⚠️ FermateModal.sortByDistance non disponibile, fallback manuale');
        // Fallback: riordina manualmente (meno ottimale)
        if (fermateModalList && fermateModalList.children.length > 0) {
          const fermate = Array.from(fermateModalList.children).map(li => ({
            name: li.textContent.trim(),
            index: li.dataset.index ? parseInt(li.dataset.index, 10) : null
          }));
          const sortedFermate = await sortFermateByDistance(fermate.map(f => f.name), userPosition);

          // Re-renderizza la lista ordinata mantenendo gli indici
          // NOTA: Questo è un fallback che non dovrebbe essere necessario
          // Il modal dovrebbe gestire il rendering attraverso FermateModal.sortByDistance()
          console.warn('⚠️ Usando fallback manuale per ordinamento fermate (non dovrebbe essere necessario)');
          // Il rendering corretto è gestito da FermateModal.sortByDistance() che chiama renderFermateList()
          // Questo codice non viene eseguito se FermateModal è disponibile
        }
      }

      // NOTA: Non chiudiamo automaticamente il modale dopo il rilevamento
      // L'utente può vedere le fermate ordinate per distanza e selezionare manualmente
      // Se la partenza è stata auto-assegnata, l'utente può comunque vedere la lista
      // e selezionare una fermata diversa se necessario

    } catch (error) {
      console.error('❌ Errore geolocalizzazione modal:', error);

      // Reset UI
      if (fermateLocationIcon) fermateLocationIcon.textContent = '❌';
      if (fermateLocationText) fermateLocationText.textContent = 'Errore';

      // Gestisci errori specifici
      let errorMessage = 'Errore durante il rilevamento della posizione';
      if (error.code === 1) {
        errorMessage = 'Permesso di geolocalizzazione negato';
      } else if (error.code === 2) {
        errorMessage = 'Posizione non disponibile';
      } else if (error.code === 3) {
        errorMessage = 'Timeout durante il rilevamento';
      }

      showLocationNotification(errorMessage, 'error');

      // Reset dopo 3 secondi
      setTimeout(() => {
        if (fermateLocationIcon) fermateLocationIcon.textContent = '📍';
        if (fermateLocationText) fermateLocationText.textContent = 'Rileva';
        fermateLocationBtn.disabled = false;
      }, 3000);
    }
  }

  /**
   * Restituisce il messaggio di errore per un codice errore
   * @param {number} errorCode - Codice errore geolocalizzazione
   * @returns {string} Messaggio di errore
   */
  function getErrorMessage(errorCode) {
    const messages = {
      1: 'Permesso di geolocalizzazione negato',
      2: 'Posizione non disponibile',
      3: 'Timeout durante il rilevamento',
      0: 'Errore sconosciuto'
    };
    return messages[errorCode] || messages[0];
  }

  /**
   * Inizializza il modulo
   */
  function init() {
    // Ripristina preferenza se presente
    const Storage = getStorage();
    const locationEnabled = Storage.getItem('tpl.locationEnabled');
    if (locationEnabled === 'true') {
      // Mostra pulsante geolocalizzazione se supportato
      toggleLocationButton(true);
    }

    console.log('✅ Modulo Geolocation inizializzato');
  }

  // API pubblica
  window.Geolocation = {
    // Funzioni di calcolo
    calculateDistance: calculateDistance,
    sortFermateByDistance: sortFermateByDistance,

    // Funzioni di richiesta posizione
    requestUserLocation: requestUserLocation,
    isGeolocationSupported: isGeolocationSupported,

    // Funzioni UI
    toggleLocationButton: toggleLocationButton,
    updateLocationButtonIcon: updateLocationButtonIcon,
    showLocationNotification: showLocationNotification,
    disableLocationSorting: disableLocationSorting,
    resetLocationButtonUI: resetLocationButtonUI,
    resetLocationState: resetLocationState,

    // Gestione eventi
    handleLocationClick: handleLocationClick,
    handleFermateLocationClick: handleFermateLocationClick,

    // Utility
    getErrorMessage: getErrorMessage,

    // Getter stato
    getUserPosition: function () { return userPosition; },
    isPermissionGranted: function () { return locationPermissionGranted; },

    // Inizializzazione
    init: init
  };

  // Esponi funzioni globali per retrocompatibilità (onclick nell'HTML)
  window.toggleLocationButton = toggleLocationButton;
  window.requestUserLocation = requestUserLocation;
  window.sortFermateByDistance = sortFermateByDistance;
  window.isGeolocationSupported = isGeolocationSupported;
  window.handleLocationClick = handleLocationClick;
  window.handleFermateLocationClick = handleFermateLocationClick;
  window.disableLocationSorting = disableLocationSorting;
  window.resetLocationButtonUI = resetLocationButtonUI;
  window.resetLocationState = resetLocationState;
  window.showLocationNotification = showLocationNotification;
  window.updateLocationButtonIcon = updateLocationButtonIcon;

  // Inizializza quando il DOM è pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  console.log('✅ Modulo geolocation.js caricato');
})();

