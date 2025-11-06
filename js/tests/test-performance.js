/**
 * Test Performance
 * Test per misurare le performance dell'applicazione
 */

(function () {
  'use strict';

  // Lista completa di tutti i test IDs
  function getAllTestIds() {
    return [
      'test-perf-load-time',
      'test-perf-calc-time'
    ];
  }

  // Test 1: Tempo caricamento dati
  async function testLoadTime(callbacks) {
    callbacks.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'info');
    callbacks.log('⚡ Test: Tempo caricamento dati', 'info');
    callbacks.log('', 'info');

    try {
      callbacks.log('Misurazione tempo caricamento database.json...', 'info');

      const startTime = performance.now();

      const response = await fetch('database.json');
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const endTime = performance.now();
      const loadTime = Math.round(endTime - startTime);

      callbacks.log(`✓ Database caricato in ${loadTime}ms`, 'success');

      // Verifica che i dati siano validi
      if (!data.linee || !Array.isArray(data.linee)) {
        throw new Error('Struttura database non valida: campo "linee" mancante o non array');
      }

      if (!data.fermate || !Array.isArray(data.fermate)) {
        throw new Error('Struttura database non valida: campo "fermate" mancante o non array');
      }

      callbacks.log(`✓ Database contiene ${data.linee.length} linee e ${data.fermate.length} fermate`, 'success');

      // Valutazione performance
      let performanceRating = 'buona';
      let performanceColor = 'success';

      if (loadTime > 1000) {
        performanceRating = 'lenta';
        performanceColor = 'error';
      } else if (loadTime > 500) {
        performanceRating = 'media';
        performanceColor = 'warn';
      }

      callbacks.log(`📊 Performance: ${performanceRating} (${loadTime}ms)`, performanceColor);

      // Soglia di accettazione: < 1000ms
      if (loadTime > 1000) {
        callbacks.log('⚠️ Tempo di caricamento superiore a 1 secondo', 'warn');
      }

      callbacks.updateStatus('test-perf-load-time', 'pass');
      callbacks.log('✅ Test tempo caricamento PASSATO', 'success');

      return loadTime;

    } catch (error) {
      callbacks.updateStatus('test-perf-load-time', 'fail');
      callbacks.log(`✗ Test fallito: ${error.message}`, 'error');
      console.error('Errore test load time:', error);
      throw error;
    }
  }

  // Test 2: Tempo calcolo prezzo
  async function testCalcTime(callbacks) {
    callbacks.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'info');
    callbacks.log('💰 Test: Tempo calcolo prezzo', 'info');
    callbacks.log('', 'info');

    try {
      // Verifica che Pricing sia disponibile
      if (typeof Pricing === 'undefined') {
        throw new Error('Pricing non disponibile! Assicurati che prezzi.js sia caricato.');
      }

      callbacks.log('Verifica disponibilità Pricing...', 'info');
      callbacks.log('✓ Pricing disponibile', 'success');

      // Verifica che il database sia caricato
      if (typeof window.database === 'undefined' || !window.database) {
        throw new Error('Database non disponibile! Assicurati che database.json sia caricato.');
      }

      if (!window.database.linee || window.database.linee.length === 0) {
        throw new Error('Nessuna linea disponibile nel database');
      }

      // Prepara dati di test
      const lineaIdx = 0;
      const partenzaIdx = 0;
      const arrivoIdx = 1;

      callbacks.log(`Test calcolo prezzo: Linea ${lineaIdx}, Partenza ${partenzaIdx}, Arrivo ${arrivoIdx}`, 'info');

      // Misura tempo calcolo
      const startTime = performance.now();

      const result = Pricing.calculatePrice(lineaIdx, partenzaIdx, arrivoIdx, window.database);

      const endTime = performance.now();
      const calcTime = Math.round(endTime - startTime);

      callbacks.log(`✓ Calcolo completato in ${calcTime}ms`, 'success');

      // Verifica risultato
      if (!result || typeof result !== 'object') {
        throw new Error('Risultato calcolo non valido');
      }

      if (result.price !== undefined) {
        callbacks.log(`✓ Prezzo calcolato: €${result.price.toFixed(2)}`, 'success');
      }

      if (result.ticketCode) {
        callbacks.log(`✓ Codice biglietto: ${result.ticketCode}`, 'success');
      }

      // Valutazione performance
      let performanceRating = 'eccellente';
      let performanceColor = 'success';

      if (calcTime > 50) {
        performanceRating = 'lenta';
        performanceColor = 'error';
      } else if (calcTime > 20) {
        performanceRating = 'media';
        performanceColor = 'warn';
      } else if (calcTime > 10) {
        performanceRating = 'buona';
        performanceColor = 'success';
      }

      callbacks.log(`📊 Performance: ${performanceRating} (${calcTime}ms)`, performanceColor);

      // Soglia di accettazione: < 50ms
      if (calcTime > 50) {
        callbacks.log('⚠️ Tempo di calcolo superiore a 50ms', 'warn');
      }

      // Test con più iterazioni per media
      callbacks.log('', 'info');
      callbacks.log('Esecuzione 10 iterazioni per calcolare la media...', 'info');

      const iterations = 10;
      const times = [];

      for (let i = 0; i < iterations; i++) {
        const iterStart = performance.now();
        Pricing.calculatePrice(lineaIdx, partenzaIdx, arrivoIdx, window.database);
        const iterEnd = performance.now();
        times.push(Math.round(iterEnd - iterStart));
      }

      const avgTime = Math.round(times.reduce((a, b) => a + b, 0) / times.length);
      const minTime = Math.min(...times);
      const maxTime = Math.max(...times);

      callbacks.log(`📊 Media: ${avgTime}ms | Min: ${minTime}ms | Max: ${maxTime}ms`, 'info');

      callbacks.updateStatus('test-perf-calc-time', 'pass');
      callbacks.log('✅ Test tempo calcolo PASSATO', 'success');

      return { single: calcTime, average: avgTime, min: minTime, max: maxTime };

    } catch (error) {
      callbacks.updateStatus('test-perf-calc-time', 'fail');
      callbacks.log(`✗ Test fallito: ${error.message}`, 'error');
      console.error('Errore test calc time:', error);
    }
  }

  // Esegue tutti i test
  async function runAll(callbacks) {
    const startTime = performance.now();
    let passed = 0;
    let failed = 0;

    try {
      callbacks.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'info');
      callbacks.log('⚡ Esecuzione test Performance...', 'info');
      callbacks.log('', 'info');

      await testLoadTime(callbacks);
      await testCalcTime(callbacks);

      callbacks.log('', 'info');
      callbacks.log('✅ Tutti i test Performance completati!', 'success');

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
      console.error('Errore test performance:', error);
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
  window.PerformanceTests = {
    runAll: runAll,
    testLoadTime: testLoadTime,
    testCalcTime: testCalcTime,
    getAllTestIds: getAllTestIds
  };

  console.log('✅ Modulo test-performance.js caricato');
})();

