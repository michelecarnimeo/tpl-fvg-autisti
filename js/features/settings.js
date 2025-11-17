// js/features/settings.js - Gestione logica impostazioni applicazione
// Indipendente da script.js e modals.js - espone API pubblica

(function () {
  'use strict';

  // ========================================
  // STORAGE HELPER
  // ========================================
  // Usa Storage se disponibile, altrimenti fallback su localStorage
  const Storage = window.Storage || {
    getItem: (key, defaultValue = null) => {
      try {
        const item = localStorage.getItem(key);
        return item !== null ? item : defaultValue;
      } catch {
        return defaultValue;
      }
    },
    setItem: (key, value) => {
      try {
        localStorage.setItem(key, value);
        return true;
      } catch {
        return false;
      }
    },
    removeItem: (key) => {
      try {
        localStorage.removeItem(key);
        return true;
      } catch {
        return false;
      }
    }
  };

  // ========================================
  // FEEDBACK APTICO (VIBRAZIONE)
  // ========================================

  // Pattern di vibrazione predefiniti
  const HAPTIC_PATTERNS = {
    light: 20,           // Micro feedback (tap generico)
    medium: 50,          // Feedback standard (selezione)
    strong: 100,        // Feedback importante (successo)
    success: [100, 50, 100], // Pattern successo
    warning: [50, 30, 50],   // Pattern avviso
    error: 200           // Vibrazione lunga (errore)
  };

  /**
   * Funzione principale per feedback aptico
   * @param {string|Array} pattern - Pattern di vibrazione ('light', 'medium', 'strong', 'success', 'warning', 'error' o array personalizzato)
   * @param {boolean} force - Se true, vibra anche se disabilitato
   */
  function triggerHaptic(pattern = 'light', force = false) {
    // Verifica se il feedback aptico è abilitato (o se forzato)
    const isEnabled = Storage.getItem('tpl.hapticFeedback') === 'true';
    if (!isEnabled && !force) return;

    // Verifica supporto API Vibration
    if (!navigator.vibrate) {
      console.log('⚠️ API Vibration non supportata');
      return;
    }

    // Ottieni il pattern
    const vibrationPattern = HAPTIC_PATTERNS[pattern] || pattern;

    try {
      navigator.vibrate(vibrationPattern);
      console.log(`📳 Vibrazione: ${pattern}${force ? ' (forced)' : ''}`);
    } catch (error) {
      console.error('❌ Errore vibrazione:', error);
    }
  }

  // ========================================
  // ANIMAZIONE SFONDO
  // ========================================

  let animationEnabled = false;

  function toggleAnimation() {
    console.log('Toggle animation clicked, current state:', animationEnabled);
    animationEnabled = !animationEnabled;

    if (animationEnabled) {
      document.body.classList.add('animation-enabled');
      console.log('Animation enabled, class added to body');
      // Aggiorna tutti i pulsanti
      document.querySelectorAll('.animation-toggle, #mobile-animation-toggle').forEach(btn => {
        btn.classList.add('active');
      });
    } else {
      document.body.classList.remove('animation-enabled');
      console.log('Animation disabled, class removed from body');
      // Aggiorna tutti i pulsanti
      document.querySelectorAll('.animation-toggle, #mobile-animation-toggle').forEach(btn => {
        btn.classList.remove('active');
      });
    }

    // Salva la preferenza
    Storage.setItem('animationEnabled', String(animationEnabled));
    console.log('Animation state saved:', animationEnabled);
  }

  // Carica la preferenza salvata
  function loadAnimationPreference() {
    const saved = Storage.getItem('animationEnabled');
    if (saved === 'true') {
      animationEnabled = true;
      document.body.classList.add('animation-enabled');
      document.querySelectorAll('.animation-toggle, #mobile-animation-toggle').forEach(btn => {
        btn.classList.add('active');
      });
    }
  }

  // ========================================
  // DIMENSIONE TESTO
  // ========================================

  // Livelli di dimensione testo
  const fontSizeLevels = ['normal', 'large', 'xlarge'];
  let currentFontSizeIndex = 0;

  /**
   * Imposta la dimensione del testo
   * @param {string} level - Livello: 'normal', 'large', 'xlarge'
   */
  function setFontSize(level) {
    // Rimuovi tutte le classi di dimensione testo
    document.body.classList.remove('font-size-normal', 'font-size-large', 'font-size-xlarge');

    // Aggiungi la nuova classe
    document.body.classList.add(`font-size-${level}`);

    // Salva preferenza usando Storage
    Storage.setItem('tpl.fontSize', level);

    // Aggiorna il pulsante
    updateFontSizeButton(level);

    // Aggiorna il testo nel menu mobile
    updateMobileFontSizeText(level);
  }

  // Funzione per aggiornare i pulsanti (stato attivo)
  function updateFontSizeButton(level) {
    // NOTE: pulsanti legacy .font-size-btn rimossi - ora gestiti solo dal dropdown e mobile
    // Aggiorna pulsanti mobile
    const mobileButtons = document.querySelectorAll('.mobile-font-btn');
    mobileButtons.forEach(btn => {
      if (btn.dataset.size === level) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Aggiorna pulsanti benvenuto
    const benvenutoButtons = document.querySelectorAll('.benvenuto-font-btn');
    benvenutoButtons.forEach(btn => {
      if (btn.dataset.size === level) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  // Funzione per aggiornare il testo nel menu mobile (deprecata, mantenuta per compatibilità)
  function updateMobileFontSizeText(level) {
    // Non più necessaria con i nuovi pulsanti separati
  }

  // Inizializza dimensione testo usando Storage
  function initFontSize() {
    try {
      const savedFontSize = Storage.getItem('tpl.fontSize');
      if (savedFontSize && fontSizeLevels.includes(savedFontSize)) {
        currentFontSizeIndex = fontSizeLevels.indexOf(savedFontSize);
        setFontSize(savedFontSize);
      } else {
        setFontSize('normal');
      }
    } catch {
      setFontSize('normal');
    }
  }

  // ========================================
  // TEMA (DARK MODE)
  // ========================================

  // Media query per rilevare tema sistema
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

  // NOTE: darkModeToggle rimosso - pulsante legacy non più presente nell'HTML

  /**
   * Imposta il tema (system, light, dark)
   * @param {string} mode - Modalità tema: 'system', 'light', 'dark'
   */
  function setThemeMode(mode) {
    Storage.setItem('tpl.themeMode', mode);
    applyTheme();
    console.log('Tema impostato su:', mode);
    triggerHaptic('medium'); // Feedback al cambio tema
  }

  function applyTheme() {
    const mode = Storage.getItem('tpl.themeMode') || 'system';
    let shouldBeDark = false;

    if (mode === 'system') {
      shouldBeDark = prefersDarkScheme.matches;
    } else if (mode === 'dark') {
      shouldBeDark = true;
    } else {
      shouldBeDark = false;
    }

    // Applica il tema
    document.documentElement.classList.toggle('dark', shouldBeDark);
    updateBodyColors(shouldBeDark);
    updateMobileDarkModeButton(shouldBeDark);
    // NOTE: updateToggleIcon() rimosso - pulsante legacy non più presente
  }

  function updateBodyColors(isDark) {
    const body = document.body;
    if (isDark) {
      body.className = body.className.replace(/bg-background-light|text-foreground-light/g, '') + ' bg-background-dark text-foreground-dark';
    } else {
      body.className = body.className.replace(/bg-background-dark|text-foreground-dark/g, '') + ' bg-background-light text-foreground-light';
    }
  }

  // Funzione per aggiornare il pulsante mobile dark mode
  function updateMobileDarkModeButton(isDark) {
    const mobileBtn = document.getElementById('mobile-darkmode-toggle');
    if (!mobileBtn) return;

    const icon = mobileBtn.querySelector('.mobile-nav-icon');
    const text = mobileBtn.querySelector('span:not(.mobile-nav-icon)');

    if (icon) {
      icon.textContent = isDark ? '☀️' : '🌙';
    }

    if (text) {
      text.textContent = isDark ? 'Modalità chiara' : 'Modalità scura';
    }
  }

  function loadTheme() {
    applyTheme();

    // Listener per cambio tema sistema
    prefersDarkScheme.addEventListener('change', () => {
      const mode = Storage.getItem('tpl.themeMode') || 'system';
      if (mode === 'system') {
        applyTheme();
      }
    });
  }

  // ========================================
  // CONTRASTO ALTO
  // ========================================

  function setHighContrast(enabled) {
    if (enabled) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }

    Storage.setItem('tpl.highContrast', String(enabled));

    console.log('Contrasto alto:', enabled ? 'attivato' : 'disattivato');
    triggerHaptic('medium'); // Feedback al cambio contrasto
  }

  function loadHighContrast() {
    const saved = Storage.getItem('tpl.highContrast');
    if (saved === 'true') {
      setHighContrast(true);
    }
  }

  // ========================================
  // TOUCH FRIENDLY
  // ========================================

  function setTouchFriendly(enabled) {
    if (enabled) {
      document.body.classList.add('touch-friendly');
    } else {
      document.body.classList.remove('touch-friendly');
    }

    Storage.setItem('tpl.touchFriendly', String(enabled));

    console.log('Touch friendly:', enabled ? 'attivato' : 'disattivato');
    triggerHaptic('medium'); // Feedback al cambio modalità touch
  }

  function loadTouchFriendly() {
    const saved = Storage.getItem('tpl.touchFriendly');
    if (saved === 'true') {
      setTouchFriendly(true);
    }
  }

  // ========================================
  // FEEDBACK APTICO
  // ========================================

  function setHapticFeedback(enabled) {
    if (Storage.setItem('tpl.hapticFeedback', String(enabled))) {
      console.log('Feedback aptico:', enabled ? 'attivato' : 'disattivato');
    } else {
      console.error('Errore salvataggio haptic feedback');
    }
  }

  function loadHapticFeedback() {
    const saved = Storage.getItem('tpl.hapticFeedback');
    // Nota: non impostiamo una classe CSS, il feedback è gestito via JavaScript
    if (saved === 'true') {
      console.log('✅ Feedback aptico caricato: attivo');
    }
  }

  // ========================================
  // RIDUCI ANIMAZIONI
  // ========================================

  function setReduceMotion(enabled) {
    if (enabled) {
      document.body.classList.add('reduce-motion');
    } else {
      document.body.classList.remove('reduce-motion');
    }

    Storage.setItem('tpl.reduceMotion', String(enabled));

    console.log('Riduci animazioni:', enabled ? 'attivato' : 'disattivato');
  }

  function loadReduceMotion() {
    const saved = Storage.getItem('tpl.reduceMotion');
    if (saved === 'true') {
      setReduceMotion(true);
    }
  }

  // ========================================
  // SPAZIATURA EXTRA
  // ========================================

  function setExtraSpacing(enabled) {
    if (enabled) {
      document.body.classList.add('extra-spacing');
    } else {
      document.body.classList.remove('extra-spacing');
    }

    Storage.setItem('tpl.extraSpacing', String(enabled));

    console.log('Spaziatura extra:', enabled ? 'attivata' : 'disattivata');
  }

  function loadExtraSpacing() {
    const saved = Storage.getItem('tpl.extraSpacing');
    if (saved === 'true') {
      setExtraSpacing(true);
    }
  }

  // ========================================
  // LAYOUT COMPATTO
  // ========================================

  function setCompactLayout(enabled) {
    if (enabled) {
      document.body.classList.add('compact-layout');
    } else {
      document.body.classList.remove('compact-layout');
    }

    Storage.setItem('tpl.compactLayout', String(enabled));

    console.log('Layout compatto:', enabled ? 'attivato' : 'disattivato');
  }

  function loadCompactLayout() {
    const saved = Storage.getItem('tpl.compactLayout');
    if (saved === 'true') {
      setCompactLayout(true);
    }
  }

  // ========================================
  // FILTRO LUCE BLU
  // ========================================

  function setBlueLightFilter(enabled) {
    if (enabled) {
      document.body.classList.add('blue-light-filter');
    } else {
      document.body.classList.remove('blue-light-filter');
    }

    Storage.setItem('tpl.blueLightFilter', String(enabled));

    console.log('Filtro luce blu:', enabled ? 'attivato' : 'disattivato');
  }

  function loadBlueLightFilter() {
    const saved = Storage.getItem('tpl.blueLightFilter');
    if (saved === 'true') {
      setBlueLightFilter(true);
    }
  }

  // ========================================
  // DIMENSIONE INTERFACCIA
  // ========================================

  const VALID_INTERFACE_SCALES = ['75', '85', '100', '115', '125'];
  const DEFAULT_INTERFACE_SCALE = '100';

  function setInterfaceScale(scale) {
    const targetScale = VALID_INTERFACE_SCALES.includes(scale) ? scale : DEFAULT_INTERFACE_SCALE;

    if (window.InterfaceScale && typeof window.InterfaceScale.applyScale === 'function') {
      window.InterfaceScale.applyScale(targetScale);
    } else {
      document.documentElement.classList.remove('scale-75', 'scale-85', 'scale-100', 'scale-115', 'scale-125');
      document.body.classList.remove('interface-scale-75', 'interface-scale-85', 'interface-scale-100', 'interface-scale-115', 'interface-scale-125');
      document.documentElement.classList.add(`scale-${targetScale}`);
      document.body.classList.add(`interface-scale-${targetScale}`);
    }

    Storage.setItem('tpl.interfaceScale', targetScale);

    console.log('Dimensione interfaccia:', targetScale + '%');
    triggerHaptic('medium'); // Feedback al cambio dimensione
  }

  function loadInterfaceScale() {
    const saved = Storage.getItem('tpl.interfaceScale');
    const scale = saved || DEFAULT_INTERFACE_SCALE; // Default 100%
    setInterfaceScale(scale);
  }

  // ========================================
  // KEEP SCREEN ON (WAKE LOCK API)
  // ========================================

  // Variabile globale per tracciare il WakeLock
  let wakeLock = null;

  async function setKeepScreenOn(enabled) {
    // Salva preferenza usando Storage
    Storage.setItem('tpl.keepScreenOn', String(enabled));

    if (!('wakeLock' in navigator)) {
      console.warn('⚠️ Wake Lock API non supportata da questo browser');
      return;
    }

    if (enabled) {
      await requestWakeLock();
    } else {
      await releaseWakeLock();
    }
  }

  async function requestWakeLock() {
    try {
      wakeLock = await navigator.wakeLock.request('screen');
      console.log('☀️ Wake Lock attivato - schermo sempre acceso');

      // Listener per quando il lock viene rilasciato
      wakeLock.addEventListener('release', () => {
        console.log('☀️ Wake Lock rilasciato');
      });
    } catch (err) {
      console.error('❌ Errore richiesta Wake Lock:', err);
    }
  }

  async function releaseWakeLock() {
    if (wakeLock !== null) {
      try {
        await wakeLock.release();
        wakeLock = null;
        console.log('☀️ Wake Lock disattivato - schermo può spegnersi');
      } catch (err) {
        console.error('❌ Errore rilascio Wake Lock:', err);
      }
    }
  }

  function loadKeepScreenOn() {
    const saved = Storage.getItem('tpl.keepScreenOn');
    if (saved === 'true') {
      setKeepScreenOn(true);
    }
  }

  // Gestione visibilità pagina (background/foreground)
  // Quando la pagina va in background, il Wake Lock viene automaticamente rilasciato
  // Quando torna in foreground, lo riattiviamo se era abilitato
  document.addEventListener('visibilitychange', async () => {
    const isEnabled = Storage.getItem('tpl.keepScreenOn') === 'true';

    if (document.visibilityState === 'visible' && isEnabled) {
      // Pagina tornata visibile e Keep Screen On è attivo
      await requestWakeLock();
    }
  });

  // ========================================
  // INIZIALIZZAZIONE
  // ========================================

  /**
   * Carica tutte le impostazioni salvate all'avvio
   */
  function initializeSettings() {
    loadTheme();
    loadHighContrast();
    loadTouchFriendly();
    loadHapticFeedback();
    loadReduceMotion();
    loadKeepScreenOn();
    loadExtraSpacing();
    loadCompactLayout();
    loadBlueLightFilter();
    loadInterfaceScale();
    loadAnimationPreference();
    initFontSize();

    console.log('✅ Impostazioni inizializzate');
  }

  // Carica le impostazioni quando il DOM è pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeSettings);
  } else {
    // DOM già pronto
    initializeSettings();
  }

  // ========================================
  // ESPORTAZIONE PUBBLICA
  // ========================================

  window.Settings = {
    // Feedback aptico
    triggerHaptic: triggerHaptic,

    // Animazione
    toggleAnimation: toggleAnimation,

    // Dimensione testo
    setFontSize: setFontSize,
    initFontSize: initFontSize,

    // Tema
    setThemeMode: setThemeMode,
    toggleDark: function() {
      // Determina il nuovo tema basandosi sullo stato attuale
      const isCurrentlyDark = document.documentElement.classList.contains('dark');
      const newMode = isCurrentlyDark ? 'light' : 'dark';
      setThemeMode(newMode);
    },
    applyTheme: applyTheme,
    updateBodyColors: updateBodyColors,
    // NOTE: updateToggleIcon rimosso - pulsante legacy non più presente
    updateMobileDarkModeButton: updateMobileDarkModeButton,

    // Accessibilità
    setHighContrast: setHighContrast,
    setTouchFriendly: setTouchFriendly,
    setHapticFeedback: setHapticFeedback,
    setReduceMotion: setReduceMotion,
    setKeepScreenOn: setKeepScreenOn,
    setExtraSpacing: setExtraSpacing,
    setCompactLayout: setCompactLayout,
    setBlueLightFilter: setBlueLightFilter,
    setInterfaceScale: setInterfaceScale,

    // Inizializzazione
    initialize: initializeSettings
  };

  console.log('✅ js/features/settings.js caricato');

})();

