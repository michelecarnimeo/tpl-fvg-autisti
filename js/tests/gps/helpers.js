/**
 * js/tests/gps/helpers.js
 *
 * Helper functions per moduli GPS
 * Funzioni utility riutilizzabili per geolocalizzazione
 *
 * Funzionalità:
 * - Copia coordinate negli appunti
 * - Reverse geocoding (OpenStreetMap Nominatim API)
 * - Conversione gradi in direzione cardinale
 * - Verifica permessi geolocalizzazione
 * - Verifica HTTPS per geolocalizzazione
 * - Calcolo distanza tra coordinate (formula Haversine)
 *
 * API Pubblica: window.GPSHelpers
 */

(function () {
  'use strict';

  /**
   * Copia coordinate negli appunti
   * @param {number} lat - Latitudine
   * @param {number} lng - Longitudine
   * @returns {Promise<boolean>} true se copiato con successo, false altrimenti
   */
  async function copyCoordinates(lat, lng) {
    try {
      const coordsText = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
      await navigator.clipboard.writeText(coordsText);
      return true;
    } catch (error) {
      console.error('Errore copia coordinate:', error);
      return false;
    }
  }

  /**
   * Reverse geocoding (OpenStreetMap Nominatim API)
   * Converte coordinate geografiche in indirizzo
   * @param {number} lat - Latitudine
   * @param {number} lng - Longitudine
   * @returns {Promise<Object|null>} Dati indirizzo o null in caso di errore
   */
  async function reverseGeocode(lat, lng) {
    try {
      // NOTA: Nominatim (OpenStreetMap) è un servizio esterno.
      // I warning "x-content-type-options header missing" e "cache-control header missing"
      // sono attesi e normali perché non possiamo controllare gli header delle risposte di servizi esterni.
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        {
          headers: {
            'Accept-Language': 'it'
          }
        }
      );

      if (!response.ok) throw new Error('Errore reverse geocoding');

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Errore reverse geocoding:', error);
      return null;
    }
  }

  /**
   * Converti gradi in direzione cardinale
   * @param {number} degrees - Gradi (0-360)
   * @returns {string} Direzione cardinale (es. "⬆️ Nord", "↗️ Nord-Est", ecc.)
   */
  function getCardinalDirection(degrees) {
    const directions = [
      '⬆️ Nord',
      '↗️ Nord-Est',
      '➡️ Est',
      '↘️ Sud-Est',
      '⬇️ Sud',
      '↙️ Sud-Ovest',
      '⬅️ Ovest',
      '↖️ Nord-Ovest'
    ];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
  }

  /**
   * Verifica permessi geolocalizzazione
   * Aggiorna UI con stato permessi (granted/denied/prompt)
   * @param {string} statusDivId - ID elemento div status (default: 'geo-permission-status')
   * @param {string} statusTextId - ID elemento testo status (default: 'geo-permission-text')
   * @returns {Promise<void>}
   */
  async function checkGeolocationPermission(statusDivId = 'geo-permission-status', statusTextId = 'geo-permission-text') {
    const statusDiv = document.getElementById(statusDivId);
    const statusText = document.getElementById(statusTextId);

    if (!statusDiv || !statusText) {
      console.warn('⚠️ Elementi UI permessi geolocalizzazione non trovati');
      return;
    }

    try {
      if (!navigator.permissions) {
        statusText.textContent = 'API Permissions non supportata';
        statusDiv.style.borderLeftColor = '#gray';
        return;
      }

      const result = await navigator.permissions.query({ name: 'geolocation' });

      if (result.state === 'granted') {
        statusText.innerHTML = '<span style="color: var(--verde);">✅ Concesso</span>';
        statusDiv.style.borderLeftColor = 'var(--verde)';
        statusDiv.style.background = 'rgba(34, 197, 94, 0.1)';
      } else if (result.state === 'denied') {
        statusText.innerHTML = '<span style="color: var(--rosso);">❌ Negato</span>';
        statusDiv.style.borderLeftColor = 'var(--rosso)';
        statusDiv.style.background = 'rgba(239, 68, 68, 0.1)';
      } else if (result.state === 'prompt') {
        statusText.innerHTML = '<span style="color: #f59e0b;">⚠️ Richiesta in sospeso</span>';
        statusDiv.style.borderLeftColor = '#f59e0b';
        statusDiv.style.background = 'rgba(245, 158, 11, 0.1)';
      }

      // Ascolta cambiamenti permessi
      result.addEventListener('change', () => {
        checkGeolocationPermission(statusDivId, statusTextId);
      });

    } catch (error) {
      console.error('Errore verifica permessi:', error);
      if (statusText) {
        statusText.textContent = 'Impossibile verificare';
      }
      if (statusDiv) {
        statusDiv.style.borderLeftColor = '#gray';
      }
    }
  }

  /**
   * Verifica HTTPS per geolocalizzazione
   * Mostra banner warning se non HTTPS (tranne localhost)
   * @param {string} bannerId - ID elemento banner (default: 'https-warning-banner')
   * @returns {boolean} true se connessione sicura, false altrimenti
   */
  function checkHttpsRequirement(bannerId = 'https-warning-banner') {
    const banner = document.getElementById(bannerId);
    if (!banner) {
      console.warn('⚠️ Banner HTTPS warning non trovato');
      return true; // Assumi sicuro se banner non presente
    }

    const protocol = window.location.protocol;
    const hostname = window.location.hostname;

    // Mostra banner solo se NON è HTTPS e NON è localhost
    const isSecure = protocol === 'https:';
    const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '[::1]';

    if (!isSecure && !isLocalhost) {
      banner.style.display = 'block';
      console.warn('⚠️ Geolocalizzazione richiede HTTPS o localhost. Protocollo attuale:', protocol);
      return false;
    } else {
      console.log('✅ Connessione sicura - Geolocalizzazione disponibile');
      return true;
    }
  }

  /**
   * Calcola distanza tra due coordinate (formula Haversine)
   * @param {number} lat1 - Latitudine punto 1
   * @param {number} lon1 - Longitudine punto 1
   * @param {number} lat2 - Latitudine punto 2
   * @param {number} lon2 - Longitudine punto 2
   * @returns {number} Distanza in chilometri
   */
  function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Raggio Terra in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  }

  // API Pubblica
  window.GPSHelpers = {
    copyCoordinates: copyCoordinates,
    reverseGeocode: reverseGeocode,
    getCardinalDirection: getCardinalDirection,
    checkGeolocationPermission: checkGeolocationPermission,
    checkHttpsRequirement: checkHttpsRequirement,
    calculateDistance: calculateDistance
  };

  console.log('✅ js/tests/gps/helpers.js caricato - GPSHelpers disponibile');

  // Auto-inizializza check HTTPS e permessi se elementi presenti
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      // Verifica HTTPS
      checkHttpsRequirement();

      // Verifica permessi se elemento presente
      if (document.getElementById('geo-permission-status')) {
        checkGeolocationPermission();
      }
    });
  } else {
    // DOM già caricato
    checkHttpsRequirement();
    if (document.getElementById('geo-permission-status')) {
      checkGeolocationPermission();
    }
  }

})();

