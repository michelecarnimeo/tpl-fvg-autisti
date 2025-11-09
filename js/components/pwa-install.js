/**
 * js/components/pwa-install.js
 *
 * PWA Install Banner Module
 * Gestisce il banner di installazione PWA (comune a tutte le pagine)
 *
 * Funzionalità:
 * - Banner installazione PWA per Android/Chrome
 * - Istruzioni installazione per iOS/Safari
 * - Gestione beforeinstallprompt event
 * - Gestione appinstalled event
 * - Rilevamento dispositivo (iOS/Android)
 * - Gestione frequenza mostra banner (7 giorni)
 * - Nascondi banner quando app è in background
 *
 * API Pubblica: window.PWAInstall
 *
 * Dipendenze:
 * - window.Storage (da js/core/storage.js)
 */

(function () {
  'use strict';

  // Variabile globale per beforeinstallprompt event
  let deferredInstallPrompt = null;

  /**
   * Inizializza il modulo PWA Install Banner
   * Gestisce correttamente il DOM ready state
   */
  function init() {
    // Elementi DOM (cercati dinamicamente per supportare tutte le pagine)
    const pwaBanner = document.getElementById('pwa-install-banner');
    const pwaBtnInstall = document.getElementById('pwa-install-button');
    const pwaBtnLater = document.getElementById('pwa-install-later');
    const pwaIosHint = document.getElementById('pwa-ios-hint');

    // Se il banner non esiste nella pagina, esci
    if (!pwaBanner) {
      console.log('ℹ️ PWA Install Banner: Banner non trovato in questa pagina');
      return false;
    }

    // Usa Storage se disponibile, altrimenti fallback su localStorage
    const Storage = window.Storage || {
      getItem: (key, defaultValue = null) => {
        try {
          const item = localStorage.getItem(key);
          return item !== null ? item : defaultValue;
        } catch {
          return defaultValue;
        }
      },
      setItem: (key, value) => {
        try {
          localStorage.setItem(key, value);
          return true;
        } catch {
          return false;
        }
      },
      removeItem: (key) => {
        try {
          localStorage.removeItem(key);
          return true;
        } catch {
          return false;
        }
      }
    };

    /**
     * Verifica se l'app è in modalità standalone
     * @returns {boolean} true se l'app è installata come PWA
     */
    function isStandalone() {
      return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
    }

    /**
     * Verifica se il banner può essere mostrato di nuovo
     * Rilemostra dopo 7 giorni dall'ultima chiusura
     * @returns {boolean} true se può essere mostrato
     */
    function canShowAgain() {
      try {
        const lastDismiss = Storage.getItem('tpl.pwa.dismissTs');
        if (!lastDismiss) return true;
        const days = 7; // ripropone dopo 7 giorni
        return Date.now() - parseInt(lastDismiss, 10) > days * 24 * 60 * 60 * 1000;
      } catch {
        return true;
      }
    }

    /**
     * Mostra il banner
     */
    function showBanner() {
      if (pwaBanner && !isStandalone()) {
        pwaBanner.style.display = 'block';
      }
    }

    /**
     * Nasconde il banner
     */
    function hideBanner() {
      if (pwaBanner) {
        pwaBanner.style.display = 'none';
      }
    }

    /**
     * Rileva se il dispositivo è iOS
     * @returns {boolean} true se è iOS
     */
    function isIOSDevice() {
      const userAgent = window.navigator.userAgent.toLowerCase();
      const isIPhone = /iphone|ipod/.test(userAgent);
      const isIPad = /ipad/.test(userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      return isIPhone || isIPad;
    }

    /**
     * Rileva se il dispositivo è Android
     * @returns {boolean} true se è Android
     */
    function isAndroidDevice() {
      return /android/i.test(window.navigator.userAgent);
    }

    // Rilevamento browser
    const isSafari = /^((?!chrome|android).)*safari/i.test(window.navigator.userAgent);
    const isChrome = /chrome|chromium|crios/i.test(window.navigator.userAgent) && !/edge|edg/i.test(window.navigator.userAgent);

    // Gestione Android/Chrome via beforeinstallprompt
    window.addEventListener('beforeinstallprompt', (e) => {
      // Mostra solo se non già installata e con frequenza
      if (isStandalone() || !canShowAgain()) return;
      e.preventDefault();
      deferredInstallPrompt = e;
      if (pwaIosHint) pwaIosHint.style.display = 'none';
      if (pwaBtnInstall) pwaBtnInstall.style.display = 'inline-block';
      showBanner();
    });

    // Click su Installa (Android/Chrome/iOS)
    if (pwaBtnInstall) {
      pwaBtnInstall.addEventListener('click', async () => {
        if (deferredInstallPrompt) {
          // Android/Chrome: usa prompt nativo
          deferredInstallPrompt.prompt();
          const { outcome } = await deferredInstallPrompt.userChoice;
          deferredInstallPrompt = null;
          hideBanner();
          if (outcome === 'dismissed') {
            Storage.setItem('tpl.pwa.dismissTs', String(Date.now()));
          }
        } else {
          // iOS o browser senza evento: toggle hint con animazione
          if (pwaIosHint) {
            const isVisible = pwaIosHint.style.display === 'block';
            if (isVisible) {
              pwaIosHint.style.display = 'none';
            } else {
              pwaIosHint.style.display = 'block';
              // Scroll smooth verso hint
              setTimeout(() => {
                pwaIosHint.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
              }, 100);
            }
          }
        }
      });
    }

    // Click su Più tardi
    if (pwaBtnLater) {
      pwaBtnLater.addEventListener('click', () => {
        hideBanner();
        Storage.setItem('tpl.pwa.dismissTs', String(Date.now()));
      });
    }

    // Evento installata
    window.addEventListener('appinstalled', () => {
      hideBanner();
      Storage.removeItem('tpl.pwa.dismissTs');
      deferredInstallPrompt = null;
    });

    // iOS: mostra banner con hint per istruzioni manuali
    if (isIOSDevice() && isSafari && !isStandalone() && canShowAgain()) {
      // iOS Safari: mostra hint e nascondi pulsante "Installa"
      if (pwaIosHint) pwaIosHint.style.display = 'block';
      if (pwaBtnInstall) pwaBtnInstall.textContent = 'Mostra istruzioni';
      showBanner();
    } else if (isAndroidDevice() && isChrome && !isStandalone() && canShowAgain() && !deferredInstallPrompt) {
      // Android Chrome ma senza beforeinstallprompt (già installata o browser non supporta)
      // Mostra comunque il banner per informare
      if (pwaIosHint) pwaIosHint.style.display = 'none';
      if (pwaBtnInstall) pwaBtnInstall.style.display = 'inline-block';
      showBanner();
    }

    // Listener per visibilità pagina (nasconde banner quando app va in background)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && isStandalone()) {
        hideBanner();
      }
    });

    console.log('✅ PWA Install Banner inizializzato');
    return true;
  }

  // Gestione DOM ready state
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    // DOM già pronto, inizializza immediatamente
    init();
  }

  // API Pubblica
  window.PWAInstall = {
    init: init,
    show: function() {
      const pwaBanner = document.getElementById('pwa-install-banner');
      if (pwaBanner) {
        pwaBanner.style.display = 'block';
      }
    },
    hide: function() {
      const pwaBanner = document.getElementById('pwa-install-banner');
      if (pwaBanner) {
        pwaBanner.style.display = 'none';
      }
    },
    getDeferredPrompt: function() {
      return deferredInstallPrompt;
    },
    setDeferredPrompt: function(prompt) {
      deferredInstallPrompt = prompt;
    }
  };

  console.log('✅ js/components/pwa-install.js caricato - PWAInstall disponibile');
})();

