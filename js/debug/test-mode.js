/**
 * ========================================
 * TEST MODE MANAGER
 * Gestione modalità test/debug globale
 * ========================================
 * 
 * Sistema centralizzato per attivare/disattivare funzionalità di debug
 * su tutte le pagine dell'applicazione.
 * 
 * Funzionalità:
 * - Toggle modalità test da qualsiasi pagina
 * - Persistenza stato in localStorage
 * - Mostra/nasconde elementi debug in tutte le pagine
 * - Pannello GPS debug
 * - Log dettagliati in console
 * - Badge visivo quando attivo
 * 
 * @version 1.0.0
 * @date 2025-11-19
 */

(function() {
  'use strict';

  // ===== COSTANTI =====
  const STORAGE_KEY = 'tpl.testMode';
  const BADGE_ID = 'test-mode-badge';
  
  // ===== STATO =====
  let isTestMode = false;

  // ===== INIZIALIZZAZIONE =====
  
  /**
   * Inizializza il Test Mode
   */
  function init() {
    // Carica stato salvato
    loadState();
    
    // Crea badge se test mode è attivo
    if (isTestMode) {
      createBadge();
      enableTestFeatures();
    }
    
    // Esponi API globale
    exposeAPI();
    
    console.log(`✅ Test Mode: ${isTestMode ? '🟢 ATTIVO' : '⚪ Non attivo'}`);
  }

  /**
   * Carica lo stato dal localStorage
   */
  function loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      isTestMode = saved === 'true';
    } catch (e) {
      console.warn('⚠️ Impossibile caricare stato Test Mode:', e);
      isTestMode = false;
    }
  }

  /**
   * Salva lo stato nel localStorage
   */
  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, isTestMode.toString());
    } catch (e) {
      console.warn('⚠️ Impossibile salvare stato Test Mode:', e);
    }
  }

  /**
   * Crea il badge visivo
   */
  function createBadge() {
    // Rimuovi badge esistente se presente
    const existing = document.getElementById(BADGE_ID);
    if (existing) {
      existing.remove();
    }

    const badge = document.createElement('div');
    badge.id = BADGE_ID;
    badge.className = 'test-mode-badge';
    badge.innerHTML = `
      <div class="test-mode-badge-content">
        <span class="test-mode-badge-icon">🧪</span>
        <span class="test-mode-badge-text">TEST MODE</span>
        <button class="test-mode-badge-close" title="Disattiva Test Mode">✕</button>
      </div>
    `;
    
    document.body.appendChild(badge);
    
    // Event listener per chiudere
    const closeBtn = badge.querySelector('.test-mode-badge-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        disable();
      });
    }
    
    // Click sul badge per info
    badge.addEventListener('click', showInfo);
  }

  /**
   * Rimuove il badge
   */
  function removeBadge() {
    const badge = document.getElementById(BADGE_ID);
    if (badge) {
      badge.remove();
    }
  }

  /**
   * Mostra info sulla modalità test
   */
  function showInfo() {
    console.group('🧪 MODALITÀ TEST ATTIVA');
    console.log('📍 GPS Debug Panel: Disponibile quando premi "Rileva"');
    console.log('🔍 Log dettagliati: Attivi in console');
    console.log('🎯 Elementi debug: Visibili dove disponibili');
    console.log('💡 Per disattivare: Click su ✕ nel badge o chiama TestMode.disable()');
    console.groupEnd();
  }

  /**
   * Abilita le funzionalità di test
   */
  function enableTestFeatures() {
    // Mostra elementi nascosti con classe .debug-only
    showDebugElements();
    
    // Abilita log dettagliati
    enableDetailedLogs();
    
    // Dispatch evento personalizzato per altre componenti
    dispatchTestModeEvent(true);
  }

  /**
   * Disabilita le funzionalità di test
   */
  function disableTestFeatures() {
    // Nascondi elementi debug
    hideDebugElements();
    
    // Disabilita log dettagliati
    disableDetailedLogs();
    
    // Chiudi GPS Debug Panel se aperto
    if (window.GPSDebugPanel) {
      window.GPSDebugPanel.close();
    }
    
    // Dispatch evento
    dispatchTestModeEvent(false);
  }

  /**
   * Mostra elementi debug
   */
  function showDebugElements() {
    const elements = document.querySelectorAll('.debug-only, [data-debug-only]');
    elements.forEach(el => {
      el.style.display = '';
      el.classList.add('debug-visible');
    });
  }

  /**
   * Nascondi elementi debug
   */
  function hideDebugElements() {
    const elements = document.querySelectorAll('.debug-only, [data-debug-only]');
    elements.forEach(el => {
      el.style.display = 'none';
      el.classList.remove('debug-visible');
    });
  }

  /**
   * Abilita log dettagliati
   */
  function enableDetailedLogs() {
    window.DEBUG_LOGS_ENABLED = true;
  }

  /**
   * Disabilita log dettagliati
   */
  function disableDetailedLogs() {
    window.DEBUG_LOGS_ENABLED = false;
  }

  /**
   * Dispatch evento custom per notificare cambio stato
   */
  function dispatchTestModeEvent(enabled) {
    const event = new CustomEvent('testModeChanged', {
      detail: { enabled }
    });
    window.dispatchEvent(event);
  }

  // ===== API PUBBLICA =====

  /**
   * Abilita la modalità test
   */
  function enable() {
    if (isTestMode) {
      console.log('ℹ️ Test Mode già attivo');
      return;
    }
    
    isTestMode = true;
    saveState();
    createBadge();
    enableTestFeatures();
    
    console.log('✅ Test Mode ATTIVATO');
    showNotification('🧪 Modalità Test attivata', 'success');
    
    return true;
  }

  /**
   * Disabilita la modalità test
   */
  function disable() {
    if (!isTestMode) {
      console.log('ℹ️ Test Mode già disattivato');
      return;
    }
    
    isTestMode = false;
    saveState();
    removeBadge();
    disableTestFeatures();
    
    console.log('⚪ Test Mode DISATTIVATO');
    showNotification('Test Mode disattivato', 'info');
    
    return true;
  }

  /**
   * Toggle modalità test
   */
  function toggle() {
    return isTestMode ? disable() : enable();
  }

  /**
   * Verifica se test mode è attivo
   */
  function isEnabled() {
    return isTestMode;
  }

  /**
   * Mostra notifica
   */
  function showNotification(message, type = 'info') {
    // Usa sistema notifiche esistente se disponibile
    if (window.showLocationNotification) {
      window.showLocationNotification(message, type);
    } else {
      // Fallback: toast semplice
      const toast = document.createElement('div');
      toast.className = `test-mode-toast test-mode-toast-${type}`;
      toast.textContent = message;
      document.body.appendChild(toast);
      
      setTimeout(() => {
        toast.classList.add('show');
      }, 10);
      
      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
      }, 3000);
    }
  }

  /**
   * Espone API globale
   */
  function exposeAPI() {
    window.TestMode = {
      enable,
      disable,
      toggle,
      isEnabled,
      init
    };
  }

  // ===== AUTO-INIZIALIZZAZIONE =====
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  console.log('✅ Test Mode Manager caricato');

})();

