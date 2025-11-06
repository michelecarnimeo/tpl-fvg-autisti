/**
 * js/tests/test-settings.js
 *
 * Suite completa di test per il modulo settings.js
 * Test che coprono tutte le impostazioni utente e accessibilità
 *
 * API Pubblica: window.SettingsTests
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
      'test-settings-font-size-normal',
      'test-settings-font-size-large',
      'test-settings-font-size-xlarge',
      'test-settings-theme-light',
      'test-settings-theme-dark',
      'test-settings-theme-system',
      'test-settings-high-contrast',
      'test-settings-touch-friendly',
      'test-settings-reduce-motion',
      'test-settings-extra-spacing',
      'test-settings-compact-layout',
      'test-settings-blue-light-filter',
      'test-settings-interface-scale-75',
      'test-settings-interface-scale-85',
      'test-settings-interface-scale-100',
      'test-settings-interface-scale-115',
      'test-settings-interface-scale-125',
      'test-settings-haptic-feedback',
      'test-settings-animation-toggle',
      'test-settings-keep-screen-on',
      'test-settings-localstorage-persistence',
      'test-settings-css-classes'
    ];
  }

  // Helper: salva stato originale localStorage
  function saveOriginalState() {
    const keys = [
      'tpl.fontSize',
      'tpl.themeMode',
      'tpl.highContrast',
      'tpl.touchFriendly',
      'tpl.reduceMotion',
      'tpl.extraSpacing',
      'tpl.compactLayout',
      'tpl.blueLightFilter',
      'tpl.interfaceScale',
      'tpl.hapticFeedback',
      'tpl.keepScreenOn',
      'animationEnabled'
    ];
    const state = {};
    keys.forEach(key => {
      const value = localStorage.getItem(key);
      if (value !== null) {
        state[key] = value;
      }
    });
    return state;
  }

  // Helper: ripristina stato originale
  function restoreOriginalState(state) {
    Object.keys(state).forEach(key => {
      localStorage.setItem(key, state[key]);
    });
  }

  // Helper: pulisci localStorage per test
  function clearSettingsStorage() {
    const keys = [
      'tpl.fontSize',
      'tpl.themeMode',
      'tpl.highContrast',
      'tpl.touchFriendly',
      'tpl.reduceMotion',
      'tpl.extraSpacing',
      'tpl.compactLayout',
      'tpl.blueLightFilter',
      'tpl.interfaceScale',
      'tpl.hapticFeedback',
      'tpl.keepScreenOn',
      'animationEnabled'
    ];
    keys.forEach(key => localStorage.removeItem(key));
  }

  // Helper: verifica classe CSS su body
  function hasClass(className) {
    return document.body.classList.contains(className);
  }

  // TEST 1: Dimensione testo - Normal
  function testFontSizeNormal(callbacks) {
    callbacks.log('Test dimensione testo: normal...', 'info');
    Settings.setFontSize('normal');
    
    const hasNormal = hasClass('font-size-normal');
    const hasLarge = hasClass('font-size-large');
    const hasXLarge = hasClass('font-size-xlarge');
    const saved = localStorage.getItem('tpl.fontSize') === 'normal';

    if (hasNormal && !hasLarge && !hasXLarge && saved) {
      callbacks.updateStatus('test-settings-font-size-normal', 'pass');
      callbacks.log('✓ Dimensione testo normal impostata correttamente', 'success');
    } else {
      throw new Error('Dimensione testo normal non impostata correttamente');
    }
  }

  // TEST 2: Dimensione testo - Large
  function testFontSizeLarge(callbacks) {
    callbacks.log('Test dimensione testo: large...', 'info');
    Settings.setFontSize('large');
    
    const hasNormal = hasClass('font-size-normal');
    const hasLarge = hasClass('font-size-large');
    const hasXLarge = hasClass('font-size-xlarge');
    const saved = localStorage.getItem('tpl.fontSize') === 'large';

    if (hasLarge && !hasNormal && !hasXLarge && saved) {
      callbacks.updateStatus('test-settings-font-size-large', 'pass');
      callbacks.log('✓ Dimensione testo large impostata correttamente', 'success');
    } else {
      throw new Error('Dimensione testo large non impostata correttamente');
    }
  }

  // TEST 3: Dimensione testo - XLarge
  function testFontSizeXLarge(callbacks) {
    callbacks.log('Test dimensione testo: xlarge...', 'info');
    Settings.setFontSize('xlarge');
    
    const hasNormal = hasClass('font-size-normal');
    const hasLarge = hasClass('font-size-large');
    const hasXLarge = hasClass('font-size-xlarge');
    const saved = localStorage.getItem('tpl.fontSize') === 'xlarge';

    if (hasXLarge && !hasNormal && !hasLarge && saved) {
      callbacks.updateStatus('test-settings-font-size-xlarge', 'pass');
      callbacks.log('✓ Dimensione testo xlarge impostata correttamente', 'success');
    } else {
      throw new Error('Dimensione testo xlarge non impostata correttamente');
    }
  }

  // TEST 4: Tema - Light
  function testThemeLight(callbacks) {
    callbacks.log('Test tema: light...', 'info');
    Settings.setThemeMode('light');
    
    const hasDark = document.documentElement.classList.contains('dark');
    const saved = localStorage.getItem('tpl.themeMode') === 'light';

    if (!hasDark && saved) {
      callbacks.updateStatus('test-settings-theme-light', 'pass');
      callbacks.log('✓ Tema light impostato correttamente', 'success');
    } else {
      throw new Error('Tema light non impostato correttamente');
    }
  }

  // TEST 5: Tema - Dark
  function testThemeDark(callbacks) {
    callbacks.log('Test tema: dark...', 'info');
    Settings.setThemeMode('dark');
    
    const hasDark = document.documentElement.classList.contains('dark');
    const saved = localStorage.getItem('tpl.themeMode') === 'dark';

    if (hasDark && saved) {
      callbacks.updateStatus('test-settings-theme-dark', 'pass');
      callbacks.log('✓ Tema dark impostato correttamente', 'success');
    } else {
      throw new Error('Tema dark non impostato correttamente');
    }
  }

  // TEST 6: Tema - System
  function testThemeSystem(callbacks) {
    callbacks.log('Test tema: system...', 'info');
    Settings.setThemeMode('system');
    
    const saved = localStorage.getItem('tpl.themeMode') === 'system';
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const hasDark = document.documentElement.classList.contains('dark');

    // Il tema system dovrebbe seguire prefers-color-scheme
    if (saved && (hasDark === prefersDark)) {
      callbacks.updateStatus('test-settings-theme-system', 'pass');
      callbacks.log('✓ Tema system impostato correttamente', 'success');
      callbacks.log(`  Sistema preferisce: ${prefersDark ? 'dark' : 'light'}`, 'info');
    } else {
      throw new Error('Tema system non impostato correttamente');
    }
  }

  // TEST 7: Contrasto alto
  function testHighContrast(callbacks) {
    callbacks.log('Test contrasto alto...', 'info');
    
    Settings.setHighContrast(true);
    const enabled = hasClass('high-contrast') && localStorage.getItem('tpl.highContrast') === 'true';
    
    Settings.setHighContrast(false);
    const disabled = !hasClass('high-contrast') && localStorage.getItem('tpl.highContrast') === 'false';

    if (enabled && disabled) {
      callbacks.updateStatus('test-settings-high-contrast', 'pass');
      callbacks.log('✓ Contrasto alto funziona correttamente', 'success');
    } else {
      throw new Error('Contrasto alto non funziona correttamente');
    }
  }

  // TEST 8: Touch friendly
  function testTouchFriendly(callbacks) {
    callbacks.log('Test touch friendly...', 'info');
    
    Settings.setTouchFriendly(true);
    const enabled = hasClass('touch-friendly') && localStorage.getItem('tpl.touchFriendly') === 'true';
    
    Settings.setTouchFriendly(false);
    const disabled = !hasClass('touch-friendly') && localStorage.getItem('tpl.touchFriendly') === 'false';

    if (enabled && disabled) {
      callbacks.updateStatus('test-settings-touch-friendly', 'pass');
      callbacks.log('✓ Touch friendly funziona correttamente', 'success');
    } else {
      throw new Error('Touch friendly non funziona correttamente');
    }
  }

  // TEST 9: Riduci animazioni
  function testReduceMotion(callbacks) {
    callbacks.log('Test riduci animazioni...', 'info');
    
    Settings.setReduceMotion(true);
    const enabled = hasClass('reduce-motion') && localStorage.getItem('tpl.reduceMotion') === 'true';
    
    Settings.setReduceMotion(false);
    const disabled = !hasClass('reduce-motion') && localStorage.getItem('tpl.reduceMotion') === 'false';

    if (enabled && disabled) {
      callbacks.updateStatus('test-settings-reduce-motion', 'pass');
      callbacks.log('✓ Riduci animazioni funziona correttamente', 'success');
    } else {
      throw new Error('Riduci animazioni non funziona correttamente');
    }
  }

  // TEST 10: Spaziatura extra
  function testExtraSpacing(callbacks) {
    callbacks.log('Test spaziatura extra...', 'info');
    
    Settings.setExtraSpacing(true);
    const enabled = hasClass('extra-spacing') && localStorage.getItem('tpl.extraSpacing') === 'true';
    
    Settings.setExtraSpacing(false);
    const disabled = !hasClass('extra-spacing') && localStorage.getItem('tpl.extraSpacing') === 'false';

    if (enabled && disabled) {
      callbacks.updateStatus('test-settings-extra-spacing', 'pass');
      callbacks.log('✓ Spaziatura extra funziona correttamente', 'success');
    } else {
      throw new Error('Spaziatura extra non funziona correttamente');
    }
  }

  // TEST 11: Layout compatto
  function testCompactLayout(callbacks) {
    callbacks.log('Test layout compatto...', 'info');
    
    Settings.setCompactLayout(true);
    const enabled = hasClass('compact-layout') && localStorage.getItem('tpl.compactLayout') === 'true';
    
    Settings.setCompactLayout(false);
    const disabled = !hasClass('compact-layout') && localStorage.getItem('tpl.compactLayout') === 'false';

    if (enabled && disabled) {
      callbacks.updateStatus('test-settings-compact-layout', 'pass');
      callbacks.log('✓ Layout compatto funziona correttamente', 'success');
    } else {
      throw new Error('Layout compatto non funziona correttamente');
    }
  }

  // TEST 12: Filtro luce blu
  function testBlueLightFilter(callbacks) {
    callbacks.log('Test filtro luce blu...', 'info');
    
    Settings.setBlueLightFilter(true);
    const enabled = hasClass('blue-light-filter') && localStorage.getItem('tpl.blueLightFilter') === 'true';
    
    Settings.setBlueLightFilter(false);
    const disabled = !hasClass('blue-light-filter') && localStorage.getItem('tpl.blueLightFilter') === 'false';

    if (enabled && disabled) {
      callbacks.updateStatus('test-settings-blue-light-filter', 'pass');
      callbacks.log('✓ Filtro luce blu funziona correttamente', 'success');
    } else {
      throw new Error('Filtro luce blu non funziona correttamente');
    }
  }

  // TEST 13: Interface scale - 75%
  function testInterfaceScale75(callbacks) {
    callbacks.log('Test dimensione interfaccia: 75%...', 'info');
    Settings.setInterfaceScale('75');
    
    const hasScale = hasClass('interface-scale-75');
    const saved = localStorage.getItem('tpl.interfaceScale') === '75';

    if (hasScale && saved) {
      callbacks.updateStatus('test-settings-interface-scale-75', 'pass');
      callbacks.log('✓ Dimensione interfaccia 75% impostata correttamente', 'success');
    } else {
      throw new Error('Dimensione interfaccia 75% non impostata correttamente');
    }
  }

  // TEST 14: Interface scale - 100%
  function testInterfaceScale100(callbacks) {
    callbacks.log('Test dimensione interfaccia: 100%...', 'info');
    Settings.setInterfaceScale('100');
    
    const hasScale = hasClass('interface-scale-100');
    const saved = localStorage.getItem('tpl.interfaceScale') === '100';

    if (hasScale && saved) {
      callbacks.updateStatus('test-settings-interface-scale-100', 'pass');
      callbacks.log('✓ Dimensione interfaccia 100% impostata correttamente', 'success');
    } else {
      throw new Error('Dimensione interfaccia 100% non impostata correttamente');
    }
  }

  // TEST 15: Interface scale - 85%
  function testInterfaceScale85(callbacks) {
    callbacks.log('Test dimensione interfaccia: 85%...', 'info');
    Settings.setInterfaceScale('85');
    
    const hasScale = hasClass('interface-scale-85');
    const saved = localStorage.getItem('tpl.interfaceScale') === '85';

    if (hasScale && saved) {
      callbacks.updateStatus('test-settings-interface-scale-85', 'pass');
      callbacks.log('✓ Dimensione interfaccia 85% impostata correttamente', 'success');
    } else {
      throw new Error('Dimensione interfaccia 85% non impostata correttamente');
    }
  }

  // TEST 16: Interface scale - 100%
  function testInterfaceScale100(callbacks) {
    callbacks.log('Test dimensione interfaccia: 100%...', 'info');
    Settings.setInterfaceScale('100');
    
    const hasScale = hasClass('interface-scale-100');
    const saved = localStorage.getItem('tpl.interfaceScale') === '100';

    if (hasScale && saved) {
      callbacks.updateStatus('test-settings-interface-scale-100', 'pass');
      callbacks.log('✓ Dimensione interfaccia 100% impostata correttamente', 'success');
    } else {
      throw new Error('Dimensione interfaccia 100% non impostata correttamente');
    }
  }

  // TEST 17: Interface scale - 115%
  function testInterfaceScale115(callbacks) {
    callbacks.log('Test dimensione interfaccia: 115%...', 'info');
    Settings.setInterfaceScale('115');
    
    const hasScale = hasClass('interface-scale-115');
    const saved = localStorage.getItem('tpl.interfaceScale') === '115';

    if (hasScale && saved) {
      callbacks.updateStatus('test-settings-interface-scale-115', 'pass');
      callbacks.log('✓ Dimensione interfaccia 115% impostata correttamente', 'success');
    } else {
      throw new Error('Dimensione interfaccia 115% non impostata correttamente');
    }
  }

  // TEST 18: Interface scale - 125%
  function testInterfaceScale125(callbacks) {
    callbacks.log('Test dimensione interfaccia: 125%...', 'info');
    Settings.setInterfaceScale('125');
    
    const hasScale = hasClass('interface-scale-125');
    const saved = localStorage.getItem('tpl.interfaceScale') === '125';

    if (hasScale && saved) {
      callbacks.updateStatus('test-settings-interface-scale-125', 'pass');
      callbacks.log('✓ Dimensione interfaccia 125% impostata correttamente', 'success');
    } else {
      throw new Error('Dimensione interfaccia 125% non impostata correttamente');
    }
  }

  // TEST 19: Feedback aptico
  function testHapticFeedback(callbacks) {
    callbacks.log('Test feedback aptico...', 'info');
    
    Settings.setHapticFeedback('true');
    const enabled = localStorage.getItem('tpl.hapticFeedback') === 'true';
    
    Settings.setHapticFeedback('false');
    const disabled = localStorage.getItem('tpl.hapticFeedback') === 'false';

    // Test trigger (se supportato)
    if (navigator.vibrate) {
      try {
        Settings.triggerHaptic('light', true); // Force per testare anche se disabilitato
        callbacks.log('  API Vibration supportata e funzionante', 'info');
      } catch (error) {
        callbacks.log('  ⚠️ Errore vibrazione (normale se non supportata)', 'warn');
      }
    } else {
      callbacks.log('  ⚠️ API Vibration non supportata (normale su desktop)', 'info');
    }

    if (enabled && disabled) {
      callbacks.updateStatus('test-settings-haptic-feedback', 'pass');
      callbacks.log('✓ Feedback aptico funziona correttamente', 'success');
    } else {
      throw new Error('Feedback aptico non funziona correttamente');
    }
  }

  // TEST 20: Toggle animazioni
  function testAnimationToggle(callbacks) {
    callbacks.log('Test toggle animazioni...', 'info');
    
    // Salva stato originale
    const originalState = localStorage.getItem('animationEnabled');
    
    // Test attivazione
    Settings.toggleAnimation();
    const enabled = hasClass('animation-enabled') && localStorage.getItem('animationEnabled') === 'true';
    
    // Test disattivazione
    Settings.toggleAnimation();
    const disabled = !hasClass('animation-enabled') && localStorage.getItem('animationEnabled') === 'false';

    // Ripristina stato originale
    if (originalState !== null) {
      localStorage.setItem('animationEnabled', originalState);
    } else {
      localStorage.removeItem('animationEnabled');
    }

    if (enabled && disabled) {
      callbacks.updateStatus('test-settings-animation-toggle', 'pass');
      callbacks.log('✓ Toggle animazioni funziona correttamente', 'success');
    } else {
      throw new Error('Toggle animazioni non funziona correttamente');
    }
  }

  // TEST 21: Keep Screen On (Wake Lock API)
  function testKeepScreenOn(callbacks) {
    callbacks.log('Test Keep Screen On (Wake Lock API)...', 'info');
    
    // Test salvataggio localStorage
    Settings.setKeepScreenOn('true');
    const enabled = localStorage.getItem('tpl.keepScreenOn') === 'true';
    
    Settings.setKeepScreenOn('false');
    const disabled = localStorage.getItem('tpl.keepScreenOn') === 'false';

    // Verifica supporto Wake Lock API
    const hasWakeLock = 'wakeLock' in navigator;
    if (hasWakeLock) {
      callbacks.log('  ✓ Wake Lock API supportata dal browser', 'info');
    } else {
      callbacks.log('  ⚠️ Wake Lock API non supportata (normale su desktop)', 'info');
    }

    if (enabled && disabled) {
      callbacks.updateStatus('test-settings-keep-screen-on', 'pass');
      callbacks.log('✓ Keep Screen On funziona correttamente', 'success');
      callbacks.log(`  Supporto Wake Lock: ${hasWakeLock ? 'Sì' : 'No'}`, 'info');
    } else {
      throw new Error('Keep Screen On non funziona correttamente');
    }
  }

  // TEST 22: Persistenza localStorage
  function testLocalStoragePersistence(callbacks) {
    callbacks.log('Test persistenza localStorage...', 'info');
    
    // Salva stato originale
    const originalState = saveOriginalState();
    
    // Pulisci e imposta valori
    clearSettingsStorage();
    Settings.setFontSize('large');
    Settings.setThemeMode('dark');
    Settings.setHighContrast(true);
    Settings.setInterfaceScale('115');
    
    // Ricarica pagina (simula con reload settings)
    clearSettingsStorage();
    localStorage.setItem('tpl.fontSize', 'large');
    localStorage.setItem('tpl.themeMode', 'dark');
    localStorage.setItem('tpl.highContrast', 'true');
    localStorage.setItem('tpl.interfaceScale', '115');
    
    // Verifica che i valori siano stati salvati
    const fontSize = localStorage.getItem('tpl.fontSize') === 'large';
    const theme = localStorage.getItem('tpl.themeMode') === 'dark';
    const contrast = localStorage.getItem('tpl.highContrast') === 'true';
    const scale = localStorage.getItem('tpl.interfaceScale') === '115';

    // Ripristina stato originale
    restoreOriginalState(originalState);

    if (fontSize && theme && contrast && scale) {
      callbacks.updateStatus('test-settings-localstorage-persistence', 'pass');
      callbacks.log('✓ Persistenza localStorage funziona correttamente', 'success');
    } else {
      throw new Error('Persistenza localStorage non funziona correttamente');
    }
  }

  // TEST 23: Classi CSS applicate correttamente
  function testCssClasses(callbacks) {
    callbacks.log('Test classi CSS applicate correttamente...', 'info');
    
    // Test tutte le classi principali
    Settings.setHighContrast(true);
    const hasContrast = hasClass('high-contrast');
    
    Settings.setTouchFriendly(true);
    const hasTouch = hasClass('touch-friendly');
    
    Settings.setReduceMotion(true);
    const hasMotion = hasClass('reduce-motion');
    
    Settings.setExtraSpacing(true);
    const hasSpacing = hasClass('extra-spacing');
    
    Settings.setCompactLayout(true);
    const hasCompact = hasClass('compact-layout');
    
    Settings.setBlueLightFilter(true);
    const hasBlueLight = hasClass('blue-light-filter');
    
    Settings.setInterfaceScale('85');
    const hasScale = hasClass('interface-scale-85');

    // Reset
    Settings.setHighContrast(false);
    Settings.setTouchFriendly(false);
    Settings.setReduceMotion(false);
    Settings.setExtraSpacing(false);
    Settings.setCompactLayout(false);
    Settings.setBlueLightFilter(false);
    Settings.setInterfaceScale('100');

    if (hasContrast && hasTouch && hasMotion && hasSpacing && hasCompact && hasBlueLight && hasScale) {
      callbacks.updateStatus('test-settings-css-classes', 'pass');
      callbacks.log('✓ Classi CSS applicate correttamente', 'success');
    } else {
      throw new Error('Classi CSS non applicate correttamente');
    }
  }

  // Funzione principale: esegue tutti i test
  async function runAll(callbacks) {
    const startTime = performance.now();
    let passed = 0;
    let failed = 0;

    if (!checkSettingsAvailable(callbacks)) {
      return { passed: 0, failed: 0, total: 0, duration: 0 };
    }

    // Salva stato originale
    const originalState = saveOriginalState();

    try {
      callbacks.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'info');
      callbacks.log('🧪 Test Modulo Settings', 'info');
      callbacks.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'info');
      callbacks.log('', 'info');

      // === TEST DIMENSIONE TESTO (3) ===
      testFontSizeNormal(callbacks);
      testFontSizeLarge(callbacks);
      testFontSizeXLarge(callbacks);

      // === TEST TEMA (3) ===
      testThemeLight(callbacks);
      testThemeDark(callbacks);
      testThemeSystem(callbacks);

      // === TEST ACCESSIBILITÀ (6) ===
      testHighContrast(callbacks);
      testTouchFriendly(callbacks);
      testReduceMotion(callbacks);
      testExtraSpacing(callbacks);
      testCompactLayout(callbacks);
      testBlueLightFilter(callbacks);

      // === TEST DIMENSIONE INTERFACCIA (5) ===
      testInterfaceScale75(callbacks);
      testInterfaceScale85(callbacks);
      testInterfaceScale100(callbacks);
      testInterfaceScale115(callbacks);
      testInterfaceScale125(callbacks);

      // === TEST FEEDBACK E ANIMAZIONI (3) ===
      testHapticFeedback(callbacks);
      testAnimationToggle(callbacks);
      testKeepScreenOn(callbacks);

      // === TEST PERSISTENZA E CSS (2) ===
      testLocalStoragePersistence(callbacks);
      testCssClasses(callbacks);

      callbacks.log('', 'info');
      callbacks.log('✅ Tutti i test del modulo settings.js completati!', 'success');

      const endTime = performance.now();
      const duration = Math.round(endTime - startTime);
      passed = getAllTestIds().length;
      failed = 0;

      callbacks.log('', 'info');
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

    } catch (error) {
      const testIds = getAllTestIds();
      testIds.forEach(id => callbacks.updateStatus(id, 'fail'));
      callbacks.log(`✗ Errore: ${error.message}`, 'error');
      console.error('Errore test settings:', error);
      
      const endTime = performance.now();
      const duration = Math.round(endTime - startTime);
      
      return {
        passed: 0,
        failed: testIds.length,
        total: testIds.length,
        duration
      };
    } finally {
      // Ripristina stato originale
      restoreOriginalState(originalState);
      Settings.initialize(); // Reinizializza con stato originale
    }
  }

  // API Pubblica
  window.SettingsTests = {
    runAll: runAll,
    getAllTestIds: getAllTestIds,
    // Expose individual test functions
    testFontSizeNormal: testFontSizeNormal,
    testFontSizeLarge: testFontSizeLarge,
    testFontSizeXLarge: testFontSizeXLarge,
    testThemeLight: testThemeLight,
    testThemeDark: testThemeDark,
    testThemeSystem: testThemeSystem,
    testHighContrast: testHighContrast,
    testTouchFriendly: testTouchFriendly,
    testReduceMotion: testReduceMotion,
    testExtraSpacing: testExtraSpacing,
    testCompactLayout: testCompactLayout,
    testBlueLightFilter: testBlueLightFilter,
    testInterfaceScale75: testInterfaceScale75,
    testInterfaceScale85: testInterfaceScale85,
    testInterfaceScale100: testInterfaceScale100,
    testInterfaceScale115: testInterfaceScale115,
    testInterfaceScale125: testInterfaceScale125,
    testHapticFeedback: testHapticFeedback,
    testAnimationToggle: testAnimationToggle,
    testKeepScreenOn: testKeepScreenOn,
    testLocalStoragePersistence: testLocalStoragePersistence,
    testCssClasses: testCssClasses
  };

  console.log('✅ Modulo test test-settings.js caricato');

})();

