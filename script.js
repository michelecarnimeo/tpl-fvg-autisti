// script.js - Gestione logica TPL FVG

// ========================================
// SEZIONE 0: FEEDBACK APTICO (VIBRAZIONE)
// ========================================

// Pattern di vibrazione predefiniti
const HAPTIC_PATTERNS = {
  light: 20,           // Micro feedback (tap generico)
  medium: 50,          // Feedback standard (selezione)
  strong: 100,         // Feedback importante (successo)
  success: [100, 50, 100], // Pattern successo
  warning: [50, 30, 50],   // Pattern avviso
  error: 200           // Vibrazione lunga (errore)
};

// Funzione principale per feedback aptico
function triggerHaptic(pattern = 'light') {
  // Verifica se il feedback aptico è abilitato
  const isEnabled = localStorage.getItem('tpl.hapticFeedback') === 'true';
  if (!isEnabled) return;
  
  // Verifica supporto API Vibration
  if (!navigator.vibrate) {
    console.log('⚠️ API Vibration non supportata');
    return;
  }
  
  // Ottieni il pattern
  const vibrationPattern = HAPTIC_PATTERNS[pattern] || pattern;
  
  try {
    navigator.vibrate(vibrationPattern);
    console.log(`📳 Vibrazione: ${pattern}`);
  } catch (error) {
    console.error('❌ Errore vibrazione:', error);
  }
}

// ========================================
// SEZIONE 1: RILEVAMENTO POSIZIONE
// ========================================
// Sistema di rilevamento posizione per ordinare fermate per distanza
let userPosition = null;
let locationPermissionGranted = false;

// Funzione per calcolare la distanza tra due coordinate (formula di Haversine)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Raggio della Terra in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distanza in km
}

// Funzione per richiedere la posizione dell'utente
function requestUserLocation() {
  return new Promise((resolve, reject) => {
    if (!isGeolocationSupported()) {
      const error = new Error('Geolocalizzazione non supportata dal browser');
      error.code = 0;
      reject(error);
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 15000, // Aumentato a 15 secondi
      maximumAge: 300000 // 5 minuti
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Verifica che la posizione sia valida
        if (!position.coords.latitude || !position.coords.longitude) {
          const error = new Error('Coordinate non valide');
          error.code = 2;
          reject(error);
          return;
        }

        userPosition = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        };
        locationPermissionGranted = true;
        console.log('Posizione rilevata:', userPosition);
        resolve(userPosition);
      },
      (error) => {
        console.error('Errore geolocalizzazione:', error);
        locationPermissionGranted = false;
        
        // Aggiungi codice errore se non presente
        if (!error.code) {
          error.code = 0; // Errore sconosciuto
        }
        
        reject(error);
      },
      options
    );
  });
}

// Funzione per ordinare fermate per distanza dalla posizione utente
function sortFermateByDistance(fermate, userPos) {
  if (!userPos) return fermate;

  // Coordinate approssimative delle fermate (da aggiornare con dati reali)
  const fermateCoordinates = {
    "Udine": { lat: 46.0625, lon: 13.2354 },
    "Lauzacco": { lat: 45.9833, lon: 13.2833 },
    "S. Stefano Udinese": { lat: 45.9667, lon: 13.3000 },
    "S. Maria La Longa": { lat: 45.9333, lon: 13.3167 },
    "Mereto Di Capitolo": { lat: 45.9167, lon: 13.3333 },
    "Palmanova": { lat: 45.9000, lon: 13.3500 },
    "Sevegliano": { lat: 45.8833, lon: 13.3667 },
    "Strassoldo": { lat: 45.8667, lon: 13.3833 },
    "Muscoli": { lat: 45.8500, lon: 13.4000 },
    "Cervignano SS14": { lat: 45.8333, lon: 13.4167 },
    "Cervignano FS": { lat: 45.8300, lon: 13.4200 },
    "Cervignano AUT": { lat: 45.8275, lon: 13.4225 },
    "Terzo Di Aquileia": { lat: 45.8167, lon: 13.4333 },
    "Aquileia": { lat: 45.8000, lon: 13.4500 },
    "Belvedere": { lat: 45.7833, lon: 13.4667 },
    "Grado": { lat: 45.7667, lon: 13.4833 }
  };

  return fermate.map((fermata, index) => {
    const coords = fermateCoordinates[fermata];
    let distance = null;
    
    if (coords) {
      distance = calculateDistance(
        userPos.latitude, 
        userPos.longitude, 
        coords.lat, 
        coords.lon
      );
    }

    return {
      name: fermata,
      index: index,
      distance: distance,
      coordinates: coords
    };
  }).sort((a, b) => {
    if (a.distance === null && b.distance === null) return 0;
    if (a.distance === null) return 1;
    if (b.distance === null) return -1;
    return a.distance - b.distance;
  });
}

// Funzione per verificare se la geolocalizzazione è supportata
function isGeolocationSupported() {
  return 'geolocation' in navigator;
}

// Funzione per mostrare/nascondere il pulsante di geolocalizzazione
function toggleLocationButton(show) {
  const locationBtn = document.getElementById('location-btn');
  if (locationBtn) {
    // Mostra solo se la geolocalizzazione è supportata
    const shouldShow = show && isGeolocationSupported();
    locationBtn.style.display = shouldShow ? 'flex' : 'none';
    
    // Se è il pulsante piccolo (index.html), usa display: flex
    if (locationBtn.classList.contains('location-btn-small')) {
      locationBtn.style.display = shouldShow ? 'flex' : 'none';
    }
  }
}

// Funzione per mostrare/nascondere il pulsante di inversione
function toggleSwapButton(show) {
  const swapBtn = document.getElementById('swap-btn');
  if (swapBtn) {
    swapBtn.style.display = show ? 'flex' : 'none';
  }
}

// Funzione per aggiornare l'icona del pulsante geolocalizzazione
function updateLocationButtonIcon(hasLocation) {
  const locationIcon = document.getElementById('location-icon');
  if (locationIcon) {
    locationIcon.textContent = hasLocation ? '📍' : '📍';
  }
}

// ========================================
// SEZIONE 1: ANIMAZIONE SFONDO
// ========================================
// Controllo dell'animazione del gradiente di sfondo
let animationEnabled = false;

// Funzione per abilitare/disabilitare l'animazione
function toggleAnimation() {
  console.log('Toggle animation clicked, current state:', animationEnabled);
  animationEnabled = !animationEnabled;
  
  if (animationEnabled) {
    document.body.classList.add('animation-enabled');
    console.log('Animation enabled, class added to body');
    // Aggiorna tutti i pulsanti
    document.querySelectorAll('.animation-toggle, #mobile-animation-toggle').forEach(btn => {
      btn.classList.add('active');
    });
  } else {
    document.body.classList.remove('animation-enabled');
    console.log('Animation disabled, class removed from body');
    // Aggiorna tutti i pulsanti
    document.querySelectorAll('.animation-toggle, #mobile-animation-toggle').forEach(btn => {
      btn.classList.remove('active');
    });
  }
  
  // Salva la preferenza
  localStorage.setItem('animationEnabled', animationEnabled);
  console.log('Animation state saved:', animationEnabled);
}

// Carica la preferenza salvata
function loadAnimationPreference() {
  const saved = localStorage.getItem('animationEnabled');
  if (saved === 'true') {
    animationEnabled = true;
    document.body.classList.add('animation-enabled');
    document.querySelectorAll('.animation-toggle, #mobile-animation-toggle').forEach(btn => {
      btn.classList.add('active');
    });
  }
}

// Elementi DOM
const mainApp = document.getElementById('main-app');
const darkModeToggle = document.getElementById('darkmode-toggle');
const lineaBtn = document.getElementById('linea-btn');
const lineaText = document.getElementById('linea-text');
const partenzaBtn = document.getElementById('partenza-btn');
const arrivoBtn = document.getElementById('arrivo-btn');
const partenzaText = document.getElementById('partenza-text');
const arrivoText = document.getElementById('arrivo-text');
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
// Modal fermate elements
const fermateModal = document.getElementById('fermate-modal');
const fermateModalTitle = document.getElementById('fermate-modal-title');
const fermateModalClose = document.getElementById('fermate-modal-close');
const fermateSearchInput = document.getElementById('fermate-search-input');
const fermateClearSearch = document.getElementById('fermate-clear-search');
const fermateModalList = document.getElementById('fermate-modal-list');
const fermateLocationBtn = document.getElementById('fermate-location-btn');
const fermateLocationIcon = document.getElementById('fermate-location-icon');
const fermateLocationText = document.getElementById('fermate-location-text');

// Modal linee elements
const lineeModal = document.getElementById('linee-modal');
const lineeModalTitle = document.getElementById('linee-modal-title');
const lineeModalClose = document.getElementById('linee-modal-close');
const lineeModalList = document.getElementById('linee-modal-list');

// DOM Elements loaded successfully

// Stato applicazione
let tariffario = [];
let tariffarioAggiornato = null;
let lineaIdx = '';
let partenzaIdx = '';
let arrivoIdx = '';
let hasCalculated = false;
let deferredInstallPrompt = null; // beforeinstallprompt event
// Modal fermate state
let currentModalType = ''; // 'partenza' o 'arrivo'
let filteredFermate = [];

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
  // Nuovo sistema: cicla tra light/dark (non usa più system per il toggle manuale)
  const isDark = !document.documentElement.classList.contains('dark');
  const newMode = isDark ? 'dark' : 'light';
  
  localStorage.setItem('tpl.themeMode', newMode);
  document.documentElement.classList.toggle('dark', isDark);
  updateBodyColors(isDark);
  updateToggleIcon(isDark);
  updateMobileDarkModeButton(isDark);
  
  console.log('Tema cambiato manualmente a:', newMode);
}

// Funzione per aggiornare l'icona del toggle
function updateToggleIcon(isDark) {
  const toggleIcon = darkModeToggle.querySelector('span');
  if (toggleIcon) {
    toggleIcon.textContent = isDark ? '☀️' : '🌙';
  }
}

// Funzione per aggiornare il pulsante mobile dark mode
function updateMobileDarkModeButton(isDark) {
  const mobileBtn = document.getElementById('mobile-darkmode-toggle');
  if (!mobileBtn) return;
  
  const icon = mobileBtn.querySelector('.mobile-nav-icon');
  const text = mobileBtn.querySelector('span:not(.mobile-nav-icon)');
  
  if (icon) {
    icon.textContent = isDark ? '☀️' : '🌙';
  }
  
  if (text) {
    text.textContent = isDark ? 'Modalità chiara' : 'Modalità scura';
  }
}

// ================================
// SISTEMA ACCESSIBILITÀ - DIMENSIONE TESTO
// ================================

// Livelli di dimensione testo
const fontSizeLevels = ['normal', 'large', 'xlarge'];
let currentFontSizeIndex = 0;

// Funzione per impostare la dimensione del testo
function setFontSize(level) {
  // Rimuovi tutte le classi di dimensione testo
  document.body.classList.remove('font-size-normal', 'font-size-large', 'font-size-xlarge');
  
  // Aggiungi la nuova classe
  document.body.classList.add(`font-size-${level}`);
  
  // Salva preferenza in localStorage
  try {
    localStorage.setItem('tpl.fontSize', level);
  } catch { }
  
  // Aggiorna il pulsante
  updateFontSizeButton(level);
  
  // Aggiorna il testo nel menu mobile
  updateMobileFontSizeText(level);
}

// Funzione per aggiornare i pulsanti (stato attivo)
function updateFontSizeButton(level) {
  // Aggiorna pulsanti desktop
  const desktopButtons = document.querySelectorAll('.font-size-btn');
  desktopButtons.forEach(btn => {
    if (btn.dataset.size === level) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
  
  // Aggiorna pulsanti mobile
  const mobileButtons = document.querySelectorAll('.mobile-font-btn');
  mobileButtons.forEach(btn => {
    if (btn.dataset.size === level) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
  
  // Aggiorna pulsanti benvenuto
  const benvenutoButtons = document.querySelectorAll('.benvenuto-font-btn');
  benvenutoButtons.forEach(btn => {
    if (btn.dataset.size === level) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

// Funzione per aggiornare il testo nel menu mobile (deprecata, mantenuta per compatibilità)
function updateMobileFontSizeText(level) {
  // Non più necessaria con i nuovi pulsanti separati
}

// Inizializza dimensione testo dal localStorage
function initFontSize() {
  try {
    const savedFontSize = localStorage.getItem('tpl.fontSize');
    if (savedFontSize && fontSizeLevels.includes(savedFontSize)) {
      currentFontSizeIndex = fontSizeLevels.indexOf(savedFontSize);
      setFontSize(savedFontSize);
    } else {
      setFontSize('normal');
    }
  } catch {
    setFontSize('normal');
  }
}


// Popola modale linee con stile avanzato
function populateLinee() {
  if (!lineeModalList) return; // Non siamo su index.html
  lineeModalList.innerHTML = '';
  tariffario.forEach((l, i) => {
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
    
    li.addEventListener('click', () => selectLinea(i, l.nome));
    lineeModalList.appendChild(li);
  });
}

// Abilita/disabilita pulsanti partenza/arrivo
function updateFermateButtons() {
  if (!partenzaBtn || !arrivoBtn) return; // Non siamo su index.html
  
  if (lineaIdx === '' || !tariffario[lineaIdx]) {
    partenzaText.textContent = 'Prima seleziona una linea';
    arrivoText.textContent = 'Prima seleziona una linea';
    partenzaBtn.disabled = true;
    arrivoBtn.disabled = true;
    
    // Nascondi pulsanti geolocalizzazione e swap
    toggleLocationButton(false);
    toggleSwapButton(false);
    return;
  }
  
  partenzaText.textContent = 'Seleziona la partenza';
  arrivoText.textContent = 'Seleziona la destinazione';
  partenzaBtn.disabled = false;
  arrivoBtn.disabled = false;
  
  // Mostra pulsanti geolocalizzazione e swap
  toggleLocationButton(true);
  toggleSwapButton(true);
}

// Funzioni per gestire il modale delle fermate
function openFermateModal(type) {
  if (!fermateModal || lineaIdx === '' || !tariffario[lineaIdx]) return;
  
  currentModalType = type;
  fermateModalTitle.textContent = type === 'partenza' ? 'Seleziona fermata di partenza' : 'Seleziona fermata di arrivo';
  
  // Mostra/nascondi pulsante geolocalizzazione solo per la partenza
  if (fermateLocationBtn) {
    if (type === 'partenza') {
      fermateLocationBtn.style.display = 'flex'; // Pulsante inline full-width
    } else {
      fermateLocationBtn.style.display = 'none';
    }
  }
  
  // Popola la lista delle fermate
  populateFermateList();
  
  // Mostra il modale
  fermateModal.classList.add('show');
  fermateModal.style.display = 'flex';
}

function closeFermateModal() {
  if (!fermateModal) return;
  
  fermateModal.classList.remove('show');
  setTimeout(() => {
    fermateModal.style.display = 'none';
  }, 300);
  
  // Reset ricerca
  if (fermateSearchInput) {
    fermateSearchInput.value = '';
    fermateSearchInput.dispatchEvent(new Event('input'));
  }
}

// === FUNZIONI MODALE LINEE ===
function openLineeModal() {
  if (!lineeModal) return;
  
  lineeModal.style.display = 'flex';
  setTimeout(() => lineeModal.classList.add('show'), 10);
}

function closeLineeModal() {
  if (!lineeModal) return;
  
  lineeModal.classList.remove('show');
  setTimeout(() => {
    lineeModal.style.display = 'none';
  }, 300);
}

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
  
  // Salva in localStorage
  try { 
    localStorage.setItem('tpl.lineaIdx', lineaIdx); 
  } catch { }
  
  closeLineeModal();
}

function populateFermateList() {
  if (!fermateModalList || !tariffario[lineaIdx]) return;
  
  const fermate = tariffario[lineaIdx].fermate;
  filteredFermate = fermate.map((fermata, index) => ({ name: fermata, index }));
  
  renderFermateList();
}

function renderFermateList() {
  if (!fermateModalList) return;
  
  fermateModalList.innerHTML = '';
  
  filteredFermate.forEach(({ name, index }) => {
    const li = document.createElement('li');
    li.textContent = name;
    li.dataset.index = index;
    
    // Evidenzia la fermata selezionata
    if (currentModalType === 'partenza' && index == partenzaIdx) {
      li.classList.add('selected');
    } else if (currentModalType === 'arrivo' && index == arrivoIdx) {
      li.classList.add('selected');
    }
    
    li.addEventListener('click', () => selectFermata(index));
    fermateModalList.appendChild(li);
  });
}

function selectFermata(index) {
  if (currentModalType === 'partenza') {
    partenzaIdx = index;
    partenzaText.textContent = tariffario[lineaIdx].fermate[index];
  } else if (currentModalType === 'arrivo') {
    arrivoIdx = index;
    arrivoText.textContent = tariffario[lineaIdx].fermate[index];
  }
  
  hasCalculated = false;
  updateSummary();
  calcolaPrezzo();
  
  // Salva nello storage
  try {
    if (currentModalType === 'partenza') {
      localStorage.setItem('tpl.partenzaIdx', partenzaIdx);
    } else {
      localStorage.setItem('tpl.arrivoIdx', arrivoIdx);
    }
  } catch { }
  
  closeFermateModal();
}

function filterFermate(searchTerm) {
  if (!tariffario[lineaIdx]) return;
  
  const fermate = tariffario[lineaIdx].fermate;
  const term = searchTerm.toLowerCase().trim();
  
  if (term === '') {
    filteredFermate = fermate.map((fermata, index) => ({ name: fermata, index }));
  } else {
    filteredFermate = fermate
      .map((fermata, index) => ({ name: fermata, index }))
      .filter(({ name }) => name.toLowerCase().includes(term));
  }
  
  renderFermateList();
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
    
    // Aggiorna i testi dei pulsanti
    if (tariffario[lineaIdx]) {
      partenzaText.textContent = tariffario[lineaIdx].fermate[partenzaIdx];
      arrivoText.textContent = tariffario[lineaIdx].fermate[arrivoIdx];
    }
    
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
  
  // Reset card prezzo
  if (priceCard) {
    priceCard.classList.add('inactive');
  }
  
  // Reset summary e prezzo usando la logica esistente
  updateSummary();
  calcolaPrezzo();
  
  // Nascondi pulsanti geolocalizzazione e swap
  toggleLocationButton(false);
  toggleSwapButton(false);
  
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
// Versione corrente dell'app
const CURRENT_VERSION = '1.5.0';
const VERSION_DATE = '27 Ottobre 2025';
const VERSION_TIME = '11:07';

// Funzione helper per aggiornare versione, data e ora
function updateVersion(version, date, time) {
  // Questa funzione può essere usata per aggiornare programmaticamente versione, data e ora
  // Utile per automatizzare gli aggiornamenti
  console.log(`Aggiornamento versione: ${version} - ${date} alle ${time}`);
}

async function checkForUpdates() {
  // Mostra il modal di verifica
  const modal = document.getElementById('cache-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalMessage = document.getElementById('modal-message');
  const modalWarning = document.getElementById('modal-warning');
  const confirmBtn = document.getElementById('cache-confirm');
  const cancelBtn = document.getElementById('cache-cancel');
  
  if (!modal) return;
  
  modal.style.display = 'block';
  modalTitle.innerHTML = '🔄 Verifica Aggiornamenti';
  modalMessage.innerHTML = '<p style="text-align: center;">⏳ Verifica aggiornamenti in corso...</p>';
  modalWarning.style.display = 'none';
  confirmBtn.style.display = 'none';
  if (cancelBtn) cancelBtn.textContent = 'Chiudi';
  
  try {
    // Aggiunge un timestamp per evitare la cache del browser
    const timestamp = new Date().getTime();
    const response = await fetch(`version.json?t=${timestamp}`, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });
    
    if (!response.ok) {
      throw new Error('Impossibile recuperare le informazioni sulla versione');
    }
    
    const remoteVersion = await response.json();
    const currentVersion = CURRENT_VERSION;
    const remoteVersionNum = remoteVersion.version;
    
    // Confronta le versioni
    const isUpdateAvailable = compareVersions(remoteVersionNum, currentVersion) > 0;
    const isDifferentVersion = remoteVersionNum !== currentVersion;
    
    if (isUpdateAvailable) {
      // C'è un aggiornamento disponibile
      modalTitle.innerHTML = '🎉 Aggiornamento Disponibile!';
      modalMessage.innerHTML = `
        <div style="text-align: center;">
          <div style="background: #dcfce7; border: 2px solid #22c55e; border-radius: 8px; padding: 1.25rem; margin-bottom: 1rem;">
            <p style="margin: 0 0 0.5rem 0; color: #15803d; font-weight: 600; font-size: 1.1em;">
              ✨ Nuova versione disponibile!
            </p>
            <p style="margin: 0; color: #166534; font-size: 0.95em;">
              Versione attuale: <strong>${currentVersion}</strong><br>
              Nuova versione: <strong style="color: #22c55e;">${remoteVersionNum}</strong>
            </p>
          </div>
          ${remoteVersion.updateNotes ? `
            <div style="background: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 1rem; margin-bottom: 1rem;">
              <p style="margin: 0 0 0.5rem 0; color: #0c4a6e; font-weight: 600; font-size: 0.9em;">
                📝 Novità:
              </p>
              <p style="margin: 0; color: #075985; font-size: 0.9em;">
                ${remoteVersion.updateNotes}
              </p>
            </div>
          ` : ''}
          <div style="background: #fef3c7; border: 2px solid #f59e0b; border-radius: 8px; padding: 1rem;">
            <p style="margin: 0; color: #92400e; font-size: 0.95em; line-height: 1.5;">
              ⚠️ Premendo "Aggiorna Ora", l'app si aggiornerà e riavvierà automaticamente.
            </p>
          </div>
        </div>
      `;
      confirmBtn.textContent = 'Aggiorna Ora';
      confirmBtn.style.display = 'block';
      modalWarning.style.display = 'none';
      
    } else if (isDifferentVersion) {
      // Versione diversa ma non più recente (downgrade o versione personalizzata)
      modalTitle.innerHTML = 'ℹ️ Versione Diversa Rilevata';
      modalMessage.innerHTML = `
        <div style="text-align: center;">
          <div style="background: #fff7ed; border: 2px solid #f97316; border-radius: 8px; padding: 1.25rem; margin-bottom: 1rem;">
            <p style="margin: 0 0 0.5rem 0; color: #9a3412; font-weight: 600;">
              Versione server: ${remoteVersionNum}
            </p>
            <p style="margin: 0; color: #9a3412;">
              Versione locale: ${currentVersion}
            </p>
          </div>
          <p style="color: #666; font-size: 0.9em;">
            Vuoi comunque riavviare l'app?
          </p>
        </div>
      `;
      confirmBtn.textContent = 'Riavvia App';
      confirmBtn.style.display = 'block';
      
    } else {
      // App già aggiornata
      modalTitle.innerHTML = '✅ App Aggiornata';
      modalMessage.innerHTML = `
        <div style="text-align: center;">
          <div style="background: #dcfce7; border: 2px solid #22c55e; border-radius: 8px; padding: 1.25rem; margin-bottom: 1rem;">
            <p style="margin: 0; color: #15803d; font-weight: 600; font-size: 1.1em;">
              ✨ Stai usando l'ultima versione!
            </p>
          </div>
          <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 1rem; margin-bottom: 1rem;">
            <p style="margin: 0 0 0.5rem 0; color: #374151; font-weight: 600; font-size: 0.95em;">
              Versione: <strong>${currentVersion}</strong>
            </p>
            <p style="margin: 0; color: #6b7280; font-size: 0.85em;">
              Pubblicata: ${VERSION_DATE} alle ${VERSION_TIME}
            </p>
          </div>
          <p style="color: #666; font-size: 0.9em; margin-top: 1rem;">
            Vuoi comunque riavviare l'app?
          </p>
        </div>
      `;
      confirmBtn.textContent = 'Riavvia App';
      confirmBtn.style.display = 'block';
    }
    
  } catch (error) {
    console.error('Errore verifica aggiornamenti:', error);
    
    // Errore nella verifica (probabilmente offline o problema di rete)
    modalTitle.innerHTML = '⚠️ Verifica non Disponibile';
    modalMessage.innerHTML = `
      <div style="text-align: center;">
        <div style="background: #fee2e2; border: 2px solid #ef4444; border-radius: 8px; padding: 1.25rem; margin-bottom: 1rem;">
          <p style="margin: 0 0 0.5rem 0; color: #991b1b; font-weight: 600;">
            ❌ Impossibile verificare gli aggiornamenti
          </p>
          <p style="margin: 0; color: #991b1b; font-size: 0.9em;">
            ${error.message || 'Errore di connessione'}
          </p>
        </div>
        <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 1rem; margin-bottom: 1rem;">
          <p style="margin: 0 0 0.5rem 0; color: #374151; font-weight: 600;">
            Versione locale: ${CURRENT_VERSION}
          </p>
          <p style="margin: 0; color: #6b7280; font-size: 0.85em;">
            ${VERSION_DATE} alle ${VERSION_TIME}
          </p>
        </div>
        <p style="color: #666; font-size: 0.9em;">
          Verifica la connessione internet e riprova.<br>
          Puoi comunque riavviare l'app se necessario.
        </p>
      </div>
    `;
    confirmBtn.textContent = 'Riavvia App';
    confirmBtn.style.display = 'block';
  }
}

// Funzione helper per confrontare versioni (es: "1.3.4" > "1.3.3")
function compareVersions(v1, v2) {
  const parts1 = v1.split('.').map(Number);
  const parts2 = v2.split('.').map(Number);
  
  for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
    const part1 = parts1[i] || 0;
    const part2 = parts2[i] || 0;
    
    if (part1 > part2) return 1;
    if (part1 < part2) return -1;
  }
  
  return 0; // Versioni uguali
}

function resetCache() {
  checkForUpdates();
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

// Event listeners per font size - pulsanti desktop e mobile
document.querySelectorAll('.font-size-btn, .mobile-font-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    const size = this.dataset.size;
    if (size) {
      setFontSize(size);
      currentFontSizeIndex = fontSizeLevels.indexOf(size);
    }
  });
});

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
    
    // Chiudi modal linee fermate se aperto
    const lineeModalFermate = document.getElementById('linee-fermate-modal');
    if (lineeModalFermate && lineeModalFermate.classList.contains('show')) {
      closeLineeModalFermate();
    }
    
    // Chiudi modal linee prezzi se aperto
    const lineeModalPrezzi = document.getElementById('linee-prezzi-modal');
    if (lineeModalPrezzi && lineeModalPrezzi.classList.contains('show')) {
      closeLineeModalPrezzi();
    }
  }
});
// Event listener per apertura modale linee
if (lineaBtn) {
  lineaBtn.addEventListener('click', openLineeModal);
}

// Event listeners per pulsanti partenza/arrivo
if (partenzaBtn) {
  partenzaBtn.addEventListener('click', () => openFermateModal('partenza'));
}
if (arrivoBtn) {
  arrivoBtn.addEventListener('click', () => openFermateModal('arrivo'));
}

// Event listener per pulsante geolocalizzazione (sia per index.html che fermate.html)
const locationBtn = document.getElementById('location-btn');
if (locationBtn) {
  locationBtn.addEventListener('click', () => {
    if (locationBtn.classList.contains('active')) {
      disableLocationSorting();
    } else {
      handleLocationClick();
    }
  });
}

// Event listeners per modale fermate
if (fermateModalClose) {
  fermateModalClose.addEventListener('click', closeFermateModal);
}

if (fermateLocationBtn) {
  fermateLocationBtn.addEventListener('click', handleFermateLocationClick);
}

if (fermateModal) {
  fermateModal.addEventListener('click', (e) => {
    if (e.target === fermateModal) {
      closeFermateModal();
    }
  });
}

if (fermateSearchInput) {
  fermateSearchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value;
    filterFermate(searchTerm);
    
    // Mostra/nascondi pulsante clear
    if (fermateClearSearch) {
      fermateClearSearch.style.display = searchTerm ? 'block' : 'none';
    }
  });
}

if (fermateClearSearch) {
  fermateClearSearch.addEventListener('click', () => {
    if (fermateSearchInput) {
      fermateSearchInput.value = '';
      fermateSearchInput.dispatchEvent(new Event('input'));
      fermateSearchInput.focus();
    }
  });
}

// Event listeners per modale linee
if (lineeModalClose) {
  lineeModalClose.addEventListener('click', closeLineeModal);
}

// Chiudi modale linee cliccando fuori
if (lineeModal) {
  lineeModal.addEventListener('click', (e) => {
    if (e.target === lineeModal) {
      closeLineeModal();
    }
  });
}

// Event listeners per modale linee fermate
const lineeModalFermateClose = document.getElementById('linee-fermate-modal-close');
const lineeModalFermate = document.getElementById('linee-fermate-modal');

if (lineeModalFermateClose) {
  lineeModalFermateClose.addEventListener('click', closeLineeModalFermate);
}

// Chiudi modale linee fermate cliccando fuori
if (lineeModalFermate) {
  lineeModalFermate.addEventListener('click', (e) => {
    if (e.target === lineeModalFermate) {
      closeLineeModalFermate();
    }
  });
}

// Event listeners per modale linee prezzi
const lineeModalPrezziClose = document.getElementById('linee-prezzi-modal-close');
const lineeModalPrezzi = document.getElementById('linee-prezzi-modal');

if (lineeModalPrezziClose) {
  lineeModalPrezziClose.addEventListener('click', closeLineeModalPrezzi);
}

// Chiudi modale linee prezzi cliccando fuori
if (lineeModalPrezzi) {
  lineeModalPrezzi.addEventListener('click', (e) => {
    if (e.target === lineeModalPrezzi) {
      closeLineeModalPrezzi();
    }
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
    // Retrocompatibilità: converti vecchio sistema isDark a themeMode
    const oldDarkMode = localStorage.getItem('tpl.isDark');
    const existingThemeMode = localStorage.getItem('tpl.themeMode');
    
    if (!existingThemeMode && oldDarkMode !== null) {
      // Migrazione da vecchio sistema
      const newMode = oldDarkMode === '1' ? 'dark' : 'light';
      localStorage.setItem('tpl.themeMode', newMode);
      localStorage.removeItem('tpl.isDark'); // Rimuovi vecchia impostazione
    }
    
    // Il tema verrà caricato dal modal impostazioni con loadTheme()
    // Non caricare qui per evitare conflitti
    
    // Ripristina dimensione testo
    initFontSize();
    
    const sLinea = localStorage.getItem('tpl.lineaIdx');
    const sPart = localStorage.getItem('tpl.partenzaIdx');
    const sArr = localStorage.getItem('tpl.arrivoIdx');
    if (sLinea !== null) {
      lineaIdx = sLinea;
      // Ripristina il testo del bottone linea
      if (lineaText && tariffario[lineaIdx]) {
        lineaText.textContent = tariffario[lineaIdx].nome;
      }
    }
    if (sPart !== null) partenzaIdx = sPart;
    if (sArr !== null) arrivoIdx = sArr;
  } catch { }
  updateFermateButtons();
  
  // Aggiorna i testi dei pulsanti se ci sono valori salvati
  if (partenzaIdx !== '' && tariffario[lineaIdx] && partenzaText) {
    partenzaText.textContent = tariffario[lineaIdx].fermate[partenzaIdx];
  }
  if (arrivoIdx !== '' && tariffario[lineaIdx] && arrivoText) {
    arrivoText.textContent = tariffario[lineaIdx].fermate[arrivoIdx];
  }
  
  updateSummary();
  calcolaPrezzo();
}

// --- TRATTE LOGIC ---
function renderFermate(lineaIndex = 0, sortByDistance = false) {
  console.log('renderFermate chiamata con lineaIndex:', lineaIndex, 'sortByDistance:', sortByDistance);
  const andataList = document.getElementById('fermate-andata');
  const ritornoList = document.getElementById('fermate-ritorno');
  const gridContainer = document.getElementById('fermate-grid-container');
  const searchContainer = document.getElementById('search-container-fermate');

  console.log('andataList:', !!andataList, 'ritornoList:', !!ritornoList, 'tariffario[lineaIndex]:', !!tariffario[lineaIndex]);

  if (!andataList || !ritornoList || !tariffario[lineaIndex]) {
    console.error('Impossibile generare liste tratte');
    return;
  }

  const linea = tariffario[lineaIndex];
  let fermate = linea.fermate;
  console.log('Rendering liste tratte per linea:', linea.nome, 'con', fermate.length, 'fermate');

  // Pulisce le liste precedenti
  andataList.innerHTML = '';
  ritornoList.innerHTML = '';

  // Se richiesto, ordina per distanza
  let sortedFermate = fermate;
  if (sortByDistance && userPosition) {
    const sorted = sortFermateByDistance(fermate, userPosition);
    sortedFermate = sorted.map(item => item.name);
    console.log('Fermate ordinate per distanza:', sorted);
  }

  // Popola lista andata (0 → fine) - INCLUDE TUTTE LE FERMATE
  for (let i = 0; i < sortedFermate.length; i++) {
    const li = document.createElement('li');
    li.classList.add('fermate-item');
    
    // Trova l'indice originale della fermata
    const originalIndex = fermate.indexOf(sortedFermate[i]);
    const distance = userPosition ? sortFermateByDistance(fermate, userPosition).find(f => f.name === sortedFermate[i])?.distance : null;
    
    let distanceText = '';
    if (distance !== null) {
      distanceText = `<span class="fermate-distance">${distance.toFixed(1)} km</span>`;
    }
    
    li.innerHTML = `
      <span class="fermate-icon">📍</span>
      <span class="fermate-number">${originalIndex + 1}</span>
      <span class="fermate-stop">${sortedFermate[i]}</span>
      ${distanceText}
    `;
    andataList.appendChild(li);
  }

  // Popola lista ritorno (fine → 0) - INCLUDE TUTTE LE FERMATE
  for (let i = sortedFermate.length - 1; i >= 0; i--) {
    const li = document.createElement('li');
    li.classList.add('tratte-item');
    
    // Trova l'indice originale della fermata
    const originalIndex = fermate.indexOf(sortedFermate[i]);
    const distance = userPosition ? sortFermateByDistance(fermate, userPosition).find(f => f.name === sortedFermate[i])?.distance : null;
    
    let distanceText = '';
    if (distance !== null) {
      distanceText = `<span class="fermate-distance">${distance.toFixed(1)} km</span>`;
    }
    
    li.innerHTML = `
      <span class="tratte-icon">📍</span>
      <span class="tratte-number">${fermate.length - originalIndex}</span>
      <span class="tratte-stop">${sortedFermate[i]}</span>
      ${distanceText}
    `;
    ritornoList.appendChild(li);
  }

  // Mostra griglia e ricerca
  if (gridContainer) gridContainer.style.display = 'grid';
  if (searchContainer) searchContainer.style.display = 'flex';
}

// --- TARIFFE LOGIC ---
function renderPrezzi(lineaIndex = 0) {
  console.log('renderPrezzi chiamata con lineaIndex:', lineaIndex);
  const andataTable = document.getElementById('prezzi-andata');
  const ritornoTable = document.getElementById('prezzi-ritorno');
  console.log('andataTable:', !!andataTable, 'ritornoTable:', !!ritornoTable, 'tariffario[lineaIndex]:', !!tariffario[lineaIndex]);

  if (!andataTable || !ritornoTable || !tariffario[lineaIndex]) {
    console.error('Impossibile generare tabelle prezzi');
    return;
  }

  const linea = tariffario[lineaIndex];
  const fermate = linea.fermate;
  console.log('Rendering tabelle prezzi per linea:', linea.nome, 'con', fermate.length, 'fermate');

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

// Popola modal linee per pagina fermate
function populateLineeTratte() {
  const lineeModalList = document.getElementById('linee-fermate-modal-list');
  const lineaBtn = document.getElementById('linea-fermate-btn');
  
  if (!lineeModalList) return;
  
  // Popola modal con le linee
  lineeModalList.innerHTML = '';
  tariffario.forEach((l, i) => {
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
    lineaBtn.addEventListener('click', openLineeModalFermate);
  }
}

// Apri modal linee per fermate
function openLineeModalFermate() {
  const lineeModal = document.getElementById('linee-fermate-modal');
  if (!lineeModal) return;
  
  lineeModal.style.display = 'flex';
  setTimeout(() => lineeModal.classList.add('show'), 10);
}

// Chiudi modal linee per fermate
function closeLineeModalFermate() {
  const lineeModal = document.getElementById('linee-fermate-modal');
  if (!lineeModal) return;
  
  lineeModal.classList.remove('show');
  setTimeout(() => {
    lineeModal.style.display = 'none';
  }, 300);
}

// Seleziona linea da modal fermate
function selectLineaFermate(idx, nome) {
  const lineaBtn = document.getElementById('linea-fermate-btn');
  const lineaText = document.getElementById('linea-fermate-text');
  const gridContainer = document.getElementById('fermate-grid-container');
  const searchContainer = document.getElementById('search-container-fermate');
  const mobileMessage = document.getElementById('mobile-fermate-message');
  const andataTitle = document.getElementById('andata-title');
  const ritornoTitle = document.getElementById('ritorno-title');
  
  // Aggiorna testo pulsante e salva indice
  if (lineaText) {
    lineaText.textContent = nome;
  }
  if (lineaBtn) {
    lineaBtn.dataset.selectedIndex = idx;
  }
  
  // Aggiorna titoli e mostra fermate
  const linea = tariffario[idx];
  const fermate = linea.fermate;
  
  // Aggiorna titoli
  const firstStop = fermate[0];
  const lastStop = fermate[fermate.length - 1];
  if (andataTitle) andataTitle.textContent = `(${firstStop} → ${lastStop})`;
  if (ritornoTitle) ritornoTitle.textContent = `(${lastStop} → ${firstStop})`;
  
  // Mostra griglia e ricerca
  if (gridContainer) {
    gridContainer.style.display = 'grid';
    gridContainer.classList.add('show-on-mobile'); // Classe per nascondere su mobile
  }
  if (searchContainer) {
    searchContainer.style.display = 'flex';
    searchContainer.classList.add('show-on-mobile'); // Classe per nascondere su mobile
  }
  
  // Mostra messaggio mobile
  if (mobileMessage) mobileMessage.style.display = 'block';
  
  // Renderizza tratte con l'indice selezionato
  renderFermate(idx);
  
  // Chiudi modal
  closeLineeModalFermate();
}

// Popola modal linee per pagina prezzi
function populateLineePrezzi() {
  const lineeModalList = document.getElementById('linee-prezzi-modal-list');
  const lineaBtn = document.getElementById('linea-prezzi-btn');
  
  if (!lineeModalList) return;
  
  // Popola modal con le linee
  lineeModalList.innerHTML = '';
  tariffario.forEach((l, i) => {
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

// Apri modal linee per prezzi
function openLineeModalPrezzi() {
  const lineeModal = document.getElementById('linee-prezzi-modal');
  if (!lineeModal) return;
  
  lineeModal.style.display = 'flex';
  setTimeout(() => lineeModal.classList.add('show'), 10);
}

// Chiudi modal linee per prezzi
function closeLineeModalPrezzi() {
  const lineeModal = document.getElementById('linee-prezzi-modal');
  if (!lineeModal) return;
  
  lineeModal.classList.remove('show');
  setTimeout(() => {
    lineeModal.style.display = 'none';
  }, 300);
}

// Seleziona linea da modal prezzi
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
  
  // Aggiorna titoli e mostra prezzi
  const linea = tariffario[idx];
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

// Funzione di ricerca per tariffe
function setupRicercaPrezzi() {
  const searchInput = document.getElementById('search-input-prezzi');
  const clearBtn = document.getElementById('clear-search-prezzi');

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
function initFermatePrezzi() {
  console.log('initFermatePrezzi chiamata');

  // Per pagina tratte, popola il selettore tratte
  if (window.location.pathname.endsWith('fermate.html')) {
    populateLineeTratte();
  }
  // Per pagina prezzi, popola il selettore prezzi
  else if (window.location.pathname.endsWith('prezzi.html')) {
    populateLineePrezzi();
    setupRicercaPrezzi();
  }
}

// Funzione per mostrare notifiche all'utente
function showLocationNotification(message, type = 'info') {
  // Crea elemento notifica se non esiste
  let notification = document.getElementById('location-notification');
  if (!notification) {
    notification = document.createElement('div');
    notification.id = 'location-notification';
    notification.className = 'location-notification';
    document.body.appendChild(notification);
  }

  // Aggiorna contenuto e stile
  notification.textContent = message;
  notification.className = `location-notification ${type}`;
  notification.style.display = 'block';

  // Auto-hide dopo 3 secondi
  setTimeout(() => {
    if (notification) {
      notification.style.display = 'none';
    }
  }, 3000);
}

// Funzione per gestire il click del pulsante geolocalizzazione
async function handleLocationClick() {
  const locationBtn = document.getElementById('location-btn');
  const locationIcon = document.getElementById('location-icon');
  const locationText = document.getElementById('location-text');
  
  if (!locationBtn) return;

  // Mostra stato di caricamento
  if (locationIcon) locationIcon.textContent = '⏳';
  if (locationText) locationText.textContent = 'Rilevamento...';
  locationBtn.disabled = true;

  try {
    await requestUserLocation();
    
    // Aggiorna UI
    if (locationIcon) locationIcon.textContent = '📍';
    if (locationText) locationText.textContent = 'Ordina per distanza';
    locationBtn.classList.add('active');
    
    // Salva preferenza
    try {
      localStorage.setItem('tpl.locationEnabled', 'true');
    } catch {}
    
    // Mostra notifica di successo
    showLocationNotification('Posizione rilevata! Le fermate saranno ordinate per distanza.', 'success');
    
  } catch (error) {
    console.error('Errore geolocalizzazione:', error);
    
    // Determina il tipo di errore
    let errorMessage = 'Errore nel rilevamento della posizione';
    if (error.code === 1) {
      errorMessage = 'Permesso di geolocalizzazione negato. Abilita la posizione nelle impostazioni del browser.';
    } else if (error.code === 2) {
      errorMessage = 'Posizione non disponibile. Verifica la connessione GPS.';
    } else if (error.code === 3) {
      errorMessage = 'Timeout nel rilevamento. Riprova più tardi.';
    }
    
    // Mostra errore
    if (locationIcon) locationIcon.textContent = '❌';
    if (locationText) locationText.textContent = 'Errore rilevamento';
    
    // Mostra notifica di errore
    showLocationNotification(errorMessage, 'error');
    
    // Reset dopo 3 secondi
    setTimeout(() => {
      if (locationIcon) locationIcon.textContent = '📍';
      if (locationText) locationText.textContent = 'Rileva posizione';
      locationBtn.disabled = false;
      locationBtn.classList.remove('active');
    }, 3000);
  }
}

// Funzione per gestire il click del pulsante geolocalizzazione nel modal fermate
async function handleFermateLocationClick() {
  if (!fermateLocationBtn) return;

  if (!isGeolocationSupported()) {
    showLocationNotification('Geolocalizzazione non supportata dal browser', 'error');
    return;
  }

  try {
    // Mostra stato di caricamento
    if (fermateLocationIcon) fermateLocationIcon.textContent = '⏳';
    if (fermateLocationText) fermateLocationText.textContent = 'Rilevamento...';
    fermateLocationBtn.disabled = true;

    // Richiedi posizione
    const position = await requestUserLocation();
    userPosition = position;
    locationPermissionGranted = true;

    // Aggiorna UI
    if (fermateLocationIcon) fermateLocationIcon.textContent = '📍';
    if (fermateLocationText) fermateLocationText.textContent = 'Rilevata';
    showLocationNotification('Posizione rilevata! Ordinando fermate per distanza...', 'success');

    // Salva preferenza
    try {
      localStorage.setItem('tpl.locationEnabled', 'true');
    } catch {}

    // Ri-ordina le fermate per distanza
    if (fermateModalList && fermateModalList.children.length > 0) {
      const fermate = Array.from(fermateModalList.children).map(li => li.textContent.trim());
      const sortedFermate = sortFermateByDistance(fermate, userPosition);
      
      // Re-renderizza la lista ordinata
      fermateModalList.innerHTML = '';
      sortedFermate.forEach((fermata, index) => {
        const li = document.createElement('li');
        li.textContent = fermata;
        li.addEventListener('click', () => selectFermata(fermata));
        fermateModalList.appendChild(li);
      });
    }

  } catch (error) {
    console.error('Errore geolocalizzazione modal:', error);
    
    // Reset UI
    if (fermateLocationIcon) fermateLocationIcon.textContent = '❌';
    if (fermateLocationText) fermateLocationText.textContent = 'Errore';
    
    // Gestisci errori specifici
    let errorMessage = 'Errore durante il rilevamento della posizione';
    if (error.code === 1) {
      errorMessage = 'Permesso di geolocalizzazione negato';
    } else if (error.code === 2) {
      errorMessage = 'Posizione non disponibile';
    } else if (error.code === 3) {
      errorMessage = 'Timeout durante il rilevamento';
    }

    showLocationNotification(errorMessage, 'error');
    
    // Reset dopo 3 secondi
    setTimeout(() => {
      if (fermateLocationIcon) fermateLocationIcon.textContent = '📍';
      if (fermateLocationText) fermateLocationText.textContent = 'Rileva';
      fermateLocationBtn.disabled = false;
    }, 3000);
  }
}

// Funzione per disabilitare l'ordinamento per distanza
function disableLocationSorting() {
  const locationBtn = document.getElementById('location-btn');
  const locationIcon = document.getElementById('location-icon');
  const locationText = document.getElementById('location-text');
  
  if (locationBtn) {
    locationBtn.classList.remove('active');
    locationBtn.disabled = false;
  }
  
  if (locationIcon) locationIcon.textContent = '📍';
  if (locationText) locationText.textContent = 'Rileva posizione';
  
  // Rimuovi preferenza
  try {
    localStorage.removeItem('tpl.locationEnabled');
  } catch {}
}

// Avvia logica tratte/tariffe solo se siamo su tratte.html o tariffe.html
if (window.location.pathname.endsWith('fermate.html') || window.location.pathname.endsWith('prezzi.html')) {
  console.log('Su pagina fermate/prezzi, pathname:', window.location.pathname);

  // Ascolta l'evento di caricamento dati
  window.addEventListener('tariffarioLoaded', () => {
    console.log('Evento tariffarioLoaded ricevuto, chiamo initFermatePrezzi');
    initFermatePrezzi();
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

// Event listeners per controllo animazione
window.addEventListener('DOMContentLoaded', function() {
// Carica preferenza all'avvio
loadAnimationPreference();

// Inizializza la mini card versione
initMobileVersionCard();
handleQuickUpdate();

// Inizializza la mini card versione nel menu mobile
function initMobileVersionCard() {
  const versionCard = document.querySelector('.mobile-version-card');
  if (!versionCard) return;
  
  // Aggiorna i valori nella card
  const versionNumber = document.getElementById('mobile-version-number');
  const versionDate = document.getElementById('mobile-version-date');
  
  if (versionNumber) versionNumber.textContent = `Versione ${CURRENT_VERSION}`;
  if (versionDate) versionDate.textContent = `${VERSION_DATE} ${VERSION_TIME}`;
}

// Gestisce il click sulla card versione
function handleQuickUpdate() {
  const versionCard = document.getElementById('mobile-version-card');
  if (versionCard) {
    versionCard.addEventListener('click', function() {
      // Chiude il menu mobile se aperto
      const mobileMenu = document.getElementById('mobile-menu');
      const overlay = document.getElementById('mobile-menu-overlay');
      if (mobileMenu && overlay) {
        mobileMenu.classList.remove('active');
        overlay.classList.remove('active');
      }
      // Apre il modale di aggiornamento
      checkForUpdates();
    });
  }
}
  
  // Pulsanti desktop - usa event delegation per gestire tutti i pulsanti
  document.addEventListener('click', function(e) {
    if (e.target.closest('#animationToggle')) {
      toggleAnimation();
    }
    if (e.target.closest('#mobile-animation-toggle')) {
      toggleAnimation();
      // Chiudi il menu mobile se esiste
      if (typeof closeMenu === 'function') {
        closeMenu();
      }
    }
  });
});

// --- HAMBURGER MENU LOGIC ---
(function() {
  const hamburgerToggle = document.getElementById('hamburger-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
  const mobileMenuClose = document.getElementById('mobile-menu-close');
  const mobileDarkmodeToggle = document.getElementById('mobile-darkmode-toggle');
  const mobileVersionCard = document.getElementById('mobile-version-card');

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

  // Chiudi menu quando si clicca su un link (supporta sia .mobile-nav-link che .mobile-menu-link)
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link, .mobile-menu-link');
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

  // Mini card versione (apre modale Verifica Aggiornamenti)
  if (mobileVersionCard) {
    mobileVersionCard.addEventListener('click', () => {
      if (typeof checkForUpdates === 'function') {
        checkForUpdates();
      }
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

// --- PWA Install logic (GLOBALE - funziona su tutte le pagine) ---
(function initPWAInstallBanner() {
  // Elementi DOM (cercati dinamicamente per supportare tutte le pagine)
  const pwaBanner = document.getElementById('pwa-install-banner');
  const pwaBtnInstall = document.getElementById('pwa-install-button');
  const pwaBtnLater = document.getElementById('pwa-install-later');
  const pwaIosHint = document.getElementById('pwa-ios-hint');
  
  // Se il banner non esiste nella pagina, esci
  if (!pwaBanner) return;

  // Funzioni helper
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

  // Rilevamento dispositivo
  function isIOSDevice() {
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIPhone = /iphone|ipod/.test(userAgent);
    const isIPad = /ipad/.test(userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    return isIPhone || isIPad;
  }

  function isAndroidDevice() {
    return /android/i.test(window.navigator.userAgent);
  }
  
  const isSafari = /^((?!chrome|android).)*safari/i.test(window.navigator.userAgent);
  const isChrome = /chrome|chromium|crios/i.test(window.navigator.userAgent) && !/edge|edg/i.test(window.navigator.userAgent);

  // Gestione Android/Chrome via beforeinstallprompt
  window.addEventListener('beforeinstallprompt', (e) => {
    // Mostra solo se non già installata e con frequenza
    if (isStandalone() || !canShowAgain()) return;
    e.preventDefault();
    deferredInstallPrompt = e;
    if (pwaIosHint) pwaIosHint.style.display = 'none';
    if (pwaBtnInstall) pwaBtnInstall.style.display = 'inline-block';
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

  // iOS: mostra banner con hint per istruzioni manuali
  if (isIOSDevice() && isSafari && !isStandalone() && canShowAgain()) {
    // iOS Safari: mostra hint e nascondi pulsante "Installa"
    if (pwaIosHint) pwaIosHint.style.display = 'block';
    if (pwaBtnInstall) pwaBtnInstall.textContent = 'Mostra istruzioni';
    showBanner();
  } else if (isAndroidDevice() && isChrome && !isStandalone() && canShowAgain() && !deferredInstallPrompt) {
    // Android Chrome ma senza beforeinstallprompt (già installata o browser non supporta)
    // Mostra comunque il banner per informare
    if (pwaIosHint) pwaIosHint.style.display = 'none';
    if (pwaBtnInstall) pwaBtnInstall.style.display = 'inline-block';
    showBanner();
  }
  
  // Listener per visibilità pagina (nasconde banner quando app va in background)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && isStandalone()) {
      hideBanner();
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
  });
}

// ================================
// SISTEMA NOTIFICHE OFFLINE
// ================================

// Stato connessione
let isOnline = navigator.onLine;
let offlineNotificationShown = false;

// Elementi per notifiche offline
let offlineBanner = null;

// Funzione per creare banner offline
function createOfflineBanner() {
  if (offlineBanner) return;
  
  offlineBanner = document.createElement('div');
  offlineBanner.id = 'offline-banner';
  offlineBanner.className = 'offline-banner';
  offlineBanner.innerHTML = `
    <div class="offline-content">
      <span class="offline-icon">📡</span>
      <span class="offline-text">Modalità offline - App funzionante</span>
      <button class="offline-close" onclick="hideOfflineBanner()">×</button>
    </div>
  `;
  
  document.body.appendChild(offlineBanner);
  
  // Animazione di entrata
  setTimeout(() => {
    offlineBanner.classList.add('show');
  }, 100);
}

// Funzione per nascondere banner offline
function hideOfflineBanner() {
  if (offlineBanner) {
    offlineBanner.classList.remove('show');
    setTimeout(() => {
      if (offlineBanner && offlineBanner.parentNode) {
        offlineBanner.parentNode.removeChild(offlineBanner);
        offlineBanner = null;
      }
    }, 300);
  }
  offlineNotificationShown = false;
}

// Funzione per mostrare notifica offline
function showOfflineNotification() {
  if (offlineNotificationShown) return;
  
  createOfflineBanner();
  offlineNotificationShown = true;
  
  // Auto-hide dopo 5 secondi se online
  if (isOnline) {
    setTimeout(() => {
      if (isOnline) {
        hideOfflineBanner();
      }
    }, 5000);
  }
}

// Listener per eventi online/offline del browser
window.addEventListener('online', () => {
  console.log('🌐 Connessione ripristinata');
  isOnline = true;
  
  if (offlineBanner) {
    // Aggiorna testo e stile quando torna online
    offlineBanner.classList.add('online');
    const textElement = offlineBanner.querySelector('.offline-text');
    const iconElement = offlineBanner.querySelector('.offline-icon');
    if (textElement) {
      textElement.textContent = 'Connessione ripristinata';
    }
    if (iconElement) {
      iconElement.textContent = '✅';
    }
    
    // Nasconde automaticamente dopo 2 secondi
    setTimeout(() => {
      hideOfflineBanner();
    }, 2000);
  }
});

window.addEventListener('offline', () => {
  console.log('📡 Connessione persa');
  isOnline = false;
  
  if (!offlineNotificationShown) {
    showOfflineNotification();
  }
});

// Listener per messaggi dal Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'OFFLINE_MODE') {
      console.log('📡 Service Worker: Modalità offline attivata');
      isOnline = false;
      
      if (!offlineNotificationShown) {
        showOfflineNotification();
      }
    }
  });
}

// Verifica stato iniziale
if (!navigator.onLine) {
  console.log('📡 App avviata in modalità offline');
  isOnline = false;
  setTimeout(() => {
    showOfflineNotification();
  }, 1000); // Delay per permettere caricamento app
}

// =====================================
// MODAL IMPOSTAZIONI
// =====================================

(function() {
  const settingsModal = document.getElementById('settings-modal');
  const openSettingsBtn = document.getElementById('open-settings');
  const desktopSettingsBtn = document.getElementById('desktop-settings-btn');
  const closeSettingsBtn = document.getElementById('settings-modal-close');
  
  // Toggle controls
  const themeSystem = document.getElementById('theme-system');
  const themeLight = document.getElementById('theme-light');
  const themeDark = document.getElementById('theme-dark');
  const animationToggle = document.getElementById('settings-animation');
  const highContrastToggle = document.getElementById('settings-high-contrast');
  const touchFriendlyToggle = document.getElementById('settings-touch-friendly');
  const hapticFeedbackToggle = document.getElementById('settings-haptic-feedback');
  
  // Font size buttons
  const fontButtons = document.querySelectorAll('.settings-font-btn');
  
  // Tabs
  const tabs = document.querySelectorAll('.settings-tab');
  const tabContents = document.querySelectorAll('.settings-tab-content');
  
  if (!settingsModal) return;
  
  // ===== APERTURA/CHIUSURA MODAL =====
  
  function openSettings() {
    settingsModal.style.display = 'flex';
    setTimeout(() => {
      settingsModal.classList.add('show');
    }, 10);
    
    // Sincronizza valori con stato attuale
    syncSettingsWithState();
  }
  
  function closeSettings() {
    settingsModal.classList.remove('show');
    setTimeout(() => {
      settingsModal.style.display = 'none';
    }, 300);
  }
  
  if (openSettingsBtn) {
    openSettingsBtn.addEventListener('click', () => {
      openSettings();
      // Chiudi menu mobile se aperto
      const mobileMenu = document.getElementById('mobile-menu');
      const overlay = document.getElementById('mobile-menu-overlay');
      if (mobileMenu && overlay) {
        mobileMenu.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }
  
  // Desktop settings button
  if (desktopSettingsBtn) {
    desktopSettingsBtn.addEventListener('click', () => {
      openSettings();
    });
  }
  
  if (closeSettingsBtn) {
    closeSettingsBtn.addEventListener('click', closeSettings);
  }
  
  // Chiudi cliccando fuori
  if (settingsModal) {
    settingsModal.addEventListener('click', (e) => {
      if (e.target === settingsModal) {
        closeSettings();
      }
    });
  }
  
  // Chiudi con ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && settingsModal.classList.contains('show')) {
      closeSettings();
    }
  });
  
  // ===== GESTIONE TAB =====
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetTab = tab.dataset.tab;
      
      // Rimuovi active da tutti
      tabs.forEach(t => t.classList.remove('active'));
      tabContents.forEach(tc => tc.classList.remove('active'));
      
      // Aggiungi active al selezionato
      tab.classList.add('active');
      const targetContent = document.querySelector(`[data-content="${targetTab}"]`);
      if (targetContent) {
        targetContent.classList.add('active');
      }
    });
  });
  
  // ===== SINCRONIZZAZIONE IMPOSTAZIONI =====
  
  function syncSettingsWithState() {
    // Theme Mode
    const themeMode = localStorage.getItem('tpl.themeMode') || 'system';
    if (themeSystem) themeSystem.checked = (themeMode === 'system');
    if (themeLight) themeLight.checked = (themeMode === 'light');
    if (themeDark) themeDark.checked = (themeMode === 'dark');
    
    // Animazione
    if (animationToggle) {
      animationToggle.checked = document.body.classList.contains('animation-enabled');
    }
    
    // Contrasto Alto
    if (highContrastToggle) {
      const isHighContrast = localStorage.getItem('tpl.highContrast') === 'true';
      highContrastToggle.checked = isHighContrast;
    }
    
    // Touch Friendly
    if (touchFriendlyToggle) {
      const isTouchFriendly = localStorage.getItem('tpl.touchFriendly') === 'true';
      touchFriendlyToggle.checked = isTouchFriendly;
    }
    
    // Haptic Feedback
    if (hapticFeedbackToggle) {
      const isHapticEnabled = localStorage.getItem('tpl.hapticFeedback') === 'true';
      hapticFeedbackToggle.checked = isHapticEnabled;
    }
    
    // Font Size
    const currentFontSize = localStorage.getItem('tpl.fontSize') || 'normal';
    fontButtons.forEach(btn => {
      if (btn.dataset.size === currentFontSize) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }
  
  // ===== GESTIONE TOGGLE =====
  
  // Theme Mode
  if (themeSystem) {
    themeSystem.addEventListener('change', () => {
      if (themeSystem.checked) setThemeMode('system');
    });
  }
  if (themeLight) {
    themeLight.addEventListener('change', () => {
      if (themeLight.checked) setThemeMode('light');
    });
  }
  if (themeDark) {
    themeDark.addEventListener('change', () => {
      if (themeDark.checked) setThemeMode('dark');
    });
  }
  
  // Animazione
  if (animationToggle) {
    animationToggle.addEventListener('change', () => {
      toggleAnimation();
    });
  }
  
  // Contrasto Alto
  if (highContrastToggle) {
    highContrastToggle.addEventListener('change', (e) => {
      setHighContrast(e.target.checked);
    });
  }
  
  // Touch Friendly
  if (touchFriendlyToggle) {
    touchFriendlyToggle.addEventListener('change', (e) => {
      setTouchFriendly(e.target.checked);
    });
  }
  
  // Haptic Feedback
  if (hapticFeedbackToggle) {
    hapticFeedbackToggle.addEventListener('change', (e) => {
      setHapticFeedback(e.target.checked);
      // Vibra per confermare l'attivazione/disattivazione
      if (e.target.checked) {
        triggerHaptic('success');
      }
    });
  }
  
  // Font Size
  fontButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const size = btn.dataset.size;
      setFontSize(size);
      
      // Aggiorna UI
      fontButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Feedback aptico
      triggerHaptic('light');
    });
  });
  
  // ===== FUNZIONI CONTRASTO ALTO =====
  
  function setHighContrast(enabled) {
    if (enabled) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
    
    try {
      localStorage.setItem('tpl.highContrast', enabled);
    } catch {}
    
    console.log('Contrasto alto:', enabled ? 'attivato' : 'disattivato');
    triggerHaptic('medium'); // Feedback al cambio contrasto
  }
  
  function loadHighContrast() {
    const saved = localStorage.getItem('tpl.highContrast');
    if (saved === 'true') {
      setHighContrast(true);
    }
  }
  
  // ===== FUNZIONI TOUCH FRIENDLY =====
  
  function setTouchFriendly(enabled) {
    if (enabled) {
      document.body.classList.add('touch-friendly');
    } else {
      document.body.classList.remove('touch-friendly');
    }
    
    try {
      localStorage.setItem('tpl.touchFriendly', enabled);
    } catch {}
    
    console.log('Touch friendly:', enabled ? 'attivato' : 'disattivato');
    triggerHaptic('medium'); // Feedback al cambio modalità touch
  }
  
  function loadTouchFriendly() {
    const saved = localStorage.getItem('tpl.touchFriendly');
    if (saved === 'true') {
      setTouchFriendly(true);
    }
  }
  
  // ===== FUNZIONI FEEDBACK APTICO =====
  
  function setHapticFeedback(enabled) {
    try {
      localStorage.setItem('tpl.hapticFeedback', enabled);
      console.log('Feedback aptico:', enabled ? 'attivato' : 'disattivato');
    } catch (error) {
      console.error('Errore salvataggio haptic feedback:', error);
    }
  }
  
  function loadHapticFeedback() {
    const saved = localStorage.getItem('tpl.hapticFeedback');
    // Nota: non impostiamo una classe CSS, il feedback è gestito via JavaScript
    if (saved === 'true') {
      console.log('✅ Feedback aptico caricato: attivo');
    }
  }
  
  // ===== FUNZIONI TEMA =====
  
  // Media query per rilevare tema sistema
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
  
  function setThemeMode(mode) {
    localStorage.setItem('tpl.themeMode', mode);
    applyTheme();
    console.log('Tema impostato su:', mode);
    triggerHaptic('medium'); // Feedback al cambio tema
  }
  
  function applyTheme() {
    const mode = localStorage.getItem('tpl.themeMode') || 'system';
    let shouldBeDark = false;
    
    if (mode === 'system') {
      shouldBeDark = prefersDarkScheme.matches;
    } else if (mode === 'dark') {
      shouldBeDark = true;
    } else {
      shouldBeDark = false;
    }
    
    // Applica il tema
    document.documentElement.classList.toggle('dark', shouldBeDark);
    updateBodyColors(shouldBeDark);
    updateToggleIcon(shouldBeDark);
    updateMobileDarkModeButton(shouldBeDark);
  }
  
  function loadTheme() {
    applyTheme();
    
    // Listener per cambio tema sistema
    prefersDarkScheme.addEventListener('change', () => {
      const mode = localStorage.getItem('tpl.themeMode') || 'system';
      if (mode === 'system') {
        applyTheme();
      }
    });
  }
  
  // ===== CARICA IMPOSTAZIONI ALL'AVVIO =====
  
  window.addEventListener('DOMContentLoaded', () => {
    loadTheme();
    loadHighContrast();
    loadTouchFriendly();
    loadHapticFeedback();
  });
  
  // ========================================
  // PWA BOTTOM NAVIGATION
  // Gestione della barra di navigazione inferiore in modalità PWA
  // ========================================
  
  (function initPWABottomNav() {
    const bottomNav = document.getElementById('pwa-bottom-nav');
    const brandHeader = document.getElementById('pwa-brand-header');
    if (!bottomNav && !brandHeader) return; // Pagina senza PWA elements
    
    // Verifica se siamo in modalità PWA
    function isStandalone() {
      // Controlla se è attiva la modalità test
      const isTestMode = localStorage.getItem('tpl.pwaTestMode') === 'true';
      if (isTestMode) {
        return true; // Forza modalità PWA per testing
      }
      
      // Controlla la modalità reale PWA
      return (
        window.matchMedia('(display-mode: standalone)').matches ||
        window.navigator.standalone === true
      );
    }
    
    // Mostra/nasconde PWA elements (brand header + bottom nav)
    function toggleBottomNav() {
      const isPWA = isStandalone();
      
      if (isPWA) {
        if (brandHeader) {
          brandHeader.style.display = 'flex';
          brandHeader.classList.add('show');
        }
        if (bottomNav) {
          bottomNav.style.display = 'flex';
          bottomNav.classList.add('show');
        }
        document.body.classList.add('pwa-mode');
        console.log('📱 PWA Mode: ATTIVA (Brand Header + Bottom Nav)');
      } else {
        if (brandHeader) {
          brandHeader.style.display = 'none';
          brandHeader.classList.remove('show');
        }
        if (bottomNav) {
          bottomNav.style.display = 'none';
          bottomNav.classList.remove('show');
        }
        document.body.classList.remove('pwa-mode');
        console.log('🌐 PWA Mode: nascosta (modalità browser)');
      }
    }
    
    // Evidenzia la tab attiva in base alla pagina corrente
    function highlightActiveTab() {
      const currentPage = window.location.pathname.split('/').pop() || 'index.html';
      const items = bottomNav.querySelectorAll('.pwa-nav-item');
      
      items.forEach(item => {
        item.classList.remove('active');
        
        const page = item.getAttribute('data-page');
        if (
          (page === 'home' && (currentPage === 'index.html' || currentPage === '')) ||
          (page === 'fermate' && currentPage === 'fermate.html') ||
          (page === 'prezzi' && currentPage === 'prezzi.html')
        ) {
          item.classList.add('active');
        }
      });
    }
    
    // Gestisce il click sul pulsante impostazioni
    function setupSettingsButton() {
      const settingsBtn = document.getElementById('pwa-settings-btn');
      const settingsModal = document.getElementById('settings-modal');
      
      console.log('🔧 Setup pulsante impostazioni:', {
        btn: !!settingsBtn,
        modal: !!settingsModal
      });
      
      if (settingsBtn && settingsModal) {
        settingsBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          console.log('⚙️ Click su pulsante impostazioni!');
          
          // Apri il modal con animazione
          settingsModal.style.display = 'flex';
          setTimeout(() => {
            settingsModal.classList.add('show');
          }, 10);
          
          console.log('✅ Modal impostazioni aperto', {
            display: settingsModal.style.display,
            classList: settingsModal.classList.toString()
          });
        });
        console.log('✅ Event listener aggiunto al pulsante impostazioni');
      } else {
        console.warn('⚠️ Pulsante o modal impostazioni non trovato!');
      }
    }
    
    // Inizializza al caricamento
    toggleBottomNav();
    highlightActiveTab();
    setupSettingsButton();
    
    // Listener per cambio modalità test (da localStorage)
    window.addEventListener('storage', (e) => {
      if (e.key === 'tpl.pwaTestMode') {
        console.log('🧪 Modalità test PWA cambiata:', e.newValue);
        toggleBottomNav();
      }
    });
    
    // Listener per aggiornamenti forzati (da test.html)
    window.addEventListener('pwaTestModeChanged', () => {
      console.log('🧪 Evento pwaTestModeChanged ricevuto');
      toggleBottomNav();
    });
    
    // ===== GESTIONE SIMULAZIONE OFFLINE GLOBALE =====
    // Controlla se la modalità offline test è attiva e trigger l'evento
    (function checkOfflineTestMode() {
      const isOfflineTestMode = localStorage.getItem('tpl.offlineTestMode') === 'true';
      
      if (isOfflineTestMode) {
        console.log('🔴 Modalità offline test attiva - triggering evento offline');
        // Trigger evento offline al caricamento della pagina
        setTimeout(() => {
          window.dispatchEvent(new Event('offline'));
        }, 100);
      }
      
      // Listener per cambio stato offline test mode
      window.addEventListener('storage', (e) => {
        if (e.key === 'tpl.offlineTestMode') {
          const isOffline = e.newValue === 'true';
          console.log('🌐 Modalità offline test cambiata:', isOffline ? 'OFFLINE' : 'ONLINE');
          
          if (isOffline) {
            window.dispatchEvent(new Event('offline'));
          } else {
            window.dispatchEvent(new Event('online'));
          }
        }
      });
    })();
    
    // Espone funzione refresh globale per la pagina test
    window.refreshPWABottomNav = function() {
      toggleBottomNav();
      highlightActiveTab();
    };
  })();
  
  // ========================================
  // PULSANTE "VEDI TUTTI GLI AGGIORNAMENTI"
  // ========================================
  (function() {
    const showAllBtn = document.getElementById('show-all-updates-btn');
    
    if (showAllBtn) {
      showAllBtn.addEventListener('click', function() {
        const hiddenItems = document.querySelectorAll('.update-item-hidden');
        const isExpanded = this.classList.contains('active');
        
        if (isExpanded) {
          // Nascondi
          hiddenItems.forEach(item => {
            item.classList.remove('show');
            setTimeout(() => {
              item.style.display = 'none';
            }, 300);
          });
          this.classList.remove('active');
          this.querySelector('.show-updates-text').textContent = 'Vedi tutti gli aggiornamenti';
        } else {
          // Mostra
          hiddenItems.forEach((item, index) => {
            item.style.display = 'block';
            setTimeout(() => {
              item.classList.add('show');
            }, index * 50);
          });
          this.classList.add('active');
          this.querySelector('.show-updates-text').textContent = 'Mostra';
        }
      });
    }
  })();
  
  // ========================================
  // PULSANTE "RIAVVIA APP"
  // ========================================
  (function() {
    const restartBtn = document.getElementById('restart-app-btn');
    
    if (restartBtn) {
      restartBtn.addEventListener('click', function() {
        console.log('🔄 Riavvio app...');
        
        // Feedback visivo
        this.textContent = 'Riavvio...';
        this.style.opacity = '0.6';
        this.style.cursor = 'wait';
        
        // Riavvia dopo 300ms
        setTimeout(() => {
          location.reload();
        }, 300);
      });
    }
  })();
  
  // ========================================
  // PWA SCROLL PROGRESS BAR
  // Barra di progresso che indica quanto si è scrollato
  // ========================================
  
  (function initScrollProgress() {
    const brandHeader = document.getElementById('pwa-brand-header');
    if (!brandHeader) return;
    
    function updateScrollProgress() {
      // Calcola la percentuale di scroll
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrollPercentage = (scrollTop / scrollHeight) * 100;
      
      // Aggiorna la larghezza della barra ::after tramite CSS custom property
      brandHeader.style.setProperty('--scroll-progress', scrollPercentage + '%');
    }
    
    // Listener per lo scroll
    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    
    // Inizializza al caricamento
    updateScrollProgress();
  })();
  
  // ========================================
  // PWA UPDATE CHECK BUTTON
  // Pulsante per verificare aggiornamenti nel modal Impostazioni
  // ========================================
  
  (function initPWAUpdateButton() {
    const updateBtn = document.getElementById('pwa-cache-reset');
    if (!updateBtn) return;
    
    updateBtn.addEventListener('click', function() {
      console.log('🔄 Pulsante PWA Update cliccato');
      
      // Chiudi il modal Impostazioni prima
      const settingsModal = document.getElementById('settings-modal');
      if (settingsModal) {
        settingsModal.classList.remove('show');
        setTimeout(() => {
          settingsModal.style.display = 'none';
        }, 300);
      }
      
      // Aspetta un attimo e poi verifica aggiornamenti
      setTimeout(() => {
        if (typeof checkForUpdates === 'function') {
          console.log('✅ Chiamata a checkForUpdates()');
          checkForUpdates();
        } else {
          console.error('❌ checkForUpdates non è una funzione');
        }
      }, 400);
    });
  })();
  
})();
