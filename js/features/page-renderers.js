/**
 * Page Renderers - Funzioni per rendering pagine fermate.html e prezzi.html
 * Modulo per gestire il rendering delle liste fermate e tabelle prezzi
 */

(function () {
  'use strict';

  /**
   * Helper per ottenere i dati del tariffario
   * @returns {Array} Array del tariffario
   */
  function getTariffario() {
    if (typeof window.Tariffario !== 'undefined' && window.Tariffario.getData) {
      return window.Tariffario.getData();
    }
    // Fallback per retrocompatibilità
    return window.tariffario || [];
  }

  /**
   * Helper per ottenere i dati del tariffario aggiornato
   * @returns {Array|null} Array del tariffario aggiornato o null
   */
  function getTariffarioAggiornato() {
    if (typeof window.Tariffario !== 'undefined' && window.Tariffario.getAggiornato) {
      return window.Tariffario.getAggiornato();
    }
    // Fallback per retrocompatibilità
    return window.tariffarioAggiornato || null;
  }

  /**
   * Helper per ordinare fermate per distanza
   * @param {Array} fermate - Array di nomi fermate
   * @param {Object} userPos - Posizione utente {lat, lng}
   * @returns {Array} Array di oggetti {name, index, distance, coordinates}
   */
  function sortFermateByDistance(fermate, userPos) {
    if (window.Geolocation && window.Geolocation.sortFermateByDistance) {
      return window.Geolocation.sortFermateByDistance(fermate, userPos);
    }
    console.warn('⚠️ Geolocation module not available, returning unsorted fermate');
    return fermate.map((name, index) => ({ name, index, distance: null, coordinates: null }));
  }

  /**
   * Renderizza le liste fermate per la pagina fermate.html
   * @param {number} lineaIndex - Indice della linea selezionata
   * @param {boolean} sortByDistance - Se true, ordina le fermate per distanza
   */
  // Stato direzione corrente (true = andata, false = ritorno)
  let currentDirection = true;

  /**
   * Renderizza la direzione corrente (andata o ritorno)
   * NOTA: Funzione disabilitata - la vecchia card fermate è stata rimossa
   * Ora le fermate sono mostrate solo nella card sotto la mappa
   */
  async function renderCurrentDirection() {
    // Funzione disabilitata - vecchia card rimossa
    console.log('ℹ️ renderCurrentDirection disabilitata - vecchia card rimossa');
    return;
  }

  /**
   * Inizializza il pulsante toggle direzione
   * NOTA: Funzione disabilitata - la vecchia card fermate è stata rimossa
   */
  function initDirectionToggle() {
    // Funzione disabilitata - vecchia card rimossa
    console.log('ℹ️ initDirectionToggle disabilitata - vecchia card rimossa');
  }

  function renderFermate(lineaIndex = 0, sortByDistance = false) {
    console.log('renderFermate chiamata con lineaIndex:', lineaIndex, 'sortByDistance:', sortByDistance);
    
    const tariffarioData = getTariffario();

    if (!tariffarioData[lineaIndex]) {
      console.error('Impossibile generare lista fermate - tariffario non valido');
      return;
    }

    const linea = tariffarioData[lineaIndex];
    let fermate = linea.fermate;
    console.log('Rendering lista fermate per linea:', linea.nome, 'con', fermate.length, 'fermate');

    // La vecchia card fermate è stata rimossa, ora usiamo solo la card sotto la mappa
    console.log('ℹ️ Card fermate vecchia rimossa, uso solo card sotto mappa');
    
    // Dispatch evento per inizializzare accordion mobile
    window.dispatchEvent(new CustomEvent('fermateRendered', {
      detail: { lineaIndex, fermateCount: fermate.length }
    }));
    
    console.log('✅ renderFermate completata. Fermate:', fermate.length);

    console.log('🗺️ Verifico disponibilità LineMap...', {
      windowLineMap: typeof window.LineMap,
      updateFunction: typeof window.LineMap?.update
    });

    if (window.LineMap && typeof window.LineMap.update === 'function') {
      console.log('🗺️ LineMap disponibile, preparo dati mappa...');
      
      const stopsWithCoords = (linea.fermateDettaglio || linea.fermate || []).map((stop, idx) => {
        // Se è già un oggetto con coordinate, assicurati che abbia un nome
        if (typeof stop === 'object' && stop.coords) {
          return {
            name: stop.name || stop.nome || `Fermata ${idx + 1}`,
            coords: stop.coords
          };
        }
        // Altrimenti crea un oggetto con nome e coordinate null
        const stopName = typeof stop === 'string' ? stop : (stop?.name || stop?.nome || `Fermata ${idx + 1}`);
        return {
          name: stopName,
          coords: stop?.coords || null
        };
      });

      const lineMapPayload = {
        name: linea.nome,
        summary: linea.percorso || linea.descrizione || null,
        stops: stopsWithCoords
      };

      console.log('🗺️ Chiamo LineMap.update con:', lineMapPayload);
      // Passa l'indice della linea come primo parametro (per le coordinate Linea 400)
      window.LineMap.update(lineaIndex, lineMapPayload);
    } else {
      console.warn('⚠️ LineMap non disponibile o update non è una funzione');
    }
  }

  /**
   * Renderizza le tabelle prezzi per la pagina prezzi.html
   * @param {number} lineaIndex - Indice della linea selezionata
   */
  function renderPrezzi(lineaIndex = 0) {
    console.log('renderPrezzi chiamata con lineaIndex:', lineaIndex);
    
    const andataTable = document.getElementById('prezzi-andata');
    const ritornoTable = document.getElementById('prezzi-ritorno');
    
    const tariffarioData = getTariffario();
    const tariffarioAggiornato = getTariffarioAggiornato();

    console.log('andataTable:', !!andataTable, 'ritornoTable:', !!ritornoTable, 'tariffario[lineaIndex]:', !!tariffarioData[lineaIndex]);

    if (!andataTable || !ritornoTable || !tariffarioData[lineaIndex]) {
      console.error('Impossibile generare tabelle prezzi');
      return;
    }

    const linea = tariffarioData[lineaIndex];
    const fermate = linea.fermate;
    console.log('Rendering tabelle prezzi per linea:', linea.nome, 'con', fermate.length, 'fermate');

    // Helper per tabella (usa Pricing.js)
    function buildTable(filterFn) {
      let html = '<thead><tr>';
      html += '<th>Partenza</th>';
      html += '<th>Arrivo</th>';
      html += '<th>Prezzo</th>';
      html += '<th>Codice</th>';
      html += '</tr></thead><tbody>';
      const rows = [];

      // Usa Pricing.js se disponibile, altrimenti fallback diretto
      const usePricing = typeof Pricing !== 'undefined' && Pricing.calculatePrice && Pricing.formatPrice;

      for (let i = 0; i < fermate.length; i++) {
        for (let j = 0; j < fermate.length; j++) {
          if (i === j) continue;
          if (!filterFn(i, j)) continue;

          let prezzo = null;
          let codice = '';

          if (usePricing) {
            // Usa Pricing.js per recuperare codice e prezzo
            const result = Pricing.calculatePrice(lineaIndex, i, j, tariffarioData, tariffarioAggiornato);
            prezzo = result.prezzo;
            codice = result.codice;
          } else {
            // Fallback: accesso diretto alla matrice
            prezzo = linea.prezzi?.[i]?.[j] ?? null;
            codice = linea.codici?.[i]?.[j] ?? '';
            if (!codice && tariffarioAggiornato) {
              const match = tariffarioAggiornato.find(e => e.partenza === fermate[i] && e.arrivo === fermate[j]);
              if (match?.codice_biglietto) codice = match.codice_biglietto;
            }
          }

          rows.push({ partenza: fermate[i], arrivo: fermate[j], prezzo, codice });
        }
      }

      rows.forEach(r => {
        html += '<tr>';
        html += `<td>${r.partenza}</td>`;
        html += `<td>${r.arrivo}</td>`;

        // Usa Pricing.formatPrice() se disponibile
        const prezzoFormatted = usePricing ? Pricing.formatPrice(r.prezzo) :
          (typeof r.prezzo === 'number' ? r.prezzo.toFixed(2) + ' €' : '-');
        html += `<td style="text-align: right;">${prezzoFormatted}</td>`;
        html += `<td>${r.codice || '—'}</td>`;
        html += '</tr>';
      });
      html += '</tbody>';
      return html;
    }

    // Andata: partenzaIdx < arrivoIdx
    andataTable.innerHTML = buildTable((i, j) => i < j);
    // Ritorno: partenzaIdx > arrivoIdx
    ritornoTable.innerHTML = buildTable((i, j) => i > j);
  }

  /**
   * Setup ricerca per tabelle prezzi
   * Configura l'input di ricerca e il pulsante clear per filtrare le righe delle tabelle
   */
  function setupRicercaPrezzi() {
    const searchInput = document.getElementById('search-input-prezzi');
    const clearBtn = document.getElementById('clear-search-prezzi');

    if (searchInput && clearBtn) {
      // Event listener per input ricerca
      searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const tables = document.querySelectorAll('.prezzi-table');

        // Mostra/nascondi pulsante clear
        clearBtn.style.display = searchTerm ? 'flex' : 'none';

        // Filtra righe delle tabelle
        tables.forEach(table => {
          const rows = table.querySelectorAll('tbody tr');
          rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            if (text.includes(searchTerm)) {
              row.style.display = '';
            } else {
              row.style.display = 'none';
            }
          });
        });
      });

      // Event listener per pulsante clear
      clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        clearBtn.style.display = 'none';
        const tables = document.querySelectorAll('.prezzi-table');
        tables.forEach(table => {
          const rows = table.querySelectorAll('tbody tr');
          rows.forEach(row => {
            row.style.display = '';
          });
        });
        searchInput.focus();
      });
    }
  }

  /**
   * Popola modal linee per pagina fermate
   */
  function populateLineeTratte() {
    const tariffarioData = getTariffario();
    console.log('populateLineeTratte chiamata, tariffario.length:', tariffarioData ? tariffarioData.length : 0);
    
    const lineeModalList = document.getElementById('linee-fermate-modal-list');
    const lineaBtn = document.getElementById('linea-fermate-btn');

    if (!lineeModalList) {
      console.warn('⚠️ linee-fermate-modal-list non trovato');
      return;
    }

    // Verifica che tariffario sia caricato
    if (!tariffarioData || tariffarioData.length === 0) {
      console.error('❌ Tariffario non ancora caricato in populateLineeTratte!');
      return;
    }

    // Popola modal con le linee
    lineeModalList.innerHTML = '';
    tariffarioData.forEach((l, i) => {
      const li = document.createElement('li');
      li.className = 'linea-modal-item';
      li.dataset.lineaIdx = i;

      // Estrai numero linea dal nome (es: "Linea 400 Udine-Grado" -> "400")
      const lineaNumMatch = l.nome.match(/\d+/);
      const lineaNum = lineaNumMatch ? lineaNumMatch[0] : (i + 1);

      // Estrai percorso (es: "Udine-Grado")
      const percorso = l.nome.replace(/Linea\s+\d+\s*/i, '');

      // Crea struttura HTML con icona e dettagli
      li.innerHTML = `
        <div class="linea-badge">
          <span class="linea-icon">🚌</span>
          <span class="linea-number">${lineaNum}</span>
        </div>
        <div class="linea-details">
          <span class="linea-route">${percorso}</span>
          <span class="linea-stops">${l.fermate.length} fermate</span>
        </div>
        <span class="linea-arrow">›</span>
      `;

      li.addEventListener('click', () => selectLineaFermate(i, l.nome));
      lineeModalList.appendChild(li);
    });

    // Event listener per apertura modal
    if (lineaBtn) {
      // Rimuovi listener esistenti per evitare duplicati
      lineaBtn.replaceWith(lineaBtn.cloneNode(true));
      const newLineaBtn = document.getElementById('linea-fermate-btn');
      if (newLineaBtn) {
        newLineaBtn.addEventListener('click', openLineeModalFermate);
      }
    }
    
    // Event listener per chiusura modal
    const closeBtn = document.getElementById('linee-fermate-modal-close');
    if (closeBtn) {
      // Rimuovi listener esistenti per evitare duplicati
      closeBtn.replaceWith(closeBtn.cloneNode(true));
      const newCloseBtn = document.getElementById('linee-fermate-modal-close');
      if (newCloseBtn) {
        newCloseBtn.addEventListener('click', closeLineeModalFermate);
      }
    }
    
    // Chiudi modal quando si clicca fuori
    const lineeModal = document.getElementById('linee-fermate-modal');
    if (lineeModal) {
      lineeModal.addEventListener('click', (e) => {
        if (e.target === lineeModal) {
          closeLineeModalFermate();
        }
      });
    }
  }

  /**
   * Apri modal linee per fermate
   */
  function openLineeModalFermate() {
    console.log('openLineeModalFermate chiamata');
    const lineeModal = document.getElementById('linee-fermate-modal');
    if (!lineeModal) {
      console.error('❌ linee-fermate-modal non trovato!');
      return;
    }
    
    // Verifica che il modal sia popolato
    const lineeModalList = document.getElementById('linee-fermate-modal-list');
    if (!lineeModalList || lineeModalList.children.length === 0) {
      console.warn('⚠️ Modal non ancora popolato, richiamo populateLineeTratte...');
      const tariffarioData = getTariffario();
      if (tariffarioData && tariffarioData.length > 0) {
        populateLineeTratte();
      } else {
        console.error('❌ Tariffario non ancora caricato!');
        return;
      }
    }

    lineeModal.style.display = 'flex';
    setTimeout(() => lineeModal.classList.add('show'), 10);
    console.log('✅ Modal linee aperto');
  }

  /**
   * Chiudi modal linee per fermate
   */
  function closeLineeModalFermate() {
    const lineeModal = document.getElementById('linee-fermate-modal');
    if (!lineeModal) return;

    lineeModal.classList.remove('show');
    setTimeout(() => {
      lineeModal.style.display = 'none';
    }, 300);
  }

  /**
   * Seleziona linea da modal fermate
   */
  function selectLineaFermate(idx, nome) {
    console.log('selectLineaFermate chiamata con idx:', idx, 'nome:', nome);
    
    // Converti idx a numero se necessario
    const lineaIndex = typeof idx === 'string' ? parseInt(idx, 10) : idx;
    
    const tariffarioData = getTariffario();
    
    // Verifica che tariffario sia caricato
    if (!tariffarioData || tariffarioData.length === 0) {
      console.error('❌ Tariffario non ancora caricato!');
      return;
    }
    
    // Verifica che l'indice sia valido
    if (lineaIndex < 0 || lineaIndex >= tariffarioData.length) {
      console.error('❌ Indice linea non valido:', lineaIndex, 'tariffario.length:', tariffarioData.length);
      return;
    }
    
    const lineaBtn = document.getElementById('linea-fermate-btn');
    const lineaText = document.getElementById('linea-fermate-text');
    const gridContainer = document.getElementById('fermate-grid-container');
    const searchContainer = document.getElementById('search-container-fermate');
    const directionTitle = document.getElementById('fermate-direction-title');

    // Aggiorna testo pulsante e salva indice
    if (lineaText) {
      lineaText.textContent = nome;
    }
    if (lineaBtn) {
      lineaBtn.dataset.selectedIndex = lineaIndex;
    }

    // Aggiorna titoli e mostra fermate
    const linea = tariffarioData[lineaIndex];
    
    if (!linea || !linea.fermate) {
      console.error('❌ Linea non valida o fermate mancanti:', linea);
      return;
    }
    
    const fermate = linea.fermate;

    // La vecchia card fermate è stata rimossa, ora usiamo solo la card sotto la mappa
    console.log('ℹ️ Card fermate vecchia rimossa, uso solo card sotto mappa');

    // Renderizza tratte con l'indice selezionato
    console.log('Chiamata renderFermate con indice:', lineaIndex);
    renderFermate(lineaIndex);

    // Chiudi modal
    closeLineeModalFermate();
  }

  /**
   * Popola modal linee per pagina prezzi
   */
  function populateLineePrezzi() {
    const tariffarioData = getTariffario();
    console.log('populateLineePrezzi chiamata, tariffario.length:', tariffarioData ? tariffarioData.length : 0);
    
    const lineeModalList = document.getElementById('linee-prezzi-modal-list');
    const lineaBtn = document.getElementById('linea-prezzi-btn');

    if (!lineeModalList) return;

    // Popola modal con le linee
    lineeModalList.innerHTML = '';
    tariffarioData.forEach((l, i) => {
      const li = document.createElement('li');
      li.className = 'linea-modal-item';
      li.dataset.lineaIdx = i;

      // Estrai numero linea dal nome (es: "Linea 400 Udine-Grado" -> "400")
      const lineaNumMatch = l.nome.match(/\d+/);
      const lineaNum = lineaNumMatch ? lineaNumMatch[0] : (i + 1);

      // Estrai percorso (es: "Udine-Grado")
      const percorso = l.nome.replace(/Linea\s+\d+\s*/i, '');

      // Crea struttura HTML con icona e dettagli
      li.innerHTML = `
        <div class="linea-badge">
          <span class="linea-icon">🚌</span>
          <span class="linea-number">${lineaNum}</span>
        </div>
        <div class="linea-details">
          <span class="linea-route">${percorso}</span>
          <span class="linea-stops">${l.fermate.length} fermate</span>
        </div>
        <span class="linea-arrow">›</span>
      `;

      li.addEventListener('click', () => selectLineaPrezzi(i, l.nome));
      lineeModalList.appendChild(li);
    });

    // Event listener per apertura modal
    if (lineaBtn) {
      lineaBtn.addEventListener('click', openLineeModalPrezzi);
    }
  }

  /**
   * Apri modal linee per prezzi
   */
  function openLineeModalPrezzi() {
    const lineeModal = document.getElementById('linee-prezzi-modal');
    if (!lineeModal) return;

    lineeModal.style.display = 'flex';
    setTimeout(() => lineeModal.classList.add('show'), 10);
  }

  /**
   * Chiudi modal linee per prezzi
   */
  function closeLineeModalPrezzi() {
    const lineeModal = document.getElementById('linee-prezzi-modal');
    if (!lineeModal) return;

    lineeModal.classList.remove('show');
    setTimeout(() => {
      lineeModal.style.display = 'none';
    }, 300);
  }

  /**
   * Seleziona linea da modal prezzi
   */
  function selectLineaPrezzi(idx, nome) {
    const lineaBtn = document.getElementById('linea-prezzi-btn');
    const lineaText = document.getElementById('linea-prezzi-text');
    const gridContainer = document.getElementById('prezzi-grid-container');
    const searchContainer = document.getElementById('search-container-prezzi');
    const andataTitle = document.getElementById('andata-title');
    const ritornoTitle = document.getElementById('ritorno-title');

    // Aggiorna testo pulsante e salva indice
    if (lineaText) {
      lineaText.textContent = nome;
    }
    if (lineaBtn) {
      lineaBtn.dataset.selectedIndex = idx;
    }

    const tariffarioData = getTariffario();

    // Aggiorna titoli e mostra prezzi
    const linea = tariffarioData[idx];
    const fermate = linea.fermate;

    // Aggiorna titoli
    const firstStop = fermate[0];
    const lastStop = fermate[fermate.length - 1];
    if (andataTitle) andataTitle.textContent = `Prezzi e codici biglietto (${firstStop} → ${lastStop})`;
    if (ritornoTitle) ritornoTitle.textContent = `Prezzi e codici biglietto (${lastStop} → ${firstStop})`;

    // Mostra griglia e ricerca
    if (gridContainer) gridContainer.style.display = 'grid';
    if (searchContainer) searchContainer.style.display = 'flex';

    // Renderizza prezzi con l'indice selezionato
    renderPrezzi(idx);

    // Chiudi modal
    closeLineeModalPrezzi();
  }

  /**
   * Inizializza le pagine fermate.html e prezzi.html
   * Chiamata quando l'evento 'tariffarioLoaded' viene emesso
   */
  function initFermatePrezzi() {
    console.log('initFermatePrezzi chiamata');

    // Per pagina fermate, popola il selettore linee
    if (window.location.pathname.endsWith('fermate.html')) {
      populateLineeTratte();
    }
    // Per pagina prezzi, popola il selettore linee e setup ricerca
    else if (window.location.pathname.endsWith('prezzi.html')) {
      populateLineePrezzi();
      setupRicercaPrezzi();
    }
  }

  /**
   * Setup inizializzazione pagine fermate/prezzi
   * Ascolta l'evento 'tariffarioLoaded' e inizializza la pagina corrente
   */
  function init() {
    // La vecchia card fermate è stata rimossa, non serve più inizializzare il toggle direzione
    // Le fermate sono ora mostrate solo nella card sotto la mappa

    // Avvia logica solo se siamo su fermate.html o prezzi.html
    if (window.location.pathname.endsWith('fermate.html') || window.location.pathname.endsWith('prezzi.html')) {
      console.log('Su pagina fermate/prezzi, pathname:', window.location.pathname);

      // Ascolta l'evento di caricamento dati
      window.addEventListener('tariffarioLoaded', () => {
        console.log('Evento tariffarioLoaded ricevuto, chiamo initFermatePrezzi');
        initFermatePrezzi();
      });

      // Se il tariffario è già caricato, inizializza immediatamente
      if (window.Tariffario && window.Tariffario.isLoaded && window.Tariffario.isLoaded()) {
        console.log('Tariffario già caricato, inizializzo immediatamente');
        initFermatePrezzi();
      }
    }
  }

  // API pubblica
  window.PageRenderers = {
    // Rendering
    renderFermate: renderFermate,
    renderPrezzi: renderPrezzi,
    setupRicercaPrezzi: setupRicercaPrezzi,
    // Selezione linee - Fermate
    populateLineeTratte: populateLineeTratte,
    selectLineaFermate: selectLineaFermate,
    openLineeModalFermate: openLineeModalFermate,
    closeLineeModalFermate: closeLineeModalFermate,
    // Selezione linee - Prezzi
    populateLineePrezzi: populateLineePrezzi,
    selectLineaPrezzi: selectLineaPrezzi,
    openLineeModalPrezzi: openLineeModalPrezzi,
    closeLineeModalPrezzi: closeLineeModalPrezzi,
    // Inizializzazione
    initFermatePrezzi: initFermatePrezzi,
    init: init
  };

  // Espone funzioni globali per retrocompatibilità
  window.renderFermate = renderFermate;
  window.renderPrezzi = renderPrezzi;
  window.setupRicercaPrezzi = setupRicercaPrezzi;
  window.populateLineeTratte = populateLineeTratte;
  window.populateLineePrezzi = populateLineePrezzi;
  window.selectLineaFermate = selectLineaFermate;
  window.selectLineaPrezzi = selectLineaPrezzi;
  window.openLineeModalFermate = openLineeModalFermate;
  window.closeLineeModalFermate = closeLineeModalFermate;
  window.openLineeModalPrezzi = openLineeModalPrezzi;
  window.closeLineeModalPrezzi = closeLineeModalPrezzi;
  window.initFermatePrezzi = initFermatePrezzi;

  // Inizializza automaticamente se siamo su fermate.html o prezzi.html
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  console.log('✅ Modulo page-renderers.js caricato');
})();

