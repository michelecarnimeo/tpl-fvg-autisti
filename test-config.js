// test-config.js - Configurazione estesa per test TPL FVG

/**
 * Configurazione dei test
 * Permette di aggiungere facilmente nuovi test e scenari
 */

const TEST_CONFIG = {
    // Scenari di test predefiniti
    testScenarios: [
        {
            name: "Tratta corta",
            lineaIndex: 0,
            partenzaIndex: 0,
            arrivoIndex: 2,
            expectedPriceMin: 1.00,
            expectedPriceMax: 2.00
        },
        {
            name: "Tratta media",
            lineaIndex: 0,
            partenzaIndex: 0,
            arrivoIndex: 7,
            expectedPriceMin: 2.50,
            expectedPriceMax: 4.00
        },
        {
            name: "Tratta lunga",
            lineaIndex: 0,
            partenzaIndex: 0,
            arrivoIndex: 15,
            expectedPriceMin: 5.00,
            expectedPriceMax: 6.00
        }
    ],

    // Timeout per test asincroni
    timeouts: {
        database: 5000,      // 5 secondi
        serviceWorker: 10000, // 10 secondi
        api: 3000            // 3 secondi
    },

    // Soglie di performance
    performance: {
        databaseLoadMax: 1000,    // ms
        priceCalculationMax: 10,  // ms (per 1000 iterazioni)
        renderTimeMax: 100        // ms
    },

    // Configurazione cache
    cache: {
        expectedCacheName: 'tpl-cache-v2',
        minCachedResources: 8
    },

    // Validazione manifest
    manifest: {
        requiredFields: ['name', 'short_name', 'start_url', 'display', 'icons'],
        requiredIconSizes: ['192x192', '512x512']
    },

    // LocalStorage keys da verificare
    localStorageKeys: [
        'tpl.isDark',
        'tpl.welcomeDismissed',
        'tpl.lineaIdx',
        'tpl.partenzaIdx',
        'tpl.arrivoIdx'
    ],

    // Endpoint da testare
    endpoints: {
        database: './database.json',
        manifest: './manifest.json',
        tariffarioAggiornato: './tariffario aggiornato.json' // opzionale
    }
};

/**
 * Funzioni helper per test avanzati
 */
const TEST_HELPERS = {

    /**
     * Simula una selezione utente completa
     */
    simulateUserSelection: async function (lineaIdx, partenzaIdx, arrivoIdx) {
        if (!window.lineaSelect || !window.partenzaSelect || !window.arrivoSelect) {
            throw new Error('Select elements non disponibili');
        }

        // Simula selezione linea
        lineaSelect.value = lineaIdx;
        lineaSelect.dispatchEvent(new Event('change'));
        await this.wait(100);

        // Simula selezione partenza
        partenzaSelect.value = partenzaIdx;
        partenzaSelect.dispatchEvent(new Event('change'));
        await this.wait(100);

        // Simula selezione arrivo
        arrivoSelect.value = arrivoIdx;
        arrivoSelect.dispatchEvent(new Event('change'));
        await this.wait(100);

        return true;
    },

    /**
     * Verifica che un prezzo sia nel range atteso
     */
    isPriceInRange: function (price, min, max) {
        return typeof price === 'number' && price >= min && price <= max;
    },

    /**
     * Attende per un tempo specifico
     */
    wait: function (ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    /**
     * Misura il tempo di esecuzione di una funzione
     */
    measureTime: async function (fn) {
        const start = performance.now();
        await fn();
        const end = performance.now();
        return end - start;
    },

    /**
     * Verifica la validità di un codice biglietto
     */
    isValidTicketCode: function (code) {
        if (!code || typeof code !== 'string') return false;
        // I codici sono tipicamente nel formato "E1", "E2", etc.
        return /^[A-Z]\d+$/.test(code);
    },

    /**
     * Ottiene statistiche sul database
     */
    getDatabaseStats: function (tariffario) {
        if (!Array.isArray(tariffario) || tariffario.length === 0) {
            return null;
        }

        const stats = {
            totalLines: tariffario.length,
            lines: []
        };

        tariffario.forEach(linea => {
            const lineStats = {
                name: linea.nome,
                stops: linea.fermate.length,
                prices: {
                    min: Infinity,
                    max: -Infinity,
                    avg: 0,
                    count: 0
                },
                codes: 0
            };

            // Analizza prezzi
            let priceSum = 0;
            for (let i = 0; i < linea.fermate.length; i++) {
                for (let j = 0; j < linea.fermate.length; j++) {
                    if (i === j) continue;
                    const price = linea.prezzi?.[i]?.[j];
                    const code = linea.codici?.[i]?.[j];

                    if (typeof price === 'number') {
                        lineStats.prices.min = Math.min(lineStats.prices.min, price);
                        lineStats.prices.max = Math.max(lineStats.prices.max, price);
                        priceSum += price;
                        lineStats.prices.count++;
                    }

                    if (code && code !== '') {
                        lineStats.codes++;
                    }
                }
            }

            if (lineStats.prices.count > 0) {
                lineStats.prices.avg = priceSum / lineStats.prices.count;
            }

            stats.lines.push(lineStats);
        });

        return stats;
    },

    /**
     * Verifica l'integrità dei dati
     */
    validateDataIntegrity: function (tariffario) {
        const errors = [];

        if (!Array.isArray(tariffario)) {
            errors.push('Tariffario non è un array');
            return errors;
        }

        tariffario.forEach((linea, lineaIdx) => {
            // Verifica campi obbligatori
            if (!linea.nome) {
                errors.push(`Linea ${lineaIdx}: nome mancante`);
            }
            if (!Array.isArray(linea.fermate)) {
                errors.push(`Linea ${lineaIdx}: fermate non è un array`);
            }
            if (!Array.isArray(linea.prezzi)) {
                errors.push(`Linea ${lineaIdx}: prezzi non è un array`);
            }

            // Verifica dimensioni matrici
            const numFermate = linea.fermate?.length || 0;
            const numRighePrezzo = linea.prezzi?.length || 0;

            if (numRighePrezzo !== numFermate) {
                errors.push(`Linea ${lineaIdx}: numero righe prezzi (${numRighePrezzo}) non corrisponde a fermate (${numFermate})`);
            }

            // Verifica ogni riga della matrice prezzi
            if (Array.isArray(linea.prezzi)) {
                linea.prezzi.forEach((riga, i) => {
                    if (!Array.isArray(riga)) {
                        errors.push(`Linea ${lineaIdx}, riga ${i}: non è un array`);
                    } else if (riga.length !== numFermate) {
                        errors.push(`Linea ${lineaIdx}, riga ${i}: lunghezza (${riga.length}) non corrisponde a fermate (${numFermate})`);
                    }
                });
            }

            // Verifica codici se presenti
            if (linea.codici) {
                if (!Array.isArray(linea.codici)) {
                    errors.push(`Linea ${lineaIdx}: codici non è un array`);
                } else if (linea.codici.length !== numFermate) {
                    errors.push(`Linea ${lineaIdx}: numero righe codici non corrisponde a fermate`);
                }
            }
        });

        return errors;
    },

    /**
     * Genera un report HTML dei risultati
     */
    generateHTMLReport: function (results) {
        let html = '<div class="test-report">';
        html += `<h3>Report Test - ${new Date().toLocaleString()}</h3>`;
        html += '<table style="width: 100%; border-collapse: collapse;">';
        html += '<tr><th>Test</th><th>Risultato</th><th>Tempo</th><th>Note</th></tr>';

        results.forEach(result => {
            const statusColor = result.passed ? '#28a745' : '#dc3545';
            html += `<tr style="border-bottom: 1px solid #ddd;">`;
            html += `<td>${result.name}</td>`;
            html += `<td style="color: ${statusColor}; font-weight: bold;">${result.passed ? '✅ PASS' : '❌ FAIL'}</td>`;
            html += `<td>${result.time ? result.time.toFixed(2) + 'ms' : '-'}</td>`;
            html += `<td>${result.notes || '-'}</td>`;
            html += '</tr>';
        });

        html += '</table></div>';
        return html;
    },

    /**
     * Esporta risultati in JSON
     */
    exportResultsJSON: function (results) {
        const exportData = {
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            results: results,
            summary: {
                total: results.length,
                passed: results.filter(r => r.passed).length,
                failed: results.filter(r => !r.passed).length
            }
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `tpl-test-results-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    },

    /**
     * Test stress: esegue molti calcoli consecutivi
     */
    stressTestCalculations: async function (iterations = 10000) {
        if (!window.tariffario || tariffario.length === 0) {
            throw new Error('Tariffario non caricato');
        }

        const linea = tariffario[0];
        const numFermate = linea.fermate.length;

        const start = performance.now();

        for (let i = 0; i < iterations; i++) {
            // Genera indici casuali
            const p = Math.floor(Math.random() * numFermate);
            let a = Math.floor(Math.random() * numFermate);
            while (a === p) {
                a = Math.floor(Math.random() * numFermate);
            }

            // Calcola prezzo
            const prezzo = linea.prezzi[p][a];
            const codice = linea.codici?.[p]?.[a];
        }

        const end = performance.now();
        const totalTime = end - start;
        const avgTime = totalTime / iterations;

        return {
            iterations,
            totalTime: totalTime.toFixed(2),
            avgTime: avgTime.toFixed(4),
            iterationsPerSecond: (iterations / (totalTime / 1000)).toFixed(0)
        };
    }
};

// Esporta per uso globale
if (typeof window !== 'undefined') {
    window.TEST_CONFIG = TEST_CONFIG;
    window.TEST_HELPERS = TEST_HELPERS;
}
