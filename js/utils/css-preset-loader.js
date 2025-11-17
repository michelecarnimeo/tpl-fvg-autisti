/**
 * 🎨 CSS Preset Loader
 * 
 * Carica automaticamente il preset CSS ottimizzato in base a:
 * - Dimensione schermo (desktop/tablet/mobile)
 * - Modalità PWA (standalone/fullscreen)
 * - Media queries
 * 
 * Riduce il CSS non necessario e migliora le performance.
 * 
 * @version 1.0.0
 * @date 17 Novembre 2025
 */

(function() {
  'use strict';

  /**
   * Rileva la modalità corrente del dispositivo
   * @returns {'desktop'|'tablet'|'mobile'|'pwa'} - Modalità rilevata
   */
  function detectMode() {
    // 1. Controlla se è PWA installata
    const isPWA = window.matchMedia('(display-mode: standalone)').matches ||
                  window.matchMedia('(display-mode: fullscreen)').matches ||
                  window.navigator.standalone === true;

    if (isPWA) {
      console.log('🎨 CSS Preset: PWA mode detected');
      return 'pwa';
    }

    // 2. Controlla dimensione schermo
    const width = window.innerWidth;

    if (width >= 1024) {
      console.log('🎨 CSS Preset: Desktop mode detected (width:', width, 'px)');
      return 'desktop';
    } else if (width >= 768) {
      console.log('🎨 CSS Preset: Tablet mode detected (width:', width, 'px)');
      return 'tablet';
    } else {
      console.log('🎨 CSS Preset: Mobile mode detected (width:', width, 'px)');
      return 'mobile';
    }
  }

  /**
   * Carica il preset CSS appropriato
   * @param {string} mode - Modalità da caricare ('desktop'|'tablet'|'mobile'|'pwa')
   */
  function loadPreset(mode) {
    // Verifica se già caricato (evita duplicati)
    const existingPreset = document.getElementById('css-preset');
    if (existingPreset) {
      console.log('⚠️ CSS Preset già caricato:', existingPreset.href);
      return;
    }

    // Crea link element per il preset
    const link = document.createElement('link');
    link.id = 'css-preset';
    link.rel = 'stylesheet';
    link.href = `css/presets/${mode}.css?v=1.0.0`;
    
    // Aggiungi attributo data per debugging
    link.dataset.mode = mode;
    
    // Performance: preload importante
    link.media = 'all';
    
    // Inserisci nel <head> come primo elemento CSS
    // (prima di tutti i componenti specifici della pagina)
    const firstLink = document.querySelector('link[rel="stylesheet"]');
    if (firstLink) {
      document.head.insertBefore(link, firstLink);
    } else {
      document.head.appendChild(link);
    }

    console.log('✅ CSS Preset caricato:', mode);
    
    // Salva modalità in localStorage per future ottimizzazioni
    try {
      localStorage.setItem('tpl.cssPresetMode', mode);
    } catch (e) {
      console.warn('⚠️ Impossibile salvare modalità preset:', e);
    }
  }

  /**
   * Gestisce il cambio di orientamento/resize
   * NON ricarica il CSS (troppo costoso), solo aggiorna localStorage
   */
  function handleResize() {
    const currentMode = detectMode();
    const savedMode = localStorage.getItem('tpl.cssPresetMode');
    
    if (currentMode !== savedMode) {
      console.log('📱 Modalità cambiata:', savedMode, '→', currentMode);
      console.log('💡 Ricarica la pagina per applicare il nuovo preset');
      
      // Aggiorna localStorage per il prossimo caricamento
      localStorage.setItem('tpl.cssPresetMode', currentMode);
      
      // Opzionale: mostra notifica all'utente
      // (non implementato per evitare dipendenze)
    }
  }

  /**
   * Inizializza il loader
   */
  function init() {
    // Rileva e carica modalità appropriata
    const mode = detectMode();
    loadPreset(mode);

    // Listener per cambio orientamento/resize
    // Throttle per performance (solo una volta ogni 500ms)
    let resizeTimeout;
    window.addEventListener('resize', function() {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(handleResize, 500);
    });

    // Listener per cambio modalità PWA
    if (window.matchMedia) {
      const pwaMedia = window.matchMedia('(display-mode: standalone)');
      if (pwaMedia.addEventListener) {
        pwaMedia.addEventListener('change', function(e) {
          if (e.matches) {
            console.log('📲 Entrato in modalità PWA');
            localStorage.setItem('tpl.cssPresetMode', 'pwa');
            console.log('💡 Ricarica la pagina per applicare il preset PWA');
          } else {
            console.log('🌐 Uscito dalla modalità PWA');
            const newMode = detectMode();
            localStorage.setItem('tpl.cssPresetMode', newMode);
          }
        });
      }
    }

    // Log informazioni debug
    console.log('📊 CSS Preset Info:', {
      mode: mode,
      width: window.innerWidth,
      height: window.innerHeight,
      isPWA: mode === 'pwa',
      userAgent: navigator.userAgent.substring(0, 50) + '...'
    });
  }

  // Esegui immediatamente per caricare CSS ASAP
  // Prima di DOMContentLoaded per evitare FOUC (Flash Of Unstyled Content)
  init();

  // Esponi API pubblica per debug
  window.CSSPresetLoader = {
    detectMode: detectMode,
    getCurrentMode: function() {
      return localStorage.getItem('tpl.cssPresetMode') || 'unknown';
    },
    forceReload: function(mode) {
      if (!['desktop', 'tablet', 'mobile', 'pwa'].includes(mode)) {
        console.error('❌ Modalità non valida:', mode);
        return;
      }
      localStorage.setItem('tpl.cssPresetMode', mode);
      location.reload();
    }
  };

  console.log('🎨 CSS Preset Loader inizializzato');
})();

