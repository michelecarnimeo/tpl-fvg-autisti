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
 * Aggiorna la versione nel footer (chiamata da changelog.js se disponibile)
 * @param {string} version - Versione dell'app da usare
 */
function updateFooterVersion(version) {
  const footerElement = document.querySelector('.footer');
  if (!footerElement) {
    return;
  }

  // Trova il link "TPL Autisti" nel footer e aggiorna la versione
  const footerLink = footerElement.querySelector('a[href="test.html"]');
  if (footerLink) {
    footerLink.textContent = `TPL Autisti ${version}`;
  }
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

  let version = '1.6.5'; // Fallback default

  // Prova prima a leggere dal changelog (se già caricato)
  if (typeof changelogData !== 'undefined' && changelogData && changelogData.length > 0) {
    version = changelogData[0].version;
    console.log('✅ Versione letta dal changelog - v' + version);
  } else {
    // Altrimenti carica da version.json
    try {
      const response = await fetch('version.json');
      const versionData = await response.json();
      version = versionData.version || '1.6.0';
      console.log('✅ Versione letta da version.json - v' + version);
    } catch (error) {
      console.warn('⚠️ Impossibile caricare version.json, uso versione fallback');
    }
  }

  // Genera e inserisci il footer
  footerElement.innerHTML = generateFooterHTML(version);

  console.log('✅ Footer caricato correttamente - v' + version);
}

// Inizializza il footer quando il DOM è pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeFooter);
} else {
  // DOM già caricato
  initializeFooter();
}

