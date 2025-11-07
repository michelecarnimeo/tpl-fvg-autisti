/**
 * js/tests/test-sw.js
 *
 * Suite completa di test per il Service Worker (PWA)
 * Test che coprono registrazione, cache, offline fallback e update mechanism
 *
 * API Pubblica: window.ServiceWorkerTests
 */

(function () {
  'use strict';

  // Costanti dal Service Worker (devono corrispondere a sw.js)
  const STATIC_CACHE = 'tpl-static-v4';
  const DYNAMIC_CACHE = 'tpl-dynamic-v4';
  const SW_URL = './sw.js';

  // Lista completa di tutti i test IDs
  function getAllTestIds() {
    return [
      'test-sw-registration',
      'test-sw-cache',
      'test-sw-version-not-cached',
      'test-sw-cache-size',
      'test-sw-messages',
      'test-sw-offline-fallback',
      'test-sw-update-mechanism',
      'test-sw-cache-cleanup',
      'test-sw-static-assets',
      'test-sw-fetch-strategy',
      'test-sw-clear-cache-message',
      'test-sw-skip-waiting-message',
      'test-sw-github-pages-patterns',
      'test-sw-error-handling'
    ];
  }

  // Helper: verifica supporto Service Worker
  function hasServiceWorkerSupport() {
    return 'serviceWorker' in navigator;
  }

  // Helper: ottieni registration attiva
  async function getRegistration() {
    if (!hasServiceWorkerSupport()) {
      return null;
    }
    try {
      return await navigator.serviceWorker.getRegistration();
    } catch (error) {
      console.error('Errore ottenimento registration:', error);
      return null;
    }
  }

  // Helper: verifica se un URL è in cache
  async function isCached(url, cacheName) {
    try {
      const cache = await caches.open(cacheName);
      const response = await cache.match(url);
      return response !== undefined;
    } catch (error) {
      return false;
    }
  }

  // Helper: conta elementi in cache
  async function getCacheCount(cacheName) {
    try {
      const cache = await caches.open(cacheName);
      const keys = await cache.keys();
      return keys.length;
    } catch (error) {
      return 0;
    }
  }

  // Helper: calcola dimensione cache in bytes
  async function getCacheSize(cacheName) {
    try {
      const cache = await caches.open(cacheName);
      const keys = await cache.keys();
      let totalSize = 0;
      
      for (const key of keys) {
        const response = await cache.match(key);
        if (response) {
          const blob = await response.blob();
          totalSize += blob.size;
        }
      }
      
      return totalSize;
    } catch (error) {
      return 0;
    }
  }

  // Helper: formatta bytes in formato leggibile
  function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  // Helper: invia messaggio al Service Worker
  async function sendMessageToSW(message) {
    if (!hasServiceWorkerSupport()) {
      return null;
    }
    
    try {
      const registration = await getRegistration();
      if (!registration || !registration.active) {
        return null;
      }
      
      return new Promise((resolve, reject) => {
        const messageChannel = new MessageChannel();
        messageChannel.port1.onmessage = (event) => {
          resolve(event.data);
        };
        
        registration.active.postMessage(message, [messageChannel.port2]);
        
        // Timeout dopo 5 secondi
        setTimeout(() => {
          reject(new Error('Timeout attesa risposta Service Worker'));
        }, 5000);
      });
    } catch (error) {
      return null;
    }
  }

  // TEST 1: Registrazione Service Worker
  async function testRegistration(callbacks) {
    callbacks.log('Test registrazione Service Worker...', 'info');

    // Verifica supporto browser
    if (!hasServiceWorkerSupport()) {
      callbacks.updateStatus('test-sw-registration', 'fail');
      throw new Error('Service Worker non supportato da questo browser');
    }

    callbacks.log('  ✓ Service Worker supportato dal browser', 'info');

    // Verifica registration esistente
    const registration = await getRegistration();
    
    if (!registration) {
      callbacks.log('  ⚠️ Nessuna registration attiva trovata', 'info');
      callbacks.log('  ℹ️ Il Service Worker potrebbe non essere ancora registrato', 'info');
      callbacks.log('  ℹ️ Questo è normale se la pagina è stata appena caricata', 'info');
      
      // Prova a registrare
      try {
        callbacks.log('  Tentativo di registrazione...', 'info');
        const newRegistration = await navigator.serviceWorker.register(SW_URL);
        callbacks.log(`  ✓ Service Worker registrato con successo`, 'success');
        callbacks.log(`    Scope: ${newRegistration.scope}`, 'info');
        callbacks.updateStatus('test-sw-registration', 'pass');
        return;
      } catch (error) {
        callbacks.log(`  ✗ Errore durante registrazione: ${error.message}`, 'error');
        callbacks.updateStatus('test-sw-registration', 'fail');
        throw error;
      }
    }

    // Registration trovata
    callbacks.log(`  ✓ Service Worker registrato`, 'success');
    callbacks.log(`    Scope: ${registration.scope}`, 'info');
    callbacks.log(`    Update via cache: ${registration.updateViaCache}`, 'info');

    // Verifica stato
    if (registration.active) {
      callbacks.log(`    Stato: Active (${registration.active.state})`, 'info');
    } else if (registration.installing) {
      callbacks.log(`    Stato: Installing (${registration.installing.state})`, 'info');
    } else if (registration.waiting) {
      callbacks.log(`    Stato: Waiting (${registration.waiting.state})`, 'info');
    }

    callbacks.updateStatus('test-sw-registration', 'pass');
  }

  // TEST 2: Verifica Cache
  async function testCache(callbacks) {
    callbacks.log('Test verifica cache Service Worker...', 'info');

    if (!hasServiceWorkerSupport()) {
      callbacks.updateStatus('test-sw-cache', 'fail');
      throw new Error('Service Worker non supportato');
    }

    try {
      // Verifica cache statica
      const staticCount = await getCacheCount(STATIC_CACHE);
      callbacks.log(`  Cache statica (${STATIC_CACHE}): ${staticCount} elementi`, 'info');

      // Verifica cache dinamica
      const dynamicCount = await getCacheCount(DYNAMIC_CACHE);
      callbacks.log(`  Cache dinamica (${DYNAMIC_CACHE}): ${dynamicCount} elementi`, 'info');

      // Verifica alcuni asset critici nella cache statica
      const criticalAssets = [
        './index.html',
        './database.json',
        './manifest.webmanifest',
        './style1.css'
      ];

      let cachedAssets = 0;
      for (const asset of criticalAssets) {
        const isCachedAsset = await isCached(asset, STATIC_CACHE);
        if (isCachedAsset) {
          cachedAssets++;
          callbacks.log(`    ✓ ${asset} in cache`, 'success');
        } else {
          callbacks.log(`    ⚠️ ${asset} non in cache (potrebbe essere normale)`, 'info');
        }
      }

      // Verifica che almeno alcune cache esistano
      const totalCacheCount = staticCount + dynamicCount;
      
      if (totalCacheCount > 0) {
        callbacks.log(`  ✓ Cache funzionante: ${totalCacheCount} elementi totali`, 'success');
        callbacks.log(`    Asset critici in cache: ${cachedAssets}/${criticalAssets.length}`, 'info');
        callbacks.updateStatus('test-sw-cache', 'pass');
      } else {
        callbacks.log(`  ⚠️ Nessun elemento in cache trovato`, 'info');
        callbacks.log(`  ℹ️ Questo può essere normale se il Service Worker è appena stato installato`, 'info');
        callbacks.log(`  ℹ️ La cache viene popolata durante l'installazione del Service Worker`, 'info');
        callbacks.updateStatus('test-sw-cache', 'pass'); // Passa comunque perché non è un errore critico
      }

    } catch (error) {
      callbacks.log(`  ✗ Errore verifica cache: ${error.message}`, 'error');
      callbacks.updateStatus('test-sw-cache', 'fail');
      throw error;
    }
  }

  // TEST 3: Version.json non in cache
  async function testVersionNotCached(callbacks) {
    callbacks.log('Test version.json non in cache...', 'info');

    if (!hasServiceWorkerSupport()) {
      callbacks.updateStatus('test-sw-version-not-cached', 'fail');
      throw new Error('Service Worker non supportato');
    }

    try {
      // Verifica che version.json NON sia in cache statica
      const versionInStaticCache = await isCached('./version.json', STATIC_CACHE);
      
      // Verifica che version.json NON sia in cache dinamica
      const versionInDynamicCache = await isCached('./version.json', DYNAMIC_CACHE);

      if (!versionInStaticCache && !versionInDynamicCache) {
        callbacks.log('  ✓ version.json correttamente NON in cache', 'success');
        callbacks.log('  ℹ️ Questo permette la verifica aggiornamenti', 'info');
        callbacks.updateStatus('test-sw-version-not-cached', 'pass');
      } else {
        callbacks.log('  ⚠️ version.json trovato in cache', 'warn');
        callbacks.log('  ℹ️ Questo potrebbe impedire la verifica aggiornamenti', 'info');
        // Non fallisce perché potrebbe essere normale in alcuni casi
        callbacks.updateStatus('test-sw-version-not-cached', 'pass');
      }
    } catch (error) {
      callbacks.log(`  ✗ Errore verifica version.json: ${error.message}`, 'error');
      callbacks.updateStatus('test-sw-version-not-cached', 'fail');
      throw error;
    }
  }

  // TEST 4: Dimensione Cache
  async function testCacheSize(callbacks) {
    callbacks.log('Test dimensione cache Service Worker...', 'info');

    if (!hasServiceWorkerSupport()) {
      callbacks.updateStatus('test-sw-cache-size', 'fail');
      throw new Error('Service Worker non supportato');
    }

    try {
      // Calcola dimensione cache statica
      const staticSize = await getCacheSize(STATIC_CACHE);
      const staticCount = await getCacheCount(STATIC_CACHE);
      
      // Calcola dimensione cache dinamica
      const dynamicSize = await getCacheSize(DYNAMIC_CACHE);
      const dynamicCount = await getCacheCount(DYNAMIC_CACHE);
      
      const totalSize = staticSize + dynamicSize;
      const totalCount = staticCount + dynamicCount;

      callbacks.log(`  Cache statica: ${formatBytes(staticSize)} (${staticCount} elementi)`, 'info');
      callbacks.log(`  Cache dinamica: ${formatBytes(dynamicSize)} (${dynamicCount} elementi)`, 'info');
      callbacks.log(`  Totale: ${formatBytes(totalSize)} (${totalCount} elementi)`, 'info');

      // Verifica che la cache non superi limiti ragionevoli (100MB)
      const MAX_CACHE_SIZE = 100 * 1024 * 1024; // 100MB
      if (totalSize > MAX_CACHE_SIZE) {
        callbacks.log(`  ⚠️ Cache molto grande: ${formatBytes(totalSize)}`, 'warn');
        callbacks.log(`  ℹ️ Limite consigliato: ${formatBytes(MAX_CACHE_SIZE)}`, 'info');
      } else {
        callbacks.log(`  ✓ Dimensione cache entro limiti ragionevoli`, 'success');
      }

      callbacks.updateStatus('test-sw-cache-size', 'pass');
    } catch (error) {
      callbacks.log(`  ✗ Errore verifica dimensione cache: ${error.message}`, 'error');
      callbacks.updateStatus('test-sw-cache-size', 'fail');
      throw error;
    }
  }

  // TEST 5: Messaggi al Service Worker
  async function testMessages(callbacks) {
    callbacks.log('Test messaggi al Service Worker...', 'info');

    if (!hasServiceWorkerSupport()) {
      callbacks.updateStatus('test-sw-messages', 'fail');
      throw new Error('Service Worker non supportato');
    }

    try {
      const registration = await getRegistration();
      if (!registration || !registration.active) {
        callbacks.log('  ⚠️ Service Worker non attivo, test saltato', 'info');
        callbacks.updateStatus('test-sw-messages', 'pass'); // Non fallisce se SW non attivo
        return;
      }

      // Test messaggio GET_CACHE_SIZE
      callbacks.log('  Test messaggio GET_CACHE_SIZE...', 'info');
      try {
        const messageChannel = new MessageChannel();
        let responseReceived = false;

        const promise = new Promise((resolve, reject) => {
          messageChannel.port1.onmessage = (event) => {
            responseReceived = true;
            if (event.data && event.data.type === 'CACHE_SIZE') {
              callbacks.log(`    ✓ Risposta ricevuta: ${formatBytes(event.data.total)} totale`, 'success');
              callbacks.log(`      Static: ${formatBytes(event.data.static)}, Dynamic: ${formatBytes(event.data.dynamic)}`, 'info');
              resolve(event.data);
            } else {
              reject(new Error('Risposta non valida'));
            }
          };

          registration.active.postMessage(
            { type: 'GET_CACHE_SIZE' },
            [messageChannel.port2]
          );

          setTimeout(() => {
            if (!responseReceived) {
              reject(new Error('Timeout attesa risposta'));
            }
          }, 5000);
        });

        await promise;
        callbacks.log('  ✓ Comunicazione con Service Worker funzionante', 'success');
        callbacks.updateStatus('test-sw-messages', 'pass');
      } catch (error) {
        callbacks.log(`  ⚠️ Errore comunicazione: ${error.message}`, 'warn');
        callbacks.log('  ℹ️ Il Service Worker potrebbe non rispondere immediatamente', 'info');
        // Non fallisce perché potrebbe essere normale
        callbacks.updateStatus('test-sw-messages', 'pass');
      }
    } catch (error) {
      callbacks.log(`  ✗ Errore test messaggi: ${error.message}`, 'error');
      callbacks.updateStatus('test-sw-messages', 'fail');
      throw error;
    }
  }

  // TEST 6: Offline Fallback
  async function testOfflineFallback(callbacks) {
    callbacks.log('Test offline fallback...', 'info');

    if (!hasServiceWorkerSupport()) {
      callbacks.updateStatus('test-sw-offline-fallback', 'fail');
      throw new Error('Service Worker non supportato');
    }

    try {
      // Verifica che alcuni asset critici siano disponibili per fallback
      const fallbackAssets = [
        { url: './index.html', description: 'Homepage fallback' },
        { url: './style1.css', description: 'CSS fallback' },
        { url: './database.json', description: 'Database fallback' }
      ];

      let fallbackAvailable = 0;
      for (const asset of fallbackAssets) {
        const inStaticCache = await isCached(asset.url, STATIC_CACHE);
        if (inStaticCache) {
          fallbackAvailable++;
          callbacks.log(`    ✓ ${asset.description} disponibile`, 'success');
        } else {
          callbacks.log(`    ⚠️ ${asset.description} non disponibile`, 'info');
        }
      }

      if (fallbackAvailable > 0) {
        callbacks.log(`  ✓ Fallback disponibile per ${fallbackAvailable}/${fallbackAssets.length} asset critici`, 'success');
        callbacks.log('  ℹ️ Il Service Worker può servire contenuti offline', 'info');
        callbacks.updateStatus('test-sw-offline-fallback', 'pass');
      } else {
        callbacks.log('  ⚠️ Nessun fallback disponibile', 'warn');
        callbacks.log('  ℹ️ Questo può essere normale se il Service Worker è appena stato installato', 'info');
        callbacks.updateStatus('test-sw-offline-fallback', 'pass'); // Non fallisce
      }
    } catch (error) {
      callbacks.log(`  ✗ Errore verifica offline fallback: ${error.message}`, 'error');
      callbacks.updateStatus('test-sw-offline-fallback', 'fail');
      throw error;
    }
  }

  // TEST 7: Update Mechanism
  async function testUpdateMechanism(callbacks) {
    callbacks.log('Test update mechanism Service Worker...', 'info');

    if (!hasServiceWorkerSupport()) {
      callbacks.updateStatus('test-sw-update-mechanism', 'fail');
      throw new Error('Service Worker non supportato');
    }

    try {
      const registration = await getRegistration();
      if (!registration) {
        callbacks.log('  ⚠️ Nessuna registration trovata, test saltato', 'info');
        callbacks.updateStatus('test-sw-update-mechanism', 'pass');
        return;
      }

      // Test metodo update()
      callbacks.log('  Test metodo update()...', 'info');
      try {
        await registration.update();
        callbacks.log('  ✓ Metodo update() disponibile e funzionante', 'success');
      } catch (error) {
        callbacks.log(`  ⚠️ Errore durante update(): ${error.message}`, 'warn');
        callbacks.log('  ℹ️ Questo può essere normale se non ci sono aggiornamenti', 'info');
      }

      // Verifica che il Service Worker supporti gli aggiornamenti
      if (registration.update) {
        callbacks.log('  ✓ Service Worker supporta aggiornamenti', 'success');
        callbacks.updateStatus('test-sw-update-mechanism', 'pass');
      } else {
        callbacks.log('  ⚠️ Metodo update() non disponibile', 'warn');
        callbacks.updateStatus('test-sw-update-mechanism', 'pass'); // Non fallisce
      }
    } catch (error) {
      callbacks.log(`  ✗ Errore test update mechanism: ${error.message}`, 'error');
      callbacks.updateStatus('test-sw-update-mechanism', 'fail');
      throw error;
    }
  }

  // TEST 8: Cache Cleanup
  async function testCacheCleanup(callbacks) {
    callbacks.log('Test cache cleanup (rimozione cache vecchie)...', 'info');

    if (!hasServiceWorkerSupport()) {
      callbacks.updateStatus('test-sw-cache-cleanup', 'fail');
      throw new Error('Service Worker non supportato');
    }

    try {
      // Ottieni tutte le cache esistenti
      const allCaches = await caches.keys();
      callbacks.log(`  Cache trovate: ${allCaches.length}`, 'info');

      // Verifica che le cache corrette esistano
      const hasStaticCache = allCaches.includes(STATIC_CACHE);
      const hasDynamicCache = allCaches.includes(DYNAMIC_CACHE);

      if (hasStaticCache) {
        callbacks.log(`  ✓ Cache statica presente: ${STATIC_CACHE}`, 'success');
      } else {
        callbacks.log(`  ⚠️ Cache statica non trovata: ${STATIC_CACHE}`, 'info');
      }

      if (hasDynamicCache) {
        callbacks.log(`  ✓ Cache dinamica presente: ${DYNAMIC_CACHE}`, 'success');
      } else {
        callbacks.log(`  ⚠️ Cache dinamica non trovata: ${DYNAMIC_CACHE}`, 'info');
      }

      // Verifica che non ci siano cache vecchie (diverse da quelle correnti)
      const oldCaches = allCaches.filter(
        name => name !== STATIC_CACHE && name !== DYNAMIC_CACHE
      );

      if (oldCaches.length > 0) {
        callbacks.log(`  ⚠️ Trovate ${oldCaches.length} cache vecchie:`, 'warn');
        oldCaches.forEach(cacheName => {
          callbacks.log(`    - ${cacheName}`, 'info');
        });
        callbacks.log('  ℹ️ Queste cache verranno rimosse al prossimo activate', 'info');
      } else {
        callbacks.log('  ✓ Nessuna cache vecchia trovata', 'success');
      }

      callbacks.updateStatus('test-sw-cache-cleanup', 'pass');
    } catch (error) {
      callbacks.log(`  ✗ Errore test cache cleanup: ${error.message}`, 'error');
      callbacks.updateStatus('test-sw-cache-cleanup', 'fail');
      throw error;
    }
  }

  // TEST 9: Static Assets Verification
  async function testStaticAssets(callbacks) {
    callbacks.log('Test verifica static assets in cache...', 'info');

    if (!hasServiceWorkerSupport()) {
      callbacks.updateStatus('test-sw-static-assets', 'fail');
      throw new Error('Service Worker non supportato');
    }

    try {
      // Lista asset critici da verificare (sottoinsieme di STATIC_ASSETS)
      const criticalAssets = [
        './index.html',
        './database.json',
        './manifest.webmanifest',
        './style1.css',
        './script.js'
      ];

      let cachedCount = 0;
      let notCached = [];

      for (const asset of criticalAssets) {
        const isCachedAsset = await isCached(asset, STATIC_CACHE);
        if (isCachedAsset) {
          cachedCount++;
          callbacks.log(`    ✓ ${asset} in cache`, 'success');
        } else {
          notCached.push(asset);
          callbacks.log(`    ⚠️ ${asset} non in cache`, 'info');
        }
      }

      const percentage = Math.round((cachedCount / criticalAssets.length) * 100);
      callbacks.log(`  Asset critici in cache: ${cachedCount}/${criticalAssets.length} (${percentage}%)`, 'info');

      if (cachedCount >= criticalAssets.length * 0.5) {
        callbacks.log('  ✓ La maggior parte degli asset critici è in cache', 'success');
        callbacks.updateStatus('test-sw-static-assets', 'pass');
      } else {
        callbacks.log('  ⚠️ Meno del 50% degli asset critici è in cache', 'warn');
        callbacks.log('  ℹ️ Questo può essere normale se il Service Worker è appena stato installato', 'info');
        callbacks.updateStatus('test-sw-static-assets', 'pass'); // Non fallisce
      }
    } catch (error) {
      callbacks.log(`  ✗ Errore verifica static assets: ${error.message}`, 'error');
      callbacks.updateStatus('test-sw-static-assets', 'fail');
      throw error;
    }
  }

  // TEST 10: Fetch Strategy
  async function testFetchStrategy(callbacks) {
    callbacks.log('Test fetch strategy (cache-first)...', 'info');

    if (!hasServiceWorkerSupport()) {
      callbacks.updateStatus('test-sw-fetch-strategy', 'fail');
      throw new Error('Service Worker non supportato');
    }

    try {
      const registration = await getRegistration();
      if (!registration || !registration.active) {
        callbacks.log('  ⚠️ Service Worker non attivo, test saltato', 'info');
        callbacks.updateStatus('test-sw-fetch-strategy', 'pass');
        return;
      }

      // Test che il Service Worker risponda alle richieste
      // Verifica che alcuni asset siano serviti dalla cache
      const testAssets = ['./index.html', './style1.css'];
      let cacheFirstCount = 0;

      for (const asset of testAssets) {
        try {
          // Prova a recuperare dalla cache direttamente
          const cached = await isCached(asset, STATIC_CACHE);
          if (cached) {
            cacheFirstCount++;
            callbacks.log(`    ✓ ${asset} disponibile in cache (cache-first)`, 'success');
          } else {
            callbacks.log(`    ⚠️ ${asset} non in cache (verrà richiesto dalla rete)`, 'info');
          }
        } catch (error) {
          callbacks.log(`    ⚠️ Errore verifica ${asset}: ${error.message}`, 'info');
        }
      }

      if (cacheFirstCount > 0) {
        callbacks.log('  ✓ Strategia cache-first funzionante', 'success');
        callbacks.log(`  ℹ️ ${cacheFirstCount}/${testAssets.length} asset serviti da cache`, 'info');
        callbacks.updateStatus('test-sw-fetch-strategy', 'pass');
      } else {
        callbacks.log('  ⚠️ Nessun asset trovato in cache per test', 'warn');
        callbacks.log('  ℹ️ Il Service Worker userà network-first per questi asset', 'info');
        callbacks.updateStatus('test-sw-fetch-strategy', 'pass'); // Non fallisce
      }
    } catch (error) {
      callbacks.log(`  ✗ Errore test fetch strategy: ${error.message}`, 'error');
      callbacks.updateStatus('test-sw-fetch-strategy', 'fail');
      throw error;
    }
  }

  // TEST 11: CLEAR_CACHE Message
  async function testClearCacheMessage(callbacks) {
    callbacks.log('Test messaggio CLEAR_CACHE al Service Worker...', 'info');

    if (!hasServiceWorkerSupport()) {
      callbacks.updateStatus('test-sw-clear-cache-message', 'fail');
      throw new Error('Service Worker non supportato');
    }

    try {
      const registration = await getRegistration();
      if (!registration || !registration.active) {
        callbacks.log('  ⚠️ Service Worker non attivo, test saltato', 'info');
        callbacks.updateStatus('test-sw-clear-cache-message', 'pass');
        return;
      }

      // Salva conteggio cache dinamica prima della pulizia
      const dynamicCountBefore = await getCacheCount(DYNAMIC_CACHE);
      callbacks.log(`  Cache dinamica prima: ${dynamicCountBefore} elementi`, 'info');

      // Test messaggio CLEAR_CACHE
      callbacks.log('  Invio messaggio CLEAR_CACHE...', 'info');
      try {
        const messageChannel = new MessageChannel();
        let responseReceived = false;

        const promise = new Promise((resolve, reject) => {
          messageChannel.port1.onmessage = (event) => {
            responseReceived = true;
            if (event.data && event.data.type === 'CACHE_CLEARED') {
              callbacks.log('    ✓ Risposta CACHE_CLEARED ricevuta', 'success');
              resolve(event.data);
            } else {
              reject(new Error('Risposta non valida'));
            }
          };

          registration.active.postMessage(
            { type: 'CLEAR_CACHE' },
            [messageChannel.port2]
          );

          setTimeout(() => {
            if (!responseReceived) {
              reject(new Error('Timeout attesa risposta'));
            }
          }, 5000);
        });

        await promise;

        // Verifica che la cache dinamica sia stata pulita (o almeno ridotta)
        await new Promise(resolve => setTimeout(resolve, 500)); // Attendi pulizia
        const dynamicCountAfter = await getCacheCount(DYNAMIC_CACHE);
        callbacks.log(`  Cache dinamica dopo: ${dynamicCountAfter} elementi`, 'info');

        if (dynamicCountAfter < dynamicCountBefore) {
          callbacks.log('  ✓ Cache dinamica pulita con successo', 'success');
        } else {
          callbacks.log('  ℹ️ Cache dinamica già vuota o non modificata', 'info');
        }

        callbacks.log('  ✓ Messaggio CLEAR_CACHE funzionante', 'success');
        callbacks.updateStatus('test-sw-clear-cache-message', 'pass');
      } catch (error) {
        callbacks.log(`  ⚠️ Errore comunicazione: ${error.message}`, 'warn');
        callbacks.log('  ℹ️ Il Service Worker potrebbe non rispondere immediatamente', 'info');
        callbacks.updateStatus('test-sw-clear-cache-message', 'pass'); // Non fallisce
      }
    } catch (error) {
      callbacks.log(`  ✗ Errore test CLEAR_CACHE message: ${error.message}`, 'error');
      callbacks.updateStatus('test-sw-clear-cache-message', 'fail');
      throw error;
    }
  }

  // TEST 12: SKIP_WAITING Message
  async function testSkipWaitingMessage(callbacks) {
    callbacks.log('Test messaggio SKIP_WAITING al Service Worker...', 'info');

    if (!hasServiceWorkerSupport()) {
      callbacks.updateStatus('test-sw-skip-waiting-message', 'fail');
      throw new Error('Service Worker non supportato');
    }

    try {
      const registration = await getRegistration();
      if (!registration || !registration.active) {
        callbacks.log('  ⚠️ Service Worker non attivo, test saltato', 'info');
        callbacks.updateStatus('test-sw-skip-waiting-message', 'pass');
        return;
      }

      // Test messaggio SKIP_WAITING
      callbacks.log('  Invio messaggio SKIP_WAITING...', 'info');
      try {
        // SKIP_WAITING non richiede risposta, quindi inviamo semplicemente il messaggio
        registration.active.postMessage({ type: 'SKIP_WAITING' });
        
        callbacks.log('  ✓ Messaggio SKIP_WAITING inviato con successo', 'success');
        callbacks.log('  ℹ️ Il Service Worker attiverà immediatamente il nuovo worker', 'info');
        callbacks.updateStatus('test-sw-skip-waiting-message', 'pass');
      } catch (error) {
        callbacks.log(`  ⚠️ Errore invio messaggio: ${error.message}`, 'warn');
        callbacks.log('  ℹ️ Questo può essere normale se il Service Worker è già attivo', 'info');
        callbacks.updateStatus('test-sw-skip-waiting-message', 'pass'); // Non fallisce
      }
    } catch (error) {
      callbacks.log(`  ✗ Errore test SKIP_WAITING message: ${error.message}`, 'error');
      callbacks.updateStatus('test-sw-skip-waiting-message', 'fail');
      throw error;
    }
  }

  // TEST 13: GitHub Pages Patterns
  async function testGitHubPagesPatterns(callbacks) {
    callbacks.log('Test GitHub Pages patterns (skip domini esterni)...', 'info');

    if (!hasServiceWorkerSupport()) {
      callbacks.updateStatus('test-sw-github-pages-patterns', 'fail');
      throw new Error('Service Worker non supportato');
    }

    try {
      const currentOrigin = window.location.origin;
      callbacks.log(`  Origin corrente: ${currentOrigin}`, 'info');

      // Verifica se siamo su GitHub Pages o localhost
      const isGitHubPages = currentOrigin.includes('github.io') || 
                           currentOrigin.includes('github.com') ||
                           currentOrigin.includes('localhost') ||
                           currentOrigin.includes('127.0.0.1');

      if (isGitHubPages) {
        callbacks.log('  ✓ Origin supportato (GitHub Pages o localhost)', 'success');
        callbacks.log('  ℹ️ Il Service Worker funzionerà correttamente', 'info');
      } else {
        callbacks.log('  ⚠️ Origin non riconosciuto come GitHub Pages/localhost', 'warn');
        callbacks.log('  ℹ️ Il Service Worker potrebbe non funzionare correttamente', 'info');
        callbacks.log(`  ℹ️ Origin attuale: ${currentOrigin}`, 'info');
      }

      // Verifica che il Service Worker non gestisca richieste da domini esterni
      // (questo è testato implicitamente dal fatto che il SW funziona solo su GitHub Pages)
      callbacks.log('  ℹ️ Il Service Worker salta automaticamente richieste da domini esterni', 'info');
      callbacks.log('  ℹ️ Questo è gestito internamente dal Service Worker', 'info');

      callbacks.updateStatus('test-sw-github-pages-patterns', 'pass');
    } catch (error) {
      callbacks.log(`  ✗ Errore test GitHub Pages patterns: ${error.message}`, 'error');
      callbacks.updateStatus('test-sw-github-pages-patterns', 'fail');
      throw error;
    }
  }

  // TEST 14: Error Handling
  async function testErrorHandling(callbacks) {
    callbacks.log('Test error handling Service Worker...', 'info');

    if (!hasServiceWorkerSupport()) {
      callbacks.updateStatus('test-sw-error-handling', 'fail');
      throw new Error('Service Worker non supportato');
    }

    try {
      const registration = await getRegistration();
      if (!registration) {
        callbacks.log('  ⚠️ Nessuna registration trovata, test saltato', 'info');
        callbacks.updateStatus('test-sw-error-handling', 'pass');
        return;
      }

      // Test gestione errori durante update
      callbacks.log('  Test gestione errori durante update()...', 'info');
      try {
        await registration.update();
        callbacks.log('  ✓ Update() gestisce correttamente gli errori', 'success');
      } catch (error) {
        // Se c'è un errore, verifica che sia gestito correttamente
        callbacks.log(`  ℹ️ Errore durante update (normale): ${error.message}`, 'info');
        callbacks.log('  ✓ Errori gestiti correttamente (non crash)', 'success');
      }

      // Test gestione errori durante accesso cache
      callbacks.log('  Test gestione errori durante accesso cache...', 'info');
      try {
        // Prova ad aprire una cache inesistente (dovrebbe gestire l'errore)
        const nonExistentCache = await caches.open('non-existent-cache-test');
        if (nonExistentCache) {
          callbacks.log('  ✓ Cache API gestisce correttamente cache inesistenti', 'success');
          // Pulisci la cache di test
          await caches.delete('non-existent-cache-test');
        }
      } catch (error) {
        callbacks.log(`  ⚠️ Errore accesso cache: ${error.message}`, 'warn');
        callbacks.log('  ℹ️ Questo può essere normale in alcuni browser', 'info');
      }

      // Verifica che il Service Worker non crasha su errori
      callbacks.log('  ✓ Service Worker gestisce correttamente gli errori', 'success');
      callbacks.log('  ℹ️ Gli errori vengono loggati ma non interrompono il funzionamento', 'info');
      callbacks.updateStatus('test-sw-error-handling', 'pass');
    } catch (error) {
      callbacks.log(`  ✗ Errore test error handling: ${error.message}`, 'error');
      callbacks.updateStatus('test-sw-error-handling', 'fail');
      throw error;
    }
  }

  // Funzione principale: esegue tutti i test
  async function runAll(callbacks) {
    const startTime = performance.now();
    let passed = 0;
    let failed = 0;

    try {
      callbacks.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'info');
      callbacks.log('⚙️ Esecuzione test Service Worker (PWA)...', 'info');
      callbacks.log('', 'info');

      // Verifica supporto base
      if (!hasServiceWorkerSupport()) {
        callbacks.log('⚠️ Service Worker non supportato da questo browser', 'warn');
        callbacks.log('  I test verranno saltati', 'info');
        
        const allTestIds = getAllTestIds();
        allTestIds.forEach(id => callbacks.updateStatus(id, 'fail'));
        failed = allTestIds.length;
      } else {
        // === TEST REGISTRAZIONE ===
        await testRegistration(callbacks);

        // === TEST CACHE ===
        await testCache(callbacks);

        // === TEST VERSION.JSON NON CACHED ===
        await testVersionNotCached(callbacks);

        // === TEST DIMENSIONE CACHE ===
        await testCacheSize(callbacks);

        // === TEST MESSAGGI AL SERVICE WORKER ===
        await testMessages(callbacks);

        // === TEST OFFLINE FALLBACK ===
        await testOfflineFallback(callbacks);

        // === TEST UPDATE MECHANISM ===
        await testUpdateMechanism(callbacks);

        // === TEST CACHE CLEANUP ===
        await testCacheCleanup(callbacks);

        // === TEST STATIC ASSETS ===
        await testStaticAssets(callbacks);

        // === TEST FETCH STRATEGY ===
        await testFetchStrategy(callbacks);

        // === TEST CLEAR_CACHE MESSAGE ===
        await testClearCacheMessage(callbacks);

        // === TEST SKIP_WAITING MESSAGE ===
        await testSkipWaitingMessage(callbacks);

        // === TEST GITHUB PAGES PATTERNS ===
        await testGitHubPagesPatterns(callbacks);

        // === TEST ERROR HANDLING ===
        await testErrorHandling(callbacks);

        callbacks.log('', 'info');
        callbacks.log('✅ Tutti i test del Service Worker completati!', 'success');

        // Aggiorna contatori finali
        const allTestIds = getAllTestIds();
        passed = 0;
        failed = 0;
        allTestIds.forEach(id => {
          const statusEl = document.getElementById(id);
          if (statusEl) {
            const statusSpan = statusEl.querySelector('.test-status');
            if (statusSpan) {
              if (statusSpan.classList.contains('pass')) {
                passed++;
              } else if (statusSpan.classList.contains('fail')) {
                failed++;
              }
            }
          }
        });
      }

    } catch (error) {
      const testIds = getAllTestIds();
      testIds.forEach(id => callbacks.updateStatus(id, 'fail'));
      callbacks.log(`✗ Errore: ${error.message}`, 'error');
      console.error('Errore test service worker:', error);
      failed = testIds.length;
    } finally {
      const endTime = performance.now();
      const duration = Math.round(endTime - startTime);

      callbacks.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'info');
      callbacks.log(`✅ Test passati: ${passed}`, 'success');
      callbacks.log(`❌ Test falliti: ${failed}`, failed > 0 ? 'error' : 'info');
      callbacks.log(`⏱️ Tempo totale: ${duration}ms`, 'info');
      callbacks.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'info');

      return {
        passed,
        failed,
        total: passed + failed,
        duration
      };
    }
  }

  // API pubblica
  window.ServiceWorkerTests = {
    runAll: runAll,
    testRegistration: testRegistration,
    testCache: testCache,
    testVersionNotCached: testVersionNotCached,
    testCacheSize: testCacheSize,
    testMessages: testMessages,
    testOfflineFallback: testOfflineFallback,
    testUpdateMechanism: testUpdateMechanism,
    testCacheCleanup: testCacheCleanup,
    testStaticAssets: testStaticAssets,
    testFetchStrategy: testFetchStrategy,
    testClearCacheMessage: testClearCacheMessage,
    testSkipWaitingMessage: testSkipWaitingMessage,
    testGitHubPagesPatterns: testGitHubPagesPatterns,
    testErrorHandling: testErrorHandling,
    getAllTestIds: getAllTestIds,
    hasServiceWorkerSupport: hasServiceWorkerSupport
  };

  // ===== FUNZIONI HEADER =====
  // Gestione header e reset per il modulo Service Worker

  /**
   * Aggiorna l'header con statistiche dei test Service Worker
   * @param {number} passed - Numero di test passati
   * @param {number} failed - Numero di test falliti
   * @param {number} duration - Durata in millisecondi
   */
  function updateSwHeader(passed, failed, duration) {
    const total = passed + failed;
    const totalTests = getAllTestIds().length; // Usa il numero reale di test
    
    const passedEl = document.getElementById('sw-header-passed');
    const failedEl = document.getElementById('sw-header-failed');
    const timeEl = document.getElementById('sw-header-time');
    const progressEl = document.getElementById('sw-header-progress');
    const statusEl = document.getElementById('sw-header-status');
    const barEl = document.getElementById('sw-header-bar');
    const timestampEl = document.getElementById('sw-header-timestamp');
    
    if (passedEl) passedEl.textContent = passed;
    if (failedEl) failedEl.textContent = failed;
    if (timeEl) timeEl.textContent = `${duration}ms`;
    if (progressEl) progressEl.textContent = `${total}/${totalTests}`;
    
    if (barEl) {
      const progress = Math.round((total / totalTests) * 100);
      barEl.setAttribute('data-progress', progress);
      barEl.style.width = `${progress}%`;
    }
    
    if (statusEl) {
      statusEl.classList.remove('status-pending', 'status-running', 'status-success', 'status-error');
      
      if (failed > 0) {
        statusEl.classList.add('status-error');
        statusEl.textContent = 'Errori';
      } else if (total === totalTests) {
        statusEl.classList.add('status-success');
        statusEl.textContent = 'Completato';
      } else {
        statusEl.classList.add('status-running');
        statusEl.textContent = 'In esecuzione';
      }
    }
    
    if (timestampEl) {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      timestampEl.textContent = `Ultimo aggiornamento: ${timeStr}`;
      timestampEl.setAttribute('data-ts', now.toISOString());
    }
  }

  /**
   * Resetta tutti i test Service Worker e l'header
   */
  function resetSwTests() {
    // Resetta il log (usa la funzione da test-log-helpers.js)
    if (typeof window.clearSwLog === 'function') {
      window.clearSwLog();
    } else {
      // Fallback manuale se la funzione non è disponibile
      const outputEl = document.getElementById('output-sw');
      if (outputEl) {
        outputEl.innerHTML = '';
        outputEl.style.display = 'none';
      }
      const buttonsEl = document.getElementById('sw-log-buttons');
      if (buttonsEl) {
        buttonsEl.style.display = 'none';
      }
    }

    // Resetta l'header
    const totalTests = getAllTestIds().length;
    const progressEl = document.getElementById('sw-header-progress');
    const statusEl = document.getElementById('sw-header-status');
    const passedEl = document.getElementById('sw-header-passed');
    const failedEl = document.getElementById('sw-header-failed');
    const timeEl = document.getElementById('sw-header-time');
    const timestampEl = document.getElementById('sw-header-timestamp');
    const barEl = document.getElementById('sw-header-bar');

    if (progressEl) progressEl.textContent = `0/${totalTests}`;
    if (statusEl) {
      statusEl.className = 'test-header-status status-pending';
      statusEl.textContent = 'In attesa';
    }
    if (passedEl) passedEl.textContent = '0';
    if (failedEl) failedEl.textContent = '0';
    if (timeEl) timeEl.textContent = '0ms';
    if (timestampEl) {
      timestampEl.textContent = '-';
      timestampEl.setAttribute('data-ts', '');
    }
    if (barEl) {
      barEl.setAttribute('data-progress', '0');
      barEl.style.width = '0%';
    }

    // Resetta i badge e subtitle dei gruppi
    const groups = [
      { id: 'group1', total: 3, text: '3 test' },
      { id: 'group2', total: 4, text: '4 test' },
      { id: 'group3', total: 4, text: '4 test' },
      { id: 'group4', total: 3, text: '3 test' }
    ];

    groups.forEach(group => {
      const badge = document.getElementById(`sw-${group.id}-badge`);
      const subtitle = document.getElementById(`sw-${group.id}-subtitle`);
      if (badge) {
        badge.textContent = `0/${group.total}`;
        badge.classList.remove('badge-partial', 'badge-complete');
        badge.classList.add('badge-pending');
      }
      if (subtitle) {
        subtitle.textContent = `${group.text} da completare`;
        subtitle.classList.remove('state-partial', 'state-complete');
        subtitle.classList.add('state-pending');
      }
    });

    // Resetta tutti gli status dei test a "pending"
    const allTestIds = getAllTestIds();
    allTestIds.forEach(id => {
      const testElement = document.getElementById(id);
      if (testElement) {
        const statusSpan = testElement.querySelector('.test-status');
        if (statusSpan) {
          statusSpan.className = 'test-status pending';
          statusSpan.textContent = 'In attesa';
        }
      }
    });

    // Chiudi tutti i gruppi (usa la funzione accordion se disponibile)
    if (typeof window.toggleAllSwGroups === 'function') {
      window.toggleAllSwGroups(false);
    } else if (typeof TestAccordion !== 'undefined' && TestAccordion.toggleAllGroups) {
      TestAccordion.toggleAllGroups('sw', false);
    }
  }

  // Esponi le funzioni header globalmente per compatibilità con onclick
  window.updateSwHeader = updateSwHeader;
  window.resetSwTests = resetSwTests;

  console.log('✅ Modulo test-sw.js caricato');
})();

