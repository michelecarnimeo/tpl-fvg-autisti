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
   * Esegue tutti i test del modulo PWA Install Banner.
   */
  window.testPWAInstall = async function() {
    const output = 'output-pwa-install';
    const outputEl = document.getElementById(output);
    
    if (!outputEl) {
      console.error('Elemento output non trovato:', output);
      return;
    }

    // Reset output
    outputEl.innerHTML = '';
    outputEl.style.display = 'block';

    const log = (message, type = 'info') => {
      if (typeof TestUtils !== 'undefined' && TestUtils.log) {
        TestUtils.log(output, message, type);
      } else {
        console.log(`[${type}] ${message}`);
      }
    };

    const updateStatus = (id, status) => {
      const statusEl = document.getElementById(id);
      if (statusEl) {
        statusEl.textContent = status === 'pass' ? '✅ Pass' : status === 'fail' ? '❌ Fail' : '⏳ In attesa';
        statusEl.className = `test-status ${status === 'pass' ? 'pass' : status === 'fail' ? 'fail' : 'pending'}`;
      }
    };

    try {
      log('🧪 Inizio test PWA Install Banner...', 'info');

      // Test 1: Banner HTML presente
      const banner = document.getElementById('pwa-install-banner');
      if (banner) {
        log('✅ Banner HTML trovato nella pagina', 'success');
        updateStatus('test-pwa-install-banner-html', 'pass');
      } else {
        log('❌ Banner HTML non trovato nella pagina', 'error');
        updateStatus('test-pwa-install-banner-html', 'fail');
      }

      // Test 2: Modulo PWAInstall caricato
      if (typeof window.PWAInstall !== 'undefined') {
        log('✅ Modulo PWAInstall caricato correttamente', 'success');
        updateStatus('test-pwa-install-module', 'pass');
      } else {
        log('❌ Modulo PWAInstall non trovato. Assicurati che pwa-install.js sia caricato.', 'error');
        updateStatus('test-pwa-install-module', 'fail');
      }

      // Test 3: Condizioni installabilità
      if (typeof window.PWAInstall !== 'undefined' && typeof window.PWAInstall.checkInstallability === 'function') {
        const checks = window.PWAInstall.checkInstallability();
        log('🔍 Verifica condizioni installabilità:', 'info');
        log(`  - Service Worker: ${checks.hasServiceWorker ? '✅' : '❌'}`, checks.hasServiceWorker ? 'success' : 'error');
        log(`  - Manifest: ${checks.hasManifest ? '✅' : '❌'}`, checks.hasManifest ? 'success' : 'error');
        log(`  - HTTPS: ${checks.isHTTPS ? '✅' : '❌'}`, checks.isHTTPS ? 'success' : 'error');
        log(`  - Già installata (Standalone): ${checks.isStandalone ? '✅ Sì' : '❌ No'}`, checks.isStandalone ? 'info' : 'info');
        log(`  - Deferred Prompt: ${checks.hasDeferredPrompt ? '✅ Disponibile' : '❌ Non disponibile'}`, checks.hasDeferredPrompt ? 'success' : 'warning');
        log(`  - User Agent: ${checks.userAgent}`, 'info');
        
        const allConditionsMet = checks.hasServiceWorker && checks.hasManifest && checks.isHTTPS && !checks.isStandalone;
        updateStatus('test-pwa-install-conditions', allConditionsMet ? 'pass' : 'fail');
      } else {
        log('❌ Impossibile verificare condizioni installabilità', 'error');
        updateStatus('test-pwa-install-conditions', 'fail');
      }

      log('✅ Test PWA Install Banner completati', 'success');
    } catch (error) {
      const errorMessage = `✗ Errore fatale: ${error.message}`;
      log(errorMessage, 'error');
      console.error('Errore test PWA Install Banner:', error);
    }
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
            
          case 'pwa-install':
            if (typeof window.testPWAInstall === 'function') {
              window.testPWAInstall();
            } else {
              console.error('❌ testPWAInstall non disponibile');
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
   * Inizializza event delegation per pulsanti PWA Install Banner
   */
  function initPWAInstallEventDelegation() {
    if (document.body.dataset.pwaInstallDelegationAdded === 'true') {
      return;
    }

    document.body.addEventListener('click', (e) => {
      const button = e.target.closest('[data-pwa-install-action]');
      if (button && button.classList.contains('test-button')) {
        e.preventDefault();
        e.stopPropagation();
        const action = button.dataset.pwaInstallAction;
        const output = 'output-pwa-install';
        const outputEl = document.getElementById(output);
        
        const log = (message, type = 'info') => {
          if (outputEl) {
            outputEl.style.display = 'block';
            if (typeof TestUtils !== 'undefined' && TestUtils.log) {
              TestUtils.log(output, message, type);
            } else {
              const logEl = document.createElement('div');
              logEl.className = `test-log test-log-${type}`;
              logEl.textContent = message;
              outputEl.appendChild(logEl);
            }
          }
          console.log(`[${type}] ${message}`);
        };
        
        switch (action) {
          case 'show':
            if (typeof window.PWAInstall !== 'undefined' && typeof window.PWAInstall.testShowBanner === 'function') {
              const shown = window.PWAInstall.testShowBanner();
              if (shown) {
                log('✅ Banner mostrato manualmente', 'success');
              } else {
                log('❌ Impossibile mostrare banner', 'error');
              }
            } else if (typeof window.PWAInstall !== 'undefined' && typeof window.PWAInstall.show === 'function') {
              window.PWAInstall.show();
              log('✅ Banner mostrato manualmente', 'success');
            } else {
              log('❌ Modulo PWAInstall non disponibile', 'error');
            }
            break;
          case 'hide':
            if (typeof window.PWAInstall !== 'undefined' && typeof window.PWAInstall.hide === 'function') {
              window.PWAInstall.hide();
              log('✅ Banner nascosto manualmente', 'success');
            } else {
              log('❌ Modulo PWAInstall non disponibile', 'error');
            }
            break;
          case 'check':
            if (typeof window.PWAInstall !== 'undefined' && typeof window.PWAInstall.checkInstallability === 'function') {
              const checks = window.PWAInstall.checkInstallability();
              log('🔍 Verifica condizioni installabilità:', 'info');
              log(`  - Service Worker: ${checks.hasServiceWorker ? '✅' : '❌'}`, checks.hasServiceWorker ? 'success' : 'error');
              log(`  - Manifest: ${checks.hasManifest ? '✅' : '❌'}`, checks.hasManifest ? 'success' : 'error');
              log(`  - HTTPS: ${checks.isHTTPS ? '✅' : '❌'}`, checks.isHTTPS ? 'success' : 'error');
              log(`  - Già installata (Standalone): ${checks.isStandalone ? '✅ Sì' : '❌ No'}`, checks.isStandalone ? 'info' : 'info');
              log(`  - Deferred Prompt: ${checks.hasDeferredPrompt ? '✅ Disponibile' : '❌ Non disponibile'}`, checks.hasDeferredPrompt ? 'success' : 'warning');
              log(`  - User Agent: ${checks.userAgent}`, 'info');
            } else {
              log('❌ Impossibile verificare condizioni installabilità', 'error');
            }
            break;
          case 'simulate-android':
            if (typeof window.PWAInstall !== 'undefined' && typeof window.PWAInstall.simulateAndroid === 'function') {
              const success = window.PWAInstall.simulateAndroid();
              if (success) {
                log('✅ Simulazione Android attivata - Banner mostrato', 'success');
                log('💡 Nota: Il pulsante "Installa" non funzionerà realmente (serve beforeinstallprompt su dispositivo reale)', 'info');
              } else {
                log('❌ Impossibile attivare simulazione Android', 'error');
              }
            } else {
              log('❌ Funzione simulateAndroid non disponibile', 'error');
            }
            break;
          case 'simulate-ios':
            if (typeof window.PWAInstall !== 'undefined' && typeof window.PWAInstall.simulateIOS === 'function') {
              const success = window.PWAInstall.simulateIOS();
              if (success) {
                log('✅ Simulazione iOS attivata - Banner mostrato', 'success');
                log('💡 Nota: Su iOS l\'installazione è sempre manuale (Condividi → Aggiungi a Home)', 'info');
              } else {
                log('❌ Impossibile attivare simulazione iOS', 'error');
              }
            } else {
              log('❌ Funzione simulateIOS non disponibile', 'error');
            }
            break;
          case 'update-mode':
            if (typeof window.PWAInstall !== 'undefined' && typeof window.PWAInstall.updateMode === 'function') {
              const success = window.PWAInstall.updateMode();
              if (success) {
                log('✅ Modalità banner aggiornata in base al dispositivo corrente', 'success');
                log('💡 Nota: In DevTools, dopo aver cambiato dispositivo, ricarica la pagina (F5) per aggiornare User Agent', 'info');
              } else {
                log('⚠️ Banner non aggiornato (potrebbe essere viewport desktop o condizioni non soddisfatte)', 'warning');
              }
            } else {
              log('❌ Funzione updateMode non disponibile', 'error');
            }
            break;
        }
      }
    });

    document.body.dataset.pwaInstallDelegationAdded = 'true';
    console.log('✅ Event delegation per PWA Install Banner buttons inizializzata');
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
        initPWAInstallEventDelegation();
      });
    } else {
      // DOM già pronto
      initEventDelegation();
      initPerformanceSingleEventDelegation();
      initPerformanceUtilityEventDelegation();
      initPWAInstallEventDelegation();
    }
  }

  // Auto-inizializza event delegation
  initDelegation();

  console.log('✅ js/tests/test-ui-manifest-performance-wrappers.js caricato - Funzioni test disponibili nello scope globale');

})();

