// ===== PAGINA: BENVENUTO =====
// Logica specifica per la pagina di benvenuto
// Gestisce il pulsante "Inizia" e altre funzionalità specifiche

(function() {
  'use strict';

  /**
   * Inizializza la pagina benvenuto
   */
  function init() {
    // Pulsante "Inizia"
    const startBtn = document.getElementById('start-btn');
    if (startBtn) {
      startBtn.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('Pulsante Inizia cliccato!');
        window.location.href = 'index.html';
      });
    } else {
      console.error('Pulsante start-btn non trovato!');
    }
    
    // Il pulsante Impostazioni è gestito da script.js
    // che cerca automaticamente #open-settings
    
    // NOTA: L'anno nel footer è già gestito da footer.js
    // Non serve aggiornarlo manualmente qui
  }

  // Esegui quando il DOM è pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    // DOM già caricato
    init();
  }

})();

