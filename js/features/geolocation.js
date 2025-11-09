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
   * Ordina fermate per distanza dalla posizione utente
   * @param {Array<string>} fermate - Array di nomi fermate
   * @param {Object} userPos - Posizione utente {latitude, longitude}
   * @returns {Array<Object>} Array di oggetti {name, index, distance, coordinates}
   */
  function sortFermateByDistance(fermate, userPos) {
    if (!userPos || !fermate || fermate.length === 0) {
      return fermate.map((name, index) => ({ name, index, distance: null, coordinates: null }));
    }

    return fermate.map((fermata, index) => {
      const coords = FERMATE_COORDINATES[fermata];
      let distance = null;

      if (coords) {
        distance = calculateDistance(
          userPos.latitude,
          userPos.longitude,
          coords.lat,
          coords.lon
        );
      }

      return {
        name: fermata,
        index: index,
        distance: distance,
        coordinates: coords
      };
    }).sort((a, b) => {
      if (a.distance === null && b.distance === null) return 0;
      if (a.distance === null) return 1;
      if (b.distance === null) return -1;
      return a.distance - b.distance;
    });
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
      locationBtn.style.display = shouldShow ? 'flex' : 'none';

      // Se è il pulsante piccolo (index.html), usa display: flex
      if (locationBtn.classList.contains('location-btn-small')) {
        locationBtn.style.display = shouldShow ? 'flex' : 'none';
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
   * @param {Object} userPos - Posizione utente {latitude, longitude}
   * @param {Array} fermate - Array di nomi fermate della linea
   * @returns {Object|null} {name, index, distance} della fermata più vicina, o null
   */
  function findNearestPriorityStop(userPos, fermate) {
    // Fermate prioritarie per la linea Udine-Grado
    const priorityStops = ['Udine', 'Palmanova', 'Cervignano FS', 'Grado'];
    
    // Filtra solo le fermate prioritarie presenti nella linea
    const availablePriorityStops = priorityStops.filter(stop => fermate.includes(stop));
    
    if (availablePriorityStops.length === 0) {
      return null;
    }

    // Calcola distanza per ogni fermata prioritaria
    const stopsWithDistance = availablePriorityStops.map(stopName => {
      const stopIndex = fermate.indexOf(stopName);
      const coords = FERMATE_COORDINATES[stopName];
      
      if (!coords || stopIndex === -1) {
        return null;
      }

      const distance = calculateDistance(
        userPos.latitude,
        userPos.longitude,
        coords.lat,
        coords.lon
      );

      return {
        name: stopName,
        index: stopIndex,
        distance: distance
      };
    }).filter(stop => stop !== null);

    if (stopsWithDistance.length === 0) {
      return null;
    }

    // Trova la fermata più vicina
    const nearest = stopsWithDistance.reduce((prev, current) => {
      return (prev.distance < current.distance) ? prev : current;
    });

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
   * @param {Object} userPos - Posizione utente {latitude, longitude}
   * @returns {Object|null} {name, index, distance} della fermata più vicina, o null se non possibile
   */
  function autoAssignRoute(userPos) {
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

    // Trova la fermata più vicina tra quelle prioritarie
    const nearestStop = findNearestPriorityStop(userPos, fermate);
    
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
      const nearestStop = autoAssignRoute(position);

      if (nearestStop) {
        // Auto-assegna solo la partenza usando RouteSelector
        if (window.RouteSelector && window.RouteSelector.selectFermata) {
          window.RouteSelector.selectFermata(nearestStop.index, 'partenza');

          // Aggiorna UI
          if (locationIcon) locationIcon.textContent = '✅';
          if (locationText) locationText.textContent = 'Partenza assegnata';
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
      userPosition = position;
      locationPermissionGranted = true;

      // Aggiorna UI
      if (fermateLocationIcon) fermateLocationIcon.textContent = '📍';
      if (fermateLocationText) fermateLocationText.textContent = 'Rilevata';
      showLocationNotification('Posizione rilevata! Ordinando fermate per distanza...', 'success');

      // Salva preferenza
      const Storage = getStorage();
      Storage.setItem('tpl.locationEnabled', 'true');

      // Ri-ordina le fermate per distanza usando il modal
      // Usa FermateModal.sortByDistance() se disponibile (preserva indici e event listener)
      if (window.FermateModal && window.FermateModal.sortByDistance) {
        const sorted = window.FermateModal.sortByDistance(userPosition);
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
          const sortedFermate = sortFermateByDistance(fermate.map(f => f.name), userPosition);

          // Re-renderizza la lista ordinata mantenendo gli indici
          // NOTA: Questo è un fallback che non dovrebbe essere necessario
          // Il modal dovrebbe gestire il rendering attraverso FermateModal.sortByDistance()
          console.warn('⚠️ Usando fallback manuale per ordinamento fermate (non dovrebbe essere necessario)');
          // Il rendering corretto è gestito da FermateModal.sortByDistance() che chiama renderFermateList()
          // Questo codice non viene eseguito se FermateModal è disponibile
        }
      }

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

