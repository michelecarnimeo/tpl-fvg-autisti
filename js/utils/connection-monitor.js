/**
 * Connection Monitor
 * Monitora lo stato della connessione internet e aggiorna l'UI
 * 
 * Funzionalità:
 * - Verifica stato connessione (online/offline)
 * - Verifica reale con richiesta HTTP
 * - Aggiorna UI con icona e testo
 * - Salva storico test con data/ora
 * - Ascolta eventi online/offline del browser
 * - Pulsante verifica manuale
 * - Pulsante reset storico
 */

(function () {
  'use strict';

  // Elementi DOM (verranno inizializzati)
  let statusIconEl = null;
  let statusTextEl = null;
  let testDateEl = null;
  let resetBtn = null;
  let checkConnectionBtn = null;

  // Storico test connessione
  let lastTestDate = null;
  let lastTestStatus = null;

  /**
   * Formatta data/ora per visualizzazione (tempo relativo)
   * @param {Date} date - Data da formattare
   * @returns {string} Data formattata
   */
  function formatTestDate(date) {
    if (!date) return '-';
    const d = new Date(date);
    const now = new Date();
    const diffMs = now - d;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    // Data completa
    const dateStr = d.toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    const timeStr = d.toLocaleTimeString('it-IT', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    // Tempo relativo
    if (diffMins < 1) return 'Adesso';
    if (diffMins < 60) return `${diffMins} min fa`;
    if (diffHours < 24) return `${diffHours} ore fa`;
    if (diffDays < 7) return `${diffDays} giorni fa`;

    return `${dateStr} ${timeStr}`;
  }

  /**
   * Rileva stato connessione (online/offline)
   * Verifica reale con richiesta HTTP se navigator.onLine dice online
   * @param {boolean} showDate - Se true, salva la data del test
   * @returns {Promise<boolean>} true se online, false se offline
   */
  async function detectConnectionInfo(showDate = true) {
    // Verifica reale della connessione
    let isOnline = navigator.onLine;

    // Se navigator.onLine dice online, verifica con richiesta reale
    // NOTA IMPORTANTE: Con mode: 'no-cors', il browser può loggare errori nella console
    // quando la connessione fallisce. Questo è comportamento normale del browser e
    // non possiamo sopprimerli completamente. Gli errori sono gestiti correttamente nel codice.
    if (navigator.onLine) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);

        // Verifica connessione usando un endpoint semplice
        // Usiamo mode: 'no-cors' per evitare problemi CORS, ma questo significa che
        // non possiamo verificare lo status code HTTP. Se la richiesta completa senza
        // errori di rete, assumiamo che siamo online.
        const fetchPromise = fetch('https://www.google.com/favicon.ico?t=' + Date.now(), {
          method: 'HEAD',
          mode: 'no-cors',
          cache: 'no-cache',
          signal: controller.signal,
          referrerPolicy: 'no-referrer'
        });

        // Race tra fetch e timeout per gestire timeout espliciti
        await Promise.race([
          fetchPromise,
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Connection timeout')), 2000)
          )
        ]);

        clearTimeout(timeoutId);
        // Se la fetch completa senza errori, siamo online
        isOnline = true;
      } catch (e) {
        // Gestione errori: timeout, abort, network error = offline
        // NOTA: Il browser può loggare errori nella console per richieste fallite.
        // Questo è normale e previsto quando si è offline o con connessione lenta.
        // Il nostro codice gestisce correttamente la situazione anche se gli errori appaiono nella console.
        isOnline = false;
      }
    } else {
      isOnline = false;
    }

    // Aggiorna storico se c'è un cambiamento o è una verifica manuale
    if (showDate && (lastTestStatus !== isOnline || !lastTestDate)) {
      lastTestDate = new Date();
      lastTestStatus = isOnline;
    }

    // Aggiorna UI
    updateUI(isOnline, showDate);

    return isOnline;
  }

  /**
   * Aggiorna l'UI con lo stato della connessione
   * @param {boolean} isOnline - Stato connessione
   * @param {boolean} showDate - Se mostrare la data del test
   */
  function updateUI(isOnline, showDate) {
    if (statusIconEl) {
      statusIconEl.textContent = isOnline ? '🟢' : '🔴';
    }
    if (statusTextEl) {
      statusTextEl.textContent = isOnline ? 'Online' : 'Offline';
      statusTextEl.style.color = isOnline ? '#10b981' : '#ef4444';
    }
    if (testDateEl && showDate && lastTestDate) {
      testDateEl.textContent = `Test: ${formatTestDate(lastTestDate)}`;
      testDateEl.style.opacity = '1';
    }

    // Abilita/disabilita pulsante reset
    if (resetBtn) {
      resetBtn.disabled = !lastTestDate;
      resetBtn.style.opacity = lastTestDate ? '1' : '0.6';
    }
  }

  /**
   * Reset risultati test
   */
  function resetTestResults() {
    lastTestDate = null;
    lastTestStatus = null;

    if (statusTextEl) {
      statusTextEl.textContent = 'Non testato';
      statusTextEl.style.color = 'var(--testo-secondario)';
    }
    if (statusIconEl) {
      statusIconEl.textContent = '⚪';
    }
    if (testDateEl) {
      testDateEl.textContent = '-';
      testDateEl.style.opacity = '0.7';
    }

    if (resetBtn) {
      resetBtn.disabled = true;
      resetBtn.style.opacity = '0.6';
    }
  }

  /**
   * Inizializza monitoraggio connessione
   * - Verifica iniziale stato
   * - Ascolta eventi online/offline del browser
   */
  async function initConnectionMonitoring() {
    // Verifica iniziale (senza data, solo per mostrare stato corrente)
    await detectConnectionInfo(false);

    // Ascolta SOLO eventi online/offline del browser (per le notifiche)
    // Questi eventi scatenano anche le notifiche in script.js
    window.addEventListener('online', async () => {
      await detectConnectionInfo(true); // Con data quando è un evento reale
      console.log('🟢 Connessione ripristinata');
    });

    window.addEventListener('offline', async () => {
      await detectConnectionInfo(true); // Con data quando è un evento reale
      console.log('🔴 Connessione persa');
    });
  }

  /**
   * Setup pulsante verifica manuale
   */
  function setupCheckButton() {
    if (!checkConnectionBtn) return;

    checkConnectionBtn.addEventListener('click', async () => {
      // Disabilita pulsante durante verifica
      checkConnectionBtn.disabled = true;
      checkConnectionBtn.style.opacity = '0.6';
      const btnText = checkConnectionBtn.querySelector('span:last-child');
      const originalText = btnText ? btnText.textContent : '';
      if (btnText) {
        btnText.textContent = 'Verifica...';
      }

      // Verifica connessione (con data perché è un test manuale)
      await detectConnectionInfo(true);

      // Reabilita pulsante dopo 1 secondo
      setTimeout(() => {
        checkConnectionBtn.disabled = false;
        checkConnectionBtn.style.opacity = '1';
        if (btnText) {
          btnText.textContent = originalText;
        }
      }, 1000);
    });
  }

  /**
   * Setup pulsante reset
   */
  function setupResetButton() {
    if (!resetBtn) return;

    resetBtn.addEventListener('click', () => {
      resetTestResults();
    });
  }

  /**
   * Inizializza il modulo
   * Cerca gli elementi DOM e configura i listener
   */
  function init() {
    // Cerca elementi DOM
    statusIconEl = document.getElementById('connection-status-icon');
    statusTextEl = document.getElementById('connection-status-text');
    testDateEl = document.getElementById('connection-test-date');
    resetBtn = document.getElementById('reset-connection-btn');
    checkConnectionBtn = document.getElementById('check-connection-btn');

    // Setup pulsanti
    setupResetButton();
    setupCheckButton();

    // Inizializza monitoraggio
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initConnectionMonitoring);
    } else {
      initConnectionMonitoring();
    }
  }

  // Inizializza al caricamento
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // API pubblica (opzionale, per uso esterno)
  window.ConnectionMonitor = {
    detect: detectConnectionInfo,
    reset: resetTestResults,
    getStatus: () => lastTestStatus,
    getLastTestDate: () => lastTestDate
  };

  console.log('✅ Modulo connection-monitor.js caricato');
})();

