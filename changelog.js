// ===== CHANGELOG DATA =====
// Array di oggetti con tutti gli aggiornamenti
// Ordinati dal più recente al più vecchio

const changelogData = [
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

