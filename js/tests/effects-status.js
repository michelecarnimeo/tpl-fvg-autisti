/**
 * js/tests/effects-status.js
 *
 * Effects Status Module
 * Rileva e mostra lo status degli effetti CSS/JavaScript attivi nell'applicazione
 *
 * Funzionalità:
 * - Rileva 8 effetti CSS/JS (animazioni, glassmorphism, dark mode, responsive, PWA, accessibility)
 * - Mostra griglia di card con status di ogni effetto
 * - Aggiornamento automatico quando cambia dark mode o dimensione schermo
 * - Pulsante manuale per aggiornamento
 *
 * API Pubblica: window.EffectsStatus
 */

(function () {
  'use strict';

  /**
   * Crea una card effetto
   * @param {Object} effect - Oggetto effetto con icon, title, status, details
   * @returns {HTMLDivElement} Card elemento creato
   */
  function createEffectCard(effect) {
    const card = document.createElement('div');
    card.className = 'effect-card';

    // Header
    const header = document.createElement('div');
    header.className = 'effect-header';

    // Icona
    const icon = document.createElement('span');
    icon.className = 'effect-icon';
    icon.textContent = effect.icon;

    // Titolo
    const title = document.createElement('span');
    title.className = 'effect-title';
    title.textContent = effect.title;

    // Status
    const status = document.createElement('span');
    status.className = `effect-status ${effect.status}`;
    if (effect.status === 'active') {
      status.textContent = '✅ Attivo';
    } else if (effect.status === 'inactive') {
      status.textContent = '❌ Inattivo';
    } else {
      status.textContent = '⚠️ Condizionale';
    }

    header.appendChild(icon);
    header.appendChild(title);
    header.appendChild(status);

    // Dettagli
    const details = document.createElement('div');
    details.className = 'effect-details';
    details.textContent = effect.details;

    card.appendChild(header);
    card.appendChild(details);

    return card;
  }

  /**
   * Rileva gli effetti attivi
   * @returns {Array<Object>} Array di oggetti effetto
   */
  function detectEffects() {
    const isDarkMode = document.documentElement.classList.contains('dark');
    const isMobile = window.innerWidth <= 768;
    const hasAnimationSupport = 'animation' in document.documentElement.style;
    const hasBackdropFilter = CSS.supports('backdrop-filter', 'blur(10px)');
    const hasServiceWorker = 'serviceWorker' in navigator;

    return [
      {
        id: 'background-animation',
        icon: '🌈',
        title: 'Animazione Background',
        status: !isMobile ? 'active' : 'inactive',
        details: isMobile
          ? 'Disabilitata su mobile per performance'
          : 'Gradiente animato (20s) per desktop'
      },
      {
        id: 'glassmorphism',
        icon: '🔮',
        title: 'Effetto Glassmorphism',
        status: 'active',
        details: 'Backdrop-filter e trasparenze su tutte le card'
      },
      {
        id: 'light-refraction',
        icon: '✨',
        title: 'Rifrazione Luce',
        status: !isMobile ? 'active' : 'inactive',
        details: isMobile
          ? 'Disabilitata su mobile per performance'
          : 'Effetti luce su navbar, card e pulsanti'
      },
      {
        id: 'smooth-animations',
        icon: '🎭',
        title: 'Animazioni Fluide',
        status: hasAnimationSupport ? 'active' : 'inactive',
        details: 'Transizioni cubic-bezier su elementi interattivi'
      },
      {
        id: 'dark-mode',
        icon: isDarkMode ? '🌙' : '☀️',
        title: 'Modalità Scura',
        status: isDarkMode ? 'active' : 'inactive',
        details: isDarkMode
          ? 'Tema scuro attivo'
          : 'Tema chiaro attivo'
      },
      {
        id: 'responsive-design',
        icon: '📱',
        title: 'Design Responsive',
        status: 'active',
        details: `Layout ottimizzato per ${isMobile ? 'mobile' : 'desktop'}`
      },
      {
        id: 'pwa-features',
        icon: '⚙️',
        title: 'Funzionalità PWA',
        status: hasServiceWorker ? 'conditional' : 'inactive',
        details: hasServiceWorker
          ? 'Service Worker supportato'
          : 'Service Worker non supportato'
      },
      {
        id: 'accessibility',
        icon: '♿',
        title: 'Accessibilità',
        status: 'active',
        details: 'Font size regolabile, hamburger menu, keyboard navigation'
      }
    ];
  }

  /**
   * Aggiorna la griglia degli effetti
   */
  function updateEffectsStatus() {
    const effectsGrid = document.getElementById('effects-grid');
    if (!effectsGrid) {
      console.warn('⚠️ Elemento effects-grid non trovato');
      return;
    }

    // Rileva gli effetti
    const effects = detectEffects();

    // Svuota la griglia
    effectsGrid.textContent = '';

    // Crea e aggiungi le card
    effects.forEach(effect => {
      const card = createEffectCard(effect);
      effectsGrid.appendChild(card);
    });

    console.log('✅ Effects status aggiornato:', effects.length, 'effetti rilevati');
  }

  /**
   * Inizializza il modulo
   * - Aggiorna effetti al caricamento
   * - Aggiunge listener per dark mode toggle
   * - Aggiunge listener per resize
   */
  function init() {
    // Aggiorna effetti quando DOM è pronto
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        updateEffectsStatus();
        setupEventListeners();
      });
    } else {
      // DOM già caricato
      updateEffectsStatus();
      setupEventListeners();
    }
  }

  /**
   * Setup event listeners per aggiornamento automatico
   */
  function setupEventListeners() {
    // NOTE: darkModeToggle rimosso - pulsante legacy non più presente
    // Il cambio tema viene rilevato automaticamente tramite resize o aggiornamento manuale
    
    // Listener per resize (debounce per performance)
    let resizeTimeout;
    if (!window.effectsResizeListenerAdded) {
      window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
          updateEffectsStatus();
        }, 150);
      });
      window.effectsResizeListenerAdded = true;
    }
  }

  // API Pubblica
  window.EffectsStatus = {
    update: updateEffectsStatus,
    detect: detectEffects,
    init: init
  };

  // Mantieni retrocompatibilità con funzione globale
  window.updateEffectsStatus = updateEffectsStatus;

  console.log('✅ js/tests/effects-status.js caricato - EffectsStatus disponibile');

  /**
   * Inizializza event delegation per pulsante aggiorna status effetti
   */
  function initEffectsStatusEventDelegation() {
    // Verifica se il listener è già stato aggiunto
    if (document.body && document.body.dataset.effectsStatusDelegationAdded === 'true') {
      return;
    }

    // Funzione per aggiungere il listener
    const addListener = () => {
      if (document.body.dataset.effectsStatusDelegationAdded === 'true') {
        return;
      }

      // Event delegation: listener per pulsanti con data-action="update-effects-status"
      document.body.addEventListener('click', (e) => {
        const button = e.target.closest('[data-action="update-effects-status"]');
        
        if (button && button.classList.contains('test-button')) {
          e.preventDefault();
          e.stopPropagation();
          
          if (typeof window.updateEffectsStatus === 'function') {
            window.updateEffectsStatus();
          } else {
            console.error('❌ updateEffectsStatus non disponibile');
          }
        }
      });

      // Marca come inizializzato
      document.body.dataset.effectsStatusDelegationAdded = 'true';
      console.log('✅ Event delegation per update effects status inizializzata');
    };

    // Auto-inizializza event delegation quando il DOM è pronto
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', addListener);
    } else {
      addListener();
    }
  }

  // Auto-inizializza event delegation
  initEffectsStatusEventDelegation();

  // Auto-inizializza
  init();
})();

