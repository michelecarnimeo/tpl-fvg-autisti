// ========================================
// WRAPPER FUNZIONI TEST PREZZI
// Funzioni globali per onclick attributes in test.html
// ========================================

(function() {
  'use strict';

  /**
   * Esegue tutti i test del modulo Prezzi
   * Wrapper globale per onclick attribute
   */
  window.testPriceCalculation = async function() {
    const output = 'output-price';
    const outputEl = document.getElementById(output);
    
    if (!outputEl) {
      console.error('Elemento output non trovato:', output);
      return;
    }

    // Pulisci output
    outputEl.innerHTML = '';
    outputEl.style.display = 'block';

    try {
      // Verifica che PrezziTests sia disponibile
      if (typeof PrezziTests === 'undefined') {
        if (typeof TestUtils !== 'undefined' && TestUtils.log) {
          TestUtils.log(output, '✗ PrezziTests non disponibile! Assicurati che test-prezzi.js sia caricato.', 'error');
          TestUtils.log(output, 'Verifica che lo script sia incluso: js/tests/test-prezzi.js', 'info');
        } else {
          console.error('PrezziTests non disponibile!');
        }
        return;
      }

      if (typeof TestUtils !== 'undefined' && TestUtils.log) {
        TestUtils.log(output, '✓ PrezziTests disponibile', 'success');
      }

      // Verifica che Pricing sia disponibile
      if (typeof Pricing === 'undefined') {
        if (typeof TestUtils !== 'undefined' && TestUtils.log) {
          TestUtils.log(output, '✗ Pricing non disponibile! Assicurati che prezzi.js sia caricato PRIMA di test-prezzi.js.', 'error');
          TestUtils.log(output, 'Ordine script corretto: prezzi.js → test-prezzi.js', 'info');
        } else {
          console.error('Pricing non disponibile!');
        }
        return;
      }

      if (typeof TestUtils !== 'undefined' && TestUtils.log) {
        TestUtils.log(output, '✓ Pricing disponibile', 'success');
      }

      // Ottieni tariffario da window (esposto da script.js dopo loadData o da testDatabaseLoad)
      let tariffario = (typeof window !== 'undefined' && window.tariffario && Array.isArray(window.tariffario))
        ? window.tariffario
        : [];
      let tariffarioAggiornato = (typeof window !== 'undefined' && window.tariffarioAggiornato)
        ? window.tariffarioAggiornato
        : null;

      // Verifica se loadData è disponibile (da script.js)
      const loadDataFn = (typeof loadData === 'function') ? loadData : null;

      // Se il tariffario è vuoto, prova a caricarlo
      if (tariffario.length === 0) {
        // Prova prima con loadData se disponibile
        if (loadDataFn) {
          if (typeof TestUtils !== 'undefined' && TestUtils.log) {
            TestUtils.log(output, '📥 Tariffario vuoto, caricamento in corso (loadData)...', 'info');
          }
          try {
            await loadDataFn();
            // Aggiorna tariffario dopo il caricamento
            tariffario = (typeof window !== 'undefined' && window.tariffario && Array.isArray(window.tariffario))
              ? window.tariffario
              : [];
            tariffarioAggiornato = (typeof window !== 'undefined' && window.tariffarioAggiornato)
              ? window.tariffarioAggiornato
              : null;
            
            if (typeof TestUtils !== 'undefined' && TestUtils.log) {
              TestUtils.log(output, `✓ Tariffario caricato: ${tariffario.length} linee`, 'success');
            }
          } catch (error) {
            if (typeof TestUtils !== 'undefined' && TestUtils.log) {
              TestUtils.log(output, `✗ Errore durante caricamento tariffario: ${error.message}`, 'error');
            }
          }
        } else {
          // Se loadData non è disponibile, prova a caricare direttamente database.json
          if (typeof TestUtils !== 'undefined' && TestUtils.log) {
            TestUtils.log(output, '📥 Tariffario vuoto, caricamento diretto database.json...', 'info');
          }
          try {
            const res = await fetch('database.json');
            if (res.ok) {
              const data = await res.json();
              // Esponi tariffario su window
              if (typeof window !== 'undefined') {
                window.tariffario = data;
                window.tariffarioAggiornato = null;
              }
              tariffario = data;
              tariffarioAggiornato = null;
              
              if (typeof TestUtils !== 'undefined' && TestUtils.log) {
                TestUtils.log(output, `✓ Tariffario caricato: ${tariffario.length} linee`, 'success');
              }
            } else {
              throw new Error(`Errore HTTP: ${res.status}`);
            }
          } catch (error) {
            if (typeof TestUtils !== 'undefined' && TestUtils.log) {
              TestUtils.log(output, `✗ Errore durante caricamento tariffario: ${error.message}`, 'error');
            }
          }
        }
      }

      if (typeof TestUtils !== 'undefined' && TestUtils.log) {
        TestUtils.log(output, `Tariffario: ${tariffario.length > 0 ? 'disponibile (' + tariffario.length + ' linee)' : 'vuoto'}`, tariffario.length > 0 ? 'success' : 'warn');
      }

      // Aggiorna header status a "In esecuzione"
      if (typeof window.updatePriceHeader === 'function') {
        const statusEl = document.getElementById('price-header-status');
        if (statusEl) {
          statusEl.classList.remove('status-pending', 'status-success', 'status-error');
          statusEl.classList.add('status-running');
          statusEl.textContent = 'In esecuzione';
        }
      }

      // Esegui tutti i test usando il modulo modulare
      const results = await PrezziTests.runAll(
        tariffario,
        tariffarioAggiornato,
        {
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
            } else {
              console.log(`[${status}] Test ${id}`);
            }
          }
        },
        loadDataFn // Callback per caricamento dati se necessario
      );

      // Aggiorna l'header con le statistiche
      if (results && typeof window.updatePriceHeader === 'function') {
        window.updatePriceHeader(results.passed, results.failed, results.duration);
      }
    } catch (error) {
      if (typeof TestUtils !== 'undefined' && TestUtils.log) {
        TestUtils.log(output, `✗ Errore fatale: ${error.message}`, 'error');
        TestUtils.log(output, `Stack: ${error.stack}`, 'info');
      } else {
        console.error('Errore test prezzi:', error);
      }
    }

    // Mostra i pulsanti log dopo l'esecuzione
    const logButtons = document.getElementById('price-log-buttons');
    if (logButtons) {
      logButtons.style.display = 'flex';
    }
  };

  /**
   * Esegue un singolo test Prezzi
   * @param {string} testId - ID del test da eseguire
   */
  window.runSinglePriceTest = async function(testId) {
    const output = 'output-price';
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
      // Verifica che PrezziTests sia disponibile
      if (typeof PrezziTests === 'undefined') {
        log('✗ PrezziTests non disponibile! Assicurati che test-prezzi.js sia caricato.', 'error');
        updateStatus(testId, 'fail');
        return;
      }

      // Verifica che Pricing sia disponibile
      if (typeof Pricing === 'undefined') {
        log('✗ Pricing non disponibile! Assicurati che prezzi.js sia caricato.', 'error');
        updateStatus(testId, 'fail');
        return;
      }

      // Ottieni tariffario da window (esposto da script.js dopo loadData o da testDatabaseLoad)
      let tariffario = (typeof window !== 'undefined' && window.tariffario && Array.isArray(window.tariffario))
        ? window.tariffario
        : [];
      let tariffarioAggiornato = (typeof window !== 'undefined' && window.tariffarioAggiornato)
        ? window.tariffarioAggiornato
        : null;

      // Verifica se loadData è disponibile (da script.js)
      const loadDataFn = (typeof loadData === 'function') ? loadData : null;

      // Se il tariffario è vuoto, prova a caricarlo
      if (tariffario.length === 0) {
        // Prova prima con loadData se disponibile
        if (loadDataFn) {
          try {
            await loadDataFn();
            // Aggiorna tariffario dopo il caricamento
            tariffario = (typeof window !== 'undefined' && window.tariffario && Array.isArray(window.tariffario))
              ? window.tariffario
              : [];
            tariffarioAggiornato = (typeof window !== 'undefined' && window.tariffarioAggiornato)
              ? window.tariffarioAggiornato
              : null;
          } catch (error) {
            log(`✗ Errore durante caricamento tariffario: ${error.message}`, 'error');
          }
        } else {
          // Se loadData non è disponibile, prova a caricare direttamente database.json
          try {
            const res = await fetch('database.json');
            if (res.ok) {
              const data = await res.json();
              // Esponi tariffario su window
              if (typeof window !== 'undefined') {
                window.tariffario = data;
                window.tariffarioAggiornato = null;
              }
              tariffario = data;
              tariffarioAggiornato = null;
            } else {
              throw new Error(`Errore HTTP: ${res.status}`);
            }
          } catch (error) {
            log(`✗ Errore durante caricamento tariffario: ${error.message}`, 'error');
          }
        }
      }

      // Mappatura testId -> funzione PrezziTests
      const testMap = {
        'test-pricing-calculate': PrezziTests.testCalculatePrice,
        'test-pricing-ticket-code': PrezziTests.testGetTicketCode,
        'test-pricing-format': PrezziTests.testFormatPrice,
        'test-pricing-validation': PrezziTests.testIsValidSelection,
        'test-pricing-route': PrezziTests.testIsRouteAvailable,
        'test-pricing-same-stop': PrezziTests.testSameStop,
        'test-pricing-out-of-range': PrezziTests.testOutOfRange,
        'test-pricing-fallback': PrezziTests.testFallback,
        'test-pricing-empty-tariffario': PrezziTests.testEmptyTariffario,
        'test-pricing-negative-indices': PrezziTests.testNegativeIndices,
        'test-pricing-string-indices': PrezziTests.testStringIndices,
        'test-pricing-zero-price': PrezziTests.testZeroPrice,
        'test-pricing-missing-matrices': PrezziTests.testMissingMatrices,
        'test-pricing-multiple-lines': PrezziTests.testMultipleLines,
        'test-pricing-performance': PrezziTests.testPerformance,
        'test-pricing-null-price': PrezziTests.testNullPrice,
        'test-pricing-undefined-price': PrezziTests.testUndefinedPrice,
        'test-pricing-string-price': PrezziTests.testStringPrice,
        'test-pricing-line-not-exists': PrezziTests.testLineNotExists,
        'test-pricing-result-structure': PrezziTests.testResultStructure,
        'test-pricing-nan-price': PrezziTests.testNaNPrice,
        'test-pricing-infinity-price': PrezziTests.testInfinityPrice,
        'test-pricing-negative-price': PrezziTests.testNegativePrice,
        'test-pricing-fermate-not-array': PrezziTests.testFermateNotArray,
        'test-pricing-code-with-spaces': PrezziTests.testCodeWithSpaces,
        'test-pricing-price-code-only': PrezziTests.testPriceCodeOnly,
        'test-pricing-fallback-actual': PrezziTests.testFallbackActual,
        'test-pricing-extreme-values': PrezziTests.testExtremeValues,
        'test-pricing-symmetry': PrezziTests.testSymmetry
      };

      // Esegui il singolo test
      updateStatus(testId, 'running');
      
      const testFunction = testMap[testId];
      if (testFunction && typeof testFunction === 'function') {
        await testFunction(tariffario, tariffarioAggiornato, {
          log: log,
          updateStatus: updateStatus
        }, loadDataFn);
      } else {
        log(`✗ Test "${testId}" non riconosciuto`, 'error');
        log('   I test disponibili sono tutti quelli elencati nella sezione Prezzi', 'info');
        updateStatus(testId, 'fail');
      }
    } catch (error) {
      log(`✗ Test ${testId} fallito: ${error.message}`, 'error');
      updateStatus(testId, 'fail');
    }

    // Mostra i pulsanti log dopo l'esecuzione
    const logButtons = document.getElementById('price-log-buttons');
    if (logButtons) {
      logButtons.style.display = 'flex';
    }
  };

  /**
   * Inizializza event delegation per pulsante test Prezzi
   */
  function initPrezziEventDelegation() {
    // Verifica se il listener è già stato aggiunto
    if (document.body.dataset.prezziDelegationAdded === 'true') {
      return;
    }

    // Event delegation: listener per pulsanti con data-test="price"
    document.body.addEventListener('click', (e) => {
      const button = e.target.closest('[data-test="price"]');
      
      if (button && button.classList.contains('test-button')) {
        e.preventDefault();
        e.stopPropagation();
        
        if (typeof window.testPriceCalculation === 'function') {
          window.testPriceCalculation();
        } else {
          console.error('❌ testPriceCalculation non disponibile');
        }
      }
    });

    // Marca come inizializzato
    document.body.dataset.prezziDelegationAdded = 'true';
    console.log('✅ Event delegation per Prezzi test inizializzata');
  }

  // Auto-inizializza event delegation quando il DOM è pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPrezziEventDelegation);
  } else {
    initPrezziEventDelegation();
  }

  /**
   * Inizializza event delegation per pulsanti test singoli Prezzi
   */
  function initPrezziSingleEventDelegation() {
    // Verifica se il listener è già stato aggiunto
    if (document.body.dataset.prezziSingleDelegationAdded === 'true') {
      return;
    }

    // Event delegation: listener per pulsanti con data-test="price-single"
    document.body.addEventListener('click', (e) => {
      const button = e.target.closest('[data-test="price-single"]');
      
      if (button && button.classList.contains('test-run-single')) {
        e.preventDefault();
        e.stopPropagation();
        
        const testId = button.dataset.testId;
        if (testId && typeof window.runSinglePriceTest === 'function') {
          window.runSinglePriceTest(testId);
        } else {
          console.error('❌ runSinglePriceTest non disponibile o testId mancante');
        }
      }
    });

    // Marca come inizializzato
    document.body.dataset.prezziSingleDelegationAdded = 'true';
    console.log('✅ Event delegation per Prezzi singoli test inizializzata');
  }

  // Auto-inizializza event delegation per singoli test quando il DOM è pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPrezziSingleEventDelegation);
  } else {
    initPrezziSingleEventDelegation();
  }

  /**
   * Inizializza event delegation per pulsanti utility Prezzi
   * (Toggle groups, Reset, Copy/Download/Clear log)
   */
  function initPrezziUtilityEventDelegation() {
    // Verifica se il listener è già stato aggiunto
    if (document.body.dataset.prezziUtilityDelegationAdded === 'true') {
      return;
    }

    // Event delegation: listener per pulsanti utility Prezzi
    document.body.addEventListener('click', (e) => {
      const button = e.target.closest('[data-price-action]');
      
      if (button && button.classList.contains('test-button')) {
        e.preventDefault();
        e.stopPropagation();
        
        const action = button.dataset.priceAction;
        
        switch(action) {
          case 'toggle-open':
            if (typeof window.toggleAllPriceGroups === 'function') {
              window.toggleAllPriceGroups(true);
            }
            break;
            
          case 'toggle-close':
            if (typeof window.toggleAllPriceGroups === 'function') {
              window.toggleAllPriceGroups(false);
            }
            break;
            
          case 'reset':
            if (typeof window.resetPriceTests === 'function') {
              window.resetPriceTests();
            }
            break;
            
          case 'copy-log':
            if (typeof window.copyPriceLog === 'function') {
              window.copyPriceLog();
            }
            break;
            
          case 'download-log':
            if (typeof window.downloadPriceLog === 'function') {
              window.downloadPriceLog();
            }
            break;
            
          case 'clear-log':
            if (typeof window.clearPriceLog === 'function') {
              window.clearPriceLog();
            }
            break;
        }
      }
    });

    // Marca come inizializzato
    document.body.dataset.prezziUtilityDelegationAdded = 'true';
    console.log('✅ Event delegation per Prezzi utility buttons inizializzata');
  }

  // Auto-inizializza event delegation per utility buttons quando il DOM è pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPrezziUtilityEventDelegation);
  } else {
    initPrezziUtilityEventDelegation();
  }

  console.log('✅ js/tests/test-prezzi-wrappers.js caricato - Funzioni Prezzi test disponibili nello scope globale');

})();

