/**
 * 📱 Fermate Accordion - Mobile/PWA
 * 
 * Gestione accordion per card fermate su dispositivi mobile e PWA.
 * - Toggle apertura/chiusura
 * - Badge contatore fermate
 * - Icona rotazione smooth
 * - Animazioni fluide
 * 
 * @version 1.0.0
 * @date 17 Novembre 2025
 */

(function() {
  'use strict';

  /**
   * Verifica se siamo in modalità mobile/PWA
   * @returns {boolean}
   */
  function isMobileMode() {
    return window.innerWidth <= 768 || 
           window.matchMedia('(display-mode: standalone)').matches;
  }

  // Mantieni riferimento ai listener per poterli rimuovere
  const cardListeners = new WeakMap();

  /**
   * Inizializza accordion per card fermate
   */
  function initAccordion() {
    if (!isMobileMode()) {
      console.log('🖥️ Desktop mode: accordion disabilitato');
      return;
    }

    console.log('📱 Mobile/PWA mode: inizializzazione accordion');

    const cards = document.querySelectorAll('.fermate-card');
    
    cards.forEach((card, index) => {
      const header = card.querySelector('.fermate-card-header');
      const headerTitle = card.querySelector('h3');
      const list = card.querySelector('.fermate-list');
      
      if (!header || !headerTitle || !list) return;

      // Rimuovi listener precedente se esiste
      const previousListener = cardListeners.get(card);
      if (previousListener) {
        headerTitle.removeEventListener('click', previousListener);
        cardListeners.delete(card);
      }

      // Aggiungi classe collapsed inizialmente
      card.classList.add('collapsed');
      
      // Conta le fermate
      const fermateCount = list.querySelectorAll('.fermate-item').length;
      
      // Aggiungi attributo data-count per badge
      headerTitle.setAttribute('data-count', fermateCount);
      
      // Aggiungi icona toggle se non esiste
      if (!headerTitle.querySelector('.fermate-toggle-icon')) {
        const toggleIcon = document.createElement('span');
        toggleIcon.className = 'fermate-toggle-icon';
        toggleIcon.textContent = '▼';
        headerTitle.appendChild(toggleIcon);
      }
      
      // Crea nuovo listener e salvalo (solo sul titolo, non sul pulsante)
      const clickHandler = function(e) {
        // Non toggleare se il click è sul pulsante "Inverti"
        if (e.target.closest('.direction-toggle-btn')) {
          return;
        }
        toggleCard(card);
      };
      headerTitle.addEventListener('click', clickHandler);
      cardListeners.set(card, clickHandler);
      
      console.log(`✅ Accordion inizializzato per card ${index + 1}: ${fermateCount} fermate`);
    });
  }

  /**
   * Toggle apertura/chiusura card
   * @param {HTMLElement} card - Card da toggleare
   */
  function toggleCard(card) {
    const isExpanded = card.classList.contains('expanded');
    
    if (isExpanded) {
      // Chiudi
      card.classList.remove('expanded');
      card.classList.add('collapsed');
      console.log('📂 Card chiusa');
    } else {
      // Apri
      card.classList.remove('collapsed');
      card.classList.add('expanded');
      console.log('📂 Card aperta');
    }
    
    // Trigger haptic feedback se disponibile
    if (window.Settings && typeof window.Settings.triggerHaptic === 'function') {
      window.Settings.triggerHaptic('light');
    }
  }

  /**
   * Resetta accordion su resize
   */
  function handleResize() {
    const cards = document.querySelectorAll('.fermate-card');
    
    if (isMobileMode()) {
      // Mobile: assicura che le classi accordion siano presenti
      cards.forEach(card => {
        if (!card.classList.contains('collapsed') && !card.classList.contains('expanded')) {
          card.classList.add('collapsed');
        }
      });
    } else {
      // Desktop: rimuovi classi accordion
      cards.forEach(card => {
        card.classList.remove('collapsed', 'expanded');
        const toggleIcon = card.querySelector('.fermate-toggle-icon');
        if (toggleIcon) {
          toggleIcon.remove();
        }
      });
    }
  }

  /**
   * Re-inizializza accordion dopo rendering fermate
   */
  function reinitAccordion() {
    console.log('🔄 Re-inizializzazione accordion...');
    
    // Rimuovi vecchi listener (non necessario, le card vengono ricreate)
    initAccordion();
  }

  // Inizializza quando il DOM è pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAccordion);
  } else {
    initAccordion();
  }

  // Listener per resize (con throttling)
  let resizeTimeout;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(handleResize, 300);
  });

  // Listener per rendering fermate (custom event)
  window.addEventListener('fermateRendered', reinitAccordion);

  // API pubblica
  window.FermateAccordion = {
    init: initAccordion,
    reinit: reinitAccordion,
    toggleCard: toggleCard,
    isMobileMode: isMobileMode
  };

  console.log('📱 FermateAccordion module loaded');
})();

