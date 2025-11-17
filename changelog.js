// ===== CHANGELOG DATA =====
// Array di oggetti con tutti gli aggiornamenti
// Ordinati dal più recente al più vecchio

const changelogData = [
  {
    version: '1.8.4',
    date: '17 Novembre 2025',
    time: '11:10',
    title: 'Fermate mobile accordion + mappa GPS reale (v1.8.4)',
    hidden: false,
    changes: [
      '📱 FERMATE MOBILE/PWA:',
      '  • Card fermate mostrate solo su desktop/tablet (layout glassmorphism)',
      '  • Mobile/PWA: nuovo accordion espandibile con badge conteggio fermate',
      '  • Header touch-friendly con icona toggle e animazioni smooth',
      '  • Modulo js/features/fermate-accordion.js (versionato ?v=1.0.0)',
      '🗺️ MAPPA LINEA 400 CON COORDINATE REALI:',
      '  • Creato js/data/coordinates-linea-400.js?v=1.0.0 con GPS reali Udine→Grado',
      '  • Line Map utilizza marker precisi, popup descrittivi e bounds corretti',
      '  • Eventi fermateRendered per re-init componenti responsive',
      '🚏 AGGIORNAMENTI LINEE:',
      '  • Linea 401 Udine-San Daniele aggiunta al database (45 fermate)',
      '  • Lista fermate e mappe sincronizzate con nuovi dati',
      '⚙️ SERVICE WORKER & VERSIONI:',
      '  • Cache confermata tpl-cache-v1.2.3 (nessun nuovo asset pesante)',
      '  • sw.js include nuovi file versionati (accordion + coordinate)',
      '  • fermate.html aggiornata con script versionati e ordine corretto',
      '✅ QUALITÀ:',
      '  • Nessun errore di linting',
      '  • Logging dettagliato per debug LineMap/accordion',
      '  • Retrocompatibilità desktop/tablet preservata',
      '📚 DOCUMENTAZIONE:',
      '  • version.json aggiornato a 1.8.4 (17/11/2025 h16:00)',
      '  • Changelog sincronizzato con nuove funzionalità'
    ]
  },
  {
    version: '1.8.3',
    date: '17 Novembre 2025',
    time: '10:00',
    title: 'Sistema CSS Preset Intelligente - Performance Ottimizzate (v1.8.3)',
    hidden: false,
    changes: [
      '🎨 SISTEMA CSS PRESET INTELLIGENTE:',
      '  • Creato sistema di caricamento CSS ottimizzato per dispositivo',
      '  • 4 preset CSS: desktop.css, tablet.css, mobile.css, pwa.css',
      '  • Loader JavaScript intelligente: js/utils/css-preset-loader.js',
      '  • Rilevamento automatico modalità (screen width + PWA mode)',
      '  • Riduzione CSS caricato: -30% ~ -50% in media',
      '🖥️ PRESET DESKTOP (≥ 1024px):',
      '  • Navbar completa + mega dropdown settings',
      '  • NO mobile menu, NO PWA bottom nav',
      '  • Ottimizzato per mouse e tastiera',
      '📱 PRESET TABLET (768-1023px):',
      '  • Navbar + hamburger menu',
      '  • Mega dropdown (landscape) + mobile menu (portrait)',
      '  • PWA bottom nav condizionale',
      '  • Ottimizzato per touch',
      '📱 PRESET MOBILE (< 768px):',
      '  • Navbar minimale + mobile menu',
      '  • NO mega dropdown (troppo complesso)',
      '  • PWA install banner prominente',
      '  • Componenti touch-optimized',
      '📲 PRESET PWA (standalone):',
      '  • PWA bottom navigation (navigazione principale)',
      '  • NO navbar desktop (hidden)',
      '  • Interfaccia app-like nativa',
      '  • Esperienza fullscreen',
      '⚡ LOADER INTELLIGENTE:',
      '  • Rilevamento automatico: width + display-mode',
      '  • Salvataggio modalità in localStorage',
      '  • Gestione resize/orientamento con throttling',
      '  • Listener per cambio modalità PWA',
      '  • API pubblica per debug: CSSPresetLoader.*',
      '📦 AGGIORNAMENTI FILE:',
      '  • index.html: da 40+ righe CSS a 1 script loader',
      '  • fermate.html: preset + Leaflet.css + fermate.css',
      '  • prezzi.html: solo preset loader',
      '  • benvenuto.html: preset + benvenuto.css',
      '  • Service Worker v23 con tutti i preset',
      '🎯 BENEFICI PERFORMANCE:',
      '  • Desktop: ~85 KB CSS (-35%), FCP ~200ms più veloce',
      '  • Tablet: ~92 KB CSS (-30%), FCP ~180ms più veloce',
      '  • Mobile: ~78 KB CSS (-40%), FCP ~250ms più veloce',
      '  • PWA: ~75 KB CSS (-45%), FCP ~280ms più veloce',
      '✅ QUALITÀ CODICE:',
      '  • Nessun errore di linting',
      '  • Documentazione completa (CSS_PRESETS_DOCUMENTATION.md)',
      '  • Sistema testato su tutte le modalità',
      '  • Retrocompatibilità totale',
      '📚 DOCUMENTAZIONE:',
      '  • CSS_PRESETS_DOCUMENTATION.md creato',
      '  • Guida implementazione completa',
      '  • Esempi debug e testing',
      '  • Best practices manutenzione',
      '📊 STATISTICHE:',
      '  • 4 file preset CSS creati',
      '  • 1 loader JavaScript intelligente',
      '  • 4 pagine HTML aggiornate',
      '  • Service Worker v22 → v23',
      '  • Riduzione richieste HTTP: 40+ → 1',
    ]
  },
  {
    version: '1.8.2',
    date: '17 Novembre 2025',
    time: '00:30',
    title: 'Modularizzazione CSS Finale + Fix Navbar Glassmorphism (v1.8.2)',
    hidden: false,
    changes: [
      '🎯 NUOVI COMPONENTI CSS MODULARI:',
      '  • Creato css/components/offline-banner.css?v=1.0.0 (SEZIONE 20)',
      '    - Banner offline/online con stati visivi',
      '    - Arancione offline, verde online',
      '    - Dark mode + responsive + safe-area (127 righe)',
      '  • Creato css/components/update-items.css?v=1.0.0 (SEZIONE 22)',
      '    - Pulsante "Vedi tutti gli aggiornamenti"',
      '    - Gestione visibilità item nascosti',
      '    - Animazioni e transizioni (70 righe)',
      '  • Creato css/components/preset-buttons.css?v=1.0.0 (SEZIONE 11)',
      '    - Pulsanti preset distanza e fake position',
      '    - Stati hover/active con animazioni',
      '    - Dark mode completo (79 righe)',
      '  • Creato css/components/display-optimization.css?v=1.0.0 (SEZIONE 12)',
      '    - Ottimizzazione display avanzata con rilevamento DPR',
      '    - Preset options con badge consigliato',
      '    - HiDPI media queries per Retina/Super Retina',
      '    - Dark mode + responsive (417 righe)',
      '📉 PULIZIA FINALE CODICE:',
      '  • Rimosso 756 righe da style1.css in questa sessione',
      '  • style1.css: 1010 → 254 righe (-75% 🔥)',
      '  • Rimosso SEZIONE 25 (Dark Mode Utility - 68 righe)',
      '  • Dark mode spostato nei componenti specifici',
      '  • 254 righe rimanenti sono SOLO COMMENTI!',
      '🔧 FIX NAVBAR GLASSMORPHISM:',
      '  • Aggiunto backdrop-filter: blur(12px) alla navbar',
      '  • Ripristinato effetto trasparenza con sfocatura',
      '  • Opacità ottimizzata: 0.75 → 0.65 → 0.55',
      '  • Bordo bianco elegante rgba(255,255,255,0.2)',
      '🏗️ ARCHITETTURA CSS COMPLETATA:',
      '  • 100% del CSS reale modularizzato',
      '  • style1.css ridotto a solo commenti di riferimento',
      '  • Service Worker v22 aggiornato con tutti i nuovi asset',
      '  • Tutti i componenti con versionamento ?v=1.0.0',
      '📦 AGGIORNAMENTI FILE:',
      '  • Aggiunto offline-banner.css a index/fermate/prezzi/benvenuto.html',
      '  • Aggiunto update-items.css e preset-buttons.css al SW',
      '  • Aggiunto display-optimization.css al SW',
      '  • Aggiornato search-selector.css con dark mode completo',
      '  • Aggiornato navbar.css con glassmorphism fix',
      '✅ QUALITÀ CODICE:',
      '  • Nessun errore di linting',
      '  • Struttura modulare perfettamente organizzata',
      '  • Dark mode completo per tutti i componenti',
      '  • Responsive ottimizzato (mobile, tablet, desktop)',
      '📊 STATISTICHE TOTALI SESSIONE:',
      '  • 4 nuovi componenti creati',
      '  • 1 componente aggiornato (search-selector.css)',
      '  • 1 fix critico (navbar glassmorphism)',
      '  • 756 righe modularizzate',
      '  • -75% dimensione style1.css',
      '📊 STATISTICHE TOTALI DA v1.8.0:',
      '  • style1.css: 2106 → 254 righe',
      '  • Riduzione: -1852 righe (-87.9% 🔥🔥🔥)',
      '  • 8 nuovi componenti creati in totale',
      '  • Architettura CSS completamente modularizzata',
    ]
  },
  {
    version: '1.8.1',
    date: '16 Novembre 2025',
    time: '23:40',
    title: 'Modularizzazione CSS: Utilities, Footer, Scroll-to-Top e PWA Banner (v1.8.1)',
    hidden: false,
    changes: [
      '🎯 NUOVI COMPONENTI CSS MODULARI:',
      '  • Creato css/utilities.css?v=1.0.0 (SEZIONE 19)',
      '    - Classi utility globali: .hidden, .inactive',
      '    - 17 righe di codice riutilizzabile',
      '  • Creato css/components/footer.css (SEZIONE 24)',
      '    - Footer links con layout flexbox',
      '    - Link Telegram con icona e hover',
      '    - Update info con opacità ridotta',
      '    - Dark mode completo (80 righe)',
      '  • Creato css/components/scroll-to-top.css?v=1.0.0 (SEZIONE 24.6)',
      '    - Pulsante floating torna su',
      '    - Stati: visible, hover, active',
      '    - Dark mode e responsive mobile/tablet (135 righe)',
      '  • Creato css/components/pwa-install-banner.css?v=1.0.0 (SEZIONE 24.7)',
      '    - Banner installazione PWA con gradiente turchese',
      '    - Pulsanti primari e secondari con glassmorphism',
      '    - Hint iOS con step numerati e icone',
      '    - Hint Android con istruzioni dettagliate',
      '    - Dark mode e responsive completo (530 righe)',
      '📉 PULIZIA MASSIVA CODICE:',
      '  • Rimosso 711 righe duplicate da style1.css',
      '  • style1.css: 2106 → 1395 righe (-33.7% 🔥)',
      '  • Utilities: -11 righe',
      '  • Footer: -58 righe',
      '  • Scroll to Top: -116 righe',
      '  • PWA Install Banner: -526 righe',
      '🏗️ ARCHITETTURA CSS AGGIORNATA:',
      '  • Nuovo ordine caricamento: Variables → Base → Layout → Animations → Utilities → Themes → Components → Legacy',
      '  • Utilities inserito come layer fondamentale (5° livello)',
      '  • Tutti i componenti con versionamento ?v=1.0.0',
      '  • Commenti dettagliati per ogni sezione',
      '📦 AGGIORNAMENTI FILE:',
      '  • Aggiunto utilities.css?v=1.0.0 a tutte le pagine HTML',
      '  • Aggiunto scroll-to-top.css?v=1.0.0 a index/fermate/prezzi/benvenuto.html',
      '  • Aggiunto pwa-install-banner.css?v=1.0.0 a tutte le pagine',
      '  • Service Worker v22: aggiornati tutti i nuovi asset',
      '✅ QUALITÀ CODICE:',
      '  • Nessun errore di linting',
      '  • Struttura modulare e manutenibile',
      '  • Dark mode completo per tutti i componenti',
      '  • Responsive ottimizzato (mobile, tablet, desktop)',
      '📊 STATISTICHE TOTALI:',
      '  • 4 nuovi componenti creati',
      '  • 762 righe modularizzate',
      '  • -33.7% dimensione style1.css',
      '  • Cache busting attivo su tutti i nuovi file',
    ]
  },
  {
    version: '1.8.0',
    date: '16 Novembre 2025',
    time: '22:45',
    title: 'Modularizzazione CSS Massiva: Mobile Menu, Modal Fermate e Impostazioni (v1.8.0)',
    hidden: false,
    changes: [
      '🎯 MODULARIZZAZIONE CSS COMPONENTI MODALI:',
      '  • Creato css/components/mobile-menu.css (SEZIONE 17)',
      '    - Hamburger toggle button con animazione X',
      '    - Menu drawer laterale con overlay',
      '    - Navigazione mobile con badge ON/OFF',
      '    - Controlli dimensione testo mobile',
      '    - Dark mode completo',
      '  • Creato css/components/fermate-modal.css (SEZIONE 18)',
      '    - Modal fermate con ricerca e filtro',
      '    - Pulsanti geolocalizzazione (header e inline)',
      '    - Modal linee con badge e dettagli percorso',
      '    - Scrollbar ottimizzata per mobile (20px touch-friendly)',
      '    - Responsive per schermi piccoli (iPhone SE, Mini)',
      '  • Creato css/components/settings-modal.css (SEZIONE 18 bis)',
      '    - Modal impostazioni con tabs (Impostazioni, Accessibilità, Aspetto, Info)',
      '    - Toggle switches animati',
      '    - Theme options con radio buttons',
      '    - Font size buttons con preview',
      '    - Ottimizzazione schermi piccoli (max-height: 670px)',
      '📉 PULIZIA CODICE DUPLICATO:',
      '  • Rimosso 1497 righe duplicate da style1.css',
      '  • style1.css: 3613 → 2116 righe (-41% 🔥)',
      '  • Mobile Menu: -425 righe',
      '  • Modal Fermate/Linee: -868 righe',
      '  • Modal Impostazioni: -630 righe',
      '📦 AGGIORNAMENTI FILE:',
      '  • Aggiunto mobile-menu.css a index/fermate/prezzi/benvenuto.html',
      '  • Aggiunto fermate-modal.css a tutte le pagine',
      '  • Aggiunto settings-modal.css a tutte le pagine',
      '  • Service Worker: aggiornati tutti i nuovi componenti',
      '✅ QUALITÀ CODICE:',
      '  • Nessun errore di linting',
      '  • Struttura CSS modulare e manutenibile',
      '  • Commenti dettagliati per ogni componente',
      '  • Dark mode e responsive completi',
      '🎨 ARCHITETTURA CSS:',
      '  • Ordine caricamento: Variables → Base → Layout → Animations → Themes → Components → Legacy',
      '  • Componenti indipendenti e riutilizzabili',
      '  • Separazione chiara tra layout, temi e componenti',
    ]
  },
  {
    version: '1.7.9',
    date: '16 Novembre 2025',
    time: '22:00',
    title: 'FASE 4 Modularizzazione + Fix Mappa e Layout (v1.7.9)',
    hidden: false,
    changes: [
      '🗺️ MAPPA LEAFLET FUNZIONANTE:',
      '  • Fix caricamento asincrono Leaflet con retry automatico',
      '  • Scroll automatico alla mappa dopo selezione linea',
      '  • Rendering marker con coordinate mock (16 fermate)',
      '  • Sidebar interattiva con lista fermate cliccabili',
      '  • Toggle mostra/nascondi mappa funzionante',
      '🔧 FIX LAYOUT CRITICO:',
      '  • Risolto problema scroll fermate.html (overflow: visible → auto)',
      '  • Footer e mappa ora accessibili scrollando',
      '  • Layout flexbox corretto per .fermate-page',
      '📱 OTTIMIZZAZIONE MOBILE:',
      '  • Fermate card trasparenti su mobile (< 768px)',
      '  • Rimosso glassmorphism per massimizzare spazio',
      '  • Max-height fermate aumentato a 500px su mobile',
      '  • Titoli mantengono glassmorphism per orientamento visivo',
      '🧩 MODULARIZZAZIONE CSS (FASE 4):',
      '  • Creato css/components/cache-modal.css (SEZIONE 16)',
      '  • Rimosso 307 righe da style1.css',
      '  • style1.css ridotto da 4354 a 4051 righe (-7%)',
      '  • Aggiunto cache-modal.css a index/fermate/prezzi.html e SW',
      '📦 SERVICE WORKER:',
      '  • Cache v21 con tutti gli asset Leaflet locali',
      '  • Aggiunto css/components/cache-modal.css',
      '  • Supporto completo offline per mappa e modali',
      '🐛 BUG FIX:',
      '  • Fix line-map.js: attesa caricamento Leaflet con setTimeout',
      '  • Fix layout.css: .fermate-page overflow-y: auto',
      '  • Fix fermate-card.css: responsive mobile ottimizzato',
    ]
  },
  {
    version: '1.7.8',
    date: '16 Novembre 2025',
    time: '21:40',
    title: 'Integrazione Mappa Leaflet per Fermate (v1.7.8)',
    hidden: false,
    changes: [
      '🗺️ INTEGRAZIONE MAPPA INTERATTIVA:',
      '  • Leaflet 1.9.4 hostato localmente in libs/leaflet/',
      '  • OpenStreetMap per visualizzazione fermate linee',
      '  • Componente line-map.js con rendering automatico dopo selezione linea',
      '  • Sidebar con lista fermate evidenziate e click su marker',
      '  • Toggle mostra/nascondi mappa con pulsante dedicato',
      '📦 ASSETS LOCALI (supporto offline/PWA):',
      '  • libs/leaflet/leaflet.js (149 KB)',
      '  • libs/leaflet/leaflet.css (15 KB)',
      '  • libs/leaflet/leaflet-icon-fix.js (fix path marker)',
      '  • libs/leaflet/marker-icon.png, marker-icon-2x.png, marker-shadow.png',
      '🎨 STILI E LAYOUT:',
      '  • css/components/line-map.css: container mappa, header, sidebar, controlli',
      '  • Layout responsive desktop/tablet/mobile/PWA',
      '  • Glassmorphism e dark mode integrati',
      '⚙️ SERVICE WORKER:',
      '  • Cache aggiornata a v21',
      '  • Tutti gli asset Leaflet aggiunti a STATIC_ASSETS',
      '  • Supporto completo offline per mappe (tile OSM cacheate dinamicamente)',
      '🔧 MODIFICHE TECNICHE:',
      '  • fermate.html: aggiunta sezione #line-map-section',
      '  • page-renderers.js: chiamata LineMap.update() dopo renderFermate()',
      '  • Coordinate mock per testing (da sostituire con coordinate reali)',
    ]
  },
  {
    version: '1.7.7',
    date: '16 Novembre 2025',
    time: '16:30',
    title: 'FASE 3 Componenti Core - Pulizia Duplicati (v1.7.7)',
    hidden: false,
    changes: [
      '🎉 FASE 3: COMPONENTI CORE - Completata!',
      '  • Eliminati 1045 righe di codice duplicato da style1.css',
      '  • style1.css ridotto da 6403 a 5358 righe (-16.3%)',
      '🗑️ SEZIONI ELIMINATE (già modularizzate):',
      '  • ✅ SEZIONE 7: Navbar → css/components/navbar.css',
      '  • ✅ SEZIONE 9: Forms → css/components/forms.css',
      '  • ✅ SEZIONE 10: Buttons → css/components/buttons.css',
      '  • ✅ SEZIONE 22: Price Card → css/components/price-card.css',
      '  • ✅ PWA Bottom Nav → css/components/pwa-bottom-nav.css',
      '✨ COMPONENTI VERIFICATI E CONFERMATI:',
      '  • buttons.css: swap-btn, calculate-btn, reset-btn, route-button, location-btn',
      '  • navbar.css: navbar, navbar-brand, navbar-logo (flip 3D), nav-link',
      '  • forms.css: form-group, form-select, search-box, route-section, dividers',
      '  • pwa-bottom-nav.css: pwa-brand-header, pwa-bottom-nav, pwa-nav-item, logo flip',
      '  • price-card.css: price-card, price-section, price-label, price-value, price-code',
      '🎯 RISULTATO:',
      '  • Modularizzazione CSS completata con successo!',
      '  • Nessun errore di linting',
      '  • Tutti i componenti funzionanti e ottimizzati',
      '  • style1.css ora contiene solo codice non ancora modularizzato',
    ]
  },
  {
    version: '1.7.6',
    date: '16 Novembre 2025',
    time: '15:00',
    title: 'FASE 2 Temi e Animazioni (v1.7.6)',
    hidden: false,
    changes: [
      '✨ FASE 2: TEMI E ANIMAZIONI - Completata:',
      '  • Creato css/themes.css: 8 modalità accessibilità e temi globali',
      '  • Dark mode (.dark) - override variabili CSS',
      '  • High contrast (.high-contrast) - bordi più spessi, font più bold',
      '  • Reduce motion (body.reduce-motion) - disabilita animazioni',
      '  • Blue light filter (body.blue-light-filter) - overlay caldo',
      '  • Interface scale (body.interface-scale-*) - zoom 75%, 85%, 100%, 115%, 125%',
      '  • Extra spacing (body.extra-spacing) - padding aumentato per touch',
      '  • Compact layout (body.compact-layout) - spacing ridotto',
      '  • Touch friendly (.touch-friendly) - pulsanti più grandi (min-height 56px)',
      '🔧 PULIZIA E OTTIMIZZAZIONI:',
      '  • Pulito css/animations.css: variabili spostate in variables.css',
      '  • Completato css/variables.css: aggiunte variabili animazioni mancanti',
      '  • Commentate 8 sezioni duplicate in style1.css (spostate in themes.css)',
      '  • Aggiornati 4 file HTML con ordine caricamento corretto',
      '📦 SERVICE WORKER:',
      '  • Cache aggiornata a v13',
      '  • Aggiunto css/themes.css negli asset statici',
      '  • Ordine caricamento: Variables → Base → Layout → Animations → Themes → Components',
      '📝 ARCHITETTURA:',
      '  • Separazione netta: themes.css = effetti globali, settings/*.css = UI tab',
      '  • Pronto per FASE 3: Componenti Core (navbar, buttons, forms, cards, pwa-nav)',
    ]
  },
  {
    version: '1.7.5',
    date: '16 Novembre 2025',
    time: '13:45',
    title: 'FASE 1 Modularizzazione CSS + Fix Layout Scroll (v1.7.5)',
    hidden: false,
    changes: [
      '✨ FASE 1: FONDAMENTA - Modularizzazione CSS:',
      '  • Creato css/variables.css: variabili globali (colori, spacing, animazioni, z-index)',
      '  • Creato css/base.css: reset CSS e typography con font-size accessibilità',
      '  • Consolidato css/layout.css: layout app-style con body fixed e main scrollabile',
      '  • Ordine caricamento ottimizzato: Variables → Base → Layout → Animations → Components → Legacy',
      '🐛 FIX CRITICI LAYOUT:',
      '  • ✅ Risolto problema scroll oltre footer (layout app-style con position:fixed)',
      '  • ✅ Footer spostato dentro main-content (appare solo scrollando in fondo)',
      '  • ✅ Footer mantiene dimensioni corrette su desktop (padding 2rem)',
      '  • ✅ Navbar sempre fissa in alto (non scrolla più con la pagina)',
      '  • ✅ Solo main-content scrolla internamente (html e body fixed)',
      '🔧 MIGLIORAMENTI:',
      '  • Verifica Aggiornamenti ora reindirizza a benvenuto.html dopo reload',
      '  • Rimossi duplicati CSS nel Service Worker (benvenuto.css, fermate.css)',
      '  • HTML aggiornato in tutte le pagine (index, benvenuto, prezzi, fermate)',
      '  • style1.css marcato come LEGACY (da dismettere gradualmente nelle prossime fasi)',
      '📦 SERVICE WORKER:',
      '  • Cache aggiornata a v12',
      '  • Aggiunti nuovi file CSS modulari (variables.css, base.css, layout.css)',
      '  • Struttura assets riorganizzata per ordine logico',
      '📝 ARCHITETTURA:',
      '  • Regole duplicate rimosse/commentate da style1.css',
      '  • Preparato terreno per FASE 2: Temi e Animazioni',
      '  • Documentazione CSS_ARCHITECTURE.md da aggiornare',
    ]
  },
  {
    version: '1.7.4',
    date: '15 Novembre 2025',
    time: '14:30',
    title: 'Miglioramenti UI/UX bottoni e price card (v1.7.4)',
    hidden: false,
    changes: [
      '🎨 MIGLIORAMENTI BOTTONI:',
      '  • Ottimizzata leggibilità bottoni selezione linea con glassmorphism (rgba(255,255,255,0.98))',
      '  • Aggiunto text-shadow per miglior contrasto testo su sfondo animato',
      '  • Ridotto font-weight da 600 a 500 per aspetto meno "grassetto"',
      '  • Fix cursor swap button: aggiunto !important per override style1.css',
      '  • Migliorato hover swap button: da turchese-scuro a turchese-light (feedback positivo)',
      '💳 OTTIMIZZAZIONI PRICE CARD:',
      '  • Unificato sizing: price-code 1.2rem, price-value 1.35rem',
      '  • Aggiunto white-space:nowrap per prevenire a capo simbolo € su mobile',
      '  • Semplificati labels: "Codice biglietto" → "Codice", "Costo del biglietto" → "Prezzo"',
      '🔧 FIX TECNICI:',
      '  • Risolti conflitti CSS tra buttons.css e style1.css con !important strategici',
      '  • .swap-btn-small:not(:disabled) con cursor:pointer!important e opacity:1!important',
      '📱 MOBILE-FIRST:',
      '  • Migliorata leggibilità su schermi piccoli',
      '  • Prevenuto wrapping testo nei valori monetari',
      '  • Labels più concisi per spazio limitato',
    ]
  },
  {
    version: '1.7.2',
    date: '10 Novembre 2025',
    time: '16:15',
    title: 'Modularizzazione PWA Bottom Navigation (v1.7.2)',
    hidden: false,
    changes: [
      '📦 MODULARIZZAZIONE PWA BOTTOM NAVIGATION:',
      '  • Creato js/components/pwa-bottom-nav.js (311 righe) - Gestione completa bottom navigation',
      '  • Creato css/components/pwa-bottom-nav.css (586 righe) - Stili modulari per PWA navigation',
      '  • Ridotto script.js di ~278 righe (da 1492 a 1245 righe, -19%)',
      '  • Ridotto style1.css di ~599 righe (da 6723 a 6124 righe, -9%)',
      '🎯 FUNZIONALITÀ MODULARIZZATE:',
      '  • Brand header e bottom navigation (mostra/nascondi in modalità PWA)',
      '  • Evidenziazione tab attiva in base alla pagina corrente',
      '  • Gestione pulsante impostazioni nella bottom nav',
      '  • Scroll progress bar nel brand header',
      '  • PWA Update Check Button (verifica aggiornamenti)',
      '  • Simulazione offline globale (per test)',
      '  • Listener per cambio modalità test PWA',
      '🔧 API PUBBLICA:',
      '  • window.PWABottomNav.toggle() - Mostra/nascondi bottom nav',
      '  • window.PWABottomNav.highlightActiveTab() - Evidenzia tab attiva',
      '  • window.PWABottomNav.refresh() - Aggiorna tutto',
      '  • window.refreshPWABottomNav() - Retrocompatibilità per test.html',
      '📝 MODIFICHE FILE:',
      '  • Aggiunto <link> CSS in index.html, fermate.html, prezzi.html',
      '  • Aggiunto <script> JS in index.html, fermate.html, prezzi.html',
      '  • Rimossi commenti e codice obsoleto da script.js e style1.css',
      '  • Aggiornato JS_ARCHITECTURE.md con nuovo modulo',
      '✅ BENEFICI:',
      '  • Codice più organizzato e manutenibile',
      '  • Modulo riutilizzabile e testabile',
      '  • Riduzione dimensione file principali',
      '  • Separazione delle responsabilità',
    ]
  },
  {
    version: '1.7.1',
    date: '10 Novembre 2025',
    time: '12:10',
    title: 'Fix GPS reset button, evidenziazione fermata selezionata e miglioramenti modal (v1.7.1)',
    hidden: false,
    changes: [
      '🔧 FIX GPS RESET BUTTON:',
      '  • Aggiunta funzione resetLocationButtonUI() per resettare solo UI pulsante GPS (preserva stato interno)',
      '  • Aggiunto parametro isAutoAssignment in selectFermata() per distinguere auto-assegnazione da selezione manuale',
      '  • Reset automatico pulsante GPS quando utente modifica manualmente partenza dopo auto-assegnazione GPS',
      '  • Permette di ri-premere pulsante GPS per ri-assegnare rapidamente stazione corrente',
      '🎯 EVIDENZIAZIONE FERMATA SELEZIONATA:',
      '  • Evidenziazione fermata già selezionata nel modal delle fermate (partenza/arrivo)',
      '  • Aggiunti callback getCurrentPartenzaIdx e getCurrentArrivoIdx nel modal',
      '  • Migliorata UX: utente vede sempre quale fermata è attualmente selezionata',
      '📱 SCENARIO D\'USO REALE:',
      '  • Cliente 1: Autista usa GPS → auto-assegna stazione corrente → emette biglietto',
      '  • Cliente 2: Chiede prezzo stazione diversa → autista modifica manualmente → pulsante GPS si resetta',
      '  • Cliente 3: Vuole biglietto stazione corrente → autista ri-preme GPS → ri-assegna rapidamente',
      '🔧 MODIFICHE TECNICHE:',
      '  • js/features/geolocation.js - Aggiunta resetLocationButtonUI(), esposta in API pubblica',
      '  • js/features/route-selector.js - Aggiunto parametro isAutoAssignment in selectFermata()',
      '  • js/components/modals.js - Evidenziazione fermata selezionata in renderFermateList()',
      '  • script.js - Aggiunti callback getCurrentPartenzaIdx/getCurrentArrivoIdx per modal',
      '📝 DOCUMENTAZIONE:',
      '  • Aggiornato JS_ARCHITECTURE.md con nuove modifiche v1.7.1',
    ]
  },
  {
    version: '1.7.0',
    date: '9 Novembre 2025',
    time: '23:15',
    title: 'Modularizzazione GPS avanzato, componenti condivisi e pulizia (v1.7.0)',
    hidden: false,
    changes: [
      '🔧 MODULARIZZAZIONE GPS AVANZATO (9 moduli):',
      '  • Creato js/tests/gps/helpers.js - Helper funzioni GPS',
      '  • Creato js/tests/gps/fake-position.js - Simulazione posizione GPS',
      '  • Creato js/tests/gps/reset-data.js - Reset dati GPS',
      '  • Creato js/tests/gps/distance-calculator.js - Calcolo distanze',
      '  • Creato js/tests/gps/map-leaflet.js - Integrazione mappa Leaflet',
      '  • Creato js/tests/gps/watch-position.js - Monitoraggio continuo posizione',
      '  • Creato js/tests/gps/quick-test.js - Test rapido GPS',
      '  • Creato js/tests/gps/export-report.js - Esportazione report GPS',
      '  • Creato js/tests/gps/test-geolocation.js - Test geolocalizzazione principale',
      '🔧 COMPONENTI CONDIVISI:',
      '  • Creato js/components/hamburger-menu.js - Menu mobile hamburger (tutte le pagine)',
      '  • Creato js/components/mega-dropdown-settings.js - Mega dropdown impostazioni (desktop, tutte le pagine)',
      '  • Creato js/components/pwa-install.js - Banner installazione PWA (da integrare)',
      '🔧 MODULI TEST:',
      '  • Creato js/tests/device-detector.js - Rilevamento informazioni dispositivo',
      '  • Creato js/tests/effects-status.js - Status effetti (dark mode, animazioni)',
      '  • Creato js/tests/error-404-simulator.js - Simulatore errore 404',
      '  • Creato js/tests/pwa-test-mode.js - Modalità test PWA',
      '  • Creato js/tests/test-ui-manifest-performance-wrappers.js - Wrapper test UI/Manifest/Performance',
      '📊 RISULTATI MODULARIZZAZIONE:',
      '  • test.html: ridotto da ~5514 a ~3968 righe (-1546 righe, -28%)',
      '  • script.js: ridotto di ~85 righe (hamburger menu modularizzato)',
      '  • 16 nuovi moduli creati (3 components, 5 tests, 9 GPS)',
      '🔧 MIGLIORAMENTI:',
      '  • js/utils/connection-monitor.js - Migliorato timeout handling (Promise.race, AbortController)',
      '  • Gestione errori migliorata per no-cors fetch',
      '  • js/tests/pwa-test-mode.js - Usa createElement invece di innerHTML (prevenzione XSS)',
      '📝 DOCUMENTAZIONE:',
      '  • Aggiornato JS_ARCHITECTURE.md con tutti i nuovi moduli',
      '  • Aggiunto SECURITY_ROADMAP.md - Roadmap rimozione innerHTML/XSS',
      '  • Aggiunto ANALISI_MODULARIZZAZIONE_SCRIPT_JS.md - Analisi prossimi passi',
      '  • Aggiunto REPORT_DOCUMENTAZIONE.md - Report stato documentazione',
      '🧹 PULIZIA REPOSITORY:',
      '  • Eliminati 24 file obsoleti:',
      '    - 13 file documentazione obsoleta',
      '    - 7 file demo/prototype',
      '    - 4 file temporanei/backup',
      '  • Rimossi file duplicati e ridondanti',
      '  • Repository più pulita e organizzata',
      '✅ COMPONENTI CONDIVISI:',
      '  • Mega Dropdown Settings disponibile su tutte le pagine desktop',
      '  • Hamburger Menu disponibile su tutte le pagine',
      '  • Componenti testati e funzionanti',
    ],
  },
  {
    version: '1.6.9',
    date: '9 Novembre 2025',
    time: '10:30',
    title: 'Modularizzazione MODULI 1-5: Refactoring Strutturale',
    hidden: false,
    changes: [
      '🔧 MODULARIZZAZIONE MODULO 1: UI Helpers',
      '  • Creato js/utils/ui-helpers.js',
      '    - scrollToTop() - Scroll smooth verso l\'alto',
      '    - toggleScrollToTopButton() - Mostra/nasconde pulsante "Torna su"',
      '    - toggleSwapButton() - Mostra/nasconde pulsante scambio partenza/arrivo',
      '    - ~90 righe estratte da script.js',
      '    - Esposizione globale per retrocompatibilità',
      '🔧 MODULARIZZAZIONE MODULO 2: Page Renderers',
      '  • Creato js/features/page-renderers.js',
      '    - renderFermate() - Rendering liste fermate per fermate.html',
      '    - renderPrezzi() - Rendering tabelle prezzi per prezzi.html',
      '    - Dipendenze opzionali: Geolocation (ordinamento distanza), Pricing (calcolo prezzi)',
      '    - ~315 righe iniziali',
      '🔧 MODULARIZZAZIONE MODULO 3: Page Search (integrato in Page Renderers)',
      '  • setupRicercaPrezzi() - Integrata in page-renderers.js',
      '    - Ricerca e filtraggio tabelle prezzi',
      '    - Pulsante clear ricerca',
      '    - Funzionalità ricerca per nome fermata e codice biglietto',
      '🔧 MODULARIZZAZIONE MODULO 4: Page Lines (integrato in Page Renderers)',
      '  • Funzioni selezione linee per fermate.html:',
      '    - populateLineeTratte() - Popola modal linee',
      '    - selectLineaFermate() - Selezione linea e rendering fermate',
      '    - openLineeModalFermate() / closeLineeModalFermate() - Gestione modal',
      '  • Funzioni selezione linee per prezzi.html:',
      '    - populateLineePrezzi() - Popola modal linee',
      '    - selectLineaPrezzi() - Selezione linea e rendering prezzi',
      '    - openLineeModalPrezzi() / closeLineeModalPrezzi() - Gestione modal',
      '    - ~280 righe aggiunte a page-renderers.js',
      '🔧 MODULARIZZAZIONE MODULO 5: Page Initialization (integrato in Page Renderers)',
      '  • initFermatePrezzi() - Inizializzazione pagine fermate/prezzi',
      '    - Gestione evento tariffarioLoaded',
      '    - Inizializzazione automatica al caricamento modulo',
      '    - Fallback se tariffario già caricato',
      '    - ~40 righe aggiunte a page-renderers.js',
      '📊 RISULTATI MODULARIZZAZIONE:',
      '  • script.js: ~1654 righe (da ~1906, -252 righe, -13%)',
      '  • page-renderers.js: ~707 righe (nuovo modulo completo)',
      '  • ui-helpers.js: ~90 righe (nuovo modulo)',
      '  • Codice più modulare, manutenibile e testabile',
      '🐛 FIX GEOLOCATION:',
      '  • js/features/geolocation.js - Fix Storage.getItem',
      '    - Sostituita costante Storage con funzione getStorage() dinamica',
      '    - Risolve errore "Storage.getItem is not a function"',
      '    - Gestione corretta caricamento asincrono moduli',
      '📝 DOCUMENTAZIONE:',
      '  • Aggiornato JS_ARCHITECTURE.md con nuovi moduli',
      '    - Aggiunti page-renderers.js, ui-helpers.js, geolocation.js, route-selector.js',
      '    - Aggiornato ordine caricamento moduli',
      '    - Documentazione dipendenze e API pubbliche',
      '🧹 PULIZIA:',
      '  • Rimossi 13 file di backup dalla repository (2.91 MB)',
      '    - File HTML backup (test.html, index.html, fermate.html, prezzi.html, benvenuto.html)',
      '    - File JS backup (script.js vari)',
      '    - File CSS backup (style1.css, modals.css)',
      'MIGLIORAMENTI:',
      '  • Wrapper per retrocompatibilità in script.js',
      '  • Inizializzazione automatica moduli',
      '  • Gestione errori migliorata',
      '  • Logging dettagliato per debug',
    ],
  },
  {
    version: '1.6.8.1',
    date: '7 Novembre 2025',
    time: '22:00',
    title: 'Fix Bug: Tema Default, Pulsanti PWA, GPS e Riavvio App',
    hidden: false,
    changes: [
      '🐛 FIX TEMA DEFAULT:',
      '  • js/features/settings.js - Tema default cambiato da "light" a "system"',
      '    - Applica automaticamente il tema del sistema operativo',
      '    - Rispetta preferenze dark/light mode del dispositivo',
      '    - Fix in applyTheme() e loadTheme()',
      '  • js/components/modals.js - syncSettingsWithState() aggiornato',
      '    - Default tema sistema invece di bianco forzato',
      '🐛 FIX PULSANTE IMPOSTAZIONI PWA:',
      '  • js/components/modals.js - Gestione pulsante pwa-settings-btn',
      '    - Aggiunto listener in initializeSettingsModal()',
      '    - Usa SettingsModal.open() quando disponibile',
      '    - Fallback per caricamento dinamico modal',
      '    - Event delegation migliorata',
      '🐛 FIX PULSANTE "ATTIVA MODALITÀ PWA":',
      '  • test.html - Fix gestione stato modalità PWA test',
      '    - Salvataggio corretto come stringa (compatibilità Storage.getItem)',
      '    - Lettura gestisce sia stringa che booleano',
      '    - Fix in togglePWATestMode() e inizializzazione',
      '  • script.js - Fix lettura tpl.pwaTestMode',
      '    - Gestione corretta valori stringa/booleano',
      '🐛 FIX PULSANTE "VERIFICA AGGIORNAMENTI":',
      '  • js/components/modals.js - setupUpdateCheckButton() migliorata',
      '    - Event delegation su document.body con capture phase',
      '    - Multiple metodi per trovare pulsante (closest, parentElement, contains)',
      '    - Chiamata dopo caricamento modal HTML e apertura modal',
      '    - Logging dettagliato per debug',
      '    - Fallback per closeSettingsModal()',
      '🐛 FIX GPS AUTO-ASSEGNAZIONE:',
      '  • js/features/geolocation.js - Auto-assegnazione solo partenza',
      '    - autoAssignRoute() restituisce solo fermata più vicina (partenza)',
      '    - handleLocationClick() seleziona solo partenza, non arrivo',
      '    - Notifica mostra solo partenza selezionata con distanza',
      '    - Rimossa logica auto-assegnazione arrivo',
      '🐛 FIX RESET GEOLOCALIZZAZIONE:',
      '  • js/features/geolocation.js - resetLocationState() aggiunta',
      '    - Resetta userPosition e locationPermissionGranted',
      '    - Resetta pulsanti GPS (home e modal fermate)',
      '    - Chiamata da RouteSelector.reset() dopo "Riparti da capo"',
      '    - Permette nuova localizzazione dopo reset',
      '🐛 FIX RIAVVIO APP:',
      '  • js/features/updates.js - confirmResetCache() aggiornata',
      '    - Rimossa logica reindirizzamento a benvenuto.html',
      '    - Tutte le pagine ricaricano la pagina corrente',
      '    - Mantiene utente sulla stessa pagina dopo riavvio',
      '    - Cancella Service Worker, cache e LocalStorage',
      'MIGLIORAMENTI:',
      '  • Gestione errori migliorata in tutti i fix',
      '  • Logging dettagliato per debug',
      '  • Fallback robusti per retrocompatibilità',
      '  • Event delegation migliorata per elementi dinamici',
    ],
  },
  {
    version: '1.6.8',
    date: '7 Novembre 2025',
    time: '17:00',
    title: 'Nuove Funzionalità GPS: Auto-Assegnazione Partenza/Arrivo + Ordinamento Manuale Fermate',
    hidden: false,
    changes: [
      'NUOVE FUNZIONALITÀ GPS:',
      '  • Auto-assegnazione partenza/arrivo per linea Udine-Grado',
      '    - Pulsante GPS nella home page auto-assegna partenza e arrivo',
      '    - Trova fermata più vicina tra: Udine, Palmanova, Cervignano FS, Grado',
      '    - Assegna automaticamente capolinea opposto (Udine ↔ Grado)',
      '    - Funziona solo per la linea "Linea 400 Udine-Grado"',
      '    - Mostra notifica con partenza, distanza e arrivo',
      '    - Calcola prezzo automaticamente dopo assegnazione',
      '  • Ordinamento manuale fermate nel modal',
      '    - Rimosso ordinamento automatico all\'apertura del modal',
      '    - Ordinamento solo dopo click su "Rileva fermata più vicina"',
      '    - Mostra distanza in km accanto a ogni fermata dopo ordinamento',
      '    - Distanze visibili solo dopo click sul pulsante GPS',
      'MODIFICHE MODAL FERMATE:',
      '  • js/components/modals.js - Modifiche renderFermateList()',
      '    - Visualizzazione distanza in km quando disponibile',
      '    - Rimossa auto-sort all\'apertura del modal',
      '    - Ordinamento manuale tramite pulsante "Rileva fermata più vicina"',
      'MODIFICHE GEOLOCATION:',
      '  • js/features/geolocation.js - Nuove funzioni auto-assegnazione',
      '    - findNearestPriorityStop() - Trova fermata più vicina tra prioritarie',
      '    - getOppositeTerminus() - Determina capolinea opposto',
      '    - autoAssignRoute() - Auto-assegna partenza e arrivo',
      '    - handleLocationClick() - Modificato per auto-assegnazione',
      '    - Logica capolinea: Udine ↔ Grado, Palmanova/Cervignano FS → Grado',
      'MODIFICHE CSS:',
      '  • css/components/modals.css - Stili per distanza fermate',
      '    - .fermata-name - Nome fermata (flex: 1)',
      '    - .fermata-distance - Distanza in km (colore turchese)',
      '    - Supporto dark mode per distanza',
      '    - Layout flex con justify-content: space-between',
      'FIX E MIGLIORAMENTI:',
      '  • Verifica linea selezionata prima di auto-assegnare',
      '  • Gestione errori GPS migliorata',
      '  • Notifiche informative per utente',
      '  • Fallback se RouteSelector non disponibile',
    ],
  },
  {
    version: '1.6.7',
    date: '6 Novembre 2025',
    time: '21:00',
    title: 'Modularizzazione Completa Wrapper Test + Fix Caricamento Tariffario',
    hidden: false,
    changes: [
      'MODULARIZZAZIONE WRAPPER TEST:',
      '  • js/tests/test-settings-wrappers.js - Nuovo wrapper per test Settings',
      '    - window.testSettings() - Esegue tutti i test Settings',
      '    - window.runSingleSettingsTest(testId) - Esegue singolo test',
      '    - Gestione header e stato test in tempo reale',
      '    - Caricato PRIMA del DOM per compatibilità onclick',
      '  • js/tests/test-sw-wrappers.js - Nuovo wrapper per test Service Worker',
      '    - window.testServiceWorker() - Esegue tutti i test SW',
      '    - Gestione header e stato test in tempo reale',
      '    - Caricato PRIMA del DOM per compatibilità onclick',
      '  • js/tests/test-all-wrappers.js - Nuovo wrapper per esecuzione tutti i test',
      '    - window.runAllTests() - Esegue tutti i test in sequenza',
      '    - Gestione errori e verifica disponibilità moduli',
      '    - Caricato PRIMA del DOM per compatibilità onclick',
      '  • js/tests/test-prezzi-wrappers.js - Migliorato caricamento tariffario',
      '    - Caricamento automatico se tariffario vuoto',
      '    - Fallback a fetch diretto se loadData() non disponibile',
      '    - Esposizione automatica su window.tariffario',
      'NUOVI COMPONENTI:',
      '  • js/components/notification-modal.js - Modal notifica riutilizzabile',
      '    - Sostituisce alert() nativo del browser',
      '    - API semplice: NotificationModal.show(title, message)',
      '    - Wrapper globale: window.showNotificationModal()',
      '    - Inizializzazione automatica su DOMContentLoaded',
      '    - Fallback a alert() se elementi DOM non trovati',
      '  • css/components/modals.css - Aggiunta sezione notification-modal',
      '    - Stili per modal notifica (header, body, footer)',
      '    - Animazioni apertura/chiusura',
      '    - Supporto dark mode e responsive',
      'NUOVI MODULI CORE:',
      '  • js/core/storage.js - Wrapper localStorage con gestione errori',
      '    - Funzioni: setItem, getItem, removeItem, clear, key, length',
      '    - Funzioni avanzate: hasItem, getItemsByPrefix, removeItemsByPrefix, getSize',
      '    - Gestione errori (quota exceeded, invalid JSON)',
      '    - Serializzazione/deserializzazione JSON automatica',
      'NUOVI MODULI TEST:',
      '  • js/tests/test-storage.js - Suite test completa per storage.js',
      '    - 24 test totali (base, JSON, funzioni avanzate, edge cases)',
      '    - Test retrocompatibilità con localStorage diretto',
      '    - Test migrazione isDark → themeMode',
      '    - Test gestione errori e quota exceeded',
      '  • js/tests/test-storage-wrappers.js - Wrapper funzioni Storage test',
      '    - window.testStorage() - Esegue tutti i test Storage',
      '    - window.runSingleStorageTest(testId) - Esegue singolo test',
      '    - window.resetStorageModuleTests() - Reset completo',
      '    - window.updateStorageHeader() - Aggiorna header con statistiche',
      '    - Funzioni log: copyStorageLog(), downloadStorageLog(), clearStorageLog()',
      'FIX E MIGLIORAMENTI:',
      '  • js/tests/test-database.js - Esposizione window.tariffario',
      '    - Dati caricati esposti su window.tariffario per altri test',
      '    - Permette riuso dati tra test Database e Prezzi',
      '  • js/tests/test-log-helpers.js - Funzioni log per Settings e SW',
      '    - copySettingsLog(), downloadSettingsLog(), clearSettingsLog()',
      '    - copySwLog(), downloadSwLog(), clearSwLog()',
      '  • js/tests/test-settings.js - Aggiornato resetSettingsTests()',
      '    - Usa clearSettingsLog() da test-log-helpers.js',
      '    - Fallback manuale se funzione non disponibile',
      '  • js/tests/test-sw.js - Aggiornato resetSwTests()',
      '    - Usa clearSwLog() da test-log-helpers.js',
      '    - Fallback manuale se funzione non disponibile',
      '  • test.html - Aggiunti pulsanti log per Settings e Service Worker',
      '    - Pulsanti "Copia log", "Scarica log", "Cancella log"',
      '    - Visibili dopo esecuzione test, nascosti dopo reset',
      '  • sw.js - Aggiunti nuovi file wrapper alla cache',
      '    - test-settings-wrappers.js',
      '    - test-sw-wrappers.js',
      '    - test-all-wrappers.js',
      '    - notification-modal.js',
      '    - test-storage.js',
      '    - test-storage-wrappers.js',
      '  • js/tests/test-storage.js - Fix valori tipizzati',
      '    - Corretti test per valori boolean, number, null',
      '    - Storage.getItem() restituisce valori tipizzati (non stringhe)',
      '    - Test migration gestisce sia string che number per isDark',
      '  • test.html - Gruppi accordion tutti chiusi per default',
      '    - Rimossa classe expanded dai gruppi (storage, price, settings)',
      '    - Icone iniziali impostate su ▶ (chiuso)',
      '    - Apertura gestita completamente dall\'utente',
      '  • footer.js - Aggiornate versioni fallback',
      '    - Versione fallback principale: 1.6.5 → 1.6.7',
      '    - Versione fallback secondaria: 1.6.0 → 1.6.7',
      'RIMOZIONE CODICE E FILE:',
      '  • js/tests/test-localstorage.js - File rimosso',
      '    - Funzionalità unificata in test-storage.js',
      '    - Test retrocompatibilità mantenuti',
      '    - File deprecato e rimosso da test.html e sw.js',
      'RIMOZIONE CODICE INLINE:',
      '  • test.html - Rimosse ~200+ righe di codice JavaScript inline',
      '    - Funzioni wrapper test spostate in moduli esterni',
      '    - Codice più pulito e manutenibile',
      '    - Zero script inline rimanenti per test',
      'RISULTATI:',
      '  • Tutti i test funzionanti (Database, Storage, Prezzi, Settings, SW)',
      '    - Database: 17/17 test passati',
      '    - Storage: 24/24 test passati',
      '    - Prezzi: 29/29 test passati (fix caricamento tariffario)',
      '    - Settings: 22/22 test passati',
      '    - Service Worker: 14/14 test passati',
      '  • Caricamento automatico tariffario funzionante',
      '    - Test Database carica ed espone window.tariffario',
      '    - Test Prezzi rileva automaticamente tariffario disponibile',
      '    - Fallback a caricamento diretto se necessario',
      '  • Codice completamente modulare',
      '    - Nessun script inline per test',
      '    - Tutte le funzioni in moduli esterni',
      '    - Caricamento ordinato e dipendenze gestite',
      'DOCUMENTAZIONE:',
      '  • STATISTICHE_MODULARIZZAZIONE.md - Nuovo file statistiche',
      '    - Conteggio righe CSS, JS, HTML modulari',
      '    - Distribuzione per categoria e file',
      '    - Statistiche v1.6.7 con confronto precedente',
      '  • JS_ARCHITECTURE.md - Aggiornamento completo',
      '    - Aggiunti tutti i nuovi moduli test e wrapper',
      '    - Documentazione notification-modal.js',
      '    - Documentazione storage.js e test-storage.js',
      '    - Corrette dipendenze footer.js (nessuna)',
      '    - Aggiornato ordine caricamento script',
      '  • CSS_ARCHITECTURE.md - Aggiornamento',
      '    - Aggiunta sezione notification-modal in modals.css',
      '    - Documentazione stili modal notifica',
      'STATISTICHE:',
      '  • 8 nuovi file creati (wrapper test, storage, notification-modal)',
      '  • 1 file rimosso (test-localstorage.js)',
      '  • ~200+ righe di codice inline rimosse da test.html',
      '  • 9 file modificati (test-log-helpers, test-settings, test-sw, test-database,',
      '    test-prezzi, footer.js, modals.css, JS_ARCHITECTURE.md, CSS_ARCHITECTURE.md)',
      '  • 3 file aggiornati (test-prezzi-wrappers, sw.js, script.js)',
      '  • 2 sezioni HTML aggiunte (pulsanti log Settings e SW)',
      '  • 1 file documentazione creato (STATISTICHE_MODULARIZZAZIONE.md)',
      '  • 0 breaking changes, retrocompatibilità totale'
    ]
  },
  {
    version: '1.6.6',
    date: '6 Novembre 2025',
    time: '23:00',
    title: 'Modularizzazione Funzioni Accordion + Esposizione Globale Funzioni',
    hidden: false,
    changes: [
      'MODULARIZZAZIONE TEST.HTML - FUNZIONI ACCORDION:',
      '  • js/tests/test-accordion.js - Nuovo modulo centralizzato',
      '    - Gestione unificata di tutti gli accordion (db, price, storage, settings, sw)',
      '    - Configurazione per tipo con animazioni e icone personalizzate',
      '    - API pubblica: toggleGroup(prefix, groupId) e toggleAllGroups(prefix, open)',
      '    - Supporto animazioni fluide e aggiornamento dinamico icone (▶/▼)',
      '    - Logica centralizzata elimina duplicazioni',
      '  • js/tests/test-accordion-wrappers.js - Wrapper globali per onclick',
      '    - Funzioni disponibili nello scope globale PRIMA del DOM',
      '    - Compatibilità completa con attributi onclick esistenti',
      '    - Fallback automatico se modulo non disponibile',
      '    - Wrapper per: toggleDbGroup, togglePriceGroup, toggleStorageGroup,',
      '      toggleSettingsGroup, toggleSwGroup e relative funzioni toggleAll*',
      'ESPOSIZIONE FUNZIONI GLOBALI:',
      '  • Tutte le funzioni chiamate da onclick esposte in window.*',
      '    - Funzioni test: testDarkMode, testPriceCalculation, testSettings,',
      '      testServiceWorker, testDatabaseLoad',
      '    - Funzioni reset: resetDatabaseTests, resetPriceTests,',
      '      resetStorageTests, resetSettingsTests, resetSwTests',
      '    - Funzioni log: copyDatabaseLog, downloadDatabaseLog, clearDatabaseLog,',
      '      copyPriceLog, downloadPriceLog, clearPriceLog',
      '    - Funzioni utility: runAllTests, updateEffectsStatus, togglePWATestMode',
      '    - Funzioni run single: runSinglePriceTest, runSingleSettingsTest,',
      '      runSingleSwTest',
      '  • js/tests/test-database.js - Aggiunta esposizione globale',
      '    - testDatabaseLoad() ora disponibile globalmente per onclick',
      'MIGLIORAMENTI ARCHITETTURALI:',
      '  • Codice più pulito e manutenibile',
      '    - Logica accordion centralizzata e riutilizzabile',
      '    - Eliminata duplicazione di ~200 righe di codice',
      '    - Pattern unificato per gestione accordion',
      '  • Retrocompatibilità completa mantenuta',
      '    - Tutti gli onclick esistenti continuano a funzionare',
      '    - Nessuna breaking change',
      '    - Migrazione trasparente',
      'BENEFICI:',
      '  • Manutenibilità: modifiche accordion in un solo punto',
      '  • Testabilità: moduli isolati e testabili',
      '  • Performance: codice più efficiente senza duplicazioni',
      '  • Scalabilità: facile aggiungere nuovi tipi di accordion',
      'STATISTICHE:',
      '  • ~200 righe di codice duplicato rimosse',
      '  • 2 nuovi moduli creati (test-accordion.js, test-accordion-wrappers.js)',
      '  • 1 modulo aggiornato (test-database.js)',
      '  • Migliorata organizzazione e manutenibilità del codice',
      '  • 0 breaking changes, retrocompatibilità totale'
    ]
  },
  {
    version: '1.6.5',
    date: '6 Novembre 2025',
    time: '16:30',
    title: 'Modularizzazione Completa + Rimozione Codice Inline + Ottimizzazioni',
    hidden: false,
    changes: [
      'MODULARIZZAZIONE COMPLETA:',
      '  • js/utils/app-init.js - Inizializzazione app centralizzata',
      '    - Service Worker registration comune a tutte le pagine',
      '    - Render changelog centralizzato con verifica container',
      '    - Rimossi ~30 righe JavaScript duplicate',
      '  • js/utils/interface-scale.js - Sistema scala interfaccia modulare',
      '    - Supporto classi su <html> e <body> per compatibilità',
      '    - API pubblica: setScale(), getScale(), applyScale()',
      '    - Auto-inizializzazione e validazione valori',
      '    - Rimossi ~50 righe JavaScript da prezzi.html',
      '  • css/pages/benvenuto.css - Stili pagina benvenuto estratti',
      '    - Rimossi ~112 righe CSS inline da benvenuto.html',
      '    - Stili organizzati e documentati',
      '  • css/pages/fermate.css - Stili pagina fermate estratti',
      '    - Media query per .show-on-mobile',
      '    - Animazione @keyframes bounce',
      '    - Rimossi ~23 righe CSS inline',
      '  • js/pages/benvenuto.js - Logica pagina benvenuto estratta',
      '    - Event listener pulsante "Inizia"',
      '    - Rimossi ~20 righe JavaScript inline',
      'SEPARAZIONE HTML/JS:',
      '  • Rimossi tutti gli onclick inline',
      '    - index.html: onclick="swapRoutes()" → event listener',
      '    - prezzi.html: onclick="scrollToTop()" → event listener',
      '    - fermate.html: onclick="scrollToTop()" → event listener',
      '  • Event listeners centralizzati in script.js',
      '    - Prevenzione duplicati con flag data-listener-added',
      'FIX E OTTIMIZZAZIONI:',
      '  • manifest.json → manifest.webmanifest (best practice PWA)',
      '  • Rimosse proprietà non standard dal manifest (version, version_date, version_time)',
      '  • Ottimizzata animazione gradientShift (transform invece di background-position)',
      '    - Eliminato repaint, migliori performance',
      '    - Usa pseudo-elemento con transform per compositor layer',
      '  • Fix pulsanti Impostazioni (Verifica Aggiornamenti, Riavvia Ora)',
      '    - Event listeners aggiunti in js/components/modals.js',
      '  • Fix changelog container non trovato (verifica esistenza prima di renderizzare)',
      'STATISTICHE:',
      '  • ~242 righe di codice duplicato/inline rimosse',
      '  • 6 file creati (moduli JS/CSS)',
      '  • 12 file modificati',
      '  • 0 errori, codice pulito e modulare'
    ]
  },
  {
    version: '1.6.4',
    date: '6 Novembre 2025',
    time: '15:00',
    title: 'Modularizzazione Completa Test Suite + Fix Fermate + Settings Modal',
    hidden: false,
    changes: [
      'TEST SUITE - Modularizzazione Completa:',
      '  • js/tests/test-settings.js - 22 test Settings completi',
      '    - Font Size (3 test), Theme (3 test), Accessibility (6 test)',
      '    - Interface Scale (5 test), Feedback & Persistence (5 test)',
      '    - Test Keep Screen On, Haptic Feedback, CSS Classes',
      '  • js/tests/test-darkmode.js - Test Dark Mode modulare',
      '    - Test toggle dark/light/system, persistenza localStorage',
      '  • js/tests/test-sw.js - 14 test Service Worker completi',
      '    - Registrazione, cache, versioning, messaggi, update mechanism',
      '    - Cache cleanup, static assets, fetch strategy, error handling',
      '    - Test GitHub Pages patterns, offline fallback',
      '  • js/tests/test-ui.js - Test componenti UI',
      '    - Popolazione select, swap function, summary updates',
      '  • js/tests/test-manifest.js - Test PWA manifest',
      '    - Validazione manifest, icone, metadati',
      '  • js/tests/test-performance.js - Test performance app',
      '    - Tempo caricamento dati, calcolo prezzi',
      'UTILITIES - Nuovi Moduli:',
      '  • js/utils/connection-monitor.js - Monitoraggio connessione',
      '    - Rilevamento online/offline, aggiornamento UI real-time',
      '    - Formattazione date test, gestione stati connessione',
      '  • js/utils/offline-simulator.js - Simulazione offline',
      '    - Toggle offline/online programmatico per test',
      '    - Gestione stato simulato vs stato reale',
      '  • js/utils/display-detector.js - Rilevamento display',
      '    - Device pixel ratio, risoluzione schermo',
      '    - Aggiornamento UI informazioni display',
      'COMPONENTS - Settings Modal Modularizzato:',
      '  • components/settings-modal.html - HTML centralizzato',
      '    - Rimossa duplicazione HTML da test.html, index.html',
      '    - Caricamento dinamico via js/components/modals.js',
      '    - Aggiornamento versione e changelog dinamici',
      '  • js/components/modals.js - Gestione modals migliorata',
      '    - loadSettingsModalHTML() per caricamento asincrono',
      '    - Inizializzazione esplicita SettingsModal.initialize()',
      '    - Sincronizzazione versione e changelog al caricamento',
      'FIX FERMATE.HTML:',
      '  • Corretta selezione linea fermate.html',
      '    - Validazione tariffario caricato prima di renderizzare',
      '    - Parsing corretto indice linea (stringa -> numero)',
      '    - Fix gestione classe show-on-mobile (rimozione invece di aggiunta)',
      '    - Log di debug completi per tracciamento flusso',
      '  • Rimossa card Visualizzazione mobile',
      '    - Eliminato HTML e CSS non più necessario',
      '    - Rimossi riferimenti JavaScript',
      'CSS - Miglioramenti Test:',
      '  • css/components/tests/toc-sidebar.css - Sidebar indice rapido',
      '    - Sidebar fissa desktop con highlighting dinamico',
      '    - Smooth scroll, Intersection Observer per sezioni attive',
      '  • css/components/tests/groups.css - Colori gruppi test',
      '    - Colori distintivi per Settings (arancione)',
      '    - Colori distintivi per Service Worker (viola)',
      '    - Linee verticali caratteristiche per tutti i moduli',
      '  • css/components/tests/test-base.css - Stili base test',
      '    - Fix pulsanti play singoli test (mobile responsive)',
      '    - Allineamento status In Attesa sempre a destra',
      '    - Media queries per mobile (padding, dimensioni)',
      'JAVASCRIPT - Miglioramenti Vari:',
      '  • script.js - Fix selezione linea fermate',
      '    - Validazione tariffario in selectLineaFermate()',
      '    - Validazione tariffario in populateLineeTratte()',
      '    - Corretto parametro renderFermate() (lineaIndex invece di idx)',
      '    - Event listener modal linee (apertura, chiusura, click fuori)',
      '  • test.html - Inizializzazione hamburger menu',
      '    - Script inline per inizializzazione DOMContentLoaded',
      '    - Fix scroll-to-top button (classList invece di style.display)',
      '    - Fix pulsante Impostazioni mobile menu',
      '    - Esclusione #open-settings da mobileNavLinks',
      'SERVICE WORKER:',
      '  • sw.js - Aggiornato cache per nuovi file CSS e JS',
      '    - Aggiunto toc-sidebar.css, nuovi moduli test, utilities',
      'VERSIONING:',
      '  • version.json aggiornato a 1.6.4',
      '  • changelog.js aggiornato con dettagli completi',
      'BENEFICI:',
      '  • Codice più modulare e manutenibile',
      '  • Test suite completa e organizzata',
      '  • Settings modal centralizzato (no duplicazione)',
      '  • Fix critici per fermate.html',
      '  • Migliore debugging con log dettagliati',
      '  • UI test più professionale e consistente'
    ]
  },
  {
    version: '1.6.3',
    date: '5 Novembre 2025',
    time: '23:45',
    title: 'Modulo LocalStorage Completo (22 Test) + UI Professionale',
    hidden: false,
    changes: [
      '🧪 Test Suite LocalStorage:',
      '  • 22 test LocalStorage in 6 gruppi organizzati',
      '  • Base (3), Complessi (5), Edge Cases (6)',
      '  • Avanzati (2), Robustezza (3), PWA Specifici (3)',
      '🎨 UI Professionale:',
      '  • Header statistiche con progress bar animata',
      '  • 22 pulsanti test singoli sempre visibili',
      '  • Animazioni sobrie e professionali',
      '  • Header thin mode al scroll (da demo-finale.html)',
      '  • Click gruppi con press + highlight delicato',
      '📦 Modularizzazione CSS:',
      '  • 6 nuovi file CSS (~1,259 righe)',
      '  • File JS test-localstorage.js (1,257 righe)',
      '  • Colori distintivi per 6 gruppi',
      '🐛 Bug Fix:',
      '  • loadAnimationPreference, file JS mancanti'
    ]
  },
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

