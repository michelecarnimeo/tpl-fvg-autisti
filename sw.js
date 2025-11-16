const CACHE_NAME = 'tpl-cache-v21';
const CACHE_SIZE_LIMIT = 100 * 1024 * 1024; // 100MB per supporto offline completo
const STATIC_CACHE = 'tpl-static-v21';
const DYNAMIC_CACHE = 'tpl-dynamic-v21';
const MAX_DYNAMIC_ITEMS = 200; // Più elementi per supporto offline

// Configurazione ottimizzata per supporto offline
const PERFORMANCE_CONFIG = {
  enableLogging: true, // Abilitato per debug offline
  enableCacheSizeCheck: true, // Controllo dimensioni attivo
  enableCompression: false, // Compressione disabilitata per velocità
  maxRetries: 3, // Più tentativi per connessioni instabili
  offlineFirst: true // Priorità offline
};
// Assets critici per supporto offline completo
const STATIC_ASSETS = [
  './', // Fallback principale
  './index.html', // Homepage
  './benvenuto.html', // Pagina benvenuto
  './fermate.html', // Fermate (offline critico)
  './prezzi.html', // Prezzi (offline critico)
  './404.html', // Pagina errore 404
  // CSS - Ordine di caricamento: Variables → Base → Layout → Animations → Themes → Components → Legacy
  './css/variables.css', // 1. Variabili CSS globali
  './css/base.css', // 2. Reset e typography
  './css/layout.css', // 3. Layout globale (body, container, main-content)
  './css/animations.css', // 4. Animazioni e transizioni
  './css/themes.css', // 5. Temi e accessibilità (dark mode, high contrast, reduce motion, etc.)
  './css/components/navbar.css', // Navbar
  './css/components/forms.css', // Forms
  './css/components/buttons.css', // Buttons
  './css/components/price-card.css', // Price card
  './css/components/cards.css', // Main content cards
  './css/components/page-layout.css?v=1.0.0', // Page titles / layout helpers
  './css/components/fermate-card.css?v=1.0.0', // Fermate cards & lists
  './css/components/search-selector.css?v=1.0.0', // Ricerca e selettori
  './css/components/line-map.css?v=1.0.0', // Map styles
  './css/components/footer.css', // Footer modulare CSS
  './css/components/modals.css', // Modals modulare CSS
  './css/components/cache-modal.css', // Cache modal
  './css/components/mega-dropdown-settings.css', // Mega Dropdown Settings
  './css/components/pwa-bottom-nav.css', // PWA Bottom Navigation
  './css/components/settings/impostazioni.css', // Settings (struttura)
  './css/components/settings/accessibilita.css', // Settings (tab Accessibilità)
  './css/components/settings/aspetto.css', // Settings (tab Aspetto)
  './css/components/settings/info.css', // Settings (tab Info)
  './css/pages/benvenuto.css', // Pagina benvenuto
  './css/pages/fermate.css', // Pagina fermate
  './style1.css', // 7. LEGACY (temporaneo - da dismettere)
  './script.js', // Funzionalità app
  './footer.js', // Footer modulare JS
  './changelog.js', // Changelog dinamico
  './js/core/storage.js', // Core: Storage wrapper (deve essere caricato per primo!)
  './js/data/tariffario.js', // Data: Gestione tariffario
  './js/features/updates.js', // Verifica aggiornamenti
  './js/features/settings.js', // Gestione impostazioni
  './js/features/prezzi.js', // Calcolo prezzi
  './js/features/route-selector.js', // Gestione selezione route (linea/partenza/arrivo)
  './js/features/geolocation.js', // Gestione geolocalizzazione e ordinamento fermate per distanza
  './js/features/page-renderers.js', // Rendering pagine fermate.html e prezzi.html
  './js/features/line-map.js?v=1.0.0', // Map logic
  './js/tests/test-prezzi.js', // Test suite prezzi (solo per test.html)
  './js/tests/test-prezzi-wrappers.js', // Wrapper funzioni Prezzi test (solo per test.html)
  './js/tests/test-route-selector.js', // Test suite route selector (solo per test.html)
  './js/tests/test-route-selector-wrappers.js', // Wrapper funzioni Route Selector test (solo per test.html)
  './js/tests/test-storage.js', // Test suite storage (solo per test.html)
  './js/tests/test-storage-wrappers.js', // Wrapper funzioni Storage test (solo per test.html)
  './js/tests/test-log-helpers.js', // Funzioni gestione log (solo per test.html)
  './js/tests/test-utils.js', // Utility funzioni test (solo per test.html)
  './js/tests/test-settings.js', // Test suite settings (solo per test.html)
  './js/tests/test-settings-wrappers.js', // Wrapper funzioni Settings test (solo per test.html)
  './js/tests/test-darkmode.js', // Test suite dark mode (solo per test.html)
  './js/tests/test-darkmode-wrappers.js', // Wrapper funzioni Dark Mode test (solo per test.html)
  './js/tests/test-sw.js', // Test suite service worker (solo per test.html)
  './js/tests/test-sw-wrappers.js', // Wrapper funzioni Service Worker test (solo per test.html)
  './js/tests/test-all-wrappers.js', // Wrapper funzione runAllTests (solo per test.html)
  './js/tests/test-database.js', // Test suite database (solo per test.html)
  './js/tests/test-ui.js', // Test suite UI (solo per test.html)
  './js/tests/test-manifest.js', // Test suite Manifest (solo per test.html)
  './js/tests/test-performance.js', // Test suite Performance (solo per test.html)
  './js/tests/test-ui-manifest-performance-wrappers.js', // Wrapper test UI/Manifest/Performance (solo per test.html)
  './js/components/mega-dropdown-settings.js', // Mega Dropdown Settings (componente condiviso, solo desktop)
  './js/components/hamburger-menu.js', // Hamburger Menu (componente condiviso, tutte le pagine)
  './js/tests/device-detector.js', // Device Detection (solo per test.html)
  './js/tests/pwa-test-mode.js', // PWA Test Mode (solo per test.html)
  './js/tests/effects-status.js', // Effects Status (solo per test.html)
  './js/tests/gps/helpers.js', // GPS Helpers (solo per test.html)
  './js/tests/gps/fake-position.js', // GPS Fake Position (solo per test.html)
  './js/tests/gps/reset-data.js', // GPS Reset Data (solo per test.html)
  './js/tests/gps/distance-calculator.js', // GPS Distance Calculator (solo per test.html)
  './js/tests/gps/map-leaflet.js', // GPS Map Leaflet (solo per test.html)
  './js/tests/gps/watch-position.js', // GPS Watch Position (solo per test.html)
  './js/tests/gps/quick-test.js', // GPS Quick Test (solo per test.html)
  './js/tests/gps/export-report.js', // GPS Export Report (solo per test.html)
  './js/tests/gps/test-geolocation.js', // GPS Test Geolocation (solo per test.html)
  './js/tests/error-404-simulator.js', // Error 404 Simulator (solo per test.html)
  './js/components/modals.js', // Modal fermate
  './js/components/notification-modal.js', // Modal notifica
  './js/utils/ui-helpers.js', // UI Helpers (scroll, swap button, etc.)
  './js/utils/offline-notifications.js', // Notifiche offline/online
  './js/utils/app-init.js', // Inizializzazione app comune (SW registration, changelog)
  './js/utils/interface-scale.js', // Sistema scala interfaccia
  './js/pages/benvenuto.js', // Logica specifica pagina benvenuto
  './libs/leaflet/leaflet.css', // Leaflet CSS (locale)
  './libs/leaflet/leaflet.js', // Leaflet JS (locale)
  './libs/leaflet/leaflet-icon-fix.js', // Leaflet icon path fix
  './libs/leaflet/marker-icon.png', // Leaflet marker icon
  './libs/leaflet/marker-icon-2x.png', // Leaflet marker icon retina
  './libs/leaflet/marker-shadow.png', // Leaflet marker shadow
  './components/settings-modal.html', // Settings modal HTML centralizzato
  './database.json', // DATI CRITICI per offline
  './manifest.webmanifest', // PWA
  './src/tpl.jpg', // Icona app
  './src/logo.png', // Logo
  './src/benvenuto.jpg', // Immagine benvenuto
  './test.html', // Pagina test (utile offline)
  './test-config.js', // Config test
  './css/components/tests/toc-sidebar.css' // TOC Sidebar (indice rapido desktop)
  // NOTA: version.json NON è in cache per permettere verifica aggiornamenti
];

// Assets opzionali (cache dinamico)
const OPTIONAL_ASSETS = [
  './test.html',
  './test-config.js'
];

// URL patterns per GitHub Pages
const GITHUB_PAGES_PATTERNS = [
  /^https?:\/\/[^\/]*\.github\.io\//,
  /^https?:\/\/[^\/]*\.github\.com\//
];

// Utility functions per GitHub Pages e supporto offline
function isGitHubPages(url) {
  return GITHUB_PAGES_PATTERNS.some(pattern => pattern.test(url));
}

// Verifica se un asset è critico per il funzionamento offline
function isOfflineCritical(url) {
  const criticalPatterns = [
    /\.(html|css|js|json)$/,
    /database\.json$/, // Database critico
    /manifest\.json$/, // PWA manifest
    /src\/(logo|tpl|benvenuto)\./ // Immagini essenziali
  ];
  return criticalPatterns.some(pattern => pattern.test(url));
}

// Strategia offline-first per asset critici
function shouldCacheOffline(url) {
  return isOfflineCritical(url) || url.includes('src/');
}

function getCacheSize(cacheName) {
  return caches.open(cacheName).then(cache => {
    return cache.keys().then(keys => {
      return Promise.all(
        keys.map(key => cache.match(key).then(response => response.blob()))
      ).then(blobs => {
        return blobs.reduce((total, blob) => total + blob.size, 0);
      });
    });
  });
}

function cleanupOldCaches() {
  return caches.keys().then(cacheNames => {
    return Promise.all(
      cacheNames.map(cacheName => {
        if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
          console.log('SW: Eliminazione cache vecchia:', cacheName);
          return caches.delete(cacheName);
        }
      })
    );
  });
}

self.addEventListener('install', event => {
  console.log('SW: Installazione cache v4 per GitHub Pages');
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then(cache => {
        console.log('SW: Memorizzazione asset statici...');
        return cache.addAll(STATIC_ASSETS);
      }),
      caches.open(DYNAMIC_CACHE).then(cache => {
        console.log('SW: Cache dinamico pronto');
        return Promise.resolve();
      })
    ])
    .then(() => {
      console.log('SW: Tutti gli asset memorizzati con successo');
      return self.skipWaiting();
    })
    .catch(error => {
      console.error('SW: Errore memorizzazione asset:', error);
    })
  );
});

self.addEventListener('activate', event => {
  console.log('SW: Attivazione cache v4');
  event.waitUntil(
    caches.keys().then(keys => {
      console.log('SW: Trovate', keys.length, 'cache esistenti');
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            console.log('SW: Eliminazione cache vecchia:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => {
      console.log('SW: Pulizia cache completata');
      return self.clients.claim(); // Controlla immediatamente tutti i client
    })
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  
  // Skip non-GET requests and external domains (except GitHub Pages)
  if (request.method !== 'GET' || 
      request.url.startsWith('chrome-extension://') ||
      (!url.origin.includes('github.io') && !url.origin.includes('localhost'))) {
    return;
  }

  // Non cachare version.json per permettere verifica aggiornamenti
  if (request.url.includes('version.json')) {
    event.respondWith(
      fetch(request, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      }).catch(() => {
        // Se offline, ritorna una versione fallback
        return new Response(JSON.stringify({
          version: 'unknown',
          offline: true
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      })
    );
    return;
  }

  event.respondWith(
    caches.match(request)
      .then(cached => {
        if (cached) {
          if (PERFORMANCE_CONFIG.enableLogging) {
          console.log('SW: Cache TROVATO (OFFLINE):', request.url);
        }
          return cached;
        }
        
        if (PERFORMANCE_CONFIG.enableLogging) {
          console.log('SW: Cache NON TROVATO, richiesta rete:', request.url);
        }
        
        // Strategia di cache per GitHub Pages
        const cacheStrategy = getCacheStrategy(request.url);
        
        return fetch(request)
          .then(response => {
            // Verifica validità risposta
            if (!response || response.status !== 200) {
              return response;
            }

            // Cache offline-first per asset critici
            if (shouldCacheOffline(request.url)) {
              const responseToCache = response.clone();
              const cacheName = isOfflineCritical(request.url) ? STATIC_CACHE : DYNAMIC_CACHE;
              
              caches.open(cacheName)
                .then(cache => {
                  cache.put(request, responseToCache);
                  if (PERFORMANCE_CONFIG.enableLogging) {
                    console.log('SW: Memorizzato per OFFLINE in', cacheName, ':', request.url);
                  }
                })
                .catch(error => {
                  console.error('SW: Errore cache offline:', error);
                });
            }
            
            return response;
          })
          .catch(error => {
            console.error('SW: Errore rete (OFFLINE):', request.url, error);
            
            // Fallback offline intelligente per TPL FVG
            if (request.destination === 'document') {
              return caches.match('./index.html');
            } else if (request.url.includes('.css')) {
              return caches.match('./style1.css');
            } else if (request.url.includes('.js')) {
              return caches.match('./script.js');
            } else if (request.url.includes('database.json')) {
              return caches.match('./database.json');
            }
            
            // Notifica offline agli utenti
            if (isOfflineCritical(request.url)) {
              self.clients.matchAll().then(clients => {
                clients.forEach(client => {
                  client.postMessage({
                    type: 'OFFLINE_MODE',
                    message: 'App funzionante in modalità offline'
                  });
                });
              });
            }
            
            throw error;
          });
      })
  );
});

// Strategia di cache ottimizzata per GitHub Pages
function getCacheStrategy(url) {
  // Assets critici - cache statico
  if (url.match(/\.(html|css|js|json|png|jpg|jpeg|gif|svg|ico)$/)) {
    return 'static';
  }
  
  // Assets dinamici - cache dinamico
  if (url.match(/\.(woff|woff2|ttf|eot)$/)) {
    return 'dynamic';
  }
  
  // No cache per tutto il resto
  return 'no-cache';
}

// Messaggi per comunicazione con la pagina
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_CACHE_SIZE') {
    Promise.all([
      getCacheSize(STATIC_CACHE),
      getCacheSize(DYNAMIC_CACHE)
    ]).then(([staticSize, dynamicSize]) => {
      event.ports[0].postMessage({
        type: 'CACHE_SIZE',
        static: staticSize,
        dynamic: dynamicSize,
        total: staticSize + dynamicSize
      });
    });
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.delete(DYNAMIC_CACHE).then(() => {
      event.ports[0].postMessage({ type: 'CACHE_CLEARED' });
    });
  }
});
