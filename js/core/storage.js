// ========================================
// CORE: STORAGE
// Wrapper per localStorage con gestione errori e utilità
// ========================================

(function() {
  'use strict';

  // ========================================
  // VERIFICA SUPPORTO
  // ========================================

  /**
   * Verifica se localStorage è supportato e disponibile
   * @returns {boolean}
   */
  function isSupported() {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }

  // ========================================
  // OPERAZIONI BASE
  // ========================================

  /**
   * Salva un valore in localStorage
   * Gestisce automaticamente JSON.stringify per oggetti/array
   * @param {string} key - Chiave
   * @param {*} value - Valore da salvare (string, number, boolean, object, array)
   * @returns {boolean} - true se salvato con successo, false altrimenti
   */
  function setItem(key, value) {
    if (!isSupported()) {
      console.warn('⚠️ localStorage non supportato');
      return false;
    }

    try {
      // Se il valore è già una stringa, salvalo direttamente (retrocompatibilità)
      // Altrimenti, usa JSON.stringify per oggetti/array/boolean/number
      if (typeof value === 'string') {
        localStorage.setItem(key, value);
      } else if (typeof value === 'number' || typeof value === 'boolean') {
        // Per numeri e boolean, salva come stringa (compatibilità con codice esistente)
        localStorage.setItem(key, String(value));
      } else {
        // Per oggetti e array, usa JSON.stringify
        localStorage.setItem(key, JSON.stringify(value));
      }
      return true;
    } catch (error) {
      // Gestione errori comuni
      if (error.name === 'QuotaExceededError') {
        console.error('❌ Spazio localStorage esaurito:', error);
      } else {
        console.error('❌ Errore salvataggio localStorage:', error);
      }
      return false;
    }
  }

  /**
   * Recupera un valore da localStorage
   * Gestisce automaticamente JSON.parse per oggetti/array
   * @param {string} key - Chiave
   * @param {*} defaultValue - Valore di default se la chiave non esiste
   * @returns {*} - Valore recuperato o defaultValue
   */
  function getItem(key, defaultValue = null) {
    if (!isSupported()) {
      console.warn('⚠️ localStorage non supportato');
      return defaultValue;
    }

    try {
      const item = localStorage.getItem(key);
      
      // Se la chiave non esiste, ritorna il default
      if (item === null) {
        return defaultValue;
      }

      // Prova a fare JSON.parse per oggetti/array
      // Se fallisce, ritorna la stringa originale (retrocompatibilità)
      try {
        return JSON.parse(item);
      } catch (e) {
        // Non è JSON, ritorna la stringa originale
        return item;
      }
    } catch (error) {
      console.error('❌ Errore lettura localStorage:', error);
      return defaultValue;
    }
  }

  /**
   * Rimuove un valore da localStorage
   * @param {string} key - Chiave da rimuovere
   * @returns {boolean} - true se rimosso con successo, false altrimenti
   */
  function removeItem(key) {
    if (!isSupported()) {
      console.warn('⚠️ localStorage non supportato');
      return false;
    }

    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('❌ Errore rimozione localStorage:', error);
      return false;
    }
  }

  /**
   * Svuota tutto il localStorage
   * ATTENZIONE: Rimuove TUTTI i dati salvati!
   * @returns {boolean} - true se svuotato con successo, false altrimenti
   */
  function clear() {
    if (!isSupported()) {
      console.warn('⚠️ localStorage non supportato');
      return false;
    }

    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('❌ Errore svuotamento localStorage:', error);
      return false;
    }
  }

  // ========================================
  // UTILITÀ
  // ========================================

  /**
   * Recupera tutti i valori che iniziano con un prefisso
   * Utile per recuperare tutte le impostazioni TPL (es: 'tpl.')
   * @param {string} prefix - Prefisso da cercare
   * @returns {Object} - Oggetto con chiavi (senza prefisso) e valori
   */
  function getItemsByPrefix(prefix) {
    if (!isSupported()) {
      return {};
    }

    const result = {};
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(prefix)) {
          const shortKey = key.substring(prefix.length);
          result[shortKey] = getItem(key);
        }
      }
    } catch (error) {
      console.error('❌ Errore recupero items con prefisso:', error);
    }
    return result;
  }

  /**
   * Rimuove tutti i valori che iniziano con un prefisso
   * @param {string} prefix - Prefisso da cercare
   * @returns {number} - Numero di item rimossi
   */
  function removeItemsByPrefix(prefix) {
    if (!isSupported()) {
      return 0;
    }

    let count = 0;
    try {
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(prefix)) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => {
        if (removeItem(key)) {
          count++;
        }
      });
    } catch (error) {
      console.error('❌ Errore rimozione items con prefisso:', error);
    }
    return count;
  }

  /**
   * Verifica se una chiave esiste in localStorage
   * @param {string} key - Chiave da verificare
   * @returns {boolean}
   */
  function hasItem(key) {
    if (!isSupported()) {
      return false;
    }
    return localStorage.getItem(key) !== null;
  }

  /**
   * Recupera il numero di chiavi salvate in localStorage
   * @returns {number}
   */
  function getSize() {
    if (!isSupported()) {
      return 0;
    }
    return localStorage.length;
  }

  // ========================================
  // ESPORTAZIONE PUBBLICA
  // ========================================

  window.Storage = {
    // Operazioni base
    setItem: setItem,
    getItem: getItem,
    removeItem: removeItem,
    clear: clear,

    // Utilità
    getItemsByPrefix: getItemsByPrefix,
    removeItemsByPrefix: removeItemsByPrefix,
    hasItem: hasItem,
    getSize: getSize,
    isSupported: isSupported
  };

  console.log('✅ js/core/storage.js caricato');

})();

