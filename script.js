// script.js - Gestione logica TPL FVG

// ========================================
// STORAGE HELPER
// ========================================
// Usa Storage se disponibile, altrimenti fallback su localStorage
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

// ========================================
// SEZIONE 0: FEEDBACK APTICO (VIBRAZIONE)
// ========================================
// Le funzioni di feedback aptico sono ora in js/features/settings.js
// Usa window.Settings.triggerHaptic() per richiamarle

// ========================================
// SEZIONE 1: RILEVAMENTO POSIZIONE
// ========================================
// Sistema di rilevamento posizione per ordinare fermate per distanza
// Le funzioni di geolocalizzazione sono ora in js/features/geolocation.js
// Usa window.Geolocation per accedere alle funzioni

// Variabili per retrocompatibilità (delegate al modulo)
let userPosition = null;
let locationPermissionGranted = false;

// Wrapper per retrocompatibilità
function calculateDistance(lat1, lon1, lat2, lon2) {
  if (window.Geolocation && window.Geolocation.calculateDistance) {
    return window.Geolocation.calculateDistance(lat1, lon1, lat2, lon2);
  }
  console.warn('⚠️ Geolocation module not available, using fallback');
  // Fallback (non dovrebbe essere necessario)
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function requestUserLocation() {
  if (window.Geolocation && window.Geolocation.requestUserLocation) {
    return window.Geolocation.requestUserLocation().then(position => {
      userPosition = position;
      locationPermissionGranted = true;
      return position;
    });
  }
  return Promise.reject(new Error('Geolocation module not available'));
}

function sortFermateByDistance(fermate, userPos) {
  if (window.Geolocation && window.Geolocation.sortFermateByDistance) {
    return window.Geolocation.sortFermateByDistance(fermate, userPos);
  }
  console.warn('⚠️ Geolocation module not available, returning unsorted fermate');
  return fermate.map((name, index) => ({ name, index, distance: null, coordinates: null }));
}

function isGeolocationSupported() {
  if (window.Geolocation && window.Geolocation.isGeolocationSupported) {
    return window.Geolocation.isGeolocationSupported();
  }
  return 'geolocation' in navigator;
}

function toggleLocationButton(show) {
  if (window.Geolocation && window.Geolocation.toggleLocationButton) {
    return window.Geolocation.toggleLocationButton(show);
  }
  console.warn('⚠️ Geolocation module not available');
}

// toggleSwapButton è ora in js/utils/ui-helpers.js
// Mantenuto come commento per riferimento - la funzione è esposta globalmente dal modulo
// window.toggleSwapButton() è disponibile direttamente da ui-helpers.js

function updateLocationButtonIcon(hasLocation) {
  if (window.Geolocation && window.Geolocation.updateLocationButtonIcon) {
    const icon = document.getElementById('location-icon');
    if (icon) {
      return window.Geolocation.updateLocationButtonIcon(icon, hasLocation);
    }
  }
}

// ========================================
// SEZIONE 1: ANIMAZIONE SFONDO
// ========================================
// Le funzioni di animazione sono ora in js/features/settings.js
// Usa window.Settings.toggleAnimation() per richiamarle

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
// Nota: tariffario e tariffarioAggiornato sono ora gestiti da js/data/tariffario.js
// Nota: lineaIdx, partenzaIdx, arrivoIdx sono ora gestiti da js/features/route-selector.js
// Queste variabili sono mantenute per retrocompatibilità e vengono sincronizzate con i moduli
let tariffario = [];
let tariffarioAggiornato = null;
// Variabili route mantenute per retrocompatibilità (sincronizzate con RouteSelector)
let lineaIdx = '';
let partenzaIdx = '';
let arrivoIdx = '';
let hasCalculated = false;
let deferredInstallPrompt = null; // beforeinstallprompt event
// Modal fermate state
// Le variabili currentModalType e filteredFermate sono ora gestite internamente da js/components/modals.js

// Utility dark mode
function setDarkMode(isDark) {
  document.documentElement.classList.toggle('dark', isDark);
  Storage.setItem('tpl.isDark', isDark ? '1' : '0');
  // Aggiorna i colori del body per tutte le pagine
  if (window.Settings && window.Settings.updateBodyColors) {
    window.Settings.updateBodyColors(isDark);
  }
}

function toggleDark() {
  // Nuovo sistema: cicla tra light/dark (non usa più system per il toggle manuale)
  const isDark = !document.documentElement.classList.contains('dark');
  const newMode = isDark ? 'dark' : 'light';

  // Usa Settings.setThemeMode() se disponibile
  if (window.Settings && window.Settings.setThemeMode) {
    window.Settings.setThemeMode(newMode);
  } else {
    // Fallback
    Storage.setItem('tpl.themeMode', newMode);
    document.documentElement.classList.toggle('dark', isDark);
    if (window.Settings && window.Settings.updateBodyColors) {
      window.Settings.updateBodyColors(isDark);
    }
    if (window.Settings && window.Settings.updateToggleIcon) {
      window.Settings.updateToggleIcon(isDark);
    }
    if (window.Settings && window.Settings.updateMobileDarkModeButton) {
      window.Settings.updateMobileDarkModeButton(isDark);
    }
  }

  console.log('Tema cambiato manualmente a:', newMode);
}

// ================================
// SISTEMA ACCESSIBILITÀ - DIMENSIONE TESTO
// ================================
// Le funzioni di dimensione testo sono ora in js/features/settings.js
// Usa window.Settings.setFontSize() e window.Settings.initFontSize() per richiamarle


// Funzione populateLinee() è ora in js/components/modals.js
// Gestita internamente quando viene aperto il modal
function populateLinee() {
  // Funzione mantenuta per compatibilità (potrebbe essere chiamata da altri punti)
  // Il popolamento viene fatto automaticamente da LineeModal.open()
  if (typeof LineeModal !== 'undefined' && LineeModal.open) {
    // Non apriamo il modal, solo popoliamo se necessario
    // In realtà il popolamento avviene quando si apre il modal
  }
}

// Abilita/disabilita pulsanti partenza/arrivo
// Le funzioni di gestione route sono ora in js/features/route-selector.js
// Questa funzione è mantenuta per retrocompatibilità
function updateFermateButtons() {
  if (typeof window.RouteSelector !== 'undefined' && window.RouteSelector.updateUI) {
    window.RouteSelector.updateUI();
  }
}

// ===== MODAL FERMATE =====
// Le funzioni del modal fermate sono ora in js/components/modals.js
// Questo script usa solo l'API pubblica esposta dal modulo

// Wrapper per compatibilità - delega a FermateModal
function openFermateModal(type) {
  if (typeof FermateModal !== 'undefined' && FermateModal.open) {
    FermateModal.open(type);
  } else {
    console.warn('⚠️ FermateModal non ancora inizializzato');
  }
}

function closeFermateModal() {
  if (typeof FermateModal !== 'undefined' && FermateModal.close) {
    FermateModal.close();
  }
}

// ===== MODAL LINEE =====
// Le funzioni del modal linee sono ora in js/components/modals.js
// Questo script usa solo l'API pubblica esposta dal modulo

// Wrapper per compatibilità - delega a LineeModal
function openLineeModal() {
  if (typeof LineeModal !== 'undefined' && LineeModal.open) {
    LineeModal.open();
  } else {
    console.warn('⚠️ LineeModal non ancora inizializzato');
  }
}

function closeLineeModal() {
  if (typeof LineeModal !== 'undefined' && LineeModal.close) {
    LineeModal.close();
  }
}

function selectLinea(idx, nome) {
  // Questa funzione viene chiamata dal callback di LineeModal
  // Delega a RouteSelector
  if (typeof window.RouteSelector !== 'undefined' && window.RouteSelector.selectLinea) {
    window.RouteSelector.selectLinea(idx, nome);
    // Sincronizza variabili locali per retrocompatibilità
    lineaIdx = window.RouteSelector.getLineaIdx();
    partenzaIdx = window.RouteSelector.getPartenzaIdx();
    arrivoIdx = window.RouteSelector.getArrivoIdx();
  } else {
    // Fallback se il modulo non è disponibile
    console.warn('⚠️ RouteSelector non disponibile, fallback...');
    lineaIdx = idx;
    partenzaIdx = '';
    arrivoIdx = '';
    if (lineaText) lineaText.textContent = nome;
    Storage.setItem('tpl.lineaIdx', lineaIdx);
  }

  closeLineeModal();
}

// Funzioni populateFermateList, renderFermateList, selectFermata, filterFermate
// sono ora in js/components/modals.js e vengono gestite internamente dal modulo

// Controlla e aggiorna lo stato della card prezzo
// Le funzioni di gestione route sono ora in js/features/route-selector.js
// Queste funzioni sono mantenute per retrocompatibilità
function updatePriceCardState() {
  if (typeof window.RouteSelector !== 'undefined' && window.RouteSelector.updateUI) {
    window.RouteSelector.updateUI();
  }
}

// Aggiorna riepilogo selezioni
function updateSummary() {
  if (typeof window.RouteSelector !== 'undefined' && window.RouteSelector.updateUI) {
    window.RouteSelector.updateUI();
  }
}

// Calcola prezzo e codice automaticamente (usa Pricing.js)
function calcolaPrezzo() {
  if (typeof window.RouteSelector !== 'undefined' && window.RouteSelector.updateUI) {
    window.RouteSelector.updateUI();
  }
}

// Funzione swap globale
// Le funzioni swap e calculatePrice sono ora gestite da js/features/route-selector.js
// Queste funzioni sono esposte globalmente dal modulo per retrocompatibilità (onclick nell'HTML)
// window.swapRoutes e window.calculatePrice sono definiti in route-selector.js

// Funzione reset filtri (linea, partenza, arrivo e risultati)
// Le funzioni di gestione route sono ora in js/features/route-selector.js
function resetFilters() {
  if (typeof window.RouteSelector !== 'undefined' && window.RouteSelector.reset) {
    window.RouteSelector.reset();
    // Sincronizza variabili locali per retrocompatibilità
    const state = window.RouteSelector.getState();
    lineaIdx = state.lineaIdx;
    partenzaIdx = state.partenzaIdx;
    arrivoIdx = state.arrivoIdx;
    hasCalculated = state.hasCalculated;
  } else {
    // Fallback se il modulo non è disponibile
    console.warn('⚠️ RouteSelector non disponibile, fallback...');
    lineaIdx = '';
    partenzaIdx = '';
    arrivoIdx = '';
    hasCalculated = false;
    Storage.removeItem('tpl.lineaIdx');
    Storage.removeItem('tpl.partenzaIdx');
    Storage.removeItem('tpl.arrivoIdx');
  }
}

// ===== VERSIONE DINAMICA =====
// Le funzioni di verifica aggiornamenti sono ora in changelog.js (completamente indipendenti)
// Questo file usa solo le funzioni pubbliche esposte da changelog.js

// Funzioni di compatibilità/wrapper che delegano a changelog.js
// Se changelog.js non è caricato, queste funzioni faranno fallback
function getCurrentVersion() {
  if (typeof getChangelogVersion === 'function') {
    return getChangelogVersion();
  }
  return null;
}

function getCurrentVersionSync() {
  if (typeof getChangelogVersionString === 'function') {
    return getChangelogVersionString() || '1.6.0';
  }
  return '1.6.0';
}

// Le funzioni checkForUpdates, resetCache, confirmResetCache, cancelResetCache
// sono ora in js/features/updates.js e vengono usate direttamente da lì

// Event listeners
if (darkModeToggle) darkModeToggle.addEventListener('click', toggleDark);

// Event listeners per font size - pulsanti desktop e mobile
document.querySelectorAll('.font-size-btn, .mobile-font-btn').forEach(btn => {
  btn.addEventListener('click', function () {
    const size = this.dataset.size;
    if (size && window.Settings && window.Settings.setFontSize) {
      window.Settings.setFontSize(size);
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
  cacheModal.addEventListener('click', function (e) {
    if (e.target === cacheModal) {
      cancelResetCache();
    }
  });
}

// Chiudi modal con ESC
document.addEventListener('keydown', function (e) {
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
// Gestito dal modulo Geolocation, ma manteniamo qui per retrocompatibilità
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

// Event listeners per modale fermate sono ora gestiti da js/components/modals.js
// Gestito solo il pulsante geolocalizzazione che è specifico di script.js
if (fermateLocationBtn) {
  fermateLocationBtn.addEventListener('click', handleFermateLocationClick);
}

// Inizializza i modali dopo il caricamento dei dati
function initializeModalsModules() {
  console.log('🚀 Inizializzazione moduli modali...');
  console.log('🔍 Verifica moduli disponibili:', {
    FermateModal: typeof FermateModal !== 'undefined',
    LineeModal: typeof LineeModal !== 'undefined',
    SettingsModal: typeof SettingsModal !== 'undefined'
  });

  // Inizializza modal fermate
  if (typeof FermateModal !== 'undefined' && FermateModal.initialize) {
    FermateModal.initialize({
      getCurrentLineaIdx: () => {
        // Usa RouteSelector se disponibile
        if (typeof window.RouteSelector !== 'undefined' && window.RouteSelector.getLineaIdx) {
          return window.RouteSelector.getLineaIdx();
        }
        return lineaIdx;
      },
      getTariffario: () => {
        // Usa il modulo Tariffario se disponibile, altrimenti fallback su variabile locale
        if (typeof window.Tariffario !== 'undefined' && window.Tariffario.getData) {
          return window.Tariffario.getData();
        }
        return tariffario;
      },
      onFermataSelected: (index, type) => {
        // Delega a RouteSelector
        if (typeof window.RouteSelector !== 'undefined' && window.RouteSelector.selectFermata) {
          window.RouteSelector.selectFermata(index, type);
          // Sincronizza variabili locali per retrocompatibilità
          lineaIdx = window.RouteSelector.getLineaIdx();
          partenzaIdx = window.RouteSelector.getPartenzaIdx();
          arrivoIdx = window.RouteSelector.getArrivoIdx();
        } else {
          // Fallback se il modulo non è disponibile
          console.warn('⚠️ RouteSelector non disponibile, fallback...');
          const tariffarioData = (typeof window.Tariffario !== 'undefined' && window.Tariffario.getData) 
            ? window.Tariffario.getData() 
            : tariffario;
          if (type === 'partenza') {
            partenzaIdx = index;
            if (partenzaText && tariffarioData[lineaIdx]) {
              partenzaText.textContent = tariffarioData[lineaIdx].fermate[index];
            }
            Storage.setItem('tpl.partenzaIdx', partenzaIdx);
          } else if (type === 'arrivo') {
            arrivoIdx = index;
            if (arrivoText && tariffarioData[lineaIdx]) {
              arrivoText.textContent = tariffarioData[lineaIdx].fermate[index];
            }
            Storage.setItem('tpl.arrivoIdx', arrivoIdx);
          }
          updateSummary();
          calcolaPrezzo();
        }
      }
    });
  }

  // Inizializza modal linee
  if (typeof LineeModal !== 'undefined' && LineeModal.initialize) {
    LineeModal.initialize({
      getTariffario: () => {
        // Usa il modulo Tariffario se disponibile, altrimenti fallback su variabile locale
        if (typeof window.Tariffario !== 'undefined' && window.Tariffario.getData) {
          return window.Tariffario.getData();
        }
        return tariffario;
      },
      onLineaSelected: (idx, nome) => {
        selectLinea(idx, nome);
      }
    });
  }

  // Inizializza modal impostazioni
  console.log('🔧 Inizializzazione SettingsModal...', typeof SettingsModal, typeof SettingsModal !== 'undefined' ? (typeof SettingsModal.initialize === 'function' ? 'initialize presente' : 'initialize mancante') : 'SettingsModal non definito');

  if (typeof SettingsModal !== 'undefined' && SettingsModal.initialize) {
    console.log('✅ SettingsModal trovato, procedo con inizializzazione');
    SettingsModal.initialize({
      setThemeMode: window.Settings && window.Settings.setThemeMode ? window.Settings.setThemeMode : null,
      toggleAnimation: window.Settings && window.Settings.toggleAnimation ? window.Settings.toggleAnimation : null,
      setHighContrast: window.Settings && window.Settings.setHighContrast ? window.Settings.setHighContrast : null,
      setTouchFriendly: window.Settings && window.Settings.setTouchFriendly ? window.Settings.setTouchFriendly : null,
      setHapticFeedback: window.Settings && window.Settings.setHapticFeedback ? window.Settings.setHapticFeedback : null,
      setReduceMotion: window.Settings && window.Settings.setReduceMotion ? window.Settings.setReduceMotion : null,
      setKeepScreenOn: window.Settings && window.Settings.setKeepScreenOn ? window.Settings.setKeepScreenOn : null,
      setExtraSpacing: window.Settings && window.Settings.setExtraSpacing ? window.Settings.setExtraSpacing : null,
      setCompactLayout: window.Settings && window.Settings.setCompactLayout ? window.Settings.setCompactLayout : null,
      setBlueLightFilter: window.Settings && window.Settings.setBlueLightFilter ? window.Settings.setBlueLightFilter : null,
      setInterfaceScale: window.Settings && window.Settings.setInterfaceScale ? window.Settings.setInterfaceScale : null,
      setFontSize: window.Settings && window.Settings.setFontSize ? window.Settings.setFontSize : null,
      triggerHaptic: window.Settings && window.Settings.triggerHaptic ? window.Settings.triggerHaptic : null,
      onCloseMobileMenu: () => {
        // Chiudi menu mobile se aperto
        const mobileMenu = document.getElementById('mobile-menu');
        const overlay = document.getElementById('mobile-menu-overlay');
        if (mobileMenu && overlay) {
          mobileMenu.classList.remove('active');
          overlay.classList.remove('active');
          document.body.style.overflow = '';
        }
      }
    });
  }
}

// Event listeners per modale linee sono ora gestiti da js/components/modals.js

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
// Le funzioni di caricamento tariffario sono ora in js/data/tariffario.js
// Questa funzione gestisce solo il ripristino dello stato UI dopo il caricamento
async function loadData() {
  // Carica i dati usando il modulo Tariffario
  if (typeof window.Tariffario !== 'undefined' && window.Tariffario.load) {
    await window.Tariffario.load();
    
    // Sincronizza variabili locali con i dati del modulo
    tariffario = window.Tariffario.getData();
    tariffarioAggiornato = window.Tariffario.getAggiornato();
  } else {
    // Fallback se il modulo non è disponibile (non dovrebbe succedere)
    console.warn('⚠️ Modulo Tariffario non disponibile, caricamento fallback...');
    try {
      const res = await fetch('database.json');
      tariffario = await res.json();
      console.log('Database caricato (fallback), tariffario.length:', tariffario.length);
    } catch { 
      tariffario = []; 
    }
    tariffarioAggiornato = null;
    
    // Esponi su window
    if (typeof window !== 'undefined') {
      window.tariffario = tariffario;
      window.tariffarioAggiornato = tariffarioAggiornato;
    }
    
    // Dispara evento
    window.dispatchEvent(new Event('tariffarioLoaded'));
  }

  // Popola linee (wrapper per modals.js)
  populateLinee();

  // Ripristina selezioni usando RouteSelector
  // Aspetta che RouteSelector sia completamente inizializzato
  function restoreRouteState() {
    if (typeof window.RouteSelector !== 'undefined' && window.RouteSelector.restore) {
      try {
        window.RouteSelector.restore();
        // Sincronizza variabili locali per retrocompatibilità
        const state = window.RouteSelector.getState();
        lineaIdx = state.lineaIdx;
        partenzaIdx = state.partenzaIdx;
        arrivoIdx = state.arrivoIdx;
        hasCalculated = state.hasCalculated;
      } catch (error) {
        console.warn('⚠️ Errore durante restore RouteSelector:', error);
        // Fallback se c'è un errore
        useFallbackRestore();
      }
    } else {
      // Fallback se il modulo non è disponibile
      useFallbackRestore();
    }
  }

  function useFallbackRestore() {
    console.warn('⚠️ RouteSelector non disponibile, fallback ripristino...');
    try {
      const sLinea = Storage.getItem('tpl.lineaIdx');
      const sPart = Storage.getItem('tpl.partenzaIdx');
      const sArr = Storage.getItem('tpl.arrivoIdx');
      // Ottieni tariffario dal modulo
      const tariffarioData = (typeof window.Tariffario !== 'undefined' && window.Tariffario.getData) 
        ? window.Tariffario.getData() 
        : tariffario;

      if (sLinea !== null) {
        lineaIdx = sLinea;
        if (lineaText && tariffarioData[lineaIdx]) {
          lineaText.textContent = tariffarioData[lineaIdx].nome;
        }
      }
      if (sPart !== null) partenzaIdx = sPart;
      if (sArr !== null) arrivoIdx = sArr;
      updateFermateButtons();
      if (partenzaIdx !== '' && tariffarioData[lineaIdx] && partenzaText) {
        partenzaText.textContent = tariffarioData[lineaIdx].fermate[partenzaIdx];
      }
      if (arrivoIdx !== '' && tariffarioData[lineaIdx] && arrivoText) {
        arrivoText.textContent = tariffarioData[lineaIdx].fermate[arrivoIdx];
      }
      updateSummary();
      calcolaPrezzo();
    } catch (error) {
      console.error('❌ Errore durante ripristino fallback:', error);
    }
  }

  // Chiama restoreRouteState quando il DOM è pronto
  if (document.readyState === 'loading') {
    // Se il DOM non è ancora pronto, aspetta
    document.addEventListener('DOMContentLoaded', () => {
      // Piccolo delay per assicurarsi che RouteSelector sia completamente inizializzato
      setTimeout(restoreRouteState, 100);
    });
  } else {
    // DOM già pronto, aspetta comunque un po' per assicurarsi che RouteSelector sia inizializzato
    setTimeout(restoreRouteState, 100);
  }

  // Ripristina tema/dimensione testo (gestito da Settings, ma migrazione qui)
  try {
    // Retrocompatibilità: converti vecchio sistema isDark a themeMode
    const oldDarkMode = Storage.getItem('tpl.isDark');
    const existingThemeMode = Storage.getItem('tpl.themeMode');

    if (!existingThemeMode && oldDarkMode !== null) {
      // Migrazione da vecchio sistema
      const newMode = oldDarkMode === '1' ? 'dark' : 'light';
      Storage.setItem('tpl.themeMode', newMode);
      Storage.removeItem('tpl.isDark'); // Rimuovi vecchia impostazione
    }

    // Il tema verrà caricato dal modal impostazioni con loadTheme()
    // Non caricare qui per evitare conflitti

    // Ripristina dimensione testo
    if (window.Settings && window.Settings.initFontSize) {
      window.Settings.initFontSize();
    }
  } catch (error) {
    console.error('❌ Errore durante ripristino tema/dimensione:', error);
  }
}

// --- TRATTE LOGIC ---
// ========================================
// SEZIONE PAGE RENDERERS
// ========================================
// Le funzioni di rendering sono ora in js/features/page-renderers.js
// Usa window.PageRenderers o le funzioni globali (retrocompatibilità):
// - window.renderFermate(lineaIndex, sortByDistance)
// - window.renderPrezzi(lineaIndex)

// Wrapper per retrocompatibilità
function renderFermate(lineaIndex = 0, sortByDistance = false) {
  if (window.PageRenderers && typeof window.PageRenderers.renderFermate === 'function') {
    return window.PageRenderers.renderFermate(lineaIndex, sortByDistance);
  } else if (typeof window.renderFermate === 'function' && window.renderFermate !== renderFermate) {
    // Se esiste già la funzione globale (dal modulo), usala
    return window.renderFermate(lineaIndex, sortByDistance);
  }
  console.warn('⚠️ PageRenderers module not available');
}

function renderPrezzi(lineaIndex = 0) {
  if (window.PageRenderers && typeof window.PageRenderers.renderPrezzi === 'function') {
    return window.PageRenderers.renderPrezzi(lineaIndex);
  } else if (typeof window.renderPrezzi === 'function' && window.renderPrezzi !== renderPrezzi) {
    // Se esiste già la funzione globale (dal modulo), usala
    return window.renderPrezzi(lineaIndex);
  }
  console.warn('⚠️ PageRenderers module not available');
}

// ========================================
// SEZIONE PAGE LINES
// ========================================
// Le funzioni di gestione linee sono ora in js/features/page-renderers.js
// Usa window.PageRenderers o le funzioni globali (retrocompatibilità)

// Wrapper per retrocompatibilità - Fermate
function populateLineeTratte() {
  if (window.PageRenderers && typeof window.PageRenderers.populateLineeTratte === 'function') {
    return window.PageRenderers.populateLineeTratte();
  } else if (typeof window.populateLineeTratte === 'function' && window.populateLineeTratte !== populateLineeTratte) {
    return window.populateLineeTratte();
  }
  console.warn('⚠️ PageRenderers module not available');
}

function openLineeModalFermate() {
  if (window.PageRenderers && typeof window.PageRenderers.openLineeModalFermate === 'function') {
    return window.PageRenderers.openLineeModalFermate();
  } else if (typeof window.openLineeModalFermate === 'function' && window.openLineeModalFermate !== openLineeModalFermate) {
    return window.openLineeModalFermate();
  }
  console.warn('⚠️ PageRenderers module not available');
}

function closeLineeModalFermate() {
  if (window.PageRenderers && typeof window.PageRenderers.closeLineeModalFermate === 'function') {
    return window.PageRenderers.closeLineeModalFermate();
  } else if (typeof window.closeLineeModalFermate === 'function' && window.closeLineeModalFermate !== closeLineeModalFermate) {
    return window.closeLineeModalFermate();
  }
  console.warn('⚠️ PageRenderers module not available');
}

function selectLineaFermate(idx, nome) {
  if (window.PageRenderers && typeof window.PageRenderers.selectLineaFermate === 'function') {
    return window.PageRenderers.selectLineaFermate(idx, nome);
  } else if (typeof window.selectLineaFermate === 'function' && window.selectLineaFermate !== selectLineaFermate) {
    return window.selectLineaFermate(idx, nome);
  }
  console.warn('⚠️ PageRenderers module not available');
}

// Wrapper per retrocompatibilità - Prezzi
function populateLineePrezzi() {
  if (window.PageRenderers && typeof window.PageRenderers.populateLineePrezzi === 'function') {
    return window.PageRenderers.populateLineePrezzi();
  } else if (typeof window.populateLineePrezzi === 'function' && window.populateLineePrezzi !== populateLineePrezzi) {
    return window.populateLineePrezzi();
  }
  console.warn('⚠️ PageRenderers module not available');
}

function openLineeModalPrezzi() {
  if (window.PageRenderers && typeof window.PageRenderers.openLineeModalPrezzi === 'function') {
    return window.PageRenderers.openLineeModalPrezzi();
  } else if (typeof window.openLineeModalPrezzi === 'function' && window.openLineeModalPrezzi !== openLineeModalPrezzi) {
    return window.openLineeModalPrezzi();
  }
  console.warn('⚠️ PageRenderers module not available');
}

function closeLineeModalPrezzi() {
  if (window.PageRenderers && typeof window.PageRenderers.closeLineeModalPrezzi === 'function') {
    return window.PageRenderers.closeLineeModalPrezzi();
  } else if (typeof window.closeLineeModalPrezzi === 'function' && window.closeLineeModalPrezzi !== closeLineeModalPrezzi) {
    return window.closeLineeModalPrezzi();
  }
  console.warn('⚠️ PageRenderers module not available');
}

function selectLineaPrezzi(idx, nome) {
  if (window.PageRenderers && typeof window.PageRenderers.selectLineaPrezzi === 'function') {
    return window.PageRenderers.selectLineaPrezzi(idx, nome);
  } else if (typeof window.selectLineaPrezzi === 'function' && window.selectLineaPrezzi !== selectLineaPrezzi) {
    return window.selectLineaPrezzi(idx, nome);
  }
  console.warn('⚠️ PageRenderers module not available');
}

// ========================================
// SEZIONE PAGE SEARCH
// ========================================
// La funzione setupRicercaPrezzi è ora in js/features/page-renderers.js
// Usa window.PageRenderers.setupRicercaPrezzi() o window.setupRicercaPrezzi() (retrocompatibilità)

// Wrapper per retrocompatibilità
function setupRicercaPrezzi() {
  if (window.PageRenderers && typeof window.PageRenderers.setupRicercaPrezzi === 'function') {
    return window.PageRenderers.setupRicercaPrezzi();
  } else if (typeof window.setupRicercaPrezzi === 'function' && window.setupRicercaPrezzi !== setupRicercaPrezzi) {
    // Se esiste già la funzione globale (dal modulo), usala
    return window.setupRicercaPrezzi();
  }
  console.warn('⚠️ PageRenderers module not available');
}

// ========================================
// SEZIONE PAGE INITIALIZATION
// ========================================
// La funzione initFermatePrezzi() e la logica di inizializzazione
// sono ora in js/features/page-renderers.js
// Il modulo si inizializza automaticamente quando viene caricato

// Wrapper per retrocompatibilità (se necessario)
function initFermatePrezzi() {
  if (window.PageRenderers && typeof window.PageRenderers.initFermatePrezzi === 'function') {
    return window.PageRenderers.initFermatePrezzi();
  } else if (typeof window.initFermatePrezzi === 'function' && window.initFermatePrezzi !== initFermatePrezzi) {
    return window.initFermatePrezzi();
  }
  console.warn('⚠️ PageRenderers module not available');
}

// Funzione per mostrare notifiche all'utente
// Funzioni geolocalizzazione delegate al modulo
// Le funzioni sono esposte globalmente dal modulo per retrocompatibilità
// (handleLocationClick, handleFermateLocationClick, showLocationNotification, disableLocationSorting)
// Se il modulo non è disponibile, queste funzioni non faranno nulla
function showLocationNotification(message, type = 'info') {
  if (window.Geolocation && window.Geolocation.showLocationNotification) {
    return window.Geolocation.showLocationNotification(message, type);
  }
  console.warn('⚠️ Geolocation module not available');
}

async function handleLocationClick() {
  if (window.Geolocation && window.Geolocation.handleLocationClick) {
    const result = await window.Geolocation.handleLocationClick();
    // Sincronizza variabili locali per retrocompatibilità
    if (window.Geolocation.getUserPosition) {
      userPosition = window.Geolocation.getUserPosition();
    }
    if (window.Geolocation.isPermissionGranted) {
      locationPermissionGranted = window.Geolocation.isPermissionGranted();
    }
    return result;
  }
  console.warn('⚠️ Geolocation module not available');
}

async function handleFermateLocationClick() {
  if (!fermateLocationBtn) return;
  
  if (window.Geolocation && window.Geolocation.handleFermateLocationClick) {
    // Il modulo Geolocation gestirà l'ordinamento usando FermateModal.sortByDistance()
    // Non serve più il callback onSorted, il modal gestisce tutto internamente
    const result = await window.Geolocation.handleFermateLocationClick();
    
    // Sincronizza variabili locali per retrocompatibilità
    if (window.Geolocation.getUserPosition) {
      userPosition = window.Geolocation.getUserPosition();
    }
    if (window.Geolocation.isPermissionGranted) {
      locationPermissionGranted = window.Geolocation.isPermissionGranted();
    }
    return result;
  }
  console.warn('⚠️ Geolocation module not available');
}

function disableLocationSorting() {
  if (window.Geolocation && window.Geolocation.disableLocationSorting) {
    return window.Geolocation.disableLocationSorting();
  }
  console.warn('⚠️ Geolocation module not available');
}

// ========================================
// INIZIALIZZAZIONE PAGINE FERMATE/PREZZI
// ========================================
// La logica di inizializzazione è ora gestita automaticamente da
// js/features/page-renderers.js che si inizializza al caricamento
// Non è più necessario qui - mantenuto per riferimento storico

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

// ========================================
// SEZIONE UI HELPERS
// ========================================
// Le funzioni UI helpers sono ora in js/utils/ui-helpers.js
// Usa window.UIHelpers o le funzioni globali (retrocompatibilità):
// - window.scrollToTop()
// - window.toggleScrollToTopButton()
// - window.toggleSwapButton(show)

// Event listener per il pulsante swap (solo se presente nella pagina)
// Questo rimane qui perché dipende da RouteSelector che è caricato dopo ui-helpers
(function initSwapButtonListener() {
  function setupSwapButtonListener() {
    const swapBtn = document.getElementById('swap-btn');
    if (swapBtn && !swapBtn.hasAttribute('data-listener-added')) {
      swapBtn.setAttribute('data-listener-added', 'true');
      swapBtn.addEventListener('click', () => {
        if (typeof window.swapRoutes === 'function') {
          window.swapRoutes();
        }
      });
    }
  }
  
  // Esegui quando il DOM è pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupSwapButtonListener);
  } else {
    setupSwapButtonListener();
  }
})();

window.addEventListener('DOMContentLoaded', async () => {
  await loadData();
  // Inizializza modali dopo il caricamento dei dati
  initializeModalsModules();
});

// Event listeners per controllo animazione
window.addEventListener('DOMContentLoaded', function () {
  // Carica preferenza all'avvio
  // loadAnimationPreference(); // TODO: Funzione non ancora implementata

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

    // Leggi versione dinamicamente da changelog.js
    const versionData = getCurrentVersion();
    if (versionNumber) versionNumber.textContent = `Versione ${versionData ? versionData.version : getCurrentVersionSync()}`;
    if (versionDate) {
      const dateTime = versionData ?
        (versionData.date + (versionData.time ? ' ' + versionData.time : '')) :
        'Data non disponibile';
      versionDate.textContent = dateTime;
    }
  }

  // Gestisce il click sulla card versione
  function handleQuickUpdate() {
    const versionCard = document.getElementById('mobile-version-card');
    if (versionCard) {
      versionCard.addEventListener('click', function () {
        // Chiude il menu mobile se aperto
        const mobileMenu = document.getElementById('mobile-menu');
        const overlay = document.getElementById('mobile-menu-overlay');
        if (mobileMenu && overlay) {
          mobileMenu.classList.remove('active');
          overlay.classList.remove('active');
        }
        // Apre il modale di aggiornamento
        if (typeof Updates !== 'undefined' && typeof Updates.checkForUpdates === 'function') {
          Updates.checkForUpdates();
        } else {
          console.error('❌ Updates.checkForUpdates non disponibile');
        }
      });
    }
  }

  // Pulsanti desktop - usa event delegation per gestire tutti i pulsanti
  document.addEventListener('click', function (e) {
    if (e.target.closest('#animationToggle')) {
      if (window.Settings && window.Settings.toggleAnimation) {
        window.Settings.toggleAnimation();
      }
    }
    if (e.target.closest('#mobile-animation-toggle')) {
      if (window.Settings && window.Settings.toggleAnimation) {
        window.Settings.toggleAnimation();
      }
      // Chiudi il menu mobile se esiste
      if (typeof closeMenu === 'function') {
        closeMenu();
      }
    }
  });
});

// --- HAMBURGER MENU LOGIC ---
(function () {
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
  // Escludi il pulsante Impostazioni che ha comportamento speciale (apre modal)
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link:not(#open-settings), .mobile-menu-link');
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
      if (typeof Updates !== 'undefined' && typeof Updates.checkForUpdates === 'function') {
        Updates.checkForUpdates();
      } else if (typeof checkForUpdates === 'function') {
        // Fallback per compatibilità
        checkForUpdates();
      } else {
        console.error('❌ Updates.checkForUpdates non disponibile');
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
      const lastDismiss = Storage.getItem('tpl.pwa.dismissTs');
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
          Storage.setItem('tpl.pwa.dismissTs', String(Date.now()));
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
      Storage.setItem('tpl.pwa.dismissTs', String(Date.now()));
    });
  }

  // Evento installata
  window.addEventListener('appinstalled', () => {
    hideBanner();
    Storage.removeItem('tpl.pwa.dismissTs');
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

    // Event listener per il pulsante "Resetta percorso"
    const resetRouteBtn = document.getElementById('reset-route-btn');
    if (resetRouteBtn) {
      resetRouteBtn.addEventListener('click', () => {
        if (window.RouteSelector && typeof window.RouteSelector.resetRoute === 'function') {
          window.RouteSelector.resetRoute();
        } else {
          console.warn('⚠️ RouteSelector.resetRoute non disponibile');
        }
      });
    }
  });
}

// ================================
// SISTEMA NOTIFICHE OFFLINE
// ================================
// Le funzioni di notifiche offline sono ora in js/utils/offline-notifications.js
// Usa window.OfflineNotifications.show() e window.OfflineNotifications.hide() per richiamarle
// La funzione hideOfflineBanner() è esposta globalmente per retrocompatibilità (onclick nell'HTML)

// =====================================
// MODAL IMPOSTAZIONI
// =====================================
// Le funzioni di impostazioni sono ora in js/features/settings.js
// La gestione del modal impostazioni (UI) è in js/components/modals.js
// Viene inizializzato in initializeModalsModules() dopo il caricamento dei dati

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
    // Nota: Storage.getItem può restituire booleano (se salvato come JSON) o stringa
    const pwaTestModeValue = Storage.getItem('tpl.pwaTestMode');
    const isTestMode = pwaTestModeValue === 'true' || pwaTestModeValue === true;
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
    
    // Il modal potrebbe non essere ancora caricato (viene caricato dinamicamente)
    if (!settingsBtn) {
      return; // Pulsante non trovato, esci silenziosamente
    }

    // Rimuovi listener precedenti se esistono
    const newBtn = settingsBtn.cloneNode(true);
    settingsBtn.parentNode.replaceChild(newBtn, settingsBtn);

    // Aggiungi listener che usa SettingsModal.open() se disponibile (metodo preferito)
    newBtn.addEventListener('click', async function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      console.log('⚙️ Click su pulsante impostazioni PWA!');
      
      // Prova prima con SettingsModal.open() (metodo preferito - gestisce tutto correttamente)
      if (typeof window.SettingsModal !== 'undefined' && 
          typeof window.SettingsModal.open === 'function') {
        console.log('✅ Usando SettingsModal.open()');
        try {
          await window.SettingsModal.open();
          return;
        } catch (error) {
          console.error('❌ Errore nell\'apertura del modal con SettingsModal.open():', error);
          // Continua con il fallback
        }
      }
      
      // Fallback: prova a caricare e aprire il modal manualmente
      const settingsModal = document.getElementById('settings-modal');
      
      if (!settingsModal) {
        // Se il modal non esiste, prova a caricarlo dinamicamente
        console.log('📥 Modal non trovato, tentativo di caricamento...');
        
        // Prova a chiamare loadHTML se disponibile
        if (typeof window.SettingsModal !== 'undefined' && 
            typeof window.SettingsModal.loadHTML === 'function') {
          try {
            await window.SettingsModal.loadHTML();
            // Dopo il caricamento, riprova ad aprire usando open()
            if (typeof window.SettingsModal.open === 'function') {
              await window.SettingsModal.open();
              return;
            }
          } catch (error) {
            console.error('❌ Errore nel caricamento del modal:', error);
          }
        }
        
        console.warn('⚠️ Modal impostazioni non trovato e impossibile caricarlo.');
        return;
      }

      // Se il modal esiste, aprilo direttamente
      console.log('✅ Apertura modal esistente');
      settingsModal.style.display = 'flex';
      setTimeout(function() {
        settingsModal.classList.add('show');
        console.log('✅ Modal impostazioni aperto', {
          display: settingsModal.style.display,
          classList: settingsModal.classList.toString()
        });
      }, 10);
    });
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
    const isOfflineTestMode = Storage.getItem('tpl.offlineTestMode') === 'true';

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
  window.refreshPWABottomNav = function () {
    toggleBottomNav();
    highlightActiveTab();
  };
})();

// ========================================
// PULSANTE "VEDI TUTTI GLI AGGIORNAMENTI"
// ========================================
(function () {
  const showAllBtn = document.getElementById('show-all-updates-btn');

  if (showAllBtn) {
    showAllBtn.addEventListener('click', function () {
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
(function () {
  const restartBtn = document.getElementById('restart-app-btn');

  if (restartBtn) {
    restartBtn.addEventListener('click', function () {
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

  updateBtn.addEventListener('click', function () {
    console.log('🔄 Pulsante PWA Update cliccato');

    // Chiudi il modal Impostazioni prima
    if (typeof SettingsModal !== 'undefined' && SettingsModal.close) {
      SettingsModal.close();
    }

    // Aspetta un attimo e poi verifica aggiornamenti
    setTimeout(() => {
      if (typeof Updates !== 'undefined' && typeof Updates.checkForUpdates === 'function') {
        console.log('✅ Chiamata a Updates.checkForUpdates()');
        Updates.checkForUpdates();
      } else if (typeof checkForUpdates === 'function') {
        // Fallback per compatibilità
        console.log('✅ Chiamata a checkForUpdates() (fallback)');
        checkForUpdates();
      } else {
        console.error('❌ Updates.checkForUpdates non è disponibile');
      }
    }, 400);
  });
})();
