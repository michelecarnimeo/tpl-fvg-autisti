/**
 * js/components/hamburger-menu.js
 *
 * Hamburger Menu Module
 * Gestisce il menu mobile hamburger (comune a tutte le pagine)
 *
 * Funzionalità:
 * - Toggle apertura/chiusura menu mobile
 * - Gestione overlay
 * - Chiusura con ESC
 * - Chiusura al click su link
 * - Integrazione con dark mode toggle
 * - Integrazione con Updates (verifica aggiornamenti)
 *
 * API Pubblica: window.HamburgerMenu
 *
 * Dipendenze:
 * - toggleDark() (funzione globale da script.js)
 * - Updates.checkForUpdates() (modulo js/features/updates.js)
 */

(function () {
  'use strict';

  /**
   * Inizializza il modulo hamburger menu
   * Gestisce correttamente il DOM ready state
   */
  function init() {
    const hamburgerToggle = document.getElementById('hamburger-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    const mobileMenuClose = document.getElementById('mobile-menu-close');
    const mobileDarkmodeToggle = document.getElementById('mobile-darkmode-toggle');
    const mobileVersionCard = document.getElementById('mobile-version-card');

    // Verifica elementi essenziali
    // Se gli elementi non esistono, la pagina non ha il menu mobile - esci silenziosamente
    if (!hamburgerToggle || !mobileMenu || !mobileMenuOverlay) {
      // Non loggare warning - è normale che alcune pagine non abbiano il menu mobile
      return false;
    }

    /**
     * Apri menu mobile
     */
    function openMenu() {
      console.log('🔓 Apertura menu hamburger...');
      hamburgerToggle.classList.add('active');
      mobileMenu.classList.add('active');
      mobileMenuOverlay.classList.add('active');
      document.body.style.overflow = 'hidden'; // Blocca scroll
      console.log('✅ Menu hamburger aperto - overlay active:', mobileMenuOverlay.classList.contains('active'));
    }

    /**
     * Chiudi menu mobile
     */
    function closeMenu() {
      hamburgerToggle.classList.remove('active');
      mobileMenu.classList.remove('active');
      mobileMenuOverlay.classList.remove('active');
      document.body.style.overflow = ''; // Ripristina scroll
    }

    // Click su hamburger toggle
    hamburgerToggle.addEventListener('click', () => {
      if (mobileMenu.classList.contains('active')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Click su X per chiudere
    if (mobileMenuClose) {
      mobileMenuClose.addEventListener('click', closeMenu);
    }

    // Click su overlay per chiudere
    mobileMenuOverlay.addEventListener('click', closeMenu);

    // Chiudi menu quando si clicca su un link
    // Supporta sia .mobile-nav-link che .mobile-menu-link
    // Escludi il pulsante Impostazioni che ha comportamento speciale (apre modal)
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link:not(#open-settings), .mobile-menu-link');
    mobileNavLinks.forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    // Dark mode toggle da menu mobile
    if (mobileDarkmodeToggle) {
      mobileDarkmodeToggle.addEventListener('click', () => {
        // Usa toggleDark() se disponibile (funzione globale da script.js)
        if (typeof toggleDark === 'function') {
          toggleDark();
        } else {
          console.warn('⚠️ Hamburger Menu: toggleDark() non disponibile');
        }
        closeMenu();
      });
    }

    // Mini card versione (apre modale Verifica Aggiornamenti)
    if (mobileVersionCard) {
      mobileVersionCard.addEventListener('click', () => {
        // Usa Updates.checkForUpdates() se disponibile
        if (typeof Updates !== 'undefined' && typeof Updates.checkForUpdates === 'function') {
          Updates.checkForUpdates();
        } else if (typeof checkForUpdates === 'function') {
          // Fallback per compatibilità
          checkForUpdates();
        } else {
          console.error('❌ Hamburger Menu: Updates.checkForUpdates non disponibile');
        }
        closeMenu();
      });
    }

    // Chiudi menu con ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
        closeMenu();
      }
    });

    console.log('✅ Hamburger Menu inizializzato');
    return true;
  }

  // Gestione DOM ready state
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    // DOM già pronto, inizializza immediatamente
    init();
  }

  // API Pubblica
  window.HamburgerMenu = {
    init: init,
    open: function() {
      const mobileMenu = document.getElementById('mobile-menu');
      const hamburgerToggle = document.getElementById('hamburger-toggle');
      const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
      if (mobileMenu && hamburgerToggle && mobileMenuOverlay) {
        hamburgerToggle.classList.add('active');
        mobileMenu.classList.add('active');
        mobileMenuOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    },
    close: function() {
      const mobileMenu = document.getElementById('mobile-menu');
      const hamburgerToggle = document.getElementById('hamburger-toggle');
      const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
      if (mobileMenu && hamburgerToggle && mobileMenuOverlay) {
        hamburgerToggle.classList.remove('active');
        mobileMenu.classList.remove('active');
        mobileMenuOverlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    },
    isOpen: function() {
      const mobileMenu = document.getElementById('mobile-menu');
      return mobileMenu ? mobileMenu.classList.contains('active') : false;
    }
  };

  console.log('✅ js/components/hamburger-menu.js caricato - HamburgerMenu disponibile');
})();

