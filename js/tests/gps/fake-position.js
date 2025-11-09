/**
 * js/tests/gps/fake-position.js
 *
 * Gestione simulazione posizione fake per test GPS
 * Permette di simulare una posizione GPS per test senza GPS reale
 *
 * Funzionalità:
 * - Toggle on/off simulazione posizione
 * - Preset città (Udine, Trieste, Gorizia, Pordenone)
 * - Input manuale coordinate
 * - Validazione coordinate
 * - Creazione oggetto Position simulato
 *
 * API Pubblica: window.GPSFakePosition
 * Dipendenze: window.GPSHelpers (per validazione)
 */

(function () {
  'use strict';

  // Stato privato
  let useFakePosition = false;
  let fakePositionData = null;

  // Preset città (coordinate da test.html)
  const CITY_PRESETS = {
    udine: { lat: 46.0710, lng: 13.2345, name: 'Udine' },
    trieste: { lat: 45.6495, lng: 13.7768, name: 'Trieste' },
    gorizia: { lat: 45.9405, lng: 13.6222, name: 'Gorizia' },
    pordenone: { lat: 45.9632, lng: 12.6603, name: 'Pordenone' }
  };

  /**
   * Valida coordinate geografiche
   * @param {number} lat - Latitudine
   * @param {number} lng - Longitudine
   * @returns {boolean} true se valide, false altrimenti
   */
  function validateCoordinates(lat, lng) {
    if (isNaN(lat) || isNaN(lng)) {
      return false;
    }
    if (lat < -90 || lat > 90) {
      return false;
    }
    if (lng < -180 || lng > 180) {
      return false;
    }
    return true;
  }

  /**
   * Crea oggetto Position simulato
   * @param {number} lat - Latitudine
   * @param {number} lng - Longitudine
   * @param {number} accuracy - Accuratezza in metri
   * @param {number} altitude - Altitudine in metri
   * @param {number} speed - Velocità in m/s (opzionale)
   * @param {number} heading - Direzione in gradi 0-360 (opzionale)
   * @returns {Object} Oggetto Position simulato
   */
  function createFakePosition(lat, lng, accuracy, altitude, speed = null, heading = null) {
    return {
      coords: {
        latitude: lat,
        longitude: lng,
        accuracy: accuracy,
        altitude: altitude,
        altitudeAccuracy: accuracy * 2,
        heading: heading !== null && heading >= 0 && heading <= 360 ? heading : null,
        speed: speed !== null && speed > 0 ? speed : null
      },
      timestamp: Date.now()
    };
  }

  /**
   * Applica posizione fake
   * @param {number} lat - Latitudine
   * @param {number} lng - Longitudine
   * @param {number} accuracy - Accuratezza in metri (default: 10)
   * @param {number} altitude - Altitudine in metri (default: 0)
   * @param {number} speedKmh - Velocità in km/h (opzionale)
   * @param {number} heading - Direzione in gradi 0-360 (opzionale)
   * @returns {Object|null} Oggetto Position simulato o null se errore
   */
  function applyFakePosition(lat, lng, accuracy = 10, altitude = 0, speedKmh = null, heading = null) {
    // Validazione coordinate
    if (!validateCoordinates(lat, lng)) {
      console.error('⚠️ Coordinate non valide:', { lat, lng });
      return null;
    }

    // Converti velocità da km/h a m/s (GPS usa m/s)
    const speedMs = speedKmh !== null && speedKmh > 0 ? speedKmh / 3.6 : null;

    // Validazione heading
    const validHeading = heading !== null && heading >= 0 && heading <= 360 ? heading : null;

    // Crea oggetto fake position
    fakePositionData = createFakePosition(lat, lng, accuracy, altitude, speedMs, validHeading);

    // Salva in localStorage per persistenza
    try {
      localStorage.setItem('tpl.useFakePosition', 'true');
      localStorage.setItem('tpl.fakePositionData', JSON.stringify(fakePositionData));
    } catch (error) {
      console.warn('⚠️ Errore salvataggio fake position in localStorage:', error);
    }

    console.log('🎯 Posizione fake applicata:', {
      lat: fakePositionData.coords.latitude,
      lng: fakePositionData.coords.longitude,
      accuracy: fakePositionData.coords.accuracy + 'm',
      altitude: fakePositionData.coords.altitude + 'm',
      speed: speedMs ? speedKmh.toFixed(1) + ' km/h' : 'null',
      heading: validHeading ? validHeading + '°' : 'null'
    });

    return fakePositionData;
  }

  /**
   * Ottieni posizione fake corrente
   * @returns {Object|null} Oggetto Position simulato o null
   */
  function getFakePosition() {
    return fakePositionData;
  }

  /**
   * Rimuovi posizione fake
   */
  function clearFakePosition() {
    fakePositionData = null;
    useFakePosition = false;
    try {
      localStorage.removeItem('tpl.useFakePosition');
      localStorage.removeItem('tpl.fakePositionData');
    } catch (error) {
      console.warn('⚠️ Errore rimozione fake position da localStorage:', error);
    }
    console.log('🗑️ Posizione fake rimossa');
  }

  /**
   * Verifica se fake position è attiva
   * @returns {boolean} true se attiva, false altrimenti
   */
  function isFakePositionActive() {
    return useFakePosition && fakePositionData !== null;
  }

  /**
   * Imposta stato fake position (on/off)
   * @param {boolean} active - true per attivare, false per disattivare
   */
  function setFakePositionActive(active) {
    useFakePosition = active;
    try {
      localStorage.setItem('tpl.useFakePosition', active ? 'true' : 'false');
      if (!active) {
        fakePositionData = null;
        localStorage.removeItem('tpl.fakePositionData');
      }
    } catch (error) {
      console.warn('⚠️ Errore salvataggio stato fake position:', error);
    }
    console.log(active ? '🎭 Simulazione posizione ATTIVA' : '✅ GPS reale ATTIVO');
  }

  /**
   * Carica stato fake position da localStorage
   */
  function loadFakePositionState() {
    try {
      const savedState = localStorage.getItem('tpl.useFakePosition');
      useFakePosition = savedState === 'true';

      if (useFakePosition) {
        const savedData = localStorage.getItem('tpl.fakePositionData');
        if (savedData) {
          try {
            fakePositionData = JSON.parse(savedData);
          } catch (error) {
            console.warn('⚠️ Errore parsing fake position data:', error);
            fakePositionData = null;
          }
        }
      }
    } catch (error) {
      console.warn('⚠️ Errore caricamento stato fake position:', error);
    }
  }

  /**
   * Setup event listeners per UI
   */
  function setupFakePosition() {
    const toggleCheckbox = document.getElementById('use-fake-position');
    const content = document.getElementById('fake-position-content');
    const applyBtn = document.getElementById('apply-fake-position');
    const presetBtns = document.querySelectorAll('.fake-position-preset');
    const infoDiv = document.getElementById('fake-position-info');
    const detailsDiv = document.getElementById('fake-position-details');

    if (!toggleCheckbox || !content || !applyBtn) {
      console.warn('⚠️ Elementi UI fake position non trovati');
      return;
    }

    // Carica stato salvato
    loadFakePositionState();

    // Aggiorna UI con stato salvato
    if (toggleCheckbox) {
      toggleCheckbox.checked = useFakePosition;
    }
    if (content) {
      content.style.display = useFakePosition ? 'block' : 'none';
    }

    // Toggle on/off simulazione
    toggleCheckbox.addEventListener('change', (e) => {
      setFakePositionActive(e.target.checked);
      if (content) {
        content.style.display = useFakePosition ? 'block' : 'none';
      }

      if (!useFakePosition) {
        fakePositionData = null;
        if (infoDiv) {
          infoDiv.style.display = 'none';
        }
      }
    });

    // Preset città
    presetBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Supporta sia data-preset che data-lat/data-lng/data-name
        let lat, lng, name;

        if (btn.dataset.preset) {
          // Nuovo formato: data-preset
          const presetKey = btn.dataset.preset;
          const preset = CITY_PRESETS[presetKey];
          if (preset) {
            lat = preset.lat;
            lng = preset.lng;
            name = preset.name;
          }
        } else if (btn.dataset.lat && btn.dataset.lng) {
          // Formato esistente: data-lat, data-lng, data-name
          lat = parseFloat(btn.dataset.lat);
          lng = parseFloat(btn.dataset.lng);
          name = btn.dataset.name || 'Preset';
        }

        if (lat === undefined || lng === undefined || isNaN(lat) || isNaN(lng)) {
          console.warn('⚠️ Preset non valido:', btn);
          return;
        }

        // Popola input
        const latInput = document.getElementById('fake-lat');
        const lngInput = document.getElementById('fake-lng');

        if (latInput) latInput.value = lat;
        if (lngInput) lngInput.value = lng;

        // Visual feedback
        presetBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        console.log(`🏙️ Preset selezionato: ${name} (${lat}, ${lng})`);
      });
    });

    // Applica posizione fake
    applyBtn.addEventListener('click', () => {
      const latInput = document.getElementById('fake-lat');
      const lngInput = document.getElementById('fake-lng');
      const accuracyInput = document.getElementById('fake-accuracy');
      const altitudeInput = document.getElementById('fake-altitude');
      const speedInput = document.getElementById('fake-speed');
      const headingInput = document.getElementById('fake-heading');

      if (!latInput || !lngInput) {
        alert('⚠️ Input coordinate non trovati!');
        return;
      }

      const lat = parseFloat(latInput.value);
      const lng = parseFloat(lngInput.value);
      const accuracy = parseFloat(accuracyInput?.value) || 10;
      const altitude = parseFloat(altitudeInput?.value) || 0;
      const speedKmh = parseFloat(speedInput?.value);
      const heading = parseFloat(headingInput?.value);

      // Validazione coordinate
      if (!validateCoordinates(lat, lng)) {
        alert('⚠️ Coordinate non valide!\nLatitudine: -90 to 90\nLongitudine: -180 to 180');
        return;
      }

      // Applica posizione fake
      const position = applyFakePosition(lat, lng, accuracy, altitude, speedKmh, heading);

      if (!position) {
        alert('⚠️ Errore applicazione posizione fake!');
        return;
      }

      // Mostra info posizione fake
      if (infoDiv && detailsDiv) {
        let infoHTML = `
          <strong>Coordinate:</strong> ${lat.toFixed(6)}, ${lng.toFixed(6)}<br>
          <strong>Accuratezza:</strong> ±${accuracy}m<br>
          <strong>Altitudine:</strong> ${altitude}m
        `;

        // Aggiungi velocità/direzione se impostate
        if (speedKmh && speedKmh > 0) {
          infoHTML += `<br><strong>Velocità:</strong> ${speedKmh.toFixed(1)} km/h`;
        }
        if (heading !== null && heading >= 0 && heading <= 360) {
          infoHTML += `<br><strong>Direzione:</strong> ${heading}°`;
        }

        detailsDiv.innerHTML = infoHTML;
        infoDiv.style.display = 'block';
      }

      // Visual feedback
      applyBtn.textContent = '✅ Posizione Applicata';
      setTimeout(() => {
        applyBtn.innerHTML = '🎯 Applica Posizione Fake';
      }, 2000);
    });

    // Aggiorna UI info se posizione fake già presente
    if (isFakePositionActive() && infoDiv && detailsDiv) {
      const coords = fakePositionData.coords;
      let infoHTML = `
        <strong>Coordinate:</strong> ${coords.latitude.toFixed(6)}, ${coords.longitude.toFixed(6)}<br>
        <strong>Accuratezza:</strong> ±${coords.accuracy}m<br>
        <strong>Altitudine:</strong> ${coords.altitude}m
      `;

      if (coords.speed !== null) {
        infoHTML += `<br><strong>Velocità:</strong> ${(coords.speed * 3.6).toFixed(1)} km/h`;
      }
      if (coords.heading !== null) {
        infoHTML += `<br><strong>Direzione:</strong> ${coords.heading}°`;
      }

      detailsDiv.innerHTML = infoHTML;
      infoDiv.style.display = 'block';
    }
  }

  // API Pubblica
  window.GPSFakePosition = {
    setup: setupFakePosition,
    apply: applyFakePosition,
    get: getFakePosition,
    clear: clearFakePosition,
    isActive: isFakePositionActive,
    setActive: setFakePositionActive,
    getPresets: () => CITY_PRESETS
  };

  console.log('✅ js/tests/gps/fake-position.js caricato - GPSFakePosition disponibile');

  // Auto-inizializza se DOM è già caricato
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setupFakePosition();
    });
  } else {
    // DOM già caricato
    setupFakePosition();
  }

})();

