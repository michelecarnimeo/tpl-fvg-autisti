/**
 * Display Detector
 * Rileva e mostra informazioni sul display del dispositivo
 * 
 * Funzionalità:
 * - Rileva DPR (Device Pixel Ratio)
 * - Calcola risoluzione logica e fisica
 * - Identifica tipo display (Retina, HiDPI, etc.)
 * - Aggiorna UI con informazioni display
 * - Monitora resize per aggiornamenti dinamici
 */

(function () {
  'use strict';

  /**
   * Rileva informazioni sul display
   * @returns {Object} Oggetto con informazioni display
   */
  function detectDisplayInfo() {
    const dpr = window.devicePixelRatio || 1;
    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;
    const physicalWidth = Math.round(screenWidth * dpr);
    const physicalHeight = Math.round(screenHeight * dpr);

    let typeName = 'Standard';

    if (dpr >= 3) {
      typeName = 'Super Retina / Ultra HD';
    } else if (dpr >= 2) {
      typeName = 'Retina / HiDPI';
    } else if (dpr > 1) {
      typeName = 'Alta Densità';
    }

    return {
      dpr,
      typeName,
      screenWidth,
      screenHeight,
      physicalWidth,
      physicalHeight,
      isHighDPI: dpr >= 2
    };
  }

  /**
   * Aggiorna l'UI con le informazioni del display
   * @param {Object} displayInfo - Informazioni display da displayInfo()
   */
  function updateDisplayUI(displayInfo) {
    const typeEl = document.getElementById('test-display-type');
    const dprEl = document.getElementById('test-display-dpr');
    const logicalEl = document.getElementById('test-display-logical');
    const physicalEl = document.getElementById('test-display-physical');
    const highDpiBadge = document.getElementById('test-display-highdpi-badge');
    const viewportEl = document.getElementById('test-display-viewport');

    if (typeEl) typeEl.textContent = displayInfo.typeName;
    if (dprEl) dprEl.textContent = displayInfo.dpr.toFixed(2) + 'x';
    if (logicalEl) logicalEl.textContent = displayInfo.screenWidth + ' × ' + displayInfo.screenHeight + ' px';
    if (physicalEl) physicalEl.textContent = displayInfo.physicalWidth + ' × ' + displayInfo.physicalHeight + ' px';

    // Viewport (aggiornato automaticamente)
    if (viewportEl) {
      viewportEl.textContent = window.innerWidth + ' × ' + window.innerHeight + ' px';
    }

    // Badge High DPI con colori
    if (highDpiBadge) {
      if (displayInfo.isHighDPI) {
        highDpiBadge.textContent = 'Sì';
        highDpiBadge.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        highDpiBadge.style.color = 'white';
      } else {
        highDpiBadge.textContent = 'No';
        highDpiBadge.style.background = 'var(--grigio-medio)';
        highDpiBadge.style.color = 'var(--testo-secondario)';
      }
    }

    // Log console
    console.log('🖥️ Display rilevato:', {
      tipo: displayInfo.typeName,
      dpr: displayInfo.dpr,
      risoluzione: displayInfo.screenWidth + 'x' + displayInfo.screenHeight,
      fisica: displayInfo.physicalWidth + 'x' + displayInfo.physicalHeight,
      viewport: window.innerWidth + 'x' + window.innerHeight,
      highDPI: displayInfo.isHighDPI
    });
  }

  /**
   * Aggiorna solo il viewport (per resize veloci)
   */
  function updateViewportOnly() {
    const viewportEl = document.getElementById('test-display-viewport');
    if (viewportEl) {
      viewportEl.textContent = window.innerWidth + ' × ' + window.innerHeight + ' px';
    }
  }

  /**
   * Setup pulsante refresh
   */
  function setupRefreshButton() {
    const refreshBtn = document.getElementById('test-display-refresh');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => {
        const displayInfo = detectDisplayInfo();
        updateDisplayUI(displayInfo);
      });
    }
  }

  /**
   * Setup listener resize con debounce
   */
  function setupResizeListener() {
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const displayInfo = detectDisplayInfo();
        updateDisplayUI(displayInfo);
      }, 250);
    });
  }

  /**
   * Inizializza il modulo
   */
  function init() {
    const displayInfo = detectDisplayInfo();
    updateDisplayUI(displayInfo);
    setupRefreshButton();
    setupResizeListener();
  }

  // Avvia al caricamento
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // API pubblica
  window.DisplayDetector = {
    detect: detectDisplayInfo,
    updateUI: updateDisplayUI,
    updateViewport: updateViewportOnly
  };

  console.log('✅ Modulo display-detector.js caricato');
})();

