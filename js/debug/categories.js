/**
 * 🐛 DEBUG LOGGER - CATEGORIES
 * 
 * Gestione categorie di logging e filtri
 * 
 * @version 1.0.0
 * @date 17 Novembre 2025
 */

(function() {
  'use strict';

  // ========================================
  // CONFIGURAZIONE CATEGORIE
  // ========================================
  
  const CATEGORIES = {
    GPS: { 
      color: '#10B981', 
      icon: '📍', 
      enabled: true,
      description: 'Geolocalizzazione e coordinate'
    },
    PERFORMANCE: { 
      color: '#F59E0B', 
      icon: '⚡', 
      enabled: true,
      description: 'Tempi di caricamento e performance'
    },
    ERROR: { 
      color: '#EF4444', 
      icon: '❌', 
      enabled: true,
      description: 'Errori JavaScript e eccezioni'
    },
    MODULE: { 
      color: '#8B5CF6', 
      icon: '🧩', 
      enabled: true,
      description: 'Caricamento e stato moduli'
    },
    STORAGE: { 
      color: '#06B6D4', 
      icon: '💾', 
      enabled: true,
      description: 'LocalStorage, cache e persistenza'
    },
    NETWORK: { 
      color: '#EC4899', 
      icon: '🌐', 
      enabled: true,
      description: 'Richieste HTTP e connettività'
    },
    UI: { 
      color: '#84CC16', 
      icon: '🎨', 
      enabled: true,
      description: 'Interazioni utente e aggiornamenti UI'
    },
    DEBUG: { 
      color: '#6B7280', 
      icon: '🔧', 
      enabled: true,
      description: 'Debug generale e sviluppo'
    }
  };

  // ========================================
  // GESTIONE FILTRI
  // ========================================
  
  let filterState = { ...CATEGORIES };

  function getCategory(name) {
    const key = name.toUpperCase();
    return filterState[key] || CATEGORIES.DEBUG;
  }

  function getAllCategories() {
    return { ...filterState };
  }

  function toggleCategory(name) {
    const key = name.toUpperCase();
    if (filterState[key]) {
      filterState[key].enabled = !filterState[key].enabled;
      saveFilterState();
      return filterState[key].enabled;
    }
    return false;
  }

  function setCategoryEnabled(name, enabled) {
    const key = name.toUpperCase();
    if (filterState[key]) {
      filterState[key].enabled = Boolean(enabled);
      saveFilterState();
      return true;
    }
    return false;
  }

  function getEnabledCategories() {
    return Object.keys(filterState).filter(key => 
      filterState[key].enabled
    );
  }

  function filterLogs(logs) {
    return logs.filter(log => {
      const category = filterState[log.category];
      return category && category.enabled;
    });
  }

  // ========================================
  // PERSISTENZA FILTRI
  // ========================================
  
  const FILTER_STORAGE_KEY = 'tpl-debug-filters';

  function saveFilterState() {
    try {
      const state = {};
      Object.keys(filterState).forEach(key => {
        state[key] = filterState[key].enabled;
      });
      localStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('🐛 DebugCategories: Errore salvataggio filtri:', e);
    }
  }

  function loadFilterState() {
    try {
      const saved = localStorage.getItem(FILTER_STORAGE_KEY);
      if (saved) {
        const state = JSON.parse(saved);
        Object.keys(state).forEach(key => {
          if (filterState[key]) {
            filterState[key].enabled = Boolean(state[key]);
          }
        });
      }
    } catch (e) {
      console.warn('🐛 DebugCategories: Errore caricamento filtri:', e);
    }
  }

  // ========================================
  // SHORTCUTS LOGGING
  // ========================================
  
  function createLogShortcuts() {
    const shortcuts = {};
    
    Object.keys(CATEGORIES).forEach(category => {
      const key = category.toLowerCase();
      shortcuts[key] = (message, data) => {
        if (window.DebugCore && window.DebugCore.log) {
          return window.DebugCore.log(category, message, data);
        }
      };
    });

    return shortcuts;
  }

  // ========================================
  // API PUBBLICA
  // ========================================
  
  const DebugCategories = {
    // Gestione categorie
    get: getCategory,
    getAll: getAllCategories,
    getEnabled: getEnabledCategories,
    
    // Filtri
    toggle: toggleCategory,
    setEnabled: setCategoryEnabled,
    filter: filterLogs,
    
    // Shortcuts
    shortcuts: createLogShortcuts(),
    
    // Utilità
    isEnabled: (name) => {
      const category = getCategory(name);
      return category.enabled;
    },
    
    getColor: (name) => {
      const category = getCategory(name);
      return category.color;
    },
    
    getIcon: (name) => {
      const category = getCategory(name);
      return category.icon;
    }
  };

  // ========================================
  // INIZIALIZZAZIONE
  // ========================================
  
  // Carica stato filtri
  loadFilterState();

  // Esporta globalmente
  window.DebugCategories = DebugCategories;

  console.log('🐛 DebugCategories caricato');

})();
