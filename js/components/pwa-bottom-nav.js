/**
 * js/components/pwa-bottom-nav.js
 *
 * PWA Bottom Navigation Module
 * Gestisce la barra di navigazione inferiore e brand header in modalità PWA
 *
 * Funzionalità:
 * - Mostra/nascondi bottom nav e brand header in base a modalità PWA
 * - Evidenzia tab attiva in base alla pagina corrente
 * - Gestione pulsante impostazioni in bottom nav
 * - Scroll progress bar nel brand header
 * - Gestione simulazione offline globale (per test)
 * - Listener per cambio modalità test PWA
 * - Pulsante verifica aggiornamenti (PWA Update Check Button)
 *
 * API Pubblica: window.PWABottomNav
 *
 * Dipendenze:
 * - window.Storage (da js/core/storage.js)
 * - window.SettingsModal (da js/components/modals.js)
 * - window.Updates (da js/features/updates.js)
 */

(function () {
  'use strict';

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

  /**
   * Verifica se siamo in modalità PWA (standalone)
   * @returns {boolean} true se è in modalità PWA
   */
  function isStandalone() {
    // Controlla se è attiva la modalità test
    // Nota: Storage.getItem può restituire booleano (se salvato come JSON) o stringa
    const pwaTestModeValue = Storage.getItem('tpl.pwaTestMode');
    const isTestMode = pwaTestModeValue === 'true' || pwaTestModeValue === true;
    if (isTestMode) {
      return true; // Forza modalità PWA per testing
    }

    // Controlla la modalità reale PWA
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true
    );
  }

  /**
   * Inizializza il modulo PWA Bottom Navigation
   */
  function init() {
    const bottomNav = document.getElementById('pwa-bottom-nav');
    const brandHeader = document.getElementById('pwa-brand-header');
    if (!bottomNav && !brandHeader) {
      console.log('ℹ️ PWA Bottom Navigation: Elementi non trovati in questa pagina');
      return false;
    }

    /**
     * Mostra/nasconde PWA elements (brand header + bottom nav)
     */
    function toggleBottomNav() {
      const isPWA = isStandalone();

      if (isPWA) {
        if (brandHeader) {
          brandHeader.style.display = 'flex';
          brandHeader.classList.add('show');
        }
        if (bottomNav) {
          bottomNav.style.display = 'flex';
          bottomNav.classList.add('show');
        }
        document.body.classList.add('pwa-mode');
        console.log('📱 PWA Mode: ATTIVA (Brand Header + Bottom Nav)');
      } else {
        if (brandHeader) {
          brandHeader.style.display = 'none';
          brandHeader.classList.remove('show');
        }
        if (bottomNav) {
          bottomNav.style.display = 'none';
          bottomNav.classList.remove('show');
        }
        document.body.classList.remove('pwa-mode');
        console.log('🌐 PWA Mode: nascosta (modalità browser)');
      }
    }

    /**
     * Evidenzia la tab attiva in base alla pagina corrente
     */
    function highlightActiveTab() {
      if (!bottomNav) return;

      const currentPage = window.location.pathname.split('/').pop() || 'index.html';
      const items = bottomNav.querySelectorAll('.pwa-nav-item');

      items.forEach(item => {
        item.classList.remove('active');

        const page = item.getAttribute('data-page');
        if (
          (page === 'home' && (currentPage === 'index.html' || currentPage === '')) ||
          (page === 'fermate' && currentPage === 'fermate.html') ||
          (page === 'prezzi' && currentPage === 'prezzi.html')
        ) {
          item.classList.add('active');
        }
      });
    }

    /**
     * Gestisce il click sul pulsante impostazioni
     */
    function setupSettingsButton() {
      const settingsBtn = document.getElementById('pwa-settings-btn');
      
      // Il modal potrebbe non essere ancora caricato (viene caricato dinamicamente)
      if (!settingsBtn) {
        return; // Pulsante non trovato, esci silenziosamente
      }

      // Rimuovi listener precedenti se esistono
      const newBtn = settingsBtn.cloneNode(true);
      settingsBtn.parentNode.replaceChild(newBtn, settingsBtn);

      // Aggiungi listener che usa SettingsModal.open() se disponibile (metodo preferito)
      newBtn.addEventListener('click', async function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        console.log('⚙️ Click su pulsante impostazioni PWA!');
        
        // Prova prima con SettingsModal.open() (metodo preferito - gestisce tutto correttamente)
        if (typeof window.SettingsModal !== 'undefined' && 
            typeof window.SettingsModal.open === 'function') {
          console.log('✅ Usando SettingsModal.open()');
          try {
            await window.SettingsModal.open();
            return;
          } catch (error) {
            console.error('❌ Errore nell\'apertura del modal con SettingsModal.open():', error);
            // Continua con il fallback
          }
        }
        
        // Fallback: prova a caricare e aprire il modal manualmente
        const settingsModal = document.getElementById('settings-modal');
        
        if (!settingsModal) {
          // Se il modal non esiste, prova a caricarlo dinamicamente
          console.log('📥 Modal non trovato, tentativo di caricamento...');
          
          // Prova a chiamare loadHTML se disponibile
          if (typeof window.SettingsModal !== 'undefined' && 
              typeof window.SettingsModal.loadHTML === 'function') {
            try {
              await window.SettingsModal.loadHTML();
              // Dopo il caricamento, riprova ad aprire usando open()
              if (typeof window.SettingsModal.open === 'function') {
                await window.SettingsModal.open();
                return;
              }
            } catch (error) {
              console.error('❌ Errore nel caricamento del modal:', error);
            }
          }
          
          console.warn('⚠️ Modal impostazioni non trovato e impossibile caricarlo.');
          return;
        }

        // Se il modal esiste, aprilo direttamente
        console.log('✅ Apertura modal esistente');
        settingsModal.style.display = 'flex';
        setTimeout(function() {
          settingsModal.classList.add('show');
          console.log('✅ Modal impostazioni aperto', {
            display: settingsModal.style.display,
            classList: settingsModal.classList.toString()
          });
        }, 10);
      });
    }

    /**
     * Inizializza la scroll progress bar nel brand header
     */
    function initScrollProgress() {
      if (!brandHeader) return;

      function updateScrollProgress() {
        // Calcola la percentuale di scroll
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercentage = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

        // Aggiorna la larghezza della barra ::after tramite CSS custom property
        brandHeader.style.setProperty('--scroll-progress', scrollPercentage + '%');
      }

      // Listener per lo scroll
      window.addEventListener('scroll', updateScrollProgress, { passive: true });

      // Inizializza al caricamento
      updateScrollProgress();
    }

    /**
     * Inizializza il pulsante verifica aggiornamenti
     */
    function initPWAUpdateButton() {
      const updateBtn = document.getElementById('pwa-cache-reset');
      if (!updateBtn) return;

      updateBtn.addEventListener('click', function () {
        console.log('🔄 Pulsante PWA Update cliccato');

        // Chiudi il modal Impostazioni prima
        if (typeof window.SettingsModal !== 'undefined' && window.SettingsModal.close) {
          window.SettingsModal.close();
        }

        // Aspetta un attimo e poi verifica aggiornamenti
        setTimeout(() => {
          if (typeof window.Updates !== 'undefined' && typeof window.Updates.checkForUpdates === 'function') {
            console.log('✅ Chiamata a Updates.checkForUpdates()');
            window.Updates.checkForUpdates();
          } else if (typeof checkForUpdates === 'function') {
            // Fallback per compatibilità
            console.log('✅ Chiamata a checkForUpdates() (fallback)');
            checkForUpdates();
          } else {
            console.error('❌ Updates.checkForUpdates non è disponibile');
          }
        }, 400);
      });
    }

    /**
     * Gestisce la simulazione offline globale (per test)
     */
    function initOfflineTestMode() {
      const isOfflineTestMode = Storage.getItem('tpl.offlineTestMode') === 'true';

      if (isOfflineTestMode) {
        console.log('🔴 Modalità offline test attiva - triggering evento offline');
        // Trigger evento offline al caricamento della pagina
        setTimeout(() => {
          window.dispatchEvent(new Event('offline'));
        }, 100);
      }

      // Listener per cambio stato offline test mode
      window.addEventListener('storage', (e) => {
        if (e.key === 'tpl.offlineTestMode') {
          const isOffline = e.newValue === 'true';
          console.log('🌐 Modalità offline test cambiata:', isOffline ? 'OFFLINE' : 'ONLINE');

          if (isOffline) {
            window.dispatchEvent(new Event('offline'));
          } else {
            window.dispatchEvent(new Event('online'));
          }
        }
      });
    }

    // Inizializza tutte le funzionalità
    toggleBottomNav();
    highlightActiveTab();
    setupSettingsButton();
    initScrollProgress();
    initPWAUpdateButton();
    initOfflineTestMode();

    // Listener per cambio modalità test (da localStorage)
    window.addEventListener('storage', (e) => {
      if (e.key === 'tpl.pwaTestMode') {
        console.log('🧪 Modalità test PWA cambiata:', e.newValue);
        toggleBottomNav();
      }
    });

    // Listener per aggiornamenti forzati (da test.html)
    window.addEventListener('pwaTestModeChanged', () => {
      console.log('🧪 Evento pwaTestModeChanged ricevuto');
      toggleBottomNav();
    });

    // Espone funzioni pubbliche
    window.PWABottomNav = {
      toggle: toggleBottomNav,
      highlightActiveTab: highlightActiveTab,
      refresh: function() {
        toggleBottomNav();
        highlightActiveTab();
      }
    };

    // Retrocompatibilità: espone funzione refresh globale per la pagina test
    window.refreshPWABottomNav = function () {
      toggleBottomNav();
      highlightActiveTab();
    };

    console.log('✅ PWA Bottom Navigation inizializzato');
    return true;
  }

  // Gestione DOM ready state
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    // DOM già pronto, inizializza immediatamente
    init();
  }
})();

