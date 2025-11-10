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

  /**
   * Inizializza event delegation per pulsante test Service Worker
   */
  function initSWEventDelegation() {
    // Verifica se il listener è già stato aggiunto
    if (document.body.dataset.swDelegationAdded === 'true') {
      return;
    }

    // Event delegation: listener per pulsanti con data-test="serviceworker"
    document.body.addEventListener('click', (e) => {
      const button = e.target.closest('[data-test="serviceworker"]');
      
      if (button && button.classList.contains('test-button')) {
        e.preventDefault();
        e.stopPropagation();
        
        if (typeof window.testServiceWorker === 'function') {
          window.testServiceWorker();
        } else {
          console.error('❌ testServiceWorker non disponibile');
        }
      }
    });

    // Marca come inizializzato
    document.body.dataset.swDelegationAdded = 'true';
    console.log('✅ Event delegation per Service Worker test inizializzata');
  }

  // Auto-inizializza event delegation quando il DOM è pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSWEventDelegation);
  } else {
    initSWEventDelegation();
  }

  /**
   * Esegue un singolo test Service Worker
   * @param {string} testId - ID del test da eseguire
   */
  window.runSingleSwTest = async function(testId) {
    const output = 'output-sw';
    const outputEl = document.getElementById(output);
    
    if (!outputEl) {
      console.error('Elemento output non trovato:', output);
      return;
    }

    // Mostra output
    outputEl.innerHTML = '';
    outputEl.style.display = 'block';

    // Utility functions
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
      if (typeof TestUtils !== 'undefined' && TestUtils.updateStatus) {
        TestUtils.updateStatus(id, status);
      } else if (typeof TestUtils !== 'undefined' && TestUtils.updateTestStatus) {
        TestUtils.updateTestStatus(id, status);
      }
    };

    log(`🧪 Esecuzione Test: ${testId}...`, 'info');
    log('', 'info');

    const startTime = performance.now();

    try {
      // Verifica che ServiceWorkerTests sia disponibile
      if (typeof ServiceWorkerTests === 'undefined') {
        throw new Error('ServiceWorkerTests non disponibile! Assicurati che test-sw.js sia caricato.');
      }

      const callbacks = {
        log: log,
        updateStatus: updateStatus
      };

      // Mappatura testId -> funzione di test
      const testMap = {
        'test-sw-registration': () => ServiceWorkerTests.testRegistration(callbacks),
        'test-sw-cache': () => ServiceWorkerTests.testCache(callbacks),
        'test-sw-version-not-cached': () => ServiceWorkerTests.testVersionNotCached(callbacks),
        'test-sw-cache-size': () => ServiceWorkerTests.testCacheSize(callbacks),
        'test-sw-messages': () => ServiceWorkerTests.testMessages(callbacks),
        'test-sw-offline-fallback': () => ServiceWorkerTests.testOfflineFallback(callbacks),
        'test-sw-update-mechanism': () => ServiceWorkerTests.testUpdateMechanism(callbacks),
        'test-sw-cache-cleanup': () => ServiceWorkerTests.testCacheCleanup(callbacks),
        'test-sw-static-assets': () => ServiceWorkerTests.testStaticAssets(callbacks),
        'test-sw-fetch-strategy': () => ServiceWorkerTests.testFetchStrategy(callbacks),
        'test-sw-clear-cache-message': () => ServiceWorkerTests.testClearCacheMessage(callbacks),
        'test-sw-skip-waiting-message': () => ServiceWorkerTests.testSkipWaitingMessage(callbacks),
        'test-sw-github-pages-patterns': () => ServiceWorkerTests.testGitHubPagesPatterns(callbacks),
        'test-sw-error-handling': () => ServiceWorkerTests.testErrorHandling(callbacks)
      };

      if (testMap[testId]) {
        await testMap[testId]();
      } else {
        log(`⚠️ Test "${testId}" non riconosciuto`, 'warn');
        return;
      }

      const endTime = performance.now();
      const duration = Math.round(endTime - startTime);
      
      log('', 'info');
      log(`✅ Test ${testId} completato in ${duration}ms`, 'success');

    } catch (error) {
      log(`✗ Test ${testId} fallito: ${error.message}`, 'error');
      updateStatus(testId, 'fail');
    }
  };

  /**
   * Inizializza event delegation per pulsanti test singoli Service Worker
   */
  function initSWSingleEventDelegation() {
    // Verifica se il listener è già stato aggiunto
    if (document.body.dataset.swSingleDelegationAdded === 'true') {
      return;
    }

    // Event delegation: listener per pulsanti con data-test="sw-single"
    document.body.addEventListener('click', (e) => {
      const button = e.target.closest('[data-test="sw-single"]');
      
      if (button && button.classList.contains('test-run-single')) {
        e.preventDefault();
        e.stopPropagation();
        
        const testId = button.dataset.testId;
        if (testId && typeof window.runSingleSwTest === 'function') {
          window.runSingleSwTest(testId);
        } else {
          console.error('❌ runSingleSwTest non disponibile o testId mancante');
        }
      }
    });

    // Marca come inizializzato
    document.body.dataset.swSingleDelegationAdded = 'true';
    console.log('✅ Event delegation per Service Worker singoli test inizializzata');
  }

  // Auto-inizializza event delegation per singoli test quando il DOM è pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSWSingleEventDelegation);
  } else {
    initSWSingleEventDelegation();
  }

  /**
   * Inizializza event delegation per pulsanti utility Service Worker
   * (Toggle groups, Reset, Copy/Download/Clear log)
   */
  function initSWUtilityEventDelegation() {
    // Verifica se il listener è già stato aggiunto
    if (document.body.dataset.swUtilityDelegationAdded === 'true') {
      return;
    }

    // Event delegation: listener per pulsanti utility Service Worker
    document.body.addEventListener('click', (e) => {
      const button = e.target.closest('[data-sw-action]');
      
      if (button && button.classList.contains('test-button')) {
        e.preventDefault();
        e.stopPropagation();
        
        const action = button.dataset.swAction;
        
        switch(action) {
          case 'toggle-open':
            if (typeof window.toggleAllSwGroups === 'function') {
              window.toggleAllSwGroups(true);
            }
            break;
            
          case 'toggle-close':
            if (typeof window.toggleAllSwGroups === 'function') {
              window.toggleAllSwGroups(false);
            }
            break;
            
          case 'reset':
            if (typeof window.resetSwTests === 'function') {
              window.resetSwTests();
            }
            break;
            
          case 'copy-log':
            if (typeof window.copySwLog === 'function') {
              window.copySwLog();
            }
            break;
            
          case 'download-log':
            if (typeof window.downloadSwLog === 'function') {
              window.downloadSwLog();
            }
            break;
            
          case 'clear-log':
            if (typeof window.clearSwLog === 'function') {
              window.clearSwLog();
            }
            break;
        }
      }
    });

    // Marca come inizializzato
    document.body.dataset.swUtilityDelegationAdded = 'true';
    console.log('✅ Event delegation per Service Worker utility buttons inizializzata');
  }

  // Auto-inizializza event delegation per utility buttons quando il DOM è pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSWUtilityEventDelegation);
  } else {
    initSWUtilityEventDelegation();
  }

  console.log('✅ js/tests/test-sw-wrappers.js caricato - Funzioni Service Worker test disponibili nello scope globale');

})();

