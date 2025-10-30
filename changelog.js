// ===== CHANGELOG DATA =====
// Array di oggetti con tutti gli aggiornamenti
// Ordinati dal più recente al più vecchio

const changelogData = [
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
  changelogData.forEach(version => {
    const hiddenClass = version.hidden ? ' update-item-hidden' : '';
    
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
  
  // Aggiungi il pulsante "Vedi tutti gli aggiornamenti"
  html += `
      <button class="show-all-updates-btn" id="show-all-updates-btn">
        <span class="show-updates-icon">📋</span>
        <span class="show-updates-text">Vedi tutti gli aggiornamenti</span>
      </button>
`;
  
  // Inserisci l'HTML nel container
  container.innerHTML = html;
  
  console.log('✅ Changelog renderizzato con successo!');
}

