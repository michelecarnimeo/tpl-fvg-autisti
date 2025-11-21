/**
 * GPS Quick Test Module
 * Test rapido GPS one-click - Esegue 5 test in sequenza
 * 
 * @module js/tests/gps/quick-test
 * @version 1.0.0
 * @date 09/11/2025
 */

(function() {
  'use strict';

  // Verifica dipendenze
  if (typeof window.GPSHelpers === 'undefined') {
    console.warn('⚠️ GPSHelpers non disponibile, alcune funzioni potrebbero non funzionare');
  }

  /**
   * Esegue test rapido GPS completo
   * @returns {Promise<void>}
   */
  async function quickGPSTest() {
    const btn = document.getElementById('quick-gps-test-btn');
    const icon = document.getElementById('quick-test-icon');
    const text = document.getElementById('quick-test-text');
    const resultsDiv = document.getElementById('quick-test-results');
    const itemsDiv = document.getElementById('quick-test-items');
    const summaryDiv = document.getElementById('quick-test-summary');

    if (!btn || !resultsDiv || !itemsDiv || !summaryDiv) {
      console.error('❌ Elementi DOM non trovati per quickGPSTest');
      return;
    }

    // Disabilita button e mostra loading
    btn.disabled = true;
    btn.style.opacity = '0.7';
    if (icon) icon.textContent = '⏳';
    if (text) text.textContent = 'Test in corso...';

    // Mostra risultati (vuoti per ora)
    resultsDiv.style.display = 'block';
    itemsDiv.innerHTML = '<p style="text-align: center; color: #9ca3af;">Esecuzione test in corso...</p>';
    summaryDiv.innerHTML = '';

    const testResults = [];

    // === TEST 1: Permessi ===
    try {
      const permission = await navigator.permissions.query({ name: 'geolocation' });
      const status = permission.state;
      testResults.push({
        name: 'Permessi Geolocalizzazione',
        status: status === 'granted' ? 'success' : (status === 'prompt' ? 'warning' : 'error'),
        message: status === 'granted' ? 'Permessi concessi' : (status === 'prompt' ? 'Permessi non richiesti' : 'Permessi negati'),
        icon: status === 'granted' ? '🟢' : (status === 'prompt' ? '🟡' : '🔴')
      });
    } catch (e) {
      testResults.push({
        name: 'Permessi Geolocalizzazione',
        status: 'warning',
        message: 'Impossibile verificare permessi',
        icon: '🟡'
      });
    }

    // === TEST 2: Supporto GPS ===
    const hasGPS = 'geolocation' in navigator;
    testResults.push({
      name: 'Supporto GPS Hardware',
      status: hasGPS ? 'success' : 'error',
      message: hasGPS ? 'GPS supportato dal browser' : 'GPS non supportato',
      icon: hasGPS ? '🟢' : '🔴'
    });

    // === TEST 3: Rilevamento Posizione ===
    if (hasGPS) {
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
          });
        });

        const accuracy = position.coords.accuracy;
        const hasSpeed = position.coords.speed !== null;
        const hasAltitude = position.coords.altitude !== null;

        // Valutazione accuratezza
        let accuracyStatus = 'success';
        let accuracyMsg = `Eccellente (±${accuracy.toFixed(0)}m)`;
        if (accuracy > 50 && accuracy <= 100) {
          accuracyStatus = 'warning';
          accuracyMsg = `Buona (±${accuracy.toFixed(0)}m)`;
        } else if (accuracy > 100) {
          accuracyStatus = 'warning';
          accuracyMsg = `Bassa (±${accuracy.toFixed(0)}m)`;
        }

        testResults.push({
          name: 'Rilevamento Posizione',
          status: 'success',
          message: `Posizione rilevata con successo`,
          icon: '🟢'
        });

        testResults.push({
          name: 'Accuratezza GPS',
          status: accuracyStatus,
          message: accuracyMsg,
          icon: accuracyStatus === 'success' ? '🟢' : '🟡'
        });

        testResults.push({
          name: 'Dati Avanzati (Velocità/Altitudine)',
          status: (hasSpeed || hasAltitude) ? 'success' : 'warning',
          message: hasSpeed && hasAltitude ? 'Velocità e altitudine disponibili' :
            hasSpeed ? 'Solo velocità disponibile' :
              hasAltitude ? 'Solo altitudine disponibile' :
                'Dati non disponibili (normale su alcuni device)',
          icon: (hasSpeed || hasAltitude) ? '🟢' : '🟡'
        });

        // === TEST 4: Reverse Geocoding ===
        try {
          if (window.GPSHelpers && typeof window.GPSHelpers.reverseGeocode === 'function') {
            const address = await window.GPSHelpers.reverseGeocode(
              position.coords.latitude,
              position.coords.longitude
            );
            testResults.push({
              name: 'Reverse Geocoding (API Nominatim)',
              status: 'success',
              message: `Indirizzo trovato: ${address || 'N/A'}`.substring(0, 80) + '...',
              icon: '🟢'
            });
          } else {
            // Fallback: chiamata diretta API
            // NOTA: Nominatim (OpenStreetMap) è un servizio esterno.
            // I warning "x-content-type-options header missing" e "cache-control header missing"
            // sono attesi e normali perché non possiamo controllare gli header delle risposte di servizi esterni.
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}&zoom=18&addressdetails=1`);
            if (response.ok) {
              const data = await response.json();
              testResults.push({
                name: 'Reverse Geocoding (API Nominatim)',
                status: 'success',
                message: `Indirizzo trovato: ${data.display_name || 'N/A'}`.substring(0, 80) + '...',
                icon: '🟢'
              });
            } else {
              testResults.push({
                name: 'Reverse Geocoding (API Nominatim)',
                status: 'warning',
                message: 'API non risponde correttamente',
                icon: '🟡'
              });
            }
          }
        } catch (e) {
          testResults.push({
            name: 'Reverse Geocoding (API Nominatim)',
            status: 'warning',
            message: navigator.onLine ? 'Errore API' : 'Offline - Funzione non disponibile',
            icon: '🟡'
          });
        }

        // === TEST 5: Libreria Mappa (Leaflet) ===
        const hasLeaflet = typeof L !== 'undefined';
        testResults.push({
          name: 'Libreria Mappa (Leaflet.js)',
          status: hasLeaflet ? 'success' : 'error',
          message: hasLeaflet ? 'Leaflet caricato correttamente' : 'Leaflet non disponibile',
          icon: hasLeaflet ? '🟢' : '🔴'
        });

      } catch (error) {
        testResults.push({
          name: 'Rilevamento Posizione',
          status: 'error',
          message: error.code === 1 ? 'Permesso negato dall\'utente' :
            error.code === 2 ? 'Posizione non disponibile' :
              error.code === 3 ? 'Timeout richiesta' :
                'Errore sconosciuto',
          icon: '🔴'
        });
      }
    }

    // === RENDER RISULTATI ===
    itemsDiv.innerHTML = testResults.map(result => `
      <div style="display: flex; align-items: start; gap: 0.75rem; padding: 0.75rem; background: ${result.status === 'success' ? '#f0fdf4' :
        result.status === 'warning' ? '#fef3c7' :
          '#fee2e2'
      }; border-radius: 8px; border-left: 4px solid ${result.status === 'success' ? '#10b981' :
        result.status === 'warning' ? '#f59e0b' :
          '#ef4444'
      };">
        <div style="font-size: 1.5rem; flex-shrink: 0;">${result.icon}</div>
        <div style="flex: 1;">
          <strong style="color: #374151;">${result.name}</strong>
          <p style="margin: 0.25rem 0 0 0; color: #6b7280; font-size: 0.9rem;">${result.message}</p>
        </div>
      </div>
    `).join('');

    // === SUMMARY ===
    const successCount = testResults.filter(r => r.status === 'success').length;
    const warningCount = testResults.filter(r => r.status === 'warning').length;
    const errorCount = testResults.filter(r => r.status === 'error').length;
    const total = testResults.length;

    let summaryColor, summaryIcon, summaryText;
    if (errorCount === 0 && warningCount === 0) {
      summaryColor = '#10b981';
      summaryIcon = '✅';
      summaryText = 'Tutti i test superati! GPS completamente funzionante!';
    } else if (errorCount === 0) {
      summaryColor = '#f59e0b';
      summaryIcon = '⚠️';
      summaryText = `${successCount}/${total} test superati. Alcune funzioni potrebbero avere limitazioni.`;
    } else {
      summaryColor = '#ef4444';
      summaryIcon = '❌';
      summaryText = `${errorCount} errori critici. Verifica configurazione GPS.`;
    }

    summaryDiv.innerHTML = `
      <div style="display: flex; align-items: center; gap: 0.75rem; color: ${summaryColor};">
        <span style="font-size: 1.5rem;">${summaryIcon}</span>
        <span>${summaryText}</span>
      </div>
      <div style="margin-top: 0.5rem; font-size: 0.9rem; color: #6b7280; font-weight: normal;">
        🟢 ${successCount} successi · 🟡 ${warningCount} avvisi · 🔴 ${errorCount} errori
      </div>
    `;

    // Ripristina button
    btn.disabled = false;
    btn.style.opacity = '1';
    if (icon) icon.textContent = '🔄';
    if (text) text.textContent = 'Ripeti Test';
  }

  // API Pubblica
  window.GPSQuickTest = {
    run: quickGPSTest
  };

  console.log('✅ js/tests/gps/quick-test.js caricato - GPSQuickTest disponibile');

})();

