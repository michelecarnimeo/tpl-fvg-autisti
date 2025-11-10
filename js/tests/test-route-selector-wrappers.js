/**
 * js/tests/test-route-selector-wrappers.js
 * 
 * Wrapper functions per test RouteSelector
 * Funzioni globali per onclick in test.html
 */

(function() {
  'use strict';

  // Wrapper per testRouteSelector()
  window.testRouteSelector = async function() {
    const output = 'output-route';
    const outputEl = document.getElementById(output);
    
    if (!outputEl) {
      console.error('❌ Elemento output-route non trovato');
      return;
    }

    // Inizializza output
    outputEl.style.display = 'block';
    outputEl.innerHTML = '<div class="test-log-header">🧭 Test RouteSelector</div><div class="test-log-content"></div>';
    const logContent = outputEl.querySelector('.test-log-content');
    
    // Funzioni helper per log
    const log = function(message, type = 'info') {
      const timestamp = new Date().toLocaleTimeString('it-IT');
      const className = type === 'success' ? 'test-log-success' : type === 'error' ? 'test-log-error' : 'test-log-info';
      logContent.innerHTML += `<div class="${className}">[${timestamp}] ${message}</div>`;
      // Auto-scroll in fondo (posticipato per evitare forced reflow)
      requestAnimationFrame(() => {
        logContent.scrollTop = logContent.scrollHeight;
      });
      
      // Log anche in console
      if (type === 'error') {
        console.error(message);
      } else if (type === 'success') {
        console.log('✅', message);
      } else {
        console.log(message);
      }
    };

    const updateStatus = function(testId, status) {
      const testItem = document.getElementById(testId);
      if (testItem) {
        const statusEl = testItem.querySelector('.test-status');
        if (statusEl) {
          statusEl.className = `test-status ${status}`;
          statusEl.textContent = status === 'pass' ? '✓ Passato' : status === 'fail' ? '✗ Fallito' : 'In attesa';
        }
      }
    };

    // Funzione per aggiornare header
    const updateRouteHeader = function(passed, failed, duration) {
      const progressEl = document.getElementById('route-header-progress');
      const statusEl = document.getElementById('route-header-status');
      const passedEl = document.getElementById('route-header-passed');
      const failedEl = document.getElementById('route-header-failed');
      const timeEl = document.getElementById('route-header-time');
      const timestampEl = document.getElementById('route-header-timestamp');
      const barEl = document.getElementById('route-header-bar');
      
      const total = passed + failed;
      
      if (progressEl) progressEl.textContent = `${passed}/${total}`;
      if (statusEl) {
        statusEl.className = `test-header-status ${failed === 0 ? 'status-pass' : 'status-fail'}`;
        statusEl.textContent = failed === 0 ? 'Tutti passati' : `${failed} falliti`;
      }
      if (passedEl) passedEl.textContent = passed;
      if (failedEl) failedEl.textContent = failed;
      if (timeEl) timeEl.textContent = `${(duration * 1000).toFixed(0)}ms`;
      if (timestampEl) {
        timestampEl.textContent = new Date().toLocaleTimeString('it-IT');
        timestampEl.setAttribute('data-ts', Date.now().toString());
      }
      if (barEl) {
        const progress = total > 0 ? (passed / total) * 100 : 0;
        barEl.style.width = `${progress}%`;
        barEl.setAttribute('data-progress', progress.toString());
      }
    };

    try {
      log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'info');
      log('🧭 Inizio test RouteSelector...', 'info');
      
      // Verifica dipendenze
      if (typeof RouteSelectorTests === 'undefined') {
        throw new Error('RouteSelectorTests non disponibile. Assicurati che test-route-selector.js sia caricato.');
      }
      
      if (typeof RouteSelector === 'undefined') {
        throw new Error('RouteSelector non disponibile. Assicurati che route-selector.js sia caricato.');
      }

      log('✓ RouteSelectorTests disponibile', 'success');
      
      // Carica tariffario se non disponibile
      if (typeof window.Tariffario !== 'undefined' && window.Tariffario.load) {
        log('📦 Caricamento tariffario...', 'info');
        await window.Tariffario.load();
        log('✓ Tariffario caricato', 'success');
      }

      // Esegui test
      const results = await RouteSelectorTests.runAll({ log: log, updateStatus: updateStatus });
      
      if (results) {
        updateRouteHeader(results.passed, results.failed, results.duration);
        log(`✅ Test completati: ${results.passed} passati, ${results.failed} falliti in ${results.duration.toFixed(2)}s`, 'success');
        
        // Mostra pulsanti log
        const logButtons = document.getElementById('route-log-buttons');
        if (logButtons) {
          logButtons.style.display = 'flex';
        }
      }
      
    } catch (error) {
      log(`❌ Errore durante i test: ${error.message}`, 'error');
      console.error('❌ Errore test RouteSelector:', error);
      updateStatus('test-route-selector', 'fail');
      
      // Mostra pulsanti log anche in caso di errore
      const logButtons = document.getElementById('route-log-buttons');
      if (logButtons) {
        logButtons.style.display = 'flex';
      }
    }
  };

  // Wrapper per runSingleRouteTest()
  window.runSingleRouteTest = async function(testId) {
    const output = 'output-route';
    const outputEl = document.getElementById(output);
    
    if (!outputEl) {
      console.error('❌ Elemento output-route non trovato');
      return;
    }

    // Inizializza output
    outputEl.style.display = 'block';
    if (!outputEl.innerHTML) {
      outputEl.innerHTML = '<div class="test-log-header">🧭 Test RouteSelector</div><div class="test-log-content"></div>';
    }
    const logContent = outputEl.querySelector('.test-log-content');
    
    // Funzioni helper
    const log = function(message, type = 'info') {
      const timestamp = new Date().toLocaleTimeString('it-IT');
      const className = type === 'success' ? 'test-log-success' : type === 'error' ? 'test-log-error' : 'test-log-info';
      logContent.innerHTML += `<div class="${className}">[${timestamp}] ${message}</div>`;
      // Auto-scroll in fondo (posticipato per evitare forced reflow)
      requestAnimationFrame(() => {
        logContent.scrollTop = logContent.scrollHeight;
      });
    };

    const updateStatus = function(id, status) {
      if (id === testId) {
        const testItem = document.getElementById(id);
        if (testItem) {
          const statusEl = testItem.querySelector('.test-status');
          if (statusEl) {
            statusEl.className = `test-status ${status}`;
            statusEl.textContent = status === 'pass' ? '✓ Passato' : status === 'fail' ? '✗ Fallito' : 'In attesa';
          }
        }
      }
    };

    try {
      log(`🧪 Esecuzione test singolo: ${testId}...`, 'info');
      
      if (typeof RouteSelectorTests === 'undefined') {
        throw new Error('RouteSelectorTests non disponibile');
      }

      // Mappa test ID a funzioni
      const testMap = {
        'test-route-module': 'testModuleAvailable',
        'test-route-initial-state': 'testInitialState',
        'test-route-select-linea': 'testSelectLinea',
        'test-route-select-partenza': 'testSelectFermataPartenza',
        'test-route-select-arrivo': 'testSelectFermataArrivo',
        'test-route-swap': 'testSwapRoutes',
        'test-route-reset': 'testReset',
        'test-route-storage-save': 'testStorageSave',
        'test-route-storage-restore': 'testStorageRestore',
        'test-route-getters': 'testGetterMethods'
      };

      // Carica tariffario se necessario
      if (typeof window.Tariffario !== 'undefined' && window.Tariffario.load) {
        await window.Tariffario.load();
      }

      // Esegui test specifico
      // Nota: RouteSelectorTests.runAll esegue tutti i test
      // Per test singoli, dovremmo esporre le funzioni individuali
      // Per ora eseguiamo tutti i test ma aggiorniamo solo quello richiesto
      const results = await RouteSelectorTests.runAll({ log: log, updateStatus: updateStatus });
      
      log(`✅ Test ${testId} completato`, 'success');
      
      // Mostra pulsanti log
      const logButtons = document.getElementById('route-log-buttons');
      if (logButtons) {
        logButtons.style.display = 'flex';
      }
      
    } catch (error) {
      log(`❌ Errore durante il test: ${error.message}`, 'error');
      updateStatus(testId, 'fail');
      
      // Mostra pulsanti log anche in caso di errore
      const logButtons = document.getElementById('route-log-buttons');
      if (logButtons) {
        logButtons.style.display = 'flex';
      }
    }
  };

  /**
   * Inizializza event delegation per pulsante test Route Selector
   */
  function initRouteEventDelegation() {
    // Verifica se il listener è già stato aggiunto
    if (document.body.dataset.routeDelegationAdded === 'true') {
      return;
    }

    // Event delegation: listener per pulsanti con data-test="route"
    document.body.addEventListener('click', (e) => {
      const button = e.target.closest('[data-test="route"]');
      
      if (button && button.classList.contains('test-button')) {
        e.preventDefault();
        e.stopPropagation();
        
        if (typeof window.testRouteSelector === 'function') {
          window.testRouteSelector();
        } else {
          console.error('❌ testRouteSelector non disponibile');
        }
      }
    });

    // Marca come inizializzato
    document.body.dataset.routeDelegationAdded = 'true';
    console.log('✅ Event delegation per Route Selector test inizializzata');
  }

  // Auto-inizializza event delegation quando il DOM è pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initRouteEventDelegation);
  } else {
    initRouteEventDelegation();
  }

  /**
   * Inizializza event delegation per pulsanti test singoli Route Selector
   */
  function initRouteSingleEventDelegation() {
    // Verifica se il listener è già stato aggiunto
    if (document.body.dataset.routeSingleDelegationAdded === 'true') {
      return;
    }

    // Event delegation: listener per pulsanti con data-test="route-single"
    document.body.addEventListener('click', (e) => {
      const button = e.target.closest('[data-test="route-single"]');
      
      if (button && button.classList.contains('test-run-single')) {
        e.preventDefault();
        e.stopPropagation();
        
        const testId = button.dataset.testId;
        if (testId && typeof window.runSingleRouteTest === 'function') {
          window.runSingleRouteTest(testId);
        } else {
          console.error('❌ runSingleRouteTest non disponibile o testId mancante');
        }
      }
    });

    // Marca come inizializzato
    document.body.dataset.routeSingleDelegationAdded = 'true';
    console.log('✅ Event delegation per Route Selector singoli test inizializzata');
  }

  // Auto-inizializza event delegation per singoli test quando il DOM è pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initRouteSingleEventDelegation);
  } else {
    initRouteSingleEventDelegation();
  }

  /**
   * Inizializza event delegation per pulsanti utility Route Selector
   * (Toggle groups, Reset, Copy/Download/Clear log)
   */
  function initRouteUtilityEventDelegation() {
    // Verifica se il listener è già stato aggiunto
    if (document.body.dataset.routeUtilityDelegationAdded === 'true') {
      return;
    }

    // Event delegation: listener per pulsanti utility Route Selector
    document.body.addEventListener('click', (e) => {
      const button = e.target.closest('[data-route-action]');
      
      if (button && button.classList.contains('test-button')) {
        e.preventDefault();
        e.stopPropagation();
        
        const action = button.dataset.routeAction;
        
        switch(action) {
          case 'toggle-open':
            if (typeof window.toggleAllRouteGroups === 'function') {
              window.toggleAllRouteGroups(true);
            }
            break;
            
          case 'toggle-close':
            if (typeof window.toggleAllRouteGroups === 'function') {
              window.toggleAllRouteGroups(false);
            }
            break;
            
          case 'reset':
            if (typeof window.resetRouteTests === 'function') {
              window.resetRouteTests();
            }
            break;
            
          case 'copy-log':
            if (typeof window.copyRouteLog === 'function') {
              window.copyRouteLog();
            }
            break;
            
          case 'download-log':
            if (typeof window.downloadRouteLog === 'function') {
              window.downloadRouteLog();
            }
            break;
            
          case 'clear-log':
            if (typeof window.clearRouteLog === 'function') {
              window.clearRouteLog();
            }
            break;
        }
      }
    });

    // Marca come inizializzato
    document.body.dataset.routeUtilityDelegationAdded = 'true';
    console.log('✅ Event delegation per Route Selector utility buttons inizializzata');
  }

  // Auto-inizializza event delegation per utility buttons quando il DOM è pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initRouteUtilityEventDelegation);
  } else {
    initRouteUtilityEventDelegation();
  }

  console.log('✅ RouteSelector test wrappers caricati');
})();

