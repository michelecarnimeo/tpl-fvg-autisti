/**
 * ========================================
 * TEST ALL WRAPPERS
 * Wrapper function per eseguire tutti i test
 * ========================================
 * 
 * Questo file definisce la funzione globale runAllTests()
 * che esegue tutti i test disponibili in sequenza.
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
   * Esegue tutti i test disponibili in sequenza
   */
  window.runAllTests = async function() {
    console.log('Esecuzione di tutti i test...');
    
    try {
      // Test Database
      if (typeof testDatabaseLoad === 'function') {
        await testDatabaseLoad();
        await new Promise(resolve => setTimeout(resolve, 500));
      } else {
        console.warn('⚠️ testDatabaseLoad non disponibile');
      }

      // Test Storage
      if (typeof testStorage === 'function') {
        await testStorage();
        await new Promise(resolve => setTimeout(resolve, 500));
      } else {
        console.warn('⚠️ testStorage non disponibile');
      }

      // Test Dark Mode
      if (typeof testDarkMode === 'function') {
        testDarkMode();
        await new Promise(resolve => setTimeout(resolve, 500));
      } else {
        console.warn('⚠️ testDarkMode non disponibile');
      }

      // Test Prezzi
      if (typeof testPriceCalculation === 'function') {
        await testPriceCalculation();
        await new Promise(resolve => setTimeout(resolve, 500));
      } else {
        console.warn('⚠️ testPriceCalculation non disponibile');
      }

      // Test Settings
      if (typeof testSettings === 'function') {
        await testSettings();
        await new Promise(resolve => setTimeout(resolve, 500));
      } else {
        console.warn('⚠️ testSettings non disponibile');
      }

      // Test Service Worker
      if (typeof testServiceWorker === 'function') {
        await testServiceWorker();
        await new Promise(resolve => setTimeout(resolve, 500));
      } else {
        console.warn('⚠️ testServiceWorker non disponibile');
      }

      // Test UI Components
      if (typeof testUIComponents === 'function') {
        await testUIComponents();
        await new Promise(resolve => setTimeout(resolve, 500));
      } else {
        console.warn('⚠️ testUIComponents non disponibile');
      }

      console.log('✅ Tutti i test completati!');
    } catch (error) {
      console.error('❌ Errore durante esecuzione test:', error);
    }
  };

  /**
   * Inizializza event delegation per pulsante "Esegui tutti i test"
   */
  function initRunAllEventDelegation() {
    // Verifica se il listener è già stato aggiunto
    if (document.body && document.body.dataset.runAllDelegationAdded === 'true') {
      return;
    }

    // Funzione per aggiungere il listener
    const addListener = () => {
      if (document.body.dataset.runAllDelegationAdded === 'true') {
        return;
      }

      // Event delegation: listener per pulsanti con data-test="run-all"
      document.body.addEventListener('click', (e) => {
        const button = e.target.closest('[data-test="run-all"]');
        
        if (button && (button.classList.contains('run-all-btn') || button.classList.contains('test-button'))) {
          e.preventDefault();
          e.stopPropagation();
          
          if (typeof window.runAllTests === 'function') {
            window.runAllTests();
          } else {
            console.error('❌ runAllTests non disponibile');
          }
        }
      });

      // Marca come inizializzato
      document.body.dataset.runAllDelegationAdded = 'true';
      console.log('✅ Event delegation per "Esegui tutti i test" inizializzata');
    };

    // Auto-inizializza event delegation quando il DOM è pronto
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', addListener);
    } else {
      addListener();
    }
  }

  // Auto-inizializza event delegation
  initRunAllEventDelegation();

  console.log('✅ js/tests/test-all-wrappers.js caricato - Funzione runAllTests disponibile nello scope globale');

})();

