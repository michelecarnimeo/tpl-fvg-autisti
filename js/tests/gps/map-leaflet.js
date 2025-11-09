/**
 * js/tests/gps/map-leaflet.js
 *
 * Gestione mappa Leaflet per visualizzazione posizione GPS
 * Inizializza e aggiorna mappa interattiva con marker e cerchio accuratezza
 *
 * Funzionalità:
 * - Inizializzazione mappa Leaflet
 * - Marker posizione
 * - Cerchio accuratezza GPS
 * - Badge connessione mappa
 * - Pulsante ricentra mappa
 * - Aggiornamento posizione dinamico
 *
 * API Pubblica: window.GPSMap
 * Dipendenze: Leaflet.js (CDN), window.GPSHelpers
 */

(function () {
  'use strict';

  // Verifica dipendenze
  if (typeof L === 'undefined') {
    console.warn('⚠️ Leaflet.js non disponibile - La mappa non funzionerà');
  }

  // Stato privato
  let map = null;
  let marker = null;
  let accuracyCircle = null;
  let currentMapPosition = null;

  /**
   * Verifica se la mappa è inizializzata
   * @returns {boolean} true se inizializzata, false altrimenti
   */
  function isMapInitialized() {
    return map !== null;
  }

  /**
   * Inizializza o aggiorna mappa Leaflet
   * @param {number} lat - Latitudine
   * @param {number} lng - Longitudine
   * @param {number} accuracy - Accuratezza in metri
   */
  function initializeMap(lat, lng, accuracy) {
    const mapContainer = document.getElementById('map-container');
    const mapElement = document.getElementById('map');

    if (!mapContainer || !mapElement) {
      console.warn('⚠️ Elementi mappa non trovati');
      return;
    }

    // Verifica Leaflet disponibile
    if (typeof L === 'undefined') {
      console.error('❌ Leaflet.js non disponibile');
      return;
    }

    // Mostra container mappa
    mapContainer.style.display = 'block';

    // Se la mappa non esiste, creala
    if (!map) {
      // Crea mappa centrata sulla posizione
      map = L.map('map').setView([lat, lng], 15);

      // Aggiungi tile layer OpenStreetMap
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
        minZoom: 3
      }).addTo(map);

      // Aggiungi marker posizione
      marker = L.marker([lat, lng]).addTo(map);
      marker.bindPopup(`
        <div style="text-align: center;">
          <strong style="color: #3b82f6;">📍 La tua posizione</strong><br>
          <span style="font-size: 0.85rem; color: #666;">
            ${lat.toFixed(6)}, ${lng.toFixed(6)}
          </span>
        </div>
      `);

      // Aggiungi cerchio accuratezza
      accuracyCircle = L.circle([lat, lng], {
        radius: accuracy,
        color: '#3b82f6',
        fillColor: '#3b82f6',
        fillOpacity: 0.15,
        weight: 2
      }).addTo(map);

      // Zoom automatico per mostrare tutto il cerchio
      const bounds = accuracyCircle.getBounds();
      map.fitBounds(bounds, { padding: [50, 50] });

      // Setup pulsante ricentra
      const recenterBtn = document.getElementById('recenter-map-btn');
      if (recenterBtn) {
        // Rimuovi listener precedenti se esistono
        const newRecenterBtn = recenterBtn.cloneNode(true);
        recenterBtn.parentNode.replaceChild(newRecenterBtn, recenterBtn);

        newRecenterBtn.addEventListener('click', () => {
          recenterMap();
        });
      }

      console.log('🗺️ Mappa Leaflet inizializzata');
    } else {
      // Mappa esiste già, aggiorna posizione
      updateMapPosition(lat, lng, accuracy);
    }

    // Salva posizione corrente
    currentMapPosition = { lat, lng };

    // Fix per render issues (forza ridisegno)
    setTimeout(() => {
      if (map) {
        map.invalidateSize();
      }
    }, 100);
  }

  /**
   * Aggiorna posizione sulla mappa
   * @param {number} lat - Latitudine
   * @param {number} lng - Longitudine
   * @param {number} accuracy - Accuratezza in metri
   */
  function updateMapPosition(lat, lng, accuracy) {
    if (!map) {
      console.warn('⚠️ Mappa non inizializzata');
      return;
    }

    // Aggiorna view
    map.setView([lat, lng], 15, { animate: true });

    // Aggiorna marker
    if (marker) {
      marker.setLatLng([lat, lng]);
      marker.setPopupContent(`
        <div style="text-align: center;">
          <strong style="color: #3b82f6;">📍 La tua posizione</strong><br>
          <span style="font-size: 0.85rem; color: #666;">
            ${lat.toFixed(6)}, ${lng.toFixed(6)}
          </span>
        </div>
      `);
    }

    // Aggiorna cerchio accuratezza
    if (accuracyCircle) {
      accuracyCircle.setLatLng([lat, lng]);
      accuracyCircle.setRadius(accuracy);
    }

    // Zoom automatico
    if (accuracyCircle) {
      const bounds = accuracyCircle.getBounds();
      map.fitBounds(bounds, { padding: [50, 50] });
    }

    // Salva posizione corrente
    currentMapPosition = { lat, lng };
  }

  /**
   * Ricentra mappa sulla posizione corrente
   */
  function recenterMap() {
    if (!map || !currentMapPosition) {
      console.warn('⚠️ Mappa o posizione corrente non disponibili');
      return;
    }

    map.setView([currentMapPosition.lat, currentMapPosition.lng], 15, {
      animate: true,
      duration: 0.5
    });

    console.log('🎯 Mappa ricentrata');
  }

  /**
   * Distrugge mappa (cleanup)
   */
  function destroyMap() {
    if (map) {
      map.remove();
      map = null;
      marker = null;
      accuracyCircle = null;
      currentMapPosition = null;
      console.log('🗑️ Mappa distrutta');
    }
  }

  /**
   * Aggiorna stato connessione mappa
   */
  function updateMapConnectionStatus() {
    const mapBadge = document.getElementById('map-connection-badge');
    const mapIcon = document.getElementById('map-connection-icon');
    const mapText = document.getElementById('map-connection-text');

    // Se elementi non esistono ancora, riprova tra poco
    if (!mapBadge || !mapIcon || !mapText) {
      setTimeout(updateMapConnectionStatus, 100);
      return;
    }

    // Controlla sia navigator.onLine che simulazione offline
    const offlineTest = localStorage.getItem('tpl.offlineTestMode') === 'true';
    const isOnline = navigator.onLine && !offlineTest;

    if (isOnline) {
      // Online
      mapBadge.style.background = 'linear-gradient(135deg, #d1fae5, #a7f3d0)';
      mapBadge.style.color = '#065f46';
      mapBadge.title = '✅ Connessione attiva - Mappa disponibile';
      mapIcon.textContent = '🟢';
      mapText.textContent = 'Online';
    } else {
      // Offline
      mapBadge.style.background = 'linear-gradient(135deg, #fecaca, #fca5a5)';
      mapBadge.style.color = '#7f1d1d';
      mapBadge.title = '🔴 Nessuna connessione - Tile mappa non disponibili (GPS continua a funzionare)';
      mapIcon.textContent = '🔴';
      mapText.textContent = offlineTest ? 'Offline (simulato)' : 'Offline';
    }
  }

  /**
   * Setup badge connessione mappa
   */
  function setupMapConnectionBadge() {
    // Aggiorna stato iniziale
    updateMapConnectionStatus();

    // Listener eventi online/offline (nativi)
    window.addEventListener('online', updateMapConnectionStatus);
    window.addEventListener('offline', updateMapConnectionStatus);

    // Listener evento simulazione offline (custom)
    window.addEventListener('offlineTestModeChanged', () => {
      console.log('📡 Evento offlineTestModeChanged ricevuto - Aggiorno badge mappa');
      // Piccolo delay per dare tempo a localStorage di aggiornarsi
      setTimeout(updateMapConnectionStatus, 50);
    });
  }

  // API Pubblica
  window.GPSMap = {
    initialize: initializeMap,
    updatePosition: updateMapPosition,
    setupConnectionBadge: setupMapConnectionBadge,
    updateConnectionStatus: updateMapConnectionStatus,
    recenter: recenterMap,
    destroy: destroyMap,
    isInitialized: isMapInitialized,
    getCurrentPosition: () => currentMapPosition
  };

  console.log('✅ js/tests/gps/map-leaflet.js caricato - GPSMap disponibile');

  // Auto-inizializza badge connessione se DOM è già caricato
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setupMapConnectionBadge();
    });
  } else {
    // DOM già caricato
    setupMapConnectionBadge();
  }

})();

