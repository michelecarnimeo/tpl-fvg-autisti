/**
 * GPS Test Geolocation Module
 * Test principale rilevamento posizione GPS (reale o fake)
 * 
 * @module js/tests/gps/test-geolocation
 * @version 1.0.0
 * @date 09/11/2025
 */

(function() {
  'use strict';

  // Verifica dipendenze
  if (typeof window.GPSHelpers === 'undefined') {
    console.warn('⚠️ GPSHelpers non disponibile, alcune funzioni potrebbero non funzionare');
  }
  if (typeof window.GPSFakePosition === 'undefined') {
    console.warn('⚠️ GPSFakePosition non disponibile, fake position non funzionerà');
  }
  if (typeof window.GPSDistanceCalculator === 'undefined') {
    console.warn('⚠️ GPSDistanceCalculator non disponibile, calcolo distanza non funzionerà');
  }
  if (typeof window.GPSMap === 'undefined') {
    console.warn('⚠️ GPSMap non disponibile, mappa non funzionerà');
  }

  /**
   * Test rilevamento posizione GPS
   * @returns {Promise<void>}
   */
  async function testGeolocation() {
    console.log('📍 testGeolocation() chiamata');
    
    const btn = document.getElementById('test-location-btn');
    const icon = document.getElementById('test-location-icon');
    const text = document.getElementById('test-location-text');
    const result = document.getElementById('test-location-result');
    const info = document.getElementById('test-location-info');

    if (!btn || !icon || !text || !result || !info) {
      console.error('❌ Elementi DOM mancanti per testGeolocation');
      return;
    }

    // Stato di caricamento
    try {
      icon.textContent = '⏳';
      text.textContent = 'Rilevamento...';
      btn.disabled = true;
      result.style.display = 'none';
    } catch (error) {
      console.error('❌ Errore aggiornamento UI iniziale:', error);
    }

    try {
      console.log('📍 testGeolocation: Inizio try block');
      let position;

      // ===== CONTROLLA SE USARE FAKE POSITION =====
      let useFake = false;
      let fakePos = null;
      
      try {
        console.log('📍 testGeolocation: Verifica fake position');
        if (typeof window.GPSFakePosition !== 'undefined' && window.GPSFakePosition.isActive) {
          useFake = window.GPSFakePosition.isActive();
          fakePos = window.GPSFakePosition.get();
          console.log('📍 testGeolocation: Fake position dal modulo:', useFake, fakePos ? 'presente' : 'null');
        } else {
          // Fallback a variabili inline (per retrocompatibilità)
          useFake = typeof window.useFakePosition !== 'undefined' ? window.useFakePosition : false;
          fakePos = typeof window.fakePositionData !== 'undefined' ? window.fakePositionData : null;
          console.log('📍 testGeolocation: Fake position da variabili inline:', useFake, fakePos ? 'presente' : 'null');
        }
      } catch (error) {
        console.warn('⚠️ Errore accesso GPSFakePosition, uso variabili inline:', error);
        useFake = typeof window.useFakePosition !== 'undefined' ? window.useFakePosition : false;
        fakePos = typeof window.fakePositionData !== 'undefined' ? window.fakePositionData : null;
      }

      if (useFake && fakePos) {
        // Usa posizione fake
        console.log('🎭 Uso posizione simulata:', fakePos.coords);

        // Simula delay realistico (500ms)
        await new Promise(resolve => setTimeout(resolve, 500));

        position = fakePos;

        // Feedback visivo
        icon.textContent = '🎭';
        text.textContent = 'Posizione Simulata';

      } else if (useFake && !fakePos) {
        // Fake attivato ma nessuna posizione impostata
        throw new Error('⚠️ Nessuna posizione fake impostata! Clicca "Applica Posizione Fake" prima.');

      } else {
        // Usa GPS reale
        // Verifica supporto geolocalizzazione
        if (!navigator.geolocation) {
          throw new Error('Geolocalizzazione non supportata dal browser');
        }

        // Richiedi posizione con timeout
        position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            resolve,
            reject,
            {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 0 // Sempre posizione fresca
            }
          );
        });

        // Successo
        icon.textContent = '✅';
        text.textContent = 'Posizione Rilevata';
      }

      // Salva posizione nel modulo GPSDistanceCalculator
      if (typeof window.GPSDistanceCalculator !== 'undefined' && window.GPSDistanceCalculator.setLastPosition) {
        window.GPSDistanceCalculator.setLastPosition(position);
      }

      // Mostra calcolatore distanza
      const distanceCalculator = document.getElementById('distance-calculator');
      if (distanceCalculator) {
        distanceCalculator.style.display = 'block';
      }

      // Mostra sezione Watch Position
      const watchSection = document.getElementById('watch-position-section');
      if (watchSection) {
        watchSection.style.display = 'block';
      }

      // Mostra informazioni dettagliate
      const coords = position.coords;

      // Inizializza mappa usando il modulo GPSMap
      if (typeof window.GPSMap !== 'undefined' && window.GPSMap.initialize) {
        window.GPSMap.initialize(coords.latitude, coords.longitude, coords.accuracy);
      }

      const timestamp = new Date(position.timestamp).toLocaleString('it-IT');

      // Velocità e direzione (se disponibili)
      const speedKmh = coords.speed !== null ? (coords.speed * 3.6).toFixed(1) : null;
      const heading = coords.heading !== null ? coords.heading.toFixed(0) : null;

      // Badge modalità (GPS reale o fake)
      let isFakeMode = false;
      try {
        if (typeof window.GPSFakePosition !== 'undefined' && window.GPSFakePosition.isActive) {
          isFakeMode = window.GPSFakePosition.isActive();
        } else {
          isFakeMode = typeof window.useFakePosition !== 'undefined' ? window.useFakePosition : false;
        }
      } catch (error) {
        console.warn('⚠️ Errore accesso GPSFakePosition per badge, uso variabili inline:', error);
        isFakeMode = typeof window.useFakePosition !== 'undefined' ? window.useFakePosition : false;
      }

      const modeBadge = isFakeMode
        ? '<span style="display: inline-block; padding: 0.25rem 0.75rem; background: linear-gradient(135deg, #a855f7, #9333ea); color: white; border-radius: 6px; font-size: 0.8rem; font-weight: 600; margin-bottom: 0.75rem;">🎭 MODALITÀ SIMULATA</span>'
        : '<span style="display: inline-block; padding: 0.25rem 0.75rem; background: linear-gradient(135deg, #10b981, #059669); color: white; border-radius: 6px; font-size: 0.8rem; font-weight: 600; margin-bottom: 0.75rem;">✅ GPS REALE</span>';

      // Ottieni direzione cardinale (usa GPSHelpers se disponibile)
      let cardinalDirection = '';
      if (heading !== null) {
        if (window.GPSHelpers && typeof window.GPSHelpers.getCardinalDirection === 'function') {
          cardinalDirection = window.GPSHelpers.getCardinalDirection(parseFloat(heading));
        } else {
          // Fallback inline
          const directions = ['⬆️ Nord', '↗️ Nord-Est', '➡️ Est', '↘️ Sud-Est', '⬇️ Sud', '↙️ Sud-Ovest', '⬅️ Ovest', '↖️ Nord-Ovest'];
          const index = Math.round(parseFloat(heading) / 45) % 8;
          cardinalDirection = directions[index];
        }
      }

      // Costruisci HTML base
      let html = `
        ${modeBadge}
        <div style="margin-bottom: 0.5rem;">
          <strong>📍 Coordinate:</strong>
          <button id="copy-coords-btn" style="margin-left: 0.5rem; padding: 0.25rem 0.75rem; background: var(--turchese); color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 0.85rem; font-weight: 500;">
            📋 Copia
          </button>
          <br>
          Latitudine: <code>${coords.latitude.toFixed(6)}</code><br>
          Longitudine: <code>${coords.longitude.toFixed(6)}</code>
        </div>
        <div style="margin-bottom: 0.5rem;">
          <strong>🎯 Precisione:</strong><br>
          Accuratezza: <code>${Math.round(coords.accuracy)} metri</code><br>
          Altitudine: <code>${coords.altitude ? Math.round(coords.altitude) + ' metri' : 'Non disponibile'}</code>${coords.altitudeAccuracy ? ' (±' + Math.round(coords.altitudeAccuracy) + 'm)' : ''}
        </div>
        <div style="margin-bottom: 0.5rem;">
          <strong>🚗 Movimento:</strong><br>
          Velocità: <code>${speedKmh !== null ? speedKmh + ' km/h' : '❌ Non disponibile (dispositivo fermo)'}</code><br>
          Direzione: <code>${heading !== null ? heading + '° ' + cardinalDirection : '❌ Non disponibile (serve movimento)'}</code>
        </div>
        <div style="margin-bottom: 0.5rem;">
          <strong>⏰ Timestamp:</strong><br>
          <code>${timestamp}</code>
        </div>
        <div id="address-container" style="margin-bottom: 0.5rem;">
          <strong>
            📬 Indirizzo 
            <span style="display: inline-block; margin-left: 0.5rem; padding: 0.2rem 0.4rem; background: linear-gradient(135deg, #fecaca, #fca5a5); color: #7f1d1d; border-radius: 4px; font-size: 0.65rem; font-weight: 600;">🔴 RICHIEDE INTERNET</span>
          </strong>
          <div id="address-connection-badge" style="display: inline-block; margin-left: 0.5rem; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.7rem; font-weight: 600; transition: all 0.3s;"></div>
          <br>
          <span style="color: #666;">🔄 Recupero indirizzo...</span>
        </div>
        <div style="margin-bottom: 0.5rem;">
          <strong>🔗 Link Mappe:</strong><br>
          <a href="https://www.google.com/maps?q=${coords.latitude},${coords.longitude}" target="_blank" style="color: var(--turchese); text-decoration: none;">
            📍 Apri su Google Maps
          </a><br>
          <a href="https://www.openstreetmap.org/?mlat=${coords.latitude}&mlon=${coords.longitude}&zoom=15" target="_blank" style="color: var(--turchese); text-decoration: none;">
            🗺️ Apri su OpenStreetMap
          </a>
        </div>
      `;

      info.innerHTML = html;
      result.style.display = 'block';
      result.style.borderLeftColor = 'var(--verde)';
      result.style.background = 'rgba(34, 197, 94, 0.1)';

      // Setup badge dinamico indirizzo
      const addressBadge = document.getElementById('address-connection-badge');
      if (addressBadge) {
        // Funzione aggiornamento badge
        const updateAddressBadge = () => {
          // Controlla sia navigator.onLine che simulazione offline
          const offlineTest = localStorage.getItem('tpl.offlineTestMode') === 'true';
          const isOnline = navigator.onLine && !offlineTest;

          if (isOnline) {
            addressBadge.style.background = 'linear-gradient(135deg, #d1fae5, #a7f3d0)';
            addressBadge.style.color = '#065f46';
            addressBadge.textContent = '🟢 Online';
            addressBadge.title = '✅ Connessione attiva - Reverse geocoding disponibile';
          } else {
            addressBadge.style.background = 'linear-gradient(135deg, #fecaca, #fca5a5)';
            addressBadge.style.color = '#7f1d1d';
            addressBadge.textContent = offlineTest ? '🔴 Offline (simulato)' : '🔴 Offline';
            addressBadge.title = '🔴 Nessuna connessione - Indirizzo non disponibile';
          }
        };

        // Aggiorna stato iniziale
        updateAddressBadge();

        // Listener eventi online/offline (nativi)
        window.addEventListener('online', updateAddressBadge);
        window.addEventListener('offline', updateAddressBadge);

        // Listener evento simulazione offline (custom)
        window.addEventListener('offlineTestModeChanged', () => {
          console.log('📡 Evento offlineTestModeChanged ricevuto - Aggiorno badge indirizzo');
          // Piccolo delay per dare tempo a localStorage di aggiornarsi
          setTimeout(updateAddressBadge, 50);
        });
      }

      // Aggiungi event listener al pulsante copia
      const copyBtn = document.getElementById('copy-coords-btn');
      if (copyBtn) {
        copyBtn.addEventListener('click', async () => {
          let success = false;
          if (window.GPSHelpers && typeof window.GPSHelpers.copyCoordinates === 'function') {
            success = await window.GPSHelpers.copyCoordinates(coords.latitude, coords.longitude);
          } else {
            // Fallback inline
            try {
              await navigator.clipboard.writeText(`${coords.latitude}, ${coords.longitude}`);
              success = true;
            } catch (err) {
              console.error('Errore copia coordinate:', err);
              success = false;
            }
          }

          if (success) {
            copyBtn.textContent = '✅ Copiato!';
            setTimeout(() => {
              copyBtn.textContent = '📋 Copia';
            }, 2000);
          } else {
            copyBtn.textContent = '❌ Errore';
            setTimeout(() => {
              copyBtn.textContent = '📋 Copia';
            }, 2000);
          }
        });
      }

      // Reverse Geocoding (asincrono)
      let reverseGeocodePromise;
      if (window.GPSHelpers && typeof window.GPSHelpers.reverseGeocode === 'function') {
        reverseGeocodePromise = window.GPSHelpers.reverseGeocode(coords.latitude, coords.longitude);
      } else {
        // Fallback inline
        reverseGeocodePromise = fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.latitude}&lon=${coords.longitude}&zoom=18&addressdetails=1`)
          .then(response => response.ok ? response.json() : null)
          .catch(() => null);
      }

      reverseGeocodePromise.then(data => {
        const addressContainer = document.getElementById('address-container');
        if (addressContainer && data) {
          // Gestisce sia formato GPSHelpers che formato Nominatim diretto
          let addressText = '';
          let displayName = '';

          if (typeof data === 'string') {
            // GPSHelpers ritorna stringa
            displayName = data;
          } else if (data.address) {
            // Formato Nominatim
            const address = data.address;
            if (address.road) {
              addressText += address.road;
              if (address.house_number) addressText += ' ' + address.house_number;
              addressText += '<br>';
            }
            if (address.postcode || address.city || address.town || address.village) {
              if (address.postcode) addressText += address.postcode + ' ';
              addressText += address.city || address.town || address.village || '';
              addressText += '<br>';
            }
            if (address.state) addressText += address.state + '<br>';
            if (address.country) addressText += address.country;
            displayName = data.display_name || addressText;
          } else if (data.display_name) {
            // Solo display_name
            displayName = data.display_name;
          }

          addressContainer.innerHTML = `
            <strong>📬 Indirizzo:</strong><br>
            <span style="color: var(--grigio-scuro);">${addressText || displayName}</span>
          `;
        } else if (addressContainer) {
          // Distingui tra offline e errore API
          const isOffline = !navigator.onLine;
          const errorMsg = isOffline
            ? '🟠 <span style="color: #92400e;">Modalità offline - Indirizzo non disponibile</span>'
            : '❌ <span style="color: #999;">Indirizzo non disponibile</span>';

          addressContainer.innerHTML = `
            <strong>📬 Indirizzo:</strong><br>
            ${errorMsg}
          `;
        }
      }).catch(error => {
        // Gestione errori esplicita
        console.error('Errore reverse geocoding:', error);
        const addressContainer = document.getElementById('address-container');
        if (addressContainer) {
          const isOffline = !navigator.onLine;
          const errorMsg = isOffline
            ? '🟠 <span style="color: #92400e;">Modalità offline - Richiede connessione internet</span>'
            : '❌ <span style="color: #999;">Errore recupero indirizzo</span>';

          addressContainer.innerHTML = `
            <strong>📬 Indirizzo:</strong><br>
            ${errorMsg}
          `;
        }
      });

    } catch (error) {
      // Errore
      icon.textContent = '❌';
      text.textContent = 'Errore Rilevamento';

      let errorMessage = 'Errore sconosciuto';
      if (error.code === 1) {
        errorMessage = 'Permesso di geolocalizzazione negato';
      } else if (error.code === 2) {
        errorMessage = 'Posizione non disponibile';
      } else if (error.code === 3) {
        errorMessage = 'Timeout durante il rilevamento';
      } else {
        errorMessage = error.message;
      }

      info.innerHTML = `
        <div style="color: var(--rosso);">
          <strong>❌ Errore:</strong><br>
          <code>${errorMessage}</code>
        </div>
        <div style="margin-top: 0.5rem; font-size: 0.9rem; color: var(--grigio-scuro);">
          <strong>Suggerimenti:</strong><br>
          • Assicurati di aver concesso il permesso di geolocalizzazione<br>
          • Verifica che il GPS sia attivo<br>
          • Prova in un'area con buona copertura di rete<br>
          • Su HTTPS: verifica le impostazioni del browser
        </div>
      `;

      result.style.display = 'block';
      result.style.borderLeftColor = 'var(--rosso)';
      result.style.background = 'rgba(239, 68, 68, 0.1)';
    }

    // Reset dopo 5 secondi
    setTimeout(() => {
      icon.textContent = '📍';
      text.textContent = 'Rileva Posizione';
      btn.disabled = false;
    }, 5000);
  }

  // API Pubblica
  window.GPSTestGeolocation = {
    run: testGeolocation
  };

  // Espone anche come funzione globale per retrocompatibilità
  window.testGeolocation = testGeolocation;

  console.log('✅ js/tests/gps/test-geolocation.js caricato - GPSTestGeolocation disponibile');

})();

