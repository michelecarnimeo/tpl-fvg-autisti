// ===== FEATURE: VERIFICA AGGIORNAMENTI =====
// Sistema di verifica aggiornamenti indipendente
// Usa l'API pubblica di changelog.js per ottenere la versione corrente

/**
 * Confronta due versioni semantiche (es: "1.3.4" > "1.3.3")
 * @param {string} v1 - Versione 1
 * @param {string} v2 - Versione 2
 * @returns {number} 1 se v1 > v2, -1 se v1 < v2, 0 se uguali
 */
function compareVersions(v1, v2) {
  const parts1 = v1.split('.').map(Number);
  const parts2 = v2.split('.').map(Number);

  for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
    const part1 = parts1[i] || 0;
    const part2 = parts2[i] || 0;

    if (part1 > part2) return 1;
    if (part1 < part2) return -1;
  }

  return 0; // Versioni uguali
}

/**
 * Verifica se ci sono aggiornamenti disponibili confrontando versione locale con remota
 * Usa solo API pubbliche di changelog.js (getChangelogVersion, getChangelogVersionString)
 */
async function checkForUpdates() {
  // Mostra il modal di verifica
  const modal = document.getElementById('cache-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalMessage = document.getElementById('modal-message');
  const modalWarning = document.getElementById('modal-warning');
  const confirmBtn = document.getElementById('cache-confirm');
  const cancelBtn = document.getElementById('cache-cancel');

  if (!modal) return;

  modal.style.display = 'block';
  modalTitle.innerHTML = '🔄 Verifica Aggiornamenti';
  modalMessage.innerHTML = '<p style="text-align: center;">⏳ Verifica aggiornamenti in corso...</p>';
  modalWarning.style.display = 'none';
  confirmBtn.style.display = 'none';
  if (cancelBtn) cancelBtn.textContent = 'Chiudi';

  try {
    // Aggiunge un timestamp per evitare la cache del browser
    const timestamp = new Date().getTime();
    const response = await fetch(`version.json?t=${timestamp}`, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });

    if (!response.ok) {
      throw new Error('Impossibile recuperare le informazioni sulla versione');
    }

    const remoteVersion = await response.json();

    // Leggi la versione corrente usando l'API pubblica di changelog.js
    const currentVersionData = typeof getChangelogVersion === 'function'
      ? getChangelogVersion()
      : null;
    const currentVersion = currentVersionData
      ? currentVersionData.version
      : (typeof getChangelogVersionString === 'function'
        ? getChangelogVersionString()
        : '1.6.0') || '1.6.0';
    const remoteVersionNum = remoteVersion.version;

    // Confronta le versioni
    const isUpdateAvailable = compareVersions(remoteVersionNum, currentVersion) > 0;
    const isDifferentVersion = remoteVersionNum !== currentVersion;

    if (isUpdateAvailable) {
      // C'è un aggiornamento disponibile
      modalTitle.innerHTML = '🎉 Aggiornamento Disponibile!';
      modalMessage.innerHTML = `
        <div style="text-align: center;">
          <div style="background: #dcfce7; border: 2px solid #22c55e; border-radius: 8px; padding: 1.25rem; margin-bottom: 1rem;">
            <p style="margin: 0 0 0.5rem 0; color: #15803d; font-weight: 600; font-size: 1.1em;">
              ✨ Nuova versione disponibile!
            </p>
            <p style="margin: 0; color: #166534; font-size: 0.95em;">
              Versione attuale: <strong>${currentVersion}</strong><br>
              Nuova versione: <strong style="color: #22c55e;">${remoteVersionNum}</strong>
            </p>
          </div>
          ${remoteVersion.updateNotes ? `
            <div style="background: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 1rem; margin-bottom: 1rem;">
              <p style="margin: 0 0 0.5rem 0; color: #0c4a6e; font-weight: 600; font-size: 0.9em;">
                📝 Novità:
              </p>
              <p style="margin: 0; color: #075985; font-size: 0.9em;">
                ${remoteVersion.updateNotes}
              </p>
            </div>
          ` : ''}
          <div style="background: #fef3c7; border: 2px solid #f59e0b; border-radius: 8px; padding: 1rem;">
            <p style="margin: 0; color: #92400e; font-size: 0.95em; line-height: 1.5;">
              ⚠️ Premendo "Aggiorna Ora", l'app si aggiornerà e riavvierà automaticamente.
            </p>
          </div>
        </div>
      `;
      confirmBtn.textContent = 'Aggiorna Ora';
      confirmBtn.style.display = 'block';
      modalWarning.style.display = 'none';

    } else if (isDifferentVersion) {
      // Versione diversa ma non più recente (downgrade o versione personalizzata)
      modalTitle.innerHTML = 'ℹ️ Versione Diversa Rilevata';
      modalMessage.innerHTML = `
        <div style="text-align: center;">
          <div style="background: #fff7ed; border: 2px solid #f97316; border-radius: 8px; padding: 1.25rem; margin-bottom: 1rem;">
            <p style="margin: 0 0 0.5rem 0; color: #9a3412; font-weight: 600;">
              Versione server: ${remoteVersionNum}
            </p>
            <p style="margin: 0; color: #9a3412;">
              Versione locale: ${currentVersion}
            </p>
          </div>
          <p style="color: #666; font-size: 0.9em;">
            Vuoi comunque riavviare l'app?
          </p>
        </div>
      `;
      confirmBtn.textContent = 'Riavvia App';
      confirmBtn.style.display = 'block';

    } else {
      // App già aggiornata
      modalTitle.innerHTML = '✅ App Aggiornata';
      modalMessage.innerHTML = `
        <div style="text-align: center;">
          <div style="background: #dcfce7; border: 2px solid #22c55e; border-radius: 8px; padding: 1.25rem; margin-bottom: 1rem;">
            <p style="margin: 0; color: #15803d; font-weight: 600; font-size: 1.1em;">
              ✨ Stai usando l'ultima versione!
            </p>
          </div>
          <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 1rem; margin-bottom: 1rem;">
            <p style="margin: 0 0 0.5rem 0; color: #374151; font-weight: 600; font-size: 0.95em;">
              Versione: <strong>${currentVersion}</strong>
            </p>
            <p style="margin: 0; color: #6b7280; font-size: 0.85em;">
              Pubblicata: ${currentVersionData ? (currentVersionData.date + (currentVersionData.time ? ' alle ' + currentVersionData.time : '')) : remoteVersion.versionDate + ' alle ' + remoteVersion.versionTime}
            </p>
          </div>
          <p style="color: #666; font-size: 0.9em; margin-top: 1rem;">
            Vuoi comunque riavviare l'app?
          </p>
        </div>
      `;
      confirmBtn.textContent = 'Riavvia App';
      confirmBtn.style.display = 'block';
    }

  } catch (error) {
    console.error('Errore verifica aggiornamenti:', error);

    // Errore nella verifica (probabilmente offline o problema di rete)
    modalTitle.innerHTML = '⚠️ Verifica non Disponibile';
    modalMessage.innerHTML = `
      <div style="text-align: center;">
        <div style="background: #fee2e2; border: 2px solid #ef4444; border-radius: 8px; padding: 1.25rem; margin-bottom: 1rem;">
          <p style="margin: 0 0 0.5rem 0; color: #991b1b; font-weight: 600;">
            ❌ Impossibile verificare gli aggiornamenti
          </p>
          <p style="margin: 0; color: #991b1b; font-size: 0.9em;">
            ${error.message || 'Errore di connessione'}
          </p>
        </div>
        <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 1rem; margin-bottom: 1rem;">
          <p style="margin: 0 0 0.5rem 0; color: #374151; font-weight: 600;">
            Versione locale: ${typeof getChangelogVersionString === 'function' ? getChangelogVersionString() || 'N/A' : 'N/A'}
          </p>
          <p style="margin: 0; color: #6b7280; font-size: 0.85em;">
            ${(() => {
        const v = typeof getChangelogVersion === 'function' ? getChangelogVersion() : null;
        return v ? (v.date + (v.time ? ' alle ' + v.time : '')) : 'Data non disponibile';
      })()}
          </p>
        </div>
        <p style="color: #666; font-size: 0.9em;">
          Verifica la connessione internet e riprova.<br>
          Puoi comunque riavviare l'app se necessario.
        </p>
      </div>
    `;
    confirmBtn.textContent = 'Riavvia App';
    confirmBtn.style.display = 'block';
  }
}

/**
 * Apre il modal di verifica aggiornamenti
 */
function resetCache() {
  checkForUpdates();
}

/**
 * Conferma il reset della cache e aggiornamento dell'app
 */
async function confirmResetCache() {
  console.log('🔄 Inizio reset cache e riavvio app...');
  
  try {
    // Cancella la cache del Service Worker
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (let registration of registrations) {
        await registration.unregister();
        console.log('✅ Service Worker disregistrato');
      }
    }

    // Cancella la cache del browser
    if ('caches' in window) {
      const names = await caches.keys();
      await Promise.all(names.map(name => caches.delete(name)));
      console.log('✅ Cache cancellata');
    }

    // Cancella il LocalStorage
    try {
      localStorage.clear();
      console.log('✅ LocalStorage cancellato');
    } catch (error) {
      console.warn('⚠️ Errore nel cancellare LocalStorage:', error);
    }

    // Determina la destinazione in base alla pagina corrente
    const currentPage = window.location.pathname.split('/').pop() || window.location.href;
    const isTestPage = currentPage.includes('test.html');
    
    console.log('🔄 Riavvio app...', { currentPage, isTestPage });
    
    // Se siamo su test.html, ricarica la pagina invece di andare a benvenuto.html
    if (isTestPage) {
      setTimeout(() => {
        window.location.reload();
      }, 300);
    } else {
      // Altrimenti vai a benvenuto.html
      setTimeout(() => {
        window.location.href = 'benvenuto.html';
      }, 300);
    }
  } catch (error) {
    console.error('❌ Errore durante il reset cache:', error);
    // Fallback: riavvia comunque la pagina
    setTimeout(() => {
      const isTestPage = window.location.pathname.includes('test.html');
      if (isTestPage) {
        window.location.reload();
      } else {
        window.location.href = 'benvenuto.html';
      }
    }, 300);
  }
}

/**
 * Annulla il reset della cache e chiude il modal
 */
function cancelResetCache() {
  const modal = document.getElementById('cache-modal');
  if (modal) {
    modal.style.display = 'none';
  }
}

// ===== ESPORTAZIONE PUBBLICA =====
// Espone le funzioni necessarie per essere chiamate da altri moduli o da script.js
window.Updates = {
  checkForUpdates: checkForUpdates,
  resetCache: resetCache,
  confirmResetCache: confirmResetCache,
  cancelResetCache: cancelResetCache
};

