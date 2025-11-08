// ===== COMPONENTE: MODAL FERMATE =====
// Gestione modale per selezione fermate
// Indipendente da script.js - usa callback per comunicare

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

  // ===== VARIABILI PRIVATE =====
  let currentModalType = ''; // 'partenza' o 'arrivo'
  let filteredFermate = [];

  // ===== CALLBACK E CONFIGURAZIONE =====
  let getCurrentLineaIdx = null; // Callback per ottenere lineaIdx corrente
  let getTariffario = null; // Callback per ottenere tariffario
  let onFermataSelected = null; // Callback quando viene selezionata una fermata

  // ===== ELEMENTI DOM =====
  const fermateModal = document.getElementById('fermate-modal');
  const fermateModalTitle = document.getElementById('fermate-modal-title');
  const fermateModalClose = document.getElementById('fermate-modal-close');
  const fermateSearchInput = document.getElementById('fermate-search-input');
  const fermateClearSearch = document.getElementById('fermate-clear-search');
  const fermateModalList = document.getElementById('fermate-modal-list');
  const fermateLocationBtn = document.getElementById('fermate-location-btn');
  const fermateLocationIcon = document.getElementById('fermate-location-icon');
  const fermateLocationText = document.getElementById('fermate-location-text');

  // ===== FUNZIONI PRIVATE =====

  /**
   * Popola la lista delle fermate dal tariffario
   */
  function populateFermateList() {
    if (!fermateModalList || !getCurrentLineaIdx || !getTariffario) return;

    const lineaIdx = getCurrentLineaIdx();
    const tariffario = getTariffario();

    if (!tariffario || !tariffario[lineaIdx] || !tariffario[lineaIdx].fermate) return;

    const fermate = tariffario[lineaIdx].fermate;
    filteredFermate = fermate.map((fermata, index) => ({ name: fermata, index }));

    renderFermateList();
  }

  /**
   * Renderizza la lista delle fermate filtrate
   */
  function renderFermateList() {
    if (!fermateModalList) return;

    fermateModalList.innerHTML = '';

    filteredFermate.forEach(({ name, index, distance }) => {
      const li = document.createElement('li');
      
      // Se la distanza è disponibile, mostra anche quella
      if (distance !== null && distance !== undefined) {
        const distanceText = distance.toFixed(1);
        li.innerHTML = `
          <span class="fermata-name">${name}</span>
          <span class="fermata-distance">${distanceText} km</span>
        `;
      } else {
        li.textContent = name;
      }
      
      li.dataset.index = index;

      li.addEventListener('click', () => selectFermata(index));
      fermateModalList.appendChild(li);
    });
  }

  /**
   * Riordina le fermate per distanza usando il modulo Geolocation
   * @param {Object} userPosition - Posizione utente {latitude, longitude}
   * @returns {boolean} true se l'ordinamento è stato applicato
   */
  function sortFermateByDistance(userPosition) {
    if (!userPosition || !filteredFermate || filteredFermate.length === 0) {
      return false;
    }

    // Usa il modulo Geolocation se disponibile
    if (window.Geolocation && window.Geolocation.sortFermateByDistance) {
      // Estrai solo i nomi delle fermate per l'ordinamento
      const fermateNames = filteredFermate.map(f => f.name);
      
      // Ordina per distanza
      const sorted = window.Geolocation.sortFermateByDistance(fermateNames, userPosition);
      
      // Ricostruisci filteredFermate mantenendo gli indici originali
      // Crea una mappa nome -> indice originale
      const nameToIndexMap = new Map();
      filteredFermate.forEach(({ name, index }) => {
        nameToIndexMap.set(name, index);
      });
      
      // Riordina filteredFermate mantenendo gli indici originali
      filteredFermate = sorted.map(item => {
        const originalIndex = nameToIndexMap.get(item.name);
        return {
          name: item.name,
          index: originalIndex !== undefined ? originalIndex : item.index,
          distance: item.distance
        };
      });
      
      // Ri-renderizza la lista
      renderFermateList();
      
      return true;
    }
    
    return false;
  }

  /**
   * Seleziona una fermata e chiama il callback
   */
  function selectFermata(index) {
    // Rimuovi la classe 'selected' da tutte le fermate
    const allFermateItems = fermateModalList.querySelectorAll('li');
    allFermateItems.forEach(item => item.classList.remove('selected'));

    // Aggiungi la classe 'selected' alla fermata cliccata per feedback visivo
    const clickedItem = fermateModalList.querySelector(`li[data-index="${index}"]`);
    if (clickedItem) {
      clickedItem.classList.add('selected');
    }

    // Chiama il callback dopo un breve delay per feedback visivo
    setTimeout(() => {
      if (onFermataSelected) {
        onFermataSelected(index, currentModalType);
      }
      closeFermateModal();
    }, 150);
  }

  /**
   * Filtra le fermate in base al termine di ricerca
   */
  function filterFermate(searchTerm) {
    if (!getCurrentLineaIdx || !getTariffario) return;

    const lineaIdx = getCurrentLineaIdx();
    const tariffario = getTariffario();

    if (!tariffario || !tariffario[lineaIdx] || !tariffario[lineaIdx].fermate) return;

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

  // ===== FUNZIONI PUBBLICHE =====

  /**
   * Apre il modal delle fermate
   * @param {string} type - Tipo di modal: 'partenza' o 'arrivo'
   */
  function openFermateModal(type) {
    if (!fermateModal) return;

    const lineaIdx = getCurrentLineaIdx ? getCurrentLineaIdx() : '';
    const tariffario = getTariffario ? getTariffario() : null;

    if (lineaIdx === '' || !tariffario || !tariffario[lineaIdx]) {
      console.warn('⚠️ Linea non selezionata o tariffario non disponibile');
      return;
    }

    currentModalType = type;

    if (fermateModalTitle) {
      fermateModalTitle.textContent = type === 'partenza'
        ? 'Seleziona fermata di partenza'
        : 'Seleziona fermata di arrivo';
    }

    // Mostra/nascondi pulsante geolocalizzazione solo per la partenza
    if (fermateLocationBtn) {
      if (type === 'partenza') {
        fermateLocationBtn.style.display = 'flex';
      } else {
        fermateLocationBtn.style.display = 'none';
      }
    }

    // Popola la lista delle fermate
    populateFermateList();

    // NON ordinare automaticamente - l'ordinamento avviene solo quando l'utente clicca sul pulsante "Rileva fermata più vicina"

    // Mostra il modale
    fermateModal.style.display = 'flex';

    // Piccolo delay per permettere al browser di renderizzare il display
    // prima di applicare l'animazione
    setTimeout(() => {
      fermateModal.classList.add('show');
    }, 10);

    // Focus automatico sul campo ricerca (solo su desktop, non mobile)
    // Su mobile evita di aprire la tastiera automaticamente
    if (fermateSearchInput && window.innerWidth > 768) {
      setTimeout(() => {
        fermateSearchInput.focus();
      }, 350); // Delay per permettere l'animazione del modale
    }
  }

  /**
   * Chiude il modal delle fermate
   */
  function closeFermateModal() {
    if (!fermateModal) return;

    // Aggiungi classe per animazione di chiusura
    fermateModal.classList.add('closing');
    fermateModal.classList.remove('show');

    // Attendi fine animazione prima di nascondere completamente
    setTimeout(() => {
      fermateModal.classList.remove('closing');
      fermateModal.style.display = 'none';
    }, 300);

    // Reset ricerca
    if (fermateSearchInput) {
      fermateSearchInput.value = '';
      fermateSearchInput.dispatchEvent(new Event('input'));
    }
  }

  /**
   * Inizializza il modal delle fermate con i callback necessari
   * @param {Object} config - Configurazione con callback
   * @param {Function} config.getCurrentLineaIdx - Callback per ottenere lineaIdx corrente
   * @param {Function} config.getTariffario - Callback per ottenere tariffario
   * @param {Function} config.onFermataSelected - Callback quando viene selezionata una fermata (index, type)
   */
  function initializeFermateModal(config) {
    if (!config) {
      console.warn('⚠️ Configurazione mancante per initializeFermateModal');
      return;
    }

    getCurrentLineaIdx = config.getCurrentLineaIdx || null;
    getTariffario = config.getTariffario || null;
    onFermataSelected = config.onFermataSelected || null;

    // Event listeners per modal fermate
    if (fermateModalClose) {
      fermateModalClose.addEventListener('click', closeFermateModal);
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

    // Chiudi modal con ESC
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && fermateModal && fermateModal.classList.contains('show')) {
        closeFermateModal();
      }
    });

    console.log('✅ Modal Fermate inizializzato');
  }

  // ===== ESPORTAZIONE PUBBLICA FERMATE =====
  // Espone solo le funzioni necessarie per uso esterno

  window.FermateModal = {
    open: openFermateModal,
    close: closeFermateModal,
    initialize: initializeFermateModal,
    sortByDistance: sortFermateByDistance // Funzione per ordinare per distanza
  };

})();

// ===== COMPONENTE: MODAL LINEE =====
// Gestione modale per selezione linee
// Indipendente da script.js - usa callback per comunicare

(function () {
  'use strict';

  // ===== CALLBACK E CONFIGURAZIONE =====
  let getTariffario = null; // Callback per ottenere tariffario
  let onLineaSelected = null; // Callback quando viene selezionata una linea

  // ===== ELEMENTI DOM =====
  const lineeModal = document.getElementById('linee-modal');
  const lineeModalTitle = document.getElementById('linee-modal-title');
  const lineeModalClose = document.getElementById('linee-modal-close');
  const lineeModalList = document.getElementById('linee-modal-list');

  // ===== FUNZIONI PRIVATE =====

  /**
   * Popola la lista delle linee dal tariffario
   */
  function populateLineeList() {
    if (!lineeModalList || !getTariffario) return;

    const tariffario = getTariffario();
    if (!tariffario || !Array.isArray(tariffario)) return;

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

  /**
   * Seleziona una linea e chiama il callback
   */
  function selectLinea(idx, nome) {
    if (onLineaSelected) {
      onLineaSelected(idx, nome);
    }
    closeLineeModal();
  }

  // ===== FUNZIONI PUBBLICHE =====

  /**
   * Apre il modal delle linee
   */
  function openLineeModal() {
    if (!lineeModal) return;

    // Popola la lista delle linee
    populateLineeList();

    // Mostra il modale
    lineeModal.style.display = 'flex';
    setTimeout(() => lineeModal.classList.add('show'), 10);
  }

  /**
   * Chiude il modal delle linee
   */
  function closeLineeModal() {
    if (!lineeModal) return;

    lineeModal.classList.remove('show');
    setTimeout(() => {
      lineeModal.style.display = 'none';
    }, 300);
  }

  /**
   * Inizializza il modal delle linee con i callback necessari
   * @param {Object} config - Configurazione con callback
   * @param {Function} config.getTariffario - Callback per ottenere tariffario
   * @param {Function} config.onLineaSelected - Callback quando viene selezionata una linea (idx, nome)
   */
  function initializeLineeModal(config) {
    if (!config) {
      console.warn('⚠️ Configurazione mancante per initializeLineeModal');
      return;
    }

    getTariffario = config.getTariffario || null;
    onLineaSelected = config.onLineaSelected || null;

    // Event listeners per modal linee
    if (lineeModalClose) {
      lineeModalClose.addEventListener('click', closeLineeModal);
    }

    if (lineeModal) {
      lineeModal.addEventListener('click', (e) => {
        if (e.target === lineeModal) {
          closeLineeModal();
        }
      });
    }

    // Chiudi modal con ESC
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && lineeModal && lineeModal.classList.contains('show')) {
        closeLineeModal();
      }
    });

    console.log('✅ Modal Linee inizializzato');
  }

  // ===== ESPORTAZIONE PUBBLICA LINEE =====
  // Espone solo le funzioni necessarie per uso esterno

  window.LineeModal = {
    open: openLineeModal,
    close: closeLineeModal,
    initialize: initializeLineeModal
  };

})();

// ===== COMPONENTE: MODAL IMPOSTAZIONI =====
// Gestione modale impostazioni
// Indipendente da script.js - usa callback per comunicare

(function () {
  'use strict';

  // ===== CALLBACK E CONFIGURAZIONE =====
  let setThemeMode = null;
  let toggleAnimation = null;
  let setHighContrast = null;
  let setTouchFriendly = null;
  let setHapticFeedback = null;
  let setReduceMotion = null;
  let setKeepScreenOn = null;
  let setExtraSpacing = null;
  let setCompactLayout = null;
  let setBlueLightFilter = null;
  let setInterfaceScale = null;
  let setFontSize = null;
  let triggerHaptic = null;
  let onCloseMobileMenu = null; // Callback per chiudere menu mobile

  // ===== ELEMENTI DOM =====
  // Gli elementi DOM vengono letti all'inizializzazione invece che a livello di modulo
  // per assicurarsi che il DOM sia pronto
  let settingsModal = null;
  let openSettingsBtn = null;
  let desktopSettingsBtn = null;
  let closeSettingsBtn = null;
  let themeSystem = null;
  let themeLight = null;
  let themeDark = null;
  let animationToggle = null;
  let highContrastToggle = null;
  let touchFriendlyToggle = null;
  let hapticFeedbackToggle = null;
  let reduceMotionToggle = null;
  let keepScreenOnToggle = null;
  let extraSpacingToggle = null;
  let compactLayoutToggle = null;
  let blueLightFilterToggle = null;
  let fontButtons = null;
  let tabs = null;
  let tabContents = null;

  // ===== FUNZIONI PRIVATE =====

  /**
   * Sincronizza i toggle del modal con lo stato attuale (localStorage e classi CSS)
   */
  function syncSettingsWithState() {
    // Theme Mode
    const themeMode = localStorage.getItem('tpl.themeMode') || 'light';
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

    // Reduce Motion
    if (reduceMotionToggle) {
      const isReduceMotion = localStorage.getItem('tpl.reduceMotion') === 'true';
      reduceMotionToggle.checked = isReduceMotion;
    }

    // Keep Screen On
    if (keepScreenOnToggle) {
      const isKeepScreenOn = localStorage.getItem('tpl.keepScreenOn') === 'true';
      keepScreenOnToggle.checked = isKeepScreenOn;
    }

    // Extra Spacing
    if (extraSpacingToggle) {
      const isExtraSpacing = localStorage.getItem('tpl.extraSpacing') === 'true';
      extraSpacingToggle.checked = isExtraSpacing;
    }

    // Compact Layout
    if (compactLayoutToggle) {
      const isCompactLayout = localStorage.getItem('tpl.compactLayout') === 'true';
      compactLayoutToggle.checked = isCompactLayout;
    }

    // Blue Light Filter
    if (blueLightFilterToggle) {
      const isBlueLightFilter = localStorage.getItem('tpl.blueLightFilter') === 'true';
      blueLightFilterToggle.checked = isBlueLightFilter;
    }

    // Interface Scale
    const currentScale = localStorage.getItem('tpl.interfaceScale') || '100';
    const scaleRadios = document.querySelectorAll('input[name="interface-scale"]');
    scaleRadios.forEach(radio => {
      radio.checked = (radio.value === currentScale);
    });

    // Font Size
    const currentFontSize = localStorage.getItem('tpl.fontSize') || 'normal';
    if (fontButtons && fontButtons.length > 0) {
      fontButtons.forEach(btn => {
        if (btn.dataset.size === currentFontSize) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
    }
  }

  // ===== FUNZIONI PUBBLICHE =====

  /**
   * Apre il modal impostazioni
   */
  async function openSettingsModal() {
    console.log('🚀 Apertura modal impostazioni...', settingsModal ? 'Modal trovato' : 'Modal NON trovato!');

    // Assicurati che l'HTML del modal sia caricato
    await loadSettingsModalHTML();

    // Aggiorna il riferimento al modal (potrebbe essere cambiato dopo il caricamento)
    settingsModal = document.getElementById('settings-modal');

    if (!settingsModal) {
      console.error('❌ Impossibile aprire modal: settingsModal è null');
      return;
    }

    // Aggiorna la versione nel modal se la funzione è disponibile
    if (typeof updateAppVersion === 'function') {
      updateAppVersion();
    }
    
    // Renderizza il changelog nel modal se la funzione è disponibile
    if (typeof renderChangelog === 'function') {
      renderChangelog('changelog-container');
    }

    settingsModal.style.display = 'flex';
    setTimeout(() => {
      settingsModal.classList.add('show');
      console.log('✅ Modal impostazioni aperto');
    }, 10);

    // Sincronizza valori con stato attuale
    syncSettingsWithState();
  }

  /**
   * Chiude il modal impostazioni
   */
  function closeSettingsModal() {
    settingsModal.classList.remove('show');
    setTimeout(() => {
      settingsModal.style.display = 'none';
    }, 300);
  }

  /**
   * Carica dinamicamente l'HTML del modal impostazioni da un file esterno
   * @returns {Promise<void>}
   */
  async function loadSettingsModalHTML() {
    // Se il modal esiste già nel DOM, non fare nulla
    if (document.getElementById('settings-modal')) {
      console.log('✅ Modal impostazioni già presente nel DOM');
      return;
    }

    try {
      console.log('📥 Caricamento HTML modal impostazioni da components/settings-modal.html...');
      const response = await fetch('components/settings-modal.html');
      
      if (!response.ok) {
        throw new Error(`Errore nel caricamento: ${response.status} ${response.statusText}`);
      }

      const html = await response.text();
      
      // Crea un container temporaneo per inserire l'HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html.trim();
      
      // Inserisci il modal nel body (prima del footer se esiste, altrimenti alla fine)
      const footer = document.querySelector('footer');
      if (footer) {
        footer.insertAdjacentElement('beforebegin', tempDiv.firstElementChild);
      } else {
        document.body.appendChild(tempDiv.firstElementChild);
      }

      console.log('✅ HTML modal impostazioni caricato e inserito nel DOM');
      
      // Aggiorna il riferimento al modal
      settingsModal = document.getElementById('settings-modal');
      
      // Aggiorna la versione nel modal se la funzione è disponibile
      if (typeof updateAppVersion === 'function') {
        updateAppVersion();
      }
      
      // Renderizza il changelog nel modal se la funzione è disponibile
      if (typeof renderChangelog === 'function') {
        renderChangelog('changelog-container');
      }
    } catch (error) {
      console.error('❌ Errore nel caricamento del modal impostazioni:', error);
      // Fallback: crea un modal minimale
      const fallbackModal = document.createElement('div');
      fallbackModal.id = 'settings-modal';
      fallbackModal.className = 'settings-modal';
      fallbackModal.innerHTML = `
        <div class="settings-modal-content">
          <div class="settings-modal-header">
            <h3>⚙️ Impostazioni</h3>
            <button id="settings-modal-close" class="settings-modal-close" aria-label="Chiudi">×</button>
          </div>
          <div class="settings-content">
            <p>Errore nel caricamento delle impostazioni. Ricarica la pagina.</p>
          </div>
        </div>
      `;
      document.body.appendChild(fallbackModal);
      settingsModal = fallbackModal;
    }
  }

  /**
   * Inizializza il modal impostazioni con i callback necessari
   * @param {Object} config - Configurazione con callback
   */
  async function initializeSettingsModal(config) {
    // Assicurati che l'HTML del modal sia caricato
    await loadSettingsModalHTML();
    
    console.log('🔧 Inizializzazione SettingsModal...', config ? 'Config presente' : 'Config mancante');

    if (!config) {
      console.warn('⚠️ Configurazione mancante per initializeSettingsModal');
      return;
    }

    // Leggi elementi DOM (adesso che il DOM è pronto)
    settingsModal = document.getElementById('settings-modal');
    openSettingsBtn = document.getElementById('open-settings');
    desktopSettingsBtn = document.getElementById('desktop-settings-btn');
    closeSettingsBtn = document.getElementById('settings-modal-close');

    console.log('📋 Elementi DOM trovati:', {
      settingsModal: !!settingsModal,
      openSettingsBtn: !!openSettingsBtn,
      desktopSettingsBtn: !!desktopSettingsBtn,
      closeSettingsBtn: !!closeSettingsBtn
    });

    // Toggle controls
    themeSystem = document.getElementById('theme-system');
    themeLight = document.getElementById('theme-light');
    themeDark = document.getElementById('theme-dark');
    animationToggle = document.getElementById('settings-animation');
    highContrastToggle = document.getElementById('settings-high-contrast');
    touchFriendlyToggle = document.getElementById('settings-touch-friendly');
    hapticFeedbackToggle = document.getElementById('settings-haptic-feedback');
    reduceMotionToggle = document.getElementById('settings-reduce-motion');
    keepScreenOnToggle = document.getElementById('settings-keep-screen-on');
    extraSpacingToggle = document.getElementById('settings-extra-spacing');
    compactLayoutToggle = document.getElementById('settings-compact-layout');
    blueLightFilterToggle = document.getElementById('settings-blue-light-filter');

    // Font size buttons
    fontButtons = document.querySelectorAll('.settings-font-btn');

    // Tabs
    tabs = document.querySelectorAll('.settings-tab');
    tabContents = document.querySelectorAll('.settings-tab-content');

    // Verifica che il modal esista
    if (!settingsModal) {
      console.warn('⚠️ Modal impostazioni non trovato nel DOM');
      return;
    }

    // Salva callback
    setThemeMode = config.setThemeMode || null;
    toggleAnimation = config.toggleAnimation || null;
    setHighContrast = config.setHighContrast || null;
    setTouchFriendly = config.setTouchFriendly || null;
    setHapticFeedback = config.setHapticFeedback || null;
    setReduceMotion = config.setReduceMotion || null;
    setKeepScreenOn = config.setKeepScreenOn || null;
    setExtraSpacing = config.setExtraSpacing || null;
    setCompactLayout = config.setCompactLayout || null;
    setBlueLightFilter = config.setBlueLightFilter || null;
    setInterfaceScale = config.setInterfaceScale || null;
    setFontSize = config.setFontSize || null;
    triggerHaptic = config.triggerHaptic || null;
    onCloseMobileMenu = config.onCloseMobileMenu || null;

    // ===== APERTURA/CHIUSURA MODAL =====

    if (openSettingsBtn) {
      console.log('✅ Pulsante open-settings trovato, aggiungo event listener');
      openSettingsBtn.addEventListener('click', () => {
        console.log('🔘 Pulsante Impostazioni cliccato!');
        openSettingsModal();
        // Chiudi menu mobile se aperto
        if (onCloseMobileMenu && typeof onCloseMobileMenu === 'function') {
          onCloseMobileMenu();
        }
      });
    } else {
      console.warn('⚠️ Pulsante open-settings NON trovato!');
    }

    // Desktop settings button
    if (desktopSettingsBtn) {
      desktopSettingsBtn.addEventListener('click', () => {
        openSettingsModal();
      });
    }

    if (closeSettingsBtn) {
      closeSettingsBtn.addEventListener('click', closeSettingsModal);
    }

    // Chiudi cliccando fuori
    if (settingsModal) {
      settingsModal.addEventListener('click', (e) => {
        if (e.target === settingsModal) {
          closeSettingsModal();
        }
      });
    }

    // Chiudi con ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && settingsModal && settingsModal.classList.contains('show')) {
        closeSettingsModal();
      }
    });

    // ===== GESTIONE TAB =====
    // Usa la funzione setupTabsListeners() definita sopra
    setupTabsListeners();

    // ===== GESTIONE TOGGLE =====

    // Theme Mode
    if (themeSystem && setThemeMode) {
      themeSystem.addEventListener('change', () => {
        if (themeSystem.checked) setThemeMode('system');
      });
    }
    if (themeLight && setThemeMode) {
      themeLight.addEventListener('change', () => {
        if (themeLight.checked) setThemeMode('light');
      });
    }
    if (themeDark && setThemeMode) {
      themeDark.addEventListener('change', () => {
        if (themeDark.checked) setThemeMode('dark');
      });
    }

    // Animazione
    if (animationToggle && toggleAnimation) {
      animationToggle.addEventListener('change', () => {
        toggleAnimation();
      });
    }

    // Contrasto Alto
    if (highContrastToggle && setHighContrast) {
      highContrastToggle.addEventListener('change', (e) => {
        setHighContrast(e.target.checked);
      });
    }

    // Touch Friendly
    if (touchFriendlyToggle && setTouchFriendly) {
      touchFriendlyToggle.addEventListener('change', (e) => {
        setTouchFriendly(e.target.checked);
      });
    }

    // Haptic Feedback
    if (hapticFeedbackToggle && setHapticFeedback) {
      hapticFeedbackToggle.addEventListener('change', (e) => {
        setHapticFeedback(e.target.checked);
        // Vibra per confermare l'attivazione (forzato perché localStorage non è ancora aggiornato)
        if (e.target.checked && triggerHaptic) {
          triggerHaptic('success', true); // force = true
        }
      });
    }

    // Reduce Motion
    if (reduceMotionToggle && setReduceMotion) {
      reduceMotionToggle.addEventListener('change', (e) => {
        setReduceMotion(e.target.checked);
        if (triggerHaptic) triggerHaptic('medium');
      });
    }

    // Keep Screen On
    if (keepScreenOnToggle && setKeepScreenOn) {
      keepScreenOnToggle.addEventListener('change', async (e) => {
        await setKeepScreenOn(e.target.checked);
        if (triggerHaptic) triggerHaptic('medium');
      });
    }

    // Extra Spacing
    if (extraSpacingToggle && setExtraSpacing) {
      extraSpacingToggle.addEventListener('change', (e) => {
        setExtraSpacing(e.target.checked);
        if (triggerHaptic) triggerHaptic('medium');
      });
    }

    // Compact Layout
    if (compactLayoutToggle && setCompactLayout) {
      compactLayoutToggle.addEventListener('change', (e) => {
        setCompactLayout(e.target.checked);
        if (triggerHaptic) triggerHaptic('medium');
      });
    }

    // Blue Light Filter
    if (blueLightFilterToggle && setBlueLightFilter) {
      blueLightFilterToggle.addEventListener('change', (e) => {
        setBlueLightFilter(e.target.checked);
        if (triggerHaptic) triggerHaptic('medium');
      });
    }

    // Interface Scale (Dimensione Interfaccia)
    const scaleRadios = document.querySelectorAll('input[name="interface-scale"]');
    if (scaleRadios && scaleRadios.length > 0) {
      scaleRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
          if (e.target.checked && setInterfaceScale) {
            const scale = e.target.value;
            setInterfaceScale(scale);
          }
        });
      });
    }

    // Font Size
    if (fontButtons && fontButtons.length > 0) {
      fontButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          const size = btn.dataset.size;
          if (setFontSize) {
            setFontSize(size);
          }

          // Aggiorna UI
          fontButtons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');

          // Feedback aptico
          if (triggerHaptic) triggerHaptic('light');
        });
      });
    }

    // Pulsante "Verifica Aggiornamenti"
    const updateCheckBtn = document.getElementById('pwa-cache-reset');
    if (updateCheckBtn) {
      updateCheckBtn.addEventListener('click', () => {
        console.log('🔄 Pulsante "Verifica Aggiornamenti" cliccato');
        
        // Chiudi il modal Impostazioni prima
        closeSettingsModal();
        
        // Aspetta un attimo e poi verifica aggiornamenti
        setTimeout(() => {
          if (typeof Updates !== 'undefined' && typeof Updates.checkForUpdates === 'function') {
            console.log('✅ Chiamata a Updates.checkForUpdates()');
            Updates.checkForUpdates();
          } else {
            console.error('❌ Updates.checkForUpdates non è disponibile');
          }
        }, 400);
      });
    }

    // Pulsante "Riavvia Ora"
    const restartAppBtn = document.getElementById('restart-app-btn');
    if (restartAppBtn) {
      restartAppBtn.addEventListener('click', () => {
        console.log('🔄 Pulsante "Riavvia Ora" cliccato');
        
        // Chiudi il modal Impostazioni prima
        closeSettingsModal();
        
        // Riavvia l'app dopo un breve delay
        setTimeout(() => {
          window.location.reload();
        }, 300);
      });
    }

    console.log('✅ Modal Impostazioni inizializzato');
  }

  // ===== ESPORTAZIONE PUBBLICA SETTINGS =====
  window.SettingsModal = {
    open: openSettingsModal,
    close: closeSettingsModal,
    initialize: initializeSettingsModal,
    loadHTML: loadSettingsModalHTML
  };

  console.log('✅ js/components/modals.js caricato - SettingsModal disponibile');

  // ===== FUNZIONE PER GESTIRE LE TAB =====
  // Funzione riutilizzabile per gestire il click sulle tab
  function setupTabsListeners() {
    const tabsEl = document.querySelectorAll('.settings-tab');
    const tabContentsEl = document.querySelectorAll('.settings-tab-content');

    if (tabsEl && tabsEl.length > 0) {
      tabsEl.forEach(tab => {
        // Aggiungi listener solo se non ce l'ha già
        if (!tab.hasAttribute('data-tab-initialized')) {
          tab.setAttribute('data-tab-initialized', 'true');

          tab.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const targetTab = tab.dataset.tab;
            console.log('📑 Click su tab:', targetTab);

            // Rileggi i tab e contenuti (potrebbero essere cambiati)
            const allTabs = document.querySelectorAll('.settings-tab');
            const allTabContents = document.querySelectorAll('.settings-tab-content');

            // Rimuovi active da tutti i tab
            allTabs.forEach(t => t.classList.remove('active'));

            // Rimuovi active da tutti i contenuti
            allTabContents.forEach(tc => {
              tc.classList.remove('active');
              tc.classList.remove('fade-in');
            });

            // Aggiungi active al tab selezionato
            tab.classList.add('active');

            // Trova e mostra il contenuto corrispondente
            const targetContent = document.querySelector(`[data-content="${targetTab}"]`);
            if (targetContent) {
              targetContent.classList.add('active');
              targetContent.classList.add('fade-in');
              console.log('✅ Tab attivata:', targetTab, 'Contenuto trovato:', !!targetContent);
            } else {
              console.warn('⚠️ Contenuto tab non trovato per:', targetTab);
            }
          });
        }
      });
      console.log('✅ Tab listeners configurati per', tabsEl.length, 'tab');
    }
  }

  // ===== INIZIALIZZAZIONE IMMEDIATA DEL DOM =====
  // Inizializza gli event listener quando il DOM è pronto
  // Questo garantisce che funzioni anche se il pulsante viene aggiunto dinamicamente
  function setupDirectEventListener() {
    const btn = document.getElementById('open-settings');
    if (btn && !btn.hasAttribute('data-settings-initialized')) {
      btn.setAttribute('data-settings-initialized', 'true');
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('🔘 Click diretto su open-settings');

        // Chiudi menu mobile se aperto
        const mobileMenu = document.getElementById('mobile-menu');
        const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
        const hamburgerToggle = document.getElementById('hamburger-toggle');
        
        if (mobileMenu && mobileMenu.classList.contains('active')) {
          console.log('📱 Chiusura menu mobile...');
          mobileMenu.classList.remove('active');
          if (mobileMenuOverlay) {
            mobileMenuOverlay.classList.remove('active');
          }
          if (hamburgerToggle) {
            hamburgerToggle.classList.remove('active');
          }
          document.body.style.overflow = '';
        }

        // Carica e apri il modal usando la funzione pubblica
        (async () => {
          try {
            // Carica l'HTML del modal se necessario
            if (typeof SettingsModal !== 'undefined' && SettingsModal.loadHTML) {
              await SettingsModal.loadHTML();
            }

            // Assicurati che il modal sia inizializzato prima di aprirlo
            if (typeof SettingsModal !== 'undefined' && SettingsModal.initialize && typeof window.Settings !== 'undefined') {
              const modal = document.getElementById('settings-modal');
              if (modal && !modal.dataset.initialized) {
                console.log('🔧 Inizializzazione SettingsModal dal listener diretto...');
                await SettingsModal.initialize({
                  setThemeMode: window.Settings.setThemeMode || null,
                  toggleAnimation: window.Settings.toggleAnimation || null,
                  setHighContrast: window.Settings.setHighContrast || null,
                  setTouchFriendly: window.Settings.setTouchFriendly || null,
                  setHapticFeedback: window.Settings.setHapticFeedback || null,
                  setReduceMotion: window.Settings.setReduceMotion || null,
                  setKeepScreenOn: window.Settings.setKeepScreenOn || null,
                  setExtraSpacing: window.Settings.setExtraSpacing || null,
                  setCompactLayout: window.Settings.setCompactLayout || null,
                  setBlueLightFilter: window.Settings.setBlueLightFilter || null,
                  setInterfaceScale: window.Settings.setInterfaceScale || null,
                  setFontSize: window.Settings.setFontSize || null,
                  triggerHaptic: window.Settings.triggerHaptic || null,
                  onCloseMobileMenu: () => {
                    const mobileMenu = document.getElementById('mobile-menu');
                    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
                    const hamburgerToggle = document.getElementById('hamburger-toggle');
                    if (mobileMenu) mobileMenu.classList.remove('active');
                    if (mobileMenuOverlay) mobileMenuOverlay.classList.remove('active');
                    if (hamburgerToggle) hamburgerToggle.classList.remove('active');
                    document.body.style.overflow = '';
                  }
                });
              }
            }

            // Apri il modal usando la funzione pubblica
            if (typeof SettingsModal !== 'undefined' && SettingsModal.open) {
              await SettingsModal.open();
            } else {
              // Fallback: apri manualmente
              const modal = document.getElementById('settings-modal');
              if (modal) {
                modal.style.display = 'flex';
                setTimeout(() => {
                  modal.classList.add('show');
                  console.log('✅ Modal aperto');
                  setupTabsListeners();
                }, 10);
              } else {
                console.error('❌ Modal settings-modal non trovato nel DOM!');
              }
            }
          } catch (error) {
            console.error('❌ Errore nell\'apertura del modal:', error);
          }
        })();
      });
      console.log('✅ Event listener diretto aggiunto a open-settings');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupDirectEventListener);
  } else {
    // DOM già pronto, inizializza subito
    setupDirectEventListener();
  }

})();

