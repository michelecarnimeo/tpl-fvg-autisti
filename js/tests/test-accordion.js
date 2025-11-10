/**
 * ========================================
 * TEST ACCORDION MODULE
 * Gestione unificata degli accordion per gruppi di test
 * ========================================
 * 
 * Questo modulo gestisce l'apertura/chiusura dei gruppi di test
 * (Database, Prezzi, LocalStorage, Settings, Service Worker)
 * 
 * API:
 * - TestAccordion.toggleGroup(prefix, groupId, options)
 * - TestAccordion.toggleAllGroups(prefix, groupIds, open, options)
 * 
 * @version 1.0.0
 * @date 2025-11-06
 */

(function() {
    'use strict';

    /**
     * Configurazione per ogni tipo di accordion
     */
    const ACCORDION_CONFIG = {
        db: {
            groups: ['group1', 'group2', 'group3', 'group4'],
            animation: true,
            animationDuration: 500
        },
        price: {
            groups: ['group1', 'group2', 'group3', 'group4'],
            animation: false
        },
        storage: {
            groups: ['group1', 'group2', 'group3', 'group4', 'group5'],
            animation: true,
            animationDuration: 600
        },
        settings: {
            groups: ['group1', 'group2', 'group3', 'group4', 'group5'],
            animation: false
        },
        sw: {
            groups: ['group1', 'group2', 'group3', 'group4'],
            animation: false,
            updateIconText: true // Service Worker aggiorna il testo dell'icona (▶/▼)
        }
    };

    /**
     * Toggle di un singolo gruppo accordion
     * 
     * @param {string} prefix - Prefisso del gruppo ('db', 'price', 'storage', 'settings', 'sw')
     * @param {string} groupId - ID del gruppo ('group1', 'group2', ecc.)
     * @param {Object} options - Opzioni aggiuntive
     * @param {boolean} options.animation - Forza animazione (override config)
     * @param {number} options.animationDuration - Durata animazione in ms
     */
    function toggleGroup(prefix, groupId, options = {}) {
        const content = document.getElementById(`${prefix}-${groupId}-content`);
        const icon = document.getElementById(`${prefix}-${groupId}-icon`);

        if (!content || !icon) {
            console.warn(`⚠️ Elementi non trovati per ${prefix}-${groupId}`);
            return;
        }

        const config = ACCORDION_CONFIG[prefix] || {};
        const useAnimation = options.animation !== undefined ? options.animation : config.animation;
        const animationDuration = options.animationDuration || config.animationDuration || 500;
        const updateIconText = config.updateIconText || false;

        const isExpanded = content.classList.contains('expanded');

        if (isExpanded) {
            // Chiudi
            content.classList.remove('expanded');
            icon.classList.remove('expanded');
            if (updateIconText) {
                icon.textContent = '▶';
            }
        } else {
            // Apri con animazione se configurato
            if (useAnimation) {
                const separator = content?.closest('.test-group-separator');
                if (separator) {
                    // Raggruppa le operazioni DOM per ridurre reflow
                    separator.classList.remove('expanding');
                    // Usa requestAnimationFrame per forzare reflow solo quando necessario
                    requestAnimationFrame(() => {
                        separator.classList.add('expanding');
                        setTimeout(() => {
                            separator.classList.remove('expanding');
                        }, animationDuration);
                    });
                } else {
                    console.warn(`⚠️ Separator non trovato per gruppo: ${prefix}-${groupId}`);
                }
            }
            
            // Espandi il contenuto
            content.classList.add('expanded');
            icon.classList.add('expanded');
            if (updateIconText) {
                icon.textContent = '▼';
            }
        }
    }

    /**
     * Toggle di tutti i gruppi di un prefisso
     * 
     * @param {string} prefix - Prefisso del gruppo ('db', 'price', 'storage', 'settings', 'sw')
     * @param {boolean} open - true per aprire tutti, false per chiudere tutti
     * @param {Array<string>} groupIds - Array di ID gruppi (opzionale, usa config se non fornito)
     * @param {Object} options - Opzioni aggiuntive
     */
    function toggleAllGroups(prefix, open, groupIds = null, options = {}) {
        const config = ACCORDION_CONFIG[prefix] || {};
        const groups = groupIds || config.groups || [];
        const updateIconText = config.updateIconText || false;

        groups.forEach(groupId => {
            const content = document.getElementById(`${prefix}-${groupId}-content`);
            const icon = document.getElementById(`${prefix}-${groupId}-icon`);

            if (!content || !icon) {
                // Non loggare warning - alcuni gruppi potrebbero non esistere in alcune pagine
                return;
            }

            if (open) {
                content.classList.add('expanded');
                icon.classList.add('expanded');
                if (updateIconText) {
                    icon.textContent = '▼';
                }
            } else {
                content.classList.remove('expanded');
                icon.classList.remove('expanded');
                if (updateIconText) {
                    icon.textContent = '▶';
                }
            }
        });
    }

    /**
     * API pubblica del modulo
     */
    window.TestAccordion = {
        /**
         * Toggle di un singolo gruppo
         * @param {string} prefix - Prefisso ('db', 'price', 'storage', 'settings', 'sw')
         * @param {string} groupId - ID gruppo ('group1', 'group2', ecc.)
         * @param {Object} options - Opzioni aggiuntive
         */
        toggleGroup: toggleGroup,

        /**
         * Toggle di tutti i gruppi di un prefisso
         * @param {string} prefix - Prefisso ('db', 'price', 'storage', 'settings', 'sw')
         * @param {boolean} open - true per aprire, false per chiudere
         * @param {Array<string>} groupIds - Array ID gruppi (opzionale)
         * @param {Object} options - Opzioni aggiuntive
         */
        toggleAllGroups: toggleAllGroups,

        /**
         * Ottieni configurazione per un prefisso
         * @param {string} prefix - Prefisso
         * @returns {Object} Configurazione
         */
        getConfig: function(prefix) {
            return ACCORDION_CONFIG[prefix] || null;
        }
    };

    console.log('✅ js/tests/test-accordion.js caricato - TestAccordion disponibile');
})();

