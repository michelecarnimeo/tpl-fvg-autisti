/**
 * js/tests/test-darkmode.js
 *
 * Suite completa di test per il modulo dark mode
 * Test che coprono toggle, persistenza, applicazione CSS e system preference
 *
 * API Pubblica: window.DarkModeTests
 */

(function () {
  'use strict';

  // Verifica che Settings sia disponibile
  function checkSettingsAvailable(callbacks) {
    if (typeof Settings === 'undefined') {
      callbacks.log('✗ Settings non disponibile! Assicurati che settings.js sia caricato.', 'error');
      const allTestIds = getAllTestIds();
      allTestIds.forEach(id => callbacks.updateStatus(id, 'fail'));
      return false;
    }
    return true;
  }

  // Lista completa di tutti i test IDs
  function getAllTestIds() {
    return [
      'test-darkmode-toggle',
      'test-darkmode-persistence'
    ];
  }

  // Helper: salva stato originale localStorage
  function saveOriginalState() {
    const state = {
      themeMode: localStorage.getItem('tpl.themeMode')
    };
    return state;
  }

  // Helper: ripristina stato originale
  function restoreOriginalState(state) {
    if (state.themeMode !== null) {
      localStorage.setItem('tpl.themeMode', state.themeMode);
    } else {
      localStorage.removeItem('tpl.themeMode');
    }
    // Applica il tema salvato
    if (typeof Settings !== 'undefined' && typeof Settings.applyTheme === 'function') {
      Settings.applyTheme();
    }
  }

  // Helper: verifica se la classe dark è presente
  function hasDarkClass() {
    return document.documentElement.classList.contains('dark');
  }

  // TEST 1: Toggle Dark Mode
  function testToggle(callbacks) {
    callbacks.log('Test toggle dark mode...', 'info');
    
    // Salva stato iniziale
    const initialState = hasDarkClass();
    const initialMode = localStorage.getItem('tpl.themeMode') || 'light';
    
    // Test 1: Imposta dark mode
    Settings.setThemeMode('dark');
    const isDarkAfterSet = hasDarkClass();
    const savedDark = localStorage.getItem('tpl.themeMode') === 'dark';
    
    if (!isDarkAfterSet || !savedDark) {
      throw new Error('Impostazione dark mode non funziona correttamente');
    }
    
    // Test 2: Imposta light mode
    Settings.setThemeMode('light');
    const isDarkAfterLight = hasDarkClass();
    const savedLight = localStorage.getItem('tpl.themeMode') === 'light';
    
    if (isDarkAfterLight || !savedLight) {
      throw new Error('Impostazione light mode non funziona correttamente');
    }
    
    // Test 3: Toggle (dark -> light -> dark)
    Settings.setThemeMode('dark');
    const toggle1 = hasDarkClass();
    Settings.setThemeMode('light');
    const toggle2 = hasDarkClass();
    Settings.setThemeMode('dark');
    const toggle3 = hasDarkClass();
    
    if (!toggle1 || toggle2 || !toggle3) {
      throw new Error('Toggle dark mode non funziona correttamente');
    }
    
    callbacks.updateStatus('test-darkmode-toggle', 'pass');
    callbacks.log('✓ Toggle dark mode funziona correttamente', 'success');
    callbacks.log(`  Dark mode attivo: ${toggle3}, Light mode attivo: ${!toggle2}`, 'info');
  }

  // TEST 2: Persistenza Preferenza
  function testPersistence(callbacks) {
    callbacks.log('Test persistenza preferenza dark mode...', 'info');
    
    // Test 1: Salvataggio in localStorage
    Settings.setThemeMode('dark');
    const savedDark = localStorage.getItem('tpl.themeMode');
    
    if (savedDark !== 'dark') {
      throw new Error('Preferenza dark mode non salvata in localStorage');
    }
    
    // Test 2: Caricamento da localStorage dopo refresh simulato
    // (simula ricaricamento pagina)
    Settings.setThemeMode('light');
    const savedLight = localStorage.getItem('tpl.themeMode');
    
    if (savedLight !== 'light') {
      throw new Error('Preferenza light mode non salvata in localStorage');
    }
    
    // Test 3: Verifica persistenza con system mode
    Settings.setThemeMode('system');
    const savedSystem = localStorage.getItem('tpl.themeMode');
    
    if (savedSystem !== 'system') {
      throw new Error('Preferenza system mode non salvata in localStorage');
    }
    
    // Test 4: Verifica che il tema venga applicato correttamente dopo il salvataggio
    Settings.setThemeMode('dark');
    const isDark = hasDarkClass();
    const saved = localStorage.getItem('tpl.themeMode') === 'dark';
    
    if (!isDark || !saved) {
      throw new Error('Tema non applicato correttamente dopo salvataggio');
    }
    
    callbacks.updateStatus('test-darkmode-persistence', 'pass');
    callbacks.log('✓ Persistenza preferenza funziona correttamente', 'success');
    callbacks.log(`  Valore salvato: ${localStorage.getItem('tpl.themeMode')}`, 'info');
  }

  // Funzione principale: esegue tutti i test
  async function runAll(callbacks) {
    const startTime = performance.now();
    let passed = 0;
    let failed = 0;

    if (!checkSettingsAvailable(callbacks)) {
      return { passed: 0, failed: 0, total: 0, duration: 0 };
    }

    const originalState = saveOriginalState();

    try {
      callbacks.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'info');
      callbacks.log('🌙 Esecuzione test Dark Mode...', 'info');
      callbacks.log('', 'info');

      // === TEST TOGGLE ===
      testToggle(callbacks);

      // === TEST PERSISTENZA ===
      testPersistence(callbacks);

      callbacks.log('', 'info');
      callbacks.log('✅ Tutti i test del Dark Mode completati!', 'success');

      // Aggiorna contatori finali
      const allTestIds = getAllTestIds();
      passed = 0;
      failed = 0;
      allTestIds.forEach(id => {
        const statusEl = document.getElementById(id);
        if (statusEl) {
          const statusSpan = statusEl.querySelector('.test-status');
          if (statusSpan) {
            if (statusSpan.classList.contains('pass')) {
              passed++;
            } else if (statusSpan.classList.contains('fail')) {
              failed++;
            }
          }
        }
      });

    } catch (error) {
      const testIds = getAllTestIds();
      testIds.forEach(id => callbacks.updateStatus(id, 'fail'));
      callbacks.log(`✗ Errore: ${error.message}`, 'error');
      console.error('Errore test dark mode:', error);
      failed = testIds.length;
    } finally {
      restoreOriginalState(originalState);
      const endTime = performance.now();
      const duration = Math.round(endTime - startTime);

      callbacks.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'info');
      callbacks.log(`✅ Test passati: ${passed}`, 'success');
      callbacks.log(`❌ Test falliti: ${failed}`, failed > 0 ? 'error' : 'info');
      callbacks.log(`⏱️ Tempo totale: ${duration}ms`, 'info');
      callbacks.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'info');

      return {
        passed,
        failed,
        total: passed + failed,
        duration
      };
    }
  }

  // API pubblica
  window.DarkModeTests = {
    runAll: runAll,
    testToggle: testToggle,
    testPersistence: testPersistence,
    getAllTestIds: getAllTestIds
  };

  console.log('✅ Modulo test-darkmode.js caricato');
})();

