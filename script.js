// script.js - Gestione logica TPL FVG

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

// RIMOSSO: calculateDistance() e requestUserLocation() - non usate direttamente
// Usa window.Geolocation.calculateDistance() e window.Geolocation.requestUserLocation() direttamente

function sortFermateByDistance(fermate, userPos) {
  if (window.Geolocation && window.Geolocation.sortFermateByDistance) {
    return window.Geolocation.sortFermateByDistance(fermate, userPos);
  }
  console.warn('⚠️ Geolocation module not available, returning unsorted fermate');
  return fermate.map((name, index) => ({ name, index, distance: null, coordinates: null }));
}

// RIMOSSO: isGeolocationSupported() e toggleLocationButton() - non usate
// Usa window.Geolocation.isGeolocationSupported() e window.Geolocation.toggleLocationButton() direttamente

// toggleSwapButton è ora in js/utils/ui-helpers.js
// Mantenuto come commento per riferimento - la funzione è esposta globalmente dal modulo
// window.toggleSwapButton() è disponibile direttamente da ui-helpers.js

// RIMOSSO: updateLocationButtonIcon() - non usata
// Usa window.Geolocation.updateLocationButtonIcon() direttamente

// ========================================
// SEZIONE 1: ANIMAZIONE SFONDO
// ========================================
// Le funzioni di animazione sono ora in js/features/settings.js
// Usa window.Settings.toggleAnimation() per richiamarle

// Elementi DOM
const mainApp = document.getElementById('main-app');
// NOTE: darkModeToggle rimosso - ora gestito direttamente da Settings.setThemeMode()
const lineaBtn = document.getElementById('linea-btn');
const lineaText = document.getElementById('linea-text');
const partenzaBtn = document.getElementById('partenza-btn');
const arrivoBtn = document.getElementById('arrivo-btn');
const partenzaText = document.getElementById('partenza-text');
const arrivoText = document.getElementById('arrivo-text');
const swapBtn = document.getElementById('swap-btn');
const summaryPrezzo = document.getElementById('summary-prezzo');
const summaryCodice = document.getElementById('summary-codice');
const summaryPartenza = document.getElementById('summary-partenza');
const summaryArrivo = document.getElementById('summary-arrivo');
const footerYear = document.getElementById('footer-year');
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
// Modal fermate state
// Le variabili currentModalType e filteredFermate sono ora gestite internamente da js/components/modals.js

// Utility dark mode
// NOTE: setDarkMode() rimossa - ora si usa direttamente Settings.setThemeMode()

// SPOSTATO: toggleDark() → js/features/settings.js
// La funzione è ora esposta globalmente da Settings.toggleDark()
// Mantenuto wrapper per retrocompatibilità hamburger-menu.js
window.toggleDark = function() {
  if (window.Settings && window.Settings.toggleDark) {
    window.Settings.toggleDark();
  }
};

// ================================
// SISTEMA ACCESSIBILITÀ - DIMENSIONE TESTO
// ================================
// Le funzioni di dimensione testo sono ora in js/features/settings.js
// Usa window.Settings.setFontSize() e window.Settings.initFontSize() per richiamarle


// NOTE: populateLinee() rimossa - il popolamento avviene automaticamente quando si apre LineeModal
// Non più necessaria, il modal si popola automaticamente all'apertura

// NOTE: updateFermateButtons() rimossa - ora si usa direttamente RouteSelector.updateUI()
// Mantenuta solo come alias per retrocompatibilità
// RIMOSSO: updateFermateButtons() - duplicato di RouteSelector.updateUI()
// Usa window.RouteSelector.updateUI() direttamente

// ===== MODAL FERMATE =====
// Le funzioni del modal fermate sono ora in js/components/modals.js
// Questo script usa solo l'API pubblica esposta dal modulo

// Wrapper per compatibilità - delega a FermateModal
// SPOSTATO: openFermateModal() e closeFermateModal() → js/components/modals.js
// Usa FermateModal.open(type) e FermateModal.close() direttamente

// ===== MODAL LINEE =====
// Le funzioni del modal linee sono ora in js/components/modals.js
// Questo script usa solo l'API pubblica esposta dal modulo

// Wrapper per compatibilità - delega a LineeModal
// SPOSTATO: openLineeModal() e closeLineeModal() → js/components/modals.js  
// Usa LineeModal.open() e LineeModal.close() direttamente

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
    window.Storage.setItem('tpl.lineaIdx', lineaIdx);
  }

  // Chiudi modal linee usando il modulo
  if (typeof LineeModal !== 'undefined' && LineeModal.close) {
    LineeModal.close();
  }
}

// Funzioni populateFermateList, renderFermateList, selectFermata, filterFermate
// sono ora in js/components/modals.js e vengono gestite internamente dal modulo

// NOTE: updatePriceCardState(), updateSummary(), calcolaPrezzo() sono wrapper duplicati
// Tutte chiamano RouteSelector.updateUI() che aggiorna UI, summary, prezzo e stato card
// Mantenute per retrocompatibilità con codice esistente

/**
 * Aggiorna lo stato della card prezzo
 * Wrapper per RouteSelector.updateUI()
 */
// RIMOSSO: updatePriceCardState() - duplicato di RouteSelector.updateUI() 
// Usa window.RouteSelector.updateUI() direttamente

// RIMOSSO: updateSummary() e calcolaPrezzo() - duplicati di RouteSelector.updateUI()
// Usa window.RouteSelector.updateUI() direttamente

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
    window.Storage.removeItem('tpl.lineaIdx');
    window.Storage.removeItem('tpl.partenzaIdx');
    window.Storage.removeItem('tpl.arrivoIdx');
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
// NOTE: darkModeToggle rimosso - ora gestito direttamente da Settings.setThemeMode()

// Event listeners per font size - solo pulsanti mobile (i pulsanti legacy sono stati rimossi)
document.querySelectorAll('.mobile-font-btn').forEach(btn => {
  btn.addEventListener('click', function () {
    const size = this.dataset.size;
    if (size && window.Settings && window.Settings.setFontSize) {
      window.Settings.setFontSize(size);
    }
  });
});

// NOTE: cacheResetBtn rimosso - ora gestito direttamente da Updates.checkForUpdates()

// Event listeners per modal cache
// NOTE: Le funzioni cancelResetCache e confirmResetCache sono in window.Updates
const cacheCancelBtn = document.getElementById('cache-cancel');
const cacheConfirmBtn = document.getElementById('cache-confirm');
const cacheModal = document.getElementById('cache-modal');

if (cacheCancelBtn) {
  cacheCancelBtn.addEventListener('click', () => {
    if (window.Updates && typeof window.Updates.cancelResetCache === 'function') {
      window.Updates.cancelResetCache();
    } else {
      console.warn('⚠️ Updates.cancelResetCache non disponibile');
    }
  });
}

if (cacheConfirmBtn) {
  cacheConfirmBtn.addEventListener('click', () => {
    if (window.Updates && typeof window.Updates.confirmResetCache === 'function') {
      window.Updates.confirmResetCache();
    } else {
      console.warn('⚠️ Updates.confirmResetCache non disponibile');
    }
  });
}

// Chiudi modal cliccando fuori
if (cacheModal) {
  cacheModal.addEventListener('click', function (e) {
    if (e.target === cacheModal) {
      if (window.Updates && typeof window.Updates.cancelResetCache === 'function') {
        window.Updates.cancelResetCache();
      }
    }
  });
}

// Chiudi modal con ESC
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    const modal = document.getElementById('cache-modal');
    if (modal && modal.style.display === 'block') {
      if (window.Updates && typeof window.Updates.cancelResetCache === 'function') {
        window.Updates.cancelResetCache();
      }
    }

    // Chiudi modal linee fermate se aperto
    const lineeModalFermate = document.getElementById('linee-fermate-modal');
    if (lineeModalFermate && lineeModalFermate.classList.contains('show')) {
      if (typeof window.closeLineeModalFermate === 'function') {
        window.closeLineeModalFermate();
      }
    }

    // Chiudi modal linee prezzi se aperto
    const lineeModalPrezzi = document.getElementById('linee-prezzi-modal');
    if (lineeModalPrezzi && lineeModalPrezzi.classList.contains('show')) {
      if (typeof window.closeLineeModalPrezzi === 'function') {
        window.closeLineeModalPrezzi();
      }
    }
  }
});
// Event listener per apertura modale linee
if (lineaBtn) {
  lineaBtn.addEventListener('click', () => {
    if (typeof LineeModal !== 'undefined' && LineeModal.open) {
      LineeModal.open();
    }
  });
}

// Event listeners per pulsanti partenza/arrivo
if (partenzaBtn) {
  partenzaBtn.addEventListener('click', () => {
    if (typeof FermateModal !== 'undefined' && FermateModal.open) {
      FermateModal.open('partenza');
    }
  });
}
if (arrivoBtn) {
  arrivoBtn.addEventListener('click', () => {
    if (typeof FermateModal !== 'undefined' && FermateModal.open) {
      FermateModal.open('arrivo');
    }
  });
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
      getCurrentPartenzaIdx: () => {
        // Usa RouteSelector se disponibile
        if (typeof window.RouteSelector !== 'undefined' && window.RouteSelector.getPartenzaIdx) {
          return window.RouteSelector.getPartenzaIdx();
        }
        return partenzaIdx;
      },
      getCurrentArrivoIdx: () => {
        // Usa RouteSelector se disponibile
        if (typeof window.RouteSelector !== 'undefined' && window.RouteSelector.getArrivoIdx) {
          return window.RouteSelector.getArrivoIdx();
        }
        return arrivoIdx;
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
            window.Storage.setItem('tpl.partenzaIdx', partenzaIdx);

            // Se l'utente modifica manualmente la partenza, resetta lo stato UI del pulsante GPS
            if (window.Geolocation && typeof window.Geolocation.resetLocationButtonUI === 'function') {
              window.Geolocation.resetLocationButtonUI();
            } else if (typeof window.resetLocationButtonUI === 'function') {
              window.resetLocationButtonUI();
            }
          } else if (type === 'arrivo') {
            arrivoIdx = index;
            if (arrivoText && tariffarioData[lineaIdx]) {
              arrivoText.textContent = tariffarioData[lineaIdx].fermate[index];
            }
            window.Storage.setItem('tpl.arrivoIdx', arrivoIdx);
          }
          // Usa direttamente RouteSelector.updateUI() invece dei wrapper
          if (window.RouteSelector && window.RouteSelector.updateUI) {
            window.RouteSelector.updateUI();
          }
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

// NOTE: Event listeners per modale linee sono ora gestiti da js/components/modals.js e js/features/page-renderers.js
// Le funzioni closeLineeModalFermate, openLineeModalFermate, closeLineeModalPrezzi, openLineeModalPrezzi
// sono esposte globalmente da page-renderers.js e vengono gestite internamente dal modulo

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

  // NOTE: populateLinee() rimossa - il popolamento avviene automaticamente quando si apre LineeModal

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
      const sLinea = window.Storage.getItem('tpl.lineaIdx');
      const sPart = window.Storage.getItem('tpl.partenzaIdx');
      const sArr = window.Storage.getItem('tpl.arrivoIdx');
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
      // Usa direttamente RouteSelector.updateUI() invece dei wrapper
      if (window.RouteSelector && window.RouteSelector.updateUI) {
        window.RouteSelector.updateUI();
      }
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
    const oldDarkMode = window.Storage.getItem('tpl.isDark');
    const existingThemeMode = window.Storage.getItem('tpl.themeMode');

    if (!existingThemeMode && oldDarkMode !== null) {
      // Migrazione da vecchio sistema
      const newMode = oldDarkMode === '1' ? 'dark' : 'light';
      window.Storage.setItem('tpl.themeMode', newMode);
      window.Storage.removeItem('tpl.isDark'); // Rimuovi vecchia impostazione
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

// RIMOSSO: renderFermate() e renderPrezzi() - wrapper non necessari
// I moduli PageRenderers espongono già le funzioni globalmente
// Usa window.renderFermate() e window.renderPrezzi() direttamente

// ========================================
// SEZIONE PAGE LINES
// ========================================
// Le funzioni di gestione linee sono ora in js/features/page-renderers.js
// Usa window.PageRenderers o le funzioni globali (retrocompatibilità)

// RIMOSSO: populateLineeTratte() - wrapper non necessario
// Usa window.populateLineeTratte() direttamente dal modulo PageRenderers

// RIMOSSO: openLineeModalFermate() e closeLineeModalFermate() - wrapper non necessari
// Usa window.openLineeModalFermate() e window.closeLineeModalFermate() direttamente

// RIMOSSO: selectLineaFermate() - wrapper non necessario
// Usa window.selectLineaFermate() direttamente

// RIMOSSO: populateLineePrezzi() e openLineeModalPrezzi() - wrapper non necessari
// Usa window.populateLineePrezzi() e window.openLineeModalPrezzi() direttamente

// RIMOSSO: closeLineeModalPrezzi() e selectLineaPrezzi() - wrapper non necessari
// Usa window.closeLineeModalPrezzi() e window.selectLineaPrezzi() direttamente

// ========================================
// SEZIONE PAGE SEARCH
// ========================================
// La funzione setupRicercaPrezzi è ora in js/features/page-renderers.js
// Usa window.PageRenderers.setupRicercaPrezzi() o window.setupRicercaPrezzi() (retrocompatibilità)

// RIMOSSO: setupRicercaPrezzi() - wrapper non necessario
// Usa window.setupRicercaPrezzi() direttamente

// ========================================
// SEZIONE PAGE INITIALIZATION
// ========================================
// La funzione initFermatePrezzi() e la logica di inizializzazione
// sono ora in js/features/page-renderers.js
// Il modulo si inizializza automaticamente quando viene caricato

// RIMOSSO: initFermatePrezzi() - wrapper non necessario
// Il modulo PageRenderers si auto-inizializza

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

// NOTE: Codice per tratte.html rimosso - la pagina tratte.html non esiste nel progetto
// Se necessario, la funzionalità di ricerca è gestita da page-renderers.js per fermate.html

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
  // NOTE: loadAnimationPreference() è in Settings.initialize() e viene chiamata automaticamente

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
    // NOTE: #animationToggle rimosso - ora gestito direttamente da Settings.toggleAnimation()
    if (e.target.closest('#mobile-animation-toggle')) {
      if (window.Settings && window.Settings.toggleAnimation) {
        window.Settings.toggleAnimation();
      }
      // Chiudi il menu mobile se esiste
      // Usa HamburgerMenu.close() se disponibile
      if (typeof window.HamburgerMenu !== 'undefined' && typeof window.HamburgerMenu.close === 'function') {
        window.HamburgerMenu.close();
      } else {
        // Fallback: chiudi manualmente
        const mobileMenu = document.getElementById('mobile-menu');
        const overlay = document.getElementById('mobile-menu-overlay');
        const hamburgerToggle = document.getElementById('hamburger-toggle');
        if (mobileMenu && overlay && hamburgerToggle) {
          hamburgerToggle.classList.remove('active');
          mobileMenu.classList.remove('active');
          overlay.classList.remove('active');
          document.body.style.overflow = '';
        }
      }
    }
  });
});

// --- HAMBURGER MENU LOGIC ---
// CODICE SPOSTATO IN js/components/hamburger-menu.js (09/11/2025)
// Il modulo hamburger-menu.js si auto-inizializza e gestisce automaticamente il menu mobile
// API disponibile: window.HamburgerMenu (open, close, isOpen, init)

// --- PWA Install Banner ---
// CODICE SPOSTATO IN js/components/pwa-install.js (10/11/2025)
// Il modulo pwa-install.js si auto-inizializza e gestisce automaticamente il banner installazione PWA
// API disponibile: window.PWAInstall (init, show, hide, getDeferredPrompt, setDeferredPrompt)

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
// NOTA: Questo codice è stato spostato in js/components/pwa-bottom-nav.js
// Il modulo gestisce:
// - Brand header e bottom navigation
// - Scroll progress bar
// - PWA Update Check Button
// - Simulazione offline globale (per test)
// ========================================

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

// NOTA: PWA Scroll Progress Bar e PWA Update Check Button
// sono stati spostati in js/components/pwa-bottom-nav.js
