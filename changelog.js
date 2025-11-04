// ===== CHANGELOG DATA =====
// Array di oggetti con tutti gli aggiornamenti
// Ordinati dal più recente al più vecchio

const changelogData = [
  {
    version: '1.6.2',
    date: '4 Novembre 2025',
    time: '23:45',
    title: 'Modularizzazione CSS Test e Rimozione Stili Inline',
    hidden: false,
    changes: [
      '📦 Struttura CSS Modulare Test:',
      '  • css/components/tests/header.css - Header sticky, colori moduli, thin mode, mobile',
      '  • css/components/tests/groups.css - Card gruppi, dark mode, stati badge/subtitle',
      '  • css/components/tests/test-animations.css - Animazioni test',
      '🗑️ Rimozione Stili Inline:',
      '  • Rimossi ~130 righe di stili inline da test.html',
      '  • Sostituiti con classi semantiche (test-header-left, test-header-right, ecc.)',
      '  • HTML più leggero e leggibile (-75 righe)',
      '🔧 JavaScript Ottimizzato:',
      '  • js/tests/test-database.js usa classList invece di .style',
      '  • Funzioni reset aggiornate per usare classi CSS',
      '✨ Benefici:',
      '  • CSS centralizzato e manutenibile',
      '  • Scalabile per nuovi test (template pronti)',
      '  • Consistenza visiva garantita',
      '  • Performance migliorata (CSS cacheable)'
    ]
  },
  {
    version: '1.6.1',
    date: '4 Novembre 2025',
    time: '16:30',
    title: 'UI Test Migliorata: Header Sticky + Controlli Avanzati',
    hidden: false,
    changes: [
      '🎨 Header Sticky Test:',
      '  • Implementati header sticky per ogni modulo test',
      '  • Animazione thin mode con hysteresis (shrink/expand)',
      '  • Header si riducono automaticamente durante lo scroll',
      '  • Sistema di colori per modulo (database, prezzi, ecc.)',
      '🔧 Controlli Avanzati:',
      '  • Progress bar animata con data-progress',
      '  • Timestamp relativi per ogni test',
      '  • Gestione stato hiding per header sovrapposti',
      '📦 Nuovo Modulo:',
      '  • js/features/tests-ui.js - Gestione comportamento header sticky',
      '✨ Miglioramenti UX:',
      '  • Header sempre visibili durante scroll',
      '  • Transizioni fluide e performanti',
      '  • Indicatori visivi chiari per ogni modulo test'
    ]
  },
  {
    version: '1.6.0',
    date: '2 Novembre 2025',
    time: '20:30',
    title: 'Modularizzazione Prezzi + Test Suite Completa',
    hidden: false,
    changes: [
      '📦 Nuovi Moduli JavaScript:',
      '  • js/features/prezzi.js - Calcolo prezzi biglietti (logica pura, zero dipendenze DOM)',
      '  • js/tests/test-prezzi.js - Suite completa con 26 test automatici',
      '  • js/tests/test-utils.js - Utility per logging e gestione test',
      '🔧 Miglioramenti Modulo Prezzi:',
      '  • Modularizzato modulo prezzi: estratto prezzi.js con API pubblica',
      '  • Creata suite test prezzi.js (26 test) con test-utils.js condiviso',
      '  • Risolti test falliti: isValidSelection hardened, gestione matrici mancanti',
      '  • Cache-busting su prezzi.js per forzare reload post-fix',
      '  • Calcolo prezzi ora usa logica modulare e testabile (tutti passati ✅)',
      '🧭 UX Test Page:',
      '  • Aggiunto indice rapido con smooth scroll e sticky current section indicator',
      '  • Sticky card sotto navbar mostra sezione corrente durante scroll',
      '  • Migliorata tipografia sezione prezzi: scala gradualmente come home',
      '  • Layout mobile ottimizzato: card flatte, bordi sottili, hover disabilitati',
      '  • Miglioramenti sezione Info Device & Browser',
      '📚 Documentazione:',
      '  • Aggiornata architettura CSS e JS documentazione',
      '  • Creati documenti analisi per future modularizzazioni',
      '⚡ Ottimizzazioni:',
      '  • Service Worker aggiornato per cache nuovi moduli',
      '  • Zero dipendenze DOM nel modulo prezzi (logica pura)',
      '  • Moduli totalmente testabili in isolamento'
    ]
  },
  {
    version: '1.5.9',
    date: '1 Novembre 2025',
    time: '18:00',
    title: 'Modularizzazione CSS Settings Completa',
    hidden: false,
    changes: [
      '📦 Creato css/components/settings/impostazioni.css (struttura modale: overlay, header, tabs)',
      '📦 Creato css/components/settings/accessibilita.css (tab Accessibilità: font, scale, toggle)',
      '📦 Creato css/components/settings/aspetto.css (tab Aspetto: theme options)',
      '📦 Creato css/components/settings/info.css (tab Info: info cards, update check, changelog)',
      '🗑️ Rimossi tutti gli stili Settings UI da style1.css e modals.css',
      '✨ Struttura CSS allineata all\'UI: ogni tab ha il suo file dedicato',
      '📚 Aggiornato CSS_ARCHITECTURE.md con tutti i file settings completati',
      '🔧 Aggiornato sw.js con i nuovi file CSS per cache offline',
      '✅ Testing completo: tutte le tab Settings funzionanti correttamente',
      '🎯 Zero duplicazioni: stili UI completamente estratti e organizzati',
      '⚡ Cache PWA ottimizzata: tutti i file settings inclusi nel service worker'
    ]
  },
  {
    version: '1.5.8',
    date: '31 Ottobre 2025',
    time: '12:00',
    title: 'Modularizzazione Modals CSS + Ottimizzazioni Test Page',
    hidden: false,
    changes: [
      '📦 Creato css/components/modals.css con tutti gli stili dei modali',
      '🗑️ Rimossa sezione "Ottimizzazione Display" dalle impostazioni (non necessaria)',
      '🔧 Rilevamento display spostato in test.html con card migliorate',
      '🚀 Rimosso speed test non affidabile, sostituito con monitoraggio connessione semplice',
      '✨ Card "Stato Connessione" con pulsanti Verifica/Reset e data test',
      '📐 Viewport spostato nella sezione "Rilevamento Display"',
      '🎨 Card dettagli tecnici unificate con le altre (Touch Support, PWA Mode)',
      '📋 Changelog ottimizzato: mostra solo ultima versione con pulsante "Vedi tutti"',
      '🎨 Card GPS e Batteria cambiano colore dinamicamente in base allo stato',
      '📱 Miglioramenti layout mobile: risolti problemi sovrapposizione pulsanti',
      '🔄 Listener PWA Mode per aggiornamento automatico installazione/disinstallazione',
      '✨ Versione "TPL FVG Autisti" aggiornata automaticamente da changelog.js (un solo file da modificare)'
    ]
  },
  {
    version: '1.5.7',
    date: '30 Ottobre 2025',
    title: 'Modularizzazione CSS Animazioni e Transizioni',
    hidden: false,
    changes: [
      '📦 Creato css/animations.css con tutti i @keyframes estratti da style1.css',
      '📦 Creato css/variables.css (vuoto, pronto per popolamento graduale)',
      '🗑️ Rimossi tutti i @keyframes duplicati da style1.css',
      '✨ Creati utility classes per animazioni (.fade-in, .pulse, .rotate, ecc.)',
      '✨ Creati utility classes per transizioni (.transition-all, .transition-transform, ecc.)',
      '🔧 Rimossi duplicati in animations.css (SEZIONE 2 vs SEZIONE 5 unificate)',
      '✅ Sostituite 3 animazioni inline con utility classes (.fade-in, .rotate-slow, .pulse)',
      '📚 Aggiornato CSS_ARCHITECTURE.md con documentazione completa stato animazioni',
      '📚 Creato JS_ARCHITECTURE.md per architettura JavaScript modulare',
      '🎨 Animazioni modulari: tutti i keyframes centralizzati e riutilizzabili'
    ]
  },
  {
    version: '1.5.6',
    date: '30 Ottobre 2025',
    title: 'Fix Dimensione Interfaccia + Footer Modulare',
    hidden: false,
    changes: [
      '🔧 Fix: Ripristinata funzionalità "Dimensione Interfaccia" in Accessibilità',
      '✅ Implementati event listener e logica mancante per scala interfaccia (75%-125%)',
      '📦 Footer modulare: HTML dinamico (footer.js) + CSS componente (css/components/footer.css)',
      '📚 Documentazione architettura CSS (CSS_ARCHITECTURE.md) per future modularizzazioni',
      '🎨 Footer centralizzato: modifica una volta, aggiorna ovunque (5 pagine)',
      '💾 Service Worker aggiornato con nuovi asset modulari'
    ]
  },
  {
    version: '1.5.5',
    date: '28 Ottobre 2025',
    title: 'Sistema Changelog Dinamico',
    hidden: false, // Le prime versioni visibili di default
    changes: [
      '📦 Sistema changelog centralizzato e dinamico',
      '🔧 Un solo file (changelog.js) gestisce tutti gli aggiornamenti',
      '⚡ Manutenzione semplificata: modifica 1 file invece di 5',
      '✨ Coerenza garantita su tutte le pagine (index, fermate, prezzi, test, benvenuto)',
      '🗂️ Struttura dati organizzata con versioni visibili/nascoste'
    ]
  },
  {
    version: '1.5.4',
    date: '27 Ottobre 2025',
    title: 'Preset Schermi Piccoli + Layout Compatto',
    hidden: false, // Le prime versioni visibili di default
    changes: [
      '📱 Preset universale schermi piccoli (iPhone SE/12 Mini, Galaxy S, Pixel)',
      '📐 Layout Compatto: riduce spazi per +30% contenuto visibile',
      '🎯 Complementare a Scala Interfaccia (usabili insieme)',
      '🔧 Ottimizzati modali, PWA nav e liste per schermi compatti'
    ]
  },
  {
    version: '1.5.3',
    date: '27 Ottobre 2025',
    title: 'Spaziatura Extra + Modali Responsive',
    hidden: false,
    changes: [
      '📏 Spaziatura extra: pulsanti e contenuti più grandi (+40% padding)',
      '📱 Modali ottimizzati per iPhone 12 Mini e schermi compatti',
      '🎯 Media queries universali per dispositivi piccoli',
      '🐛 Risolto: modali tagliati su schermi sotto 400px o 700px altezza'
    ]
  },
  {
    version: '1.5.2',
    date: '27 Ottobre 2025',
    title: 'Keep Screen On & Bugfix Card Prezzo',
    hidden: false,
    changes: [
      '☀️ Nuova: "Schermo sempre attivo" - impedisce spegnimento automatico (Accessibilità)',
      '🔋 Wake Lock API nativa - si disattiva automaticamente in background',
      '🐛 Risolto: card prezzo opaca anche quando attiva (testo ora leggibile al 100%)',
      '🐛 Risolto: "Riparti da capo" non disattivava la card prezzo',
      '🐛 Risolto: errore CSS in test.html (#gray non valido)',
      '⚡ Ottimizzata gestione stato card prezzo (chiamate dirette in selectFermata/selectLinea)'
    ]
  },
  {
    version: '1.5.1',
    date: '27 Ottobre 2025',
    title: 'Bugfix & Riduci Animazioni',
    hidden: false,
    changes: [
      '🐛 Risolto: crash JavaScript su pagine senza toggle dark mode',
      '🐛 Risolto: "Riparti da capo" non resettava codice e prezzo biglietto',
      '🐛 Risolto: vibrazione feedback aptico non funzionava al primo clic',
      '⚡ Nuova: "Riduci animazioni" - disabilita transizioni ed effetti visivi',
      '📂 Riorganizzate impostazioni: "Aspetto" vs "Accessibilità" più chiare',
      '🗑️ Rimossi filtri daltonismo (non pertinenti per uso professionale)'
    ]
  },
  {
    version: '1.5.0',
    date: '27 Ottobre 2025',
    title: 'Feedback Aptico & UI Ottimizzata',
    hidden: false,
    changes: [
      '📳 Feedback aptico (vibrazione) su azioni e conferme',
      '⚡ 6 pattern di vibrazione predefiniti (light, medium, strong, success, warning, error)',
      '🎚️ Toggle attivazione/disattivazione in Accessibilità',
      '✨ Vibrazione su: cambio tema, font, contrasto, touch-friendly',
      '🧹 Rimossi titoli ridondanti dalle impostazioni (più spazio visibile)',
      '📱 Ottimizzato per dispositivi mobile (solo HTTPS/localhost)'
    ]
  },
  {
    version: '1.4.9',
    date: '25 Ottobre 2025',
    title: 'Info Device & Test GPS Avanzati',
    hidden: false,
    changes: [
      '📱 Sezione "Info Device/Browser" con rilevamento hardware',
      '🎨 Layout responsive: card colorate su desktop, lista su mobile',
      '⚡ Test Rapido GPS One-Click con report automatico',
      '📄 Export Report completo (JSON + TXT)',
      '🔄 Modal moderno per Reset dati GPS',
      '🔋 Monitoraggio batteria e connessione in tempo reale'
    ]
  },
  {
    version: '1.4.8',
    date: '25 Ottobre 2025',
    title: 'Simulazione Posizione GPS Fake',
    hidden: true,
    changes: [
      '🎭 Modalità test con posizione GPS simulata',
      'Preset città FVG: Trieste, Udine, Pordenone, Gorizia',
      'Input manuale coordinate personalizzate (lat/lng)',
      'Configurazione accuratezza e altitudine',
      'Badge visivo GPS reale vs simulato',
      'Integrazione completa con mappa e calcolo distanza'
    ]
  },
  {
    version: '1.4.7',
    date: '25 Ottobre 2025',
    title: 'Mappa Interattiva e Banner HTTPS',
    hidden: true,
    changes: [
      'Mappa interattiva con Leaflet.js (~40KB, tile OpenStreetMap)',
      'Marker blu posizione attuale con popup coordinate',
      'Cerchio accuratezza GPS con raggio dinamico',
      'Zoom automatico intelligente e pulsante "Centra"',
      'Banner HTTPS dinamico (visibile solo se necessario)',
      'Controlli interattivi: drag, zoom, popup click'
    ]
  },
  {
    version: '1.4.6',
    date: '25 Ottobre 2025',
    title: 'Calcolo Distanza GPS',
    hidden: true,
    changes: [
      'Preset città FVG: Trieste, Udine, Pordenone, Gorizia',
      'Input coordinate personalizzate per punti specifici',
      'Formula Haversine per distanza in linea d\'aria (km)',
      'Tempi stimati: a piedi (5km/h), bus (30km/h), auto (50km/h)',
      'Formattazione intelligente tempi (15min o 1h 25min)'
    ]
  },
  {
    version: '1.4.5',
    date: '25 Ottobre 2025',
    title: 'Miglioramenti Test Geolocalizzazione',
    hidden: true,
    changes: [
      'Status permessi geolocalizzazione in tempo reale (granted/denied/prompt)',
      'Pulsante "Copia Coordinate" per copiare lat/long negli appunti',
      'Reverse geocoding: mostra indirizzo testuale (via, città, CAP)',
      'Velocità e direzione (se disponibili durante movimento)',
      'Altitudine con margine errore (±m)'
    ]
  },
  {
    version: '1.4.4',
    date: '25 Ottobre 2025',
    title: 'Banner Offline e Simulazione Connettività',
    hidden: true,
    changes: [
      'Aggiunto banner notifica offline/online in alto con design glassmorphism',
      'Animazione icona pulsante e transizione slide-down',
      'Banner verde "Connessione ripristinata" quando torna online',
      'Simulazione modalità offline persistente su test.html',
      'Sincronizzazione cross-tab della modalità offline test'
    ]
  },
  {
    version: '1.4.3',
    date: '24 Ottobre 2025',
    title: 'Verifica Aggiornamenti PWA e Miglioramenti UI',
    hidden: true,
    changes: [
      'Aggiunto pulsante "Verifica Aggiornamenti" in modalità PWA',
      'Contorni attivi per sezioni impostazioni personalizzate',
      'Tema "Sistema" selezionato di default',
      'Dimensione testo "Normale" evidenziato di default',
      'Rimosso link ridondante "Vedi tutti gli aggiornamenti"',
      'Ottimizzazioni UI e UX generali'
    ]
  },
  {
    version: '1.4.2',
    date: '24 Ottobre 2025',
    title: 'PWA Bottom Navigation e Tab Info',
    hidden: true,
    changes: [
      'Barra di navigazione moderna e sospesa in modalità PWA',
      'Design con glassmorphism e bordi arrotondati',
      'Logo TPL centrale (60px) con effetto rifrazione luce',
      'Accesso rapido: Home, Fermate, Prezzi, Impostazioni',
      'Nuova tab "Info e Aggiornamenti" nel modal Impostazioni',
      'Navbar superiore nascosta in modalità PWA'
    ]
  },
  {
    version: '1.4.0',
    date: 'Ottobre 2025',
    title: 'Miglioramenti Generali',
    hidden: true,
    changes: [
      'Ottimizzazioni performance',
      'Miglioramenti UI/UX',
      'Bug fix vari'
    ]
  }
];

// ===== FUNZIONE PER GENERARE HTML DEL CHANGELOG =====

function renderChangelog(containerId = 'changelog-container') {
  const container = document.getElementById(containerId);

  if (!container) {
    console.error(`❌ Container con ID "${containerId}" non trovato!`);
    return;
  }

  let html = '';

  // Genera l'HTML per ogni versione
  // Mostra solo l'ultima versione inizialmente, nascondi le altre
  changelogData.forEach((version, index) => {
    // Solo la prima versione (ultima) è visibile, tutte le altre sono nascoste
    const hiddenClass = index === 0 ? '' : ' update-item-hidden';

    html += `
      <div class="update-item${hiddenClass}">
        <div class="update-version">
          <span class="update-badge">v${version.version}</span>
          <span class="update-date">${version.date}</span>
        </div>
        <div class="update-content">
          <p class="update-title">${version.title}</p>
          <ul class="update-list">
`;

    // Aggiungi ogni change come <li>
    version.changes.forEach(change => {
      html += `            <li>${change}</li>\n`;
    });

    html += `          </ul>
        </div>
      </div>
`;
  });

  // Aggiungi il pulsante "Vedi tutti gli aggiornamenti" solo se ci sono più versioni
  if (changelogData.length > 1) {
    html += `
      <button class="show-all-updates-btn" id="show-all-updates-btn">
        <span class="show-updates-icon">📋</span>
        <span class="show-updates-text">Vedi tutti gli aggiornamenti</span>
      </button>
`;
  }

  // Inserisci l'HTML nel container
  container.innerHTML = html;

  // Event listener per il pulsante "Vedi tutti gli aggiornamenti"
  const showAllBtn = document.getElementById('show-all-updates-btn');
  if (showAllBtn) {
    showAllBtn.addEventListener('click', () => {
      const hiddenItems = container.querySelectorAll('.update-item-hidden');
      const btnIcon = showAllBtn.querySelector('.show-updates-icon');
      const btnText = showAllBtn.querySelector('.show-updates-text');

      if (hiddenItems.length > 0) {
        // Mostra tutte le versioni nascoste
        hiddenItems.forEach(item => {
          item.classList.remove('update-item-hidden');
        });

        // Cambia testo del pulsante
        if (btnIcon) btnIcon.textContent = '🔽';
        if (btnText) btnText.textContent = 'Nascondi altri aggiornamenti';
      } else {
        // Nascondi tutte tranne l'ultima
        const allItems = container.querySelectorAll('.update-item');
        allItems.forEach((item, index) => {
          if (index > 0) {
            item.classList.add('update-item-hidden');
          }
        });

        // Cambia testo del pulsante
        if (btnIcon) btnIcon.textContent = '📋';
        if (btnText) btnText.textContent = 'Vedi tutti gli aggiornamenti';
      }
    });
  }

  console.log('✅ Changelog renderizzato con successo!');
}

// ===== API PUBBLICA PER GESTIONE VERSIONE =====
// Funzioni pubbliche per altri script che devono accedere alla versione

/**
 * Ottiene la versione corrente dell'app dal changelog
 * @returns {Object|null} Oggetto con version, date, time oppure null se non disponibile
 */
function getChangelogVersion() {
  if (!changelogData || changelogData.length === 0) {
    return null;
  }

  const latest = changelogData[0];
  return {
    version: latest.version,
    date: latest.date || '',
    time: latest.time || ''
  };
}

/**
 * Ottiene solo la stringa della versione corrente
 * @returns {string} Versione corrente (es. "1.5.9") o stringa vuota se non disponibile
 */
function getChangelogVersionString() {
  const versionData = getChangelogVersion();
  return versionData ? versionData.version : '';
}

// ===== FUNZIONE PER AGGIORNARE DINAMICAMENTE LA VERSIONE =====
// Aggiorna automaticamente la versione in "TPL FVG Autisti" da changelogData[0].version

function updateAppVersion() {
  // Leggi la versione più recente dal changelog
  const versionData = getChangelogVersion();

  if (!versionData) {
    console.warn('⚠️ changelogData non disponibile, impossibile aggiornare versione');
    return;
  }

  const latestVersion = versionData.version;
  const latestDate = versionData.date;
  const latestTime = versionData.time;

  // Trova tutti gli elementi con classe .info-version e aggiorna il testo
  const versionElements = document.querySelectorAll('.info-version');

  versionElements.forEach(element => {
    element.textContent = `Versione ${latestVersion}`;
  });

  // Trova tutti gli elementi con classe .info-date e aggiorna data e ora
  const dateElements = document.querySelectorAll('.info-date');

  if (latestDate && latestTime) {
    dateElements.forEach(element => {
      element.textContent = `${latestDate} - ${latestTime}`;
    });
  } else if (latestDate) {
    dateElements.forEach(element => {
      element.textContent = latestDate;
    });
  }

  // Aggiorna anche il footer se esiste
  if (typeof updateFooterVersion === 'function') {
    updateFooterVersion(latestVersion);
  }

  if (versionElements.length > 0 || dateElements.length > 0) {
    console.log(`✅ Versione aggiornata automaticamente a ${latestVersion} in ${versionElements.length} elemento/i versione e ${dateElements.length} elemento/i data`);
  }
}


// Aggiorna la versione quando il DOM è pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', updateAppVersion);
} else {
  // DOM già pronto, aggiorna immediatamente
  updateAppVersion();
}

