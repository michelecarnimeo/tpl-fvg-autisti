/**
 * Test Database
 * Test per il caricamento e la validazione del database.json
 */

// Funzioni helper per UI
function updateDatabaseTestProgress(completed, total) {
    // Aggiorna il contatore nell'header
    const progressText = document.getElementById('db-header-progress');
    if (progressText) {
        progressText.textContent = `${completed}/${total}`;
    }

    // Aggiorna la progress bar
    const progressBar = document.getElementById('db-header-bar');
    if (progressBar) {
        const percentage = (completed / total) * 100;
        progressBar.setAttribute('data-progress', percentage.toString());
        // Aggiorna anche lo stile width per rendere visibile la barra
        requestAnimationFrame(() => {
            progressBar.style.width = Math.min(Math.max(percentage, 0), 100) + '%';
        });
    }
}

function updateDatabaseTestStats(passed, failed, timeMs) {
    const passedEl = document.getElementById('db-header-passed');
    const failedEl = document.getElementById('db-header-failed');
    const timeEl = document.getElementById('db-header-time');

    if (passedEl) passedEl.textContent = passed;
    if (failedEl) failedEl.textContent = failed;
    if (timeEl) timeEl.textContent = `${timeMs}ms`;

    // Aggiorna lo status nell'header
    const statusEl = document.getElementById('db-header-status');
    if (statusEl) {
        if (failed > 0) {
            statusEl.className = 'test-header-status status-fail';
            statusEl.textContent = 'Fallito';
        } else if (passed > 0) {
            statusEl.className = 'test-header-status status-pass';
            statusEl.textContent = 'Passato';
        }
    }

    // Aggiorna il timestamp
    const timestampEl = document.getElementById('db-header-timestamp');
    if (timestampEl) {
        timestampEl.setAttribute('data-ts', Date.now().toString());
    }
}

// Helper per aggiornare badge dei gruppi
function updateDatabaseGroupBadge(groupId, passed, total) {
    const badge = document.getElementById(`db-group${groupId}-badge`);
    if (badge) {
        badge.textContent = `${passed}/${total}`;
        // Rimuovi tutte le classi badge
        badge.classList.remove('badge-pending', 'badge-partial', 'badge-complete');
        // Aggiungi la classe appropriata
        if (passed === total && total > 0) {
            badge.classList.add('badge-complete');
        } else if (passed > 0) {
            badge.classList.add('badge-partial');
        } else {
            badge.classList.add('badge-pending');
        }
    }
}

// Helper per aggiornare subtitle dei gruppi con timing
function updateDatabaseGroupSubtitle(groupId, passed, total, timeMs) {
    const subtitle = document.getElementById(`db-group${groupId}-subtitle`);
    if (subtitle) {
        // Rimuovi tutte le classi state
        subtitle.classList.remove('state-pending', 'state-partial', 'state-complete');
        // Aggiorna testo e classe
        if (passed === total && total > 0) {
            subtitle.textContent = `${total} test completati • ${timeMs}ms`;
            subtitle.classList.add('state-complete');
        } else if (passed > 0) {
            subtitle.textContent = `${passed}/${total} test • ${timeMs}ms`;
            subtitle.classList.add('state-partial');
        } else {
            subtitle.textContent = `${total} test • In attesa...`;
            subtitle.classList.add('state-pending');
        }
    }
}

// Helper per aggiornare contatori e UI dopo ogni test
function markTestComplete(testId, passed, stats, startTime) {
    // Usa TestUtils se disponibile, altrimenti fallback
    if (typeof TestUtils !== 'undefined' && TestUtils.updateTestStatus) {
        TestUtils.updateTestStatus(testId, passed ? 'pass' : 'fail');
    } else {
        // Fallback: aggiorna manualmente
        const testElement = document.getElementById(testId);
        if (testElement) {
            const statusSpan = testElement.querySelector('.test-status');
            if (statusSpan) {
                statusSpan.className = `test-status ${passed ? 'pass' : 'fail'}`;
                statusSpan.textContent = passed ? 'Passato' : 'Fallito';
            }
        }
    }
    if (passed) {
        stats.passed++;

        // Incrementa contatori gruppi solo se test passa
        if (['test-database-load', 'test-database-structure', 'test-database-lines', 'test-database-types', 'test-database-null-undefined'].includes(testId)) {
            stats.group1++;
        } else if (['test-database-prices', 'test-database-stops', 'test-database-codes', 'test-database-encoding'].includes(testId)) {
            stats.group2++;
        } else if (['test-database-duplicates', 'test-database-range', 'test-database-progression', 'test-database-format', 'test-database-consistency', 'test-database-edge-cases', 'test-database-size-limit'].includes(testId)) {
            stats.group3++;
        } else if (testId === 'test-database-performance') {
            stats.group4++;
        }
    } else {
        stats.failed++;
    }

    stats.completed++;
    const elapsedTime = Math.round(performance.now() - startTime);
    updateDatabaseTestProgress(stats.completed, stats.total);
    updateDatabaseTestStats(stats.passed, stats.failed, elapsedTime);

    // Aggiorna badge dei gruppi
    updateDatabaseGroupBadge(1, stats.group1, 5);
    updateDatabaseGroupBadge(2, stats.group2, 4);
    updateDatabaseGroupBadge(3, stats.group3, 7);
    updateDatabaseGroupBadge(4, stats.group4, 1);

    // Aggiorna subtitle dei gruppi
    updateDatabaseGroupSubtitle(1, stats.group1, 5, elapsedTime);
    updateDatabaseGroupSubtitle(2, stats.group2, 4, elapsedTime);
    updateDatabaseGroupSubtitle(3, stats.group3, 7, elapsedTime);
    updateDatabaseGroupSubtitle(4, stats.group4, 1, elapsedTime);
}

async function testDatabaseLoad() {
    const output = 'output-database';
    const outputEl = document.getElementById(output);
    if (outputEl) {
        outputEl.innerHTML = '';
        outputEl.style.display = 'block';
    }
    
    // Helper per logging (usa TestUtils se disponibile)
    const log = (message, type = 'info') => {
        if (typeof TestUtils !== 'undefined' && TestUtils.log) {
            TestUtils.log(output, message, type);
        } else {
            console.log(`[${type}] ${message}`);
            if (outputEl) {
                const logDiv = document.createElement('div');
                logDiv.className = `console-log ${type}`;
                logDiv.textContent = message;
                outputEl.appendChild(logDiv);
            }
        }
    };
    
    // Helper per updateTestStatus (usa TestUtils se disponibile)
    const updateTestStatus = (id, status) => {
        if (typeof TestUtils !== 'undefined' && TestUtils.updateTestStatus) {
            TestUtils.updateTestStatus(id, status);
        } else {
            // Fallback: aggiorna manualmente
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
    
    log('=== Inizio Test Database ===', 'info');

    let data = null;
    const stats = {
        passed: 0,
        failed: 0,
        completed: 0,
        total: 17,
        group1: 0, // Caricamento & Struttura (5 test)
        group2: 0, // Validazione Dati (4 test)
        group3: 0, // Analisi Qualità (7 test)
        group4: 0  // Performance (1 test)
    };
    const startTime = performance.now();

    try {
        // Test 1: Caricamento
        log('Test 1: Caricamento database.json...', 'info');
        const res = await fetch('database.json');
        if (!res.ok) throw new Error('Errore caricamento database');
        data = await res.json();
        
        // Esponi tariffario su window per accesso da altri test (es. test-prezzi.js)
        if (typeof window !== 'undefined') {
            window.tariffario = data;
            window.tariffarioAggiornato = null;
        }
        
        markTestComplete('test-database-load', true, stats, startTime);
        log('✓ Database caricato con successo', 'success');

        // Test 2: Struttura base
        log('Test 2: Validazione struttura base...', 'info');
        if (!Array.isArray(data)) throw new Error('Database non è un array');
        if (data.length === 0) throw new Error('Database vuoto');
        markTestComplete('test-database-structure', true, stats, startTime);
        log(`✓ Struttura valida: ${data.length} linee`, 'success');

        // Test 3: Validazione campi obbligatori
        log('Test 3: Validazione campi obbligatori...', 'info');
        const requiredFields = ['nome', 'fermate', 'prezzi'];
        let invalidLines = [];

        data.forEach((line, index) => {
            const missingFields = requiredFields.filter(field => !line[field]);
            if (missingFields.length > 0) {
                invalidLines.push(`Linea ${index}: mancano ${missingFields.join(', ')}`);
            }
        });

        if (invalidLines.length > 0) {
            markTestComplete('test-database-lines', false, stats, startTime);
            invalidLines.forEach(err => log(`✗ ${err}`, 'error'));
        } else {
            markTestComplete('test-database-lines', true, stats, startTime);
            log(`✓ Tutte le ${data.length} linee hanno i campi obbligatori`, 'success');
        }

        // Test 4: Validazione tipi rigorosi
        log('Test 4: Validazione tipi rigorosi...', 'info');
        updateTestStatus('test-database-types', 'running');
        let typeErrors = [];

        data.forEach((line, index) => {
            // Verifica che nome sia una stringa non vuota
            if (typeof line.nome !== 'string' || line.nome.trim() === '') {
                typeErrors.push(`Linea ${index}: nome non è una stringa valida`);
            }
            
            // Verifica che fermate sia un array
            if (!Array.isArray(line.fermate)) {
                typeErrors.push(`Linea ${index}: fermate non è un array`);
            }
            
            // Verifica che prezzi sia un array
            if (!Array.isArray(line.prezzi)) {
                typeErrors.push(`Linea ${index}: prezzi non è un array`);
            }
            
            // Se codici è presente, deve essere un array
            if (line.codici !== undefined && !Array.isArray(line.codici)) {
                typeErrors.push(`Linea ${index}: codici non è un array`);
            }
        });

        if (typeErrors.length > 0) {
            markTestComplete('test-database-types', false, stats, startTime);
            log(`✗ Trovati ${typeErrors.length} errori di tipo:`, 'error');
            typeErrors.forEach(err => log(`  - ${err}`, 'error'));
        } else {
            markTestComplete('test-database-types', true, stats, startTime);
            log(`✓ Tutti i tipi di dati sono corretti`, 'success');
        }

        // Test 5: Validazione null/undefined espliciti
        log( 'Test 5: Verifica valori null/undefined...', 'info');
        updateTestStatus('test-database-null-undefined', 'running');
        let nullErrors = [];

        data.forEach((line, index) => {
            // Verifica che i campi obbligatori non siano null o undefined
            if (line.nome === null || line.nome === undefined) {
                nullErrors.push(`Linea ${index}: nome è null o undefined`);
            }
            if (line.fermate === null || line.fermate === undefined) {
                nullErrors.push(`Linea ${index}: fermate è null o undefined`);
            }
            if (line.prezzi === null || line.prezzi === undefined) {
                nullErrors.push(`Linea ${index}: prezzi è null o undefined`);
            }

            // Verifica che gli array non contengano null/undefined
            if (Array.isArray(line.fermate)) {
                line.fermate.forEach((fermata, fIndex) => {
                    if (fermata === null || fermata === undefined) {
                        nullErrors.push(`Linea ${index}, fermata ${fIndex}: valore null/undefined`);
                    }
                });
            }

            if (Array.isArray(line.prezzi)) {
                line.prezzi.forEach((row, rIndex) => {
                    if (!Array.isArray(row)) return;
                    row.forEach((price, pIndex) => {
                        if (price === null || price === undefined) {
                            nullErrors.push(`Linea ${index}, prezzo [${rIndex}][${pIndex}]: valore null/undefined`);
                        }
                    });
                });
            }
        });

        if (nullErrors.length > 0) {
            markTestComplete('test-database-null-undefined', false, stats, startTime);
            log(`✗ Trovati ${nullErrors.length} valori null/undefined:`, 'error');
            nullErrors.slice(0, 5).forEach(err => log(`  - ${err}`, 'error'));
            if (nullErrors.length > 5) {
                log(`  ... e altri ${nullErrors.length - 5} errori`, 'error');
            }
        } else {
            markTestComplete('test-database-null-undefined', true, stats, startTime);
            log(`✓ Nessun valore null/undefined trovato`, 'success');
        }

        // Test 6: Validazione prezzi
        log( 'Test 6: Validazione prezzi...', 'info');
        let priceErrors = [];
        updateTestStatus('test-database-prices', 'running');

        data.forEach((line, lineIndex) => {
            const numFermate = line.fermate.length;

            // Verifica dimensione matrice prezzi
            if (!Array.isArray(line.prezzi) || line.prezzi.length !== numFermate) {
                priceErrors.push(`Linea "${line.nome}": matrice prezzi non corrisponde a ${numFermate} fermate`);
                return;
            }

            // Verifica ogni riga della matrice
            line.prezzi.forEach((row, rowIndex) => {
                if (!Array.isArray(row) || row.length !== numFermate) {
                    priceErrors.push(`Linea "${line.nome}", riga ${rowIndex}: lunghezza non valida`);
                }

                // Verifica che ogni prezzo sia un numero valido e non negativo
                row.forEach((price, colIndex) => {
                    if (typeof price !== 'number' || price < 0) {
                        priceErrors.push(`Linea "${line.nome}", [${rowIndex}][${colIndex}]: prezzo non valido (${price})`);
                    }

                    // Verifica simmetria (prezzo A→B = prezzo B→A)
                    if (rowIndex < colIndex && price !== line.prezzi[colIndex][rowIndex]) {
                        priceErrors.push(`Linea "${line.nome}": matrice non simmetrica [${rowIndex}][${colIndex}]`);
                    }

                    // Verifica diagonale = 0 (prezzo stesso punto)
                    if (rowIndex === colIndex && price !== 0) {
                        priceErrors.push(`Linea "${line.nome}": prezzo stesso punto dovrebbe essere 0, trovato ${price}`);
                    }
                });
            });
        });

        if (priceErrors.length > 0) {
            markTestComplete('test-database-prices', false, stats, startTime);
            log(`✗ Trovati ${priceErrors.length} errori nei prezzi:`, 'error');
            priceErrors.slice(0, 5).forEach(err => log(`  - ${err}`, 'error'));
            if (priceErrors.length > 5) {
                log(`  ... e altri ${priceErrors.length - 5} errori`, 'error');
            }
        } else {
            markTestComplete('test-database-prices', true, stats, startTime);
            log( '✓ Tutte le matrici prezzi sono valide e simmetriche', 'success');
        }

        // Test 7: Validazione fermate
        log( 'Test 7: Validazione fermate...', 'info');
        let fermateErrors = [];
        updateTestStatus('test-database-stops', 'running');

        data.forEach((line) => {
            if (!Array.isArray(line.fermate)) {
                fermateErrors.push(`Linea "${line.nome}": fermate non è un array`);
                return;
            }

            if (line.fermate.length === 0) {
                fermateErrors.push(`Linea "${line.nome}": nessuna fermata definita`);
                return;
            }

            line.fermate.forEach((fermata, index) => {
                if (typeof fermata !== 'string' || fermata.trim() === '') {
                    fermateErrors.push(`Linea "${line.nome}", fermata ${index}: nome non valido`);
                }
            });

            // Verifica duplicati
            const uniqueFermate = new Set(line.fermate);
            if (uniqueFermate.size !== line.fermate.length) {
                fermateErrors.push(`Linea "${line.nome}": fermate duplicate trovate`);
            }
        });

        if (fermateErrors.length > 0) {
            markTestComplete('test-database-stops', false, stats, startTime);
            log(`✗ Trovati ${fermateErrors.length} errori nelle fermate:`, 'error');
            fermateErrors.forEach(err => log(`  - ${err}`, 'error'));
        } else {
            markTestComplete('test-database-stops', true, stats, startTime);
            log( '✓ Tutte le fermate sono valide', 'success');
        }

        // Test 8: Validazione codici (se presenti)
        log( 'Test 8: Validazione codici tariffari...', 'info');
        const linesWithCodici = data.filter(line => line.codici);
        updateTestStatus('test-database-codes', 'running');

        if (linesWithCodici.length > 0) {
            let codiciErrors = [];

            linesWithCodici.forEach((line) => {
                const numFermate = line.fermate.length;

                if (line.codici.length !== numFermate) {
                    codiciErrors.push(`Linea "${line.nome}": matrice codici non corrisponde a ${numFermate} fermate`);
                    return;
                }

                line.codici.forEach((row, rowIndex) => {
                    if (row.length !== numFermate) {
                        codiciErrors.push(`Linea "${line.nome}", riga ${rowIndex}: lunghezza codici non valida`);
                    }
                });
            });

            if (codiciErrors.length > 0) {
                markTestComplete('test-database-codes', false, stats, startTime);
                log(`✗ Trovati ${codiciErrors.length} errori nei codici:`, 'error');
                codiciErrors.forEach(err => log(`  - ${err}`, 'error'));
            } else {
                markTestComplete('test-database-codes', true, stats, startTime);
                log(`✓ Codici validi per ${linesWithCodici.length} linee`, 'success');
            }
        } else {
            markTestComplete('test-database-codes', true, stats, startTime);
            log( 'ℹ Nessuna linea con codici tariffari', 'info');
        }

        // Test 9: Validazione encoding/caratteri speciali
        log( 'Test 9: Verifica encoding e caratteri speciali...', 'info');
        updateTestStatus('test-database-encoding', 'running');
        let encodingWarnings = [];

        data.forEach((line) => {
            // Verifica che i nomi delle fermate gestiscano correttamente caratteri speciali
            if (line.nome) {
                try {
                    // Prova a codificare/decodificare UTF-8
                    const encoded = encodeURIComponent(line.nome);
                    const decoded = decodeURIComponent(encoded);
                    if (decoded !== line.nome) {
                        encodingWarnings.push(`Linea "${line.nome}": possibile problema encoding`);
                    }
                } catch (e) {
                    encodingWarnings.push(`Linea "${line.nome}": errore encoding: ${e.message}`);
                }
            }

            // Verifica fermate con caratteri speciali (accenti, apostrofi, etc.)
            if (Array.isArray(line.fermate)) {
                line.fermate.forEach((fermata, index) => {
                    if (typeof fermata === 'string') {
                        // Verifica caratteri speciali comuni (non è un errore, solo verifica)
                        const hasSpecialChars = /[àèéìòùçñáíóú]/i.test(fermata);
                        if (hasSpecialChars) {
                            // Verifica che il carattere sia gestito correttamente
                            try {
                                encodeURIComponent(fermata);
                            } catch (e) {
                                encodingWarnings.push(`Linea "${line.nome}", fermata "${fermata}": errore encoding caratteri speciali`);
                            }
                        }
                    }
                });
            }
        });

        if (encodingWarnings.length > 0) {
            markTestComplete('test-database-encoding', false, stats, startTime);
            log(`✗ Trovati ${encodingWarnings.length} problemi di encoding:`, 'error');
            encodingWarnings.slice(0, 5).forEach(warn => log(`  - ${warn}`, 'error'));
        } else {
            markTestComplete('test-database-encoding', true, stats, startTime);
            log(`✓ Encoding e caratteri speciali gestiti correttamente`, 'success');
        }

        // Test 10: Nomi linee duplicati
        log( 'Test 10: Verifica nomi linee duplicati...', 'info');
        updateTestStatus('test-database-duplicates', 'running');
        const lineNames = data.map(line => line.nome);
        const uniqueNames = new Set(lineNames);

        if (uniqueNames.size !== lineNames.length) {
            markTestComplete('test-database-duplicates', false, stats, startTime);
            const duplicates = lineNames.filter((name, index) => lineNames.indexOf(name) !== index);
            log(`✗ Trovate ${duplicates.length} linee duplicate:`, 'error');
            duplicates.forEach(name => log(`  - "${name}"`, 'error'));
        } else {
            markTestComplete('test-database-duplicates', true, stats, startTime);
            log( '✓ Nessun nome linea duplicato', 'success');
        }

        // Test 11: Range prezzi
        log( 'Test 11: Verifica range prezzi...', 'info');
        updateTestStatus('test-database-range', 'running');
        const MIN_PREZZO = 0;
        const MAX_PREZZO = 100; // €100 come limite ragionevole
        let rangeErrors = [];
        let allPrices = [];

        data.forEach((line) => {
            line.prezzi.forEach((row, rowIndex) => {
                row.forEach((price, colIndex) => {
                    if (rowIndex !== colIndex) { // Escludi diagonale (0)
                        allPrices.push(price);
                        if (price < MIN_PREZZO || price > MAX_PREZZO) {
                            rangeErrors.push(`Linea "${line.nome}", [${rowIndex}][${colIndex}]: prezzo ${price}€ fuori range (${MIN_PREZZO}-${MAX_PREZZO}€)`);
                        }
                    }
                });
            });
        });

        if (rangeErrors.length > 0) {
            markTestComplete('test-database-range', false, stats, startTime);
            log(`✗ Trovati ${rangeErrors.length} prezzi fuori range:`, 'error');
            rangeErrors.slice(0, 3).forEach(err => log(`  - ${err}`, 'error'));
            if (rangeErrors.length > 3) {
                log(`  ... e altri ${rangeErrors.length - 3} errori`, 'error');
            }
        } else {
            markTestComplete('test-database-range', true, stats, startTime);
            const minPrice = Math.min(...allPrices);
            const maxPrice = Math.max(...allPrices);
            const avgPrice = (allPrices.reduce((a, b) => a + b, 0) / allPrices.length).toFixed(2);
            log(`✓ Tutti i prezzi sono nel range ${MIN_PREZZO}-${MAX_PREZZO}€`, 'success');
            log(`  • Min: ${minPrice}€, Max: ${maxPrice}€, Media: ${avgPrice}€`, 'info');
        }

        // Test 12: Progressività prezzi
        log( 'Test 12: Verifica progressività prezzi...', 'info');
        updateTestStatus('test-database-progression', 'running');
        let progressivityWarnings = [];

        data.forEach((line) => {
            const numFermate = line.fermate.length;

            // Per ogni riga, verifica che prezzi tendenzialmente aumentino con la distanza
            line.prezzi.forEach((row, rowIndex) => {
                let violations = 0;

                for (let i = 1; i < numFermate - 1; i++) {
                    const priceBefore = row[rowIndex + i - 1] || 0;
                    const priceCurrent = row[rowIndex + i] || 0;
                    const priceAfter = row[rowIndex + i + 1] || 0;

                    // Se il prezzo corrente è molto più alto dei vicini, potrebbe essere un errore
                    if (priceCurrent > priceBefore * 2 && priceCurrent > priceAfter * 2) {
                        violations++;
                    }
                }

                if (violations > 2) {
                    progressivityWarnings.push(`Linea "${line.nome}", fermata ${rowIndex}: possibili anomalie nei prezzi`);
                }
            });
        });

        if (progressivityWarnings.length > 0) {
            markTestComplete('test-database-progression', true, stats, startTime); // Pass comunque, sono solo warning
            log(`⚠ Trovate ${progressivityWarnings.length} possibili anomalie:`, 'info');
            progressivityWarnings.slice(0, 3).forEach(warn => log(`  - ${warn}`, 'info'));
        } else {
            markTestComplete('test-database-progression', true, stats, startTime);
            log( '✓ Progressività prezzi sembra corretta', 'success');
        }

        // Test 13: Formato codici
        log( 'Test 13: Verifica formato codici...', 'info');
        updateTestStatus('test-database-format', 'running');
        const codicePattern = /^(E\d+|[A-Z]\d+)?$/; // Es: E1, E2, A3, o vuoto
        let formatErrors = [];

        linesWithCodici.forEach((line) => {
            line.codici.forEach((row, rowIndex) => {
                row.forEach((codice, colIndex) => {
                    if (!codicePattern.test(codice)) {
                        formatErrors.push(`Linea "${line.nome}", [${rowIndex}][${colIndex}]: codice "${codice}" non valido`);
                    }
                });
            });
        });

        if (formatErrors.length > 0) {
            markTestComplete('test-database-format', false, stats, startTime);
            log(`✗ Trovati ${formatErrors.length} codici con formato non valido:`, 'error');
            formatErrors.slice(0, 5).forEach(err => log(`  - ${err}`, 'error'));
        } else if (linesWithCodici.length > 0) {
            markTestComplete('test-database-format', true, stats, startTime);
            log( '✓ Tutti i codici seguono il formato corretto', 'success');
        } else {
            markTestComplete('test-database-format', true, stats, startTime);
            log( 'ℹ Nessun codice da verificare', 'info');
        }

        // Test 14: Consistenza dati
        log( 'Test 14: Verifica consistenza dati...', 'info');
        updateTestStatus('test-database-consistency', 'running');
        let consistencyWarnings = [];

        data.forEach((line) => {
            // Verifica che prezzi e codici (se presenti) abbiano la stessa struttura
            if (line.codici) {
                line.prezzi.forEach((prezzoRow, rowIndex) => {
                    prezzoRow.forEach((prezzo, colIndex) => {
                        const codice = line.codici[rowIndex][colIndex];

                        // Se il prezzo è 0, il codice dovrebbe essere vuoto
                        if (prezzo === 0 && codice !== '') {
                            consistencyWarnings.push(`Linea "${line.nome}", [${rowIndex}][${colIndex}]: prezzo 0 ma codice "${codice}" presente`);
                        }

                        // Se c'è un prezzo, dovrebbe esserci un codice
                        if (prezzo > 0 && codice === '') {
                            consistencyWarnings.push(`Linea "${line.nome}", [${rowIndex}][${colIndex}]: prezzo ${prezzo}€ ma codice vuoto`);
                        }
                    });
                });
            }
        });

        if (consistencyWarnings.length > 0) {
            markTestComplete('test-database-consistency', true, stats, startTime); // Pass comunque, sono solo warning
            log(`⚠ Trovate ${consistencyWarnings.length} inconsistenze:`, 'info');
            consistencyWarnings.slice(0, 3).forEach(warn => log(`  - ${warn}`, 'info'));
            if (consistencyWarnings.length > 3) {
                log(`  ... e altre ${consistencyWarnings.length - 3} inconsistenze`, 'info');
            }
        } else {
            markTestComplete('test-database-consistency', true, stats, startTime);
            log( '✓ Dati consistenti tra prezzi e codici', 'success');
        }

        // Test 15: Edge cases estremi
        log( 'Test 15: Verifica edge cases estremi...', 'info');
        updateTestStatus('test-database-edge-cases', 'running');
        let edgeCaseWarnings = [];

        data.forEach((line) => {
            const numFermate = line.fermate.length;

            // Linea con una sola fermata (non ha senso per il calcolo prezzi)
            if (numFermate === 1) {
                edgeCaseWarnings.push(`Linea "${line.nome}": ha solo 1 fermata (non può calcolare tratte)`);
            }

            // Linea con troppe fermate (potrebbe essere un errore)
            if (numFermate > 100) {
                edgeCaseWarnings.push(`Linea "${line.nome}": ha ${numFermate} fermate (molto elevato, verifica)`);
            }

            // Verifica che tutte le righe della matrice prezzi abbiano la stessa lunghezza
            if (Array.isArray(line.prezzi) && line.prezzi.length > 0) {
                const firstRowLength = line.prezzi[0].length;
                line.prezzi.forEach((row, index) => {
                    if (!Array.isArray(row) || row.length !== firstRowLength) {
                        edgeCaseWarnings.push(`Linea "${line.nome}", riga ${index}: lunghezza inconsistente (attesa: ${firstRowLength}, trovata: ${row.length})`);
                    }
                });
            }
        });

        if (edgeCaseWarnings.length > 0) {
            markTestComplete('test-database-edge-cases', true, stats, startTime); // Pass ma con warning
            log(`⚠ Trovati ${edgeCaseWarnings.length} edge cases:`, 'info');
            edgeCaseWarnings.slice(0, 5).forEach(warn => log(`  - ${warn}`, 'info'));
            if (edgeCaseWarnings.length > 5) {
                log(`  ... e altri ${edgeCaseWarnings.length - 5} casi`, 'info');
            }
        } else {
            markTestComplete('test-database-edge-cases', true, stats, startTime);
            log(`✓ Nessun edge case estremo rilevato`, 'success');
        }

        // Test 16: Dimensione massima ragionevole
        log( 'Test 16: Verifica dimensioni massime ragionevoli...', 'info');
        updateTestStatus('test-database-size-limit', 'running');
        const MAX_FERMATE_PER_LINEA = 150; // Limite ragionevole
        const MIN_FERMATE_PER_LINEA = 2; // Minimo per calcolare tratte
        let sizeWarnings = [];

        data.forEach((line) => {
            const numFermate = line.fermate.length;

            if (numFermate < MIN_FERMATE_PER_LINEA) {
                sizeWarnings.push(`Linea "${line.nome}": ha solo ${numFermate} fermata/e (minimo consigliato: ${MIN_FERMATE_PER_LINEA})`);
            } else if (numFermate > MAX_FERMATE_PER_LINEA) {
                sizeWarnings.push(`Linea "${line.nome}": ha ${numFermate} fermate (molto elevato, potrebbe causare problemi di performance)`);
            }

            // Verifica dimensione matrice prezzi (numero totale di elementi)
            if (Array.isArray(line.prezzi)) {
                const totalElements = line.prezzi.length * (line.prezzi[0]?.length || 0);
                if (totalElements > 22500) { // 150x150
                    sizeWarnings.push(`Linea "${line.nome}": matrice prezzi molto grande (${totalElements} elementi)`);
                }
            }
        });

        if (sizeWarnings.length > 0) {
            markTestComplete('test-database-size-limit', true, stats, startTime); // Pass ma con warning
            log(`⚠ Trovati ${sizeWarnings.length} avvisi sulle dimensioni:`, 'info');
            sizeWarnings.slice(0, 5).forEach(warn => log(`  - ${warn}`, 'info'));
        } else {
            markTestComplete('test-database-size-limit', true, stats, startTime);
            log(`✓ Tutte le dimensioni sono ragionevoli`, 'success');
        }

        // Test 17: Performance
        log( 'Test 17: Misurazione performance...', 'info');
        updateTestStatus('test-database-performance', 'running');
        const startParse = performance.now();

        // Simula parsing completo dei dati
        let totalElements = 0;
        data.forEach((line) => {
            totalElements += line.fermate.length;
            totalElements += line.prezzi.length * line.prezzi[0].length;
            if (line.codici) {
                totalElements += line.codici.length * line.codici[0].length;
            }
        });

        const endParse = performance.now();
        const parseTime = (endParse - startParse).toFixed(2);

        markTestComplete('test-database-performance', true, stats, startTime);
        log(`✓ Performance: ${parseTime}ms per processare ${totalElements} elementi`, 'success');

        if (parseTime > 100) {
            log(`⚠ Tempo di parsing elevato (>${parseTime}ms), considera ottimizzazioni`, 'info');
        } else {
            log(`✓ Tempo di parsing ottimale (<100ms)`, 'success');
        }        // Riepilogo finale
        log( '=== Riepilogo Test Database ===', 'info');
        const totalFermate = data.reduce((sum, line) => sum + line.fermate.length, 0);
        log(`📊 Statistiche:`, 'info');
        log(`  • ${data.length} linee totali`, 'info');
        log(`  • ${totalFermate} fermate totali`, 'info');
        log(`  • ${linesWithCodici.length} linee con codici tariffari`, 'info');

        const firstLine = data[0];
        log(`📍 Prima linea: ${firstLine.nome}`, 'info');
        log(`  • ${firstLine.fermate.length} fermate: ${firstLine.fermate.join(', ')}`, 'info');

    } catch (error) {
        updateTestStatus('test-database-load', 'fail');
        updateTestStatus('test-database-structure', 'fail');
        updateTestStatus('test-database-lines', 'fail');
        updateTestStatus('test-database-types', 'fail');
        updateTestStatus('test-database-null-undefined', 'fail');
        log(`✗ Errore fatale: ${error.message}`, 'error');
        console.error('Errore test database:', error);
    }

    // Mostra i pulsanti log dopo l'esecuzione
    const logButtons = document.getElementById('db-log-buttons');
    if (logButtons) {
        logButtons.style.display = 'flex';
    }
}

/**
 * Resetta tutti i test Database e l'header
 */
function resetDatabaseTests() {
    // Resetta il log (usa la funzione da test-log-helpers.js)
    if (typeof window.clearDatabaseLog === 'function') {
        window.clearDatabaseLog();
    }

    // Resetta l'header
    const totalTests = 17; // Database ha 17 test fissi
    const progressEl = document.getElementById('db-header-progress');
    const statusEl = document.getElementById('db-header-status');
    const passedEl = document.getElementById('db-header-passed');
    const failedEl = document.getElementById('db-header-failed');
    const timeEl = document.getElementById('db-header-time');
    const timestampEl = document.getElementById('db-header-timestamp');
    const barEl = document.getElementById('db-header-bar');

    if (progressEl) progressEl.textContent = `0/${totalTests}`;
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
        barEl.setAttribute('data-progress', '0');
        barEl.style.width = '0%';
    }

    // Resetta i badge e subtitle dei gruppi
    const groups = [
        { id: 'group1', total: 5, text: '5 test' },
        { id: 'group2', total: 4, text: '4 test' },
        { id: 'group3', total: 7, text: '7 test' },
        { id: 'group4', total: 1, text: '1 test' }
    ];

    groups.forEach(group => {
        const badge = document.getElementById(`db-${group.id}-badge`);
        const subtitle = document.getElementById(`db-${group.id}-subtitle`);
        if (badge) {
            badge.textContent = `0/${group.total}`;
            badge.classList.remove('badge-partial', 'badge-complete');
            badge.classList.add('badge-pending');
        }
        if (subtitle) {
            subtitle.textContent = `${group.text} da completare`;
            subtitle.classList.remove('state-partial', 'state-complete');
            subtitle.classList.add('state-pending');
        }
    });

    // Resetta tutti gli status dei test a "pending"
    const testIds = [
        // Gruppo 1: Caricamento & Struttura
        'test-database-load', 'test-database-structure', 'test-database-lines',
        'test-database-types', 'test-database-null-undefined',
        // Gruppo 2: Validazione Dati
        'test-database-prices', 'test-database-stops', 'test-database-codes',
        'test-database-encoding',
        // Gruppo 3: Analisi Qualità
        'test-database-duplicates', 'test-database-range', 'test-database-progression',
        'test-database-format', 'test-database-consistency',
        'test-database-edge-cases', 'test-database-size-limit',
        // Gruppo 4: Performance
        'test-database-performance'
    ];

    testIds.forEach(id => {
        const testElement = document.getElementById(id);
        if (testElement) {
            const statusSpan = testElement.querySelector('.test-status');
            if (statusSpan) {
                statusSpan.className = 'test-status pending';
                statusSpan.textContent = 'In attesa';
            }
        }
    });

    // Chiudi tutti i gruppi (usa la funzione accordion se disponibile)
    if (typeof window.toggleAllDbGroups === 'function') {
        window.toggleAllDbGroups(false);
    } else if (typeof TestAccordion !== 'undefined' && TestAccordion.toggleAllGroups) {
        TestAccordion.toggleAllGroups('db', false);
    }
}

// Esponi le funzioni globalmente per compatibilità con onclick
if (typeof window !== 'undefined') {
    window.testDatabaseLoad = testDatabaseLoad;
    window.resetDatabaseTests = resetDatabaseTests;
}

/**
 * Inizializza event delegation per pulsante test Database
 */
function initDatabaseEventDelegation() {
    // Verifica se il listener è già stato aggiunto
    if (document.body && document.body.dataset.databaseDelegationAdded === 'true') {
        return;
    }

    // Funzione per aggiungere il listener
    const addListener = () => {
        if (document.body.dataset.databaseDelegationAdded === 'true') {
            return;
        }

        // Event delegation: listener per pulsanti con data-test="database"
        document.body.addEventListener('click', (e) => {
            const button = e.target.closest('[data-test="database"]');
            
            if (button && button.classList.contains('test-button')) {
                e.preventDefault();
                e.stopPropagation();
                
                if (typeof window.testDatabaseLoad === 'function') {
                    window.testDatabaseLoad();
                } else {
                    console.error('❌ testDatabaseLoad non disponibile');
                }
            }
        });

        // Marca come inizializzato
        document.body.dataset.databaseDelegationAdded = 'true';
        console.log('✅ Event delegation per Database test inizializzata');
    };

    // Auto-inizializza event delegation quando il DOM è pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addListener);
    } else {
        addListener();
    }
}

/**
 * Inizializza event delegation per pulsanti utility Database
 * (Toggle groups, Reset, Copy/Download/Clear log)
 */
function initDatabaseUtilityEventDelegation() {
    // Verifica se il listener è già stato aggiunto
    if (document.body && document.body.dataset.databaseUtilityDelegationAdded === 'true') {
        return;
    }

    // Funzione per aggiungere il listener
    const addListener = () => {
        if (document.body.dataset.databaseUtilityDelegationAdded === 'true') {
            return;
        }

        // Event delegation: listener per pulsanti utility Database
        document.body.addEventListener('click', (e) => {
            const button = e.target.closest('[data-db-action]');
            
            if (button && button.classList.contains('test-button')) {
                e.preventDefault();
                e.stopPropagation();
                
                const action = button.dataset.dbAction;
                
                switch(action) {
                    case 'toggle-open':
                        if (typeof window.toggleAllDbGroups === 'function') {
                            window.toggleAllDbGroups(true);
                        }
                        break;
                        
                    case 'toggle-close':
                        if (typeof window.toggleAllDbGroups === 'function') {
                            window.toggleAllDbGroups(false);
                        }
                        break;
                        
                    case 'reset':
                        if (typeof window.resetDatabaseTests === 'function') {
                            window.resetDatabaseTests();
                        }
                        break;
                        
                    case 'copy-log':
                        if (typeof window.copyDatabaseLog === 'function') {
                            window.copyDatabaseLog();
                        }
                        break;
                        
                    case 'download-log':
                        if (typeof window.downloadDatabaseLog === 'function') {
                            window.downloadDatabaseLog();
                        }
                        break;
                        
                    case 'clear-log':
                        if (typeof window.clearDatabaseLog === 'function') {
                            window.clearDatabaseLog();
                        }
                        break;
                }
            }
        });

        // Marca come inizializzato
        document.body.dataset.databaseUtilityDelegationAdded = 'true';
        console.log('✅ Event delegation per Database utility buttons inizializzata');
    };

    // Auto-inizializza event delegation quando il DOM è pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addListener);
    } else {
        addListener();
    }
}

// Auto-inizializza
initDatabaseEventDelegation();
initDatabaseUtilityEventDelegation();