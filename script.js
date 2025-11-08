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

function toggleSwapButton(show) {
  const swapBtn = document.getElementById('swap-btn');
  if (swapBtn) {
    swapBtn.style.display = show ? 'flex' : 'none';
  }
}

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
function renderFermate(lineaIndex = 0, sortByDistance = false) {
  console.log('renderFermate chiamata con lineaIndex:', lineaIndex, 'sortByDistance:', sortByDistance);
  const andataList = document.getElementById('fermate-andata');
  const ritornoList = document.getElementById('fermate-ritorno');
  const gridContainer = document.getElementById('fermate-grid-container');
  const searchContainer = document.getElementById('search-container-fermate');

  // Ottieni tariffario dal modulo
  const tariffarioData = (typeof window.Tariffario !== 'undefined' && window.Tariffario.getData) 
    ? window.Tariffario.getData() 
    : tariffario;

  console.log('andataList:', !!andataList, 'ritornoList:', !!ritornoList, 'tariffario[lineaIndex]:', !!tariffarioData[lineaIndex]);

  if (!andataList || !ritornoList || !tariffarioData[lineaIndex]) {
    console.error('Impossibile generare liste tratte');
    return;
  }

  const linea = tariffarioData[lineaIndex];
  let fermate = linea.fermate;
  console.log('Rendering liste tratte per linea:', linea.nome, 'con', fermate.length, 'fermate');

  // Pulisce le liste precedenti
  andataList.innerHTML = '';
  ritornoList.innerHTML = '';

  // Se richiesto, ordina per distanza
  let sortedFermate = fermate;
  if (sortByDistance) {
    // Usa posizione dal modulo Geolocation
    const currentUserPosition = (window.Geolocation && window.Geolocation.getUserPosition) 
      ? window.Geolocation.getUserPosition() 
      : userPosition;
    
    if (currentUserPosition) {
      const sorted = sortFermateByDistance(fermate, currentUserPosition);
      sortedFermate = sorted.map(item => item.name);
      console.log('Fermate ordinate per distanza:', sorted);
    }
  }

  // Popola lista andata (0 → fine) - INCLUDE TUTTE LE FERMATE
  for (let i = 0; i < sortedFermate.length; i++) {
    const li = document.createElement('li');
    li.classList.add('fermate-item');

    // Trova l'indice originale della fermata
    const originalIndex = fermate.indexOf(sortedFermate[i]);
    // Usa posizione dal modulo Geolocation
    const currentUserPosition = (window.Geolocation && window.Geolocation.getUserPosition) 
      ? window.Geolocation.getUserPosition() 
      : userPosition;
    const distance = currentUserPosition ? sortFermateByDistance(fermate, currentUserPosition).find(f => f.name === sortedFermate[i])?.distance : null;

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
    // Usa posizione dal modulo Geolocation
    const currentUserPosition = (window.Geolocation && window.Geolocation.getUserPosition) 
      ? window.Geolocation.getUserPosition() 
      : userPosition;
    const distance = currentUserPosition ? sortFermateByDistance(fermate, currentUserPosition).find(f => f.name === sortedFermate[i])?.distance : null;

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
  console.log('Mostro griglia e ricerca...');
  if (gridContainer) {
    gridContainer.style.display = 'grid';
    console.log('✅ gridContainer mostrato, display:', gridContainer.style.display);
  } else {
    console.error('❌ gridContainer non trovato!');
  }
  
  if (searchContainer) {
    searchContainer.style.display = 'flex';
    console.log('✅ searchContainer mostrato, display:', searchContainer.style.display);
  } else {
    console.error('❌ searchContainer non trovato!');
  }
  
  console.log('✅ renderFermate completata. Fermate andata:', andataList.children.length, 'Fermate ritorno:', ritornoList.children.length);
}

// --- TARIFFE LOGIC ---
function renderPrezzi(lineaIndex = 0) {
  console.log('renderPrezzi chiamata con lineaIndex:', lineaIndex);
  const andataTable = document.getElementById('prezzi-andata');
  const ritornoTable = document.getElementById('prezzi-ritorno');
  // Ottieni tariffario dal modulo
  const tariffarioData = (typeof window.Tariffario !== 'undefined' && window.Tariffario.getData) 
    ? window.Tariffario.getData() 
    : tariffario;

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
    const usePricing = typeof Pricing !== 'undefined' && Pricing.getTicketCode && Pricing.formatPrice;

    for (let i = 0; i < fermate.length; i++) {
      for (let j = 0; j < fermate.length; j++) {
        if (i === j) continue;
        if (!filterFn(i, j)) continue;

        let prezzo = null;
        let codice = '';

        if (usePricing) {
          // Usa Pricing.js per recuperare codice e prezzo
          const result = Pricing.calculatePrice(lineaIndex, i, j, tariffario, tariffarioAggiornato);
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

// Popola modal linee per pagina fermate
function populateLineeTratte() {
  console.log('populateLineeTratte chiamata, tariffario.length:', tariffario ? tariffario.length : 0);
  
  const lineeModalList = document.getElementById('linee-fermate-modal-list');
  const lineaBtn = document.getElementById('linea-fermate-btn');

  if (!lineeModalList) {
    console.warn('⚠️ linee-fermate-modal-list non trovato');
    return;
  }
  
  // Ottieni tariffario dal modulo
  const tariffarioData = (typeof window.Tariffario !== 'undefined' && window.Tariffario.getData) 
    ? window.Tariffario.getData() 
    : tariffario;

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
    newLineaBtn.addEventListener('click', openLineeModalFermate);
  }
  
  // Event listener per chiusura modal
  const closeBtn = document.getElementById('linee-fermate-modal-close');
  if (closeBtn) {
    // Rimuovi listener esistenti per evitare duplicati
    closeBtn.replaceWith(closeBtn.cloneNode(true));
    const newCloseBtn = document.getElementById('linee-fermate-modal-close');
    newCloseBtn.addEventListener('click', closeLineeModalFermate);
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

// Apri modal linee per fermate
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
    if (tariffario && tariffario.length > 0) {
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
  console.log('selectLineaFermate chiamata con idx:', idx, 'nome:', nome);
  
  // Converti idx a numero se necessario
  const lineaIndex = typeof idx === 'string' ? parseInt(idx, 10) : idx;
  
  // Ottieni tariffario dal modulo
  const tariffarioData = (typeof window.Tariffario !== 'undefined' && window.Tariffario.getData) 
    ? window.Tariffario.getData() 
    : tariffario;
  
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
  const andataTitle = document.getElementById('andata-title');
  const ritornoTitle = document.getElementById('ritorno-title');

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

  // Aggiorna titoli
  const firstStop = fermate[0];
  const lastStop = fermate[fermate.length - 1];
  if (andataTitle) andataTitle.textContent = `(${firstStop} → ${lastStop})`;
  if (ritornoTitle) ritornoTitle.textContent = `(${lastStop} → ${firstStop})`;

  // Mostra griglia e ricerca
  console.log('Mostro elementi UI...');
  if (gridContainer) {
    gridContainer.style.display = 'grid';
    // NON aggiungere show-on-mobile perché nasconde su mobile - rimuovila se presente
    gridContainer.classList.remove('show-on-mobile');
    console.log('✅ gridContainer mostrato, display:', gridContainer.style.display, 'classList:', gridContainer.classList.toString());
  } else {
    console.error('❌ gridContainer non trovato in selectLineaFermate!');
  }
  
  if (searchContainer) {
    searchContainer.style.display = 'flex';
    // NON aggiungere show-on-mobile perché nasconde su mobile - rimuovila se presente
    searchContainer.classList.remove('show-on-mobile');
    console.log('✅ searchContainer mostrato, display:', searchContainer.style.display);
  } else {
    console.error('❌ searchContainer non trovato in selectLineaFermate!');
  }

  // Messaggio mobile rimosso

  // Renderizza tratte con l'indice selezionato
  console.log('Chiamata renderFermate con indice:', lineaIndex);
  renderFermate(lineaIndex);

  // Chiudi modal
  closeLineeModalFermate();
}

// Popola modal linee per pagina prezzi
function populateLineePrezzi() {
  // Ottieni tariffario dal modulo
  const tariffarioData = (typeof window.Tariffario !== 'undefined' && window.Tariffario.getData) 
    ? window.Tariffario.getData() 
    : tariffario;
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

  // Ottieni tariffario dal modulo
  const tariffarioData = (typeof window.Tariffario !== 'undefined' && window.Tariffario.getData) 
    ? window.Tariffario.getData() 
    : tariffario;

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

// Event listeners per pulsanti (sostituiscono onclick inline)
// Sostituisce onclick inline per migliorare separazione HTML/JS
(function initButtonListeners() {
  function setupButtonListeners() {
    // Event listener per il click sul pulsante scroll-to-top
    const scrollToTopButtons = document.querySelectorAll('.scroll-to-top');
    scrollToTopButtons.forEach(button => {
      // Aggiungi listener solo se non è già stato aggiunto
      if (!button.hasAttribute('data-listener-added')) {
        button.setAttribute('data-listener-added', 'true');
        button.addEventListener('click', scrollToTop);
      }
    });
    
    // Event listener per il pulsante swap (solo se presente nella pagina)
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
    document.addEventListener('DOMContentLoaded', setupButtonListeners);
  } else {
    setupButtonListeners();
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
    const isTestMode = Storage.getItem('tpl.pwaTestMode') === 'true';
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

    // Aggiungi listener che cerca il modal al momento del click
    newBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const settingsModal = document.getElementById('settings-modal');
      
      if (!settingsModal) {
        // Se il modal non esiste ancora, prova ad aprire usando SettingsModal se disponibile
        if (typeof SettingsModal !== 'undefined' && SettingsModal.open) {
          SettingsModal.open();
          return;
        }
        console.warn('⚠️ Modal impostazioni non trovato. Potrebbe essere ancora in caricamento.');
        return;
      }

      console.log('⚙️ Click su pulsante impostazioni!');

      // Apri il modal con animazione
      settingsModal.style.display = 'flex';
      setTimeout(function() {
        settingsModal.classList.add('show');
      }, 10);

      console.log('✅ Modal impostazioni aperto', {
        display: settingsModal.style.display,
        classList: settingsModal.classList.toString()
      });
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
