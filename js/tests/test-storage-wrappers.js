/**
 * ========================================
 * TEST STORAGE WRAPPERS
 * Wrapper functions per retrocompatibilità con onclick inline
 * ========================================
 * 
 * Questo file definisce le funzioni globali che vengono chiamate
 * dagli onclick nell'HTML. Queste funzioni delegano a StorageTests
 * quando disponibile.
 * 
 * IMPORTANTE: Questo file deve essere caricato PRIMA del DOM
 * per essere disponibile quando il browser legge gli onclick.
 * 
 * @version 1.0.0
 * @date 2025-11-06
 */

// Test Storage Module (js/core/storage.js)
window.testStorage = async function() {
    const output = 'output-storage';
    const outputEl = document.getElementById(output);
    
    if (!outputEl) {
        console.error('Elemento output non trovato:', output);
        return;
    }

    // Reset output
    outputEl.innerHTML = '';
    outputEl.style.display = 'block';

    // Aggiorna stato header a "in esecuzione"
    const statusEl = document.getElementById('storage-header-status');
    if (statusEl) {
        statusEl.classList.remove('status-pending', 'status-success', 'status-error');
        statusEl.classList.add('status-running');
        statusEl.textContent = 'In esecuzione';
    }

    // Usa TestUtils se disponibile, altrimenti fallback
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

    const startTime = performance.now();

    try {
        // Verifica che StorageTests sia disponibile
        if (typeof StorageTests === 'undefined') {
            log('✗ StorageTests non disponibile! Assicurati che test-storage.js sia caricato.', 'error');
            log('Verifica che lo script sia incluso: js/tests/test-storage.js', 'info');
            return;
        }

        log('✓ StorageTests disponibile', 'success');

        // Verifica che Storage sia disponibile
        if (typeof Storage === 'undefined' || !window.Storage) {
            log('✗ Storage non disponibile! Assicurati che storage.js sia caricato PRIMA di test-storage.js.', 'error');
            log('Ordine script corretto: js/core/storage.js → js/tests/test-storage.js', 'info');
            return;
        }

        log('✓ Storage disponibile', 'success');
        log('', 'info');

        // Esegui tutti i test
        await StorageTests.runAll({
            log: log,
            updateStatus: updateStatus
        });

        const endTime = performance.now();
        const duration = Math.round(endTime - startTime);

        // Calcola statistiche dai test completati
        const testIds = StorageTests.getAllTestIds();
        let passed = 0;
        let failed = 0;

        testIds.forEach(id => {
            const testEl = document.getElementById(id);
            if (testEl) {
                const statusSpan = testEl.querySelector('.test-status');
                if (statusSpan) {
                    if (statusSpan.classList.contains('pass')) {
                        passed++;
                    } else if (statusSpan.classList.contains('fail')) {
                        failed++;
                    }
                }
            }
        });

        // Aggiorna l'header con le statistiche
        if (typeof updateStorageHeader === 'function') {
            updateStorageHeader(passed, failed, duration);
        }

        log('', 'info');
        log('✅ Test Storage completati!', 'success');
        
        // Mostra i pulsanti log dopo l'esecuzione
        const logButtons = document.getElementById('storage-log-buttons');
        if (logButtons) {
            logButtons.style.display = 'flex';
        }
    } catch (error) {
        log(`✗ Errore fatale: ${error.message}`, 'error');
        console.error('Errore test storage:', error);
        
        // Aggiorna header in caso di errore
        const endTime = performance.now();
        const duration = Math.round(endTime - startTime);
        if (typeof updateStorageHeader === 'function') {
            updateStorageHeader(0, 0, duration);
        }
        
        // Mostra i pulsanti log anche in caso di errore
        const logButtons = document.getElementById('storage-log-buttons');
        if (logButtons) {
            logButtons.style.display = 'flex';
        }
    }
};

// Reset test Storage
window.resetStorageModuleTests = function() {
    if (typeof StorageTests === 'undefined') return;
    
    const testIds = StorageTests.getAllTestIds();
    testIds.forEach(id => {
        if (typeof updateTestStatus === 'function') {
            updateTestStatus(id, 'pending');
        }
    });
    
    const output = document.getElementById('output-storage');
    if (output) {
        output.innerHTML = '';
        output.style.display = 'none';
    }

    // Reset header
    const progressEl = document.getElementById('storage-header-progress');
    const statusEl = document.getElementById('storage-header-status');
    const passedEl = document.getElementById('storage-header-passed');
    const failedEl = document.getElementById('storage-header-failed');
    const timeEl = document.getElementById('storage-header-time');
    const timestampEl = document.getElementById('storage-header-timestamp');
    const barEl = document.getElementById('storage-header-bar');

    if (progressEl) progressEl.textContent = '0/24';
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
    
    // Nascondi i pulsanti log
    const logButtons = document.getElementById('storage-log-buttons');
    if (logButtons) {
        logButtons.style.display = 'none';
    }
};

// Funzione per eseguire un singolo test Storage
window.runSingleStorageTest = async function(testId) {
    const output = 'output-storage';
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
        if (typeof TestUtils !== 'undefined' && TestUtils.updateStatus) {
            TestUtils.updateStatus(id, status);
        } else if (typeof updateTestStatus === 'function') {
            updateTestStatus(id, status);
        }
    };

    log(`🧪 Esecuzione Test: ${testId}...`, 'info');
    log('', 'info');

    try {
        // Verifica che StorageTests sia disponibile
        if (typeof StorageTests === 'undefined') {
            throw new Error('StorageTests non disponibile! Assicurati che test-storage.js sia caricato.');
        }

        // Verifica che Storage sia disponibile
        if (typeof Storage === 'undefined' || !window.Storage) {
            throw new Error('Storage non disponibile! Assicurati che storage.js sia caricato.');
        }

        const callbacks = {
            log: log,
            updateStatus: updateStatus
        };

        // Esegui il singolo test
        await StorageTests.runSingle(testId, callbacks);

        log('', 'info');
        log('✅ Test completato!', 'success');
        
        // Mostra i pulsanti log dopo l'esecuzione del singolo test
        const logButtons = document.getElementById('storage-log-buttons');
        if (logButtons) {
            logButtons.style.display = 'flex';
        }
    } catch (error) {
        log(`✗ Errore fatale: ${error.message}`, 'error');
        console.error('Errore test storage:', error);
        updateStatus(testId, 'fail');
        
        // Mostra i pulsanti log anche in caso di errore
        const logButtons = document.getElementById('storage-log-buttons');
        if (logButtons) {
            logButtons.style.display = 'flex';
        }
    }
};

// Funzione per aggiornare l'header con statistiche Storage
function updateStorageHeader(passed, failed, duration) {
    const total = passed + failed;
    const totalTests = 24; // Numero totale di test Storage
    
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
    if (progressEl) progressEl.textContent = `${total}/${totalTests}`;
    
    // Aggiorna barra progresso
    if (barEl) {
        const progress = Math.round((total / totalTests) * 100);
        barEl.setAttribute('data-progress', progress);
        barEl.style.width = `${progress}%`;
    }
    
    // Aggiorna status
    if (statusEl) {
        statusEl.classList.remove('status-pending', 'status-running', 'status-success', 'status-error');
        
        if (failed > 0) {
            statusEl.classList.add('status-error');
            statusEl.textContent = 'Errori';
        } else if (total === totalTests) {
            statusEl.classList.add('status-success');
            statusEl.textContent = 'Completato';
        } else if (total > 0) {
            statusEl.classList.add('status-running');
            statusEl.textContent = 'In esecuzione';
        } else {
            statusEl.classList.add('status-pending');
            statusEl.textContent = 'In attesa';
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

// Espone la funzione per essere chiamata da testStorage
window.updateStorageHeader = updateStorageHeader;

// Funzioni per gestire il log Storage
window.copyStorageLog = function() {
    const output = document.getElementById('output-storage');
    if (output && output.textContent) {
        navigator.clipboard.writeText(output.textContent).then(() => {
            showNotificationModal('✓ Log copiato', 'Il log Storage è stato copiato negli appunti!');
        }).catch(err => {
            console.error('Errore copia log:', err);
            showNotificationModal('✗ Errore', 'Impossibile copiare il log negli appunti.');
        });
    } else {
        showNotificationModal('⚠ Attenzione', 'Nessun log disponibile da copiare.');
    }
};

window.downloadStorageLog = function() {
    const output = document.getElementById('output-storage');
    if (output && output.textContent) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
        const filename = `test-storage-${timestamp}.txt`;
        const blob = new Blob([output.textContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
};

window.clearStorageLog = function() {
    const output = document.getElementById('output-storage');
    const buttons = document.getElementById('storage-log-buttons');
    if (output) {
        output.innerHTML = '';
        output.style.display = 'none';
    }
    if (buttons) {
        buttons.style.display = 'none';
    }
};

console.log('✅ js/tests/test-storage-wrappers.js caricato - Funzioni Storage test disponibili nello scope globale');

