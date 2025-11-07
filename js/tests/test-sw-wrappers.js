/**
 * ========================================
 * TEST SERVICE WORKER WRAPPERS
 * Wrapper functions per retrocompatibilità con onclick inline
 * ========================================
 * 
 * Questo file definisce le funzioni globali che vengono chiamate
 * dagli onclick nell'HTML. Queste funzioni delegano a ServiceWorkerTests
 * quando disponibile.
 * 
 * IMPORTANTE: Questo file deve essere caricato PRIMA del DOM
 * per essere disponibile quando il browser legge gli onclick.
 * 
 * @version 1.0.0
 * @date 2025-11-06
 */

(function() {
  'use strict';

  /**
   * Esegue tutti i test del modulo Service Worker.
   */
  window.testServiceWorker = async function() {
    const output = 'output-sw';
    const outputEl = document.getElementById(output);
    
    if (!outputEl) {
      console.error('Elemento output non trovato:', output);
      return;
    }

    // Reset output
    outputEl.innerHTML = '';
    outputEl.style.display = 'block';

    // Aggiorna stato header a "in esecuzione"
    const statusEl = document.getElementById('sw-header-status');
    if (statusEl) {
      statusEl.classList.remove('status-pending', 'status-success', 'status-error');
      statusEl.classList.add('status-running');
      statusEl.textContent = 'In esecuzione';
    }

    // Usa TestUtils se disponibile, altrimenti fallback
    const log = (message, type = 'info') => {
      if (typeof TestUtils !== 'undefined' && TestUtils.log) {
        TestUtils.log(output, message, type);
      } else {
        const logDiv = document.createElement('div');
        logDiv.className = `console-log ${type}`;
        logDiv.textContent = message;
        outputEl.appendChild(logDiv);
        console.log(`[${type}] ${message}`);
      }
    };

    const updateStatus = (id, status) => {
      if (typeof TestUtils !== 'undefined' && TestUtils.updateTestStatus) {
        TestUtils.updateTestStatus(id, status);
      } else {
        const testElement = document.getElementById(id);
        if (testElement) {
          const statusSpan = testElement.querySelector('.test-status');
          if (statusSpan) {
            statusSpan.className = `test-status ${status}`;
            statusSpan.textContent = status === 'pass' ? 'Passato' : status === 'fail' ? 'Fallito' : status === 'running' ? 'In esecuzione' : 'In attesa';
          }
        }
      }
    };

    try {
      // Verifica che ServiceWorkerTests sia disponibile
      if (typeof ServiceWorkerTests === 'undefined') {
        log('✗ ServiceWorkerTests non disponibile! Assicurati che test-sw.js sia caricato.', 'error');
        updateStatus('sw-header', 'fail'); // Update header status
        return;
      }

      log('✓ ServiceWorkerTests disponibile', 'success');

      // Esegui tutti i test usando il modulo modulare
      const results = await ServiceWorkerTests.runAll({
        log: log,
        updateStatus: updateStatus
      });

      // Aggiorna l'header con le statistiche
      if (results && typeof window.updateSwHeader === 'function') {
        window.updateSwHeader(results.passed, results.failed, results.duration);
      }

    } catch (error) {
      if (typeof TestUtils !== 'undefined' && TestUtils.log) {
        TestUtils.log(output, `✗ Errore fatale: ${error.message}`, 'error');
        TestUtils.log(output, `Stack: ${error.stack}`, 'info');
      } else {
        console.error('Errore test service worker:', error);
      }
    }

    // Mostra i pulsanti log dopo l'esecuzione
    const logButtons = document.getElementById('sw-log-buttons');
    if (logButtons) {
      logButtons.style.display = 'flex';
    }
  };

  console.log('✅ js/tests/test-sw-wrappers.js caricato - Funzioni Service Worker test disponibili nello scope globale');

})();

