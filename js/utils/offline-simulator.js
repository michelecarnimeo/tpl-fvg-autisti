/**
 * Offline Simulator
 * Gestisce la simulazione della modalità offline per test
 * 
 * Funzionalità:
 * - Toggle modalità offline simulata
 * - Salvataggio stato in localStorage
 * - Trigger eventi online/offline del browser
 * - Aggiornamento UI con informazioni dettagliate
 * - Notifiche cross-tab
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'tpl.offlineTestMode';

  /**
   * Ottiene lo stato corrente della simulazione offline
   * @returns {boolean} true se offline simulato è attivo
   */
  function getOfflineSimulatedState() {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  }

  /**
   * Imposta lo stato della simulazione offline
   * @param {boolean} value - true per attivare, false per disattivare
   */
  function setOfflineSimulatedState(value) {
    localStorage.setItem(STORAGE_KEY, value);
  }

  /**
   * Genera HTML per lo stato offline
   * @returns {string} HTML da inserire
   */
  function getOfflineStatusHTML() {
    return `
      <div style="margin-bottom: 1rem; padding: 1rem; background: rgba(239, 68, 68, 0.1); border-radius: 8px;">
        <strong style="color: #ef4444; font-size: 1.1rem;">📵 Modalità Offline: ATTIVA</strong><br>
        <p style="margin: 0.5rem 0; color: var(--testo);">Simulazione della perdita di connessione internet.</p>
      </div>
      <div style="margin-bottom: 1rem; padding: 1rem; background: var(--bianco); border-radius: 8px; border: 1px solid var(--bordo);">
        <strong style="color: #ef4444;">🚫 Cosa succede ora:</strong>
        <ul style="margin: 0.5rem 0; padding-left: 1.5rem; line-height: 1.8;">
          <li>Il banner "Sei offline" dovrebbe apparire in alto</li>
          <li>Le richieste di rete falliranno (simulato)</li>
          <li>L'app continua a funzionare in modalità offline (PWA)</li>
          <li>I dati cached rimangono disponibili</li>
        </ul>
      </div>
      <div style="margin-bottom: 1rem; padding: 1rem; background: var(--bianco); border-radius: 8px; border: 1px solid var(--bordo);">
        <strong style="color: var(--turchese);">📊 Status corrente:</strong>
        <ul style="margin: 0.5rem 0; padding-left: 1.5rem; line-height: 1.8;">
          <li><strong>navigator.onLine:</strong> <code>${navigator.onLine}</code></li>
          <li><strong>Evento offline:</strong> <code>dispatched</code></li>
          <li><strong>Banner offline:</strong> <code>dovrebbe essere visibile</code></li>
        </ul>
      </div>
      <div style="font-size: 0.9rem; color: var(--testo-secondario); font-style: italic;">
        <strong>💡 Nota:</strong> Questa è una simulazione. Per testare realmente la modalità offline, usa DevTools → Network → Offline.
      </div>
    `;
  }

  /**
   * Genera HTML per lo stato online
   * @returns {string} HTML da inserire
   */
  function getOnlineStatusHTML() {
    return `
      <div style="margin-bottom: 1rem; padding: 1rem; background: rgba(16, 185, 129, 0.1); border-radius: 8px;">
        <strong style="color: #10b981; font-size: 1.1rem;">📶 Modalità Online: ATTIVA</strong><br>
        <p style="margin: 0.5rem 0; color: var(--testo);">Connessione internet ripristinata (simulato).</p>
      </div>
      <div style="margin-bottom: 1rem; padding: 1rem; background: var(--bianco); border-radius: 8px; border: 1px solid var(--bordo);">
        <strong style="color: #10b981;">✅ Cosa succede ora:</strong>
        <ul style="margin: 0.5rem 0; padding-left: 1.5rem; line-height: 1.8;">
          <li>Il banner "Sei offline" dovrebbe scomparire</li>
          <li>Le richieste di rete funzionano normalmente</li>
          <li>Sincronizzazione dati ripristinata</li>
          <li>Accesso completo a tutte le funzionalità</li>
        </ul>
      </div>
      <div style="margin-bottom: 1rem; padding: 1rem; background: var(--bianco); border-radius: 8px; border: 1px solid var(--bordo);">
        <strong style="color: var(--turchese);">📊 Status corrente:</strong>
        <ul style="margin: 0.5rem 0; padding-left: 1.5rem; line-height: 1.8;">
          <li><strong>navigator.onLine:</strong> <code>${navigator.onLine}</code></li>
          <li><strong>Evento online:</strong> <code>dispatched</code></li>
          <li><strong>Banner offline:</strong> <code>nascosto</code></li>
        </ul>
      </div>
      <div style="font-size: 0.9rem; color: var(--testo-secondario); font-style: italic;">
        <strong>💡 Suggerimento:</strong> Clicca su "Simula Offline" per testare nuovamente il comportamento offline dell'app.
      </div>
    `;
  }

  /**
   * Attiva la modalità offline simulata
   * @param {HTMLElement} btn - Pulsante toggle
   * @param {HTMLElement} icon - Icona
   * @param {HTMLElement} text - Testo
   * @param {HTMLElement} statusDiv - Div status
   * @param {HTMLElement} infoDiv - Div informazioni
   */
  function activateOfflineMode(btn, icon, text, statusDiv, infoDiv) {
    icon.textContent = '📵';
    text.textContent = 'Torna Online';
    btn.style.background = '#ef4444';

    // Trigger evento offline
    window.dispatchEvent(new Event('offline'));

    // Trigger evento custom per badge dinamici
    window.dispatchEvent(new Event('offlineTestModeChanged'));

    infoDiv.innerHTML = getOfflineStatusHTML();
    statusDiv.style.display = 'block';
    statusDiv.style.borderLeftColor = '#ef4444';
    statusDiv.style.background = 'rgba(239, 68, 68, 0.05)';

    console.log('🔴 Modalità offline simulata: ATTIVA');

    // Notifica altre pagine/tab
    window.dispatchEvent(new Event('offlineTestModeChanged'));
  }

  /**
   * Disattiva la modalità offline simulata
   * @param {HTMLElement} btn - Pulsante toggle
   * @param {HTMLElement} icon - Icona
   * @param {HTMLElement} text - Testo
   * @param {HTMLElement} statusDiv - Div status
   * @param {HTMLElement} infoDiv - Div informazioni
   */
  function deactivateOfflineMode(btn, icon, text, statusDiv, infoDiv) {
    icon.textContent = '📶';
    text.textContent = 'Simula Offline';
    btn.style.background = '#10b981';

    // Trigger evento online
    window.dispatchEvent(new Event('online'));

    // Trigger evento custom per badge dinamici
    window.dispatchEvent(new Event('offlineTestModeChanged'));

    infoDiv.innerHTML = getOnlineStatusHTML();
    statusDiv.style.display = 'block';
    statusDiv.style.borderLeftColor = '#10b981';
    statusDiv.style.background = 'rgba(16, 185, 129, 0.05)';

    console.log('🟢 Modalità offline simulata: DISATTIVA');

    // Notifica altre pagine/tab
    window.dispatchEvent(new Event('offlineTestModeChanged'));
  }

  /**
   * Toggle modalità offline
   */
  function toggleOfflineMode() {
    const btn = document.getElementById('toggle-offline-mode');
    const icon = document.getElementById('offline-mode-icon');
    const text = document.getElementById('offline-mode-text');
    const statusDiv = document.getElementById('offline-mode-status');
    const infoDiv = document.getElementById('offline-mode-info');

    if (!btn || !icon || !text || !statusDiv || !infoDiv) return;

    const isOfflineSimulated = !getOfflineSimulatedState();
    setOfflineSimulatedState(isOfflineSimulated);

    if (isOfflineSimulated) {
      activateOfflineMode(btn, icon, text, statusDiv, infoDiv);
    } else {
      deactivateOfflineMode(btn, icon, text, statusDiv, infoDiv);
    }
  }

  /**
   * Inizializza il modulo
   */
  function init() {
    const btn = document.getElementById('toggle-offline-mode');
    if (!btn) return;

    // Imposta lo stato iniziale del pulsante
    const isOfflineMode = getOfflineSimulatedState();
    const icon = document.getElementById('offline-mode-icon');
    const text = document.getElementById('offline-mode-text');
    const statusDiv = document.getElementById('offline-mode-status');

    if (isOfflineMode) {
      if (icon) icon.textContent = '📵';
      if (text) text.textContent = 'Torna Online';
      btn.style.background = '#ef4444';
      // Mostra lo status se già attivo
      toggleOfflineMode();
      toggleOfflineMode(); // Doppio toggle per mostrare lo status
    } else {
      if (icon) icon.textContent = '📶';
      if (text) text.textContent = 'Simula Offline';
      btn.style.background = '#10b981';
    }

    // Aggiungi event listener
    btn.addEventListener('click', toggleOfflineMode);
    console.log('✅ Pulsante simulazione offline inizializzato');
  }

  // Inizializza al caricamento
  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // API pubblica
  window.OfflineSimulator = {
    getState: getOfflineSimulatedState,
    setState: setOfflineSimulatedState,
    toggle: toggleOfflineMode
  };

  console.log('✅ Modulo offline-simulator.js caricato');
})();

