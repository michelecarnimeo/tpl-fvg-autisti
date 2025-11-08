/**
 * Offline Notifications
 * Gestione notifiche offline/online dell'applicazione
 * 
 * Funzionalità:
 * - Banner notifica quando si perde la connessione
 * - Notifica quando la connessione viene ripristinata
 * - Integrazione con Service Worker
 * - Supporto per modalità test offline
 */

(function () {
  'use strict';

  // Stato connessione
  let isOnline = navigator.onLine;
  let offlineNotificationShown = false;

  // Elementi per notifiche offline
  let offlineBanner = null;

  /**
   * Crea il banner offline nel DOM
   */
  function createOfflineBanner() {
    if (offlineBanner) return;

    offlineBanner = document.createElement('div');
    offlineBanner.id = 'offline-banner';
    offlineBanner.className = 'offline-banner';
    offlineBanner.innerHTML = `
      <div class="offline-content">
        <span class="offline-icon pulse">📡</span>
        <span class="offline-text">Modalità offline - App funzionante</span>
        <button class="offline-close" onclick="hideOfflineBanner()">×</button>
      </div>
    `;

    document.body.appendChild(offlineBanner);

    // Animazione di entrata
    setTimeout(() => {
      if (offlineBanner) {
        offlineBanner.classList.add('show');
      }
    }, 100);
  }

  /**
   * Nasconde il banner offline
   */
  function hideOfflineBanner() {
    if (offlineBanner) {
      offlineBanner.classList.remove('show');
      setTimeout(() => {
        if (offlineBanner && offlineBanner.parentNode) {
          offlineBanner.parentNode.removeChild(offlineBanner);
          offlineBanner = null;
        }
      }, 300);
    }
    offlineNotificationShown = false;
  }

  /**
   * Mostra la notifica offline
   */
  function showOfflineNotification() {
    if (offlineNotificationShown) return;

    createOfflineBanner();
    offlineNotificationShown = true;

    // Auto-hide dopo 5 secondi se online (non dovrebbe succedere, ma per sicurezza)
    if (isOnline) {
      setTimeout(() => {
        if (isOnline) {
          hideOfflineBanner();
        }
      }, 5000);
    }
  }

  /**
   * Gestisce l'evento online (connessione ripristinata)
   */
  function handleOnline() {
    console.log('🌐 Connessione ripristinata');
    isOnline = true;

    if (offlineBanner) {
      // Aggiorna testo e stile quando torna online
      offlineBanner.classList.add('online');
      const textElement = offlineBanner.querySelector('.offline-text');
      const iconElement = offlineBanner.querySelector('.offline-icon');
      if (textElement) {
        textElement.textContent = 'Connessione ripristinata';
      }
      if (iconElement) {
        iconElement.textContent = '✅';
      }

      // Nasconde automaticamente dopo 2 secondi
      setTimeout(() => {
        hideOfflineBanner();
      }, 2000);
    }
  }

  /**
   * Gestisce l'evento offline (connessione persa)
   */
  function handleOffline() {
    console.log('📡 Connessione persa');
    isOnline = false;

    if (!offlineNotificationShown) {
      showOfflineNotification();
    }
  }

  /**
   * Gestisce i messaggi dal Service Worker
   */
  function handleServiceWorkerMessage(event) {
    if (event.data && event.data.type === 'OFFLINE_MODE') {
      console.log('📡 Service Worker: Modalità offline attivata');
      isOnline = false;

      if (!offlineNotificationShown) {
        showOfflineNotification();
      }
    }
  }

  /**
   * Verifica lo stato iniziale della connessione
   */
  function checkInitialState() {
    if (!navigator.onLine) {
      console.log('📡 App avviata in modalità offline');
      isOnline = false;
      setTimeout(() => {
        showOfflineNotification();
      }, 1000); // Delay per permettere caricamento app
    }
  }

  /**
   * Inizializza il modulo
   */
  function init() {
    // Listener per eventi online/offline del browser
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Listener per messaggi dal Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', handleServiceWorkerMessage);
    }

    // Verifica stato iniziale
    checkInitialState();
  }

  // API pubblica
  window.OfflineNotifications = {
    /**
     * Mostra la notifica offline
     */
    show: showOfflineNotification,

    /**
     * Nasconde la notifica offline
     */
    hide: hideOfflineBanner,

    /**
     * Verifica se siamo online
     * @returns {boolean} True se online, false se offline
     */
    isOnline: function () {
      return isOnline;
    },

    /**
     * Verifica se la notifica è mostrata
     * @returns {boolean} True se la notifica è visibile
     */
    isShown: function () {
      return offlineNotificationShown;
    },

    /**
     * Inizializza il modulo (chiamato automaticamente)
     */
    init: init
  };

  // Espone hideOfflineBanner globalmente per retrocompatibilità (onclick nell'HTML)
  window.hideOfflineBanner = hideOfflineBanner;

  // Inizializza automaticamente quando il DOM è pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  console.log('✅ Modulo offline-notifications.js caricato');
})();

