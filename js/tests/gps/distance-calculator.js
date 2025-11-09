/**
 * js/tests/gps/distance-calculator.js
 *
 * Calcolatore distanza tra coordinate GPS
 * Calcola distanza e stima tempi di percorrenza
 *
 * Funzionalità:
 * - Calcolo distanza tra coordinate (usa GPSHelpers)
 * - Stima tempo di percorrenza (piedi/bus/auto)
 * - Formattazione tempo
 * - Calcolatore distanza a target
 * - Preset città
 *
 * API Pubblica: window.GPSDistanceCalculator
 * Dipendenze: window.GPSHelpers.calculateDistance
 */

(function () {
  'use strict';

  // Verifica dipendenze
  if (typeof window.GPSHelpers === 'undefined' || !window.GPSHelpers.calculateDistance) {
    console.error('❌ GPSHelpers.calculateDistance non disponibile - Il modulo distance-calculator non funzionerà correttamente');
    // Non facciamo return per permettere al modulo di essere caricato comunque
    // Le funzioni che usano GPSHelpers falliranno gracefully
  }

  // Stato privato
  let lastKnownPosition = null;

  // Velocità medie per stima tempo
  const SPEEDS = {
    walking: 5,   // km/h a piedi
    car: 50,      // km/h in città
    bus: 30       // km/h autobus urbano
  };

  /**
   * Calcola tempo stimato basato su distanza
   * @param {number} distanceKm - Distanza in chilometri
   * @returns {Object} Oggetto con tempi in minuti { walk, car, bus }
   */
  function estimateTime(distanceKm) {
    const walkMinutes = Math.round((distanceKm / SPEEDS.walking) * 60);
    const carMinutes = Math.round((distanceKm / SPEEDS.car) * 60);
    const busMinutes = Math.round((distanceKm / SPEEDS.bus) * 60);

    return { walk: walkMinutes, car: carMinutes, bus: busMinutes };
  }

  /**
   * Formatta tempo in ore e minuti
   * @param {number} minutes - Minuti
   * @returns {string} Tempo formattato (es. "30 min" o "1h 30min")
   */
  function formatTime(minutes) {
    if (minutes < 60) {
      return `${minutes} min`;
    } else {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
    }
  }

  /**
   * Calcola distanza a target e mostra risultato
   * @param {number} targetLat - Latitudine target
   * @param {number} targetLng - Longitudine target
   * @param {string} targetName - Nome target (per display)
   * @returns {Object|null} Risultato calcolo o null se errore
   */
  function calculateDistanceToTarget(targetLat, targetLng, targetName) {
    if (!lastKnownPosition) {
      const distanceInfo = document.getElementById('distance-info');
      if (distanceInfo) {
        distanceInfo.innerHTML = `
          <div style="color: var(--rosso);">
            <strong>❌ Errore:</strong><br>
            Devi prima rilevare la tua posizione GPS
          </div>
        `;
      }
      const distanceResult = document.getElementById('distance-result');
      if (distanceResult) {
        distanceResult.style.display = 'block';
      }
      return null;
    }

    const myLat = lastKnownPosition.coords.latitude;
    const myLng = lastKnownPosition.coords.longitude;

    // Calcola distanza usando GPSHelpers (verifica disponibilità)
    if (typeof window.GPSHelpers === 'undefined' || !window.GPSHelpers.calculateDistance) {
      console.error('❌ GPSHelpers.calculateDistance non disponibile');
      if (distanceInfo) {
        distanceInfo.innerHTML = `
          <div style="color: var(--rosso);">
            <strong>❌ Errore:</strong><br>
            GPSHelpers.calculateDistance non disponibile. Verifica che il modulo helpers.js sia caricato.
          </div>
        `;
      }
      if (distanceResult) {
        distanceResult.style.display = 'block';
      }
      return null;
    }

    const distanceKm = window.GPSHelpers.calculateDistance(myLat, myLng, targetLat, targetLng);
    const distanceM = distanceKm * 1000;

    // Calcola tempi stimati
    const times = estimateTime(distanceKm);

    // Formato distanza
    let distanceText = '';
    if (distanceKm < 1) {
      distanceText = `${Math.round(distanceM)} metri`;
    } else {
      distanceText = `${distanceKm.toFixed(2)} km`;
    }

    // Mostra risultato
    const distanceInfo = document.getElementById('distance-info');
    const distanceResult = document.getElementById('distance-result');

    if (distanceInfo) {
      distanceInfo.innerHTML = `
        <div style="margin-bottom: 1rem;">
          <strong style="font-size: 1.2rem; color: #f59e0b;">📏 ${distanceText}</strong>
          <br>
          <span style="color: #666; font-size: 0.9rem;">distanza in linea d'aria da ${targetName}</span>
        </div>
        
        <div style="background: #fef3c7; padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
          <strong style="color: #92400e;">🎯 Da:</strong> ${myLat.toFixed(6)}, ${myLng.toFixed(6)}<br>
          <strong style="color: #92400e;">🎯 A:</strong> ${targetLat.toFixed(6)}, ${targetLng.toFixed(6)}
        </div>
        
        <div style="margin-bottom: 0.5rem;">
          <strong style="color: #374151;">⏱️ Tempo Stimato:</strong>
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); gap: 0.75rem;">
          <div style="background: #e0f2fe; padding: 0.75rem; border-radius: 8px; text-align: center;">
            <div style="font-size: 1.5rem;">🚶</div>
            <div style="font-size: 0.85rem; color: #075985; margin-top: 0.25rem;">
              <strong>${formatTime(times.walk)}</strong><br>
              <span style="font-size: 0.75rem;">a piedi</span>
            </div>
          </div>
          <div style="background: #dbeafe; padding: 0.75rem; border-radius: 8px; text-align: center;">
            <div style="font-size: 1.5rem;">🚌</div>
            <div style="font-size: 0.85rem; color: #1e40af; margin-top: 0.25rem;">
              <strong>${formatTime(times.bus)}</strong><br>
              <span style="font-size: 0.75rem;">in bus</span>
            </div>
          </div>
          <div style="background: #dcfce7; padding: 0.75rem; border-radius: 8px; text-align: center;">
            <div style="font-size: 1.5rem;">🚗</div>
            <div style="font-size: 0.85rem; color: #166534; margin-top: 0.25rem;">
              <strong>${formatTime(times.car)}</strong><br>
              <span style="font-size: 0.75rem;">in auto</span>
            </div>
          </div>
        </div>
        
        <div style="margin-top: 1rem; padding: 0.75rem; background: #f3f4f6; border-radius: 6px; font-size: 0.85rem; color: #6b7280;">
          💡 <strong>Nota:</strong> I tempi sono stime indicative basate su velocità medie. Il tempo reale può variare per traffico, percorso e condizioni stradali.
        </div>
      `;
    }

    if (distanceResult) {
      distanceResult.style.display = 'block';
      distanceResult.style.borderLeftColor = '#10b981';
      distanceResult.style.background = 'rgba(16, 185, 129, 0.1)';
    }

    return {
      distanceKm: distanceKm,
      distanceM: distanceM,
      distanceText: distanceText,
      times: times,
      from: { lat: myLat, lng: myLng },
      to: { lat: targetLat, lng: targetLng },
      targetName: targetName
    };
  }

  /**
   * Imposta ultima posizione nota
   * @param {Object} position - Oggetto Position
   */
  function setLastPosition(position) {
    lastKnownPosition = position;
  }

  /**
   * Ottieni ultima posizione nota
   * @returns {Object|null} Oggetto Position o null
   */
  function getLastPosition() {
    return lastKnownPosition;
  }

  /**
   * Setup event listeners per calcolatore distanza
   */
  function setupDistanceCalculator() {
    const distanceCalculator = document.getElementById('distance-calculator');
    const calculateBtn = document.getElementById('calculate-distance-btn');
    const targetLatInput = document.getElementById('target-lat');
    const targetLngInput = document.getElementById('target-lng');
    const presetButtons = document.querySelectorAll('.distance-preset-btn');
    const distanceResult = document.getElementById('distance-result');
    const distanceInfo = document.getElementById('distance-info');

    if (!distanceCalculator || !calculateBtn) {
      console.warn('⚠️ Elementi UI distance calculator non trovati');
      return;
    }

    // Preset città buttons
    presetButtons.forEach(btn => {
      btn.addEventListener('click', function () {
        const lat = parseFloat(this.getAttribute('data-lat'));
        const lng = parseFloat(this.getAttribute('data-lng'));
        const name = this.getAttribute('data-name') || 'Preset';

        if (isNaN(lat) || isNaN(lng)) {
          console.warn('⚠️ Preset non valido:', { lat, lng });
          return;
        }

        // Popola inputs
        if (targetLatInput) targetLatInput.value = lat;
        if (targetLngInput) targetLngInput.value = lng;

        // Calcola automaticamente
        calculateDistanceToTarget(lat, lng, name);
      });
    });

    // Pulsante calcola con input manuale
    calculateBtn.addEventListener('click', function () {
      const lat = parseFloat(targetLatInput?.value);
      const lng = parseFloat(targetLngInput?.value);

      if (isNaN(lat) || isNaN(lng)) {
        if (distanceInfo) {
          distanceInfo.innerHTML = `
            <div style="color: var(--rosso);">
              <strong>❌ Errore:</strong><br>
              Inserisci coordinate valide (es. 45.6495 per latitudine)
            </div>
          `;
        }
        if (distanceResult) {
          distanceResult.style.display = 'block';
        }
        return;
      }

      calculateDistanceToTarget(lat, lng, 'Punto Personalizzato');
    });
  }

  // API Pubblica
  window.GPSDistanceCalculator = {
    setup: setupDistanceCalculator,
    calculateToTarget: calculateDistanceToTarget,
    estimateTime: estimateTime,
    formatTime: formatTime,
    setLastPosition: setLastPosition,
    getLastPosition: getLastPosition
  };

  console.log('✅ js/tests/gps/distance-calculator.js caricato - GPSDistanceCalculator disponibile');

  // Auto-inizializza se DOM è già caricato
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setupDistanceCalculator();
    });
  } else {
    // DOM già caricato
    setupDistanceCalculator();
  }

})();

