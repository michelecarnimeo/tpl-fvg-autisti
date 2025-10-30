// ===== FOOTER DINAMICO =====
// Sistema modulare per gestire il footer su tutte le pagine
// Un solo file da modificare invece di 5 HTML separati

/**
 * Genera l'HTML del footer dell'applicazione
 * @param {string} version - Versione dell'app (es. "1.5.5")
 * @returns {string} HTML del footer
 */
function generateFooterHTML(version) {
  const currentYear = new Date().getFullYear();
  
  return `
    <p>© <span id="footer-year">${currentYear}</span> Michele Carnimeo. Tutti i diritti riservati.<br>TPL FVG è un marchio di TPL FVG S.C. a R.L. · <a href="test.html" style="color: inherit; text-decoration: none; transition: text-decoration 0.3s ease;" onmouseover="this.style.textDecoration='underline'" onmouseout="this.style.textDecoration='none'">TPL Autisti ${version}</a></p>
    <div class="footer-links" style="display: flex; flex-wrap: wrap; gap: 0.75rem; justify-content: center;">
      <a href="https://t.me/+eoJ9nYFFrjphMzVk" target="_blank" class="telegram-link" title="Canale Telegram">
        <span class="telegram-icon">📢</span> Avvisi & Aggiornamenti
      </a>
      <a href="https://t.me/+2yIF2NfPYt82MWI0" target="_blank" class="telegram-link" title="Gruppo Telegram">
        <span class="telegram-icon">🐛</span> Segnala Errori
      </a>
    </div>
  `;
}

/**
 * Inizializza il footer caricando la versione e inserendo l'HTML
 */
async function initializeFooter() {
  const footerElement = document.querySelector('.footer');
  if (!footerElement) {
    console.warn('Footer element non trovato');
    return;
  }
  
  try {
    // Carica la versione dal file version.json
    const response = await fetch('version.json');
    const versionData = await response.json();
    const version = versionData.version || '1.5.5';
    
    // Genera e inserisci il footer
    footerElement.innerHTML = generateFooterHTML(version);
    
    console.log('✅ Footer caricato correttamente - v' + version);
  } catch (error) {
    console.error('Errore caricamento footer:', error);
    
    // Fallback: usa versione di default se il caricamento fallisce
    const fallbackVersion = '1.5.5';
    footerElement.innerHTML = generateFooterHTML(fallbackVersion);
    console.log('⚠️ Footer caricato con versione fallback - v' + fallbackVersion);
  }
}

// Inizializza il footer quando il DOM è pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeFooter);
} else {
  // DOM già caricato
  initializeFooter();
}

