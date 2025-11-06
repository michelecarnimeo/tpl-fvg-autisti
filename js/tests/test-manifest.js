/**
 * Test Manifest PWA
 * Test per la validazione del manifest.json e delle icone PWA
 */

(function () {
  'use strict';

  // Lista completa di tutti i test IDs
  function getAllTestIds() {
    return [
      'test-manifest-load',
      'test-manifest-icons'
    ];
  }

  // Test 1: Caricamento manifest.webmanifest
  async function testManifestLoad(callbacks) {
    callbacks.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'info');
    callbacks.log('📱 Test: Caricamento manifest.webmanifest', 'info');
    callbacks.log('', 'info');

    try {
      callbacks.log('Caricamento manifest.webmanifest...', 'info');
      
      const response = await fetch('manifest.webmanifest');
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const manifest = await response.json();
      callbacks.log('✓ manifest.webmanifest caricato con successo', 'success');

      // Verifica campi obbligatori
      const requiredFields = ['name', 'short_name', 'start_url', 'display', 'icons'];
      const missingFields = [];

      requiredFields.forEach(field => {
        if (!manifest[field]) {
          missingFields.push(field);
        }
      });

      if (missingFields.length > 0) {
        throw new Error(`Campi obbligatori mancanti: ${missingFields.join(', ')}`);
      }

      callbacks.log('✓ Tutti i campi obbligatori presenti', 'success');

      // Verifica valori specifici
      if (manifest.name) {
        callbacks.log(`✓ Nome app: "${manifest.name}"`, 'success');
      }
      if (manifest.short_name) {
        callbacks.log(`✓ Nome breve: "${manifest.short_name}"`, 'success');
      }
      if (manifest.start_url) {
        callbacks.log(`✓ Start URL: "${manifest.start_url}"`, 'success');
      }
      if (manifest.display) {
        callbacks.log(`✓ Display mode: "${manifest.display}"`, 'success');
      }

      // Verifica che ci siano icone
      if (!Array.isArray(manifest.icons) || manifest.icons.length === 0) {
        throw new Error('Nessuna icona definita nel manifest');
      }

      callbacks.log(`✓ ${manifest.icons.length} icona/e definita/e`, 'success');

      callbacks.updateStatus('test-manifest-load', 'pass');
      callbacks.log('✅ Test caricamento manifest PASSATO', 'success');

      return manifest;

    } catch (error) {
      callbacks.updateStatus('test-manifest-load', 'fail');
      callbacks.log(`✗ Test fallito: ${error.message}`, 'error');
      console.error('Errore test manifest load:', error);
      throw error;
    }
  }

  // Test 2: Validazione icone
  async function testManifestIcons(callbacks) {
    callbacks.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'info');
    callbacks.log('🖼️ Test: Validazione icone', 'info');
    callbacks.log('', 'info');

    try {
      // Carica manifest
      const response = await fetch('manifest.webmanifest');
      if (!response.ok) {
        throw new Error(`Impossibile caricare manifest.webmanifest: HTTP ${response.status}`);
      }

      const manifest = await response.json();

      if (!manifest.icons || !Array.isArray(manifest.icons) || manifest.icons.length === 0) {
        throw new Error('Nessuna icona definita nel manifest');
      }

      callbacks.log(`Verifica ${manifest.icons.length} icona/e...`, 'info');

      let validIcons = 0;
      let invalidIcons = 0;

      for (const icon of manifest.icons) {
        if (!icon.src) {
          callbacks.log(`✗ Icona senza campo "src"`, 'error');
          invalidIcons++;
          continue;
        }

        if (!icon.sizes) {
          callbacks.log(`⚠️ Icona "${icon.src}" senza campo "sizes"`, 'warn');
        }

        if (!icon.type) {
          callbacks.log(`⚠️ Icona "${icon.src}" senza campo "type"`, 'warn');
        }

        // Verifica che l'icona esista
        try {
          const iconResponse = await fetch(icon.src, { method: 'HEAD' });
          
          if (iconResponse.ok) {
            callbacks.log(`✓ Icona "${icon.src}" trovata (${icon.sizes || 'N/A'})`, 'success');
            validIcons++;
          } else {
            callbacks.log(`✗ Icona "${icon.src}" non trovata (HTTP ${iconResponse.status})`, 'error');
            invalidIcons++;
          }
        } catch (fetchError) {
          callbacks.log(`✗ Errore verifica icona "${icon.src}": ${fetchError.message}`, 'error');
          invalidIcons++;
        }
      }

      if (invalidIcons > 0) {
        throw new Error(`${invalidIcons} icona/e non valida/e su ${manifest.icons.length}`);
      }

      callbacks.log(`✓ Tutte le ${validIcons} icone sono valide`, 'success');

      callbacks.updateStatus('test-manifest-icons', 'pass');
      callbacks.log('✅ Test validazione icone PASSATO', 'success');

    } catch (error) {
      callbacks.updateStatus('test-manifest-icons', 'fail');
      callbacks.log(`✗ Test fallito: ${error.message}`, 'error');
      console.error('Errore test manifest icons:', error);
    }
  }

  // Esegue tutti i test
  async function runAll(callbacks) {
    const startTime = performance.now();
    let passed = 0;
    let failed = 0;

    try {
      callbacks.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'info');
      callbacks.log('📱 Esecuzione test Manifest PWA...', 'info');
      callbacks.log('', 'info');

      // Esegui test caricamento (necessario per test icone)
      await testManifestLoad(callbacks);
      await testManifestIcons(callbacks);

      callbacks.log('', 'info');
      callbacks.log('✅ Tutti i test del Manifest completati!', 'success');

      // Conta risultati
      const allTestIds = getAllTestIds();
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

    } catch (error) {
      const testIds = getAllTestIds();
      testIds.forEach(id => callbacks.updateStatus(id, 'fail'));
      callbacks.log(`✗ Errore: ${error.message}`, 'error');
      console.error('Errore test manifest:', error);
      failed = testIds.length;
    } finally {
      const endTime = performance.now();
      const duration = Math.round(endTime - startTime);

      callbacks.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'info');
      callbacks.log(`✅ Test passati: ${passed}`, 'success');
      callbacks.log(`❌ Test falliti: ${failed}`, failed > 0 ? 'error' : 'info');
      callbacks.log(`⏱️ Tempo totale: ${duration}ms`, 'info');
      callbacks.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'info');

      return { passed, failed, total: passed + failed, duration };
    }
  }

  // API pubblica
  window.ManifestTests = {
    runAll: runAll,
    testManifestLoad: testManifestLoad,
    testManifestIcons: testManifestIcons,
    getAllTestIds: getAllTestIds
  };

  console.log('✅ Modulo test-manifest.js caricato');
})();

