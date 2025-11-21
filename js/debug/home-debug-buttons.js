/**
 * ========================================
 * HOME DEBUG BUTTONS
 * Gestione pulsanti debug nella home screen
 * ========================================
 * 
 * Pulsanti debug visibili solo quando Test Mode è attivo
 * 
 * @version 1.0.0
 * @date 2025-01-20
 */

(function() {
  'use strict';

  // ===== INIZIALIZZAZIONE =====
  
  function init() {
    // Attendi che il DOM sia pronto
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', setupButtons);
    } else {
      setupButtons();
    }
    
    // Ascolta cambi di Test Mode
    window.addEventListener('testModeChanged', handleTestModeChange);
  }

  /**
   * Configura i pulsanti debug
   */
  function setupButtons() {
    // GPS Debug Panel
    const gpsPanelBtn = document.getElementById('debug-gps-panel-btn');
    if (gpsPanelBtn) {
      gpsPanelBtn.addEventListener('click', () => {
        if (window.GPSDebugPanel) {
          window.GPSDebugPanel.show();
          console.log('📍 GPS Debug Panel aperto');
        } else {
          console.warn('⚠️ GPSDebugPanel non disponibile');
        }
      });
    }

    // Test Geolocalizzazione
    const testGeolocationBtn = document.getElementById('debug-test-geolocation-btn');
    if (testGeolocationBtn) {
      testGeolocationBtn.addEventListener('click', async () => {
        console.group('🗺️ TEST GEOLOCALIZZAZIONE');
        try {
          if (window.Geolocation && window.Geolocation.requestUserLocation) {
            const position = await window.Geolocation.requestUserLocation();
            console.log('✅ Posizione ottenuta:', position);
            if (window.GPSDebugPanel) {
              window.GPSDebugPanel.show();
              window.GPSDebugPanel.addLog('position', {
                latitude: position.latitude,
                longitude: position.longitude,
                accuracy: position.accuracy
              });
            }
          } else {
            console.warn('⚠️ Geolocation module non disponibile');
          }
        } catch (error) {
          console.error('❌ Errore geolocalizzazione:', error);
        }
        console.groupEnd();
      });
    }

    // Info App
    const appInfoBtn = document.getElementById('debug-app-info-btn');
    if (appInfoBtn) {
      appInfoBtn.addEventListener('click', () => {
        console.group('ℹ️ INFO APP');
        console.log('Versione:', window.APP_VERSION || 'N/A');
        console.log('User Agent:', navigator.userAgent);
        console.log('Platform:', navigator.platform);
        console.log('Online:', navigator.onLine);
        console.log('Service Worker:', 'serviceWorker' in navigator ? 'Supportato' : 'Non supportato');
        console.log('Geolocation:', 'geolocation' in navigator ? 'Supportato' : 'Non supportato');
        console.log('LocalStorage:', typeof(Storage) !== 'undefined' ? 'Supportato' : 'Non supportato');
        console.log('Test Mode:', window.TestMode && window.TestMode.isEnabled() ? 'Attivo' : 'Non attivo');
        
        // Info cache
        if ('caches' in window) {
          caches.keys().then(keys => {
            console.log('Cache disponibili:', keys);
          });
        }
        
        // Info localStorage
        try {
          const keys = Object.keys(localStorage);
          console.log('LocalStorage keys:', keys);
          console.log('LocalStorage size:', new Blob([JSON.stringify(localStorage)]).size, 'bytes');
        } catch (e) {
          console.warn('⚠️ Impossibile leggere localStorage:', e);
        }
        
        console.groupEnd();
      });
    }

    // Reset Completo
    const resetAllBtn = document.getElementById('debug-reset-all-btn');
    if (resetAllBtn) {
      resetAllBtn.addEventListener('click', () => {
        if (confirm('⚠️ Sei sicuro di voler resettare TUTTO?\n\nQuesto cancellerà:\n- Stato route\n- Preferenze\n- Cache\n- LocalStorage\n\nL\'operazione non può essere annullata.')) {
          console.group('🔄 RESET COMPLETO');
          
          // Reset route
          if (window.RouteSelector) {
            window.RouteSelector.reset();
          }
          
          // Clear localStorage
          try {
            localStorage.clear();
            console.log('✅ LocalStorage cancellato');
          } catch (e) {
            console.warn('⚠️ Errore cancellazione localStorage:', e);
          }
          
          // Clear cache
          if ('caches' in window) {
            caches.keys().then(keys => {
              return Promise.all(keys.map(key => caches.delete(key)));
            }).then(() => {
              console.log('✅ Cache cancellata');
            }).catch(e => {
              console.warn('⚠️ Errore cancellazione cache:', e);
            });
          }
          
          console.log('✅ Reset completo eseguito. Ricarica la pagina.');
          console.groupEnd();
          
          // Ricarica la pagina dopo 1 secondo
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      });
    }

    // Clear Cache
    const clearCacheBtn = document.getElementById('debug-clear-cache-btn');
    if (clearCacheBtn) {
      clearCacheBtn.addEventListener('click', () => {
        if (confirm('🗑️ Cancellare la cache?\n\nQuesto rimuoverà tutti i file in cache ma manterrà i dati in localStorage.')) {
          console.group('🗑️ CLEAR CACHE');
          
          if ('caches' in window) {
            caches.keys().then(keys => {
              return Promise.all(keys.map(key => {
                console.log('🗑️ Cancellando cache:', key);
                return caches.delete(key);
              }));
            }).then(() => {
              console.log('✅ Cache cancellata con successo');
              alert('✅ Cache cancellata! Ricarica la pagina per applicare le modifiche.');
            }).catch(e => {
              console.error('❌ Errore cancellazione cache:', e);
              alert('❌ Errore durante la cancellazione della cache.');
            });
          } else {
            console.warn('⚠️ Cache API non supportata');
            alert('⚠️ Cache API non supportata dal browser.');
          }
          
          console.groupEnd();
        }
      });
    }

    // Log Console
    const consoleLogBtn = document.getElementById('debug-console-log-btn');
    if (consoleLogBtn) {
      consoleLogBtn.addEventListener('click', () => {
        console.group('📋 LOG CONSOLE');
        console.log('=== STATO APP ===');
        console.log('Test Mode:', window.TestMode && window.TestMode.isEnabled() ? '✅ Attivo' : '⚪ Non attivo');
        console.log('Debug Logs:', window.DEBUG_LOGS_ENABLED ? '✅ Attivi' : '⚪ Non attivi');
        
        console.log('\n=== MODULI ===');
        console.log('RouteSelector:', window.RouteSelector ? '✅ Disponibile' : '❌ Non disponibile');
        console.log('Geolocation:', window.Geolocation ? '✅ Disponibile' : '❌ Non disponibile');
        console.log('GPSDebugPanel:', window.GPSDebugPanel ? '✅ Disponibile' : '❌ Non disponibile');
        console.log('Settings:', window.Settings ? '✅ Disponibile' : '❌ Non disponibile');
        
        console.log('\n=== STATO ROUTE ===');
        if (window.RouteSelector) {
          const state = window.RouteSelector.getState();
          console.log('Linea:', state.lineaIdx || 'Nessuna');
          console.log('Partenza:', state.partenzaIdx || 'Nessuna');
          console.log('Arrivo:', state.arrivoIdx || 'Nessuna');
        }
        
        console.log('\n=== GEOLOCALIZZAZIONE ===');
        if (window.Geolocation) {
          const position = window.Geolocation.getLastPosition();
          if (position) {
            console.log('Ultima posizione:', position);
          } else {
            console.log('Nessuna posizione salvata');
          }
        }
        
        console.groupEnd();
      });
    }
  }

  /**
   * Gestisce il cambio di stato Test Mode
   */
  function handleTestModeChange(event) {
    // I pulsanti vengono mostrati/nascosti automaticamente
    // dalla funzione showDebugElements/hideDebugElements in test-mode.js
    if (event.detail.enabled) {
      console.log('✅ Pulsanti debug abilitati');
    } else {
      console.log('⚪ Pulsanti debug disabilitati');
    }
  }

  // ===== AVVIA =====
  init();

})();

