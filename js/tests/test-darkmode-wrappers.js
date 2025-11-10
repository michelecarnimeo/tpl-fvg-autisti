/**
 * ========================================
 * TEST DARK MODE WRAPPERS
 * Wrapper functions per retrocompatibilità e event delegation
 * ========================================
 * 
 * Questo file definisce:
 * - La funzione globale testDarkMode() per retrocompatibilità
 * - Event delegation per pulsanti con data-test="darkmode"
 * 
 * IMPORTANTE: Questo file deve essere caricato DOPO test-darkmode.js
 * e DOPO che il DOM è pronto per l'event delegation.
 * 
 * @version 1.0.0
 * @date 2025-11-09
 */

(function() {
  'use strict';

  /**
   * Esegue tutti i test del modulo Dark Mode.
   * Funzione wrapper per retrocompatibilità con onclick inline.
   */
  window.testDarkMode = async function() {
    const output = 'output-darkmode';
    const outputEl = document.getElementById(output);
    if (outputEl) {
      outputEl.innerHTML = '';
      outputEl.style.display = 'block';
    }

    try {
      if (typeof DarkModeTests === 'undefined') {
        if (typeof TestUtils !== 'undefined' && TestUtils.log) {
          TestUtils.log(output, '✗ DarkModeTests non disponibile! Assicurati che test-darkmode.js sia caricato.', 'error');
        } else {
          console.error('✗ DarkModeTests non disponibile!');
        }
        return;
      }

      if (typeof Settings === 'undefined') {
        if (typeof TestUtils !== 'undefined' && TestUtils.log) {
          TestUtils.log(output, '✗ Settings non disponibile! Assicurati che settings.js sia caricato.', 'error');
        } else {
          console.error('✗ Settings non disponibile!');
        }
        return;
      }

      if (typeof TestUtils !== 'undefined' && TestUtils.log) {
        TestUtils.log(output, '✓ DarkModeTests e Settings disponibili', 'success');
      }

      // Usa TestUtils se disponibile, altrimenti fallback
      const log = (message, type = 'info') => {
        if (typeof TestUtils !== 'undefined' && TestUtils.log) {
          TestUtils.log(output, message, type);
        } else {
          console.log(`[${type}] ${message}`);
        }
      };

      const updateStatus = (id, status) => {
        if (typeof TestUtils !== 'undefined' && TestUtils.updateTestStatus) {
          TestUtils.updateTestStatus(id, status);
        } else {
          console.log(`[${status}] Test ${id}`);
        }
      };

      const results = await DarkModeTests.runAll({
        log: log,
        updateStatus: updateStatus
      });

      if (results) {
        const resultType = results.failed > 0 ? 'error' : 'success';
        if (typeof TestUtils !== 'undefined' && TestUtils.log) {
          TestUtils.log(output, `✅ Test completati: ${results.passed} passati, ${results.failed} falliti`, resultType);
        } else {
          console.log(`✅ Test completati: ${results.passed} passati, ${results.failed} falliti`);
        }
      }
    } catch (error) {
      if (typeof TestUtils !== 'undefined' && TestUtils.log) {
        TestUtils.log(output, `✗ Errore fatale: ${error.message}`, 'error');
      } else {
        console.error('✗ Errore fatale:', error.message);
      }
      console.error('Errore test dark mode:', error);
    }
  };

  /**
   * Inizializza event delegation per pulsanti test dark mode
   */
  function initEventDelegation() {
    // Verifica se il listener è già stato aggiunto
    if (document.body.dataset.darkmodeDelegationAdded === 'true') {
      return;
    }

    // Event delegation: un listener per tutti i pulsanti con data-test="darkmode"
    document.body.addEventListener('click', (e) => {
      // Verifica se il click è su un pulsante con data-test="darkmode"
      const button = e.target.closest('[data-test="darkmode"]');
      
      if (button && button.classList.contains('test-button')) {
        e.preventDefault();
        e.stopPropagation();
        
        // Esegui il test
        if (typeof window.testDarkMode === 'function') {
          window.testDarkMode();
        } else {
          console.error('❌ testDarkMode non disponibile');
        }
      }
    });

    // Marca come inizializzato
    document.body.dataset.darkmodeDelegationAdded = 'true';
    console.log('✅ Event delegation per Dark Mode test inizializzata');
  }

  /**
   * Inizializza il modulo quando il DOM è pronto
   */
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initEventDelegation);
    } else {
      // DOM già pronto
      initEventDelegation();
    }
  }

  // Auto-inizializza
  init();

  console.log('✅ js/tests/test-darkmode-wrappers.js caricato - testDarkMode disponibile');
})();

