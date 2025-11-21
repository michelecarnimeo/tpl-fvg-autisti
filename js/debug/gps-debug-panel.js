/**
 * ========================================
 * GPS DEBUG PANEL
 * Pannello di debug per visualizzare info GPS su mobile
 * ========================================
 * 
 * Pannello floating, draggable e minimizzabile per vedere:
 * - Posizione GPS acquisita
 * - Precisione
 * - Distanze calcolate
 * - Fermata più vicina
 * 
 * @version 1.0.0
 * @date 2025-11-19
 */

(function() {
  'use strict';

  // ===== STATO =====
  let panel = null;
  let isMinimized = false;
  let isDragging = false;
  let currentX = 0;
  let currentY = 0;
  let initialX = 0;
  let initialY = 0;
  let logs = [];
  let currentSize = 'medium'; // Preset dimensioni: small, medium, large, xlarge, fullwidth

  // ===== INIZIALIZZAZIONE =====
  
  /**
   * Inizializza il pannello debug
   */
  function init() {
    // Crea il pannello se non esiste
    if (!panel) {
      createPanel();
    }
    
    // NON ripristinare lo stato salvato - il pannello deve essere mostrato solo manualmente
    // quando Test Mode è attivo e viene premuto "Rileva"
  }

  /**
   * Crea il pannello HTML
   */
  function createPanel() {
    const panelHTML = `
      <div id="gps-debug-panel" class="gps-debug-panel minimized">
        <div class="gps-debug-header">
          <div class="gps-debug-handle">
            <span class="gps-debug-icon">🐛</span>
            <span class="gps-debug-title">GPS Debug</span>
          </div>
          <div class="gps-debug-actions">
            <div class="gps-debug-size-menu">
              <button class="gps-debug-btn gps-debug-size-btn" title="Cambia dimensione">📐</button>
              <div class="gps-debug-size-dropdown" id="gps-debug-size-dropdown">
                <button class="gps-debug-size-option" data-size="small">📱 Piccolo (240px)</button>
                <button class="gps-debug-size-option" data-size="medium">📱 Medio (320px)</button>
                <button class="gps-debug-size-option" data-size="large">💻 Grande (400px)</button>
                <button class="gps-debug-size-option" data-size="xlarge">🖥️ Extra Large (500px)</button>
                <button class="gps-debug-size-option" data-size="fullwidth">📺 Full Width (90%)</button>
              </div>
            </div>
            <button class="gps-debug-btn gps-debug-toggle" title="Minimizza/Espandi">
              <span class="icon-minimize">▼</span>
              <span class="icon-maximize">▲</span>
            </button>
            <button class="gps-debug-btn gps-debug-close" title="Chiudi">✕</button>
          </div>
        </div>
        <div class="gps-debug-content">
          <div class="gps-debug-logs" id="gps-debug-logs">
            <div class="gps-debug-empty">In attesa di rilevamento GPS...</div>
          </div>
          <div class="gps-debug-footer">
            <button class="gps-debug-btn-clear" id="gps-debug-clear">🗑️ Cancella log</button>
          </div>
        </div>
      </div>
    `;

    // Aggiungi al body
    document.body.insertAdjacentHTML('beforeend', panelHTML);
    
    // Riferimento al pannello
    panel = document.getElementById('gps-debug-panel');
    
    // Setup event listeners
    setupEventListeners();
    
    // Carica dimensione salvata
    loadSize();
    
    // Applica dimensione
    applySize();
    
    // Posiziona il pannello (bottom-right di default)
    positionPanel();
    
    // NASCONDI di default - si mostrerà solo se Test Mode è attivo e viene premuto "Rileva"
    panel.style.display = 'none';
  }

  /**
   * Posiziona il pannello nella posizione di default
   */
  function positionPanel() {
    // Recupera posizione salvata o usa default
    const savedPosition = localStorage.getItem('gps-debug-panel-position');
    
    if (savedPosition) {
      const pos = JSON.parse(savedPosition);
      panel.style.left = pos.x + 'px';
      panel.style.top = pos.y + 'px';
    } else {
      // Default: bottom-right
      panel.style.right = '20px';
      panel.style.bottom = '20px';
      panel.style.left = 'auto';
      panel.style.top = 'auto';
    }
  }

  /**
   * Setup event listeners
   */
  function setupEventListeners() {
    const header = panel.querySelector('.gps-debug-handle');
    const toggleBtn = panel.querySelector('.gps-debug-toggle');
    const closeBtn = panel.querySelector('.gps-debug-close');
    const clearBtn = document.getElementById('gps-debug-clear');
    const sizeBtn = panel.querySelector('.gps-debug-size-btn');
    const sizeDropdown = document.getElementById('gps-debug-size-dropdown');
    const sizeOptions = panel.querySelectorAll('.gps-debug-size-option');

    // Drag & Drop
    header.addEventListener('mousedown', startDrag);
    header.addEventListener('touchstart', startDrag, { passive: false });
    
    // Toggle minimize/maximize
    toggleBtn.addEventListener('click', toggleMinimize);
    
    // Close
    closeBtn.addEventListener('click', close);
    
    // Clear logs
    if (clearBtn) {
      clearBtn.addEventListener('click', clearLogs);
    }
    
    // Size menu toggle
    if (sizeBtn && sizeDropdown) {
      sizeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        sizeDropdown.classList.toggle('show');
      });
      
      // Chiudi dropdown quando si clicca fuori
      document.addEventListener('click', (e) => {
        if (!sizeDropdown.contains(e.target) && e.target !== sizeBtn) {
          sizeDropdown.classList.remove('show');
        }
      });
      
      // Seleziona dimensione
      sizeOptions.forEach(option => {
        option.addEventListener('click', (e) => {
          e.stopPropagation();
          const size = option.dataset.size;
          setSize(size);
          sizeDropdown.classList.remove('show');
        });
      });
    }
  }

  /**
   * Inizia il drag
   */
  function startDrag(e) {
    e.preventDefault();
    
    isDragging = true;
    panel.classList.add('dragging');

    // Ottieni posizione iniziale
    if (e.type === 'touchstart') {
      initialX = e.touches[0].clientX - currentX;
      initialY = e.touches[0].clientY - currentY;
    } else {
      initialX = e.clientX - currentX;
      initialY = e.clientY - currentY;
    }

    // Event listeners per drag
    document.addEventListener('mousemove', drag);
    document.addEventListener('touchmove', drag, { passive: false });
    document.addEventListener('mouseup', stopDrag);
    document.addEventListener('touchend', stopDrag);
  }

  /**
   * Durante il drag
   */
  function drag(e) {
    if (!isDragging) return;
    
    e.preventDefault();

    let clientX, clientY;
    
    if (e.type === 'touchmove') {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    currentX = clientX - initialX;
    currentY = clientY - initialY;

    // Limiti della viewport
    const maxX = window.innerWidth - panel.offsetWidth;
    const maxY = window.innerHeight - panel.offsetHeight;
    
    currentX = Math.max(0, Math.min(currentX, maxX));
    currentY = Math.max(0, Math.min(currentY, maxY));

    // Applica posizione
    panel.style.left = currentX + 'px';
    panel.style.top = currentY + 'px';
    panel.style.right = 'auto';
    panel.style.bottom = 'auto';
  }

  /**
   * Fine del drag
   */
  function stopDrag() {
    if (!isDragging) return;
    
    isDragging = false;
    panel.classList.remove('dragging');
    
    // Rimuovi event listeners
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('touchmove', drag);
    document.removeEventListener('mouseup', stopDrag);
    document.removeEventListener('touchend', stopDrag);
    
    // Salva posizione
    savePosition();
  }

  /**
   * Salva la posizione del pannello
   */
  function savePosition() {
    const position = {
      x: currentX,
      y: currentY
    };
    localStorage.setItem('gps-debug-panel-position', JSON.stringify(position));
  }

  /**
   * Carica la dimensione salvata
   */
  function loadSize() {
    try {
      const saved = localStorage.getItem('gps-debug-panel-size');
      if (saved && ['small', 'medium', 'large', 'xlarge', 'fullwidth'].includes(saved)) {
        currentSize = saved;
      }
    } catch (e) {
      console.warn('⚠️ Impossibile caricare dimensione pannello:', e);
    }
  }

  /**
   * Salva la dimensione
   */
  function saveSize() {
    try {
      localStorage.setItem('gps-debug-panel-size', currentSize);
    } catch (e) {
      console.warn('⚠️ Impossibile salvare dimensione pannello:', e);
    }
  }

  /**
   * Imposta la dimensione del pannello
   */
  function setSize(size) {
    if (!['small', 'medium', 'large', 'xlarge', 'fullwidth'].includes(size)) {
      console.warn('⚠️ Dimensione non valida:', size);
      return;
    }
    
    currentSize = size;
    applySize();
    saveSize();
    
    // Aggiorna selezione nel dropdown
    const options = panel.querySelectorAll('.gps-debug-size-option');
    options.forEach(opt => {
      if (opt.dataset.size === size) {
        opt.classList.add('active');
      } else {
        opt.classList.remove('active');
      }
    });
    
    console.log(`📐 GPS Debug Panel: dimensione impostata a ${size}`);
  }

  /**
   * Applica la dimensione al pannello
   */
  function applySize() {
    if (!panel) return;
    
    // Rimuovi tutte le classi di dimensione
    panel.classList.remove('size-small', 'size-medium', 'size-large', 'size-xlarge', 'size-fullwidth');
    
    // Aggiungi classe corrispondente
    panel.classList.add(`size-${currentSize}`);
    
    // Imposta larghezza CSS
    const sizes = {
      small: '240px',
      medium: '320px',
      large: '400px',
      xlarge: '500px',
      fullwidth: '90vw'
    };
    
    panel.style.width = sizes[currentSize] || sizes.medium;
    
    // Aggiorna selezione nel dropdown
    const options = panel.querySelectorAll('.gps-debug-size-option');
    options.forEach(opt => {
      if (opt.dataset.size === currentSize) {
        opt.classList.add('active');
      } else {
        opt.classList.remove('active');
      }
    });
  }

  /**
   * Toggle minimize/maximize
   */
  function toggleMinimize() {
    isMinimized = !isMinimized;
    
    if (isMinimized) {
      panel.classList.add('minimized');
    } else {
      panel.classList.remove('minimized');
    }
    
    // Salva stato
    localStorage.setItem('gps-debug-panel-minimized', isMinimized);
  }

  /**
   * Chiude il pannello
   */
  function close() {
    if (panel) {
      panel.style.display = 'none';
      localStorage.setItem('gps-debug-panel-visible', 'false');
    }
  }

  /**
   * Mostra il pannello (solo se Test Mode è attivo)
   */
  function show() {
    // Verifica che Test Mode sia attivo
    if (typeof window.TestMode === 'undefined' || !window.TestMode.isEnabled()) {
      console.log('ℹ️ GPS Debug Panel: Test Mode non attivo, pannello non mostrato');
      return;
    }
    
    if (!panel) {
      init();
    }
    panel.style.display = 'block';
    localStorage.setItem('gps-debug-panel-visible', 'true');
  }

  /**
   * Cancella i log
   */
  function clearLogs() {
    logs = [];
    const logsContainer = document.getElementById('gps-debug-logs');
    if (logsContainer) {
      logsContainer.innerHTML = '<div class="gps-debug-empty">Log cancellati. In attesa di rilevamento GPS...</div>';
    }
  }

  /**
   * Aggiunge un log al pannello
   */
  function addLog(type, title, data) {
    const timestamp = new Date().toLocaleTimeString('it-IT');
    
    const log = {
      type,
      title,
      data,
      timestamp
    };
    
    logs.push(log);
    
    // Limita a ultimi 10 log
    if (logs.length > 10) {
      logs.shift();
    }
    
    renderLogs();
  }

  /**
   * Renderizza i log
   */
  function renderLogs() {
    const logsContainer = document.getElementById('gps-debug-logs');
    if (!logsContainer) return;
    
    if (logs.length === 0) {
      logsContainer.innerHTML = '<div class="gps-debug-empty">Nessun log disponibile</div>';
      return;
    }
    
    logsContainer.innerHTML = logs.map(log => {
      const dataHTML = Object.entries(log.data)
        .map(([key, value]) => `
          <div class="gps-debug-data-row">
            <span class="gps-debug-data-key">${key}:</span>
            <span class="gps-debug-data-value">${value}</span>
          </div>
        `)
        .join('');
      
      return `
        <div class="gps-debug-log gps-debug-log-${log.type}">
          <div class="gps-debug-log-header">
            <span class="gps-debug-log-icon">${getIconForType(log.type)}</span>
            <span class="gps-debug-log-title">${log.title}</span>
            <span class="gps-debug-log-time">${log.timestamp}</span>
          </div>
          <div class="gps-debug-log-data">
            ${dataHTML}
          </div>
        </div>
      `;
    }).join('');
  }

  /**
   * Ottieni icona per tipo di log
   */
  function getIconForType(type) {
    const icons = {
      position: '📍',
      distance: '📏',
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    };
    return icons[type] || 'ℹ️';
  }

  // ===== API PUBBLICA =====
  
  window.GPSDebugPanel = {
    init,
    show,
    close,
    addLog,
    clearLogs,
    setSize
  };

  // Auto-inizializza quando il DOM è pronto (ma rimane nascosto)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  console.log('✅ GPS Debug Panel caricato (nascosto di default, si mostra solo in Test Mode)');

})();

