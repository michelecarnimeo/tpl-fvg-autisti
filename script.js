// script.js - Gestione logica TPL FVG

// Elementi DOM
const mainApp = document.getElementById('main-app');
const darkModeToggle = document.getElementById('darkmode-toggle');
const lineaSelect = document.getElementById('linea');
const partenzaSelect = document.getElementById('partenza');
const arrivoSelect = document.getElementById('arrivo');
const swapBtn = document.getElementById('swap-btn');
const prezzoErrore = document.getElementById('prezzo-errore');
const summaryPrezzo = document.getElementById('summary-prezzo');
const summaryCodice = document.getElementById('summary-codice');
const summaryPartenza = document.getElementById('summary-partenza');
const summaryArrivo = document.getElementById('summary-arrivo');
const footerYear = document.getElementById('footer-year');
// PWA install elements
const pwaBanner = document.getElementById('pwa-install-banner');
const pwaBtnInstall = document.getElementById('pwa-install-button');
const pwaBtnLater = document.getElementById('pwa-install-later');
const pwaIosHint = document.getElementById('pwa-ios-hint');

// DOM Elements loaded successfully

// Stato applicazione
let tariffario = [];
let tariffarioAggiornato = null;
let lineaIdx = '';
let partenzaIdx = '';
let arrivoIdx = '';
let hasCalculated = false;
let deferredInstallPrompt = null; // beforeinstallprompt event

// Utility dark mode
function setDarkMode(isDark) {
  document.documentElement.classList.toggle('dark', isDark);
  try {
    localStorage.setItem('tpl.isDark', isDark ? '1' : '0');
  } catch { }
  // Aggiorna i colori del body per tutte le pagine
  updateBodyColors(isDark);
}

function updateBodyColors(isDark) {
  const body = document.body;
  if (isDark) {
    body.className = body.className.replace(/bg-background-light|text-foreground-light/g, '') + ' bg-background-dark text-foreground-dark';
  } else {
    body.className = body.className.replace(/bg-background-dark|text-foreground-dark/g, '') + ' bg-background-light text-foreground-light';
  }
}

function toggleDark() {
  const isDark = !document.documentElement.classList.contains('dark');
  setDarkMode(isDark);
  
  // Aggiorna l'icona del toggle
  updateToggleIcon(isDark);
}

// Funzione per aggiornare l'icona del toggle
function updateToggleIcon(isDark) {
  const toggleIcon = darkModeToggle.querySelector('span');
  if (toggleIcon) {
    toggleIcon.textContent = isDark ? '☀️' : '🌙';
  }
}


// Popola select linea
function populateLinee() {
  if (!lineaSelect) return; // Non siamo su index.html
  lineaSelect.innerHTML = '<option value="">Seleziona una linea</option>';
  tariffario.forEach((l, i) => {
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = l.nome;
    lineaSelect.appendChild(opt);
  });
}

// Popola select partenza/arrivo
function populateFermate() {
  if (!partenzaSelect || !arrivoSelect) return; // Non siamo su index.html
  
  if (lineaIdx === '' || !tariffario[lineaIdx]) {
    partenzaSelect.innerHTML = '<option value="">Prima seleziona una linea</option>';
    arrivoSelect.innerHTML = '<option value="">Prima seleziona una linea</option>';
    partenzaSelect.disabled = true;
    arrivoSelect.disabled = true;
    return;
  }
  
  partenzaSelect.innerHTML = '<option value="">Seleziona la partenza</option>';
  arrivoSelect.innerHTML = '<option value="">Seleziona l\'arrivo</option>';
  
  const fermate = tariffario[lineaIdx].fermate;
  fermate.forEach((f, i) => {
    const opt1 = document.createElement('option');
    opt1.value = i;
    opt1.textContent = f;
    partenzaSelect.appendChild(opt1);
    const opt2 = document.createElement('option');
    opt2.value = i;
    opt2.textContent = f;
    arrivoSelect.appendChild(opt2);
  });
  partenzaSelect.disabled = false;
  arrivoSelect.disabled = false;
}

// Controlla e aggiorna lo stato della card prezzo
function updatePriceCardState() {
  const priceCard = document.getElementById('price-card');
  if (!priceCard) return;
  
  // Attiva la card solo se entrambi i campi partenza e arrivo sono selezionati
  const bothSelected = partenzaIdx !== '' && arrivoIdx !== '';
  
  if (bothSelected) {
    priceCard.classList.remove('inactive');
  } else {
    priceCard.classList.add('inactive');
  }
}

// Aggiorna riepilogo selezioni
function updateSummary() {
  if (!summaryPartenza || !summaryArrivo) return; // Non siamo su index.html
  const fermate = (lineaIdx !== '' && tariffario[lineaIdx]) ? tariffario[lineaIdx].fermate : [];
  summaryPartenza.textContent = partenzaIdx !== '' && fermate[partenzaIdx] ? fermate[partenzaIdx] : '-';
  summaryArrivo.textContent = arrivoIdx !== '' && fermate[arrivoIdx] ? fermate[arrivoIdx] : '-';
  
  // Aggiorna lo stato della card prezzo
  updatePriceCardState();
}

// Calcola prezzo e codice automaticamente
function calcolaPrezzo() {
  if (!summaryPrezzo || !summaryCodice || !prezzoErrore) return; // Non siamo su index.html
  let prezzo = null;
  let codice = '';
  const selezioniValide = lineaIdx !== '' && partenzaIdx !== '' && arrivoIdx !== '' && partenzaIdx !== arrivoIdx;

  if (selezioniValide) {
    // Calcola il prezzo
    try {
      const val = tariffario[parseInt(lineaIdx)].prezzi[parseInt(partenzaIdx)][parseInt(arrivoIdx)];
      prezzo = typeof val === 'number' ? val : null;
    } catch { }

    // Recupera il codice biglietto
    try {
      let c = tariffario[parseInt(lineaIdx)]?.codici?.[parseInt(partenzaIdx)]?.[parseInt(arrivoIdx)] || '';
      if (!c && tariffarioAggiornato) {
        const fermate = tariffario[lineaIdx].fermate;
        const partenza = fermate[parseInt(partenzaIdx)];
        const arrivo = fermate[parseInt(arrivoIdx)];
        const match = tariffarioAggiornato.find(e => e.partenza === partenza && e.arrivo === arrivo);
        if (match?.codice_biglietto) c = match.codice_biglietto;
      }
      codice = c;
    } catch { }

    // Mostra automaticamente il risultato
    summaryPrezzo.textContent = prezzo !== null ? prezzo.toFixed(2) + ' €' : '-';
    summaryCodice.textContent = codice ? codice : '-';
    prezzoErrore.style.display = (prezzo === null) ? 'block' : 'none';
  } else {
    // Nessuna selezione valida
    summaryPrezzo.textContent = '-';
    summaryCodice.textContent = '-';
    prezzoErrore.style.display = 'none';
  }

  // Il pulsante swap è abilitato se partenza e arrivo sono selezionati
  const swapEnabled = lineaIdx !== '' && partenzaIdx !== '' && arrivoIdx !== '';
  if (swapBtn) {
    swapBtn.disabled = !swapEnabled;
  }
}

// Funzione swap globale
window.swapRoutes = function () {
  if (lineaIdx !== '' && partenzaIdx !== '' && arrivoIdx !== '') {
    const tmp = partenzaIdx;
    partenzaIdx = arrivoIdx;
    arrivoIdx = tmp;
    hasCalculated = false;
    partenzaSelect.value = partenzaIdx;
    arrivoSelect.value = arrivoIdx;
    updateSummary();
    calcolaPrezzo();
  }
};

// Funzione calcola globale
window.calculatePrice = function () {
  hasCalculated = true;
  calcolaPrezzo();
};

// Funzione reset filtri (linea, partenza, arrivo e risultati)
function resetFilters() {
  // Reset tutto: linea, partenza e arrivo
  lineaIdx = '';
  partenzaIdx = '';
  arrivoIdx = '';
  hasCalculated = false;
  
  // Reset select linea
  if (lineaSelect) {
    lineaSelect.value = '';
  }
  
  // Reset select partenza e arrivo usando la logica esistente
  if (partenzaSelect) {
    partenzaSelect.value = '';
    partenzaSelect.innerHTML = '<option value="">Prima seleziona una linea</option>';
    partenzaSelect.disabled = true;
  }
  
  if (arrivoSelect) {
    arrivoSelect.value = '';
    arrivoSelect.innerHTML = '<option value="">Prima seleziona una linea</option>';
    arrivoSelect.disabled = true;
  }
  
  // Reset card prezzo
  if (priceCard) {
    priceCard.classList.add('inactive');
  }
  
  // Reset summary e prezzo usando la logica esistente
  updateSummary();
  calcolaPrezzo();
  
  // Assicurati che il pulsante swap sia disabilitato
  const swapBtn = document.getElementById('swap-btn');
  if (swapBtn) {
    swapBtn.disabled = true;
    swapBtn.style.opacity = '0.5';
    swapBtn.style.cursor = 'not-allowed';
  }
  
  // Reset tutto nel LocalStorage
  try {
    localStorage.removeItem('tpl.lineaIdx');
    localStorage.removeItem('tpl.partenzaIdx');
    localStorage.removeItem('tpl.arrivoIdx');
  } catch { }
  
  // Feedback visivo
  const resetBtn = document.getElementById('reset-btn');
  if (resetBtn) {
    resetBtn.style.transform = 'scale(0.95)';
    setTimeout(() => {
      resetBtn.style.transform = 'scale(1)';
    }, 150);
  }
}

// Funzione reset cache
function resetCache() {
  // Mostra il modal di conferma
  const modal = document.getElementById('cache-modal');
  if (modal) {
    modal.style.display = 'block';
  }
}

// Funzione conferma reset cache
function confirmResetCache() {
  // Cancella la cache del Service Worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function(registrations) {
      for(let registration of registrations) {
        registration.unregister();
      }
    });
  }
  
  // Cancella la cache del browser
  if ('caches' in window) {
    caches.keys().then(function(names) {
      for (let name of names) {
        caches.delete(name);
      }
    });
  }
  
  // Cancella il LocalStorage
  try {
    localStorage.clear();
  } catch { }
  
  // Torna alla pagina di benvenuto
  setTimeout(() => {
    window.location.href = 'benvenuto.html';
  }, 500);
}

// Funzione annulla reset cache
function cancelResetCache() {
  const modal = document.getElementById('cache-modal');
  if (modal) {
    modal.style.display = 'none';
  }
}

// Event listeners
if (darkModeToggle) darkModeToggle.addEventListener('click', toggleDark);

// Event listener per reset cache
const cacheResetBtn = document.getElementById('cache-reset');
if (cacheResetBtn) {
  cacheResetBtn.addEventListener('click', resetCache);
}

// Event listeners per modal cache
const cacheCancelBtn = document.getElementById('cache-cancel');
const cacheConfirmBtn = document.getElementById('cache-confirm');
const cacheModal = document.getElementById('cache-modal');

if (cacheCancelBtn) {
  cacheCancelBtn.addEventListener('click', cancelResetCache);
}

if (cacheConfirmBtn) {
  cacheConfirmBtn.addEventListener('click', confirmResetCache);
}

// Chiudi modal cliccando fuori
if (cacheModal) {
  cacheModal.addEventListener('click', function(e) {
    if (e.target === cacheModal) {
      cancelResetCache();
    }
  });
}

// Chiudi modal con ESC
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    const modal = document.getElementById('cache-modal');
    if (modal && modal.style.display === 'block') {
      cancelResetCache();
    }
  }
});
if (lineaSelect) {
  lineaSelect.addEventListener('change', e => {
    lineaIdx = e.target.value;
    partenzaIdx = '';
    arrivoIdx = '';
    hasCalculated = false;
    populateFermate();
    updateSummary();
    calcolaPrezzo();
    try { localStorage.setItem('tpl.lineaIdx', lineaIdx); } catch { }
  });
}
if (partenzaSelect) {
  partenzaSelect.addEventListener('change', e => {
    partenzaIdx = e.target.value;
    hasCalculated = false;
    updateSummary();
    updatePriceCardState();
    calcolaPrezzo();
    try { localStorage.setItem('tpl.partenzaIdx', partenzaIdx); } catch { }
  });
}
if (arrivoSelect) {
  arrivoSelect.addEventListener('change', e => {
    arrivoIdx = e.target.value;
    hasCalculated = false;
    updateSummary();
    updatePriceCardState();
    calcolaPrezzo();
    try { localStorage.setItem('tpl.arrivoIdx', arrivoIdx); } catch { }
  });
}
// I pulsanti swap e calcola usano onclick nell'HTML, non servono listener qui

// Footer year
if (footerYear) footerYear.textContent = new Date().getFullYear();

// Caricamento dati e stato iniziale
async function loadData() {
  try {
    const res = await fetch('database.json');
    tariffario = await res.json();
    console.log('Database caricato, tariffario.length:', tariffario.length);
  } catch { tariffario = []; }

  // tariffarioAggiornato rimane null (file opzionale non presente)
  tariffarioAggiornato = null;

  populateLinee();

  // Notifica che i dati sono pronti
  window.dispatchEvent(new Event('tariffarioLoaded'));
  // Ripristina selezioni da localStorage
  try {
    const storedDark = localStorage.getItem('tpl.isDark');
    const isDark = storedDark === '1';
    setDarkMode(isDark);
    updateToggleIcon(isDark); // Aggiorna l'icona del toggle
    const sLinea = localStorage.getItem('tpl.lineaIdx');
    const sPart = localStorage.getItem('tpl.partenzaIdx');
    const sArr = localStorage.getItem('tpl.arrivoIdx');
    if (sLinea !== null) lineaIdx = sLinea;
    if (sPart !== null) partenzaIdx = sPart;
    if (sArr !== null) arrivoIdx = sArr;
  } catch { }
  populateFermate();
  if (lineaIdx && lineaSelect) lineaSelect.value = lineaIdx;
  if (partenzaIdx && partenzaSelect) partenzaSelect.value = partenzaIdx;
  if (arrivoIdx && arrivoSelect) arrivoSelect.value = arrivoIdx;
  updateSummary();
  calcolaPrezzo();
}

// --- TRATTE LOGIC ---
function renderTratte(lineaIndex = 0) {
  console.log('renderTratte chiamata con lineaIndex:', lineaIndex);
  const andataList = document.getElementById('fermate-andata');
  const ritornoList = document.getElementById('fermate-ritorno');
  const gridContainer = document.getElementById('tratte-grid-container');
  const searchContainer = document.getElementById('search-container-fermate');

  console.log('andataList:', !!andataList, 'ritornoList:', !!ritornoList, 'tariffario[lineaIndex]:', !!tariffario[lineaIndex]);

  if (!andataList || !ritornoList || !tariffario[lineaIndex]) {
    console.error('Impossibile generare liste tratte');
    return;
  }

  const linea = tariffario[lineaIndex];
  const fermate = linea.fermate;
  console.log('Rendering liste tratte per linea:', linea.nome, 'con', fermate.length, 'fermate');

  // Pulisce le liste precedenti
  andataList.innerHTML = '';
  ritornoList.innerHTML = '';

  // Popola lista andata (0 → fine) - INCLUDE TUTTE LE FERMATE
  for (let i = 0; i < fermate.length; i++) {
    const li = document.createElement('li');
    li.classList.add('fermate-item');
    li.innerHTML = `<span class="fermate-icon">📍</span><span class="fermate-number">${i + 1}</span><span class="fermate-stop">${fermate[i]}</span>`;
    andataList.appendChild(li);
  }

  // Popola lista ritorno (fine → 0) - INCLUDE TUTTE LE FERMATE
  for (let i = fermate.length - 1; i >= 0; i--) {
    const li = document.createElement('li');
    li.classList.add('tratte-item');
    li.innerHTML = `<span class="tratte-icon">📍</span><span class="tratte-number">${fermate.length - i}</span><span class="tratte-stop">${fermate[i]}</span>`;
    ritornoList.appendChild(li);
  }

  // Mostra griglia e ricerca
  if (gridContainer) gridContainer.style.display = 'grid';
  if (searchContainer) searchContainer.style.display = 'flex';
}

// --- TARIFFE LOGIC ---
function renderTariffe(lineaIndex = 0) {
  console.log('renderTariffe chiamata con lineaIndex:', lineaIndex);
  const andataTable = document.getElementById('prezzi-andata');
  const ritornoTable = document.getElementById('prezzi-ritorno');
  console.log('andataTable:', !!andataTable, 'ritornoTable:', !!ritornoTable, 'tariffario[lineaIndex]:', !!tariffario[lineaIndex]);

  if (!andataTable || !ritornoTable || !tariffario[lineaIndex]) {
    console.error('Impossibile generare tabelle tariffe');
    return;
  }

  const linea = tariffario[lineaIndex];
  const fermate = linea.fermate;
  console.log('Rendering tabelle tariffe per linea:', linea.nome, 'con', fermate.length, 'fermate');

  // Helper per tabella
  function buildTable(filterFn) {
    let html = '<thead><tr>';
    html += '<th>Partenza</th>';
    html += '<th>Arrivo</th>';
    html += '<th>Prezzo</th>';
    html += '<th>Codice</th>';
    html += '</tr></thead><tbody>';
    const rows = [];
    for (let i = 0; i < fermate.length; i++) {
      for (let j = 0; j < fermate.length; j++) {
        if (i === j) continue;
        if (!filterFn(i, j)) continue;
        const prezzo = linea.prezzi?.[i]?.[j] ?? null;
        let codice = linea.codici?.[i]?.[j] ?? '';
        if (!codice && tariffarioAggiornato) {
          const match = tariffarioAggiornato.find(e => e.partenza === fermate[i] && e.arrivo === fermate[j]);
          if (match?.codice_biglietto) codice = match.codice_biglietto;
        }
        rows.push({ partenza: fermate[i], arrivo: fermate[j], prezzo, codice });
      }
    }
    rows.forEach(r => {
      html += '<tr>';
      html += `<td>${r.partenza}</td>`;
      html += `<td>${r.arrivo}</td>`;
      html += `<td style="text-align: right;">${typeof r.prezzo === 'number' ? r.prezzo.toFixed(2) + ' €' : '-'}</td>`;
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

// Popola select linee per pagina tratte
function populateLineeTratte() {
  const lineaSelect = document.getElementById('linea-fermate');
  if (!lineaSelect) return;

  lineaSelect.innerHTML = '<option value="">Seleziona una linea</option>';
  tariffario.forEach((l, i) => {
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = l.nome;
    lineaSelect.appendChild(opt);
  });

  // Event listener per cambio linea
  lineaSelect.addEventListener('change', (e) => {
    const selectedIndex = e.target.value;
    const gridContainer = document.getElementById('fermate-grid-container');
    const searchContainer = document.getElementById('search-container-fermate');
    const andataTitle = document.getElementById('andata-title');
    const ritornoTitle = document.getElementById('ritorno-title');

    if (selectedIndex !== '') {
      const linea = tariffario[parseInt(selectedIndex)];
      const fermate = linea.fermate;

      // Aggiorna titoli
      const firstStop = fermate[0];
      const lastStop = fermate[fermate.length - 1];
      if (andataTitle) andataTitle.textContent = `(${firstStop} → ${lastStop})`;
      if (ritornoTitle) ritornoTitle.textContent = `(${lastStop} → ${firstStop})`;

      // Mostra griglia e ricerca
      if (gridContainer) gridContainer.style.display = 'grid';
      if (searchContainer) searchContainer.style.display = 'flex';

      // Renderizza tratte con l'indice selezionato
      renderTratte(parseInt(selectedIndex));
    } else {
      // Nascondi griglia e ricerca se deseleziona
      if (gridContainer) gridContainer.style.display = 'none';
      if (searchContainer) searchContainer.style.display = 'none';
    }
  });
}

// Popola select linee per pagina tariffe
function populateLineeTariffe() {
  const lineaSelect = document.getElementById('linea-tariffe');
  if (!lineaSelect) return;

  lineaSelect.innerHTML = '<option value="">Seleziona una linea</option>';
  tariffario.forEach((l, i) => {
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = l.nome;
    lineaSelect.appendChild(opt);
  });

  // Event listener per cambio linea
  lineaSelect.addEventListener('change', (e) => {
    const selectedIndex = e.target.value;
    const gridContainer = document.getElementById('prezzi-grid-container');
    const searchContainer = document.getElementById('search-container-prezzi');
    const andataTitle = document.getElementById('andata-title');
    const ritornoTitle = document.getElementById('ritorno-title');

    if (selectedIndex !== '') {
      const linea = tariffario[parseInt(selectedIndex)];
      const fermate = linea.fermate;

      // Aggiorna titoli
      const firstStop = fermate[0];
      const lastStop = fermate[fermate.length - 1];
      if (andataTitle) andataTitle.textContent = `(${firstStop} → ${lastStop})`;
      if (ritornoTitle) ritornoTitle.textContent = `(${lastStop} → ${firstStop})`;

      // Mostra griglia e ricerca
      if (gridContainer) gridContainer.style.display = 'grid';
      if (searchContainer) searchContainer.style.display = 'flex';

      // Renderizza tariffe con l'indice selezionato
      renderTariffe(parseInt(selectedIndex));
    } else {
      // Nascondi griglia e ricerca se deseleziona
      if (gridContainer) gridContainer.style.display = 'none';
      if (searchContainer) searchContainer.style.display = 'none';
    }
  });
}

// Funzione di ricerca per tariffe
function setupRicercaTariffe() {
  const searchInput = document.getElementById('search-input-tariffe');
  const clearBtn = document.getElementById('clear-search-tariffe');

  if (searchInput && clearBtn) {
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

    // Pulsante clear
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

// Modifico initTratteTariffe per includere tariffe
function initTratteTariffe() {
  console.log('initTratteTariffe chiamata');

  // Per pagina tratte, popola il selettore tratte
  if (window.location.pathname.endsWith('fermate.html')) {
    populateLineeTratte();
  }
  // Per pagina tariffe, popola il selettore tariffe
  else if (window.location.pathname.endsWith('prezzi.html')) {
    populateLineeTariffe();
    setupRicercaTariffe();
  }
}

// Avvia logica tratte/tariffe solo se siamo su tratte.html o tariffe.html
if (window.location.pathname.endsWith('fermate.html') || window.location.pathname.endsWith('prezzi.html')) {
  console.log('Su pagina tratte/tariffe, pathname:', window.location.pathname);

  // Ascolta l'evento di caricamento dati
  window.addEventListener('tariffarioLoaded', () => {
    console.log('Evento tariffarioLoaded ricevuto, chiamo initTratteTariffe');
    initTratteTariffe();
  });
}

// Funzionalità di ricerca per tratte
if (window.location.pathname.endsWith('tratte.html')) {
  window.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const clearBtn = document.getElementById('clear-search');

    if (searchInput && clearBtn) {
      searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const fermateItems = document.querySelectorAll('.fermate-item');

        // Mostra/nascondi pulsante clear
        clearBtn.style.display = searchTerm ? 'flex' : 'none';

        // Filtra fermate
        tratteItems.forEach(item => {
          const text = item.textContent.toLowerCase();
          if (text.includes(searchTerm)) {
            item.style.display = '';
          } else {
            item.style.display = 'none';
          }
        });
      });

      // Pulsante clear
      clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        clearBtn.style.display = 'none';
        document.querySelectorAll('.fermate-item').forEach(item => {
          item.style.display = '';
        });
        searchInput.focus();
      });
    }
  });
}

// Funzione per tornare in cima alla pagina
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

// Funzione per mostrare/nascondere il pulsante torna su
function toggleScrollToTopButton() {
  const scrollButton = document.querySelector('.scroll-to-top');
  if (scrollButton) {
    if (window.pageYOffset > 300) {
      scrollButton.classList.add('visible');
    } else {
      scrollButton.classList.remove('visible');
    }
  }
}

// Event listener per lo scroll
window.addEventListener('scroll', toggleScrollToTopButton);

window.addEventListener('DOMContentLoaded', loadData);

// --- HAMBURGER MENU LOGIC ---
(function() {
  const hamburgerToggle = document.getElementById('hamburger-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
  const mobileMenuClose = document.getElementById('mobile-menu-close');
  const mobileDarkmodeToggle = document.getElementById('mobile-darkmode-toggle');
  const mobileCacheReset = document.getElementById('mobile-cache-reset');

  if (!hamburgerToggle || !mobileMenu || !mobileMenuOverlay) return;

  // Apri menu
  function openMenu() {
    hamburgerToggle.classList.add('active');
    mobileMenu.classList.add('active');
    mobileMenuOverlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // Blocca scroll
  }

  // Chiudi menu
  function closeMenu() {
    hamburgerToggle.classList.remove('active');
    mobileMenu.classList.remove('active');
    mobileMenuOverlay.classList.remove('active');
    document.body.style.overflow = ''; // Ripristina scroll
  }

  // Click su hamburger
  if (hamburgerToggle) {
    hamburgerToggle.addEventListener('click', () => {
      if (mobileMenu.classList.contains('active')) {
        closeMenu();
      } else {
        openMenu();
      }
    });
  }

  // Click su X per chiudere
  if (mobileMenuClose) {
    mobileMenuClose.addEventListener('click', closeMenu);
  }

  // Click su overlay per chiudere
  if (mobileMenuOverlay) {
    mobileMenuOverlay.addEventListener('click', closeMenu);
  }

  // Chiudi menu quando si clicca su un link
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Dark mode toggle da menu mobile
  if (mobileDarkmodeToggle) {
    mobileDarkmodeToggle.addEventListener('click', () => {
      toggleDark();
      closeMenu();
    });
  }

  // Cache reset da menu mobile
  if (mobileCacheReset) {
    mobileCacheReset.addEventListener('click', () => {
      resetCache();
      closeMenu();
    });
  }

  // Chiudi menu con ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
      closeMenu();
    }
  });
})();

// Event listener per pulsante reset (solo su index.html)
if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/')) {
  window.addEventListener('DOMContentLoaded', () => {
    const resetBtn = document.getElementById('reset-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', resetFilters);
    }

    // --- PWA Install logic (Android/Chrome + iOS fallback) ---
    function isStandalone() {
      return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
    }

    function canShowAgain() {
      try {
        const lastDismiss = localStorage.getItem('tpl.pwa.dismissTs');
        if (!lastDismiss) return true;
        const days = 7; // ripropone dopo 7 giorni
        return Date.now() - parseInt(lastDismiss, 10) > days * 24 * 60 * 60 * 1000;
      } catch { return true; }
    }

    function showBanner() {
      if (pwaBanner && !isStandalone()) {
        pwaBanner.style.display = 'block';
      }
    }

    function hideBanner() {
      if (pwaBanner) pwaBanner.style.display = 'none';
    }

    // Gestione Android/Chrome via beforeinstallprompt
    window.addEventListener('beforeinstallprompt', (e) => {
      // Mostra solo se non già installata e con frequenza
      if (isStandalone() || !canShowAgain()) return;
      e.preventDefault();
      deferredInstallPrompt = e;
      if (pwaIosHint) pwaIosHint.style.display = 'none';
      showBanner();
    });

    // Click su Installa (Android/Chrome/iOS)
    if (pwaBtnInstall) {
      pwaBtnInstall.addEventListener('click', async () => {
        if (deferredInstallPrompt) {
          // Android/Chrome: usa prompt nativo
          deferredInstallPrompt.prompt();
          const { outcome } = await deferredInstallPrompt.userChoice;
          deferredInstallPrompt = null;
          hideBanner();
          if (outcome === 'dismissed') {
            try { localStorage.setItem('tpl.pwa.dismissTs', String(Date.now())); } catch {}
          }
        } else {
          // iOS o browser senza evento: toggle hint con animazione
          if (pwaIosHint) {
            const isVisible = pwaIosHint.style.display === 'block';
            if (isVisible) {
              pwaIosHint.style.display = 'none';
            } else {
              pwaIosHint.style.display = 'block';
              // Scroll smooth verso hint
              setTimeout(() => {
                pwaIosHint.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
              }, 100);
            }
          }
        }
      });
    }

    // Click su Più tardi
    if (pwaBtnLater) {
      pwaBtnLater.addEventListener('click', () => {
        hideBanner();
        try { localStorage.setItem('tpl.pwa.dismissTs', String(Date.now())); } catch {}
      });
    }

    // Evento installata
    window.addEventListener('appinstalled', () => {
      hideBanner();
      try { localStorage.removeItem('tpl.pwa.dismissTs'); } catch {}
    });

    // iOS detection e hint (include anche iPadOS 13+)
    function isIOSDevice() {
      const userAgent = window.navigator.userAgent.toLowerCase();
      const isIPhone = /iphone|ipod/.test(userAgent);
      const isIPad = /ipad/.test(userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      return isIPhone || isIPad;
    }
    
    const isSafari = /^((?!chrome|android).)*safari/i.test(window.navigator.userAgent);
    
    if (isIOSDevice() && isSafari && !isStandalone() && canShowAgain()) {
      // iOS: mostra banner con hint visibile e nascondi pulsante "Installa"
      if (pwaIosHint) pwaIosHint.style.display = 'block';
      if (pwaBtnInstall) pwaBtnInstall.style.display = 'none';
      showBanner();
    }
    
    // Listener per visibilità pagina (nasconde banner quando app va in background)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && isStandalone()) {
        hideBanner();
      }
    });
  });
}
