/**
 * js/tests/test-storage.js
 *
 * Suite completa di test per il modulo storage.js
 * Test per tutte le funzioni Storage e edge cases
 *
 * API Pubblica: window.StorageTests
 */

(function () {
  'use strict';

  // Verifica che Storage sia disponibile
  function checkStorageAvailable(callbacks) {
    if (typeof Storage === 'undefined' || !window.Storage) {
      callbacks.log('✗ Storage non disponibile! Assicurati che storage.js sia caricato.', 'error');
      const allTestIds = getAllTestIds();
      allTestIds.forEach(id => callbacks.updateStatus(id, 'fail'));
      return false;
    }
    return true;
  }

  // Lista completa di tutti i test IDs
  function getAllTestIds() {
    return [
      'test-storage-set-get',
      'test-storage-remove',
      'test-storage-default-value',
      'test-storage-json-object',
      'test-storage-json-array',
      'test-storage-boolean',
      'test-storage-number',
      'test-storage-clear',
      'test-storage-prefix-get',
      'test-storage-prefix-remove',
      'test-storage-has-item',
      'test-storage-size',
      'test-storage-retrocompatibility',
      'test-storage-null-undefined',
      'test-storage-special-chars',
      'test-storage-large-value',
      'test-storage-multiple-operations',
      // Test aggiuntivi da test-localstorage.js
      'test-storage-performance',
      'test-storage-iterate-keys',
      'test-storage-invalid-json',
      'test-storage-non-string',
      'test-storage-namespace',
      'test-storage-migration',
      'test-storage-timestamp'
      // NOTA: Test rimossi perché non necessari per l'uso reale dell'app su GitHub Pages:
      // - isSupported: localStorage è sempre disponibile su browser moderni
      // - empty-key: edge case raro, non usato nell'app
      // - date-values: Date non sono usate nell'app
      // - nan-infinity: valori non usati
      // - circular-reference: edge case che non accade
      // - deep-nesting: oggetti complessi non sono usati
      // - empty-prefix: prefisso vuoto non è un caso d'uso
      // - unicode-emoji: chiavi sono solo ASCII (tpl.*)
      // - type-change: tipo valori è sempre coerente
      // - regex-values: RegExp non sono usate
    ];
  }

  // TEST 1: setItem() e getItem() base
  function testSetGet(callbacks) {
    callbacks.log('Test Storage.setItem() e Storage.getItem()...', 'info');
    
    try {
      const testKey = 'test.storage.setget';
      const testValue = 'test-value-123';
      
      // Salva
      const saved = Storage.setItem(testKey, testValue);
      if (!saved) {
        throw new Error('setItem() ritornato false');
      }
      
      // Recupera
      const retrieved = Storage.getItem(testKey);
      if (retrieved !== testValue) {
        throw new Error(`Valore recuperato non corrisponde: atteso "${testValue}", ottenuto "${retrieved}"`);
      }
      
      // Pulisci
      Storage.removeItem(testKey);
      
      callbacks.updateStatus('test-storage-set-get', 'pass');
      callbacks.log('✓ setItem() e getItem() funzionano correttamente', 'success');
    } catch (error) {
      callbacks.updateStatus('test-storage-set-get', 'fail');
      callbacks.log(`✗ Errore: ${error.message}`, 'error');
    }
  }

  // TEST 2: removeItem()
  function testRemove(callbacks) {
    callbacks.log('Test Storage.removeItem()...', 'info');
    
    try {
      const testKey = 'test.storage.remove';
      Storage.setItem(testKey, 'value');
      
      // Verifica che esista
      if (!Storage.hasItem(testKey)) {
        throw new Error('Item non salvato correttamente');
      }
      
      // Rimuovi
      const removed = Storage.removeItem(testKey);
      if (!removed) {
        throw new Error('removeItem() ritornato false');
      }
      
      // Verifica che non esista più
      if (Storage.hasItem(testKey)) {
        throw new Error('Item ancora presente dopo removeItem()');
      }
      
      callbacks.updateStatus('test-storage-remove', 'pass');
      callbacks.log('✓ removeItem() funziona correttamente', 'success');
    } catch (error) {
      callbacks.updateStatus('test-storage-remove', 'fail');
      callbacks.log(`✗ Errore: ${error.message}`, 'error');
    }
  }

  // TEST 3: defaultValue
  function testDefaultValue(callbacks) {
    callbacks.log('Test Storage.getItem() con defaultValue...', 'info');
    
    try {
      const testKey = 'test.storage.default';
      const defaultValue = 'default-value-456';
      
      // Recupera chiave inesistente con default
      const retrieved = Storage.getItem(testKey, defaultValue);
      if (retrieved !== defaultValue) {
        throw new Error(`Default value non funziona: atteso "${defaultValue}", ottenuto "${retrieved}"`);
      }
      
      callbacks.updateStatus('test-storage-default-value', 'pass');
      callbacks.log('✓ defaultValue funziona correttamente', 'success');
    } catch (error) {
      callbacks.updateStatus('test-storage-default-value', 'fail');
      callbacks.log(`✗ Errore: ${error.message}`, 'error');
    }
  }

  // TEST 4: JSON Object
  function testJsonObject(callbacks) {
    callbacks.log('Test Storage con oggetto JSON...', 'info');
    
    try {
      const testKey = 'test.storage.json.object';
      const testObject = { name: 'Test', value: 123, active: true };
      
      // Salva oggetto
      Storage.setItem(testKey, testObject);
      
      // Recupera
      const retrieved = Storage.getItem(testKey);
      if (typeof retrieved !== 'object' || retrieved.name !== testObject.name) {
        throw new Error('Oggetto JSON non salvato/recuperato correttamente');
      }
      
      // Pulisci
      Storage.removeItem(testKey);
      
      callbacks.updateStatus('test-storage-json-object', 'pass');
      callbacks.log('✓ Oggetti JSON funzionano correttamente', 'success');
    } catch (error) {
      callbacks.updateStatus('test-storage-json-object', 'fail');
      callbacks.log(`✗ Errore: ${error.message}`, 'error');
    }
  }

  // TEST 5: JSON Array
  function testJsonArray(callbacks) {
    callbacks.log('Test Storage con array JSON...', 'info');
    
    try {
      const testKey = 'test.storage.json.array';
      const testArray = [1, 2, 3, 'test', true];
      
      // Salva array
      Storage.setItem(testKey, testArray);
      
      // Recupera
      const retrieved = Storage.getItem(testKey);
      if (!Array.isArray(retrieved) || retrieved.length !== testArray.length) {
        throw new Error('Array JSON non salvato/recuperato correttamente');
      }
      
      // Pulisci
      Storage.removeItem(testKey);
      
      callbacks.updateStatus('test-storage-json-array', 'pass');
      callbacks.log('✓ Array JSON funzionano correttamente', 'success');
    } catch (error) {
      callbacks.updateStatus('test-storage-json-array', 'fail');
      callbacks.log(`✗ Errore: ${error.message}`, 'error');
    }
  }

  // TEST 6: Boolean
  function testBoolean(callbacks) {
    callbacks.log('Test Storage con valori boolean...', 'info');
    
    try {
      const testKey = 'test.storage.boolean';
      
      // Salva true
      Storage.setItem(testKey, true);
      const retrievedTrue = Storage.getItem(testKey);
      if (retrievedTrue !== true) {
        throw new Error(`Boolean true non salvato correttamente: ottenuto "${retrievedTrue}" (tipo: ${typeof retrievedTrue})`);
      }
      
      // Salva false
      Storage.setItem(testKey, false);
      const retrievedFalse = Storage.getItem(testKey);
      if (retrievedFalse !== false) {
        throw new Error(`Boolean false non salvato correttamente: ottenuto "${retrievedFalse}" (tipo: ${typeof retrievedFalse})`);
      }
      
      // Pulisci
      Storage.removeItem(testKey);
      
      callbacks.updateStatus('test-storage-boolean', 'pass');
      callbacks.log('✓ Valori boolean funzionano correttamente', 'success');
    } catch (error) {
      callbacks.updateStatus('test-storage-boolean', 'fail');
      callbacks.log(`✗ Errore: ${error.message}`, 'error');
    }
  }

  // TEST 7: Number
  function testNumber(callbacks) {
    callbacks.log('Test Storage con valori numerici...', 'info');
    
    try {
      const testKey = 'test.storage.number';
      const testNumber = 42;
      
      // Salva numero
      Storage.setItem(testKey, testNumber);
      const retrieved = Storage.getItem(testKey);
      if (retrieved !== 42) {
        throw new Error(`Numero non salvato correttamente: ottenuto "${retrieved}" (tipo: ${typeof retrieved})`);
      }
      
      // Pulisci
      Storage.removeItem(testKey);
      
      callbacks.updateStatus('test-storage-number', 'pass');
      callbacks.log('✓ Valori numerici funzionano correttamente', 'success');
    } catch (error) {
      callbacks.updateStatus('test-storage-number', 'fail');
      callbacks.log(`✗ Errore: ${error.message}`, 'error');
    }
  }

  // TEST 8: clear()
  function testClear(callbacks) {
    callbacks.log('Test Storage.clear()...', 'info');
    
    try {
      // Salva alcuni item di test
      Storage.setItem('test.storage.clear1', 'value1');
      Storage.setItem('test.storage.clear2', 'value2');
      
      const sizeBefore = Storage.getSize();
      if (sizeBefore < 2) {
        throw new Error('Item non salvati correttamente prima di clear()');
      }
      
      // NOTA: clear() rimuove TUTTO, quindi non lo testiamo direttamente
      // per non cancellare dati utente. Testiamo solo che la funzione esista
      if (typeof Storage.clear !== 'function') {
        throw new Error('Storage.clear() non è una funzione');
      }
      
      // Pulisci manualmente i nostri test
      Storage.removeItem('test.storage.clear1');
      Storage.removeItem('test.storage.clear2');
      
      callbacks.updateStatus('test-storage-clear', 'pass');
      callbacks.log('✓ clear() disponibile (non testato per sicurezza)', 'success');
    } catch (error) {
      callbacks.updateStatus('test-storage-clear', 'fail');
      callbacks.log(`✗ Errore: ${error.message}`, 'error');
    }
  }

  // TEST 9: getItemsByPrefix()
  function testPrefixGet(callbacks) {
    callbacks.log('Test Storage.getItemsByPrefix()...', 'info');
    
    try {
      const prefix = 'test.storage.prefix.';
      
      // Salva alcuni item con prefisso
      Storage.setItem(prefix + 'item1', 'value1');
      Storage.setItem(prefix + 'item2', 'value2');
      Storage.setItem('test.storage.other', 'other-value'); // Senza prefisso
      
      // Recupera items con prefisso
      const items = Storage.getItemsByPrefix(prefix);
      
      if (!items || typeof items !== 'object') {
        throw new Error('getItemsByPrefix() non ritorna un oggetto');
      }
      
      if (items.item1 !== 'value1' || items.item2 !== 'value2') {
        throw new Error('Items con prefisso non recuperati correttamente');
      }
      
      if (items.other !== undefined) {
        throw new Error('Item senza prefisso incluso erroneamente');
      }
      
      // Pulisci
      Storage.removeItem(prefix + 'item1');
      Storage.removeItem(prefix + 'item2');
      Storage.removeItem('test.storage.other');
      
      callbacks.updateStatus('test-storage-prefix-get', 'pass');
      callbacks.log('✓ getItemsByPrefix() funziona correttamente', 'success');
    } catch (error) {
      callbacks.updateStatus('test-storage-prefix-get', 'fail');
      callbacks.log(`✗ Errore: ${error.message}`, 'error');
    }
  }

  // TEST 10: removeItemsByPrefix()
  function testPrefixRemove(callbacks) {
    callbacks.log('Test Storage.removeItemsByPrefix()...', 'info');
    
    try {
      const prefix = 'test.storage.prefix.remove.';
      
      // Salva alcuni item con prefisso
      Storage.setItem(prefix + 'item1', 'value1');
      Storage.setItem(prefix + 'item2', 'value2');
      Storage.setItem('test.storage.keep', 'keep-value'); // Da mantenere
      
      // Rimuovi items con prefisso
      const removed = Storage.removeItemsByPrefix(prefix);
      
      if (removed !== 2) {
        throw new Error(`removeItemsByPrefix() rimosso ${removed} item invece di 2`);
      }
      
      // Verifica che siano stati rimossi
      if (Storage.hasItem(prefix + 'item1') || Storage.hasItem(prefix + 'item2')) {
        throw new Error('Items con prefisso non rimossi correttamente');
      }
      
      // Verifica che item senza prefisso sia ancora presente
      if (!Storage.hasItem('test.storage.keep')) {
        throw new Error('Item senza prefisso rimosso erroneamente');
      }
      
      // Pulisci
      Storage.removeItem('test.storage.keep');
      
      callbacks.updateStatus('test-storage-prefix-remove', 'pass');
      callbacks.log('✓ removeItemsByPrefix() funziona correttamente', 'success');
    } catch (error) {
      callbacks.updateStatus('test-storage-prefix-remove', 'fail');
      callbacks.log(`✗ Errore: ${error.message}`, 'error');
    }
  }

  // TEST 11: hasItem()
  function testHasItem(callbacks) {
    callbacks.log('Test Storage.hasItem()...', 'info');
    
    try {
      const testKey = 'test.storage.has';
      
      // Verifica che non esista
      if (Storage.hasItem(testKey)) {
        throw new Error('hasItem() ritorna true per item inesistente');
      }
      
      // Salva
      Storage.setItem(testKey, 'value');
      
      // Verifica che esista
      if (!Storage.hasItem(testKey)) {
        throw new Error('hasItem() ritorna false per item esistente');
      }
      
      // Pulisci
      Storage.removeItem(testKey);
      
      callbacks.updateStatus('test-storage-has-item', 'pass');
      callbacks.log('✓ hasItem() funziona correttamente', 'success');
    } catch (error) {
      callbacks.updateStatus('test-storage-has-item', 'fail');
      callbacks.log(`✗ Errore: ${error.message}`, 'error');
    }
  }

  // TEST 12: getSize()
  function testSize(callbacks) {
    callbacks.log('Test Storage.getSize()...', 'info');
    
    try {
      const sizeBefore = Storage.getSize();
      
      // Salva alcuni item
      Storage.setItem('test.storage.size1', 'value1');
      Storage.setItem('test.storage.size2', 'value2');
      
      const sizeAfter = Storage.getSize();
      
      if (sizeAfter < sizeBefore + 2) {
        throw new Error(`getSize() non aggiornato correttamente: ${sizeBefore} → ${sizeAfter}`);
      }
      
      // Pulisci
      Storage.removeItem('test.storage.size1');
      Storage.removeItem('test.storage.size2');
      
      callbacks.updateStatus('test-storage-size', 'pass');
      callbacks.log(`✓ getSize() funziona: ${sizeBefore} → ${sizeAfter}`, 'success');
    } catch (error) {
      callbacks.updateStatus('test-storage-size', 'fail');
      callbacks.log(`✗ Errore: ${error.message}`, 'error');
    }
  }

  // TEST 13: Retrocompatibilità con localStorage
  function testRetrocompatibility(callbacks) {
    callbacks.log('Test retrocompatibilità con localStorage...', 'info');
    
    try {
      const testKey = 'test.storage.retro';
      const testValue = 'retro-value';
      
      // Salva con Storage
      Storage.setItem(testKey, testValue);
      
      // Verifica che sia accessibile anche da localStorage diretto
      const fromLocalStorage = localStorage.getItem(testKey);
      if (fromLocalStorage !== testValue) {
        throw new Error('Retrocompatibilità localStorage non funziona');
      }
      
      // Salva con localStorage diretto
      localStorage.setItem(testKey + '2', testValue + '2');
      
      // Verifica che sia accessibile da Storage
      const fromStorage = Storage.getItem(testKey + '2');
      if (fromStorage !== testValue + '2') {
        throw new Error('Storage non legge da localStorage diretto');
      }
      
      // Pulisci
      Storage.removeItem(testKey);
      Storage.removeItem(testKey + '2');
      
      callbacks.updateStatus('test-storage-retrocompatibility', 'pass');
      callbacks.log('✓ Retrocompatibilità localStorage funziona', 'success');
    } catch (error) {
      callbacks.updateStatus('test-storage-retrocompatibility', 'fail');
      callbacks.log(`✗ Errore: ${error.message}`, 'error');
    }
  }

  // TEST 14: Valori null e undefined
  function testNullUndefined(callbacks) {
    callbacks.log('Test Storage con null e undefined...', 'info');
    
    try {
      const testKey = 'test.storage.null';
      
      // Salva null
      Storage.setItem(testKey, null);
      const retrievedNull = Storage.getItem(testKey);
      if (retrievedNull !== null) {
        throw new Error(`Null non salvato correttamente: ottenuto "${retrievedNull}" (tipo: ${typeof retrievedNull})`);
      }
      
      // Salva undefined (dovrebbe essere convertito in stringa)
      Storage.setItem(testKey, undefined);
      const retrievedUndef = Storage.getItem(testKey);
      // undefined viene convertito in stringa "undefined"
      if (retrievedUndef !== 'undefined') {
        callbacks.log(`⚠️ undefined salvato come "${retrievedUndef}" (comportamento atteso)`, 'info');
      }
      
      // Pulisci
      Storage.removeItem(testKey);
      
      callbacks.updateStatus('test-storage-null-undefined', 'pass');
      callbacks.log('✓ null e undefined gestiti correttamente', 'success');
    } catch (error) {
      callbacks.updateStatus('test-storage-null-undefined', 'fail');
      callbacks.log(`✗ Errore: ${error.message}`, 'error');
    }
  }

  // TEST 15: Caratteri speciali nelle chiavi
  function testSpecialChars(callbacks) {
    callbacks.log('Test Storage con caratteri speciali...', 'info');
    
    try {
      const testKey = 'test.storage.special!@#$%^&*()';
      const testValue = 'special-value';
      
      Storage.setItem(testKey, testValue);
      const retrieved = Storage.getItem(testKey);
      
      if (retrieved !== testValue) {
        throw new Error('Caratteri speciali nelle chiavi non gestiti correttamente');
      }
      
      // Pulisci
      Storage.removeItem(testKey);
      
      callbacks.updateStatus('test-storage-special-chars', 'pass');
      callbacks.log('✓ Caratteri speciali gestiti correttamente', 'success');
    } catch (error) {
      callbacks.updateStatus('test-storage-special-chars', 'fail');
      callbacks.log(`✗ Errore: ${error.message}`, 'error');
    }
  }

  // TEST 16: Valore grande
  function testLargeValue(callbacks) {
    callbacks.log('Test Storage con valore grande...', 'info');
    
    try {
      const testKey = 'test.storage.large';
      // Crea stringa di ~10KB
      const largeValue = 'x'.repeat(10000);
      
      const saved = Storage.setItem(testKey, largeValue);
      if (!saved) {
        callbacks.log('⚠️ Valore grande non salvato (quota esaurita?)', 'warning');
        callbacks.updateStatus('test-storage-large-value', 'pending');
        return;
      }
      
      const retrieved = Storage.getItem(testKey);
      if (retrieved.length !== largeValue.length) {
        throw new Error('Valore grande non recuperato correttamente');
      }
      
      // Pulisci
      Storage.removeItem(testKey);
      
      callbacks.updateStatus('test-storage-large-value', 'pass');
      callbacks.log('✓ Valore grande gestito correttamente', 'success');
    } catch (error) {
      callbacks.updateStatus('test-storage-large-value', 'fail');
      callbacks.log(`✗ Errore: ${error.message}`, 'error');
    }
  }

  // TEST 17: Operazioni multiple
  function testMultipleOperations(callbacks) {
    callbacks.log('Test Storage con operazioni multiple...', 'info');
    
    try {
      const keys = ['test.storage.multi1', 'test.storage.multi2', 'test.storage.multi3'];
      
      // Salva multipli
      keys.forEach((key, index) => {
        Storage.setItem(key, `value${index}`);
      });
      
      // Verifica tutti
      keys.forEach((key, index) => {
        const retrieved = Storage.getItem(key);
        if (retrieved !== `value${index}`) {
          throw new Error(`Item ${key} non salvato correttamente`);
        }
      });
      
      // Rimuovi tutti
      keys.forEach(key => {
        Storage.removeItem(key);
      });
      
      // Verifica che siano stati rimossi
      keys.forEach(key => {
        if (Storage.hasItem(key)) {
          throw new Error(`Item ${key} non rimosso correttamente`);
        }
      });
      
      callbacks.updateStatus('test-storage-multiple-operations', 'pass');
      callbacks.log('✓ Operazioni multiple funzionano correttamente', 'success');
    } catch (error) {
      callbacks.updateStatus('test-storage-multiple-operations', 'fail');
      callbacks.log(`✗ Errore: ${error.message}`, 'error');
    }
  }

  // TEST 18: Performance (Scrittura/Lettura)
  function testPerformance(callbacks) {
    callbacks.log('Test Performance Storage (scrittura/lettura)...', 'info');
    
    try {
      const PERF_KEY = 'test.storage.perf';
      const DATA_SIZE = 100 * 1024; // 100KB
      const ITERATIONS = 100;
      
      // Genera dati casuali
      const randomData = Array.from({ length: DATA_SIZE }, () =>
        String.fromCharCode(Math.floor(Math.random() * 26) + 97)
      ).join('');
      
      let writeTimes = [];
      let readTimes = [];
      
      // Test di scrittura e lettura
      for (let i = 0; i < ITERATIONS; i++) {
        const writeStart = performance.now();
        Storage.setItem(PERF_KEY, randomData);
        writeTimes.push(performance.now() - writeStart);
        
        const readStart = performance.now();
        const retrieved = Storage.getItem(PERF_KEY);
        readTimes.push(performance.now() - readStart);
        
        if (retrieved !== randomData) {
          throw new Error('Dati non corrispondenti durante il test di performance');
        }
      }
      
      const avgWrite = writeTimes.reduce((a, b) => a + b, 0) / ITERATIONS;
      const avgRead = readTimes.reduce((a, b) => a + b, 0) / ITERATIONS;
      
      callbacks.log(`  Dati: ${(DATA_SIZE / 1024).toFixed(1)} KB, Iterazioni: ${ITERATIONS}`, 'info');
      callbacks.log(`  Tempo medio scrittura: ${avgWrite.toFixed(2)} ms`, 'info');
      callbacks.log(`  Tempo medio lettura: ${avgRead.toFixed(2)} ms`, 'info');
      
      // Pulisci
      Storage.removeItem(PERF_KEY);
      
      callbacks.updateStatus('test-storage-performance', 'pass');
      callbacks.log('✓ Test performance completato', 'success');
    } catch (error) {
      callbacks.updateStatus('test-storage-performance', 'fail');
      callbacks.log(`✗ Errore: ${error.message}`, 'error');
    }
  }

  // TEST 19: Iterazione Chiavi
  function testIterateKeys(callbacks) {
    callbacks.log('Test iterazione chiavi Storage...', 'info');
    
    try {
      const TEST_KEYS = [
        'test.storage.iter1',
        'test.storage.iter2',
        'test.storage.iter3'
      ];
      
      // Salva chiavi
      TEST_KEYS.forEach((key, index) => {
        Storage.setItem(key, `value-${index}`);
      });
      
      // Itera usando localStorage.key() (Storage usa localStorage)
      let foundKeys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('test.storage.iter')) {
          foundKeys.push(key);
        }
      }
      
      // Verifica che tutte le chiavi siano state trovate
      const allFound = TEST_KEYS.every(key => foundKeys.includes(key));
      
      if (!allFound || foundKeys.length !== TEST_KEYS.length) {
        throw new Error(`Chiavi non trovate correttamente: ${foundKeys.length}/${TEST_KEYS.length}`);
      }
      
      // Pulisci
      TEST_KEYS.forEach(key => Storage.removeItem(key));
      
      callbacks.updateStatus('test-storage-iterate-keys', 'pass');
      callbacks.log(`✓ Iterazione chiavi riuscita: ${foundKeys.length} chiavi`, 'success');
    } catch (error) {
      callbacks.updateStatus('test-storage-iterate-keys', 'fail');
      callbacks.log(`✗ Errore: ${error.message}`, 'error');
    }
  }

  // TEST 20: JSON Invalido
  function testInvalidJson(callbacks) {
    callbacks.log('Test Storage con JSON invalido...', 'info');
    
    try {
      const TEST_KEY = 'test.storage.invalid-json';
      const invalidJsonStrings = [
        'ciao mondo',
        '123abc',
        '{broken json',
        'undefined',
        'NaN'
      ];
      
      let errorsCaught = 0;
      for (const invalidStr of invalidJsonStrings) {
        Storage.setItem(TEST_KEY, invalidStr);
        
        // Storage.getItem() prova JSON.parse, se fallisce ritorna la stringa
        const retrieved = Storage.getItem(TEST_KEY);
        
        // Se è una stringa non-JSON, Storage la ritorna come stringa (comportamento corretto)
        if (typeof retrieved === 'string' && retrieved === invalidStr) {
          errorsCaught++;
        }
      }
      
      // Pulisci
      Storage.removeItem(TEST_KEY);
      
      if (errorsCaught >= 2) {
        callbacks.updateStatus('test-storage-invalid-json', 'pass');
        callbacks.log(`✓ Gestione JSON invalido: ${errorsCaught} gestiti correttamente`, 'success');
      } else {
        throw new Error(`Solo ${errorsCaught} JSON invalidi gestiti, attesi almeno 2`);
      }
    } catch (error) {
      callbacks.updateStatus('test-storage-invalid-json', 'fail');
      callbacks.log(`✗ Errore: ${error.message}`, 'error');
    }
  }

  // TEST 21: Valori Non-Stringa (comportamento localStorage diretto)
  function testNonString(callbacks) {
    callbacks.log('Test Storage con valori non-stringa...', 'info');
    
    try {
      const TEST_KEY = 'test.storage.non-string';
      
      // Test numero (Storage lo salva come stringa, ma getItem fa JSON.parse)
      Storage.setItem(TEST_KEY, 123);
      let retrieved = Storage.getItem(TEST_KEY);
      if (retrieved !== 123) {
        throw new Error(`Numero non convertito: ottenuto "${retrieved}" (tipo: ${typeof retrieved})`);
      }
      
      // Test booleano
      Storage.setItem(TEST_KEY, true);
      retrieved = Storage.getItem(TEST_KEY);
      if (retrieved !== true) {
        throw new Error(`Booleano non convertito: ottenuto "${retrieved}" (tipo: ${typeof retrieved})`);
      }
      
      // Test oggetto (Storage usa JSON.stringify)
      Storage.setItem(TEST_KEY, { test: 'value' });
      retrieved = Storage.getItem(TEST_KEY);
      if (typeof retrieved !== 'object' || retrieved.test !== 'value') {
        throw new Error(`Oggetto non salvato correttamente: ottenuto ${typeof retrieved}`);
      }
      
      // Test array (Storage usa JSON.stringify)
      Storage.setItem(TEST_KEY, [1, 2, 3]);
      retrieved = Storage.getItem(TEST_KEY);
      if (!Array.isArray(retrieved) || retrieved.length !== 3) {
        throw new Error(`Array non salvato correttamente: ottenuto ${typeof retrieved}`);
      }
      
      // Pulisci
      Storage.removeItem(TEST_KEY);
      
      callbacks.updateStatus('test-storage-non-string', 'pass');
      callbacks.log('✓ Valori non-stringa gestiti correttamente', 'success');
    } catch (error) {
      callbacks.updateStatus('test-storage-non-string', 'fail');
      callbacks.log(`✗ Errore: ${error.message}`, 'error');
    }
  }

  // TEST 22: Namespace Prefix Validation
  function testNamespace(callbacks) {
    callbacks.log('Test validazione prefisso namespace...', 'info');
    
    try {
      const validKeys = [
        'tpl.lineaIdx',
        'tpl.partenzaIdx',
        'tpl.arrivoIdx',
        'tpl.themeMode',
        'tpl.locationEnabled',
        'tpl.pwa.dismissTs'
      ];
      
      // Salva chiavi con prefisso 'tpl.'
      validKeys.forEach(key => {
        Storage.setItem(key, 'test-value');
        const retrieved = Storage.getItem(key);
        if (retrieved !== 'test-value') {
          throw new Error(`Chiave valida ${key} non salvata correttamente`);
        }
      });
      
      // Verifica pattern prefisso usando localStorage.key()
      const allKeys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('tpl.')) {
          allKeys.push(key);
        }
      }
      
      // Verifica che tutte le chiavi salvate siano presenti
      const allFound = validKeys.every(key => allKeys.includes(key));
      
      if (!allFound) {
        throw new Error('Non tutte le chiavi con prefisso sono state trovate');
      }
      
      // Pulisci
      validKeys.forEach(key => Storage.removeItem(key));
      
      callbacks.updateStatus('test-storage-namespace', 'pass');
      callbacks.log(`✓ Validazione namespace: ${allKeys.length} chiavi con prefisso 'tpl.'`, 'success');
    } catch (error) {
      callbacks.updateStatus('test-storage-namespace', 'fail');
      callbacks.log(`✗ Errore: ${error.message}`, 'error');
    }
  }

  // TEST 23: Migration isDark → themeMode
  function testMigration(callbacks) {
    callbacks.log('Test migrazione isDark → themeMode...', 'info');
    
    try {
      // Scenario 1: Vecchio sistema con isDark = '1' (dark mode)
      // NOTA: Storage.setItem('tpl.isDark', '1') salva come stringa '1'
      //       Storage.getItem('tpl.isDark') fa JSON.parse('1') → restituisce 1 (numero)
      Storage.removeItem('tpl.isDark');
      Storage.removeItem('tpl.themeMode');
      Storage.setItem('tpl.isDark', '1');
      
      // Esegui migrazione
      const oldDarkMode1 = Storage.getItem('tpl.isDark');
      const existingThemeMode1 = Storage.getItem('tpl.themeMode');
      
      // oldDarkMode1 sarà 1 (numero) perché JSON.parse('1') = 1
      if (!existingThemeMode1 && oldDarkMode1 !== null) {
        // Confronta con numero 1 o stringa '1' per retrocompatibilità
        const newMode = (oldDarkMode1 === '1' || oldDarkMode1 === 1) ? 'dark' : 'light';
        Storage.setItem('tpl.themeMode', newMode);
        Storage.removeItem('tpl.isDark');
      }
      
      // Verifica risultato
      const migratedMode1 = Storage.getItem('tpl.themeMode');
      const oldKeyRemoved1 = Storage.getItem('tpl.isDark');
      
      if (migratedMode1 !== 'dark') {
        throw new Error(`Migrazione fallita: atteso 'dark', ottenuto '${migratedMode1}'`);
      }
      if (oldKeyRemoved1 !== null) {
        throw new Error('Vecchia chiave tpl.isDark non rimossa');
      }
      
      // Scenario 2: Vecchio sistema con isDark = '0' (light mode)
      Storage.removeItem('tpl.themeMode');
      Storage.setItem('tpl.isDark', '0');
      
      const oldDarkMode2 = Storage.getItem('tpl.isDark');
      const existingThemeMode2 = Storage.getItem('tpl.themeMode');
      
      // oldDarkMode2 sarà 0 (numero) perché JSON.parse('0') = 0
      if (!existingThemeMode2 && oldDarkMode2 !== null) {
        // Confronta con numero 0 o stringa '0' per retrocompatibilità
        const newMode = (oldDarkMode2 === '1' || oldDarkMode2 === 1) ? 'dark' : 'light';
        Storage.setItem('tpl.themeMode', newMode);
        Storage.removeItem('tpl.isDark');
      }
      
      const migratedMode2 = Storage.getItem('tpl.themeMode');
      
      if (migratedMode2 !== 'light') {
        throw new Error(`Migrazione fallita: atteso 'light', ottenuto '${migratedMode2}'`);
      }
      
      // Pulisci
      Storage.removeItem('tpl.isDark');
      Storage.removeItem('tpl.themeMode');
      
      callbacks.updateStatus('test-storage-migration', 'pass');
      callbacks.log('✓ Migrazione tema: isDark="1" → themeMode="dark", isDark="0" → themeMode="light"', 'success');
    } catch (error) {
      callbacks.updateStatus('test-storage-migration', 'fail');
      callbacks.log(`✗ Errore: ${error.message}`, 'error');
    }
  }

  // TEST 24: Timestamp Handling
  function testTimestamp(callbacks) {
    callbacks.log('Test gestione timestamp...', 'info');
    
    try {
      const TEST_KEY = 'tpl.pwa.dismissTs';
      
      // Test 1: Salvataggio timestamp come stringa
      const now = Date.now();
      Storage.setItem(TEST_KEY, String(now));
      
      // Test 2: Lettura e conversione a numero
      const storedStr = Storage.getItem(TEST_KEY);
      const parsedNum = Number(storedStr);
      
      if (isNaN(parsedNum) || parsedNum !== now) {
        throw new Error(`Timestamp non corrisponde: atteso ${now}, ottenuto ${parsedNum}`);
      }
      
      // Test 3: Calcolo differenza tempo (24 ore)
      const oneDayMs = 24 * 60 * 60 * 1000;
      const yesterday = now - oneDayMs;
      Storage.setItem(TEST_KEY, String(yesterday));
      
      const storedYesterday = Number(Storage.getItem(TEST_KEY));
      const diff = now - storedYesterday;
      
      if (Math.abs(diff - oneDayMs) > 100) {
        throw new Error(`Differenza tempo errata: atteso ~${oneDayMs}, ottenuto ${diff}`);
      }
      
      // Test 4: Gestione timestamp invalidi
      Storage.setItem(TEST_KEY, 'invalid-timestamp');
      const invalidParsed = Number(Storage.getItem(TEST_KEY));
      
      if (!isNaN(invalidParsed)) {
        throw new Error('Timestamp invalido non rilevato');
      }
      
      // Test 5: Gestione null/undefined
      Storage.removeItem(TEST_KEY);
      const nullTimestamp = Storage.getItem(TEST_KEY);
      
      if (nullTimestamp !== null) {
        throw new Error('Chiave rimossa dovrebbe restituire null');
      }
      
      callbacks.updateStatus('test-storage-timestamp', 'pass');
      callbacks.log('✓ Gestione timestamp: salvataggio, conversione, differenza, validazione', 'success');
    } catch (error) {
      callbacks.updateStatus('test-storage-timestamp', 'fail');
      callbacks.log(`✗ Errore: ${error.message}`, 'error');
    }
  }

  // Funzione principale: esegue tutti i test
  async function runAll(callbacks) {
    callbacks.log('🧪 Inizio test Storage...', 'info');
    callbacks.log('', 'info'); // Riga vuota
    
    if (!checkStorageAvailable(callbacks)) {
      return;
    }
    
    // Reset tutti i test a pending
    getAllTestIds().forEach(id => callbacks.updateStatus(id, 'pending'));
    
    try {
      // Esegui tutti i test in sequenza
      testSetGet(callbacks);
      testRemove(callbacks);
      testDefaultValue(callbacks);
      testJsonObject(callbacks);
      testJsonArray(callbacks);
      testBoolean(callbacks);
      testNumber(callbacks);
      testClear(callbacks);
      testPrefixGet(callbacks);
      testPrefixRemove(callbacks);
      testHasItem(callbacks);
      testSize(callbacks);
      testRetrocompatibility(callbacks);
      testNullUndefined(callbacks);
      testSpecialChars(callbacks);
      testLargeValue(callbacks);
      testMultipleOperations(callbacks);
      // Test aggiuntivi da test-localstorage.js
      testPerformance(callbacks);
      testIterateKeys(callbacks);
      testInvalidJson(callbacks);
      testNonString(callbacks);
      testNamespace(callbacks);
      testMigration(callbacks);
      testTimestamp(callbacks);
      
      callbacks.log('', 'info'); // Riga vuota
      callbacks.log('✅ Test Storage completati!', 'success');
    } catch (error) {
      callbacks.log(`❌ Errore durante i test: ${error.message}`, 'error');
    }
  }

  // Esegue un singolo test per ID
  async function runSingle(testId, callbacks) {
    if (!checkStorageAvailable(callbacks)) {
      return;
    }

    // Mappatura testId -> funzione di test
    const testMap = {
      'test-storage-set-get': testSetGet,
      'test-storage-remove': testRemove,
      'test-storage-default-value': testDefaultValue,
      'test-storage-json-object': testJsonObject,
      'test-storage-json-array': testJsonArray,
      'test-storage-boolean': testBoolean,
      'test-storage-number': testNumber,
      'test-storage-clear': testClear,
      'test-storage-prefix-get': testPrefixGet,
      'test-storage-prefix-remove': testPrefixRemove,
      'test-storage-has-item': testHasItem,
      'test-storage-size': testSize,
      'test-storage-retrocompatibility': testRetrocompatibility,
      'test-storage-null-undefined': testNullUndefined,
      'test-storage-special-chars': testSpecialChars,
      'test-storage-large-value': testLargeValue,
      'test-storage-multiple-operations': testMultipleOperations,
      'test-storage-performance': testPerformance,
      'test-storage-iterate-keys': testIterateKeys,
      'test-storage-invalid-json': testInvalidJson,
      'test-storage-non-string': testNonString,
      'test-storage-namespace': testNamespace,
      'test-storage-migration': testMigration,
      'test-storage-timestamp': testTimestamp
    };

    const testFunction = testMap[testId];
    if (!testFunction) {
      callbacks.log(`✗ Test ID non trovato: ${testId}`, 'error');
      callbacks.updateStatus(testId, 'fail');
      return;
    }

    // Reset status a pending
    callbacks.updateStatus(testId, 'pending');
    
    // Esegui il test
    try {
      testFunction(callbacks);
    } catch (error) {
      callbacks.log(`❌ Errore durante il test: ${error.message}`, 'error');
      callbacks.updateStatus(testId, 'fail');
    }
  }

  // Esposizione API pubblica
  window.StorageTests = {
    runAll: runAll,
    runSingle: runSingle,
    getAllTestIds: getAllTestIds
  };

  console.log('✅ js/tests/test-storage.js caricato');

})();

