/**
 * ========================================
 * COMPONENTE: MODAL NOTIFICA
 * Gestione modale per messaggi di notifica/conferma
 * ========================================
 * 
 * Questo componente gestisce un modale riutilizzabile per mostrare
 * messaggi di notifica, conferme e informazioni all'utente.
 * 
 * @version 1.0.0
 * @date 2025-11-06
 */

(function () {
  'use strict';

  // ===== VARIABILI PRIVATE =====
  let notificationModal = null;
  let notificationTitle = null;
  let notificationMessage = null;
  let notificationOk = null;
  let isInitialized = false;

  // ===== FUNZIONI PRIVATE =====

  /**
   * Inizializza gli elementi DOM del modale
   */
  function initDOM() {
    notificationModal = document.getElementById('notification-modal');
    notificationTitle = document.getElementById('notification-modal-title');
    notificationMessage = document.getElementById('notification-modal-message');
    notificationOk = document.getElementById('notification-modal-ok');

    return notificationModal && notificationTitle && notificationMessage && notificationOk;
  }

  /**
   * Chiude il modale
   */
  function closeModal() {
    if (notificationModal) {
      notificationModal.style.display = 'none';
    }
  }

  /**
   * Inizializza gli event listener del modale
   */
  function initEventListeners() {
    if (!notificationModal || !notificationOk) return;

    // Listener per pulsante OK
    if (!notificationOk.dataset.listenerAdded) {
      notificationOk.addEventListener('click', closeModal);
      notificationOk.dataset.listenerAdded = 'true';
    }

    // Chiudi modal cliccando fuori (overlay)
    if (!notificationModal.dataset.overlayListenerAdded) {
      notificationModal.addEventListener('click', (e) => {
        if (e.target === notificationModal) {
          closeModal();
        }
      });
      notificationModal.dataset.overlayListenerAdded = 'true';
    }

    // Chiudi modal con ESC
    if (!document.hasNotificationEscHandler) {
      const escHandler = (e) => {
        if (e.key === 'Escape' && notificationModal && notificationModal.style.display === 'block') {
          closeModal();
        }
      };
      document.addEventListener('keydown', escHandler);
      document.hasNotificationEscHandler = true;
    }
  }

  // ===== API PUBBLICA =====

  /**
   * Mostra il modale di notifica con titolo e messaggio
   * @param {string} title - Titolo del messaggio
   * @param {string} message - Messaggio da mostrare
   */
  function showNotificationModal(title, message) {
    // Inizializza se non è già stato fatto
    if (!isInitialized) {
      if (!initDOM()) {
        console.error('Elementi modal notifica non trovati');
        // Fallback ad alert se il modal non è disponibile
        alert(`${title}\n\n${message}`);
        return;
      }
      initEventListeners();
      isInitialized = true;
    }

    // Verifica che gli elementi siano ancora disponibili
    if (!notificationModal || !notificationTitle || !notificationMessage || !notificationOk) {
      console.error('Elementi modal notifica non disponibili');
      alert(`${title}\n\n${message}`);
      return;
    }

    // Imposta titolo e messaggio
    notificationTitle.textContent = title;
    notificationMessage.textContent = message;

    // Mostra il modal
    notificationModal.style.display = 'block';

    // Focus sul pulsante OK
    setTimeout(() => {
      notificationOk.focus();
    }, 100);
  }

  /**
   * Inizializza il modale (chiamato automaticamente al caricamento)
   */
  function init() {
    if (isInitialized) return;

    if (initDOM()) {
      initEventListeners();
      isInitialized = true;
      console.log('✅ NotificationModal inizializzato correttamente');
      return true;
    } else {
      console.warn('⚠️ Modal notification-modal non trovato');
      return false;
    }
  }

  // ===== INIZIALIZZAZIONE AUTOMATICA =====
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    // DOM già caricato
    init();
  }

  // ===== ESPORTAZIONE API PUBBLICA =====
  window.NotificationModal = {
    show: showNotificationModal,
    init: init,
    close: closeModal
  };

  // Compatibilità: esporta anche come funzione globale
  window.showNotificationModal = showNotificationModal;

  console.log('✅ js/components/notification-modal.js caricato');
})();

