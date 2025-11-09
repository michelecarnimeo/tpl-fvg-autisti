/**
 * Route Selector
 * Gestione selezione linea/partenza/arrivo e stato UI
 * 
 * Funzionalità:
 * - Gestione stato selezione (lineaIdx, partenzaIdx, arrivoIdx)
 * - Aggiornamento UI (pulsanti, summary, prezzo)
 * - Ripristino selezioni da Storage
 * - Salvataggio selezioni in Storage
 * - Reset selezioni
 * - Swap partenza/arrivo
 */

(function () {
  'use strict';

  // Usa Storage se disponibile
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

  // Stato selezione
  let lineaIdx = '';
  let partenzaIdx = '';
  let arrivoIdx = '';
  let hasCalculated = false;

  // Elementi DOM (cercati dinamicamente per supportare tutte le pagine)
  let lineaText = null;
  let partenzaBtn = null;
  let arrivoBtn = null;
  let partenzaText = null;
  let arrivoText = null;
  let swapBtn = null;
  let summaryPrezzo = null;
  let summaryCodice = null;
  let summaryPartenza = null;
  let summaryArrivo = null;
  let prezzoErrore = null;

  /**
   * Ottiene gli elementi DOM (chiamato dopo che il DOM è pronto)
   */
  function getDOMElements() {
    lineaText = document.getElementById('linea-text');
    partenzaBtn = document.getElementById('partenza-btn');
    arrivoBtn = document.getElementById('arrivo-btn');
    partenzaText = document.getElementById('partenza-text');
    arrivoText = document.getElementById('arrivo-text');
    swapBtn = document.getElementById('swap-btn');
    summaryPrezzo = document.getElementById('summary-prezzo');
    summaryCodice = document.getElementById('summary-codice');
    summaryPartenza = document.getElementById('summary-partenza');
    summaryArrivo = document.getElementById('summary-arrivo');
    prezzoErrore = document.getElementById('prezzo-errore');
  }

  /**
   * Ottiene il tariffario (da modulo Tariffario o window)
   */
  function getTariffario() {
    if (typeof window.Tariffario !== 'undefined' && window.Tariffario.getData) {
      return window.Tariffario.getData();
    }
    return window.tariffario || [];
  }

  /**
   * Ottiene il tariffario aggiornato
   */
  function getTariffarioAggiornato() {
    if (typeof window.Tariffario !== 'undefined' && window.Tariffario.getAggiornato) {
      return window.Tariffario.getAggiornato();
    }
    return window.tariffarioAggiornato || null;
  }

  /**
   * Aggiorna lo stato dei pulsanti partenza/arrivo
   */
  function updateFermateButtons() {
    if (!partenzaBtn || !arrivoBtn) return; // Non siamo su index.html

    const tariffario = getTariffario();

    if (lineaIdx === '' || !tariffario[lineaIdx]) {
      if (partenzaText) partenzaText.textContent = 'Prima seleziona una linea';
      if (arrivoText) arrivoText.textContent = 'Prima seleziona una linea';
      if (partenzaBtn) partenzaBtn.disabled = true;
      if (arrivoBtn) arrivoBtn.disabled = true;

      // Nascondi pulsanti geolocalizzazione e swap
      if (typeof toggleLocationButton === 'function') {
        toggleLocationButton(false);
      }
      if (typeof toggleSwapButton === 'function') {
        toggleSwapButton(false);
      }
      
      // Nascondi pulsante "Resetta percorso"
      const resetRouteBtn = document.getElementById('reset-route-btn');
      if (resetRouteBtn) {
        resetRouteBtn.style.display = 'none';
      }
      return;
    }

    if (partenzaText) partenzaText.textContent = 'Seleziona la partenza';
    if (arrivoText) arrivoText.textContent = 'Seleziona la destinazione';
    if (partenzaBtn) partenzaBtn.disabled = false;
    if (arrivoBtn) arrivoBtn.disabled = false;

    // Mostra pulsanti geolocalizzazione e swap
    if (typeof toggleLocationButton === 'function') {
      toggleLocationButton(true);
    }
    if (typeof toggleSwapButton === 'function') {
      toggleSwapButton(true);
    }
    
    // Mostra pulsante "Resetta percorso" quando la linea è selezionata
    const resetRouteBtn = document.getElementById('reset-route-btn');
    if (resetRouteBtn) {
      resetRouteBtn.style.display = 'inline-block';
    }
  }

  /**
   * Aggiorna lo stato della card prezzo
   */
  function updatePriceCardState() {
    const priceCard = document.getElementById('price-card');
    if (!priceCard) return;

    const bothSelected = partenzaIdx !== '' && arrivoIdx !== '';
    if (bothSelected) {
      priceCard.classList.remove('inactive');
    } else {
      priceCard.classList.add('inactive');
    }
  }

  /**
   * Aggiorna il riepilogo selezioni
   */
  function updateSummary() {
    if (!summaryPartenza || !summaryArrivo) return; // Non siamo su index.html

    const tariffario = getTariffario();
    const fermate = (lineaIdx !== '' && tariffario[lineaIdx]) ? tariffario[lineaIdx].fermate : [];
    
    if (summaryPartenza) {
      summaryPartenza.textContent = partenzaIdx !== '' && fermate[partenzaIdx] ? fermate[partenzaIdx] : '-';
    }
    if (summaryArrivo) {
      summaryArrivo.textContent = arrivoIdx !== '' && fermate[arrivoIdx] ? fermate[arrivoIdx] : '-';
    }

    updatePriceCardState();
  }

  /**
   * Calcola prezzo e codice (usa Pricing.js)
   */
  function calcolaPrezzo() {
    if (!summaryPrezzo || !summaryCodice || !prezzoErrore) return; // Non siamo su index.html

    const tariffario = getTariffario();
    const tariffarioAggiornato = getTariffarioAggiornato();

    // Usa Pricing.js per calcolare prezzo e codice
    if (typeof Pricing !== 'undefined' && Pricing.calculatePrice) {
      const result = Pricing.calculatePrice(lineaIdx, partenzaIdx, arrivoIdx, tariffario, tariffarioAggiornato);

      // Aggiorna UI con i risultati
      if (summaryPrezzo) summaryPrezzo.textContent = Pricing.formatPrice(result.prezzo);
      if (summaryCodice) summaryCodice.textContent = result.codice || '-';
      if (prezzoErrore) {
        prezzoErrore.style.display = (result.prezzo === null && !result.valido) ? 'block' : 'none';
      }
    } else {
      // Fallback se Pricing.js non è disponibile
      if (summaryPrezzo) summaryPrezzo.textContent = '-';
      if (summaryCodice) summaryCodice.textContent = '-';
      if (prezzoErrore) prezzoErrore.style.display = 'none';
      console.warn('⚠️ Pricing.js non disponibile, impossibile calcolare prezzo');
    }

    // Il pulsante swap è abilitato se partenza e arrivo sono selezionati
    const swapEnabled = lineaIdx !== '' && partenzaIdx !== '' && arrivoIdx !== '';
    if (swapBtn) {
      swapBtn.disabled = !swapEnabled;
    }
  }

  /**
   * Seleziona una linea
   * @param {string|number} idx - Indice della linea
   * @param {string} nome - Nome della linea
   */
  function selectLinea(idx, nome) {
    lineaIdx = idx;
    partenzaIdx = '';
    arrivoIdx = '';
    hasCalculated = false;

    // Aggiorna il testo del bottone
    if (lineaText) {
      lineaText.textContent = nome;
    }

    updateFermateButtons();
    updateSummary();
    calcolaPrezzo();
    updatePriceCardState();

    // Salva usando Storage
    Storage.setItem('tpl.lineaIdx', lineaIdx);
    Storage.removeItem('tpl.partenzaIdx');
    Storage.removeItem('tpl.arrivoIdx');
  }

  /**
   * Seleziona una fermata (partenza o arrivo)
   * @param {number} index - Indice della fermata
   * @param {string} type - Tipo: 'partenza' o 'arrivo'
   */
  function selectFermata(index, type) {
    const tariffario = getTariffario();

    if (type === 'partenza') {
      partenzaIdx = index;
      if (partenzaText && tariffario[lineaIdx]) {
        partenzaText.textContent = tariffario[lineaIdx].fermate[index];
      }
    } else if (type === 'arrivo') {
      arrivoIdx = index;
      if (arrivoText && tariffario[lineaIdx]) {
        arrivoText.textContent = tariffario[lineaIdx].fermate[index];
      }
    }

    hasCalculated = false;
    updateSummary();
    calcolaPrezzo();
    updatePriceCardState();

    // Salva nello storage
    if (type === 'partenza') {
      Storage.setItem('tpl.partenzaIdx', partenzaIdx);
    } else {
      Storage.setItem('tpl.arrivoIdx', arrivoIdx);
    }
  }

  /**
   * Scambia partenza e arrivo
   */
  function swapRoutes() {
    if (lineaIdx === '' || partenzaIdx === '' || arrivoIdx === '') return;

    const tmp = partenzaIdx;
    partenzaIdx = arrivoIdx;
    arrivoIdx = tmp;
    hasCalculated = false;

    const tariffario = getTariffario();

    // Aggiorna i testi dei pulsanti
    if (tariffario[lineaIdx]) {
      if (partenzaText) partenzaText.textContent = tariffario[lineaIdx].fermate[partenzaIdx];
      if (arrivoText) arrivoText.textContent = tariffario[lineaIdx].fermate[arrivoIdx];
    }

    // Reset stato geolocalizzazione dopo swap
    if (window.Geolocation && typeof window.Geolocation.resetLocationState === 'function') {
      window.Geolocation.resetLocationState();
    } else if (typeof window.resetLocationState === 'function') {
      window.resetLocationState();
    }

    updateSummary();
    calcolaPrezzo();

    // Aggiorna Storage
    Storage.setItem('tpl.partenzaIdx', partenzaIdx);
    Storage.setItem('tpl.arrivoIdx', arrivoIdx);
  }

  /**
   * Resetta tutte le selezioni
   */
  function resetFilters() {
    // Reset stato
    lineaIdx = '';
    partenzaIdx = '';
    arrivoIdx = '';
    hasCalculated = false;

    // Reset bottone linea
    if (lineaText) {
      lineaText.textContent = 'Seleziona una linea';
    }

    // Reset pulsanti partenza e arrivo
    if (partenzaText) {
      partenzaText.textContent = 'Prima seleziona una linea';
    }
    if (arrivoText) {
      arrivoText.textContent = 'Prima seleziona una linea';
    }
    if (partenzaBtn) {
      partenzaBtn.disabled = true;
    }
    if (arrivoBtn) {
      arrivoBtn.disabled = true;
    }

    // Reset FORZATO del contenuto (la card rimane visibile ma vuota)
    if (summaryPrezzo) {
      summaryPrezzo.textContent = '-';
      summaryPrezzo.innerHTML = '-';
    }
    if (summaryCodice) {
      summaryCodice.textContent = '-';
      summaryCodice.innerHTML = '-';
    }
    if (summaryPartenza) {
      summaryPartenza.textContent = '-';
      summaryPartenza.innerHTML = '-';
    }
    if (summaryArrivo) {
      summaryArrivo.textContent = '-';
      summaryArrivo.innerHTML = '-';
    }
    if (prezzoErrore) {
      prezzoErrore.style.display = 'none';
    }

    // Nascondi pulsanti geolocalizzazione e swap
    if (typeof toggleLocationButton === 'function') {
      toggleLocationButton(false);
    }
    if (typeof toggleSwapButton === 'function') {
      toggleSwapButton(false);
    }

    // Reset completo stato geolocalizzazione (per permettere nuova localizzazione dopo reset)
    if (window.Geolocation && typeof window.Geolocation.resetLocationState === 'function') {
      window.Geolocation.resetLocationState();
    } else if (typeof window.resetLocationState === 'function') {
      window.resetLocationState();
    }

    // Assicurati che il pulsante swap sia disabilitato
    const swapBtnEl = document.getElementById('swap-btn');
    if (swapBtnEl) {
      swapBtnEl.disabled = true;
      swapBtnEl.style.opacity = '0.5';
      swapBtnEl.style.cursor = 'not-allowed';
    }

    // Nascondi pulsante "Resetta percorso"
    const resetRouteBtn = document.getElementById('reset-route-btn');
    if (resetRouteBtn) {
      resetRouteBtn.style.display = 'none';
    }

    // Reset Storage
    Storage.removeItem('tpl.lineaIdx');
    Storage.removeItem('tpl.partenzaIdx');
    Storage.removeItem('tpl.arrivoIdx');

    // Feedback visivo e aptico
    const resetBtn = document.getElementById('reset-btn');
    if (resetBtn) {
      resetBtn.style.transform = 'scale(0.95)';
      setTimeout(() => {
        resetBtn.style.transform = 'scale(1)';
      }, 150);
    }

    updatePriceCardState();

    // Vibrazione di conferma reset
    if (window.Settings && window.Settings.triggerHaptic) {
      window.Settings.triggerHaptic('medium');
    }
  }

  /**
   * Resetta solo partenza, arrivo e risultato (mantiene la linea selezionata)
   */
  function resetRoute() {
    // Reset solo partenza e arrivo (mantiene lineaIdx)
    partenzaIdx = '';
    arrivoIdx = '';
    hasCalculated = false;

    const tariffario = getTariffario();

    // Aggiorna pulsanti partenza e arrivo (mantiene la linea selezionata)
    updateFermateButtons();

    // Reset FORZATO del contenuto (la card rimane visibile ma vuota)
    if (summaryPrezzo) {
      summaryPrezzo.textContent = '-';
      summaryPrezzo.innerHTML = '-';
    }
    if (summaryCodice) {
      summaryCodice.textContent = '-';
      summaryCodice.innerHTML = '-';
    }
    if (summaryPartenza) {
      summaryPartenza.textContent = '-';
      summaryPartenza.innerHTML = '-';
    }
    if (summaryArrivo) {
      summaryArrivo.textContent = '-';
      summaryArrivo.innerHTML = '-';
    }
    if (prezzoErrore) {
      prezzoErrore.style.display = 'none';
    }

    // Reset completo stato geolocalizzazione
    if (window.Geolocation && typeof window.Geolocation.resetLocationState === 'function') {
      window.Geolocation.resetLocationState();
    } else if (typeof window.resetLocationState === 'function') {
      window.resetLocationState();
    }

    // Disabilita pulsante swap (non ci sono partenza/arrivo)
    const swapBtnEl = document.getElementById('swap-btn');
    if (swapBtnEl) {
      swapBtnEl.disabled = true;
    }

    // Reset Storage solo per partenza e arrivo (mantiene lineaIdx)
    Storage.removeItem('tpl.partenzaIdx');
    Storage.removeItem('tpl.arrivoIdx');

    // Feedback visivo e aptico
    const resetRouteBtn = document.getElementById('reset-route-btn');
    if (resetRouteBtn) {
      resetRouteBtn.style.transform = 'scale(0.95)';
      setTimeout(() => {
        resetRouteBtn.style.transform = 'scale(1)';
      }, 150);
    }

    updatePriceCardState();

    // Vibrazione di conferma reset
    if (window.Settings && window.Settings.triggerHaptic) {
      window.Settings.triggerHaptic('medium');
    }
  }

  /**
   * Ripristina le selezioni da Storage
   */
  function restoreFromStorage() {
    const tariffario = getTariffario();

    try {
      const sLinea = Storage.getItem('tpl.lineaIdx');
      const sPart = Storage.getItem('tpl.partenzaIdx');
      const sArr = Storage.getItem('tpl.arrivoIdx');

      // Restore linea (accetta sia stringhe che numeri)
      // Storage.getItem può restituire stringhe o numeri (se parsati come JSON)
      // Gestiamo entrambi i casi
      if (sLinea !== null && sLinea !== '' && sLinea !== undefined) {
        // Mantieni il valore come è (può essere stringa o numero)
        lineaIdx = sLinea;
        // Ripristina il testo del bottone linea solo se il tariffario è disponibile
        if (lineaText && tariffario && tariffario.length > 0) {
          // Converti a numero per l'accesso all'array se necessario
          const idx = typeof lineaIdx === 'string' && lineaIdx !== '' ? parseInt(lineaIdx, 10) : lineaIdx;
          if (!isNaN(idx) && idx !== '' && tariffario[idx]) {
            lineaText.textContent = tariffario[idx].nome;
          }
        }
      }
      
      // Restore partenza (accetta sia stringhe che numeri)
      if (sPart !== null && sPart !== '' && sPart !== undefined) {
        partenzaIdx = sPart;
      }
      
      // Restore arrivo (accetta sia stringhe che numeri)
      if (sArr !== null && sArr !== '' && sArr !== undefined) {
        arrivoIdx = sArr;
      }
    } catch (error) {
      console.error('❌ Errore durante il ripristino da Storage:', error);
    }

    updateFermateButtons();

    // Aggiorna i testi dei pulsanti se ci sono valori salvati e il tariffario è disponibile
    if (tariffario && tariffario.length > 0) {
      // Converti a numero per l'accesso all'array se necessario
      const lineIdx = typeof lineaIdx === 'string' && lineaIdx !== '' ? parseInt(lineaIdx, 10) : lineaIdx;
      const partIdx = typeof partenzaIdx === 'string' && partenzaIdx !== '' ? parseInt(partenzaIdx, 10) : partenzaIdx;
      const arrIdx = typeof arrivoIdx === 'string' && arrivoIdx !== '' ? parseInt(arrivoIdx, 10) : arrivoIdx;
      
      if (partIdx !== '' && !isNaN(lineIdx) && tariffario[lineIdx] && tariffario[lineIdx].fermate && partenzaText) {
        if (tariffario[lineIdx].fermate[partIdx]) {
          partenzaText.textContent = tariffario[lineIdx].fermate[partIdx];
        }
      }
      if (arrIdx !== '' && !isNaN(lineIdx) && tariffario[lineIdx] && tariffario[lineIdx].fermate && arrivoText) {
        if (tariffario[lineIdx].fermate[arrIdx]) {
          arrivoText.textContent = tariffario[lineIdx].fermate[arrIdx];
        }
      }
    }

    updateSummary();
    calcolaPrezzo();
  }

  /**
   * Inizializza il modulo
   */
  function init() {
    // Ottieni elementi DOM
    getDOMElements();

    // Ripristina selezioni da Storage (dopo che il tariffario è stato caricato)
    // Questo viene chiamato manualmente dopo loadData()
  }

  // API pubblica
  window.RouteSelector = {
    /**
     * Seleziona una linea
     * @param {string|number} idx - Indice della linea
     * @param {string} nome - Nome della linea
     */
    selectLinea: selectLinea,

    /**
     * Seleziona una fermata
     * @param {number} index - Indice della fermata
     * @param {string} type - Tipo: 'partenza' o 'arrivo'
     */
    selectFermata: selectFermata,

    /**
     * Scambia partenza e arrivo
     */
    swapRoutes: swapRoutes,

    /**
     * Resetta tutte le selezioni
     */
    reset: resetFilters,

    /**
     * Resetta solo partenza, arrivo e risultato (mantiene la linea)
     */
    resetRoute: resetRoute,

    /**
     * Ripristina selezioni da Storage
     */
    restore: restoreFromStorage,

    /**
     * Aggiorna UI (pulsanti, summary, prezzo)
     */
    updateUI: function () {
      updateFermateButtons();
      updateSummary();
      calcolaPrezzo();
      updatePriceCardState();
    },

    /**
     * Ottiene lo stato corrente
     * @returns {Object} Stato selezione
     */
    getState: function () {
      return {
        lineaIdx: lineaIdx,
        partenzaIdx: partenzaIdx,
        arrivoIdx: arrivoIdx,
        hasCalculated: hasCalculated
      };
    },

    /**
     * Ottiene l'indice linea corrente
     * @returns {string|number} Indice linea
     */
    getLineaIdx: function () {
      return lineaIdx;
    },

    /**
     * Ottiene l'indice partenza corrente
     * @returns {string|number} Indice partenza
     */
    getPartenzaIdx: function () {
      return partenzaIdx;
    },

    /**
     * Ottiene l'indice arrivo corrente
     * @returns {string|number} Indice arrivo
     */
    getArrivoIdx: function () {
      return arrivoIdx;
    },

    /**
     * Inizializza il modulo
     */
    init: init
  };

  // Espone funzioni globali per retrocompatibilità (onclick nell'HTML)
  window.swapRoutes = swapRoutes;
  window.calculatePrice = function () {
    hasCalculated = true;
    calcolaPrezzo();
  };

  // Inizializza immediatamente se il DOM è già pronto
  // Altrimenti aspetta DOMContentLoaded
  // Questo assicura che gli elementi DOM siano disponibili quando viene chiamato restore()
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    // DOM già pronto, inizializza subito
    init();
  }

  console.log('✅ Modulo route-selector.js caricato');
})();

