/**
 * js/tests/gps/watch-position.js
 *
 * Monitoraggio continuo posizione GPS
 * Gestisce watchPosition per monitorare posizione in tempo reale
 *
 * Funzionalità:
 * - Avvio/fermata monitoraggio continuo
 * - Calcolo distanza totale percorsa
 * - Cronologia posizioni (max 5)
 * - Aggiornamento UI (contatore, ultima posizione, distanza)
 * - Integrazione con GPSMap per aggiornare mappa
 * - Integrazione con GPSDistanceCalculator per calcolare distanza
 * - Supporto fake position (usa GPSFakePosition se disponibile)
 *
 * API Pubblica: window.GPSWatchPosition
 * Dipendenze: window.GPSHelpers.calculateDistance, window.GPSMap, window.GPSFakePosition
 */

(function () {
  'use strict';

  // Stato privato
  let watchId = null;
  let watchActive = false;
  let watchCount = 0;
  let watchHistory = [];
  let watchTotalDistance = 0; // in metri
  let watchLastPosition = null;

  // Callback personalizzati
  let onPositionUpdate = null;
  let onError = null;

  /**
   * Verifica se fake position è attiva
   * @returns {boolean} true se fake position è attiva, false altrimenti
   */
  function isFakePositionActive() {
    if (typeof window.GPSFakePosition !== 'undefined' && window.GPSFakePosition.isActive) {
      return window.GPSFakePosition.isActive();
    }
    return false;
  }

  /**
   * Ottieni posizione fake se attiva
   * @returns {Object|null} Oggetto Position fake o null
   */
  function getFakePosition() {
    if (typeof window.GPSFakePosition !== 'undefined' && window.GPSFakePosition.get) {
      return window.GPSFakePosition.get();
    }
    return null;
  }

  /**
   * Calcola distanza tra due posizioni
   * @param {Object} pos1 - Prima posizione
   * @param {Object} pos2 - Seconda posizione
   * @returns {number} Distanza in metri
   */
  function calculateDistanceBetweenPositions(pos1, pos2) {
    if (!pos1 || !pos2 || !pos1.coords || !pos2.coords) {
      return 0;
    }

    // Usa GPSHelpers se disponibile
    if (typeof window.GPSHelpers !== 'undefined' && window.GPSHelpers.calculateDistance) {
      const distanceKm = window.GPSHelpers.calculateDistance(
        pos1.coords.latitude,
        pos1.coords.longitude,
        pos2.coords.latitude,
        pos2.coords.longitude
      );
      return distanceKm * 1000; // Converti km in metri
    }

    // Fallback: formula Haversine
    const R = 6371e3; // Raggio Terra in metri
    const lat1 = pos1.coords.latitude * Math.PI / 180;
    const lat2 = pos2.coords.latitude * Math.PI / 180;
    const dLat = (pos2.coords.latitude - pos1.coords.latitude) * Math.PI / 180;
    const dLng = (pos2.coords.longitude - pos1.coords.longitude) * Math.PI / 180;

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  /**
   * Gestisce aggiornamento posizione
   * @param {Object} position - Oggetto Position
   */
  function handlePositionUpdate(position) {
    watchCount++;

    // Aggiorna contatore UI
    const countElement = document.getElementById('watch-count');
    if (countElement) {
      countElement.textContent = watchCount;
      countElement.style.animation = 'pulse 0.3s ease';
      setTimeout(() => {
        countElement.style.animation = '';
      }, 300);
    }

    // Calcola distanza se c'è una posizione precedente
    if (watchLastPosition) {
      const distance = calculateDistanceBetweenPositions(watchLastPosition, position);
      watchTotalDistance += distance;

      // Aggiorna UI distanza
      const distanceElement = document.getElementById('watch-distance');
      const distanceValue = document.getElementById('watch-distance-value');
      if (distanceElement && distanceValue) {
        distanceElement.style.display = 'block';
        const distanceText = watchTotalDistance >= 1000
          ? (watchTotalDistance / 1000).toFixed(2) + ' km'
          : Math.round(watchTotalDistance) + ' metri';
        
        // Aggiorna elemento (gestisce caso in cui l'elemento viene ricreato)
        const parent = distanceValue.parentElement;
        if (parent) {
          parent.innerHTML = watchTotalDistance >= 1000
            ? '<span id="watch-distance-value">' + (watchTotalDistance / 1000).toFixed(2) + '</span> km'
            : '<span id="watch-distance-value">' + Math.round(watchTotalDistance) + '</span> metri';
        }
      }
    }

    // Salva posizione corrente
    watchLastPosition = position;

    // Aggiorna ultima posizione UI
    const lastPositionData = document.getElementById('watch-last-position-data');
    if (lastPositionData) {
      const coords = position.coords;
      const timestamp = new Date(position.timestamp).toLocaleTimeString('it-IT');
      const speedKmh = coords.speed !== null ? (coords.speed * 3.6).toFixed(1) : 'N/A';

      lastPositionData.innerHTML = `
        <strong style="color: #3b82f6;">${coords.latitude.toFixed(6)}, ${coords.longitude.toFixed(6)}</strong><br>
        <span style="font-size: 0.85rem;">
          ⏰ ${timestamp} | 
          🎯 ±${Math.round(coords.accuracy)}m | 
          🚗 ${speedKmh} km/h
        </span>
      `;
    }

    // Aggiungi a cronologia (max 5)
    watchHistory.unshift({
      position: position,
      timestamp: Date.now()
    });
    if (watchHistory.length > 5) {
      watchHistory.pop();
    }

    // Aggiorna cronologia UI
    updateHistoryUI();

    // Aggiorna mappa usando GPSMap
    if (typeof window.GPSMap !== 'undefined' && window.GPSMap.updatePosition) {
      window.GPSMap.updatePosition(position.coords.latitude, position.coords.longitude, position.coords.accuracy);
    }

    // Aggiorna GPSDistanceCalculator
    if (typeof window.GPSDistanceCalculator !== 'undefined' && window.GPSDistanceCalculator.setLastPosition) {
      window.GPSDistanceCalculator.setLastPosition(position);
    }

    // Callback personalizzato
    if (onPositionUpdate && typeof onPositionUpdate === 'function') {
      try {
        onPositionUpdate(position, {
          count: watchCount,
          totalDistance: watchTotalDistance,
          history: watchHistory
        });
      } catch (error) {
        console.warn('⚠️ Errore callback onPositionUpdate:', error);
      }
    }

    console.log('🧭 Watch Position aggiornamento #' + watchCount, {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
      accuracy: position.coords.accuracy + 'm'
    });
  }

  /**
   * Gestisce errori watchPosition
   * @param {Object} error - Oggetto errore
   */
  function handlePositionError(error) {
    console.error('❌ Watch Position errore:', error);

    // Callback personalizzato
    if (onError && typeof onError === 'function') {
      try {
        onError(error);
      } catch (err) {
        console.warn('⚠️ Errore callback onError:', err);
      }
    }

    // Ferma monitoraggio in caso di errore
    stop();
  }

  /**
   * Aggiorna UI cronologia
   */
  function updateHistoryUI() {
    const historyList = document.getElementById('watch-history-list');
    if (!historyList) return;

    historyList.innerHTML = '';

    watchHistory.forEach((item, index) => {
      const coords = item.position.coords;
      const time = new Date(item.timestamp).toLocaleTimeString('it-IT');

      const historyItem = document.createElement('div');
      historyItem.style.cssText = 'padding: 0.75rem; background: white; border-radius: 8px; border-left: 3px solid #3b82f6; font-size: 0.9rem; margin-bottom: 0.5rem;';
      historyItem.innerHTML = `
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.25rem;">
          <strong style="color: #1e40af;">#${watchCount - index}</strong>
          <span style="color: #666; font-size: 0.85rem;">${time}</span>
        </div>
        <div style="color: #374151; font-size: 0.85rem;">
          📍 ${coords.latitude.toFixed(6)}, ${coords.longitude.toFixed(6)}<br>
          🎯 Accuratezza: ±${Math.round(coords.accuracy)}m
        </div>
      `;

      historyList.appendChild(historyItem);
    });
  }

  /**
   * Avvia monitoraggio continuo
   * @param {Object} options - Opzioni per watchPosition
   * @returns {boolean} true se avviato, false altrimenti
   */
  function start(options = {}) {
    if (watchActive) {
      console.warn('⚠️ Watch Position già attivo');
      return false;
    }

    if (!navigator.geolocation) {
      console.error('❌ Geolocalizzazione non supportata dal browser');
      if (onError) {
        onError(new Error('Geolocalizzazione non supportata dal browser'));
      }
      return false;
    }

    // Reset contatori
    watchCount = 0;
    watchTotalDistance = 0;
    watchHistory = [];
    watchLastPosition = null;

    // Opzioni di default
    const watchOptions = {
      enableHighAccuracy: options.enableHighAccuracy !== undefined ? options.enableHighAccuracy : true,
      maximumAge: options.maximumAge !== undefined ? options.maximumAge : 0,
      timeout: options.timeout !== undefined ? options.timeout : 10000
    };

    // Verifica se usare fake position
    if (isFakePositionActive()) {
      const fakePos = getFakePosition();
      if (fakePos) {
        console.log('🎭 Watch Position usa posizione fake');
        // Simula watchPosition con fake position
        // Per semplicità, emula un aggiornamento ogni 2 secondi
        const fakeWatchInterval = setInterval(() => {
          if (!watchActive) {
            clearInterval(fakeWatchInterval);
            return;
          }
          // Crea nuova posizione fake leggermente diversa (simula movimento)
          const newFakePos = {
            coords: {
              ...fakePos.coords,
              latitude: fakePos.coords.latitude + (Math.random() - 0.5) * 0.0001,
              longitude: fakePos.coords.longitude + (Math.random() - 0.5) * 0.0001,
              timestamp: Date.now()
            },
            timestamp: Date.now()
          };
          handlePositionUpdate(newFakePos);
        }, 2000);

        // Salva ID fake come watchId (negativo per distinguerlo)
        watchId = -fakeWatchInterval;
        watchActive = true;
        updateUI();
        console.log('▶️ Watch Position AVVIATO (fake position)');
        return true;
      }
    }

    // Usa GPS reale
    watchId = navigator.geolocation.watchPosition(
      handlePositionUpdate,
      handlePositionError,
      watchOptions
    );

    watchActive = true;
    updateUI();

    console.log('▶️ Watch Position AVVIATO (ID: ' + watchId + ')');
    return true;
  }

  /**
   * Ferma monitoraggio continuo
   */
  function stop() {
    if (!watchActive) {
      return;
    }

    // Se è fake watch (ID negativo), ferma intervallo
    if (watchId < 0) {
      clearInterval(-watchId);
    } else if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
    }

    watchId = null;
    watchActive = false;
    updateUI();

    console.log('⏹️ Watch Position FERMATO');
  }

  /**
   * Aggiorna UI stato
   */
  function updateUI() {
    const toggleBtn = document.getElementById('toggle-watch-btn');
    const statusCard = document.getElementById('watch-status-card');
    const historySection = document.getElementById('watch-history');

    if (toggleBtn) {
      if (watchActive) {
        toggleBtn.innerHTML = '⏸️ Ferma';
        toggleBtn.style.background = '#ef4444';
      } else {
        toggleBtn.innerHTML = '▶️ Avvia';
        toggleBtn.style.background = '#3b82f6';
      }
    }

    if (statusCard) {
      statusCard.style.display = watchActive ? 'block' : 'none';
    }

    if (historySection) {
      historySection.style.display = watchActive ? 'block' : 'none';
    }
  }

  /**
   * Cancella cronologia
   */
  function clearHistory() {
    watchHistory = [];
    updateHistoryUI();
    console.log('🗑️ Cronologia cancellata');
  }

  /**
   * Reset completo (stop + clear)
   */
  function reset() {
    stop();
    watchCount = 0;
    watchTotalDistance = 0;
    watchHistory = [];
    watchLastPosition = null;
    updateHistoryUI();
    console.log('🔄 Watch Position reset completo');
  }

  /**
   * Setup event listeners
   */
  function setup() {
    try {
      const toggleBtn = document.getElementById('toggle-watch-btn');
      const clearHistoryBtn = document.getElementById('clear-watch-history-btn');

      if (toggleBtn && toggleBtn.parentNode) {
        // Rimuovi listener precedenti se esistono
        const newToggleBtn = toggleBtn.cloneNode(true);
        toggleBtn.parentNode.replaceChild(newToggleBtn, toggleBtn);

        newToggleBtn.addEventListener('click', () => {
          if (!watchActive) {
            start();
          } else {
            stop();
          }
        });
      }

      if (clearHistoryBtn && clearHistoryBtn.parentNode) {
        // Rimuovi listener precedenti se esistono
        const newClearBtn = clearHistoryBtn.cloneNode(true);
        clearHistoryBtn.parentNode.replaceChild(newClearBtn, clearHistoryBtn);

        newClearBtn.addEventListener('click', () => {
          if (confirm('🗑️ Cancellare la cronologia delle posizioni?')) {
            clearHistory();
          }
        });
      }
    } catch (error) {
      console.warn('⚠️ Errore setup GPSWatchPosition:', error);
    }
  }

  // API Pubblica
  window.GPSWatchPosition = {
    setup: setup,
    start: start,
    stop: stop,
    reset: reset,
    clearHistory: clearHistory,
    isActive: () => watchActive,
    getCount: () => watchCount,
    getTotalDistance: () => watchTotalDistance,
    getHistory: () => [...watchHistory], // Copia array per sicurezza
    getLastPosition: () => watchLastPosition,
    setOnPositionUpdate: (callback) => { onPositionUpdate = callback; },
    setOnError: (callback) => { onError = callback; }
  };

  console.log('✅ js/tests/gps/watch-position.js caricato - GPSWatchPosition disponibile');

  // Auto-inizializza se DOM è già caricato
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setup();
    });
  } else {
    // DOM già caricato
    setup();
  }

})();

