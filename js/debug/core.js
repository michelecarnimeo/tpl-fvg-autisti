/**
 * 🐛 DEBUG LOGGER - CORE
 * 
 * Modulo core del sistema di debug logging
 * Gestisce stato, storage, configurazione base
 * 
 * @version 1.0.0
 * @date 17 Novembre 2025
 */

(function() {
  'use strict';

  // ========================================
  // CONFIGURAZIONE
  // ========================================
  
  const CONFIG = {
    maxLogs: 500,
    storageKey: 'tpl-debug-logs',
    enabledKey: 'tpl-debug-enabled',
    startTime: Date.now(),
    version: '1.0.0'
  };

  // ========================================
  // STATO INTERNO
  // ========================================
  
  let isEnabled = false;
  let logs = [];
  let subscribers = []; // Per notificare altri moduli

  // ========================================
  // UTILITÀ TEMPO
  // ========================================
  
  function getTimestamp() {
    const now = new Date();
    const elapsed = Date.now() - CONFIG.startTime;
    return {
      time: now.toLocaleTimeString('it-IT', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit',
        fractionalSecondDigits: 3
      }),
      elapsed: elapsed,
      iso: now.toISOString()
    };
  }

  function formatElapsed(ms) {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms/1000).toFixed(1)}s`;
    return `${Math.floor(ms/60000)}m ${Math.floor((ms%60000)/1000)}s`;
  }

  // ========================================
  // STORAGE
  // ========================================
  
  function saveToStorage() {
    try {
      localStorage.setItem(CONFIG.storageKey, JSON.stringify(logs.slice(-CONFIG.maxLogs)));
      localStorage.setItem(CONFIG.enabledKey, isEnabled.toString());
      return true;
    } catch (e) {
      console.warn('🐛 DebugCore: Errore salvataggio storage:', e);
      return false;
    }
  }

  function loadFromStorage() {
    try {
      const savedLogs = localStorage.getItem(CONFIG.storageKey);
      if (savedLogs) {
        logs = JSON.parse(savedLogs);
      }
      
      const savedEnabled = localStorage.getItem(CONFIG.enabledKey);
      if (savedEnabled === 'true') {
        enable();
      }
      return true;
    } catch (e) {
      console.warn('🐛 DebugCore: Errore caricamento storage:', e);
      return false;
    }
  }

  // ========================================
  // SISTEMA EVENTI
  // ========================================
  
  function subscribe(callback) {
    if (typeof callback === 'function') {
      subscribers.push(callback);
    }
  }

  function unsubscribe(callback) {
    const index = subscribers.indexOf(callback);
    if (index > -1) {
      subscribers.splice(index, 1);
    }
  }

  function notify(event, data) {
    subscribers.forEach(callback => {
      try {
        callback(event, data);
      } catch (e) {
        console.warn('🐛 DebugCore: Errore notifica subscriber:', e);
      }
    });
  }

  // ========================================
  // LOGGING CORE
  // ========================================
  
  function addLog(category, message, data = null) {
    if (!isEnabled) return null;

    const timestamp = getTimestamp();
    const logEntry = {
      id: Date.now() + Math.random(),
      category: category.toUpperCase(),
      message: message,
      data: data,
      time: timestamp.time,
      elapsed: timestamp.elapsed,
      iso: timestamp.iso,
      timestamp: Date.now()
    };

    logs.push(logEntry);
    
    // Mantieni solo gli ultimi N logs
    if (logs.length > CONFIG.maxLogs) {
      logs = logs.slice(-CONFIG.maxLogs);
    }

    // Notifica subscribers (UI, export, etc.)
    notify('log-added', logEntry);

    saveToStorage();

    // Log anche in console per debug
    console.log(`🐛 [${category}] ${message}`, data || '');

    return logEntry;
  }

  // ========================================
  // CONTROLLO STATO
  // ========================================
  
  function enable() {
    if (isEnabled) return false;
    
    isEnabled = true;
    
    const logEntry = addLog('DEBUG', 'Debug Logger attivato', { 
      version: CONFIG.version,
      startTime: new Date(CONFIG.startTime).toISOString(),
      userAgent: navigator.userAgent.substring(0, 100)
    });

    notify('enabled', { timestamp: Date.now() });
    saveToStorage();
    
    return true;
  }

  function disable() {
    if (!isEnabled) return false;
    
    addLog('DEBUG', 'Debug Logger disattivato');
    
    isEnabled = false;
    notify('disabled', { timestamp: Date.now() });
    saveToStorage();
    
    return true;
  }

  function clearLogs() {
    const count = logs.length;
    logs = [];
    notify('logs-cleared', { count });
    saveToStorage();
    
    if (isEnabled) {
      addLog('DEBUG', `Logs cleared (${count} entries)`);
    }
    
    return count;
  }

  // ========================================
  // API PUBBLICA
  // ========================================
  
  const DebugCore = {
    // Stato
    isEnabled: () => isEnabled,
    getConfig: () => ({ ...CONFIG }),
    
    // Controllo
    enable,
    disable,
    
    // Logging
    log: addLog,
    
    // Gestione logs
    getLogs: () => [...logs],
    clearLogs,
    
    // Statistiche
    getStats: () => ({
      count: logs.length,
      uptime: Date.now() - CONFIG.startTime,
      enabled: isEnabled,
      version: CONFIG.version
    }),
    
    // Eventi
    subscribe,
    unsubscribe,
    
    // Utilità
    formatElapsed,
    getTimestamp
  };

  // ========================================
  // INIZIALIZZAZIONE
  // ========================================
  
  // Carica stato da storage
  loadFromStorage();

  // Esporta globalmente
  window.DebugCore = DebugCore;

  console.log('🐛 DebugCore caricato');

})();
