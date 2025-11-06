// ===== UTILITY: SISTEMA SCALA INTERFACCIA =====
// Gestisce la scala dell'interfaccia (75%, 85%, 100%, 115%, 125%)
// Compatibile con il sistema di impostazioni in settings.js
// Può essere utilizzato standalone per pagine specifiche (es. prezzi.html)

(function() {
  'use strict';

  const STORAGE_KEY_SCALE = 'tpl.interfaceScale';
  const VALID_SCALES = ['75', '85', '100', '115', '125'];
  const DEFAULT_SCALE = '100';

  /**
   * Applica la scala all'interfaccia
   * @param {string} scale - Valore scala ('75', '85', '100', '115', '125')
   */
  function applyScale(scale) {
    // Valida il valore
    if (!VALID_SCALES.includes(scale)) {
      console.warn(`⚠️ Scala non valida: ${scale}. Usando default: ${DEFAULT_SCALE}`);
      scale = DEFAULT_SCALE;
    }

    // Rimuovi tutte le classi di scala precedenti
    // Supporta sia le classi su <html> (prezzi.html) che su <body> (settings.js)
    document.documentElement.classList.remove('scale-75', 'scale-85', 'scale-100', 'scale-115', 'scale-125');
    document.body.classList.remove('interface-scale-75', 'interface-scale-85', 'interface-scale-100', 'interface-scale-115', 'interface-scale-125');
    
    // Aggiungi la classe corretta su entrambi per compatibilità
    document.documentElement.classList.add('scale-' + scale);
    document.body.classList.add('interface-scale-' + scale);
    
    console.log('🔍 Scala interfaccia applicata:', scale + '%');
    
    // Salva preferenza
    try {
      localStorage.setItem(STORAGE_KEY_SCALE, scale);
    } catch (error) {
      console.error('❌ Errore nel salvataggio della scala:', error);
    }
  }

  /**
   * Ottiene la scala corrente salvata
   * @returns {string} Scala salvata o default
   */
  function getSavedScale() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SCALE);
      return VALID_SCALES.includes(saved) ? saved : DEFAULT_SCALE;
    } catch {
      return DEFAULT_SCALE;
    }
  }

  /**
   * Inizializza il sistema scala interfaccia
   * Applica la scala salvata e configura i radio buttons se presenti
   */
  function init() {
    // Leggi scala salvata (default 100)
    const savedScale = getSavedScale();
    
    // Setup radio buttons se presenti nella pagina
    const scaleRadios = document.querySelectorAll('input[name="interface-scale"]');
    if (scaleRadios && scaleRadios.length > 0) {
      scaleRadios.forEach(radio => {
        // Imposta il radio button corretto come checked
        if (radio.value === savedScale) {
          radio.checked = true;
        }
        
        // Aggiungi event listener per cambio scala
        radio.addEventListener('change', (e) => {
          if (e.target.checked) {
            applyScale(e.target.value);
            
            // Se disponibile, chiama anche la funzione di settings.js per feedback aptico
            if (typeof window.Settings !== 'undefined' && typeof window.Settings.setInterfaceScale === 'function') {
              window.Settings.setInterfaceScale(e.target.value);
            }
          }
        });
      });
    }
    
    // Applica scala iniziale
    applyScale(savedScale);
  }

  /**
   * Applica la scala manualmente (per uso esterno)
   * @param {string} scale - Valore scala
   */
  function setScale(scale) {
    applyScale(scale);
  }

  /**
   * Ottiene la scala corrente
   * @returns {string} Scala corrente
   */
  function getScale() {
    return getSavedScale();
  }

  // Auto-inizializzazione quando il DOM è pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    // DOM già caricato
    init();
  }

  // Espone API pubblica
  window.InterfaceScale = {
    init: init,
    setScale: setScale,
    getScale: getScale,
    applyScale: applyScale
  };

})();

