/**
 * js/tests/gps/reset-data.js
 *
 * Gestione reset dati GPS
 * Cancellazione dati GPS da localStorage e reset stato
 *
 * Funzionalità:
 * - Modal conferma reset
 * - Cancellazione chiavi localStorage GPS
 * - Reset stato moduli GPS
 * - Ricarica pagina dopo reset
 *
 * API Pubblica: window.GPSResetData
 * Dipendenze: Nessuna
 */

(function () {
  'use strict';

  // Chiavi localStorage da cancellare durante reset
  const GPS_LOCALSTORAGE_KEYS = [
    'tpl.useFakePosition',
    'tpl.fakePositionData',
    'tpl.offlineTestMode'
  ];

  /**
   * Mostra modal conferma reset
   */
  function showResetModal() {
    const modal = document.getElementById('reset-modal-overlay');
    if (!modal) {
      console.warn('⚠️ Modal reset overlay non trovato');
      return;
    }

    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Previeni scroll durante modal
  }

  /**
   * Nasconde modal conferma reset
   */
  function hideResetModal() {
    const modal = document.getElementById('reset-modal-overlay');
    if (!modal) {
      console.warn('⚠️ Modal reset overlay non trovato');
      return;
    }

    modal.style.display = 'none';
    document.body.style.overflow = ''; // Ripristina scroll
  }

  /**
   * Reset dati GPS (senza modal)
   * @returns {boolean} true se reset completato, false altrimenti
   */
  function resetGPSData() {
    try {
      // Cancella chiavi localStorage
      GPS_LOCALSTORAGE_KEYS.forEach(key => {
        try {
          localStorage.removeItem(key);
          console.log(`🗑️ Rimossa chiave: ${key}`);
        } catch (error) {
          console.warn(`⚠️ Errore rimozione chiave ${key}:`, error);
        }
      });

      // Reset stato moduli GPS se disponibili
      if (typeof window.GPSFakePosition !== 'undefined' && window.GPSFakePosition.clear) {
        window.GPSFakePosition.clear();
      }

      if (typeof window.GPSWatchPosition !== 'undefined' && window.GPSWatchPosition.stop) {
        window.GPSWatchPosition.stop();
      }

      console.log('✅ Reset dati GPS completato');
      return true;
    } catch (error) {
      console.error('❌ Errore durante reset dati GPS:', error);
      return false;
    }
  }

  /**
   * Conferma e esegue reset GPS
   * @param {boolean} reloadPage - true per ricaricare pagina dopo reset (default: true)
   */
  function confirmResetGPS(reloadPage = true) {
    // Nascondi modal
    hideResetModal();

    const btn = document.getElementById('reset-gps-btn');
    const originalText = btn ? btn.innerHTML : '';

    // Mostra loading
    if (btn) {
      btn.innerHTML = '⏳ Reset...';
      btn.disabled = true;
    }

    // Esegui reset
    const success = resetGPSData();

    if (success) {
      // Feedback successo
      if (btn) {
        btn.innerHTML = '✅ Reset Completato!';
        btn.style.background = '#10b981';
      }

      // Ricarica pagina dopo 1.5 secondi (se richiesto)
      if (reloadPage) {
        setTimeout(() => {
          location.reload();
        }, 1500);
      } else {
        // Ripristina pulsante dopo 2 secondi senza ricaricare
        setTimeout(() => {
          if (btn) {
            btn.innerHTML = originalText;
            btn.disabled = false;
            btn.style.background = '';
          }
        }, 2000);
      }
    } else {
      // Errore
      if (btn) {
        btn.innerHTML = '❌ Errore Reset';
        btn.style.background = '#ef4444';
        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.disabled = false;
          btn.style.background = '';
        }, 2000);
      }
    }
  }

  /**
   * Setup event listeners per reset
   */
  function setupResetData() {
    // Pulsante reset GPS
    const resetGpsBtn = document.getElementById('reset-gps-btn');
    if (resetGpsBtn) {
      resetGpsBtn.addEventListener('click', showResetModal);
    }

    // Pulsanti modal reset
    const resetModalCancel = document.getElementById('reset-modal-cancel');
    if (resetModalCancel) {
      resetModalCancel.addEventListener('click', hideResetModal);
    }

    const resetModalConfirm = document.getElementById('reset-modal-confirm');
    if (resetModalConfirm) {
      resetModalConfirm.addEventListener('click', () => confirmResetGPS(true));
    }

    // Chiudi modal cliccando fuori (sull'overlay)
    const modal = document.getElementById('reset-modal-overlay');
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          hideResetModal();
        }
      });
    }

    // Chiudi modal con ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const modal = document.getElementById('reset-modal-overlay');
        if (modal && modal.style.display === 'block') {
          hideResetModal();
        }
      }
    });
  }

  // API Pubblica
  window.GPSResetData = {
    setup: setupResetData,
    showModal: showResetModal,
    hideModal: hideResetModal,
    confirm: confirmResetGPS,
    reset: resetGPSData,
    getKeys: () => [...GPS_LOCALSTORAGE_KEYS] // Copia array per sicurezza
  };

  console.log('✅ js/tests/gps/reset-data.js caricato - GPSResetData disponibile');

  // Auto-inizializza se DOM è già caricato
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setupResetData();
    });
  } else {
    // DOM già caricato
    setupResetData();
  }

})();

