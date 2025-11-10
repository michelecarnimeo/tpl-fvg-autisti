/**
 * ========================================
 * TEST UI, MANIFEST, PERFORMANCE WRAPPERS
 * Wrapper functions per retrocompatibilità con onclick inline
 * ========================================
 * 
 * Questo file definisce le funzioni globali che vengono chiamate
 * dagli onclick nell'HTML. Queste funzioni delegano a UITests,
 * ManifestTests e PerformanceTests quando disponibili.
 * 
 * IMPORTANTE: Questo file deve essere caricato PRIMA del DOM
 * per essere disponibile quando il browser legge gli onclick.
 * 
 * @version 1.0.0
 * @date 2025-11-09
 */

(function() {
  'use strict';

  /**
   * Esegue tutti i test del modulo UI Components.
   */
  window.testUIComponents = async function() {
    const output = 'output-ui';
    const outputEl = document.getElementById(output);
    
    if (!outputEl) {
      console.error('Elemento output non trovato:', output);
      return;
    }

    // Reset output
    outputEl.innerHTML = '';
    outputEl.style.display = 'block';

    try {
      // Verifica che UITests sia disponibile
      if (typeof UITests === 'undefined') {
        if (typeof TestUtils !== 'undefined' && TestUtils.log) {
          TestUtils.log(output, '✗ UITests non disponibile! Assicurati che test-ui.js sia caricato.', 'error');
        } else {
          console.error('UITests non disponibile!');
        }
        return;
      }

      if (typeof TestUtils !== 'undefined' && TestUtils.log) {
        TestUtils.log(output, '✓ UITests disponibile', 'success');
      }

      // Esegui tutti i test usando il modulo modulare
      const results = await UITests.runAll({
        log: (message, type) => {
          if (typeof TestUtils !== 'undefined' && TestUtils.log) {
            TestUtils.log(output, message, type);
          } else {
            console.log(`[${type}] ${message}`);
          }
        },
        updateStatus: (id, status) => {
          if (typeof TestUtils !== 'undefined' && TestUtils.updateTestStatus) {
            TestUtils.updateTestStatus(id, status);
          }
        }
      });

      if (results) {
        const message = `✅ Test completati: ${results.passed} passati, ${results.failed} falliti`;
        if (typeof TestUtils !== 'undefined' && TestUtils.log) {
          TestUtils.log(output, message, results.failed > 0 ? 'error' : 'success');
        } else {
          console.log(message);
        }
      }
    } catch (error) {
      const errorMessage = `✗ Errore fatale: ${error.message}`;
      if (typeof TestUtils !== 'undefined' && TestUtils.log) {
        TestUtils.log(output, errorMessage, 'error');
      } else {
        console.error('Errore test UI components:', error);
      }
    }
  };

  /**
   * Esegue tutti i test del modulo Manifest.
   */
  window.testManifest = async function() {
    const output = 'output-manifest';
    const outputEl = document.getElementById(output);
    
    if (!outputEl) {
      console.error('Elemento output non trovato:', output);
      return;
    }

    // Reset output
    outputEl.innerHTML = '';
    outputEl.style.display = 'block';

    try {
      // Verifica che ManifestTests sia disponibile
      if (typeof ManifestTests === 'undefined') {
        if (typeof TestUtils !== 'undefined' && TestUtils.log) {
          TestUtils.log(output, '✗ ManifestTests non disponibile! Assicurati che test-manifest.js sia caricato.', 'error');
        } else {
          console.error('ManifestTests non disponibile!');
        }
        return;
      }

      if (typeof TestUtils !== 'undefined' && TestUtils.log) {
        TestUtils.log(output, '✓ ManifestTests disponibile', 'success');
      }

      // Esegui tutti i test usando il modulo modulare
      const results = await ManifestTests.runAll({
        log: (message, type) => {
          if (typeof TestUtils !== 'undefined' && TestUtils.log) {
            TestUtils.log(output, message, type);
          } else {
            console.log(`[${type}] ${message}`);
          }
        },
        updateStatus: (id, status) => {
          if (typeof TestUtils !== 'undefined' && TestUtils.updateTestStatus) {
            TestUtils.updateTestStatus(id, status);
          }
        }
      });

      if (results) {
        const message = `✅ Test completati: ${results.passed} passati, ${results.failed} falliti`;
        if (typeof TestUtils !== 'undefined' && TestUtils.log) {
          TestUtils.log(output, message, results.failed > 0 ? 'error' : 'success');
        } else {
          console.log(message);
        }
      }
    } catch (error) {
      const errorMessage = `✗ Errore fatale: ${error.message}`;
      if (typeof TestUtils !== 'undefined' && TestUtils.log) {
        TestUtils.log(output, errorMessage, 'error');
      } else {
        console.error('Errore test manifest:', error);
      }
    }
  };

  /**
   * Esegue tutti i test del modulo Performance.
   */
  window.testPerformance = async function() {
    const output = 'output-performance';
    const outputEl = document.getElementById(output);
    
    if (!outputEl) {
      console.error('Elemento output non trovato:', output);
      return;
    }

    // Reset output
    outputEl.innerHTML = '';
    outputEl.style.display = 'block';

    // Mostra pulsanti log
    const logButtons = document.getElementById('performance-log-buttons');
    if (logButtons) {
      logButtons.style.display = 'flex';
    }

    try {
      // Verifica che PerformanceTests sia disponibile
      if (typeof PerformanceTests === 'undefined') {
        if (typeof TestUtils !== 'undefined' && TestUtils.log) {
          TestUtils.log(output, '✗ PerformanceTests non disponibile! Assicurati che test-performance.js sia caricato.', 'error');
        } else {
          console.error('PerformanceTests non disponibile!');
        }
        return;
      }

      if (typeof TestUtils !== 'undefined' && TestUtils.log) {
        TestUtils.log(output, '✓ PerformanceTests disponibile', 'success');
      }

      // Esegui tutti i test usando il modulo modulare
      const results = await PerformanceTests.runAll({
        log: (message, type) => {
          if (typeof TestUtils !== 'undefined' && TestUtils.log) {
            TestUtils.log(output, message, type);
          } else {
            console.log(`[${type}] ${message}`);
          }
        },
        updateStatus: (id, status) => {
          if (typeof TestUtils !== 'undefined' && TestUtils.updateTestStatus) {
            TestUtils.updateTestStatus(id, status);
          }
        }
      });

      if (results) {
        const message = `✅ Test completati: ${results.passed} passati, ${results.failed} falliti`;
        if (typeof TestUtils !== 'undefined' && TestUtils.log) {
          TestUtils.log(output, message, results.failed > 0 ? 'error' : 'success');
        } else {
          console.log(message);
        }
      }
    } catch (error) {
      const errorMessage = `✗ Errore fatale: ${error.message}`;
      if (typeof TestUtils !== 'undefined' && TestUtils.log) {
        TestUtils.log(output, errorMessage, 'error');
      } else {
        console.error('Errore test performance:', error);
      }
    }
  };

  /**
   * Esegue un singolo test Performance.
   * @param {string} testId - ID del test da eseguire
   */
  window.runSinglePerformanceTest = async function(testId) {
    const output = 'output-performance';
    const outputEl = document.getElementById(output);
    
    if (!outputEl) {
      console.error('Elemento output non trovato:', output);
      return;
    }

    // Reset output
    outputEl.innerHTML = '';
    outputEl.style.display = 'block';

    // Mostra pulsanti log
    const logButtons = document.getElementById('performance-log-buttons');
    if (logButtons) {
      logButtons.style.display = 'flex';
    }

    try {
      // Verifica che PerformanceTests sia disponibile
      if (typeof PerformanceTests === 'undefined') {
        if (typeof TestUtils !== 'undefined' && TestUtils.log) {
          TestUtils.log(output, '✗ PerformanceTests non disponibile! Assicurati che test-performance.js sia caricato.', 'error');
        } else {
          console.error('PerformanceTests non disponibile!');
        }
        return;
      }

      const callbacks = {
        log: (message, type) => {
          if (typeof TestUtils !== 'undefined' && TestUtils.log) {
            TestUtils.log(output, message, type);
          } else {
            console.log(`[${type}] ${message}`);
          }
        },
        updateStatus: (id, status) => {
          if (typeof TestUtils !== 'undefined' && TestUtils.updateTestStatus) {
            TestUtils.updateTestStatus(id, status);
          }
        }
      };

      // Esegui il test specifico
      if (testId === 'test-perf-load-time') {
        await PerformanceTests.testLoadTime(callbacks);
      } else if (testId === 'test-perf-calc-time') {
        await PerformanceTests.testCalcTime(callbacks);
      } else {
        throw new Error(`Test ID sconosciuto: ${testId}`);
      }
    } catch (error) {
      const errorMessage = `✗ Errore fatale: ${error.message}`;
      if (typeof TestUtils !== 'undefined' && TestUtils.log) {
        TestUtils.log(output, errorMessage, 'error');
      } else {
        console.error('Errore test performance:', error);
      }
    }
  };

  /**
   * Reset completo dei test Performance.
   */
  window.resetPerformanceTests = function() {
    const output = 'output-performance';
    const outputEl = document.getElementById(output);
    const logButtons = document.getElementById('performance-log-buttons');
    
    // Reset output
    if (outputEl) {
      outputEl.innerHTML = '';
      outputEl.style.display = 'none';
    }
    
    // Nascondi pulsanti log
    if (logButtons) {
      logButtons.style.display = 'none';
    }
    
    // Reset status test items
    const testIds = ['test-perf-load-time', 'test-perf-calc-time'];
    testIds.forEach(id => {
      const testItem = document.getElementById(id);
      if (testItem) {
        const statusSpan = testItem.querySelector('.test-status');
        if (statusSpan) {
          statusSpan.className = 'test-status pending';
          statusSpan.textContent = 'In attesa';
        }
      }
    });
  };

  /**
   * Inizializza event delegation per pulsanti test UI, Manifest e Performance
   */
  function initEventDelegation() {
    // Verifica se il listener è già stato aggiunto
    if (document.body.dataset.uiManifestPerfDelegationAdded === 'true') {
      return;
    }

    // Event delegation: un listener per tutti i pulsanti con data-test
    document.body.addEventListener('click', (e) => {
      // Verifica se il click è su un pulsante con data-test
      const button = e.target.closest('[data-test]');
      
      if (button && button.classList.contains('test-button')) {
        const testType = button.dataset.test;
        
        e.preventDefault();
        e.stopPropagation();
        
        // Esegui il test corrispondente
        switch(testType) {
          case 'ui':
            if (typeof window.testUIComponents === 'function') {
              window.testUIComponents();
            } else {
              console.error('❌ testUIComponents non disponibile');
            }
            break;
            
          case 'manifest':
            if (typeof window.testManifest === 'function') {
              window.testManifest();
            } else {
              console.error('❌ testManifest non disponibile');
            }
            break;
            
          case 'performance':
            if (typeof window.testPerformance === 'function') {
              window.testPerformance();
            } else {
              console.error('❌ testPerformance non disponibile');
            }
            break;
        }
      }
    });

    // Marca come inizializzato
    document.body.dataset.uiManifestPerfDelegationAdded = 'true';
    console.log('✅ Event delegation per UI/Manifest/Performance test inizializzata');
  }

  /**
   * Inizializza event delegation per test singoli Performance
   */
  function initPerformanceSingleEventDelegation() {
    if (document.body.dataset.performanceSingleDelegationAdded === 'true') {
      return;
    }

    document.body.addEventListener('click', (e) => {
      const button = e.target.closest('[data-test="performance-single"]');
      if (button && button.classList.contains('test-run-single')) {
        e.preventDefault();
        e.stopPropagation();
        const testId = button.dataset.testId;
        if (testId && typeof window.runSinglePerformanceTest === 'function') {
          window.runSinglePerformanceTest(testId);
        } else {
          console.error('❌ runSinglePerformanceTest non disponibile o testId mancante');
        }
      }
    });

    document.body.dataset.performanceSingleDelegationAdded = 'true';
    console.log('✅ Event delegation per Performance singoli test inizializzata');
  }

  /**
   * Inizializza event delegation per pulsanti utility Performance
   */
  function initPerformanceUtilityEventDelegation() {
    if (document.body.dataset.performanceUtilityDelegationAdded === 'true') {
      return;
    }

    document.body.addEventListener('click', (e) => {
      const button = e.target.closest('[data-performance-action]');
      if (button && button.classList.contains('test-button')) {
        e.preventDefault();
        e.stopPropagation();
        const action = button.dataset.performanceAction;
        switch(action) {
          case 'reset':
            if (typeof window.resetPerformanceTests === 'function') {
              window.resetPerformanceTests();
            }
            break;
          case 'copy-log':
            if (typeof window.copyPerformanceLog === 'function') {
              window.copyPerformanceLog();
            }
            break;
          case 'download-log':
            if (typeof window.downloadPerformanceLog === 'function') {
              window.downloadPerformanceLog();
            }
            break;
          case 'clear-log':
            if (typeof window.clearPerformanceLog === 'function') {
              window.clearPerformanceLog();
            }
            break;
        }
      }
    });

    document.body.dataset.performanceUtilityDelegationAdded = 'true';
    console.log('✅ Event delegation per Performance utility buttons inizializzata');
  }

  /**
   * Inizializza event delegation quando il DOM è pronto
   */
  function initDelegation() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        initEventDelegation();
        initPerformanceSingleEventDelegation();
        initPerformanceUtilityEventDelegation();
      });
    } else {
      // DOM già pronto
      initEventDelegation();
      initPerformanceSingleEventDelegation();
      initPerformanceUtilityEventDelegation();
    }
  }

  // Auto-inizializza event delegation
  initDelegation();

  console.log('✅ js/tests/test-ui-manifest-performance-wrappers.js caricato - Funzioni test disponibili nello scope globale');

})();

