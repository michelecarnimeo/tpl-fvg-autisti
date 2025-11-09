/**
 * js/tests/pwa-test-mode.js
 *
 * PWA Test Mode Module
 * Gestisce la simulazione della modalità PWA per test senza installazione
 *
 * Funzionalità:
 * - Toggle modalità test PWA
 * - Salvataggio stato in localStorage
 * - Aggiornamento UI pulsante e info
 * - Dispatch evento pwaTestModeChanged per aggiornare altre parti dell'app
 * - Inizializzazione automatica al caricamento
 *
 * API Pubblica: window.PWATestMode
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'tpl.pwaTestMode';

  /**
   * Legge lo stato corrente della modalità PWA test
   * @returns {boolean} true se la modalità test è attiva, false altrimenti
   */
  function getTestModeState() {
    const pwaTestModeValue = localStorage.getItem(STORAGE_KEY);
    // Nota: Storage.getItem può restituire booleano (se salvato come JSON) o stringa
    return pwaTestModeValue === 'true' || pwaTestModeValue === true;
  }

  /**
   * Salva lo stato della modalità PWA test
   * @param {boolean} state - Nuovo stato (true = attivo, false = disattivo)
   */
  function setTestModeState(state) {
    // Salva come stringa (compatibilità con Storage.getItem che fa JSON.parse)
    localStorage.setItem(STORAGE_KEY, String(state));
  }

  /**
   * Crea un elemento link con stile
   * @param {string} href - URL del link
   * @param {string} text - Testo del link
   * @returns {HTMLAnchorElement} Elemento link creato
   */
  function createLink(href, text) {
    const link = document.createElement('a');
    link.href = href;
    link.textContent = text;
    link.style.color = 'var(--turchese)';
    link.style.fontWeight = '600';
    return link;
  }

  /**
   * Crea un elemento lista con item di testo semplice
   * @param {string[]} items - Array di testi per gli item della lista
   * @returns {HTMLUListElement} Elemento lista creato
   */
  function createSimpleList(items) {
    const ul = document.createElement('ul');
    ul.style.margin = '0.5rem 0';
    ul.style.paddingLeft = '1.5rem';
    ul.style.lineHeight = '1.8';

    items.forEach(itemText => {
      const li = document.createElement('li');
      li.textContent = itemText;
      ul.appendChild(li);
    });

    return ul;
  }

  /**
   * Crea il contenuto info per modalità test attiva
   * @returns {DocumentFragment} Fragment con il contenuto creato
   */
  function createActiveModeContent() {
    const fragment = document.createDocumentFragment();

    // Card status attivo
    const statusCard = document.createElement('div');
    statusCard.style.marginBottom = '1rem';
    statusCard.style.padding = '1rem';
    statusCard.style.background = 'rgba(34, 197, 94, 0.1)';
    statusCard.style.borderRadius = '8px';

    const statusTitle = document.createElement('strong');
    statusTitle.style.color = '#22c55e';
    statusTitle.style.fontSize = '1.1rem';
    statusTitle.textContent = '✅ Modalità PWA Test: ATTIVA';
    statusCard.appendChild(statusTitle);
    statusCard.appendChild(document.createElement('br'));

    const statusDesc = document.createElement('p');
    statusDesc.style.margin = '0.5rem 0';
    statusDesc.style.color = 'var(--testo)';
    statusDesc.textContent = 'La bottom navigation è ora visibile in tutte le pagine dell\'app.';
    statusCard.appendChild(statusDesc);

    fragment.appendChild(statusCard);

    // Card azioni
    const actionsCard = document.createElement('div');
    actionsCard.style.marginBottom = '1rem';
    actionsCard.style.padding = '1rem';
    actionsCard.style.background = 'var(--bianco)';
    actionsCard.style.borderRadius = '8px';
    actionsCard.style.border = '1px solid var(--bordo)';

    const actionsTitle = document.createElement('strong');
    actionsTitle.style.color = 'var(--turchese)';
    actionsTitle.textContent = '📱 Cosa puoi fare ora:';
    actionsCard.appendChild(actionsTitle);

    // Lista azioni con link
    const actionsList = document.createElement('ul');
    actionsList.style.margin = '0.5rem 0';
    actionsList.style.paddingLeft = '1.5rem';
    actionsList.style.lineHeight = '1.8';

    // Primo item con link
    const li1 = document.createElement('li');
    li1.appendChild(document.createTextNode('Visita '));
    li1.appendChild(createLink('index.html', 'Home'));
    li1.appendChild(document.createTextNode(', '));
    li1.appendChild(createLink('fermate.html', 'Fermate'));
    li1.appendChild(document.createTextNode(' o '));
    li1.appendChild(createLink('prezzi.html', 'Prezzi'));
    actionsList.appendChild(li1);

    // Altri item semplici
    [
      'La bottom navigation sarà visibile in basso',
      'La navbar superiore sarà nascosta (solo PWA)',
      'Il footer avrà padding extra per non sovrapporsi'
    ].forEach(text => {
      const li = document.createElement('li');
      li.textContent = text;
      actionsList.appendChild(li);
    });

    actionsCard.appendChild(actionsList);
    fragment.appendChild(actionsCard);

    // Nota
    const noteDiv = document.createElement('div');
    noteDiv.style.fontSize = '0.9rem';
    noteDiv.style.color = 'var(--testo-secondario)';
    noteDiv.style.fontStyle = 'italic';

    const noteStrong = document.createElement('strong');
    noteStrong.textContent = '💡 Nota:';
    noteDiv.appendChild(noteStrong);
    noteDiv.appendChild(document.createTextNode(' Questa è una simulazione a scopo di test. In produzione, la bottom nav appare solo quando l\'app è installata come PWA.'));

    fragment.appendChild(noteDiv);

    return fragment;
  }

  /**
   * Crea il contenuto info per modalità test disattiva
   * @returns {DocumentFragment} Fragment con il contenuto creato
   */
  function createInactiveModeContent() {
    const fragment = document.createDocumentFragment();

    // Card status disattivo
    const statusCard = document.createElement('div');
    statusCard.style.marginBottom = '1rem';
    statusCard.style.padding = '1rem';
    statusCard.style.background = 'rgba(239, 68, 68, 0.1)';
    statusCard.style.borderRadius = '8px';

    const statusTitle = document.createElement('strong');
    statusTitle.style.color = '#ef4444';
    statusTitle.style.fontSize = '1.1rem';
    statusTitle.textContent = '❌ Modalità PWA Test: DISATTIVA';
    statusCard.appendChild(statusTitle);
    statusCard.appendChild(document.createElement('br'));

    const statusDesc = document.createElement('p');
    statusDesc.style.margin = '0.5rem 0';
    statusDesc.style.color = 'var(--testo)';
    statusDesc.textContent = 'La bottom navigation è nascosta (comportamento normale del browser).';
    statusCard.appendChild(statusDesc);

    fragment.appendChild(statusCard);

    // Card stato browser
    const browserCard = document.createElement('div');
    browserCard.style.marginBottom = '1rem';
    browserCard.style.padding = '1rem';
    browserCard.style.background = 'var(--bianco)';
    browserCard.style.borderRadius = '8px';
    browserCard.style.border = '1px solid var(--bordo)';

    const browserTitle = document.createElement('strong');
    browserTitle.style.color = 'var(--turchese)';
    browserTitle.textContent = '🌐 Stato Browser Normale:';
    browserCard.appendChild(browserTitle);

    const browserList = createSimpleList([
      'La bottom navigation NON è visibile',
      'La navbar superiore è visibile normalmente',
      'Il layout è quello standard del browser',
      'Per vederla veramente, installa l\'app come PWA'
    ]);

    browserCard.appendChild(browserList);
    fragment.appendChild(browserCard);

    // Suggerimento
    const suggestionDiv = document.createElement('div');
    suggestionDiv.style.fontSize = '0.9rem';
    suggestionDiv.style.color = 'var(--testo-secondario)';
    suggestionDiv.style.fontStyle = 'italic';

    const suggestionStrong = document.createElement('strong');
    suggestionStrong.textContent = '💡 Suggerimento:';
    suggestionDiv.appendChild(suggestionStrong);
    suggestionDiv.appendChild(document.createTextNode(' Clicca sul pulsante sopra per simulare l\'esperienza PWA senza dover installare l\'app.'));

    fragment.appendChild(suggestionDiv);

    return fragment;
  }

  /**
   * Aggiorna l'UI del pulsante e delle info in base allo stato
   * @param {boolean} isTestMode - Se la modalità test è attiva
   */
  function updateUI(isTestMode) {
    const btn = document.getElementById('toggle-pwa-mode');
    const icon = document.getElementById('pwa-mode-icon');
    const text = document.getElementById('pwa-mode-text');
    const statusDiv = document.getElementById('pwa-mode-status');
    const infoDiv = document.getElementById('pwa-mode-info');

    if (!btn || !icon || !text || !statusDiv || !infoDiv) return;

    if (isTestMode) {
      // Modalità test attiva
      icon.textContent = '✅';
      text.textContent = 'Disattiva Modalità PWA';
      btn.style.background = '#dc3545';

      // Svuota e ricrea il contenuto usando createElement
      infoDiv.textContent = '';
      const activeContent = createActiveModeContent();
      infoDiv.appendChild(activeContent);

      statusDiv.style.display = 'block';
      statusDiv.style.borderLeftColor = '#22c55e';
      statusDiv.style.background = 'rgba(34, 197, 94, 0.05)';
    } else {
      // Modalità test disattiva
      icon.textContent = '📱';
      text.textContent = 'Attiva Modalità PWA';
      btn.style.background = 'var(--turchese)';

      // Svuota e ricrea il contenuto usando createElement
      infoDiv.textContent = '';
      const inactiveContent = createInactiveModeContent();
      infoDiv.appendChild(inactiveContent);

      statusDiv.style.display = 'block';
      statusDiv.style.borderLeftColor = '#ef4444';
      statusDiv.style.background = 'rgba(239, 68, 68, 0.05)';
    }
  }

  /**
   * Toggle della modalità PWA test
   * Cambia lo stato attuale e aggiorna l'UI
   */
  function togglePWATestMode() {
    const btn = document.getElementById('toggle-pwa-mode');
    const icon = document.getElementById('pwa-mode-icon');
    const text = document.getElementById('pwa-mode-text');
    const statusDiv = document.getElementById('pwa-mode-status');
    const infoDiv = document.getElementById('pwa-mode-info');

    if (!btn || !icon || !text || !statusDiv || !infoDiv) {
      console.warn('⚠️ Elementi PWA test mode non trovati');
      return;
    }

    // Leggi lo stato corrente
    const isTestMode = getTestModeState();
    const newState = !isTestMode;

    // Salva il nuovo stato
    setTestModeState(newState);

    // Aggiorna l'UI
    updateUI(newState);

    // Trigger refresh della bottom navigation
    setTimeout(() => {
      // Dispatch evento custom per aggiornare altre finestre
      window.dispatchEvent(new Event('pwaTestModeChanged'));

      // Log per debug
      console.log('🔄 Modalità PWA test aggiornata a:', newState);
    }, 100);
  }

  /**
   * Inizializza lo stato del pulsante PWA al caricamento
   */
  function initializeButton() {
    const btn = document.getElementById('toggle-pwa-mode');
    if (!btn) {
      console.warn('⚠️ Pulsante toggle-pwa-mode non trovato');
      return;
    }

    // Leggi lo stato corrente
    const isTestMode = getTestModeState();
    const icon = document.getElementById('pwa-mode-icon');
    const text = document.getElementById('pwa-mode-text');
    const statusDiv = document.getElementById('pwa-mode-status');

    if (!icon || !text) {
      console.warn('⚠️ Elementi icon/text PWA test mode non trovati');
      return;
    }

    // Imposta lo stato iniziale del pulsante
    if (isTestMode) {
      icon.textContent = '✅';
      text.textContent = 'Disattiva Modalità PWA';
      btn.style.background = '#dc3545';
      // Mostra lo status se già attivo (aggiorna UI senza toggle)
      if (statusDiv) {
        updateUI(true);
      }
    } else {
      icon.textContent = '📱';
      text.textContent = 'Attiva Modalità PWA';
      btn.style.background = 'var(--turchese)';
    }

    // Aggiungi event listener (solo se non già presente)
    if (!btn.dataset.listenerAdded) {
      btn.addEventListener('click', togglePWATestMode);
      btn.dataset.listenerAdded = 'true';
    }
  }

  /**
   * Inizializza il modulo
   */
  function init() {
    // Inizializza quando DOM è pronto
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initializeButton);
    } else {
      // DOM già caricato
      initializeButton();
    }
  }

  // API Pubblica
  window.PWATestMode = {
    toggle: togglePWATestMode,
    getState: getTestModeState,
    setState: setTestModeState,
    updateUI: updateUI,
    init: initializeButton
  };

  // Mantieni retrocompatibilità con funzione globale
  window.togglePWATestMode = togglePWATestMode;

  console.log('✅ js/tests/pwa-test-mode.js caricato - PWATestMode disponibile');

  // Auto-inizializza
  init();
})();

