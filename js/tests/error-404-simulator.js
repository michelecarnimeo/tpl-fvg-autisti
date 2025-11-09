/**
 * js/tests/error-404-simulator.js
 *
 * Error 404 Simulator Module
 * Simula l'errore 404 per test (solo per test.html)
 *
 * Funzionalità:
 * - Simula errore 404 reindirizzando a 404.html
 * - Opzione per simulare in una nuova tab
 * - Logging per debug
 *
 * API Pubblica: window.Error404Simulator
 */

(function () {
  'use strict';

  /**
   * Simula l'errore 404
   * @param {Object} options - Opzioni per la simulazione
   * @param {boolean} options.newTab - Se true, apre 404.html in una nuova tab (default: false)
   * @param {boolean} options.log - Se true, logga l'azione (default: true)
   */
  function simulate404(options = {}) {
    const { newTab = false, log = true } = options;

    if (log) {
      console.log('🔴 Simulazione errore 404...', {
        newTab,
        currentUrl: window.location.href,
        targetUrl: '404.html'
      });
    }

    if (newTab) {
      // Apri in una nuova tab
      window.open('404.html', '_blank');
      if (log) {
        console.log('✅ Errore 404 aperto in una nuova tab');
      }
    } else {
      // Reindirizza alla pagina 404
      window.location.href = '404.html';
    }
  }

  /**
   * Inizializza il modulo
   * Cerca pulsanti con data-simulate-404 e aggiunge event listener
   */
  function init() {
    // Cerca tutti i pulsanti con attributo data-simulate-404
    const buttons = document.querySelectorAll('[data-simulate-404]');

    if (buttons.length === 0) {
      console.warn('⚠️ Error404Simulator: Nessun pulsante con data-simulate-404 trovato');
      return false;
    }

    buttons.forEach(button => {
      // Verifica se il listener è già stato aggiunto
      if (button.dataset.listenerAdded === 'true') {
        return;
      }

      // Leggi le opzioni dall'attributo data
      const newTab = button.dataset.newTab === 'true';
      const log = button.dataset.log !== 'false'; // Default: true

      button.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        simulate404({ newTab, log });
      });

      button.dataset.listenerAdded = 'true';
    });

    console.log(`✅ Error404Simulator: ${buttons.length} pulsante/i inizializzato/i`);
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
  window.Error404Simulator = {
    simulate: simulate404,
    init: init
  };

  console.log('✅ js/tests/error-404-simulator.js caricato - Error404Simulator disponibile');
})();

