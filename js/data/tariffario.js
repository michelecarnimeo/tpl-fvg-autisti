/**
 * Tariffario Data Manager
 * Gestione caricamento e accesso ai dati del tariffario
 * 
 * Funzionalità:
 * - Caricamento database.json
 * - Gestione tariffario e tariffarioAggiornato
 * - Esposizione dati su window per accesso globale
 * - Evento 'tariffarioLoaded' quando i dati sono pronti
 */

(function () {
  'use strict';

  // Stato dati
  let tariffario = [];
  let tariffarioAggiornato = null;
  let isLoading = false;
  let isLoaded = false;

  /**
   * Carica i dati del tariffario da database.json
   * @returns {Promise<Array>} Array di linee del tariffario
   */
  async function loadTariffario() {
    // Evita caricamenti multipli simultanei
    if (isLoading) {
      console.log('⏳ Caricamento tariffario già in corso...');
      // Attendi che il caricamento corrente finisca
      while (isLoading) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      return tariffario;
    }

    // Se già caricato, ritorna i dati
    if (isLoaded && tariffario.length > 0) {
      console.log('✅ Tariffario già caricato:', tariffario.length, 'linee');
      return tariffario;
    }

    isLoading = true;

    try {
      const res = await fetch('database.json');
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      tariffario = await res.json();
      console.log('✅ Database caricato, tariffario.length:', tariffario.length);
    } catch (error) {
      console.error('❌ Errore durante il caricamento del tariffario:', error);
      tariffario = [];
    } finally {
      isLoading = false;
      isLoaded = true;
    }

    // tariffarioAggiornato rimane null (file opzionale non presente)
    // In futuro si può aggiungere il caricamento di un file aggiornato
    tariffarioAggiornato = null;

    // Esponi dati su window per accesso da moduli esterni (es. test, Pricing, ecc.)
    if (typeof window !== 'undefined') {
      window.tariffario = tariffario;
      window.tariffarioAggiornato = tariffarioAggiornato;
    }

    // Dispara evento per notificare che i dati sono pronti
    window.dispatchEvent(new Event('tariffarioLoaded'));

    return tariffario;
  }

  /**
   * Ottiene il tariffario corrente
   * @returns {Array} Array di linee del tariffario
   */
  function getTariffario() {
    return tariffario;
  }

  /**
   * Ottiene il tariffario aggiornato (se presente)
   * @returns {Object|null} Tariffario aggiornato o null
   */
  function getTariffarioAggiornato() {
    return tariffarioAggiornato;
  }

  /**
   * Verifica se i dati sono stati caricati
   * @returns {boolean} True se i dati sono stati caricati
   */
  function isDataLoaded() {
    return isLoaded;
  }

  /**
   * Verifica se il caricamento è in corso
   * @returns {boolean} True se il caricamento è in corso
   */
  function isLoadingData() {
    return isLoading;
  }

  /**
   * Ottiene una linea specifica per indice
   * @param {number} index - Indice della linea
   * @returns {Object|null} Linea del tariffario o null se non trovata
   */
  function getLinea(index) {
    if (index < 0 || index >= tariffario.length) {
      return null;
    }
    return tariffario[index];
  }

  /**
   * Cerca una linea per nome
   * @param {string} nome - Nome della linea da cercare
   * @returns {Object|null} Linea del tariffario o null se non trovata
   */
  function findLineaByName(nome) {
    return tariffario.find(linea => linea.nome === nome) || null;
  }

  /**
   * Resetta i dati (utile per testing)
   */
  function reset() {
    tariffario = [];
    tariffarioAggiornato = null;
    isLoaded = false;
    isLoading = false;
    if (typeof window !== 'undefined') {
      window.tariffario = [];
      window.tariffarioAggiornato = null;
    }
  }

  // API pubblica
  window.Tariffario = {
    /**
     * Carica i dati del tariffario
     * @returns {Promise<Array>} Array di linee del tariffario
     */
    load: loadTariffario,

    /**
     * Ottiene il tariffario corrente
     * @returns {Array} Array di linee del tariffario
     */
    getData: getTariffario,

    /**
     * Ottiene il tariffario aggiornato
     * @returns {Object|null} Tariffario aggiornato o null
     */
    getAggiornato: getTariffarioAggiornato,

    /**
     * Verifica se i dati sono stati caricati
     * @returns {boolean} True se i dati sono stati caricati
     */
    isLoaded: isDataLoaded,

    /**
     * Verifica se il caricamento è in corso
     * @returns {boolean} True se il caricamento è in corso
     */
    isLoading: isLoadingData,

    /**
     * Ottiene una linea specifica per indice
     * @param {number} index - Indice della linea
     * @returns {Object|null} Linea del tariffario o null
     */
    getLinea: getLinea,

    /**
     * Cerca una linea per nome
     * @param {string} nome - Nome della linea
     * @returns {Object|null} Linea del tariffario o null
     */
    findLineaByName: findLineaByName,

    /**
     * Resetta i dati (utile per testing)
     */
    reset: reset
  };

  // Espone loadData globalmente per retrocompatibilità
  // (usato da test-prezzi-wrappers.js e altri moduli)
  window.loadData = loadTariffario;

  console.log('✅ Modulo tariffario.js caricato');
})();

