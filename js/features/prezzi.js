/**
 * js/features/prezzi.js
 * 
 * Modulo per calcolo prezzi biglietti TPL FVG
 * Logica pura: nessuna dipendenza DOM, funzioni testabili in isolamento
 * 
 * API Pubblica: window.Pricing
 */

(function () {
  'use strict';

  /**
   * Valida se una selezione (linea, partenza, arrivo) è valida
   * @param {string|number} lineaIdx - Indice linea
   * @param {string|number} partenzaIdx - Indice fermata partenza
   * @param {string|number} arrivoIdx - Indice fermata arrivo
   * @param {Array} tariffario - Array tariffario
   * @returns {boolean} True se la selezione è valida
   */
  function isValidSelection(lineaIdx, partenzaIdx, arrivoIdx, tariffario) {
    // Controlla che tutti gli indici siano definiti
    if (lineaIdx === '' || lineaIdx === null || lineaIdx === undefined) return false;
    if (partenzaIdx === '' || partenzaIdx === null || partenzaIdx === undefined) return false;
    if (arrivoIdx === '' || arrivoIdx === null || arrivoIdx === undefined) return false;

    // Converti a numero se necessario
    const lineaNum = parseInt(lineaIdx);
    const partenzaNum = parseInt(partenzaIdx);
    const arrivoNum = parseInt(arrivoIdx);

    // Controlla che siano numeri validi
    if (isNaN(lineaNum) || isNaN(partenzaNum) || isNaN(arrivoNum)) return false;

    // Controlla che la linea esista
    if (!tariffario || !Array.isArray(tariffario) || !tariffario[lineaNum]) return false;

    // Controlla che partenza e arrivo siano diversi
    if (partenzaNum === arrivoNum) return false;

    // Controlla che la linea abbia un array di fermate valido
    const linea = tariffario[lineaNum];
    if (!linea || !Array.isArray(linea.fermate) || linea.fermate.length === 0) return false;

    // Controlla che gli indici siano validi per la linea
    if (partenzaNum < 0 || partenzaNum >= linea.fermate.length) return false;
    if (arrivoNum < 0 || arrivoNum >= linea.fermate.length) return false;

    return true;
  }

  /**
   * Verifica se una tratta esiste nella matrice prezzi/codici
   * @param {string|number} lineaIdx - Indice linea
   * @param {string|number} partenzaIdx - Indice fermata partenza
   * @param {string|number} arrivoIdx - Indice fermata arrivo
   * @param {Array} tariffario - Array tariffario
   * @returns {boolean} True se la tratta è disponibile
   */
  function isRouteAvailable(lineaIdx, partenzaIdx, arrivoIdx, tariffario) {
    if (!isValidSelection(lineaIdx, partenzaIdx, arrivoIdx, tariffario)) {
      return false;
    }

    const lineaNum = parseInt(lineaIdx);
    const partenzaNum = parseInt(partenzaIdx);
    const arrivoNum = parseInt(arrivoIdx);

    const linea = tariffario[lineaNum];

    // Verifica che la matrice prezzi esista e abbia gli indici validi
    if (!linea.prezzi || !Array.isArray(linea.prezzi)) return false;
    if (!linea.prezzi[partenzaNum] || !Array.isArray(linea.prezzi[partenzaNum])) return false;
    if (linea.prezzi[partenzaNum][arrivoNum] === undefined) return false;

    return true;
  }

  /**
   * Recupera il codice biglietto per una tratta
   * @param {string|number} lineaIdx - Indice linea
   * @param {string|number} partenzaIdx - Indice fermata partenza
   * @param {string|number} arrivoIdx - Indice fermata arrivo
   * @param {Array} tariffario - Array tariffario
   * @param {Array|null} tariffarioAggiornato - Fallback tariffario aggiornato (opzionale)
   * @returns {string} Codice biglietto o stringa vuota
   */
  function getTicketCode(lineaIdx, partenzaIdx, arrivoIdx, tariffario, tariffarioAggiornato = null) {
    // Se la selezione non è valida, ritorna stringa vuota
    if (!isValidSelection(lineaIdx, partenzaIdx, arrivoIdx, tariffario)) {
      return '';
    }

    try {
      const lineaNum = parseInt(lineaIdx);
      const partenzaNum = parseInt(partenzaIdx);
      const arrivoNum = parseInt(arrivoIdx);

      const linea = tariffario[lineaNum];

      // Prova a recuperare il codice dalla matrice principale
      let codice = '';
      if (linea.codici && Array.isArray(linea.codici)) {
        if (linea.codici[partenzaNum] && Array.isArray(linea.codici[partenzaNum])) {
          codice = linea.codici[partenzaNum][arrivoNum] || '';
        }
      }

      // Se il codice non è stato trovato e c'è un fallback, cerca in tariffarioAggiornato
      if (!codice && tariffarioAggiornato && Array.isArray(tariffarioAggiornato)) {
        const fermate = linea.fermate;
        if (fermate && fermate[partenzaNum] && fermate[arrivoNum]) {
          const partenza = fermate[partenzaNum];
          const arrivo = fermate[arrivoNum];
          const match = tariffarioAggiornato.find(e =>
            e && e.partenza === partenza && e.arrivo === arrivo
          );
          if (match && match.codice_biglietto) {
            codice = match.codice_biglietto;
          }
        }
      }

      return codice || '';
    } catch (error) {
      console.warn('Errore recupero codice biglietto:', error);
      return '';
    }
  }

  /**
   * Calcola il prezzo per una tratta
   * @param {string|number} lineaIdx - Indice linea
   * @param {string|number} partenzaIdx - Indice fermata partenza
   * @param {string|number} arrivoIdx - Indice fermata arrivo
   * @param {Array} tariffario - Array tariffario
   * @param {Array|null} tariffarioAggiornato - Fallback tariffario aggiornato (opzionale)
   * @returns {Object} { prezzo: number|null, codice: string, valido: boolean }
   */
  function calculatePrice(lineaIdx, partenzaIdx, arrivoIdx, tariffario, tariffarioAggiornato = null) {
    // Inizializza risultato di default
    const result = {
      prezzo: null,
      codice: '',
      valido: false
    };

    // Valida la selezione
    if (!isValidSelection(lineaIdx, partenzaIdx, arrivoIdx, tariffario)) {
      return result;
    }

    try {
      const lineaNum = parseInt(lineaIdx);
      const partenzaNum = parseInt(partenzaIdx);
      const arrivoNum = parseInt(arrivoIdx);

      const linea = tariffario[lineaNum];

      // Verifica che esistano le matrici prezzi e codici
      const hasPrezzi = linea.prezzi && Array.isArray(linea.prezzi);
      const hasCodici = linea.codici && Array.isArray(linea.codici);

      // Se mancano entrambe le matrici, ritorna risultato non valido
      if (!hasPrezzi && !hasCodici) {
        return result; // { prezzo: null, codice: '', valido: false }
      }

      // Calcola il prezzo dalla matrice
      let prezzo = null;
      if (hasPrezzi) {
        if (linea.prezzi[partenzaNum] && Array.isArray(linea.prezzi[partenzaNum])) {
          const val = linea.prezzi[partenzaNum][arrivoNum];
          // Accetta solo numeri finiti; NaN/Infinity -> null
          if (typeof val === 'number' && Number.isFinite(val)) {
            prezzo = val;
          } else {
            prezzo = null;
          }
        }
      }

      // Recupera il codice biglietto
      const codice = getTicketCode(lineaIdx, partenzaIdx, arrivoIdx, tariffario, tariffarioAggiornato);

      // Il risultato è valido se abbiamo almeno un prezzo o un codice
      const valido = prezzo !== null || codice !== '';

      return {
        prezzo: prezzo,
        codice: codice,
        valido: valido
      };
    } catch (error) {
      console.warn('Errore calcolo prezzo:', error);
      return result;
    }
  }

  /**
   * Formatta un prezzo per la visualizzazione
   * @param {number|null|undefined} prezzo - Prezzo da formattare
   * @returns {string} Prezzo formattato come "X.XX €" o "-"
   */
  function formatPrice(prezzo) {
    // Non formattare valori null/undefined o non finiti
    if (prezzo === null || prezzo === undefined || !Number.isFinite(prezzo)) {
      return '-';
    }
    return prezzo.toFixed(2) + ' €';
  }

  // API Pubblica
  window.Pricing = {
    calculatePrice: calculatePrice,
    getTicketCode: getTicketCode,
    isValidSelection: isValidSelection,
    isRouteAvailable: isRouteAvailable,
    formatPrice: formatPrice
  };

  console.log('✅ Modulo prezzi.js caricato');

})();

