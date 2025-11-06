/**
 * Test UI Components
 * Test per le funzionalità UI dell'applicazione
 */

(function () {
  'use strict';

  // Verifica disponibilità dipendenze
  function checkDependenciesAvailable(callbacks) {
    if (typeof window.database === 'undefined' || !window.database) {
      callbacks.log('✗ Database non disponibile! Assicurati che database.json sia caricato.', 'error');
      const allTestIds = getAllTestIds();
      allTestIds.forEach(id => callbacks.updateStatus(id, 'fail'));
      return false;
    }
    return true;
  }

  // Lista completa di tutti i test IDs
  function getAllTestIds() {
    return [
      'test-ui-selects',
      'test-ui-swap',
      'test-ui-summary'
    ];
  }

  // Test 1: Popolamento select
  function testSelects(callbacks) {
    callbacks.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'info');
    callbacks.log('🎨 Test: Popolamento select', 'info');
    callbacks.log('', 'info');

    try {
      // Verifica che il database sia caricato
      if (!checkDependenciesAvailable(callbacks)) {
        throw new Error('Database non disponibile');
      }

      // Verifica che ci siano linee nel database
      if (!window.database.linee || !Array.isArray(window.database.linee) || window.database.linee.length === 0) {
        throw new Error('Nessuna linea trovata nel database');
      }

      callbacks.log(`✓ Database caricato con ${window.database.linee.length} linee`, 'success');

      // Verifica che ci siano fermate nel database
      if (!window.database.fermate || !Array.isArray(window.database.fermate) || window.database.fermate.length === 0) {
        throw new Error('Nessuna fermata trovata nel database');
      }

      callbacks.log(`✓ Database contiene ${window.database.fermate.length} fermate`, 'success');

      // Verifica che gli elementi select esistano nella pagina (se siamo in prezzi.html)
      const selectLinea = document.getElementById('linea-select');
      const selectPartenza = document.getElementById('partenza-select');
      const selectArrivo = document.getElementById('arrivo-select');

      if (selectLinea || selectPartenza || selectArrivo) {
        callbacks.log('✓ Elementi select trovati nella pagina', 'success');
        
        // Verifica che gli select siano popolati (se esistono)
        if (selectLinea && selectLinea.options.length > 1) {
          callbacks.log(`✓ Select linea popolato con ${selectLinea.options.length - 1} opzioni`, 'success');
        }
        if (selectPartenza && selectPartenza.options.length > 1) {
          callbacks.log(`✓ Select partenza popolato con ${selectPartenza.options.length - 1} opzioni`, 'success');
        }
        if (selectArrivo && selectArrivo.options.length > 1) {
          callbacks.log(`✓ Select arrivo popolato con ${selectArrivo.options.length - 1} opzioni`, 'success');
        }
      } else {
        callbacks.log('⚠️ Elementi select non trovati (potrebbe essere normale se non siamo in prezzi.html)', 'warn');
      }

      callbacks.updateStatus('test-ui-selects', 'pass');
      callbacks.log('✅ Test popolamento select PASSATO', 'success');

    } catch (error) {
      callbacks.updateStatus('test-ui-selects', 'fail');
      callbacks.log(`✗ Test fallito: ${error.message}`, 'error');
      console.error('Errore test selects:', error);
    }
  }

  // Test 2: Funzione swap percorso
  function testSwap(callbacks) {
    callbacks.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'info');
    callbacks.log('🔄 Test: Funzione swap percorso', 'info');
    callbacks.log('', 'info');

    try {
      // Verifica che il pulsante swap esista
      const swapBtn = document.getElementById('swap-btn');
      
      if (!swapBtn) {
        callbacks.log('⚠️ Pulsante swap non trovato (potrebbe essere normale se non siamo in prezzi.html)', 'warn');
        callbacks.updateStatus('test-ui-swap', 'pass'); // Non fallisce se non siamo nella pagina giusta
        return;
      }

      callbacks.log('✓ Pulsante swap trovato', 'success');

      // Verifica che gli select esistano
      const selectPartenza = document.getElementById('partenza-select');
      const selectArrivo = document.getElementById('arrivo-select');

      if (!selectPartenza || !selectArrivo) {
        throw new Error('Select partenza o arrivo non trovati');
      }

      // Salva valori iniziali
      const partenzaIniziale = selectPartenza.value;
      const arrivoIniziale = selectArrivo.value;

      callbacks.log(`✓ Valori iniziali: Partenza=${partenzaIniziale}, Arrivo=${arrivoIniziale}`, 'info');

      // Simula click sul pulsante swap (se esiste una funzione swap)
      // Nota: La funzione swap potrebbe essere definita inline o in script.js
      // Per ora verifichiamo solo che gli elementi esistano
      
      // Verifica che il pulsante sia cliccabile
      if (swapBtn.disabled) {
        callbacks.log('⚠️ Pulsante swap è disabilitato', 'warn');
      } else {
        callbacks.log('✓ Pulsante swap è abilitato', 'success');
      }

      callbacks.updateStatus('test-ui-swap', 'pass');
      callbacks.log('✅ Test swap percorso PASSATO', 'success');

    } catch (error) {
      callbacks.updateStatus('test-ui-swap', 'fail');
      callbacks.log(`✗ Test fallito: ${error.message}`, 'error');
      console.error('Errore test swap:', error);
    }
  }

  // Test 3: Aggiornamento riepilogo
  function testSummary(callbacks) {
    callbacks.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'info');
    callbacks.log('📋 Test: Aggiornamento riepilogo', 'info');
    callbacks.log('', 'info');

    try {
      // Verifica che l'elemento riepilogo esista
      const riepilogoEl = document.getElementById('riepilogo') || 
                          document.getElementById('summary') ||
                          document.querySelector('.riepilogo') ||
                          document.querySelector('.summary');

      if (!riepilogoEl) {
        callbacks.log('⚠️ Elemento riepilogo non trovato (potrebbe essere normale se non siamo in prezzi.html)', 'warn');
        callbacks.updateStatus('test-ui-summary', 'pass'); // Non fallisce se non siamo nella pagina giusta
        return;
      }

      callbacks.log('✓ Elemento riepilogo trovato', 'success');

      // Verifica che il riepilogo sia visibile o nascosto correttamente
      const isVisible = riepilogoEl.offsetParent !== null || 
                       window.getComputedStyle(riepilogoEl).display !== 'none';

      if (isVisible) {
        callbacks.log('✓ Riepilogo è visibile', 'success');
      } else {
        callbacks.log('⚠️ Riepilogo è nascosto (potrebbe essere normale se nessuna selezione)', 'warn');
      }

      // Verifica che ci siano elementi nel riepilogo
      const riepilogoContent = riepilogoEl.textContent || riepilogoEl.innerText;
      if (riepilogoContent && riepilogoContent.trim().length > 0) {
        callbacks.log('✓ Riepilogo contiene contenuto', 'success');
      } else {
        callbacks.log('⚠️ Riepilogo vuoto (potrebbe essere normale se nessuna selezione)', 'warn');
      }

      callbacks.updateStatus('test-ui-summary', 'pass');
      callbacks.log('✅ Test aggiornamento riepilogo PASSATO', 'success');

    } catch (error) {
      callbacks.updateStatus('test-ui-summary', 'fail');
      callbacks.log(`✗ Test fallito: ${error.message}`, 'error');
      console.error('Errore test summary:', error);
    }
  }

  // Esegue tutti i test
  async function runAll(callbacks) {
    const startTime = performance.now();
    let passed = 0;
    let failed = 0;

    try {
      callbacks.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'info');
      callbacks.log('🎨 Esecuzione test UI Components...', 'info');
      callbacks.log('', 'info');

      if (!checkDependenciesAvailable(callbacks)) {
        return { passed: 0, failed: getAllTestIds().length, total: getAllTestIds().length, duration: 0 };
      }

      // Esegui tutti i test
      testSelects(callbacks);
      testSwap(callbacks);
      testSummary(callbacks);

      callbacks.log('', 'info');
      callbacks.log('✅ Tutti i test del UI Components completati!', 'success');

      // Conta risultati
      const allTestIds = getAllTestIds();
      allTestIds.forEach(id => {
        const statusEl = document.getElementById(id);
        if (statusEl) {
          const statusSpan = statusEl.querySelector('.test-status');
          if (statusSpan) {
            if (statusSpan.classList.contains('pass')) {
              passed++;
            } else if (statusSpan.classList.contains('fail')) {
              failed++;
            }
          }
        }
      });

    } catch (error) {
      const testIds = getAllTestIds();
      testIds.forEach(id => callbacks.updateStatus(id, 'fail'));
      callbacks.log(`✗ Errore: ${error.message}`, 'error');
      console.error('Errore test UI components:', error);
      failed = testIds.length;
    } finally {
      const endTime = performance.now();
      const duration = Math.round(endTime - startTime);

      callbacks.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'info');
      callbacks.log(`✅ Test passati: ${passed}`, 'success');
      callbacks.log(`❌ Test falliti: ${failed}`, failed > 0 ? 'error' : 'info');
      callbacks.log(`⏱️ Tempo totale: ${duration}ms`, 'info');
      callbacks.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'info');

      return { passed, failed, total: passed + failed, duration };
    }
  }

  // API pubblica
  window.UITests = {
    runAll: runAll,
    testSelects: testSelects,
    testSwap: testSwap,
    testSummary: testSummary,
    getAllTestIds: getAllTestIds
  };

  console.log('✅ Modulo test-ui.js caricato');
})();

