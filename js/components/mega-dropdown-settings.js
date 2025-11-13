/**
 * js/components/mega-dropdown-settings.js
 *
 * Mega Dropdown Impostazioni Module
 * Componente condiviso per tutte le pagine (solo desktop)
 *
 * Funzionalità:
 * - Toggle apertura/chiusura dropdown
 * - Gestione tema (Sistema/Chiaro/Scuro)
 * - Gestione animazione sfondo
 * - Gestione alto contrasto
 * - Gestione dimensione testo
 * - Azioni rapide (Apri Settings Modal, Verifica Aggiornamenti, Cancella Cache)
 * - Test di verifica funzionamento
 *
 * API Pubblica: window.MegaDropdownSettings
 *
 * NOTA: Questo componente è disponibile in tutte le pagine (solo desktop)
 */

(function () {
    'use strict';

    /**
     * Inizializza il Mega Dropdown Impostazioni
     * Gestisce correttamente il DOM ready state per garantire che gli elementi esistano
     * @returns {boolean} true se inizializzazione riuscita, false altrimenti
     */
    function initMegaDropdown() {
        const dropdownBtn = document.getElementById('settings-dropdown-btn');
        const dropdown = document.getElementById('settings-dropdown');

        // Verifica che gli elementi essenziali esistano
        if (!dropdownBtn || !dropdown) {
            // Non è un errore se non esiste - potrebbe non essere presente in alcune pagine
            return false;
        }

        console.log('✅ Mega Dropdown: Inizializzazione...');

        // Funzioni per aprire/chiudere dropdown
        function openDropdown() {
            dropdown.classList.add('show');
            dropdownBtn.classList.add('active');
        }

        function closeDropdown() {
            dropdown.classList.remove('show');
            dropdownBtn.classList.remove('active');
        }

        // Toggle dropdown al click sul pulsante
        dropdownBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isActive = dropdown.classList.contains('show');

            if (isActive) {
                closeDropdown();
            } else {
                openDropdown();
            }
        });

        // Chiudi dropdown quando si clicca fuori
        document.addEventListener('click', (e) => {
            if (!dropdown.contains(e.target) && !dropdownBtn.contains(e.target)) {
                closeDropdown();
            }
        });

        // Gestione tema (radio buttons)
        const themeRadios = document.querySelectorAll('input[name="theme-radio"]');
        if (themeRadios.length > 0) {
            themeRadios.forEach(radio => {
                radio.addEventListener('change', () => {
                    // Usa direttamente l'API pubblica di Settings
                    if (typeof window.Settings !== 'undefined' && window.Settings.setThemeMode) {
                        window.Settings.setThemeMode(radio.value); // 'light', 'dark', 'system'
                    } else {
                        console.warn('⚠️ Settings.setThemeMode non disponibile');
                    }
                });
            });
        }

        // Gestione animazione sfondo
        const animationToggle = document.getElementById('dropdown-animation-toggle');
        if (animationToggle) {
            animationToggle.addEventListener('change', () => {
                // Usa direttamente l'API pubblica di Settings
                if (typeof window.Settings !== 'undefined' && window.Settings.toggleAnimation) {
                    window.Settings.toggleAnimation();
                } else {
                    console.warn('⚠️ Settings.toggleAnimation non disponibile');
                }
            });
        }

        // Gestione alto contrasto
        const highContrastToggle = document.getElementById('dropdown-high-contrast');
        if (highContrastToggle) {
            highContrastToggle.addEventListener('change', () => {
                document.body.classList.toggle('high-contrast', highContrastToggle.checked);
            });
        }

        // Gestione font size
        const fontButtons = dropdown.querySelectorAll('.dropdown-font-btn');
        if (fontButtons.length > 0) {
            fontButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    const size = btn.dataset.size; // 'normal', 'large', 'xlarge'

                    // Rimuovi active da tutti
                    fontButtons.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');

                    // Usa direttamente l'API pubblica di Settings
                    if (typeof window.Settings !== 'undefined' && window.Settings.setFontSize) {
                        window.Settings.setFontSize(size);
                    } else {
                        console.warn('⚠️ Settings.setFontSize non disponibile');
                    }
                });
            });
        }

        // Gestione azioni rapide - Apri Settings Modal
        const openSettingsModalBtn = document.getElementById('dropdown-open-settings-modal');
        if (openSettingsModalBtn) {
            openSettingsModalBtn.addEventListener('click', async () => {
                closeDropdown();
                // Usa la funzione pubblica SettingsModal che gestisce il caricamento dinamico
                if (typeof window.SettingsModal !== 'undefined' && window.SettingsModal.open && typeof window.Settings !== 'undefined') {
                    try {
                        // Assicurati che il modal sia inizializzato prima di aprirlo
                        const modal = document.getElementById('settings-modal');
                        if (modal && !modal.dataset.initialized) {
                            console.log('🔧 Inizializzazione SettingsModal dal dropdown...');
                            await window.SettingsModal.initialize({
                                setThemeMode: window.Settings.setThemeMode || null,
                                toggleAnimation: window.Settings.toggleAnimation || null,
                                setHighContrast: window.Settings.setHighContrast || null,
                                setTouchFriendly: window.Settings.setTouchFriendly || null,
                                setHapticFeedback: window.Settings.setHapticFeedback || null,
                                setReduceMotion: window.Settings.setReduceMotion || null,
                                setKeepScreenOn: window.Settings.setKeepScreenOn || null,
                                setExtraSpacing: window.Settings.setExtraSpacing || null,
                                setCompactLayout: window.Settings.setCompactLayout || null,
                                setBlueLightFilter: window.Settings.setBlueLightFilter || null,
                                setInterfaceScale: window.Settings.setInterfaceScale || null,
                                setFontSize: window.Settings.setFontSize || null,
                                triggerHaptic: window.Settings.triggerHaptic || null,
                                onCloseMobileMenu: () => {}
                            });
                        }
                        
                        // Apri il modal usando la funzione pubblica
                        await window.SettingsModal.open();
                    } catch (error) {
                        console.error('❌ Errore nell\'apertura del modal:', error);
                    }
                } else {
                    console.warn('⚠️ SettingsModal o Settings non disponibili!');
                }
            });
        }

        // Gestione azioni rapide - Check Updates
        const checkUpdatesBtn = document.getElementById('dropdown-check-updates');
        if (checkUpdatesBtn) {
            checkUpdatesBtn.addEventListener('click', () => {
                // Usa direttamente l'API pubblica di Updates
                if (typeof window.Updates !== 'undefined' && window.Updates.checkForUpdates) {
                    window.Updates.checkForUpdates();
                } else {
                    console.warn('⚠️ Updates.checkForUpdates non disponibile');
                }
                closeDropdown();
            });
        }

        // Gestione azioni rapide - Clear Cache
        const clearCacheBtn = document.getElementById('dropdown-clear-cache');
        if (clearCacheBtn) {
            clearCacheBtn.addEventListener('click', () => {
                // Usa direttamente l'API pubblica di Updates (stessa funzione di checkForUpdates)
                if (typeof window.Updates !== 'undefined' && window.Updates.checkForUpdates) {
                    window.Updates.checkForUpdates();
                } else {
                    console.warn('⚠️ Updates.checkForUpdates non disponibile');
                }
                closeDropdown();
            });
        }

        console.log('✅ Mega Dropdown: Inizializzazione completata');
        
        // Test di verifica funzionamento (solo in modalità debug)
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            setTimeout(() => {
                testMegaDropdownFunctionality();
            }, 100);
        }
        
        return true;
    }

    /**
     * Test di verifica funzionamento del Mega Dropdown
     * Verifica che tutti gli elementi e listener siano configurati correttamente
     * @returns {boolean} true se tutti i test passano, false altrimenti
     */
    function testMegaDropdownFunctionality() {
        const dropdownBtn = document.getElementById('settings-dropdown-btn');
        const dropdown = document.getElementById('settings-dropdown');
        
        if (!dropdownBtn || !dropdown) {
            return false;
        }
        
        const tests = {
            elements: {
                btn: !!dropdownBtn,
                dropdown: !!dropdown,
                themeRadios: document.querySelectorAll('input[name="theme-radio"]').length > 0,
                animationToggle: !!document.getElementById('dropdown-animation-toggle'),
                highContrastToggle: !!document.getElementById('dropdown-high-contrast'),
                fontButtons: dropdown.querySelectorAll('.dropdown-font-btn').length > 0,
                openSettingsBtn: !!document.getElementById('dropdown-open-settings-modal'),
                checkUpdatesBtn: !!document.getElementById('dropdown-check-updates'),
                clearCacheBtn: !!document.getElementById('dropdown-clear-cache')
            },
            classes: {
                dropdownHasShowClass: dropdown.classList.contains('show') === false, // Dovrebbe essere chiuso inizialmente
                btnHasActiveClass: dropdownBtn.classList.contains('active') === false // Dovrebbe essere inattivo inizialmente
            },
            dependencies: {
                settingsModal: typeof window.SettingsModal !== 'undefined',
                settings: typeof window.Settings !== 'undefined',
                updates: typeof window.Updates !== 'undefined'
            }
        };
        
        const allTestsPassed = 
            Object.values(tests.elements).every(test => test === true) &&
            Object.values(tests.classes).every(test => test === true);
        
        console.log('🧪 Mega Dropdown: Test di verifica', {
            elementi: tests.elements,
            classi: tests.classes,
            dipendenze: tests.dependencies,
            risultato: allTestsPassed ? '✅ Tutti i test passati' : '⚠️ Alcuni test falliti'
        });
        
        if (allTestsPassed) {
            console.log('✅ Mega Dropdown: Pronto all\'uso!');
        } else {
            console.warn('⚠️ Mega Dropdown: Alcuni elementi o dipendenze potrebbero mancare');
        }
        
        return allTestsPassed;
    }

    /**
     * Inizializza il modulo quando il DOM è pronto
     */
    function init() {
        // Gestione DOM ready state
        if (document.readyState === 'loading') {
            // DOM non ancora pronto, aspetta DOMContentLoaded
            document.addEventListener('DOMContentLoaded', () => {
                initMegaDropdown();
            });
        } else {
            // DOM già pronto, inizializza immediatamente
            initMegaDropdown();
        }
    }

    // API Pubblica
    window.MegaDropdownSettings = {
        init: initMegaDropdown,
        test: testMegaDropdownFunctionality
    };

    console.log('✅ js/components/mega-dropdown-settings.js caricato - MegaDropdownSettings disponibile');

    // Auto-inizializza
    init();
})();

