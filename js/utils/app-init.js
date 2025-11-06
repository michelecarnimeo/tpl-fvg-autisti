// ===== APP INITIALIZATION =====
// Funzioni comuni per inizializzazione app su tutte le pagine
// Evita duplicazione di codice tra i file HTML

/**
 * Registra il Service Worker per supporto PWA offline
 */
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js')
        .then(registration => {
          console.log('✅ Service Worker registrato:', registration.scope);
        })
        .catch(err => {
          console.error('❌ Service Worker registration failed:', err);
        });
    });
  }
}

/**
 * Renderizza il changelog nel container specificato
 * @param {string} containerId - ID del container dove renderizzare il changelog (default: 'changelog-container')
 */
function initChangelog(containerId = 'changelog-container') {
  // Verifica che renderChangelog sia disponibile (da changelog.js)
  if (typeof renderChangelog !== 'function') {
    console.warn('⚠️ renderChangelog non disponibile. Assicurati che changelog.js sia caricato.');
    return;
  }

  // Funzione helper per verificare e renderizzare
  const tryRenderChangelog = () => {
    const container = document.getElementById(containerId);
    if (container) {
      renderChangelog(containerId);
    } else {
      // Container non trovato - silenzioso, non tutte le pagine hanno il changelog
      // console.debug(`ℹ️ Container "${containerId}" non trovato. Changelog non renderizzato.`);
    }
  };

  // Aspetta che il DOM sia pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', tryRenderChangelog);
  } else {
    // DOM già caricato
    tryRenderChangelog();
  }
}

/**
 * Inizializza tutte le funzionalità comuni dell'app
 * @param {Object} options - Opzioni di inizializzazione
 * @param {string} options.changelogContainerId - ID del container per il changelog (default: 'changelog-container')
 * @param {boolean} options.registerSW - Se registrare il Service Worker (default: true)
 * @param {boolean} options.initChangelog - Se inizializzare il changelog (default: true, verifica automaticamente se il container esiste)
 */
function initApp(options = {}) {
  const {
    changelogContainerId = 'changelog-container',
    registerSW = true,
    initChangelog: shouldInitChangelog = true
  } = options;

  // Registra Service Worker se richiesto
  if (registerSW) {
    registerServiceWorker();
  }

  // Inizializza changelog se richiesto
  // initChangelog verifica automaticamente se il container esiste
  if (shouldInitChangelog) {
    initChangelog(changelogContainerId);
  }
}

// Auto-inizializzazione se il DOM è già pronto
// Altrimenti aspetta DOMContentLoaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initApp();
  });
} else {
  // DOM già caricato
  initApp();
}

// Espone le funzioni per uso manuale se necessario
window.AppInit = {
  registerServiceWorker,
  initChangelog,
  initApp
};

