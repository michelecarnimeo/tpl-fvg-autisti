/**
 * UI Helpers - Funzioni utility per gestione UI
 * Modulo isolato per funzioni di interfaccia utente
 */

(function () {
  'use strict';

  /**
   * Scroll smooth alla cima della pagina
   */
  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  /**
   * Mostra/nascondi il pulsante "torna su" in base allo scroll
   */
  function toggleScrollToTopButton() {
    const scrollButton = document.querySelector('.scroll-to-top');
    if (scrollButton) {
      if (window.pageYOffset > 300) {
        scrollButton.classList.add('visible');
      } else {
        scrollButton.classList.remove('visible');
      }
    }
  }

  /**
   * Mostra/nascondi il pulsante swap (inversione partenza/arrivo)
   * @param {boolean} show - true per mostrare, false per nascondere
   */
  function toggleSwapButton(show) {
    const swapBtn = document.getElementById('swap-btn');
    if (swapBtn) {
      swapBtn.style.display = show ? 'flex' : 'none';
    }
  }

  /**
   * Inizializza gli event listeners per UI helpers
   */
  function init() {
    // Event listener per lo scroll (mostra/nascondi pulsante "torna su")
    window.addEventListener('scroll', toggleScrollToTopButton);

    // Verifica iniziale al caricamento
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', toggleScrollToTopButton);
    } else {
      toggleScrollToTopButton();
    }

    // Event listener per il click sul pulsante scroll-to-top
    const scrollToTopButtons = document.querySelectorAll('.scroll-to-top');
    scrollToTopButtons.forEach(button => {
      // Aggiungi listener solo se non è già stato aggiunto
      if (!button.hasAttribute('data-listener-added')) {
        button.setAttribute('data-listener-added', 'true');
        button.addEventListener('click', scrollToTop);
      }
    });
  }

  // API pubblica
  window.UIHelpers = {
    scrollToTop: scrollToTop,
    toggleScrollToTopButton: toggleScrollToTopButton,
    toggleSwapButton: toggleSwapButton,
    init: init
  };

  // Espone funzioni globali per retrocompatibilità (onclick nell'HTML e altri moduli)
  window.scrollToTop = scrollToTop;
  window.toggleScrollToTopButton = toggleScrollToTopButton;
  window.toggleSwapButton = toggleSwapButton;

  // Inizializza immediatamente se il DOM è già pronto
  // Altrimenti aspetta DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  console.log('✅ Modulo ui-helpers.js caricato');
})();

