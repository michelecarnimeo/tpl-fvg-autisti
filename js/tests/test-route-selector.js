/**
 * js/tests/test-route-selector.js
 * 
 * Suite di test per RouteSelector
 * Testa gestione selezione linea/partenza/arrivo, stato UI, Storage
 * 
 * API Pubblica: window.RouteSelectorTests
 */

(function() {
  'use strict';

  // Verifica dipendenze
  if (typeof RouteSelector === 'undefined') {
    console.error('❌ RouteSelector non disponibile');
    return;
  }

  if (typeof Pricing === 'undefined') {
    console.warn('⚠️ Pricing non disponibile, alcuni test potrebbero fallire');
  }

  // Test 1: Verifica modulo disponibile
  function testModuleAvailable(callbacks) {
    callbacks.log('Test disponibilità RouteSelector...', 'info');
    
    if (typeof RouteSelector !== 'undefined') {
      callbacks.updateStatus('test-route-module', 'pass');
      callbacks.log('✓ RouteSelector disponibile', 'success');
      callbacks.log(`  API: ${Object.keys(RouteSelector).join(', ')}`, 'info');
    } else {
      throw new Error('RouteSelector non disponibile');
    }
  }

  // Test 2: Verifica stato iniziale
  function testInitialState(callbacks) {
    callbacks.log('Test stato iniziale RouteSelector...', 'info');
    
    // Reset completo per assicurarsi che lo stato sia pulito
    // Questo è necessario perché altri test o esecuzioni precedenti potrebbero aver lasciato dei valori
    RouteSelector.reset();
    
    // Aspetta un momento per assicurarsi che il reset sia completo
    // (alcune operazioni potrebbero essere asincrone)
    const state = RouteSelector.getState();
    const expected = {
      lineaIdx: '',
      partenzaIdx: '',
      arrivoIdx: '',
      hasCalculated: false
    };

    // Verifica che lo stato sia vuoto dopo il reset
    // Accetta sia stringhe vuote che valori null/undefined
    const isEmpty = (state.lineaIdx === '' || state.lineaIdx === null || state.lineaIdx === undefined) &&
                    (state.partenzaIdx === '' || state.partenzaIdx === null || state.partenzaIdx === undefined) &&
                    (state.arrivoIdx === '' || state.arrivoIdx === null || state.arrivoIdx === undefined) &&
                    state.hasCalculated === false;

    if (isEmpty) {
      callbacks.updateStatus('test-route-initial-state', 'pass');
      callbacks.log('✓ Stato iniziale corretto', 'success');
      callbacks.log(`  Stato: ${JSON.stringify(state)}`, 'info');
    } else {
      // Se lo stato non è vuoto anche dopo il reset, c'è un problema
      throw new Error(`Stato iniziale errato (dopo reset): ${JSON.stringify(state)}`);
    }
  }

  // Test 3: Selezione linea
  function testSelectLinea(callbacks) {
    callbacks.log('Test selezione linea...', 'info');
    
    // Reset prima del test
    RouteSelector.reset();
    
    // Verifica tariffario disponibile
    const tariffario = window.Tariffario && window.Tariffario.getData ? window.Tariffario.getData() : window.tariffario;
    if (!tariffario || tariffario.length === 0) {
      callbacks.log('⚠️ Tariffario non disponibile, test saltato', 'warning');
      return;
    }

    const testLineaIdx = 0;
    const testNome = tariffario[testLineaIdx] ? tariffario[testLineaIdx].nome : 'Test Linea';

    RouteSelector.selectLinea(testLineaIdx, testNome);
    
    const state = RouteSelector.getState();
    if (state.lineaIdx === testLineaIdx && 
        state.partenzaIdx === '' && 
        state.arrivoIdx === '') {
      callbacks.updateStatus('test-route-select-linea', 'pass');
      callbacks.log('✓ Selezione linea funziona', 'success');
      callbacks.log(`  Linea selezionata: ${state.lineaIdx} (${testNome})`, 'info');
    } else {
      throw new Error(`Selezione linea fallita: ${JSON.stringify(state)}`);
    }
  }

  // Test 4: Selezione fermata (partenza)
  function testSelectFermataPartenza(callbacks) {
    callbacks.log('Test selezione fermata partenza...', 'info');
    
    // Verifica tariffario disponibile
    const tariffario = window.Tariffario && window.Tariffario.getData ? window.Tariffario.getData() : window.tariffario;
    if (!tariffario || tariffario.length === 0) {
      callbacks.log('⚠️ Tariffario non disponibile, test saltato', 'warning');
      return;
    }

    // Seleziona linea prima
    RouteSelector.selectLinea(0, tariffario[0].nome);
    
    const testPartenzaIdx = 0;
    RouteSelector.selectFermata(testPartenzaIdx, 'partenza');
    
    const state = RouteSelector.getState();
    if (state.partenzaIdx === testPartenzaIdx && 
        state.lineaIdx === 0) {
      callbacks.updateStatus('test-route-select-partenza', 'pass');
      callbacks.log('✓ Selezione partenza funziona', 'success');
      callbacks.log(`  Partenza selezionata: ${state.partenzaIdx}`, 'info');
    } else {
      throw new Error(`Selezione partenza fallita: ${JSON.stringify(state)}`);
    }
  }

  // Test 5: Selezione fermata (arrivo)
  function testSelectFermataArrivo(callbacks) {
    callbacks.log('Test selezione fermata arrivo...', 'info');
    
    // Verifica tariffario disponibile
    const tariffario = window.Tariffario && window.Tariffario.getData ? window.Tariffario.getData() : window.tariffario;
    if (!tariffario || tariffario.length === 0) {
      callbacks.log('⚠️ Tariffario non disponibile, test saltato', 'warning');
      return;
    }

    // Seleziona linea e partenza prima
    RouteSelector.selectLinea(0, tariffario[0].nome);
    RouteSelector.selectFermata(0, 'partenza');
    
    const testArrivoIdx = 5;
    RouteSelector.selectFermata(testArrivoIdx, 'arrivo');
    
    const state = RouteSelector.getState();
    if (state.arrivoIdx === testArrivoIdx && 
        state.partenzaIdx === 0 && 
        state.lineaIdx === 0) {
      callbacks.updateStatus('test-route-select-arrivo', 'pass');
      callbacks.log('✓ Selezione arrivo funziona', 'success');
      callbacks.log(`  Arrivo selezionato: ${state.arrivoIdx}`, 'info');
    } else {
      throw new Error(`Selezione arrivo fallita: ${JSON.stringify(state)}`);
    }
  }

  // Test 6: Swap partenza/arrivo
  function testSwapRoutes(callbacks) {
    callbacks.log('Test swap partenza/arrivo...', 'info');
    
    // Verifica tariffario disponibile
    const tariffario = window.Tariffario && window.Tariffario.getData ? window.Tariffario.getData() : window.tariffario;
    if (!tariffario || tariffario.length === 0) {
      callbacks.log('⚠️ Tariffario non disponibile, test saltato', 'warning');
      return;
    }

    // Setup: seleziona linea, partenza e arrivo
    RouteSelector.selectLinea(0, tariffario[0].nome);
    RouteSelector.selectFermata(0, 'partenza');
    RouteSelector.selectFermata(5, 'arrivo');
    
    const stateBefore = RouteSelector.getState();
    const oldPartenza = stateBefore.partenzaIdx;
    const oldArrivo = stateBefore.arrivoIdx;
    
    RouteSelector.swapRoutes();
    
    const stateAfter = RouteSelector.getState();
    if (stateAfter.partenzaIdx === oldArrivo && 
        stateAfter.arrivoIdx === oldPartenza) {
      callbacks.updateStatus('test-route-swap', 'pass');
      callbacks.log('✓ Swap partenza/arrivo funziona', 'success');
      callbacks.log(`  Prima: partenza=${oldPartenza}, arrivo=${oldArrivo}`, 'info');
      callbacks.log(`  Dopo: partenza=${stateAfter.partenzaIdx}, arrivo=${stateAfter.arrivoIdx}`, 'info');
    } else {
      throw new Error(`Swap fallito: ${JSON.stringify(stateAfter)}`);
    }
  }

  // Test 7: Reset selezioni
  function testReset(callbacks) {
    callbacks.log('Test reset selezioni...', 'info');
    
    // Verifica tariffario disponibile
    const tariffario = window.Tariffario && window.Tariffario.getData ? window.Tariffario.getData() : window.tariffario;
    if (!tariffario || tariffario.length === 0) {
      callbacks.log('⚠️ Tariffario non disponibile, test saltato', 'warning');
      return;
    }

    // Setup: seleziona tutto
    RouteSelector.selectLinea(0, tariffario[0].nome);
    RouteSelector.selectFermata(0, 'partenza');
    RouteSelector.selectFermata(5, 'arrivo');
    
    RouteSelector.reset();
    
    const state = RouteSelector.getState();
    if (state.lineaIdx === '' && 
        state.partenzaIdx === '' && 
        state.arrivoIdx === '' && 
        state.hasCalculated === false) {
      callbacks.updateStatus('test-route-reset', 'pass');
      callbacks.log('✓ Reset selezioni funziona', 'success');
    } else {
      throw new Error(`Reset fallito: ${JSON.stringify(state)}`);
    }
  }

  // Test 8: Storage (salvataggio)
  function testStorageSave(callbacks) {
    callbacks.log('Test salvataggio Storage...', 'info');
    
    // Verifica tariffario disponibile
    const tariffario = window.Tariffario && window.Tariffario.getData ? window.Tariffario.getData() : window.tariffario;
    if (!tariffario || tariffario.length === 0) {
      callbacks.log('⚠️ Tariffario non disponibile, test saltato', 'warning');
      return;
    }

    // Setup: seleziona tutto
    RouteSelector.selectLinea(0, tariffario[0].nome);
    RouteSelector.selectFermata(0, 'partenza');
    RouteSelector.selectFermata(5, 'arrivo');
    
    // Verifica che Storage abbia i valori
    // Storage.getItem può restituire stringhe o numeri (se parsati come JSON)
    // Accettiamo entrambi i formati
    const Storage = window.Storage || {
      getItem: (key) => {
        const val = localStorage.getItem(key);
        // Se è null, restituiscilo
        if (val === null) return null;
        // Prova a parsare come JSON (per compatibilità con Storage.js)
        try {
          return JSON.parse(val);
        } catch {
          // Non è JSON, restituisci come stringa
          return val;
        }
      }
    };
    
    const savedLinea = Storage.getItem('tpl.lineaIdx');
    const savedPartenza = Storage.getItem('tpl.partenzaIdx');
    const savedArrivo = Storage.getItem('tpl.arrivoIdx');
    
    // Accetta sia stringhe che numeri (Storage.getItem può restituire numeri se JSON.parse riesce)
    // JSON.parse("0") restituisce 0 (numero), non "0" (stringa)
    // Quindi verifichiamo il valore convertito in stringa
    const lineaOk = savedLinea != null && String(savedLinea) === '0';
    const partenzaOk = savedPartenza != null && String(savedPartenza) === '0';
    const arrivoOk = savedArrivo != null && String(savedArrivo) === '5';
    
    if (lineaOk && partenzaOk && arrivoOk) {
      callbacks.updateStatus('test-route-storage-save', 'pass');
      callbacks.log('✓ Salvataggio Storage funziona', 'success');
      callbacks.log(`  Salvato: linea=${savedLinea} (${typeof savedLinea}), partenza=${savedPartenza} (${typeof savedPartenza}), arrivo=${savedArrivo} (${typeof savedArrivo})`, 'info');
    } else {
      throw new Error(`Salvataggio Storage fallito: linea=${savedLinea} (${typeof savedLinea}), partenza=${savedPartenza} (${typeof savedPartenza}), arrivo=${savedArrivo} (${typeof savedArrivo})`);
    }
  }

  // Test 9: Storage (ripristino)
  function testStorageRestore(callbacks) {
    callbacks.log('Test ripristino Storage...', 'info');
    
    // Verifica tariffario disponibile
    const tariffario = window.Tariffario && window.Tariffario.getData ? window.Tariffario.getData() : window.tariffario;
    if (!tariffario || tariffario.length === 0) {
      callbacks.log('⚠️ Tariffario non disponibile, test saltato', 'warning');
      return;
    }

    // Verifica che ci siano abbastanza fermate per i test
    if (!tariffario[0] || !tariffario[0].fermate || tariffario[0].fermate.length < 8) {
      callbacks.log('⚠️ Tariffario non ha abbastanza fermate, test saltato', 'warning');
      return;
    }

    // Setup: salva valori in Storage usando Storage.setItem
    const Storage = window.Storage || {
      setItem: (key, value) => {
        // Usa String() per convertire in stringa (come fa Storage.js)
        localStorage.setItem(key, String(value));
      },
      getItem: (key) => {
        const val = localStorage.getItem(key);
        if (val === null) return null;
        // Prova a parsare come JSON (per compatibilità con Storage.js)
        try {
          return JSON.parse(val);
        } catch {
          return val;
        }
      }
    };
    
    // IMPORTANTE: Salva i valori PRIMA di fare il reset
    // Il reset() cancella i valori dallo storage, quindi dobbiamo salvarli prima
    Storage.setItem('tpl.lineaIdx', '0');
    Storage.setItem('tpl.partenzaIdx', '2');
    Storage.setItem('tpl.arrivoIdx', '7');
    
    callbacks.log(`  Valori salvati in Storage: linea='0', partenza='2', arrivo='7'`, 'info');
    
    // Verifica che i valori siano stati salvati correttamente
    const savedLinea = Storage.getItem('tpl.lineaIdx');
    const savedPartenza = Storage.getItem('tpl.partenzaIdx');
    const savedArrivo = Storage.getItem('tpl.arrivoIdx');
    callbacks.log(`  Verifica Storage: linea=${savedLinea}, partenza=${savedPartenza}, arrivo=${savedArrivo}`, 'info');
    
    // Reset lo stato interno (ma NON cancella lo storage perché i valori sono già salvati)
    // In realtà, reset() cancella lo storage, quindi dobbiamo risalvare dopo il reset
    RouteSelector.reset();
    
    // Risalva i valori dopo il reset (perché reset() li ha cancellati)
    Storage.setItem('tpl.lineaIdx', '0');
    Storage.setItem('tpl.partenzaIdx', '2');
    Storage.setItem('tpl.arrivoIdx', '7');
    
    // Verifica che dopo il reset lo stato sia vuoto
    const stateAfterReset = RouteSelector.getState();
    if (stateAfterReset.lineaIdx !== '' || stateAfterReset.partenzaIdx !== '' || stateAfterReset.arrivoIdx !== '') {
      callbacks.log(`  ⚠️ Stato dopo reset non vuoto: ${JSON.stringify(stateAfterReset)}`, 'warning');
    }
    
    // Verifica che i valori siano ancora in Storage dopo il reset
    const savedAfterReset = {
      linea: Storage.getItem('tpl.lineaIdx'),
      partenza: Storage.getItem('tpl.partenzaIdx'),
      arrivo: Storage.getItem('tpl.arrivoIdx')
    };
    callbacks.log(`  Verifica Storage dopo reset: linea=${savedAfterReset.linea}, partenza=${savedAfterReset.partenza}, arrivo=${savedAfterReset.arrivo}`, 'info');
    
    // Ripristina
    RouteSelector.restore();
    
    const state = RouteSelector.getState();
    
    // Verifica che i valori siano stati ripristinati
    // Accetta sia stringhe che numeri (Storage.getItem può restituire numeri se JSON.parse riesce)
    // Confrontiamo i valori convertiti in stringa per essere sicuri
    const lineaOk = state.lineaIdx != null && state.lineaIdx !== '' && String(state.lineaIdx) === '0';
    const partenzaOk = state.partenzaIdx != null && state.partenzaIdx !== '' && String(state.partenzaIdx) === '2';
    const arrivoOk = state.arrivoIdx != null && state.arrivoIdx !== '' && String(state.arrivoIdx) === '7';
    
    if (lineaOk && partenzaOk && arrivoOk) {
      callbacks.updateStatus('test-route-storage-restore', 'pass');
      callbacks.log('✓ Ripristino Storage funziona', 'success');
      callbacks.log(`  Ripristinato: linea=${state.lineaIdx} (${typeof state.lineaIdx}), partenza=${state.partenzaIdx} (${typeof state.partenzaIdx}), arrivo=${state.arrivoIdx} (${typeof state.arrivoIdx})`, 'info');
    } else {
      callbacks.log(`  ⚠️ Stato dopo restore: ${JSON.stringify(state)}`, 'warning');
      callbacks.log(`  ⚠️ Valori in Storage: linea=${Storage.getItem('tpl.lineaIdx')}, partenza=${Storage.getItem('tpl.partenzaIdx')}, arrivo=${Storage.getItem('tpl.arrivoIdx')}`, 'warning');
      throw new Error(`Ripristino Storage fallito: ${JSON.stringify(state)}`);
    }
  }

  // Test 10: Getter methods
  function testGetterMethods(callbacks) {
    callbacks.log('Test metodi getter...', 'info');
    
    // Verifica tariffario disponibile
    const tariffario = window.Tariffario && window.Tariffario.getData ? window.Tariffario.getData() : window.tariffario;
    if (!tariffario || tariffario.length === 0) {
      callbacks.log('⚠️ Tariffario non disponibile, test saltato', 'warning');
      return;
    }

    // Setup: seleziona tutto
    RouteSelector.selectLinea(0, tariffario[0].nome);
    RouteSelector.selectFermata(2, 'partenza');
    RouteSelector.selectFermata(7, 'arrivo');
    
    const lineaIdx = RouteSelector.getLineaIdx();
    const partenzaIdx = RouteSelector.getPartenzaIdx();
    const arrivoIdx = RouteSelector.getArrivoIdx();
    const state = RouteSelector.getState();
    
    if (lineaIdx === state.lineaIdx && 
        partenzaIdx === state.partenzaIdx && 
        arrivoIdx === state.arrivoIdx) {
      callbacks.updateStatus('test-route-getters', 'pass');
      callbacks.log('✓ Metodi getter funzionano', 'success');
      callbacks.log(`  getLineaIdx()=${lineaIdx}, getPartenzaIdx()=${partenzaIdx}, getArrivoIdx()=${arrivoIdx}`, 'info');
    } else {
      throw new Error(`Getter methods falliti: linea=${lineaIdx}, partenza=${partenzaIdx}, arrivo=${arrivoIdx}`);
    }
  }

  // Esegui tutti i test
  window.RouteSelectorTests = {
    runAll: async function(options) {
      const { log = console.log, updateStatus = () => {} } = options || {};
      
      const tests = [
        { name: 'test-route-module', fn: testModuleAvailable },
        { name: 'test-route-initial-state', fn: testInitialState },
        { name: 'test-route-select-linea', fn: testSelectLinea },
        { name: 'test-route-select-partenza', fn: testSelectFermataPartenza },
        { name: 'test-route-select-arrivo', fn: testSelectFermataArrivo },
        { name: 'test-route-swap', fn: testSwapRoutes },
        { name: 'test-route-reset', fn: testReset },
        { name: 'test-route-storage-save', fn: testStorageSave },
        { name: 'test-route-storage-restore', fn: testStorageRestore },
        { name: 'test-route-getters', fn: testGetterMethods }
      ];

      let passed = 0;
      let failed = 0;
      const startTime = performance.now();

      log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'info');
      log('🧭 RouteSelector Tests', 'info');
      log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'info');

      // Reset completo all'inizio di tutti i test per assicurare uno stato pulito
      log('🔄 Reset iniziale RouteSelector...', 'info');
      if (window.RouteSelector && window.RouteSelector.reset) {
        window.RouteSelector.reset();
      }

      for (const test of tests) {
        try {
          test.fn({ log, updateStatus });
          passed++;
        } catch (error) {
          failed++;
          updateStatus(test.name, 'fail');
          log(`✗ ${test.name}: ${error.message}`, 'error');
        }
      }

      const duration = ((performance.now() - startTime) / 1000).toFixed(2);
      log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'info');
      log(`✅ Completati: ${passed + failed} test`, 'info');
      log(`✓ Passati: ${passed}`, 'success');
      if (failed > 0) {
        log(`✗ Falliti: ${failed}`, 'error');
      }
      log(`⏱️  Durata: ${duration}s`, 'info');
      log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'info');

      return {
        passed,
        failed,
        total: passed + failed,
        duration: parseFloat(duration)
      };
    }
  };

  console.log('✅ RouteSelectorTests caricato');
})();

// Funzione reset per RouteSelector tests
window.resetRouteTests = function() {
  // Reset tutti gli stati dei test
  const testItems = [
    'test-route-module',
    'test-route-initial-state',
    'test-route-select-linea',
    'test-route-select-partenza',
    'test-route-select-arrivo',
    'test-route-swap',
    'test-route-reset',
    'test-route-storage-save',
    'test-route-storage-restore',
    'test-route-getters'
  ];

  testItems.forEach(testId => {
    const testItem = document.getElementById(testId);
    if (testItem) {
      const statusEl = testItem.querySelector('.test-status');
      if (statusEl) {
        statusEl.className = 'test-status pending';
        statusEl.textContent = 'In attesa';
      }
    }
  });

  // Reset header
  const progressEl = document.getElementById('route-header-progress');
  const statusEl = document.getElementById('route-header-status');
  const passedEl = document.getElementById('route-header-passed');
  const failedEl = document.getElementById('route-header-failed');
  const timeEl = document.getElementById('route-header-time');
  const timestampEl = document.getElementById('route-header-timestamp');
  const barEl = document.getElementById('route-header-bar');

  if (progressEl) progressEl.textContent = '0/10';
  if (statusEl) {
    statusEl.className = 'test-header-status status-pending';
    statusEl.textContent = 'In attesa';
  }
  if (passedEl) passedEl.textContent = '0';
  if (failedEl) failedEl.textContent = '0';
  if (timeEl) timeEl.textContent = '0ms';
  if (timestampEl) {
    timestampEl.textContent = '-';
    timestampEl.setAttribute('data-ts', '');
  }
  if (barEl) {
    barEl.style.width = '0%';
    barEl.setAttribute('data-progress', '0');
  }

  // Reset gruppi
  const groups = ['group1', 'group2', 'group3', 'group4'];
  groups.forEach(groupId => {
    const subtitleEl = document.getElementById(`route-${groupId}-subtitle`);
    const badgeEl = document.getElementById(`route-${groupId}-badge`);
    if (subtitleEl) {
      subtitleEl.className = 'test-group-subtitle state-pending';
      const testCount = groupId === 'group1' ? '2' : groupId === 'group2' ? '3' : groupId === 'group3' ? '3' : '2';
      subtitleEl.textContent = `${testCount} test da completare`;
    }
    if (badgeEl) {
      badgeEl.className = 'test-group-badge badge-pending';
      const testCount = groupId === 'group1' ? '2' : groupId === 'group2' ? '3' : groupId === 'group3' ? '3' : '2';
      badgeEl.textContent = `0/${testCount}`;
    }
  });

  // Pulisci log
  if (typeof clearRouteLog === 'function') {
    clearRouteLog();
  }
};

