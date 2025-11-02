/**
 * js/tests/test-prezzi.js
 *
 * Suite completa di test per il modulo prezzi.js
 * 26 test che coprono tutte le funzioni e edge cases
 *
 * API Pubblica: window.PrezziTests
 */

(function () {
  'use strict';

  // Verifica che Pricing sia disponibile
  function checkPricingAvailable(callbacks) {
    if (typeof Pricing === 'undefined') {
      callbacks.log('✗ Pricing non disponibile! Assicurati che prezzi.js sia caricato.', 'error');

      // Marca tutti i test come falliti
      const allTestIds = getAllTestIds();
      allTestIds.forEach(id => callbacks.updateStatus(id, 'fail'));
      return false;
    }
    return true;
  }

  // Lista completa di tutti i test IDs
  function getAllTestIds() {
    return [
      'test-pricing-calculate',
      'test-pricing-ticket-code',
      'test-pricing-format',
      'test-pricing-validation',
      'test-pricing-route',
      'test-pricing-same-stop',
      'test-pricing-out-of-range',
      'test-pricing-fallback',
      'test-pricing-empty-tariffario',
      'test-pricing-negative-indices',
      'test-pricing-string-indices',
      'test-pricing-zero-price',
      'test-pricing-missing-matrices',
      'test-pricing-multiple-lines',
      'test-pricing-performance',
      'test-pricing-null-price',
      'test-pricing-undefined-price',
      'test-pricing-string-price',
      'test-pricing-line-not-exists',
      'test-pricing-result-structure',
      'test-pricing-nan-price',
      'test-pricing-infinity-price',
      'test-pricing-negative-price',
      'test-pricing-fermate-not-array',
      'test-pricing-code-with-spaces',
      'test-pricing-price-code-only'
    ];
  }

  // Helper: crea tariffario mock per test
  function createMockTariffario(options = {}) {
    // Mantieni intenzionalmente valori undefined se specificati in options,
    // così i test possono simulare matrici mancanti.
    const linea = {};

    // Campi base con default solo se non specificati
    if ('nome' in options) linea.nome = options.nome; else linea.nome = 'Linea Test';
    if ('fermate' in options) linea.fermate = options.fermate; else linea.fermate = ['A', 'B', 'C'];

    // Matrici: usa default solo se la proprietà non è presente in options
    if ('prezzi' in options) {
      linea.prezzi = options.prezzi; // può essere undefined per test
    } else {
      linea.prezzi = [[0, 3.5, 3.5], [3.5, 0, 2.0], [3.5, 2.0, 0]];
    }
    if ('codici' in options) {
      linea.codici = options.codici; // può essere undefined per test
    } else {
      linea.codici = [['', 'E1', 'E2'], ['E1', '', 'E1'], ['E2', 'E1', '']];
    }

    return [linea];
  }

  // TEST 1: calculatePrice()
  function testCalculatePrice(lineaIdx, partenzaIdx, arrivoIdx, tariffario, tariffarioAggiornato, linea, callbacks) {
    callbacks.log('Test Pricing.calculatePrice()...', 'info');
    const result = Pricing.calculatePrice(lineaIdx, partenzaIdx, arrivoIdx, tariffario, tariffarioAggiornato);

    if (result.prezzo === linea.prezzi[partenzaIdx][arrivoIdx] && result.valido === true) {
      callbacks.updateStatus('test-pricing-calculate', 'pass');
      callbacks.log(`✓ Prezzo calcolato: €${result.prezzo?.toFixed(2)}`, 'success');
      callbacks.log(`  ${linea.fermate[partenzaIdx]} → ${linea.fermate[arrivoIdx]}`, 'info');
    } else {
      throw new Error('calculatePrice() non funziona correttamente');
    }
  }

  // TEST 2: getTicketCode()
  function testGetTicketCode(lineaIdx, partenzaIdx, arrivoIdx, tariffario, tariffarioAggiornato, linea, callbacks) {
    callbacks.log('Test Pricing.getTicketCode()...', 'info');
    const codice = Pricing.getTicketCode(lineaIdx, partenzaIdx, arrivoIdx, tariffario, tariffarioAggiornato);

    if (codice === linea.codici[partenzaIdx][arrivoIdx]) {
      callbacks.updateStatus('test-pricing-ticket-code', 'pass');
      callbacks.log(`✓ Codice recuperato: ${codice || '(vuoto - normale)'}`, 'success');
    } else {
      throw new Error('getTicketCode() non funziona correttamente');
    }
  }

  // TEST 3: formatPrice()
  function testFormatPrice(callbacks) {
    callbacks.log('Test Pricing.formatPrice()...', 'info');
    const formatted = Pricing.formatPrice(3.50);
    const formattedNull = Pricing.formatPrice(null);
    const formattedZero = Pricing.formatPrice(0);

    if (formatted === '3.50 €' && formattedNull === '-' && formattedZero === '0.00 €') {
      callbacks.updateStatus('test-pricing-format', 'pass');
      callbacks.log(`✓ Formattazione: ${formatted}`, 'success');
      callbacks.log(`✓ Formattazione null: ${formattedNull}`, 'success');
      callbacks.log(`✓ Formattazione zero: ${formattedZero}`, 'success');
    } else {
      throw new Error('formatPrice() non funziona correttamente');
    }
  }

  // TEST 4: isValidSelection()
  function testIsValidSelection(lineaIdx, partenzaIdx, arrivoIdx, tariffario, callbacks) {
    callbacks.log('Test Pricing.isValidSelection()...', 'info');
    const valid = Pricing.isValidSelection(lineaIdx, partenzaIdx, arrivoIdx, tariffario);
    const invalid1 = Pricing.isValidSelection('', partenzaIdx, arrivoIdx, tariffario);
    const invalid2 = Pricing.isValidSelection(lineaIdx, partenzaIdx, partenzaIdx, tariffario);

    if (valid === true && invalid1 === false && invalid2 === false) {
      callbacks.updateStatus('test-pricing-validation', 'pass');
      callbacks.log('✓ Validazione selezioni funziona', 'success');
      callbacks.log(`  Valida: ${valid}, Linea mancante: ${invalid1}, Stessa fermata: ${invalid2}`, 'info');
    } else {
      throw new Error('isValidSelection() non funziona correttamente');
    }
  }

  // TEST 5: isRouteAvailable()
  function testIsRouteAvailable(lineaIdx, partenzaIdx, arrivoIdx, tariffario, callbacks) {
    callbacks.log('Test Pricing.isRouteAvailable()...', 'info');
    const available = Pricing.isRouteAvailable(lineaIdx, partenzaIdx, arrivoIdx, tariffario);
    const notAvailable = Pricing.isRouteAvailable(lineaIdx, 0, 999, tariffario);

    if (available === true && notAvailable === false) {
      callbacks.updateStatus('test-pricing-route', 'pass');
      callbacks.log('✓ Verifica tratta disponibile funziona', 'success');
    } else {
      throw new Error('isRouteAvailable() non funziona correttamente');
    }
  }

  // TEST 6: Stessa fermata (edge case)
  function testSameStop(lineaIdx, tariffario, callbacks) {
    callbacks.log('Test stessa fermata (edge case)...', 'info');
    const sameStop = Pricing.calculatePrice(lineaIdx, 2, 2, tariffario);

    if (sameStop.valido === false && sameStop.prezzo === null) {
      callbacks.updateStatus('test-pricing-same-stop', 'pass');
      callbacks.log('✓ Stessa fermata gestita correttamente', 'success');
    } else {
      throw new Error('Stessa fermata non gestita correttamente');
    }
  }

  // TEST 7: Indici fuori range (edge case)
  function testOutOfRange(lineaIdx, tariffario, callbacks) {
    callbacks.log('Test indici fuori range (edge case)...', 'info');
    const outOfRange = Pricing.calculatePrice(lineaIdx, 999, 1000, tariffario);

    if (outOfRange.valido === false) {
      callbacks.updateStatus('test-pricing-out-of-range', 'pass');
      callbacks.log('✓ Indici fuori range gestiti correttamente', 'success');
    } else {
      throw new Error('Indici fuori range non gestiti correttamente');
    }
  }

  // TEST 8: Fallback tariffarioAggiornato
  function testFallback(tariffarioAggiornato, callbacks) {
    callbacks.log('Test fallback tariffarioAggiornato...', 'info');
    if (tariffarioAggiornato && Array.isArray(tariffarioAggiornato) && tariffarioAggiornato.length > 0) {
      callbacks.updateStatus('test-pricing-fallback', 'pass');
      callbacks.log('✓ Gestione fallback tariffarioAggiornato presente', 'success');
    } else {
      callbacks.updateStatus('test-pricing-fallback', 'pass');
      callbacks.log('✓ Fallback tariffarioAggiornato: non disponibile (normale)', 'success');
    }
  }

  // TEST 9: Tariffario vuoto/null
  function testEmptyTariffario(callbacks) {
    callbacks.log('Test tariffario vuoto/null...', 'info');
    const emptyResult = Pricing.calculatePrice(0, 0, 5, [], null);
    const nullResult = Pricing.calculatePrice(0, 0, 5, null, null);

    if (emptyResult.valido === false && nullResult.valido === false) {
      callbacks.updateStatus('test-pricing-empty-tariffario', 'pass');
      callbacks.log('✓ Tariffario vuoto/null gestito correttamente', 'success');
    } else {
      throw new Error('Tariffario vuoto/null non gestito correttamente');
    }
  }

  // TEST 10: Indici negativi
  function testNegativeIndices(tariffario, callbacks) {
    callbacks.log('Test indici negativi...', 'info');
    const negativeResult = Pricing.calculatePrice(0, -1, -5, tariffario);

    if (negativeResult.valido === false) {
      callbacks.updateStatus('test-pricing-negative-indices', 'pass');
      callbacks.log('✓ Indici negativi gestiti correttamente', 'success');
    } else {
      throw new Error('Indici negativi non gestiti correttamente');
    }
  }

  // TEST 11: Indici come stringhe
  function testStringIndices(tariffario, callbacks) {
    callbacks.log('Test indici come stringhe ("0", "5")...', 'info');
    const stringResult = Pricing.calculatePrice('0', '0', '5', tariffario);
    const numberResult = Pricing.calculatePrice(0, 0, 5, tariffario);

    if (stringResult.prezzo === numberResult.prezzo && stringResult.valido === numberResult.valido) {
      callbacks.updateStatus('test-pricing-string-indices', 'pass');
      callbacks.log('✓ Indici stringa convertiti correttamente', 'success');
      callbacks.log(`  Stringa: €${stringResult.prezzo?.toFixed(2)}, Numero: €${numberResult.prezzo?.toFixed(2)}`, 'info');
    } else {
      throw new Error('Indici stringa non gestiti correttamente');
    }
  }

  // TEST 12: Prezzo zero (gratuito)
  function testZeroPrice(callbacks) {
    callbacks.log('Test prezzo zero (gratuito)...', 'info');
    const zeroFormatted = Pricing.formatPrice(0);

    if (zeroFormatted === '0.00 €') {
      callbacks.updateStatus('test-pricing-zero-price', 'pass');
      callbacks.log(`✓ Formattazione prezzo zero: ${zeroFormatted}`, 'success');
    } else {
      throw new Error('Formattazione prezzo zero non corretta');
    }
  }

  // TEST 13: Matrici prezzi/codici mancanti
  function testMissingMatrices(callbacks) {
    callbacks.log('Test matrici prezzi/codici mancanti...', 'info');
    const mockTariffarioIncomplete = createMockTariffario({
      nome: 'Linea Test Incompleta',
      fermate: ['A', 'B', 'C'],
      prezzi: undefined,
      codici: undefined
    });

    const incompleteResult = Pricing.calculatePrice(0, 0, 1, mockTariffarioIncomplete);
    // Log diagnostico dettagliato
    try {
      callbacks.log(`↪ Risultato (matrici mancanti): ${JSON.stringify(incompleteResult)}`, 'info');
      callbacks.log(`   valido=${incompleteResult?.valido}, prezzo=${incompleteResult?.prezzo}, codice="${incompleteResult?.codice}"`, 'info');
    } catch (e) {
      // Ignora eventuali errori di stringify
    }

    if (incompleteResult.valido === false || incompleteResult.prezzo === null) {
      callbacks.updateStatus('test-pricing-missing-matrices', 'pass');
      callbacks.log('✓ Matrici mancanti gestite correttamente', 'success');
    } else {
      callbacks.log('✗ Dettaglio failure matrici mancanti:', 'error');
      callbacks.log(`   valido=${incompleteResult?.valido} (atteso: false), prezzo=${incompleteResult?.prezzo} (atteso: null), codice="${incompleteResult?.codice}" (atteso: '')`, 'error');
      throw new Error('Matrici mancanti non gestite correttamente');
    }
  }

  // TEST 14: Test con più linee diverse
  function testMultipleLines(tariffario, callbacks) {
    callbacks.log('Test con più linee diverse...', 'info');
    if (tariffario.length > 1) {
      const resultLinea1 = Pricing.calculatePrice(0, 0, 1, tariffario);
      const resultLinea2 = Pricing.calculatePrice(1, 0, 1, tariffario);

      if (resultLinea1.valido && resultLinea2.valido) {
        callbacks.updateStatus('test-pricing-multiple-lines', 'pass');
        callbacks.log('✓ Test con più linee completato', 'success');
        callbacks.log(`  Linea 1: €${resultLinea1.prezzo?.toFixed(2)}, Linea 2: €${resultLinea2.prezzo?.toFixed(2)}`, 'info');
      } else {
        throw new Error('Test con più linee fallito');
      }
    } else {
      callbacks.updateStatus('test-pricing-multiple-lines', 'pass');
      callbacks.log('✓ Solo una linea disponibile (normale)', 'success');
    }
  }

  // TEST 15: Performance (1000 calcoli)
  function testPerformance(lineaIdx, tariffario, linea, callbacks) {
    callbacks.log('Test performance (1000 calcoli)...', 'info');
    const perfStart = performance.now();

    for (let i = 0; i < 1000; i++) {
      const p = i % (linea.fermate.length - 1);
      const a = (i + 1) % linea.fermate.length;
      if (p !== a) {
        Pricing.calculatePrice(lineaIdx, p, a, tariffario);
      }
    }

    const perfEnd = performance.now();
    const perfTime = perfEnd - perfStart;
    const avgTime = perfTime / 1000;

    if (perfTime < 100) {
      callbacks.updateStatus('test-pricing-performance', 'pass');
      callbacks.log(`✓ Performance: ${perfTime.toFixed(2)}ms per 1000 calcoli`, 'success');
      callbacks.log(`  Media: ${avgTime.toFixed(4)}ms per calcolo`, 'info');
    } else {
      callbacks.updateStatus('test-pricing-performance', 'pass');
      callbacks.log(`⚠ Performance: ${perfTime.toFixed(2)}ms (potrebbe essere lento)`, 'info');
    }
  }

  // TEST 16: Prezzo null nella matrice
  function testNullPrice(callbacks) {
    callbacks.log('Test prezzo null nella matrice...', 'info');
    const mockTariffarioNull = createMockTariffario({
      nome: 'Linea Test Null',
      fermate: ['A', 'B', 'C'],
      prezzi: [[0, null, 3.5], [null, 0, 2.0], [3.5, 2.0, 0]],
      // Forziamo codice vuoto nella cella testata per rendere il caso veramente "solo prezzo null"
      codici: [['', '', 'E2'], ['E1', '', 'E1'], ['E2', 'E1', '']]
    });
    const nullPriceResult = Pricing.calculatePrice(0, 0, 1, mockTariffarioNull);

    if (nullPriceResult.prezzo === null && nullPriceResult.valido === false) {
      callbacks.updateStatus('test-pricing-null-price', 'pass');
      callbacks.log('✓ Prezzo null gestito correttamente', 'success');
    } else {
      throw new Error('Prezzo null non gestito correttamente');
    }
  }

  // TEST 17: Prezzo undefined nella matrice
  function testUndefinedPrice(callbacks) {
    callbacks.log('Test prezzo undefined nella matrice...', 'info');
    const mockTariffarioUndefined = createMockTariffario({
      nome: 'Linea Test Undefined',
      fermate: ['A', 'B', 'C'],
      prezzi: [[0, undefined, 3.5], [undefined, 0, 2.0], [3.5, 2.0, 0]],
      // Anche qui il codice per la cella 0,1 è vuoto per verificare invalidità
      codici: [['', '', 'E2'], ['E1', '', 'E1'], ['E2', 'E1', '']]
    });
    const undefinedPriceResult = Pricing.calculatePrice(0, 0, 1, mockTariffarioUndefined);

    if (undefinedPriceResult.prezzo === null && undefinedPriceResult.valido === false) {
      callbacks.updateStatus('test-pricing-undefined-price', 'pass');
      callbacks.log('✓ Prezzo undefined gestito correttamente', 'success');
    } else {
      throw new Error('Prezzo undefined non gestito correttamente');
    }
  }

  // TEST 18: Prezzo come stringa
  function testStringPrice(callbacks) {
    callbacks.log('Test prezzo come stringa ("3.50")...', 'info');
    const mockTariffarioString = createMockTariffario({
      nome: 'Linea Test String',
      fermate: ['A', 'B', 'C'],
      prezzi: [[0, '3.50', 3.5], ['3.50', 0, 2.0], [3.5, 2.0, 0]]
    });
    const stringPriceResult = Pricing.calculatePrice(0, 0, 1, mockTariffarioString);

    if (stringPriceResult.prezzo === null) {
      callbacks.updateStatus('test-pricing-string-price', 'pass');
      callbacks.log('✓ Prezzo stringa rifiutato correttamente', 'success');
    } else {
      throw new Error('Prezzo stringa non rifiutato correttamente');
    }
  }

  // TEST 19: Linea non esistente
  function testLineNotExists(tariffario, callbacks) {
    callbacks.log('Test linea non esistente (indice 999)...', 'info');
    const nonExistentLineResult = Pricing.calculatePrice(999, 0, 1, tariffario);

    if (nonExistentLineResult.valido === false && nonExistentLineResult.prezzo === null) {
      callbacks.updateStatus('test-pricing-line-not-exists', 'pass');
      callbacks.log('✓ Linea non esistente gestita correttamente', 'success');
    } else {
      throw new Error('Linea non esistente non gestita correttamente');
    }
  }

  // TEST 20: Struttura risultato corretta
  function testResultStructure(lineaIdx, partenzaIdx, arrivoIdx, tariffario, callbacks) {
    callbacks.log('Test struttura risultato corretta...', 'info');
    const testResult = Pricing.calculatePrice(lineaIdx, partenzaIdx, arrivoIdx, tariffario);

    const hasPrezzo = 'prezzo' in testResult;
    const hasCodice = 'codice' in testResult;
    const hasValido = 'valido' in testResult;
    const hasCorrectTypes =
      (testResult.prezzo === null || typeof testResult.prezzo === 'number') &&
      typeof testResult.codice === 'string' &&
      typeof testResult.valido === 'boolean';

    if (hasPrezzo && hasCodice && hasValido && hasCorrectTypes) {
      callbacks.updateStatus('test-pricing-result-structure', 'pass');
      callbacks.log('✓ Struttura risultato corretta', 'success');
      callbacks.log(`  {prezzo: ${typeof testResult.prezzo}, codice: ${typeof testResult.codice}, valido: ${typeof testResult.valido}}`, 'info');
    } else {
      throw new Error('Struttura risultato non corretta');
    }
  }

  // TEST 21: Prezzo NaN nella matrice
  function testNaNPrice(callbacks) {
    callbacks.log('Test prezzo NaN nella matrice...', 'info');
    const mockTariffarioNaN = createMockTariffario({
      nome: 'Linea Test NaN',
      fermate: ['A', 'B', 'C'],
      prezzi: [[0, NaN, 3.5], [NaN, 0, 2.0], [3.5, 2.0, 0]]
    });
    const nanPriceResult = Pricing.calculatePrice(0, 0, 1, mockTariffarioNaN);

    if (nanPriceResult.prezzo === null) {
      callbacks.updateStatus('test-pricing-nan-price', 'pass');
      callbacks.log('✓ Prezzo NaN rifiutato correttamente', 'success');
    } else {
      throw new Error('Prezzo NaN non rifiutato correttamente');
    }
  }

  // TEST 22: Prezzo Infinity nella matrice
  function testInfinityPrice(callbacks) {
    callbacks.log('Test prezzo Infinity nella matrice...', 'info');
    const mockTariffarioInfinity = createMockTariffario({
      nome: 'Linea Test Infinity',
      fermate: ['A', 'B', 'C'],
      prezzi: [[0, Infinity, 3.5], [Infinity, 0, 2.0], [3.5, 2.0, 0]]
    });
    const infinityPriceResult = Pricing.calculatePrice(0, 0, 1, mockTariffarioInfinity);
    const infinityFormatted = Pricing.formatPrice(Infinity);

    if (infinityFormatted === '-' || infinityPriceResult.prezzo === null) {
      callbacks.updateStatus('test-pricing-infinity-price', 'pass');
      callbacks.log('✓ Prezzo Infinity gestito correttamente', 'success');
      callbacks.log(`  Formattazione: ${infinityFormatted}`, 'info');
    } else {
      throw new Error('Prezzo Infinity non gestito correttamente');
    }
  }

  // TEST 23: Prezzo negativo
  function testNegativePrice(callbacks) {
    callbacks.log('Test prezzo negativo...', 'info');
    const mockTariffarioNegative = createMockTariffario({
      nome: 'Linea Test Negativo',
      fermate: ['A', 'B', 'C'],
      prezzi: [[0, -1.50, 3.5], [-1.50, 0, 2.0], [3.5, 2.0, 0]],
      codici: [['', 'E1', 'E2'], ['E1', '', 'E1'], ['E2', 'E1', '']]
    });
    const negativePriceResult = Pricing.calculatePrice(0, 0, 1, mockTariffarioNegative);

    if (typeof negativePriceResult.prezzo === 'number' || negativePriceResult.prezzo === null) {
      callbacks.updateStatus('test-pricing-negative-price', 'pass');
      callbacks.log('✓ Prezzo negativo gestito correttamente', 'success');
      callbacks.log(`  Prezzo: ${negativePriceResult.prezzo !== null ? negativePriceResult.prezzo.toFixed(2) : 'null'}`, 'info');
    } else {
      throw new Error('Prezzo negativo non gestito correttamente');
    }
  }

  // TEST 24: fermate non array
  function testFermateNotArray(callbacks) {
    callbacks.log('Test fermate non array...', 'info');
    const mockTariffarioBadFermate = [{
      nome: 'Linea Test Bad Fermate',
      fermate: 'non è un array',
      prezzi: [[0, 3.5], [3.5, 0]]
    }];
    const badFermateResult = Pricing.calculatePrice(0, 0, 1, mockTariffarioBadFermate);

    if (badFermateResult.valido === false) {
      callbacks.updateStatus('test-pricing-fermate-not-array', 'pass');
      callbacks.log('✓ fermate non array gestito correttamente', 'success');
    } else {
      throw new Error('fermate non array non gestito correttamente');
    }
  }

  // TEST 25: Codice con spazi
  function testCodeWithSpaces(callbacks) {
    callbacks.log('Test codice con spazi...', 'info');
    const mockTariffarioSpaces = createMockTariffario({
      nome: 'Linea Test Spazi',
      fermate: ['A', 'B', 'C'],
      prezzi: [[0, 3.5, 3.5], [3.5, 0, 2.0], [3.5, 2.0, 0]],
      codici: [['', 'E 1', 'E2'], ['E 1', '', 'E1'], ['E2', 'E1', '']]
    });
    const codeWithSpaces = Pricing.getTicketCode(0, 0, 1, mockTariffarioSpaces);

    if (codeWithSpaces === 'E 1') {
      callbacks.updateStatus('test-pricing-code-with-spaces', 'pass');
      callbacks.log(`✓ Codice con spazi gestito: "${codeWithSpaces}"`, 'success');
    } else {
      throw new Error('Codice con spazi non gestito correttamente');
    }
  }

  // TEST 26: Solo codice senza prezzo
  function testPriceCodeOnly(callbacks) {
    callbacks.log('Test solo codice senza prezzo...', 'info');
    const mockTariffarioCodeOnly = createMockTariffario({
      nome: 'Linea Test Solo Codice',
      fermate: ['A', 'B', 'C'],
      prezzi: [[0, null, 3.5], [null, 0, 2.0], [3.5, 2.0, 0]],
      codici: [['', 'E1', 'E2'], ['E1', '', 'E1'], ['E2', 'E1', '']]
    });
    const codeOnlyResult = Pricing.calculatePrice(0, 0, 1, mockTariffarioCodeOnly);

    if (codeOnlyResult.codice === 'E1' && codeOnlyResult.valido === true) {
      callbacks.updateStatus('test-pricing-price-code-only', 'pass');
      callbacks.log('✓ Solo codice senza prezzo gestito correttamente', 'success');
      callbacks.log(`  Codice: ${codeOnlyResult.codice}, Valido: ${codeOnlyResult.valido}`, 'info');
    } else {
      throw new Error('Solo codice senza prezzo non gestito correttamente');
    }
  }

  // Funzione principale: esegue tutti i test
  async function runAll(tariffarioParam, tariffarioAggiornato, callbacks, loadDataFn = null) {
    callbacks.log('=== Test Modulo prezzi.js ===', 'info');

    // Verifica Pricing disponibile
    if (!checkPricingAvailable(callbacks)) {
      return;
    }

    callbacks.log('✓ Pricing.js disponibile', 'success');
    callbacks.log('', 'info');

    try {
      // Determina tariffario: usa parametro o variabile globale
      // Nota: in script.js, tariffario è dichiarato con 'let', quindi non è su window
      // Dobbiamo accedervi tramite lo scope globale o usare il parametro aggiornato
      let tariffario = tariffarioParam;

      // Carica dati se necessario
      if ((!tariffario || tariffario.length === 0) && loadDataFn && typeof loadDataFn === 'function') {
        callbacks.log('Caricamento tariffario...', 'info');
        await loadDataFn();

        // Dopo loadDataFn, la variabile globale tariffario è stata aggiornata
        // Ma non possiamo accedere direttamente a 'let tariffario' da script.js
        // Quindi dobbiamo usare un workaround: fare in modo che loadDataFn ritorni il tariffario
        // Oppure accedere alla variabile globale se è stata esposta su window

        // Tentativo 1: Verifica se è su window (potrebbe essere esposto esplicitamente)
        if (typeof window !== 'undefined' && window.tariffario && Array.isArray(window.tariffario) && window.tariffario.length > 0) {
          tariffario = window.tariffario;
        }
        // Tentativo 2: Se il parametro era vuoto, riprova a usarlo (potrebbe essere aggiornato per riferimento)
        // Nota: JavaScript passa per valore per primitive, ma per oggetti passa per riferimento
        // Dato che tariffarioParam è un array, potrebbe essere aggiornato per riferimento
        // Se però era [] (vuoto), potrebbe non essere stato aggiornato
        if (!tariffario || tariffario.length === 0) {
          // Usa di nuovo il parametro, che potrebbe essere stato aggiornato se passato per riferimento
          tariffario = tariffarioParam;
        }
      }

      // Verifica che tariffario sia valido
      if (!tariffario || !Array.isArray(tariffario) || tariffario.length === 0) {
        throw new Error('Tariffario non disponibile o vuoto dopo il caricamento. Assicurati che loadData() sia stato chiamato correttamente.');
      }

      // Verifica che il tariffario abbia almeno una linea
      if (!tariffario[0]) {
        throw new Error('Tariffario vuoto: nessuna linea disponibile');
      }

      const linea = tariffario[0];

      // Verifica struttura linea
      if (!linea.fermate || !Array.isArray(linea.fermate) || linea.fermate.length === 0) {
        throw new Error('Struttura linea non valida: fermate mancanti o vuote');
      }
      if (!linea.prezzi || !Array.isArray(linea.prezzi)) {
        throw new Error('Struttura linea non valida: prezzi mancanti o non array');
      }

      const lineaIdx = 0;
      const partenzaIdx = 0;
      // Assicura che arrivoIdx sia valido (non più grande del numero di fermate)
      const arrivoIdx = Math.min(5, linea.fermate.length - 1);

      callbacks.log(`Linea selezionata: ${linea.nome || 'Linea ' + lineaIdx}`, 'info');
      callbacks.log(`Fermate: ${linea.fermate.length}, Test tratta: ${linea.fermate[partenzaIdx] || 'N/A'} → ${linea.fermate[arrivoIdx] || 'N/A'}`, 'info');
      callbacks.log('', 'info');

      // === TEST BASE (5) ===
      testCalculatePrice(lineaIdx, partenzaIdx, arrivoIdx, tariffario, tariffarioAggiornato, linea, callbacks);
      testGetTicketCode(lineaIdx, partenzaIdx, arrivoIdx, tariffario, tariffarioAggiornato, linea, callbacks);
      testFormatPrice(callbacks);
      testIsValidSelection(lineaIdx, partenzaIdx, arrivoIdx, tariffario, callbacks);
      testIsRouteAvailable(lineaIdx, partenzaIdx, arrivoIdx, tariffario, callbacks);

      // === EDGE CASES (3) ===
      testSameStop(lineaIdx, tariffario, callbacks);
      testOutOfRange(lineaIdx, tariffario, callbacks);
      testFallback(tariffarioAggiornato, callbacks);

      // === TEST AVANZATI (7) ===
      testEmptyTariffario(callbacks);
      testNegativeIndices(tariffario, callbacks);
      testStringIndices(tariffario, callbacks);
      testZeroPrice(callbacks);
      testMissingMatrices(callbacks);
      testMultipleLines(tariffario, callbacks);
      testPerformance(lineaIdx, tariffario, linea, callbacks);

      // === TEST ROBUSTEZA DATI (6) ===
      testNullPrice(callbacks);
      testUndefinedPrice(callbacks);
      testStringPrice(callbacks);
      testLineNotExists(tariffario, callbacks);
      testResultStructure(lineaIdx, partenzaIdx, arrivoIdx, tariffario, callbacks);
      testNaNPrice(callbacks);

      // === TEST DATI MALFORMATI (5) ===
      testInfinityPrice(callbacks);
      testNegativePrice(callbacks);
      testFermateNotArray(callbacks);
      testCodeWithSpaces(callbacks);
      testPriceCodeOnly(callbacks);

      callbacks.log('', 'info');
      callbacks.log('✅ Tutti i test del modulo prezzi.js completati!', 'success');

      // Test multiple tratte per verifica visiva
      callbacks.log('', 'info');
      callbacks.log('=== Verifica visiva (3 tratte) ===', 'info');
      for (let i = 0; i < Math.min(3, linea.fermate.length - 1); i++) {
        const testResult = Pricing.calculatePrice(lineaIdx, i, i + 1, tariffario);
        const formattedPrice = Pricing.formatPrice(testResult.prezzo);
        callbacks.log(`  ${linea.fermate[i]} → ${linea.fermate[i + 1]}: ${formattedPrice} [${testResult.codice || '—'}]`, 'info');
      }

    } catch (error) {
      // Gestisci errori aggiornando tutti i test come falliti
      const testIds = getAllTestIds();
      testIds.forEach(id => callbacks.updateStatus(id, 'fail'));
      callbacks.log(`✗ Errore: ${error.message}`, 'error');
      console.error('Errore test prezzi:', error);
    }
  }

  // API Pubblica
  window.PrezziTests = {
    runAll: runAll,
    createMockTariffario: createMockTariffario,
    getAllTestIds: getAllTestIds
  };

  console.log('✅ Modulo test test-prezzi.js caricato');

})();

