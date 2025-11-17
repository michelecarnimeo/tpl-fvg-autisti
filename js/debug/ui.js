/**
 * 🐛 DEBUG LOGGER - UI
 * 
 * Interfaccia utente overlay per il debug logger
 * Rendering logs, controlli, drag & drop
 * 
 * @version 1.0.0
 * @date 17 Novembre 2025
 */

(function() {
  'use strict';

  // ========================================
  // STATO UI
  // ========================================
  
  let overlay = null;
  let logContainer = null;
  let isMinimized = false;
  let isDragging = false;

  // ========================================
  // CREAZIONE OVERLAY
  // ========================================
  
  function createOverlay() {
    if (overlay) return overlay;

    overlay = document.createElement('div');
    overlay.id = 'debug-logger-overlay';
    overlay.innerHTML = `
      <div class="debug-header" id="debug-header">
        <span class="debug-title">🐛 DEBUG</span>
        <div class="debug-controls">
          <button id="debug-clear" title="Clear logs">🗑️</button>
          <button id="debug-export" title="Export logs">📁</button>
          <button id="debug-minimize" title="Minimize/Maximize">➖</button>
          <button id="debug-close" title="Close">❌</button>
        </div>
      </div>
      <div class="debug-filters" id="debug-filters"></div>
      <div class="debug-logs" id="debug-logs"></div>
      <div class="debug-stats" id="debug-stats">
        <span id="debug-count">0 logs</span>
        <span id="debug-uptime">0s</span>
      </div>
    `;

    injectCSS();
    document.body.appendChild(overlay);
    
    logContainer = document.getElementById('debug-logs');
    
    setupEventListeners();
    createFilters();
    
    return overlay;
  }

  function removeOverlay() {
    if (overlay) {
      overlay.remove();
      overlay = null;
      logContainer = null;
    }
  }

  // ========================================
  // CSS INJECTION
  // ========================================
  
  function injectCSS() {
    if (document.getElementById('debug-logger-styles')) return;

    const style = document.createElement('style');
    style.id = 'debug-logger-styles';
    style.textContent = `
      #debug-logger-overlay {
        position: fixed;
        top: 20px;
        right: 20px;
        width: 350px;
        max-height: 500px;
        background: rgba(0, 0, 0, 0.95);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 12px;
        color: white;
        font-family: 'Courier New', monospace;
        font-size: 11px;
        z-index: 999999;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        transition: all 0.3s ease;
        resize: both;
        overflow: hidden;
      }
      
      #debug-logger-overlay.minimized {
        height: 40px !important;
        max-height: 40px;
      }
      
      .debug-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 12px;
        background: rgba(255, 255, 255, 0.1);
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        cursor: move;
        user-select: none;
      }
      
      .debug-title {
        font-weight: bold;
        font-size: 12px;
      }
      
      .debug-controls {
        display: flex;
        gap: 4px;
      }
      
      .debug-controls button {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 2px 4px;
        border-radius: 3px;
        font-size: 10px;
        transition: background 0.2s;
      }
      
      .debug-controls button:hover {
        background: rgba(255, 255, 255, 0.2);
      }
      
      .debug-filters {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
        padding: 8px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }
      
      .debug-filter {
        padding: 2px 6px;
        border: 1px solid rgba(255, 255, 255, 0.3);
        border-radius: 12px;
        cursor: pointer;
        font-size: 9px;
        transition: all 0.2s;
        user-select: none;
      }
      
      .debug-filter.active {
        background: rgba(255, 255, 255, 0.2);
        border-color: rgba(255, 255, 255, 0.5);
      }
      
      .debug-logs {
        max-height: 300px;
        overflow-y: auto;
        padding: 4px;
        scrollbar-width: thin;
        scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
      }
      
      .debug-logs::-webkit-scrollbar {
        width: 4px;
      }
      
      .debug-logs::-webkit-scrollbar-track {
        background: transparent;
      }
      
      .debug-logs::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.3);
        border-radius: 2px;
      }
      
      .debug-log-entry {
        margin: 2px 0;
        padding: 3px 6px;
        border-left: 2px solid;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 3px;
        line-height: 1.3;
      }
      
      .debug-log-time {
        color: #9CA3AF;
        font-size: 9px;
      }
      
      .debug-log-category {
        font-weight: bold;
        margin: 0 4px;
      }
      
      .debug-log-message {
        color: #E5E7EB;
      }
      
      .debug-stats {
        display: flex;
        justify-content: space-between;
        padding: 4px 8px;
        background: rgba(255, 255, 255, 0.05);
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        font-size: 9px;
        color: #9CA3AF;
      }
      
      .debug-minimized .debug-filters,
      .debug-minimized .debug-logs,
      .debug-minimized .debug-stats {
        display: none;
      }
    `;

    document.head.appendChild(style);
  }

  // ========================================
  // EVENT LISTENERS
  // ========================================
  
  function setupEventListeners() {
    const header = document.getElementById('debug-header');
    const clearBtn = document.getElementById('debug-clear');
    const exportBtn = document.getElementById('debug-export');
    const minimizeBtn = document.getElementById('debug-minimize');
    const closeBtn = document.getElementById('debug-close');

    // Drag & drop
    setupDragAndDrop(header);

    // Controlli
    clearBtn.addEventListener('click', () => {
      if (window.DebugCore) {
        window.DebugCore.clearLogs();
      }
    });

    exportBtn.addEventListener('click', () => {
      if (window.DebugExport) {
        window.DebugExport.exportLogs();
      }
    });

    minimizeBtn.addEventListener('click', toggleMinimize);

    closeBtn.addEventListener('click', () => {
      if (window.DebugCore) {
        window.DebugCore.disable();
      }
    });
  }

  function setupDragAndDrop(header) {
    let startX, startY, startLeft, startTop;

    header.addEventListener('mousedown', (e) => {
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      const rect = overlay.getBoundingClientRect();
      startLeft = rect.left;
      startTop = rect.top;
      document.addEventListener('mousemove', onDrag);
      document.addEventListener('mouseup', stopDrag);
    });

    function onDrag(e) {
      if (!isDragging) return;
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      overlay.style.left = (startLeft + deltaX) + 'px';
      overlay.style.top = (startTop + deltaY) + 'px';
      overlay.style.right = 'auto';
    }

    function stopDrag() {
      isDragging = false;
      document.removeEventListener('mousemove', onDrag);
      document.removeEventListener('mouseup', stopDrag);
    }
  }

  // ========================================
  // FILTRI UI
  // ========================================
  
  function createFilters() {
    const filtersContainer = document.getElementById('debug-filters');
    if (!filtersContainer || !window.DebugCategories) return;

    filtersContainer.innerHTML = '';
    
    const categories = window.DebugCategories.getAll();
    Object.keys(categories).forEach(category => {
      const config = categories[category];
      const filter = document.createElement('span');
      filter.className = `debug-filter ${config.enabled ? 'active' : ''}`;
      filter.style.borderColor = config.color;
      filter.textContent = `${config.icon} ${category}`;
      filter.addEventListener('click', () => {
        if (window.DebugCategories) {
          window.DebugCategories.toggle(category);
          createFilters(); // Ricarica filtri
          renderLogs(); // Ricarica logs
        }
      });
      filtersContainer.appendChild(filter);
    });
  }

  // ========================================
  // RENDERING LOGS
  // ========================================
  
  function renderLogs() {
    if (!logContainer || !window.DebugCore || !window.DebugCategories) return;

    const allLogs = window.DebugCore.getLogs();
    const filteredLogs = window.DebugCategories.filter(allLogs);

    logContainer.innerHTML = filteredLogs.slice(-100).map(log => {
      const color = window.DebugCategories.getColor(log.category);
      const icon = window.DebugCategories.getIcon(log.category);
      
      return `
        <div class="debug-log-entry" style="border-left-color: ${color}">
          <span class="debug-log-time">${log.time}</span>
          <span class="debug-log-category" style="color: ${color}">
            ${icon} ${log.category}
          </span>
          <span class="debug-log-message">${log.message}</span>
        </div>
      `;
    }).join('');

    // Auto-scroll to bottom
    logContainer.scrollTop = logContainer.scrollHeight;
  }

  function updateStats() {
    const countEl = document.getElementById('debug-count');
    const uptimeEl = document.getElementById('debug-uptime');
    
    if (!window.DebugCore) return;
    
    const stats = window.DebugCore.getStats();
    
    if (countEl) countEl.textContent = `${stats.count} logs`;
    if (uptimeEl) uptimeEl.textContent = window.DebugCore.formatElapsed(stats.uptime);
  }

  // ========================================
  // CONTROLLI UI
  // ========================================
  
  function toggleMinimize() {
    isMinimized = !isMinimized;
    overlay.classList.toggle('minimized', isMinimized);
    const btn = document.getElementById('debug-minimize');
    if (btn) btn.textContent = isMinimized ? '➕' : '➖';
  }

  function show() {
    if (!overlay) {
      createOverlay();
    }
    renderLogs();
    updateStats();
  }

  function hide() {
    removeOverlay();
  }

  // ========================================
  // INTEGRAZIONE CORE
  // ========================================
  
  // Subscribe ai eventi del core
  if (window.DebugCore) {
    window.DebugCore.subscribe((event, data) => {
      switch (event) {
        case 'enabled':
          show();
          break;
        case 'disabled':
          hide();
          break;
        case 'log-added':
          if (overlay) {
            renderLogs();
            updateStats();
          }
          break;
        case 'logs-cleared':
          if (overlay) {
            renderLogs();
            updateStats();
          }
          break;
      }
    });
  }

  // Update stats ogni secondo
  setInterval(() => {
    if (overlay && window.DebugCore && window.DebugCore.isEnabled()) {
      updateStats();
    }
  }, 1000);

  // ========================================
  // API PUBBLICA
  // ========================================
  
  const DebugUI = {
    show,
    hide,
    renderLogs,
    updateStats,
    toggleMinimize,
    isVisible: () => !!overlay
  };

  // Esporta globalmente
  window.DebugUI = DebugUI;

  console.log('🐛 DebugUI caricato');

})();
