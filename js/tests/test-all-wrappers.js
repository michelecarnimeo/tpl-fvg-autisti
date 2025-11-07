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

  console.log('✅ js/tests/test-all-wrappers.js caricato - Funzione runAllTests disponibile nello scope globale');

})();

