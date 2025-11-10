/**
 * ========================================
 * TEST LOG HELPERS
 * Funzioni per gestione log (copia, download, clear)
 * ========================================
 * 
 * Questo modulo fornisce funzioni riutilizzabili per gestire i log dei test:
 * - Copia log negli appunti
 * - Download log come file
 * - Clear log (pulizia output e nascondere pulsanti)
 * 
 * IMPORTANTE: Questo file deve essere caricato PRIMA del DOM
 * per essere disponibile quando il browser legge gli onclick.
 * 
 * @version 1.0.0
 * @date 2025-11-06
 */

(function() {
    'use strict';

    /**
     * Helper per mostrare notifiche (usa NotificationModal se disponibile, altrimenti alert)
     * @param {string} title - Titolo della notifica
     * @param {string} message - Messaggio della notifica
     */
    function showNotification(title, message) {
        if (typeof showNotificationModal === 'function') {
            showNotificationModal(title, message);
        } else {
            alert(`${title}\n\n${message}`);
        }
    }

    /**
     * Copia il contenuto di un elemento output negli appunti
     * @param {string} outputId - ID dell'elemento output
     * @param {string} logName - Nome del log (per il messaggio)
     */
    function copyLog(outputId, logName) {
        const output = document.getElementById(outputId);
        if (output && output.textContent) {
            navigator.clipboard.writeText(output.textContent).then(() => {
                showNotification('✓ Log copiato', `Il log ${logName} è stato copiato negli appunti!`);
            }).catch(err => {
                console.error('Errore copia log:', err);
                showNotification('✗ Errore', 'Impossibile copiare il log negli appunti.');
            });
        } else {
            showNotification('⚠ Attenzione', 'Nessun log disponibile da copiare.');
        }
    }

    /**
     * Scarica il contenuto di un elemento output come file
     * @param {string} outputId - ID dell'elemento output
     * @param {string} prefix - Prefisso per il nome del file (es. 'test-database', 'test-prezzi')
     */
    function downloadLog(outputId, prefix) {
        const output = document.getElementById(outputId);
        if (output && output.textContent) {
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
            const filename = `${prefix}-${timestamp}.txt`;
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
    }

    /**
     * Pulisce il contenuto di un elemento output e nasconde i pulsanti log
     * @param {string} outputId - ID dell'elemento output
     * @param {string} buttonsId - ID del container dei pulsanti log
     */
    function clearLog(outputId, buttonsId) {
        const output = document.getElementById(outputId);
        const buttons = document.getElementById(buttonsId);
        
        if (output) {
            output.innerHTML = '';
            output.style.display = 'none';
        }
        
        if (buttons) {
            buttons.style.display = 'none';
        }
    }

    // ===== FUNZIONI ESPOSTE GLOBALMENTE =====
    // Esposte nello scope globale per essere disponibili agli onclick
    // NOTA: Assegniamo sia a window.functionName che direttamente a functionName
    // per essere sicuri che siano accessibili con e senza il prefisso window.

    // Database
    window.copyDatabaseLog = function() {
        copyLog('output-database', 'Database');
    };

    window.downloadDatabaseLog = function() {
        downloadLog('output-database', 'test-database');
    };

    window.clearDatabaseLog = function() {
        clearLog('output-database', 'db-log-buttons');
    };

    // Price
    window.copyPriceLog = function() {
        copyLog('output-price', 'Prezzi');
    };

    window.downloadPriceLog = function() {
        downloadLog('output-price', 'test-prezzi');
    };

    window.clearPriceLog = function() {
        clearLog('output-price', 'price-log-buttons');
    };

    // Settings
    window.copySettingsLog = function() {
        copyLog('output-settings', 'Settings');
    };

    window.downloadSettingsLog = function() {
        downloadLog('output-settings', 'test-settings');
    };

    window.clearSettingsLog = function() {
        clearLog('output-settings', 'settings-log-buttons');
    };

    // Service Worker
    window.copySwLog = function() {
        copyLog('output-sw', 'Service Worker');
    };

    window.downloadSwLog = function() {
        downloadLog('output-sw', 'test-sw');
    };

    window.clearSwLog = function() {
        clearLog('output-sw', 'sw-log-buttons');
    };

    // Route Selector
    window.copyRouteLog = function() {
        copyLog('output-route', 'Route Selector');
    };

    window.downloadRouteLog = function() {
        downloadLog('output-route', 'test-route-selector');
    };

    window.clearRouteLog = function() {
        clearLog('output-route', 'route-log-buttons');
    };

    // Performance
    window.copyPerformanceLog = function() {
        copyLog('output-performance', 'Performance');
    };

    window.downloadPerformanceLog = function() {
        downloadLog('output-performance', 'test-performance');
    };

    window.clearPerformanceLog = function() {
        clearLog('output-performance', 'performance-log-buttons');
    };

    console.log('✅ js/tests/test-log-helpers.js caricato - Funzioni gestione log disponibili nello scope globale');
})();

