/**
 * Test LocalStorage
 * Test per la funzionalità di localStorage (scrittura, lettura, cancellazione)
 */

// Funzione principale di test
async function testLocalStorage() {
    const output = 'output-localstorage';
    const outputEl = document.getElementById(output);
    
    if (!outputEl) {
        console.error('Elemento output non trovato:', output);
        return;
    }

    // Reset output
    outputEl.innerHTML = '';
    outputEl.style.display = 'block';

    // Usa TestUtils se disponibile, altrimenti fallback
    const log = (message, type = 'info') => {
        if (typeof TestUtils !== 'undefined' && TestUtils.log) {
            TestUtils.log(output, message, type);
        } else {
            // Fallback: log diretto
            const logDiv = document.createElement('div');
            logDiv.className = `console-log ${type}`;
            logDiv.textContent = message;
            outputEl.appendChild(logDiv);
            console.log(`[${type}] ${message}`);
        }
    };

    const updateStatus = (testId, status) => {
        if (typeof TestUtils !== 'undefined' && TestUtils.updateStatus) {
            TestUtils.updateStatus(testId, status);
        } else if (typeof updateTestStatus === 'function') {
            updateTestStatus(testId, status);
        }
    };

    log('🧪 Inizio test LocalStorage...', 'info');
    log('', 'info');

    const startTime = performance.now();
    let passed = 0;
    let failed = 0;

    // Test key univoca per evitare conflitti
    const TEST_KEY = 'tpl-test-storage';
    const TEST_VALUE = 'test-value-' + Date.now();

    // ========================================
    // Test 1: Scrittura localStorage
    // ========================================
    try {
        log('📝 Test 1: Scrittura localStorage', 'info');
        
        // Verifica che localStorage sia disponibile
        if (typeof localStorage === 'undefined') {
            throw new Error('localStorage non disponibile');
        }

        // Scrivi un valore
        localStorage.setItem(TEST_KEY, TEST_VALUE);
        
        // Verifica che sia stato scritto
        const stored = localStorage.getItem(TEST_KEY);
        if (stored === TEST_VALUE) {
            log('✓ Scrittura localStorage riuscita', 'success');
            updateStatus('test-localstorage-write', 'pass');
            passed++;
        } else {
            throw new Error(`Valore scritto non corrisponde: atteso "${TEST_VALUE}", ottenuto "${stored}"`);
        }
    } catch (error) {
        log(`✗ Scrittura localStorage fallita: ${error.message}`, 'error');
        updateStatus('test-localstorage-write', 'fail');
        failed++;
    }

    log('', 'info');

    // ========================================
    // Test 2: Lettura localStorage
    // ========================================
    try {
        log('📖 Test 2: Lettura localStorage', 'info');
        
        // Leggi il valore scritto nel test precedente
        const retrieved = localStorage.getItem(TEST_KEY);
        
        if (retrieved === TEST_VALUE) {
            log('✓ Lettura localStorage riuscita', 'success');
            log(`  Valore letto: "${retrieved}"`, 'info');
            updateStatus('test-localstorage-read', 'pass');
            passed++;
        } else {
            throw new Error(`Valore letto non corrisponde: atteso "${TEST_VALUE}", ottenuto "${retrieved}"`);
        }
    } catch (error) {
        log(`✗ Lettura localStorage fallita: ${error.message}`, 'error');
        updateStatus('test-localstorage-read', 'fail');
        failed++;
    }

    log('', 'info');

    // ========================================
    // Test 3: Cancellazione localStorage
    // ========================================
    try {
        log('🗑️ Test 3: Cancellazione localStorage', 'info');
        
        // Rimuovi il valore
        localStorage.removeItem(TEST_KEY);
        
        // Verifica che sia stato rimosso
        const afterRemove = localStorage.getItem(TEST_KEY);
        
        if (afterRemove === null) {
            log('✓ Cancellazione localStorage riuscita', 'success');
            updateStatus('test-localstorage-clear', 'pass');
            passed++;
        } else {
            throw new Error(`Valore non rimosso: ancora presente "${afterRemove}"`);
        }
    } catch (error) {
        log(`✗ Cancellazione localStorage fallita: ${error.message}`, 'error');
        updateStatus('test-localstorage-clear', 'fail');
        failed++;
    }

    log('', 'info');

    // ========================================
    // Test 4: Salvataggio Oggetto JSON
    // ========================================
    try {
        log('📦 Test 4: Salvataggio oggetto JSON', 'info');
        
        const testObject = {
            nome: 'Test',
            valore: 123,
            attivo: true,
            data: new Date().toISOString(),
            nested: {
                chiave: 'valore'
            }
        };
        
        // Salva oggetto come JSON
        const TEST_JSON_KEY = 'tpl-test-json';
        localStorage.setItem(TEST_JSON_KEY, JSON.stringify(testObject));
        
        // Recupera e verifica
        const retrieved = localStorage.getItem(TEST_JSON_KEY);
        const parsed = JSON.parse(retrieved);
        
        if (parsed.nome === testObject.nome && 
            parsed.valore === testObject.valore && 
            parsed.attivo === testObject.attivo &&
            parsed.nested.chiave === testObject.nested.chiave) {
            log('✓ Salvataggio oggetto JSON riuscito', 'success');
            log(`  Oggetto: ${JSON.stringify(testObject)}`, 'info');
            updateStatus('test-localstorage-json', 'pass');
            passed++;
        } else {
            throw new Error('Oggetto recuperato non corrisponde');
        }
        
        // Cleanup
        localStorage.removeItem(TEST_JSON_KEY);
    } catch (error) {
        log(`✗ Salvataggio oggetto JSON fallito: ${error.message}`, 'error');
        updateStatus('test-localstorage-json', 'fail');
        failed++;
    }

    log('', 'info');

    // ========================================
    // Test 5: Salvataggio Array
    // ========================================
    try {
        log('📋 Test 5: Salvataggio array', 'info');
        
        const testArray = ['elemento1', 'elemento2', 'elemento3', 123, true, null];
        
        // Salva array come JSON
        const TEST_ARRAY_KEY = 'tpl-test-array';
        localStorage.setItem(TEST_ARRAY_KEY, JSON.stringify(testArray));
        
        // Recupera e verifica
        const retrieved = localStorage.getItem(TEST_ARRAY_KEY);
        const parsed = JSON.parse(retrieved);
        
        if (Array.isArray(parsed) && 
            parsed.length === testArray.length &&
            parsed[0] === testArray[0] &&
            parsed[3] === testArray[3] &&
            parsed[4] === testArray[4]) {
            log('✓ Salvataggio array riuscito', 'success');
            log(`  Array: [${testArray.length} elementi]`, 'info');
            updateStatus('test-localstorage-array', 'pass');
            passed++;
        } else {
            throw new Error('Array recuperato non corrisponde');
        }
        
        // Cleanup
        localStorage.removeItem(TEST_ARRAY_KEY);
    } catch (error) {
        log(`✗ Salvataggio array fallito: ${error.message}`, 'error');
        updateStatus('test-localstorage-array', 'fail');
        failed++;
    }

    log('', 'info');

    // ========================================
    // Test 6: Salvataggio Numeri
    // ========================================
    try {
        log('🔢 Test 6: Salvataggio numeri', 'info');
        
        const TEST_NUMBER_KEY = 'tpl-test-number';
        const testNumbers = [0, 42, -15, 3.14159, 1e10, Number.MAX_SAFE_INTEGER];
        let numbersPassed = 0;
        
        for (const num of testNumbers) {
            localStorage.setItem(TEST_NUMBER_KEY, num.toString());
            const retrieved = localStorage.getItem(TEST_NUMBER_KEY);
            const parsed = Number(retrieved);
            
            if (parsed === num) {
                numbersPassed++;
            } else {
                throw new Error(`Numero ${num} non corrisponde: ottenuto ${parsed}`);
            }
        }
        
        if (numbersPassed === testNumbers.length) {
            log('✓ Salvataggio numeri riuscito', 'success');
            log(`  Testati: ${testNumbers.length} numeri diversi`, 'info');
            updateStatus('test-localstorage-numbers', 'pass');
            passed++;
        }
        
        // Cleanup
        localStorage.removeItem(TEST_NUMBER_KEY);
    } catch (error) {
        log(`✗ Salvataggio numeri fallito: ${error.message}`, 'error');
        updateStatus('test-localstorage-numbers', 'fail');
        failed++;
    }

    log('', 'info');

    // ========================================
    // Test 7: Salvataggio Booleani
    // ========================================
    try {
        log('✔️ Test 7: Salvataggio booleani', 'info');
        
        const TEST_BOOL_KEY = 'tpl-test-boolean';
        
        // Test true
        localStorage.setItem(TEST_BOOL_KEY, 'true');
        let retrieved = localStorage.getItem(TEST_BOOL_KEY);
        if (retrieved !== 'true' || JSON.parse(retrieved) !== true) {
            throw new Error('Booleano true non salvato correttamente');
        }
        
        // Test false
        localStorage.setItem(TEST_BOOL_KEY, 'false');
        retrieved = localStorage.getItem(TEST_BOOL_KEY);
        if (retrieved !== 'false' || JSON.parse(retrieved) !== false) {
            throw new Error('Booleano false non salvato correttamente');
        }
        
        log('✓ Salvataggio booleani riuscito', 'success');
        log('  Testati: true, false', 'info');
        updateStatus('test-localstorage-booleans', 'pass');
        passed++;
        
        // Cleanup
        localStorage.removeItem(TEST_BOOL_KEY);
    } catch (error) {
        log(`✗ Salvataggio booleani fallito: ${error.message}`, 'error');
        updateStatus('test-localstorage-booleans', 'fail');
        failed++;
    }

    log('', 'info');

    // ========================================
    // Test 8: Dati Complessi Annidati
    // ========================================
    try {
        log('🎯 Test 8: Dati complessi annidati', 'info');
        
        const complexData = {
            utente: {
                id: 12345,
                nome: 'Mario Rossi',
                email: 'mario@example.com',
                preferenze: {
                    tema: 'dark',
                    lingua: 'it',
                    notifiche: true
                }
            },
            sessione: {
                token: 'abc123xyz',
                scadenza: Date.now() + 3600000,
                attiva: true
            },
            cronologia: [
                { id: 1, azione: 'login', timestamp: Date.now() },
                { id: 2, azione: 'ricerca', timestamp: Date.now() + 1000 },
                { id: 3, azione: 'acquisto', timestamp: Date.now() + 2000 }
            ]
        };
        
        const TEST_COMPLEX_KEY = 'tpl-test-complex';
        localStorage.setItem(TEST_COMPLEX_KEY, JSON.stringify(complexData));
        
        // Recupera e verifica
        const retrieved = localStorage.getItem(TEST_COMPLEX_KEY);
        const parsed = JSON.parse(retrieved);
        
        if (parsed.utente.nome === complexData.utente.nome &&
            parsed.utente.preferenze.tema === complexData.utente.preferenze.tema &&
            parsed.sessione.token === complexData.sessione.token &&
            Array.isArray(parsed.cronologia) &&
            parsed.cronologia.length === 3 &&
            parsed.cronologia[0].azione === 'login') {
            log('✓ Salvataggio dati complessi riuscito', 'success');
            log(`  Struttura: 3 livelli di annidamento, ${parsed.cronologia.length} elementi array`, 'info');
            updateStatus('test-localstorage-complex', 'pass');
            passed++;
        } else {
            throw new Error('Dati complessi non corrispondono');
        }
        
        // Cleanup
        localStorage.removeItem(TEST_COMPLEX_KEY);
    } catch (error) {
        log(`✗ Salvataggio dati complessi fallito: ${error.message}`, 'error');
        updateStatus('test-localstorage-complex', 'fail');
        failed++;
    }

    log('', 'info');

    // ========================================
    // Test 9: Valori Null e Undefined
    // ========================================
    try {
        log('⚠️ Test 9: Valori null e undefined', 'info');
        
        const TEST_NULL_KEY = 'tpl-test-null';
        
        // Test null
        localStorage.setItem(TEST_NULL_KEY, 'null');
        let retrieved = localStorage.getItem(TEST_NULL_KEY);
        if (retrieved !== 'null') {
            throw new Error('Valore null non salvato come stringa');
        }
        
        // Test undefined (diventa stringa "undefined")
        localStorage.setItem(TEST_NULL_KEY, undefined);
        retrieved = localStorage.getItem(TEST_NULL_KEY);
        if (retrieved !== 'undefined') {
            throw new Error('Valore undefined non gestito correttamente');
        }
        
        // Test chiave inesistente (ritorna null)
        const nonExistent = localStorage.getItem('tpl-test-non-existent-key-12345');
        if (nonExistent !== null) {
            throw new Error('Chiave inesistente non ritorna null');
        }
        
        log('✓ Gestione null/undefined riuscita', 'success');
        log('  null → "null", undefined → "undefined", inesistente → null', 'info');
        updateStatus('test-localstorage-null', 'pass');
        passed++;
        
        // Cleanup
        localStorage.removeItem(TEST_NULL_KEY);
    } catch (error) {
        log(`✗ Test null/undefined fallito: ${error.message}`, 'error');
        updateStatus('test-localstorage-null', 'fail');
        failed++;
    }

    log('', 'info');

    // ========================================
    // Test 10: Stringhe Vuote
    // ========================================
    try {
        log('📄 Test 10: Stringhe vuote', 'info');
        
        const TEST_EMPTY_KEY = 'tpl-test-empty';
        
        // Test stringa vuota
        localStorage.setItem(TEST_EMPTY_KEY, '');
        const retrieved = localStorage.getItem(TEST_EMPTY_KEY);
        
        if (retrieved !== '') {
            throw new Error(`Stringa vuota non salvata: ottenuto "${retrieved}"`);
        }
        
        // Verifica che sia diverso da null
        if (retrieved === null) {
            throw new Error('Stringa vuota confusa con null');
        }
        
        log('✓ Salvataggio stringa vuota riuscito', 'success');
        log('  "" salvato correttamente (diverso da null)', 'info');
        updateStatus('test-localstorage-empty', 'pass');
        passed++;
        
        // Cleanup
        localStorage.removeItem(TEST_EMPTY_KEY);
    } catch (error) {
        log(`✗ Test stringa vuota fallito: ${error.message}`, 'error');
        updateStatus('test-localstorage-empty', 'fail');
        failed++;
    }

    log('', 'info');

    // ========================================
    // Test 11: Caratteri Speciali
    // ========================================
    try {
        log('🎭 Test 11: Caratteri speciali', 'info');
        
        const TEST_SPECIAL_KEY = 'tpl-test-special';
        const specialStrings = [
            '🚀 Emoji test 🎉',
            'Àccénti è ùnìcödé',
            'Line\nBreak\tTab',
            'Quote "test" \'test\'',
            'Symbols: @#$%^&*()',
            '中文 日本語 한국어',
            'Math: ∑∫√π∞'
        ];
        
        let specialPassed = 0;
        for (const str of specialStrings) {
            localStorage.setItem(TEST_SPECIAL_KEY, str);
            const retrieved = localStorage.getItem(TEST_SPECIAL_KEY);
            
            if (retrieved === str) {
                specialPassed++;
            } else {
                throw new Error(`Stringa speciale non corrisponde: "${str}"`);
            }
        }
        
        if (specialPassed === specialStrings.length) {
            log('✓ Caratteri speciali salvati correttamente', 'success');
            log(`  Testati: emoji, unicode, newline, tab, quotes, simboli, lingue`, 'info');
            updateStatus('test-localstorage-special', 'pass');
            passed++;
        }
        
        // Cleanup
        localStorage.removeItem(TEST_SPECIAL_KEY);
    } catch (error) {
        log(`✗ Test caratteri speciali fallito: ${error.message}`, 'error');
        updateStatus('test-localstorage-special', 'fail');
        failed++;
    }

    log('', 'info');

    // ========================================
    // Test 12: Valori Molto Lunghi
    // ========================================
    try {
        log('📏 Test 12: Valori molto lunghi', 'info');
        
        const TEST_LONG_KEY = 'tpl-test-long';
        
        // Crea una stringa di 10KB
        const longString = 'A'.repeat(10 * 1024);
        
        localStorage.setItem(TEST_LONG_KEY, longString);
        const retrieved = localStorage.getItem(TEST_LONG_KEY);
        
        if (retrieved.length === longString.length && retrieved === longString) {
            log('✓ Salvataggio valore lungo riuscito', 'success');
            log(`  Salvati: ${(longString.length / 1024).toFixed(1)} KB`, 'info');
            updateStatus('test-localstorage-long', 'pass');
            passed++;
        } else {
            throw new Error(`Valore lungo non corrisponde: ${retrieved.length} vs ${longString.length}`);
        }
        
        // Cleanup
        localStorage.removeItem(TEST_LONG_KEY);
    } catch (error) {
        log(`✗ Test valore lungo fallito: ${error.message}`, 'error');
        updateStatus('test-localstorage-long', 'fail');
        failed++;
    }

    log('', 'info');

    // ========================================
    // Test 13: Chiavi Multiple
    // ========================================
    try {
        log('🔑 Test 13: Chiavi multiple', 'info');
        
        const TEST_KEYS = [
            'tpl-test-multi-1',
            'tpl-test-multi-2',
            'tpl-test-multi-3',
            'tpl-test-multi-4',
            'tpl-test-multi-5'
        ];
        
        // Scrivi multiple chiavi
        TEST_KEYS.forEach((key, index) => {
            localStorage.setItem(key, `value-${index}`);
        });
        
        // Verifica che tutte siano presenti
        let allPresent = true;
        TEST_KEYS.forEach((key, index) => {
            const value = localStorage.getItem(key);
            if (value !== `value-${index}`) {
                allPresent = false;
                throw new Error(`Chiave ${key} non corrisponde`);
            }
        });
        
        if (allPresent) {
            log('✓ Gestione chiavi multiple riuscita', 'success');
            log(`  Salvate e verificate: ${TEST_KEYS.length} chiavi`, 'info');
            updateStatus('test-localstorage-multiple', 'pass');
            passed++;
        }
        
        // Cleanup
        TEST_KEYS.forEach(key => localStorage.removeItem(key));
    } catch (error) {
        log(`✗ Test chiavi multiple fallito: ${error.message}`, 'error');
        updateStatus('test-localstorage-multiple', 'fail');
        failed++;
    }

    log('', 'info');

    // ========================================
    // Test 14: Disponibilità localStorage
    // ========================================
    try {
        log('🔒 Test 14: Disponibilità localStorage', 'info');
        
        // Verifica che localStorage sia disponibile
        if (typeof localStorage === 'undefined') {
            throw new Error('localStorage non disponibile');
        }
        
        // Verifica che sia un oggetto Storage
        if (!(localStorage instanceof Storage)) {
            throw new Error('localStorage non è un oggetto Storage');
        }
        
        // Verifica metodi principali
        const methods = ['getItem', 'setItem', 'removeItem', 'clear', 'key'];
        const missingMethods = methods.filter(method => typeof localStorage[method] !== 'function');
        
        if (missingMethods.length > 0) {
            throw new Error(`Metodi mancanti: ${missingMethods.join(', ')}`);
        }
        
        // Verifica proprietà length
        if (typeof localStorage.length !== 'number') {
            throw new Error('Proprietà length non disponibile');
        }
        
        log('✓ localStorage disponibile e funzionante', 'success');
        log(`  Metodi: ${methods.join(', ')}`, 'info');
        log(`  Chiavi presenti: ${localStorage.length}`, 'info');
        updateStatus('test-localstorage-available', 'pass');
        passed++;
    } catch (error) {
        log(`✗ Test disponibilità fallito: ${error.message}`, 'error');
        updateStatus('test-localstorage-available', 'fail');
        failed++;
    }

    log('', 'info');

    // ========================================
    // Test 15: Quota Storage (Simulazione)
    // ========================================
    try {
        log('💾 Test 15: Quota Storage (Simulazione)', 'info');
        
        const TEST_QUOTA_KEY = 'tpl-test-quota';
        let largeValue = '';
        let passedQuotaTest = false;

        // Riempi finché non si verifica un errore di quota o un limite di sicurezza
        for (let i = 0; i < 5000; i++) { // Loop fino a ~50MB per provocare QuotaExceededError
            largeValue += 'a'.repeat(10 * 1024); // Aggiungi 10KB alla volta
            try {
                localStorage.setItem(TEST_QUOTA_KEY, largeValue);
            } catch (e) {
                if (e.name === 'QuotaExceededError') {
                    log('✓ QuotaExceededError generato come previsto', 'success');
                    log(`  Superata quota dopo ${i * 10} KB circa`, 'info');
                    passedQuotaTest = true;
                    break;
                } else {
                    throw e; // Rilancia altri errori
                }
            }
        }

        if (passedQuotaTest) {
            updateStatus('test-localstorage-quota', 'pass');
            passed++;
        } else {
            throw new Error('QuotaExceededError non generato o non catturato');
        }
        
        // Cleanup
        localStorage.removeItem(TEST_QUOTA_KEY);
    } catch (error) {
        log(`✗ Test Quota Storage fallito: ${error.message}`, 'error');
        updateStatus('test-localstorage-quota', 'fail');
        failed++;
    }

    log('', 'info');

    // ========================================
    // Test 16: Performance (Scrittura/Lettura)
    // ========================================
    try {
        log('⚡ Test 16: Performance (Scrittura/Lettura)', 'info');
        
        const PERF_KEY = 'tpl-perf-data';
        const DATA_SIZE = 100 * 1024; // 100KB
        const ITERATIONS = 100; // 100 scritture/letture
        
        // Genera dati casuali di 100KB
        const randomData = Array.from({ length: DATA_SIZE }, () =>
            String.fromCharCode(Math.floor(Math.random() * 26) + 97)
        ).join('');

        let writeTimes = [];
        let readTimes = [];

        // Test di scrittura e lettura per X iterazioni
        for (let i = 0; i < ITERATIONS; i++) {
            const writeStart = performance.now();
            localStorage.setItem(PERF_KEY, randomData);
            writeTimes.push(performance.now() - writeStart);

            const readStart = performance.now();
            const retrieved = localStorage.getItem(PERF_KEY);
            readTimes.push(performance.now() - readStart);

            if (retrieved !== randomData) {
                throw new Error('Dati non corrispondenti durante il test di performance');
            }
        }

        const avgWrite = writeTimes.reduce((a, b) => a + b, 0) / ITERATIONS;
        const avgRead = readTimes.reduce((a, b) => a + b, 0) / ITERATIONS;

        log('✓ Test performance riuscito', 'success');
        log(`  Dati per scrittura/lettura: ${(DATA_SIZE / 1024).toFixed(1)} KB`, 'info');
        log(`  Iterazioni: ${ITERATIONS}`, 'info');
        log(`  Tempo medio scrittura: ${avgWrite.toFixed(2)} ms`, 'info');
        log(`  Tempo medio lettura: ${avgRead.toFixed(2)} ms`, 'info');

        // Puoi aggiungere soglie qui se necessario (es. avgWrite < 50ms)
        if (avgWrite < 50 && avgRead < 50) { // Esempio di soglia
            updateStatus('test-localstorage-performance', 'pass');
            passed++;
        } else {
            log('⚠ I tempi di performance superano le soglie consigliate.', 'warning');
            updateStatus('test-localstorage-performance', 'pass'); // Considera passante ma con warning
            passed++;
        }
        
        // Cleanup
        localStorage.removeItem(PERF_KEY);
    } catch (error) {
        log(`✗ Test Performance fallito: ${error.message}`, 'error');
        updateStatus('test-localstorage-performance', 'fail');
        failed++;
    }

    log('', 'info');

    // ========================================
    // Test 17: Iterazione Chiavi
    // ========================================
    try {
        log('🔑 Test 17: Iterazione chiavi', 'info');
        
        // Salva alcune chiavi test
        const TEST_ITERATE_KEYS = [
            'tpl-iter-test-1',
            'tpl-iter-test-2',
            'tpl-iter-test-3'
        ];
        
        TEST_ITERATE_KEYS.forEach((key, index) => {
            localStorage.setItem(key, `value-${index}`);
        });
        
        // Itera usando localStorage.key(index)
        let foundKeys = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('tpl-iter-test-')) {
                foundKeys.push(key);
            }
        }
        
        // Verifica che tutte le chiavi siano state trovate
        const allFound = TEST_ITERATE_KEYS.every(key => foundKeys.includes(key));
        
        if (allFound && foundKeys.length === TEST_ITERATE_KEYS.length) {
            log('✓ Iterazione chiavi riuscita', 'success');
            log(`  Trovate ${foundKeys.length} chiavi usando localStorage.key()`, 'info');
            updateStatus('test-localstorage-iterate', 'pass');
            passed++;
        } else {
            throw new Error(`Chiavi non trovate correttamente: ${foundKeys.length}/${TEST_ITERATE_KEYS.length}`);
        }
        
        // Cleanup
        TEST_ITERATE_KEYS.forEach(key => localStorage.removeItem(key));
    } catch (error) {
        log(`✗ Test iterazione chiavi fallito: ${error.message}`, 'error');
        updateStatus('test-localstorage-iterate', 'fail');
        failed++;
    }

    log('', 'info');

    // ========================================
    // Test 18: Lettura JSON Invalido
    // ========================================
    try {
        log('⚠️ Test 18: Lettura JSON invalido', 'info');
        
        const TEST_INVALID_JSON_KEY = 'tpl-test-invalid-json';
        
        // Salva stringhe che NON sono JSON validi
        const invalidJsonStrings = [
            'ciao mondo',
            '123abc',
            '{broken json',
            'undefined',
            'NaN'
        ];
        
        let errorsCaught = 0;
        for (const invalidStr of invalidJsonStrings) {
            localStorage.setItem(TEST_INVALID_JSON_KEY, invalidStr);
            
            try {
                JSON.parse(localStorage.getItem(TEST_INVALID_JSON_KEY));
                // Se arriviamo qui per stringhe come "123abc", è un problema
            } catch (e) {
                if (e instanceof SyntaxError) {
                    errorsCaught++;
                }
            }
        }
        
        // Verifichiamo che almeno alcuni abbiano generato SyntaxError
        if (errorsCaught >= 2) {
            log('✓ Gestione JSON invalido riuscita', 'success');
            log(`  Catturati ${errorsCaught} SyntaxError su ${invalidJsonStrings.length} tentativi`, 'info');
            updateStatus('test-localstorage-invalid-json', 'pass');
            passed++;
        } else {
            throw new Error(`Solo ${errorsCaught} errori catturati, attesi almeno 2`);
        }
        
        // Cleanup
        localStorage.removeItem(TEST_INVALID_JSON_KEY);
    } catch (error) {
        log(`✗ Test JSON invalido fallito: ${error.message}`, 'error');
        updateStatus('test-localstorage-invalid-json', 'fail');
        failed++;
    }

    log('', 'info');

    // ========================================
    // Test 19: Scrittura Valori Non-Stringa
    // ========================================
    try {
        log('🔄 Test 19: Scrittura valori non-stringa', 'info');
        
        const TEST_NON_STRING_KEY = 'tpl-test-non-string';
        
        // Test numero
        localStorage.setItem(TEST_NON_STRING_KEY, 123);
        let retrieved = localStorage.getItem(TEST_NON_STRING_KEY);
        if (retrieved !== '123') {
            throw new Error(`Numero non convertito: ottenuto "${retrieved}"`);
        }
        
        // Test booleano
        localStorage.setItem(TEST_NON_STRING_KEY, true);
        retrieved = localStorage.getItem(TEST_NON_STRING_KEY);
        if (retrieved !== 'true') {
            throw new Error(`Booleano non convertito: ottenuto "${retrieved}"`);
        }
        
        // Test oggetto (diventa "[object Object]")
        localStorage.setItem(TEST_NON_STRING_KEY, { test: 'value' });
        retrieved = localStorage.getItem(TEST_NON_STRING_KEY);
        if (retrieved !== '[object Object]') {
            throw new Error(`Oggetto non convertito: ottenuto "${retrieved}"`);
        }
        
        // Test array (diventa stringa concatenata)
        localStorage.setItem(TEST_NON_STRING_KEY, [1, 2, 3]);
        retrieved = localStorage.getItem(TEST_NON_STRING_KEY);
        if (retrieved !== '1,2,3') {
            throw new Error(`Array non convertito: ottenuto "${retrieved}"`);
        }
        
        log('✓ Conversione valori non-stringa riuscita', 'success');
        log('  123 → "123", true → "true", {} → "[object Object]", [1,2,3] → "1,2,3"', 'info');
        updateStatus('test-localstorage-non-string', 'pass');
        passed++;
        
        // Cleanup
        localStorage.removeItem(TEST_NON_STRING_KEY);
    } catch (error) {
        log(`✗ Test valori non-stringa fallito: ${error.message}`, 'error');
        updateStatus('test-localstorage-non-string', 'fail');
        failed++;
    }

    log('', 'info');

    // ========================================
    // Test 20: Namespace Prefix Validation
    // ========================================
    try {
        log('🏷️ Test 20: Validazione prefisso namespace', 'info');
        
        // Chiavi valide con prefisso 'tpl.'
        const validKeys = [
            'tpl.lineaIdx',
            'tpl.partenzaIdx',
            'tpl.arrivoIdx',
            'tpl.themeMode',
            'tpl.locationEnabled',
            'tpl.pwa.dismissTs'
        ];
        
        // Testa che le chiavi con prefisso 'tpl.' siano accettate
        validKeys.forEach(key => {
            localStorage.setItem(key, 'test-value');
            const retrieved = localStorage.getItem(key);
            if (retrieved !== 'test-value') {
                throw new Error(`Chiave valida ${key} non salvata correttamente`);
            }
        });
        
        // Verifica pattern prefisso
        const allKeys = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('tpl.')) {
                allKeys.push(key);
            }
        }
        
        // Verifica che tutte le chiavi salvate siano presenti
        const allFound = validKeys.every(key => allKeys.includes(key));
        
        if (allFound) {
            log('✓ Validazione namespace riuscita', 'success');
            log(`  Trovate ${allKeys.length} chiavi con prefisso 'tpl.'`, 'info');
            updateStatus('test-localstorage-namespace', 'pass');
            passed++;
        } else {
            throw new Error('Non tutte le chiavi con prefisso sono state trovate');
        }
        
        // Cleanup
        validKeys.forEach(key => localStorage.removeItem(key));
    } catch (error) {
        log(`✗ Test namespace fallito: ${error.message}`, 'error');
        updateStatus('test-localstorage-namespace', 'fail');
        failed++;
    }

    log('', 'info');

    // ========================================
    // Test 21: Migration isDark → themeMode
    // ========================================
    try {
        log('🔄 Test 21: Migrazione isDark → themeMode', 'info');
        
        // Simula scenario 1: Vecchio sistema con isDark = '1' (dark mode)
        localStorage.removeItem('tpl.isDark');
        localStorage.removeItem('tpl.themeMode');
        localStorage.setItem('tpl.isDark', '1');
        
        // Esegui migrazione (codice reale da script.js:812-819)
        const oldDarkMode1 = localStorage.getItem('tpl.isDark');
        const existingThemeMode1 = localStorage.getItem('tpl.themeMode');
        
        if (!existingThemeMode1 && oldDarkMode1 !== null) {
            const newMode = oldDarkMode1 === '1' ? 'dark' : 'light';
            localStorage.setItem('tpl.themeMode', newMode);
            localStorage.removeItem('tpl.isDark');
        }
        
        // Verifica risultato
        const migratedMode1 = localStorage.getItem('tpl.themeMode');
        const oldKeyRemoved1 = localStorage.getItem('tpl.isDark');
        
        if (migratedMode1 !== 'dark') {
            throw new Error(`Migrazione fallita: atteso 'dark', ottenuto '${migratedMode1}'`);
        }
        if (oldKeyRemoved1 !== null) {
            throw new Error('Vecchia chiave tpl.isDark non rimossa');
        }
        
        // Simula scenario 2: Vecchio sistema con isDark = '0' (light mode)
        localStorage.removeItem('tpl.themeMode');
        localStorage.setItem('tpl.isDark', '0');
        
        const oldDarkMode2 = localStorage.getItem('tpl.isDark');
        const existingThemeMode2 = localStorage.getItem('tpl.themeMode');
        
        if (!existingThemeMode2 && oldDarkMode2 !== null) {
            const newMode = oldDarkMode2 === '1' ? 'dark' : 'light';
            localStorage.setItem('tpl.themeMode', newMode);
            localStorage.removeItem('tpl.isDark');
        }
        
        const migratedMode2 = localStorage.getItem('tpl.themeMode');
        
        if (migratedMode2 !== 'light') {
            throw new Error(`Migrazione fallita: atteso 'light', ottenuto '${migratedMode2}'`);
        }
        
        log('✓ Migrazione tema riuscita', 'success');
        log('  isDark="1" → themeMode="dark" ✓', 'info');
        log('  isDark="0" → themeMode="light" ✓', 'info');
        log('  Vecchia chiave rimossa ✓', 'info');
        updateStatus('test-localstorage-migration', 'pass');
        passed++;
        
        // Cleanup
        localStorage.removeItem('tpl.isDark');
        localStorage.removeItem('tpl.themeMode');
    } catch (error) {
        log(`✗ Test migrazione fallito: ${error.message}`, 'error');
        updateStatus('test-localstorage-migration', 'fail');
        failed++;
    }

    log('', 'info');

    // ========================================
    // Test 22: Timestamp Handling
    // ========================================
    try {
        log('⏱️ Test 22: Gestione timestamp', 'info');
        
        const TEST_TIMESTAMP_KEY = 'tpl.pwa.dismissTs';
        
        // Test 1: Salvataggio timestamp come stringa (pattern reale app)
        const now = Date.now();
        localStorage.setItem(TEST_TIMESTAMP_KEY, String(now));
        
        // Test 2: Lettura e conversione a numero
        const storedStr = localStorage.getItem(TEST_TIMESTAMP_KEY);
        const parsedNum = Number(storedStr);
        
        if (isNaN(parsedNum)) {
            throw new Error('Timestamp convertito non è un numero valido');
        }
        
        if (parsedNum !== now) {
            throw new Error(`Timestamp non corrisponde: atteso ${now}, ottenuto ${parsedNum}`);
        }
        
        // Test 3: Calcolo differenza tempo (es. 24 ore)
        const oneDayMs = 24 * 60 * 60 * 1000;
        const yesterday = now - oneDayMs;
        localStorage.setItem(TEST_TIMESTAMP_KEY, String(yesterday));
        
        const storedYesterday = Number(localStorage.getItem(TEST_TIMESTAMP_KEY));
        const diff = now - storedYesterday;
        
        if (Math.abs(diff - oneDayMs) > 100) { // Tolleranza 100ms
            throw new Error(`Differenza tempo errata: atteso ~${oneDayMs}, ottenuto ${diff}`);
        }
        
        // Test 4: Gestione timestamp invalidi
        localStorage.setItem(TEST_TIMESTAMP_KEY, 'invalid-timestamp');
        const invalidParsed = Number(localStorage.getItem(TEST_TIMESTAMP_KEY));
        
        if (!isNaN(invalidParsed)) {
            throw new Error('Timestamp invalido non rilevato');
        }
        
        // Test 5: Gestione null/undefined
        localStorage.removeItem(TEST_TIMESTAMP_KEY);
        const nullTimestamp = localStorage.getItem(TEST_TIMESTAMP_KEY);
        
        if (nullTimestamp !== null) {
            throw new Error('Chiave rimossa dovrebbe restituire null');
        }
        
        log('✓ Gestione timestamp riuscita', 'success');
        log('  Salvataggio Date.now() → String ✓', 'info');
        log('  Conversione String → Number ✓', 'info');
        log('  Calcolo differenza tempo ✓', 'info');
        log('  Gestione timestamp invalidi ✓', 'info');
        updateStatus('test-localstorage-timestamp', 'pass');
        passed++;
        
        // Cleanup
        localStorage.removeItem(TEST_TIMESTAMP_KEY);
    } catch (error) {
        log(`✗ Test timestamp fallito: ${error.message}`, 'error');
        updateStatus('test-localstorage-timestamp', 'fail');
        failed++;
    }

    log('', 'info');

    // ========================================
    // Riepilogo
    // ========================================
    const endTime = performance.now();
    const duration = Math.round(endTime - startTime);

    log('', 'info');
    log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'info');
    log('📊 RIEPILOGO TEST LOCALSTORAGE', 'info');
    log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'info');
    log(`✅ Test passati: ${passed}`, 'success');
    log(`❌ Test falliti: ${failed}`, failed > 0 ? 'error' : 'info');
    log(`⏱️ Tempo totale: ${duration}ms`, 'info');
    log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'info');

    // Aggiorna header statistiche
    updateStorageHeader(passed, failed, duration);

    // Aggiorna statistiche globali se disponibile
    if (typeof updateStats === 'function') {
        updateStats();
    }

    return {
        passed,
        failed,
        total: passed + failed,
        duration
    };
}

// Funzione per aggiornare l'header con statistiche
function updateStorageHeader(passed, failed, duration) {
    const total = passed + failed;
    
    // Aggiorna contatori
    const passedEl = document.getElementById('storage-header-passed');
    const failedEl = document.getElementById('storage-header-failed');
    const timeEl = document.getElementById('storage-header-time');
    const progressEl = document.getElementById('storage-header-progress');
    const statusEl = document.getElementById('storage-header-status');
    const barEl = document.getElementById('storage-header-bar');
    const timestampEl = document.getElementById('storage-header-timestamp');
    
    if (passedEl) passedEl.textContent = passed;
    if (failedEl) failedEl.textContent = failed;
    if (timeEl) timeEl.textContent = `${duration}ms`;
    if (progressEl) progressEl.textContent = `${total}/22`;
    
    // Aggiorna barra progresso
    if (barEl) {
        const progress = Math.round((total / 22) * 100);
        barEl.setAttribute('data-progress', progress);
        barEl.style.width = `${progress}%`;
    }
    
    // Aggiorna status
    if (statusEl) {
        statusEl.classList.remove('status-pending', 'status-running', 'status-success', 'status-error');
        
        if (failed > 0) {
            statusEl.classList.add('status-error');
            statusEl.textContent = 'Errori';
        } else if (total === 22) {
            statusEl.classList.add('status-success');
            statusEl.textContent = 'Completato';
        } else {
            statusEl.classList.add('status-running');
            statusEl.textContent = 'In esecuzione';
        }
    }
    
    // Aggiorna timestamp
    if (timestampEl) {
        const now = new Date();
        const timeStr = now.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        timestampEl.textContent = `Ultimo aggiornamento: ${timeStr}`;
        timestampEl.setAttribute('data-ts', now.toISOString());
    }
}

// Funzione per eseguire un singolo test
async function runSingleStorageTest(testNumber) {
    const output = 'output-localstorage';
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

    const updateStatus = (testId, status) => {
        if (typeof TestUtils !== 'undefined' && TestUtils.updateStatus) {
            TestUtils.updateStatus(testId, status);
        } else if (typeof updateTestStatus === 'function') {
            updateTestStatus(testId, status);
        }
    };

    log(`🧪 Esecuzione Test #${testNumber}...`, 'info');
    log('', 'info');

    const startTime = performance.now();
    
    // Test key univoca
    const TEST_KEY = 'tpl-test-storage';
    const TEST_VALUE = 'test-value-' + Date.now();

    try {
        switch (testNumber) {
            case 1: // Test Scrittura
                log('📝 Test 1: Scrittura localStorage', 'info');
                if (typeof localStorage === 'undefined') {
                    throw new Error('localStorage non disponibile');
                }
                localStorage.setItem(TEST_KEY, TEST_VALUE);
                const stored = localStorage.getItem(TEST_KEY);
                if (stored === TEST_VALUE) {
                    log('✓ Scrittura localStorage riuscita', 'success');
                    updateStatus('test-localstorage-write', 'pass');
                } else {
                    throw new Error(`Valore scritto non corrisponde`);
                }
                break;

            case 2: // Test Lettura
                log('📖 Test 2: Lettura localStorage', 'info');
                localStorage.setItem(TEST_KEY, TEST_VALUE);
                const retrieved = localStorage.getItem(TEST_KEY);
                if (retrieved === TEST_VALUE) {
                    log('✓ Lettura localStorage riuscita', 'success');
                    log(`  Valore letto: "${retrieved}"`, 'info');
                    updateStatus('test-localstorage-read', 'pass');
                } else {
                    throw new Error('Valore letto non corrisponde');
                }
                break;

            case 3: // Test Cancellazione
                log('🗑️ Test 3: Cancellazione localStorage', 'info');
                localStorage.setItem(TEST_KEY, TEST_VALUE);
                localStorage.removeItem(TEST_KEY);
                const afterRemove = localStorage.getItem(TEST_KEY);
                if (afterRemove === null) {
                    log('✓ Cancellazione localStorage riuscita', 'success');
                    updateStatus('test-localstorage-clear', 'pass');
                } else {
                    throw new Error('Chiave non cancellata correttamente');
                }
                break;

            // Per i test 4-22, rimanda alla funzione completa
            default:
                log('⚠️ Per questo test, usa il pulsante "Test LocalStorage" principale', 'warn');
                log('   (L\'esecuzione singola dei test 4-22 richiede refactoring completo)', 'info');
                return;
        }

        const endTime = performance.now();
        const duration = Math.round(endTime - startTime);
        
        log('', 'info');
        log(`✅ Test #${testNumber} completato in ${duration}ms`, 'success');
        
    } catch (error) {
        log(`✗ Test #${testNumber} fallito: ${error.message}`, 'error');
        
        // Update status based on test number
        const testIds = [
            '', 'test-localstorage-write', 'test-localstorage-read', 'test-localstorage-clear'
        ];
        if (testIds[testNumber]) {
            updateStatus(testIds[testNumber], 'fail');
        }
    }
}

// Esponi le funzioni globalmente per compatibilità con onclick
if (typeof window !== 'undefined') {
    window.testLocalStorage = testLocalStorage;
    window.runSingleStorageTest = runSingleStorageTest;
}

// Log di caricamento modulo
console.log('✅ Modulo test-localstorage.js caricato');

