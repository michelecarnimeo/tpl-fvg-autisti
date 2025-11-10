/**
 * ========================================
 * TEST SETTINGS WRAPPERS
 * Wrapper functions per retrocompatibilità con onclick inline
 * ========================================
 * 
 * Questo file definisce le funzioni globali che vengono chiamate
 * dagli onclick nell'HTML. Queste funzioni delegano a SettingsTests
 * quando disponibile.
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
   * Esegue tutti i test del modulo Settings.
   */
  window.testSettings = async function() {
    const output = 'output-settings';
    const outputEl = document.getElementById(output);
    
    if (!outputEl) {
      console.error('Elemento output non trovato:', output);
      return;
    }

    // Reset output
    outputEl.innerHTML = '';
    outputEl.style.display = 'block';

    // Aggiorna stato header a "in esecuzione"
    const statusEl = document.getElementById('settings-header-status');
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

    const updateStatus = (id, status) => {
      if (typeof TestUtils !== 'undefined' && TestUtils.updateTestStatus) {
        TestUtils.updateTestStatus(id, status);
      } else {
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

    try {
      // Verifica che SettingsTests sia disponibile
      if (typeof SettingsTests === 'undefined') {
        log('✗ SettingsTests non disponibile! Assicurati che test-settings.js sia caricato.', 'error');
        updateStatus('settings-header', 'fail'); // Update header status
        return;
      }

      // Verifica che Settings sia disponibile
      if (typeof Settings === 'undefined') {
        log('✗ Settings non disponibile! Assicurati che settings.js sia caricato.', 'error');
        updateStatus('settings-header', 'fail'); // Update header status
        return;
      }

      log('✓ SettingsTests e Settings disponibili', 'success');

      // Esegui tutti i test usando il modulo modulare
      const results = await SettingsTests.runAll({
        log: log,
        updateStatus: updateStatus
      });

      // Aggiorna l'header con le statistiche
      if (results && typeof window.updateSettingsHeader === 'function') {
        window.updateSettingsHeader(results.passed, results.failed, results.duration);
      }

    } catch (error) {
      if (typeof TestUtils !== 'undefined' && TestUtils.log) {
        TestUtils.log(output, `✗ Errore fatale: ${error.message}`, 'error');
        TestUtils.log(output, `Stack: ${error.stack}`, 'info');
      } else {
        console.error('Errore test settings:', error);
      }
    }

    // Mostra i pulsanti log dopo l'esecuzione
    const logButtons = document.getElementById('settings-log-buttons');
    if (logButtons) {
      logButtons.style.display = 'flex';
    }
  };

  /**
   * Esegue un singolo test Settings
   * @param {string} testId - ID del test da eseguire
   */
  window.runSingleSettingsTest = async function(testId) {
    const output = 'output-settings';
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
      if (typeof TestUtils !== 'undefined' && TestUtils.updateTestStatus) {
        TestUtils.updateTestStatus(id, status);
      } else {
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

    log(`🧪 Esecuzione Test: ${testId}...`, 'info');
    log('', 'info');

    const startTime = performance.now();

    try {
      // Verifica che SettingsTests sia disponibile
      if (typeof SettingsTests === 'undefined') {
        log('✗ SettingsTests non disponibile! Assicurati che test-settings.js sia caricato.', 'error');
        updateStatus(testId, 'fail');
        return;
      }

      // Verifica che Settings sia disponibile
      if (typeof Settings === 'undefined') {
        log('✗ Settings non disponibile! Assicurati che settings.js sia caricato.', 'error');
        updateStatus(testId, 'fail');
        return;
      }

      // Mappatura testId -> funzione SettingsTests
      const testMap = {
        'test-settings-font-size-normal': SettingsTests.testFontSizeNormal,
        'test-settings-font-size-large': SettingsTests.testFontSizeLarge,
        'test-settings-font-size-xlarge': SettingsTests.testFontSizeXLarge,
        'test-settings-theme-light': SettingsTests.testThemeLight,
        'test-settings-theme-dark': SettingsTests.testThemeDark,
        'test-settings-theme-system': SettingsTests.testThemeSystem,
        'test-settings-high-contrast': SettingsTests.testHighContrast,
        'test-settings-touch-friendly': SettingsTests.testTouchFriendly,
        'test-settings-reduce-motion': SettingsTests.testReduceMotion,
        'test-settings-extra-spacing': SettingsTests.testExtraSpacing,
        'test-settings-compact-layout': SettingsTests.testCompactLayout,
        'test-settings-blue-light-filter': SettingsTests.testBlueLightFilter,
        'test-settings-interface-scale-75': SettingsTests.testInterfaceScale75,
        'test-settings-interface-scale-85': SettingsTests.testInterfaceScale85,
        'test-settings-interface-scale-100': SettingsTests.testInterfaceScale100,
        'test-settings-interface-scale-115': SettingsTests.testInterfaceScale115,
        'test-settings-interface-scale-125': SettingsTests.testInterfaceScale125,
        'test-settings-haptic-feedback': SettingsTests.testHapticFeedback,
        'test-settings-animation-toggle': SettingsTests.testAnimationToggle,
        'test-settings-keep-screen-on': SettingsTests.testKeepScreenOn,
        'test-settings-localstorage-persistence': SettingsTests.testLocalStoragePersistence,
        'test-settings-css-classes': SettingsTests.testCssClasses
      };

      // Esegui il singolo test
      updateStatus(testId, 'running');
      
      const testFunction = testMap[testId];
      if (testFunction && typeof testFunction === 'function') {
        await testFunction({ log, updateStatus });
      } else {
        log(`✗ Test "${testId}" non riconosciuto`, 'error');
        log('   I test disponibili sono tutti quelli elencati nella sezione Settings', 'info');
        updateStatus(testId, 'fail');
      }
    } catch (error) {
      log(`✗ Test ${testId} fallito: ${error.message}`, 'error');
      updateStatus(testId, 'fail');
    }

    // Mostra i pulsanti log dopo l'esecuzione
    const logButtons = document.getElementById('settings-log-buttons');
    if (logButtons) {
      logButtons.style.display = 'flex';
    }
  };

  console.log('✅ js/tests/test-settings-wrappers.js caricato - Funzioni Settings test disponibili nello scope globale');

  /**
   * Inizializza event delegation per pulsanti test singoli Settings
   */
  function initSettingsSingleEventDelegation() {
    // Verifica se il listener è già stato aggiunto
    if (document.body.dataset.settingsSingleDelegationAdded === 'true') {
      return;
    }

    // Event delegation: listener per pulsanti con data-test="settings-single"
    document.body.addEventListener('click', (e) => {
      const button = e.target.closest('[data-test="settings-single"]');
      
      if (button && button.classList.contains('test-run-single')) {
        e.preventDefault();
        e.stopPropagation();
        
        const testId = button.dataset.testId;
        if (testId && typeof window.runSingleSettingsTest === 'function') {
          window.runSingleSettingsTest(testId);
        } else {
          console.error('❌ runSingleSettingsTest non disponibile o testId mancante');
        }
      }
    });

    // Marca come inizializzato
    document.body.dataset.settingsSingleDelegationAdded = 'true';
    console.log('✅ Event delegation per Settings singoli test inizializzata');
  }

  // Auto-inizializza event delegation per singoli test quando il DOM è pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSettingsSingleEventDelegation);
  } else {
    initSettingsSingleEventDelegation();
  }

  /**
   * Inizializza event delegation per pulsante test Settings
   */
  function initSettingsEventDelegation() {
    // Verifica se il listener è già stato aggiunto
    if (document.body.dataset.settingsDelegationAdded === 'true') {
      return;
    }

    // Event delegation: listener per pulsanti con data-test="settings"
    document.body.addEventListener('click', (e) => {
      const button = e.target.closest('[data-test="settings"]');
      
      if (button && button.classList.contains('test-button')) {
        e.preventDefault();
        e.stopPropagation();
        
        if (typeof window.testSettings === 'function') {
          window.testSettings();
        } else {
          console.error('❌ testSettings non disponibile');
        }
      }
    });

    // Marca come inizializzato
    document.body.dataset.settingsDelegationAdded = 'true';
    console.log('✅ Event delegation per Settings test inizializzata');
  }

  // Auto-inizializza event delegation quando il DOM è pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSettingsEventDelegation);
  } else {
    initSettingsEventDelegation();
  }

  /**
   * Inizializza event delegation per pulsanti utility Settings
   * (Toggle groups, Reset, Copy/Download/Clear log)
   */
  function initSettingsUtilityEventDelegation() {
    // Verifica se il listener è già stato aggiunto
    if (document.body.dataset.settingsUtilityDelegationAdded === 'true') {
      return;
    }

    // Event delegation: listener per pulsanti utility Settings
    document.body.addEventListener('click', (e) => {
      const button = e.target.closest('[data-settings-action]');
      
      if (button && button.classList.contains('test-button')) {
        e.preventDefault();
        e.stopPropagation();
        
        const action = button.dataset.settingsAction;
        
        switch(action) {
          case 'toggle-open':
            if (typeof window.toggleAllSettingsGroups === 'function') {
              window.toggleAllSettingsGroups(true);
            }
            break;
            
          case 'toggle-close':
            if (typeof window.toggleAllSettingsGroups === 'function') {
              window.toggleAllSettingsGroups(false);
            }
            break;
            
          case 'reset':
            if (typeof window.resetSettingsTests === 'function') {
              window.resetSettingsTests();
            }
            break;
            
          case 'copy-log':
            if (typeof window.copySettingsLog === 'function') {
              window.copySettingsLog();
            }
            break;
            
          case 'download-log':
            if (typeof window.downloadSettingsLog === 'function') {
              window.downloadSettingsLog();
            }
            break;
            
          case 'clear-log':
            if (typeof window.clearSettingsLog === 'function') {
              window.clearSettingsLog();
            }
            break;
        }
      }
    });

    // Marca come inizializzato
    document.body.dataset.settingsUtilityDelegationAdded = 'true';
    console.log('✅ Event delegation per Settings utility buttons inizializzata');
  }

  // Auto-inizializza event delegation per utility buttons quando il DOM è pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSettingsUtilityEventDelegation);
  } else {
    initSettingsUtilityEventDelegation();
  }

})();

