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
      logContent.scrollTop = logContent.scrollHeight;
      
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
      logContent.scrollTop = logContent.scrollHeight;
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

  console.log('✅ RouteSelector test wrappers caricati');
})();

