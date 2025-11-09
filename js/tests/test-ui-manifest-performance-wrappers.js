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

  console.log('✅ js/tests/test-ui-manifest-performance-wrappers.js caricato - Funzioni test disponibili nello scope globale');

})();

