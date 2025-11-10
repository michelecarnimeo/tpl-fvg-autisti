/**
 * js/tests/test-utils.js
 * 
 * Utility functions per pagina test.html
 * Funzioni di logging, status update e statistiche
 * 
 * API Pubblica: window.TestUtils
 */

(function () {
    'use strict';

    /**
     * Utility per logging nei test
     * @param {string} outputId - ID elemento output dove loggare
     * @param {string} message - Messaggio da loggare
     * @param {string} type - Tipo messaggio: 'info', 'success', 'error', 'warning'
     */
    function log(outputId, message, type = 'info') {
        const output = document.getElementById(outputId);
        if (!output) {
            console.warn(`⚠️ Output element not found: ${outputId}`);
            return;
        }

        // Mostra l'output se nascosto
        output.style.display = 'block';

        // Assicurati che message sia una stringa
        if (typeof message !== 'string') {
            console.error('❌ log() ricevuto non-stringa:', message);
            message = String(message);
        }

        // Crea elemento log
        const logDiv = document.createElement('div');
        logDiv.className = `console-log ${type}`;
        logDiv.textContent = `[${new Date().toLocaleTimeString('it-IT')}] ${message}`;

        // Aggiungi al DOM
        output.appendChild(logDiv);

        // Auto-scroll in fondo (posticipato per evitare forced reflow)
        // Usa requestAnimationFrame per posticipare lo scroll dopo il rendering
        requestAnimationFrame(() => {
            output.scrollTop = output.scrollHeight;
        });

        // Log anche in console per debug
        const consoleMethod = type === 'error' ? 'error' : type === 'warning' ? 'warn' : 'log';
        console[consoleMethod](`[TEST] ${message}`);
    }

    /**
     * Aggiorna lo status di un singolo test
     * @param {string} testId - ID dell'elemento test
     * @param {string} status - Status: 'pass', 'fail', 'pending'
     */
    function updateTestStatus(testId, status) {
        const testItem = document.getElementById(testId);
        if (!testItem) {
            console.warn(`⚠️ Test element not found: ${testId}`);
            return;
        }

        const statusSpan = testItem.querySelector('.test-status');
        if (!statusSpan) {
            console.warn(`⚠️ Status span not found in: ${testId}`);
            return;
        }

        // Rimuovi classi precedenti
        statusSpan.classList.remove('pass', 'fail', 'pending');

        // Aggiungi nuova classe
        statusSpan.classList.add(status);

        // Aggiorna testo
        const statusText = {
            pass: '✅ Passato',
            fail: '❌ Fallito',
            pending: '⏳ In attesa'
        };
        statusSpan.textContent = statusText[status] || status;

        // Aggiorna statistiche
        updateStats();
    }

    /**
     * Aggiorna le statistiche globali dei test
     * Conta tutti gli status e aggiorna i contatori
     */
    function updateStats() {
        const allStatuses = document.querySelectorAll('.test-status');
        let total = 0, pass = 0, fail = 0, pending = 0;

        allStatuses.forEach(status => {
            total++;
            if (status.classList.contains('pass')) {
                pass++;
            } else if (status.classList.contains('fail')) {
                fail++;
            } else if (status.classList.contains('pending')) {
                pending++;
            }
        });

        // Aggiorna contatori UI
        const statTotal = document.getElementById('stat-total');
        const statPass = document.getElementById('stat-pass');
        const statFail = document.getElementById('stat-fail');
        const statPending = document.getElementById('stat-pending');

        if (statTotal) statTotal.textContent = total;
        if (statPass) statPass.textContent = pass;
        if (statFail) statFail.textContent = fail;
        if (statPending) statPending.textContent = pending;
    }

    /**
     * Reset tutti gli status dei test a 'pending'
     */
    function resetAllTests() {
        const allStatuses = document.querySelectorAll('.test-status');
        allStatuses.forEach(status => {
            status.classList.remove('pass', 'fail');
            status.classList.add('pending');
            status.textContent = '⏳ In attesa';
        });
        updateStats();
    }

    /**
     * Pulisce l'output di un test specifico
     * @param {string} outputId - ID elemento output da pulire
     */
    function clearOutput(outputId) {
        const output = document.getElementById(outputId);
        if (output) {
            output.innerHTML = '';
            output.style.display = 'none';
        }
    }

    /**
     * Pulisce tutti gli output dei test
     */
    function clearAllOutputs() {
        const outputs = document.querySelectorAll('.test-output');
        outputs.forEach(output => {
            output.innerHTML = '';
            output.style.display = 'none';
        });
    }

    /**
     * Crea un separatore visivo nel log
     * @param {string} outputId - ID elemento output
     * @param {string} title - Titolo del separatore (opzionale)
     */
    function logSeparator(outputId, title = '') {
        const output = document.getElementById(outputId);
        if (!output) return;

        output.style.display = 'block';

        const separator = document.createElement('div');
        separator.style.cssText = 'margin: 1rem 0; padding: 0.5rem; border-top: 2px solid var(--bordo); border-bottom: 2px solid var(--bordo); font-weight: bold; text-align: center; color: var(--turchese);';
        separator.textContent = title ? `=== ${title} ===` : '===========================';

        output.appendChild(separator);
    }

    /**
     * Formatta un oggetto per il logging
     * @param {Object} obj - Oggetto da formattare
     * @param {number} indent - Livello indentazione (default: 2)
     * @returns {string} Oggetto formattato
     */
    function formatObject(obj, indent = 2) {
        try {
            return JSON.stringify(obj, null, indent);
        } catch (error) {
            return String(obj);
        }
    }

    /**
     * Log di un oggetto con formattazione
     * @param {string} outputId - ID elemento output
     * @param {string} label - Etichetta dell'oggetto
     * @param {Object} obj - Oggetto da loggare
     */
    function logObject(outputId, label, obj) {
        const output = document.getElementById(outputId);
        if (!output) return;

        output.style.display = 'block';

        const logDiv = document.createElement('div');
        logDiv.className = 'console-log info';
        logDiv.innerHTML = `
      <strong>${label}:</strong>
      <pre style="margin: 0.5rem 0; padding: 0.5rem; background: rgba(0,0,0,0.05); border-radius: 4px; overflow-x: auto; font-size: 0.85rem;">${formatObject(obj)}</pre>
    `;

        output.appendChild(logDiv);
        // Auto-scroll in fondo (posticipato per evitare forced reflow)
        requestAnimationFrame(() => {
            output.scrollTop = output.scrollHeight;
        });
    }

    /**
     * Misura il tempo di esecuzione di una funzione
     * @param {Function} fn - Funzione da misurare
     * @param {string} label - Etichetta per identificare la misurazione
     * @returns {Promise<{result: any, duration: number}>} Risultato e durata in ms
     */
    async function measureTime(fn, label = 'Operazione') {
        const start = performance.now();
        const result = await fn();
        const end = performance.now();
        const duration = (end - start).toFixed(2);

        console.log(`⏱️ ${label}: ${duration}ms`);

        return {
            result: result,
            duration: parseFloat(duration)
        };
    }

    /**
     * Crea un progress indicator nel log
     * @param {string} outputId - ID elemento output
     * @param {number} current - Valore corrente
     * @param {number} total - Valore totale
     * @param {string} label - Etichetta (opzionale)
     */
    function logProgress(outputId, current, total, label = 'Progresso') {
        const output = document.getElementById(outputId);
        if (!output) return;

        output.style.display = 'block';

        // Rimuovi progress precedente se esiste
        const existingProgress = output.querySelector('.progress-indicator');
        if (existingProgress) {
            existingProgress.remove();
        }

        const percentage = Math.round((current / total) * 100);

        const progressDiv = document.createElement('div');
        progressDiv.className = 'console-log info progress-indicator';
        progressDiv.innerHTML = `
      <strong>${label}:</strong> ${current}/${total} (${percentage}%)
      <div style="width: 100%; height: 6px; background: rgba(0,0,0,0.1); border-radius: 3px; margin-top: 0.25rem; overflow: hidden;">
        <div style="width: ${percentage}%; height: 100%; background: var(--turchese); transition: width 0.3s ease;"></div>
      </div>
    `;

        output.appendChild(progressDiv);
        // Auto-scroll in fondo (posticipato per evitare forced reflow)
        requestAnimationFrame(() => {
            output.scrollTop = output.scrollHeight;
        });
    }

    /**
     * Copia il contenuto testuale di un output negli appunti
     * @param {string} outputId - ID dell'elemento output
     */
    async function copyOutput(outputId) {
        const output = document.getElementById(outputId);
        if (!output) {
            console.warn(`⚠️ Output element not found: ${outputId}`);
            return false;
        }
        const text = output.innerText.trim();
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(text);
            } else {
                // Fallback
                const textarea = document.createElement('textarea');
                textarea.value = text;
                textarea.style.position = 'fixed';
                textarea.style.opacity = '0';
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
            }
            // Feedback utente nel log
            log(outputId, '📋 Log copiato negli appunti', 'success');
            return true;
        } catch (err) {
            log(outputId, `❌ Impossibile copiare il log: ${err.message}`, 'error');
            return false;
        }
    }

    /**
     * Aggiunge un pulsante "Copia log" sopra un output
     * @param {string} outputId - ID dell'elemento output
     * @param {string} label - Testo del pulsante
     */
    function addCopyButton(outputId, label = 'Copia log') {
        const output = document.getElementById(outputId);
        if (!output) return;

        // Evita duplicazioni
        if (output.dataset.copyBtnAttached === 'true') return;

        // Barra strumenti
        const toolbar = document.createElement('div');
        toolbar.className = 'test-output-toolbar';
        toolbar.style.cssText = 'display:flex; justify-content:flex-end; gap:0.5rem; margin:0.25rem 0;';

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'copy-log-btn';
        btn.textContent = `📋 ${label}`;
        btn.style.cssText = 'cursor:pointer; border:1px solid var(--bordo); background: var(--sfondo-chiaro, #f7f7f9); color: var(--testo, #222); padding: 0.25rem 0.5rem; border-radius: 6px; font-size: 0.85rem;';
        btn.addEventListener('click', async () => {
            btn.disabled = true;
            const ok = await copyOutput(outputId);
            const prev = btn.textContent;
            btn.textContent = ok ? '✅ Copiato' : '❌ Errore';
            setTimeout(() => { btn.textContent = prev; btn.disabled = false; }, 1000);
        });

        toolbar.appendChild(btn);
        // Inserisci la toolbar subito prima dell'output
        output.parentNode.insertBefore(toolbar, output);
        output.dataset.copyBtnAttached = 'true';
    }

    /**
     * Aggiunge automaticamente il pulsante "Copia log" a tutti gli output
     */
    function enableCopyButtonsForAllOutputs() {
        const outputs = document.querySelectorAll('.test-output[id]');
        outputs.forEach(out => {
            // Consenti opt-out aggiungendo data-no-copy="true" sull'elemento output
            if (out.dataset.noCopy === 'true') return;
            addCopyButton(out.id);
        });
    }

    // ===== API PUBBLICA =====
    window.TestUtils = {
        // Logging
        log: log,
        logSeparator: logSeparator,
        logObject: logObject,
        logProgress: logProgress,

        // Status management
        updateTestStatus: updateTestStatus,
        updateStats: updateStats,
        resetAllTests: resetAllTests,

        // Output management
        clearOutput: clearOutput,
        clearAllOutputs: clearAllOutputs,

        // Utilities
        formatObject: formatObject,
        measureTime: measureTime
        ,
        // Clipboard helpers
        copyOutput: copyOutput,
        addCopyButton: addCopyButton,
        enableCopyButtonsForAllOutputs: enableCopyButtonsForAllOutputs
    };

    console.log('✅ Modulo test-utils.js caricato');

})();
