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
    const pwaAndroidHint = document.getElementById('pwa-android-hint');

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
     * Mostra il banner (solo su mobile)
     */
    function showBanner() {
      if (pwaBanner && !isStandalone() && isMobileViewport()) {
        pwaBanner.style.display = 'block';
      } else if (pwaBanner && !isMobileViewport()) {
        console.log('ℹ️ Banner PWA non mostrato: viewport desktop (larghezza > 768px)');
      }
    }

    /**
     * Nasconde il banner con animazione
     */
    function hideBanner() {
      if (pwaBanner) {
        // Aggiungi classe di chiusura per animazione
        pwaBanner.classList.add('closing');
        
        // Dopo l'animazione (300ms), nascondi completamente
        setTimeout(() => {
          pwaBanner.style.display = 'none';
          pwaBanner.classList.remove('closing');
        }, 300);
      }
    }
    
    /**
     * Mostra/nascondi hint iOS con animazione
     */
    function toggleIOSHint(show) {
      if (!pwaIosHint) return;
      
      if (show) {
        // Mostra hint
        pwaIosHint.style.display = 'block';
        // Forza reflow per attivare animazione
        pwaIosHint.offsetHeight;
        pwaIosHint.classList.add('show');
        // Scroll smooth verso hint dopo animazione
        setTimeout(() => {
          pwaIosHint.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 400);
      } else {
        // Nascondi hint
        pwaIosHint.classList.remove('show');
        // Dopo animazione, nascondi completamente
        setTimeout(() => {
          pwaIosHint.style.display = 'none';
        }, 400);
      }
    }
    
    /**
     * Mostra/nascondi hint Android con animazione
     */
    function toggleAndroidHint(show) {
      if (!pwaAndroidHint) return;
      
      if (show) {
        // Mostra hint
        pwaAndroidHint.style.display = 'block';
        // Forza reflow per attivare animazione
        pwaAndroidHint.offsetHeight;
        pwaAndroidHint.classList.add('show');
        // Scroll smooth verso hint dopo animazione
        setTimeout(() => {
          pwaAndroidHint.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 400);
      } else {
        // Nascondi hint
        pwaAndroidHint.classList.remove('show');
        // Dopo animazione, nascondi completamente
        setTimeout(() => {
          pwaAndroidHint.style.display = 'none';
        }, 400);
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

    /**
     * Verifica se la viewport è in modalità mobile
     * @returns {boolean} true se la viewport è mobile (larghezza <= 768px)
     */
    function isMobileViewport() {
      // Controlla sia la larghezza della viewport che la media query
      return window.innerWidth <= 768 || window.matchMedia('(max-width: 768px)').matches;
    }

    // Rilevamento browser
    const isSafari = /^((?!chrome|android).)*safari/i.test(window.navigator.userAgent);
    const isChrome = /chrome|chromium|crios/i.test(window.navigator.userAgent) && !/edge|edg/i.test(window.navigator.userAgent);
    
    // Debug: Log rilevamento dispositivo/browser
    console.log('🔍 PWA Install - Rilevamento:', {
      userAgent: navigator.userAgent,
      isIOS: isIOSDevice(),
      isAndroid: isAndroidDevice(),
      isSafari: isSafari,
      isChrome: isChrome,
      isStandalone: isStandalone(),
      canShowAgain: canShowAgain(),
      isMobileViewport: isMobileViewport(),
      viewportWidth: window.innerWidth
    });

    // Gestione Android/Chrome via beforeinstallprompt
    window.addEventListener('beforeinstallprompt', (e) => {
      console.log('📱 beforeinstallprompt event ricevuto!', {
        isStandalone: isStandalone(),
        canShowAgain: canShowAgain()
      });
      
      // Mostra solo se non già installata e con frequenza
      if (isStandalone() || !canShowAgain()) {
        console.log('⚠️ Banner non mostrato:', {
          reason: isStandalone() ? 'App già installata' : 'Banner chiuso di recente'
        });
        return;
      }
      
      e.preventDefault();
      deferredInstallPrompt = e;
      // Nascondi hint iOS e Android (il pulsante Installa funziona)
      if (pwaIosHint) {
        pwaIosHint.style.display = 'none';
        pwaIosHint.classList.remove('show');
      }
      if (pwaAndroidHint) {
        pwaAndroidHint.style.display = 'none';
        pwaAndroidHint.classList.remove('show');
      }
      if (pwaBtnInstall) {
        pwaBtnInstall.style.display = 'inline-block';
        pwaBtnInstall.textContent = 'Installa';
      }
      // Mostra banner solo se viewport mobile
      if (isMobileViewport()) {
        showBanner();
        console.log('✅ Banner PWA mostrato (beforeinstallprompt)');
      } else {
        console.log('ℹ️ Banner PWA non mostrato: viewport desktop (larghezza > 768px)');
      }
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
          // iOS o Android senza evento: toggle hint con animazione
          const isIOS = isIOSDevice() && isSafari;
          const isAndroid = isAndroidDevice() && !isIOS;
          
          if (isIOS && pwaIosHint) {
            // iOS: toggle hint iOS
            const isVisible = pwaIosHint.classList.contains('show') || pwaIosHint.style.display === 'block';
            if (isVisible) {
              // Nascondi istruzioni
              toggleIOSHint(false);
              if (pwaBtnInstall) {
                pwaBtnInstall.textContent = 'Mostra istruzioni';
              }
            } else {
              // Mostra istruzioni
              toggleIOSHint(true);
              if (pwaBtnInstall) {
                pwaBtnInstall.textContent = 'Riduci';
              }
            }
          } else if (isAndroid && pwaAndroidHint) {
            // Android: toggle hint Android
            const isVisible = pwaAndroidHint.classList.contains('show') || pwaAndroidHint.style.display === 'block';
            if (isVisible) {
              // Nascondi istruzioni
              toggleAndroidHint(false);
              if (pwaBtnInstall) {
                pwaBtnInstall.textContent = 'Mostra istruzioni';
              }
            } else {
              // Mostra istruzioni
              toggleAndroidHint(true);
              if (pwaBtnInstall) {
                pwaBtnInstall.textContent = 'Riduci';
              }
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

    /**
     * Aggiorna il banner in base al dispositivo/browser corrente
     * Chiamata all'inizializzazione e quando cambia il dispositivo
     */
    function updateBannerMode() {
      // Rileva nuovamente dispositivo e browser (per supportare cambio in DevTools)
      const currentIsIOS = isIOSDevice();
      const currentIsAndroid = isAndroidDevice();
      const currentIsSafari = /^((?!chrome|android).)*safari/i.test(window.navigator.userAgent);
      const currentIsChrome = /chrome|chromium|crios/i.test(window.navigator.userAgent) && !/edge|edg/i.test(window.navigator.userAgent);
      const currentIsMobile = isMobileViewport();

      // Se il banner è già visibile, nascondilo prima di ri-configurarlo
      const wasVisible = pwaBanner && pwaBanner.style.display === 'block';

      // Se siamo in standalone, non mostrare il banner
      if (isStandalone()) {
        hideBanner();
        return;
      }

      // Se viewport desktop, non mostrare il banner
      if (!currentIsMobile) {
        if (wasVisible) {
          hideBanner();
        }
        return;
      }

      // Se non possiamo mostrare di nuovo, non mostrare
      if (!canShowAgain()) {
        return;
      }

      // Se abbiamo deferred prompt (Android reale), non sovrascrivere
      if (deferredInstallPrompt) {
        return;
      }

      // iOS Safari: configura per iOS (istruzioni già aperte)
      if (currentIsIOS && currentIsSafari) {
        // Nascondi hint Android se presente
        if (pwaAndroidHint) {
          pwaAndroidHint.style.display = 'none';
          pwaAndroidHint.classList.remove('show');
        }
        // Mostra hint iOS già aperto
        if (pwaIosHint) {
          toggleIOSHint(true);
        }
        if (pwaBtnInstall) {
          pwaBtnInstall.style.display = 'inline-block';
          pwaBtnInstall.textContent = 'Riduci';
        }
        if (!wasVisible) {
          showBanner();
          console.log('✅ Banner PWA aggiornato (iOS Safari - istruzioni aperte)');
        } else {
          console.log('🔄 Banner PWA aggiornato (iOS Safari - istruzioni aperte)');
        }
      } 
      // Android o altro mobile: configura per Android (istruzioni già aperte)
      else if (!currentIsIOS && currentIsMobile) {
        // Nascondi hint iOS se presente
        if (pwaIosHint) {
          pwaIosHint.style.display = 'none';
          pwaIosHint.classList.remove('show');
        }
        // Mostra hint Android già aperto (se non c'è deferredPrompt)
        if (!deferredInstallPrompt && pwaAndroidHint) {
          toggleAndroidHint(true);
        } else if (pwaAndroidHint) {
          // Se c'è deferredPrompt, nascondi hint (pulsante Installa funziona)
          pwaAndroidHint.style.display = 'none';
          pwaAndroidHint.classList.remove('show');
        }
        if (pwaBtnInstall) {
          pwaBtnInstall.style.display = 'inline-block';
          // Se c'è deferredPrompt, mostra "Installa", altrimenti "Riduci"
          if (deferredInstallPrompt) {
            pwaBtnInstall.textContent = 'Installa';
          } else {
            pwaBtnInstall.textContent = 'Riduci';
          }
        }
        if (!wasVisible) {
          showBanner();
          console.log('✅ Banner PWA aggiornato (Android/Altro mobile - istruzioni aperte)');
        } else {
          console.log('🔄 Banner PWA aggiornato (Android/Altro mobile - istruzioni aperte)');
        }
        if (!deferredInstallPrompt) {
          console.log('💡 Nota: In DevTools mobile, beforeinstallprompt non viene emesso. Testa su dispositivo reale per installazione.');
        }
      }
    }

    // Inizializza il banner
    updateBannerMode();

    // Listener per resize (rileva cambio dispositivo in DevTools)
    // Nota: In DevTools, quando cambi dispositivo, il User Agent cambia solo dopo reload
    // Per aggiornare immediatamente, usa PWAInstall.refresh() dopo aver cambiato dispositivo
    let resizeTimeout;
    let lastUserAgent = navigator.userAgent;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const isNowMobile = isMobileViewport();
        const currentUserAgent = navigator.userAgent;
        
        // Se cambia User Agent (cambio dispositivo in DevTools) o viewport mobile/desktop
        if (lastUserAgent !== currentUserAgent || isNowMobile) {
          lastUserAgent = currentUserAgent;
          console.log('🔄 Viewport o User Agent cambiato, aggiorno banner PWA...');
          updateBannerMode();
        }
      }, 300); // Debounce 300ms
    });

    // Listener per visibilità pagina (nasconde banner quando app va in background)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && isStandalone()) {
        hideBanner();
      }
    });

    // Debug: verifica condizioni
    console.log('🔍 PWA Install Banner - Debug condizioni:', {
      bannerFound: !!pwaBanner,
      isStandalone: isStandalone(),
      canShowAgain: canShowAgain(),
      isIOS: isIOSDevice(),
      isAndroid: isAndroidDevice(),
      isSafari: isSafari,
      isChrome: isChrome,
      hasDeferredPrompt: !!deferredInstallPrompt,
      userAgent: navigator.userAgent
    });

    console.log('✅ PWA Install Banner inizializzato');
    
    // Esponi updateBannerMode nell'API pubblica per aggiornamenti manuali
    if (typeof window.PWAInstall === 'object') {
      window.PWAInstall._updateBannerMode = updateBannerMode;
    }
    
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
        // Mostra solo se viewport mobile
        if (window.innerWidth <= 768 || window.matchMedia('(max-width: 768px)').matches) {
          pwaBanner.style.display = 'block';
          console.log('✅ Banner PWA mostrato manualmente (PWAInstall.show())');
        } else {
          console.log('ℹ️ Banner PWA non mostrato: viewport desktop (larghezza > 768px)');
          console.log('💡 Riduci la larghezza della finestra o usa DevTools mobile per vedere il banner');
        }
      }
    },
    hide: function() {
      const pwaBanner = document.getElementById('pwa-install-banner');
      if (pwaBanner) {
        pwaBanner.style.display = 'none';
        console.log('✅ Banner PWA nascosto manualmente (PWAInstall.hide())');
      }
    },
    getDeferredPrompt: function() {
      return deferredInstallPrompt;
    },
    setDeferredPrompt: function(prompt) {
      deferredInstallPrompt = prompt;
    },
    // Funzione di test: forza visualizzazione banner (per debug)
    testShowBanner: function() {
      const pwaBanner = document.getElementById('pwa-install-banner');
      const pwaBtnInstall = document.getElementById('pwa-install-button');
      const pwaIosHint = document.getElementById('pwa-ios-hint');
      
      if (!pwaBanner) {
        console.error('❌ Banner PWA non trovato nella pagina');
        return false;
      }
      
      // Verifica viewport mobile (solo warning, forza comunque per test)
      const isMobile = window.innerWidth <= 768 || window.matchMedia('(max-width: 768px)').matches;
      if (!isMobile) {
        console.warn('⚠️ TEST: viewport desktop rilevata, ma forzando visualizzazione per test');
      }
      
      // Mostra banner forzando la visualizzazione (per test, anche su desktop)
      pwaBanner.style.display = 'block';
      if (pwaBtnInstall) pwaBtnInstall.style.display = 'inline-block';
      if (pwaIosHint) pwaIosHint.style.display = 'none';
      
      console.log('🧪 TEST: Banner PWA mostrato forzatamente (PWAInstall.testShowBanner())');
      console.log('🔍 Debug stato:', {
        bannerVisible: pwaBanner.style.display === 'block',
        hasDeferredPrompt: !!deferredInstallPrompt,
        isStandalone: window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true,
        isMobileViewport: isMobile,
        viewportWidth: window.innerWidth
      });
      
      return true;
    },
    // Verifica condizioni installabilità
    checkInstallability: function() {
      const checks = {
        hasServiceWorker: 'serviceWorker' in navigator,
        hasManifest: !!document.querySelector('link[rel="manifest"]'),
        isHTTPS: location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1',
        isStandalone: window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true,
        hasDeferredPrompt: !!deferredInstallPrompt,
        userAgent: navigator.userAgent
      };
      
      console.log('🔍 PWA Installability Check:', checks);
      return checks;
    },
    // Simula modalità Android (per test)
    simulateAndroid: function() {
      const pwaBanner = document.getElementById('pwa-install-banner');
      const pwaBtnInstall = document.getElementById('pwa-install-button');
      const pwaIosHint = document.getElementById('pwa-ios-hint');
      
      if (!pwaBanner) {
        console.error('❌ Banner PWA non trovato nella pagina');
        return false;
      }
      
      // Verifica viewport mobile
      const isMobile = window.innerWidth <= 768 || window.matchMedia('(max-width: 768px)').matches;
      if (!isMobile) {
        console.warn('⚠️ Banner PWA: viewport desktop rilevata (larghezza > 768px)');
        console.log('💡 Il banner viene mostrato solo su mobile. Riduci la larghezza della finestra o usa DevTools mobile.');
        console.log('📏 Larghezza viewport attuale:', window.innerWidth, 'px');
        // Mostra comunque per test, ma avvisa
        console.log('🔧 Forzando visualizzazione per test (non in produzione)...');
      }
      
      // Simula comportamento Android: nascondi hint iOS, mostra hint Android
      const pwaAndroidHint = document.getElementById('pwa-android-hint');
      if (pwaIosHint) {
        pwaIosHint.style.display = 'none';
        pwaIosHint.classList.remove('show');
      }
      if (pwaAndroidHint) {
        pwaAndroidHint.style.display = 'block';
        pwaAndroidHint.offsetHeight; // Forza reflow
        pwaAndroidHint.classList.add('show');
      }
      if (pwaBtnInstall) {
        pwaBtnInstall.style.display = 'inline-block';
        pwaBtnInstall.textContent = 'Riduci';
      }
      
      // Mostra banner (forzato per test, anche su desktop)
      pwaBanner.style.display = 'block';
      
      console.log('🤖 Simulazione Android attivata');
      console.log('📱 Banner mostrato in modalità Android (simulata)');
      console.log('💡 Nota: Il pulsante "Installa" non funzionerà realmente (serve beforeinstallprompt su dispositivo reale)');
      console.log('🔍 Debug simulazione:', {
        bannerVisible: pwaBanner.style.display === 'block',
        hasDeferredPrompt: !!deferredInstallPrompt,
        isStandalone: window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true,
        isMobileViewport: isMobile,
        viewportWidth: window.innerWidth,
        userAgent: navigator.userAgent
      });
      
      return true;
    },
    // Simula modalità iOS (per test)
    simulateIOS: function() {
      const pwaBanner = document.getElementById('pwa-install-banner');
      const pwaBtnInstall = document.getElementById('pwa-install-button');
      const pwaIosHint = document.getElementById('pwa-ios-hint');
      
      if (!pwaBanner) {
        console.error('❌ Banner PWA non trovato nella pagina');
        return false;
      }
      
      // Verifica viewport mobile
      const isMobile = window.innerWidth <= 768 || window.matchMedia('(max-width: 768px)').matches;
      if (!isMobile) {
        console.warn('⚠️ Banner PWA: viewport desktop rilevata (larghezza > 768px)');
        console.log('💡 Il banner viene mostrato solo su mobile. Riduci la larghezza della finestra o usa DevTools mobile.');
        console.log('📏 Larghezza viewport attuale:', window.innerWidth, 'px');
        // Mostra comunque per test, ma avvisa
        console.log('🔧 Forzando visualizzazione per test (non in produzione)...');
      }
      
      // Simula comportamento iOS: mostra hint iOS già aperto, nascondi hint Android
      const pwaAndroidHint = document.getElementById('pwa-android-hint');
      if (pwaAndroidHint) {
        pwaAndroidHint.style.display = 'none';
        pwaAndroidHint.classList.remove('show');
      }
      if (pwaIosHint) {
        pwaIosHint.style.display = 'block';
        pwaIosHint.offsetHeight; // Forza reflow
        pwaIosHint.classList.add('show');
      }
      if (pwaBtnInstall) {
        pwaBtnInstall.style.display = 'inline-block';
        pwaBtnInstall.textContent = 'Riduci';
      }
      
      // Mostra banner (forzato per test, anche su desktop)
      pwaBanner.style.display = 'block';
      
      console.log('🍎 Simulazione iOS attivata');
      console.log('📱 Banner mostrato in modalità iOS (simulata)');
      console.log('💡 Nota: Su iOS l\'installazione è sempre manuale (Condividi → Aggiungi a Home)');
      console.log('🔍 Debug simulazione:', {
        bannerVisible: pwaBanner.style.display === 'block',
        hintVisible: pwaIosHint ? pwaIosHint.style.display === 'block' : false,
        isStandalone: window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true,
        isMobileViewport: isMobile,
        viewportWidth: window.innerWidth,
        userAgent: navigator.userAgent
      });
      
      return true;
    },
    // Verifica se viewport è mobile
    isMobileViewport: function() {
      return window.innerWidth <= 768 || window.matchMedia('(max-width: 768px)').matches;
    },
    // Aggiorna solo la modalità del banner (senza re-inizializzare tutto)
    // Utile quando cambi dispositivo in DevTools
    updateMode: function() {
      const pwaBanner = document.getElementById('pwa-install-banner');
      const pwaBtnInstall = document.getElementById('pwa-install-button');
      const pwaIosHint = document.getElementById('pwa-ios-hint');
      
      if (!pwaBanner) {
        console.error('❌ Banner PWA non trovato nella pagina');
        return false;
      }
      
      // Rileva dispositivo e browser corrente
      const userAgent = window.navigator.userAgent.toLowerCase();
      const currentIsIOS = /iphone|ipod|ipad/.test(userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      const currentIsSafari = /^((?!chrome|android).)*safari/i.test(window.navigator.userAgent);
      const currentIsMobile = window.innerWidth <= 768 || window.matchMedia('(max-width: 768px)').matches;
      
      console.log('🔄 Aggiornamento modalità banner PWA...', {
        isIOS: currentIsIOS,
        isSafari: currentIsSafari,
        isMobile: currentIsMobile,
        userAgent: navigator.userAgent,
        viewportWidth: window.innerWidth
      });
      
      // Se viewport desktop, nascondi banner
      if (!currentIsMobile) {
        pwaBanner.style.display = 'none';
        console.log('ℹ️ Banner nascosto: viewport desktop');
        return false;
      }
      
      // iOS Safari: mostra istruzioni aperte
      if (currentIsIOS && currentIsSafari) {
        const pwaAndroidHint = document.getElementById('pwa-android-hint');
        if (pwaAndroidHint) {
          pwaAndroidHint.style.display = 'none';
          pwaAndroidHint.classList.remove('show');
        }
        if (pwaIosHint) {
          pwaIosHint.style.display = 'block';
          pwaIosHint.offsetHeight; // Forza reflow
          pwaIosHint.classList.add('show');
        }
        if (pwaBtnInstall) {
          pwaBtnInstall.style.display = 'inline-block';
          pwaBtnInstall.textContent = 'Riduci';
        }
        pwaBanner.style.display = 'block';
        console.log('✅ Banner aggiornato: iOS Safari (istruzioni aperte)');
        return true;
      }
      // Android o altro: mostra hint Android aperto
      else if (!currentIsIOS && currentIsMobile) {
        if (pwaIosHint) {
          pwaIosHint.style.display = 'none';
          pwaIosHint.classList.remove('show');
        }
        const pwaAndroidHint = document.getElementById('pwa-android-hint');
        if (pwaAndroidHint) {
          pwaAndroidHint.style.display = 'block';
          pwaAndroidHint.offsetHeight; // Forza reflow
          pwaAndroidHint.classList.add('show');
        }
        if (pwaBtnInstall) {
          pwaBtnInstall.style.display = 'inline-block';
          pwaBtnInstall.textContent = 'Riduci';
        }
        pwaBanner.style.display = 'block';
        console.log('✅ Banner aggiornato: Android/Altro mobile (istruzioni aperte)');
        return true;
      }
      
      return false;
    },
    // Aggiorna il banner in base al dispositivo corrente (per cambio dispositivo in DevTools)
    refresh: function() {
      console.log('🔄 Aggiornamento banner PWA richiesto (refresh completo)...');
      // Ri-inizializza il modulo (richiama init)
      // Nota: In DevTools, dopo aver cambiato dispositivo, ricarica la pagina per aggiornare User Agent
      if (typeof init === 'function') {
        init();
      } else {
        console.warn('⚠️ Funzione init non disponibile, ricarica la pagina per aggiornare il banner');
        console.log('💡 In DevTools: dopo aver cambiato dispositivo, ricarica la pagina (F5) per vedere il cambio');
      }
    }
  };

  console.log('✅ js/components/pwa-install.js caricato - PWAInstall disponibile');
})();

