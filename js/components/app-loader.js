/**
 * ========================================
 * APP LOADER / SPLASH SCREEN
 * Gestione loader iniziale dell'applicazione
 * ========================================
 * 
 * Mostra un loader durante il caricamento iniziale dell'app
 * e lo nasconde quando tutto è pronto.
 * 
 * @version 1.0.0
 * @date 2025-11-19
 */

(function() {
  'use strict';

  // ===== STATO =====
  let loader = null;
  let isReady = false;
  let minDisplayTime = 800; // Tempo minimo di visualizzazione (ms)
  let startTime = Date.now();
  let progressInterval = null;
  let currentProgress = 0;
  const MAX_SIMULATED_PROGRESS = 85;

  // ===== INIZIALIZZAZIONE =====
  
  /**
   * Inizializza il loader
   */
  function init() {
    createLoader();
    startTime = Date.now();
    startProgressSimulation();
    
    // Aspetta che il DOM sia pronto
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', checkReady);
    } else {
      // DOM già pronto, aspetta un po' per i moduli
      setTimeout(checkReady, 100);
    }
    
    // Fallback: nascondi dopo max 3 secondi
    setTimeout(() => {
      if (!isReady) {
        console.warn('⚠️ Loader: timeout, nascondo comunque');
        hide();
      }
    }, 3000);
  }

  /**
   * Crea il loader HTML
   */
  function createLoader() {
    // Verifica se esiste già
    if (document.getElementById('app-loader')) {
      loader = document.getElementById('app-loader');
      return;
    }

    const loaderHTML = `
      <div id="app-loader" class="app-loader">
        <div class="app-loader-logo">
          <img src="src/logo.png" alt="TPL FVG" onerror="this.style.display='none'; this.parentElement.querySelector('::before').style.display='block';">
        </div>
        <div class="app-loader-text">Caricamento in corso...</div>
        <div class="app-loader-progress" id="app-loader-progress">
          <div class="app-loader-progress-bar" id="app-loader-progress-bar"></div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('afterbegin', loaderHTML);
    loader = document.getElementById('app-loader');
  }

  /**
   * Verifica se l'app è pronta
   */
  function checkReady() {
    // Verifica che il DOM sia pronto
    if (document.readyState !== 'complete') {
      setTimeout(checkReady, 50);
      return;
    }

    // Verifica che i moduli essenziali siano caricati (con fallback)
    const essentialModules = [
      typeof window.Storage !== 'undefined' || typeof Storage !== 'undefined',
      document.body !== null,
      document.querySelector('.main-content, .main-card, .container') !== null
    ];

    const allReady = essentialModules.every(ready => ready === true);

    if (allReady) {
      // Aspetta il tempo minimo di visualizzazione
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, minDisplayTime - elapsed);

      setTimeout(() => {
        hide();
      }, remaining);
    } else {
      // Riprova dopo un po' (max 10 tentativi)
      const attempts = checkReady.attempts || 0;
      if (attempts < 10) {
        checkReady.attempts = attempts + 1;
        setTimeout(checkReady, 100);
      } else {
        // Timeout: nascondi comunque
        console.warn('⚠️ Loader: alcuni moduli non pronti, nascondo comunque');
        hide();
      }
    }
  }

  /**
   * Nasconde il loader
   */
  function hide() {
    if (!loader) return;
    
    isReady = true;
    stopProgressSimulation();
    
    // Porta la progress bar al 100% e aspetta che finisca l'animazione
    showProgress(100);
    
    // Aspetta che la transizione CSS della progress bar finisca (circa 400ms)
    // poi nascondi il loader
    setTimeout(() => {
      if (!loader) return;
      loader.classList.add('hidden');
      
      // Rimuovi dal DOM dopo l'animazione di fade out
      setTimeout(() => {
        if (loader && loader.parentNode) {
          loader.remove();
          loader = null;
        }
      }, 500);
      
      console.log('✅ App loader nascosto');
    }, 400); // Tempo per completare l'animazione della progress bar al 100%
  }

  /**
   * Mostra progresso (opzionale)
   */
  function showProgress(percent) {
    if (!loader) return;
    
    const progressBar = document.getElementById('app-loader-progress-bar');
    const progressContainer = document.getElementById('app-loader-progress');
    
    if (progressBar && progressContainer) {
      progressContainer.classList.add('active');
      progressBar.style.width = Math.min(100, Math.max(0, percent)) + '%';
    }
  }

  /**
   * Nasconde il progresso
   */
  function hideProgress() {
    const progressContainer = document.getElementById('app-loader-progress');
    if (progressContainer) {
      progressContainer.classList.remove('active');
    }
  }

  /**
   * Simula l'avanzamento finché l'app non è pronta
   */
  function startProgressSimulation() {
    stopProgressSimulation();
    currentProgress = 0;
    showProgress(5);
    progressInterval = setInterval(() => {
      if (isReady) {
        stopProgressSimulation();
        return;
      }
      const increment = Math.random() * 8 + 2; // 2-10%
      currentProgress = Math.min(MAX_SIMULATED_PROGRESS, currentProgress + increment);
      showProgress(currentProgress);
      if (currentProgress >= MAX_SIMULATED_PROGRESS) {
        stopProgressSimulation();
      }
    }, 350);
  }

  function stopProgressSimulation() {
    if (progressInterval) {
      clearInterval(progressInterval);
      progressInterval = null;
    }
  }

  // ===== API PUBBLICA =====
  
  window.AppLoader = {
    init,
    hide,
    showProgress,
    hideProgress
  };

  // Auto-inizializza
  init();

  console.log('✅ App Loader inizializzato');

})();

