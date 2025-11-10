# 📋 Elenco Completo Test - test.html

**Data Creazione:** 10 Novembre 2025  
**Versione Progetto:** 1.6.9+  
**Contesto:** Web app PWA statica (HTML, CSS, JS) hostata su GitHub Pages per autisti TPL FVG

---

## 🎯 Scopo del Documento

Questo documento elenca **tutti i test** presenti nella pagina `test.html`, indicando:
- **Tipo di test** (benchmark, verifica funzionalità, rilevamento info)
- **Scopo del test** (cosa verifica)
- **Componente testato** (modulo, funzionalità)
- **Utilità per sviluppatore** (perché è utile)

**Nota:** La pagina `test.html` è **per lo sviluppatore**, non per l'autista. I test servono per:
- **Benchmark** dei componenti (performance, velocità)
- **Verifica errori** su dispositivi diversi
- **Rilevamento info** sul dispositivo/browser
- **Test funzionalità** prima del deploy

---

## 📊 Sezioni Test (Non Automatizzate)

### 1. **📊 Statistiche Test** (`section-stats`)
**Tipo:** Dashboard  
**Scopo:** Visualizza statistiche globali dei test (totali, passati, falliti, in attesa)  
**Utilità:** Monitoraggio complessivo dello stato dei test  
**Test automatizzati:** ❌ No (solo visualizzazione)

---

### 2. **📱 Test Modalità PWA** (`section-pwa`)
**Tipo:** Simulazione  
**Scopo:** Simula la bottom navigation senza installare la PWA  
**Utilità:** Test UI in modalità PWA senza installazione  
**Test automatizzati:** ❌ No (solo simulazione UI)

---

### 3. **🔗 Link Rapidi** (`section-quick-links`)
**Tipo:** Navigazione  
**Scopo:** Link rapidi a pagine dell'app (benvenuto, 404)  
**Utilità:** Navigazione veloce durante sviluppo  
**Test automatizzati:** ❌ No (solo link)

---

### 4. **🌐 Test Connettività** (`section-connectivity`)
**Tipo:** Simulazione  
**Scopo:** Simula modalità offline per testare banner offline  
**Utilità:** Test comportamento app senza rete  
**Test automatizzati:** ❌ No (solo simulazione `navigator.onLine`)

---

### 5. **📱 Info Device & Browser** (`section-device`)
**Tipo:** Rilevamento Info  
**Scopo:** Rileva informazioni su dispositivo, browser, OS, batteria, GPS, touch, PWA mode, connessione, display  
**Utilità:** Debug su dispositivi diversi, verifica supporto funzionalità  
**Test automatizzati:** ❌ No (solo rilevamento e visualizzazione info)

**Info Rilevate:**
- Device Type (mobile/desktop/tablet)
- Sistema Operativo
- Browser e versione
- Batteria (se supportato)
- Supporto GPS
- Supporto Touch
- PWA Mode (installata/non installata)
- Stato Connessione (online/offline)
- Tipo Display (mobile/desktop/tablet)
- Device Pixel Ratio (DPR)
- Risoluzione Logica/Fisica
- High DPI
- Viewport

---

### 6. **📍 Test Geolocalizzazione** (`section-geolocation`)
**Tipo:** Test Funzionalità + Rilevamento  
**Scopo:** Testa funzionalità GPS, simulazione posizione, monitoraggio continuo, calcolo distanza, mappa Leaflet  
**Utilità:** Verifica funzionamento GPS su dispositivi diversi, test offline, debug coordinate  
**Test automatizzati:** ⚠️ Parziale (test rapido GPS automatizzato, altri manuali)

**Funzionalità:**
- **Test Rapido GPS:** Test automatico di tutte le funzioni GPS
- **Rilevamento Posizione GPS:** Test manuale rilevamento posizione
- **Simulazione Posizione Fake:** Coordinate simulate per test offline
- **Monitoraggio Continuo:** Tracciamento GPS in tempo reale
- **Calcolo Distanza:** Calcolo distanza da posizione attuale a punto di riferimento (formula Haversine)
- **Mappa Interattiva:** Visualizzazione posizione su mappa Leaflet (richiede internet)

**Nota:** Test GPS ancora **parzialmente inline** (script inline in `test.html`)

---

### 7. **🎭 Effetti e Animazioni Attive** (`section-effects`)
**Tipo:** Rilevamento Info  
**Scopo:** Rileva e visualizza effetti CSS e animazioni attive sulla pagina  
**Utilità:** Debug CSS, verifica applicazione classi  
**Test automatizzati:** ❌ No (solo rilevamento e visualizzazione)

---

## 🧪 Test Automatizzati (Moduli)

### 8. **📦 Test Database** (`section-database`)
**Tipo:** Test Validazione + Benchmark  
**Scopo:** Verifica caricamento e validazione `database.json` (tariffe, linee, fermate, prezzi, codici)  
**Componente testato:** `database.json` (file dati statico)  
**Utilità:** Verifica integrità dati, validazione struttura, edge cases, performance caricamento  
**Modulo:** `js/tests/test-database.js`  
**Test automatizzati:** ✅ Sì (17 test)

#### **Gruppo 1: Caricamento & Struttura** (5 test)
- `test-database-load` - Caricamento database.json
- `test-database-structure` - Validazione struttura base
- `test-database-lines` - Campi obbligatori
- `test-database-types` - Tipi rigorosi
- `test-database-null-undefined` - Valori null/undefined

#### **Gruppo 2: Validazione Dati** (4 test)
- `test-database-prices` - Validazione prezzi
- `test-database-stops` - Validazione fermate
- `test-database-codes` - Validazione codici
- `test-database-encoding` - Encoding e caratteri speciali

#### **Gruppo 3: Analisi Qualità** (7 test)
- `test-database-duplicates` - Nomi linee duplicati
- `test-database-range` - Range prezzi
- `test-database-progression` - Progressività prezzi
- `test-database-format` - Formato codici
- `test-database-consistency` - Consistenza dati
- `test-database-edge-cases` - Edge cases estremi
- `test-database-size-limit` - Dimensioni massime

#### **Gruppo 4: Performance** (1 test)
- `test-database-performance` - Tempo caricamento dati (benchmark)

---

### 9. **🌙 Test Dark Mode** (`section-darkmode`)
**Tipo:** Test Funzionalità  
**Scopo:** Verifica toggle dark mode e persistenza preferenza in localStorage  
**Componente testato:** `js/features/settings.js` (modulo Settings)  
**Utilità:** Verifica funzionamento tema scuro/chiaro, persistenza preferenze  
**Modulo:** `js/tests/test-darkmode.js`  
**Test automatizzati:** ✅ Sì (2 test)

- `test-darkmode-toggle` - Toggle dark mode (dark ↔ light)
- `test-darkmode-persistence` - Persistenza preferenza in localStorage

---

### 10. **💾 Test Storage Module** (`section-storage`)
**Tipo:** Test Funzionalità + Benchmark  
**Scopo:** Verifica funzionamento modulo Storage (localStorage wrapper)  
**Componente testato:** `js/core/storage.js` (modulo Storage)  
**Utilità:** Verifica salvataggio/lettura dati, edge cases, performance, retrocompatibilità  
**Modulo:** `js/tests/test-storage.js`  
**Test automatizzati:** ✅ Sì (24 test)

#### **Gruppo 1: Operazioni Base** (8 test)
- `test-storage-set-get` - setItem() e getItem() base
- `test-storage-remove` - removeItem()
- `test-storage-default-value` - Valore di default
- `test-storage-json-object` - Oggetti JSON
- `test-storage-json-array` - Array JSON
- `test-storage-boolean` - Valori booleani
- `test-storage-number` - Valori numerici
- `test-storage-clear` - clear() (pulizia totale)

#### **Gruppo 2: Funzionalità Avanzate** (5 test)
- `test-storage-prefix-get` - getItem() con prefisso
- `test-storage-prefix-remove` - removeItem() con prefisso
- `test-storage-has-item` - hasItem() (verifica esistenza)
- `test-storage-size` - size() (conta elementi)
- `test-storage-retrocompatibility` - Retrocompatibilità con localStorage nativo

#### **Gruppo 3: Edge Cases** (5 test)
- `test-storage-null-undefined` - Valori null/undefined
- `test-storage-special-chars` - Caratteri speciali
- `test-storage-large-value` - Valori grandi
- `test-storage-multiple-operations` - Operazioni multiple
- `test-storage-invalid-json` - JSON invalido

#### **Gruppo 4: Funzionalità Aggiuntive** (6 test)
- `test-storage-performance` - Performance read/write (benchmark)
- `test-storage-iterate-keys` - Iterazione chiavi
- `test-storage-non-string` - Valori non stringa
- `test-storage-namespace` - Namespace (prefisso)
- `test-storage-migration` - Migrazione dati
- `test-storage-timestamp` - Timestamp

---

### 11. **💰 Test Prezzi** (`section-prezzi`)
**Tipo:** Test Funzionalità + Benchmark  
**Scopo:** Verifica calcolo prezzi biglietti, codici biglietto, validazione, edge cases  
**Componente testato:** `js/core/prezzi.js` (modulo Pricing)  
**Utilità:** Verifica correttezza calcolo prezzi, codici biglietto, edge cases, performance  
**Modulo:** `js/tests/test-prezzi.js`  
**Test automatizzati:** ✅ Sì (26 test)

#### **Gruppo 1: Calcolo Prezzi** (5 test)
- `test-pricing-calculate` - calculatePrice() base
- `test-pricing-ticket-code` - getTicketCode() (codice biglietto)
- `test-pricing-format` - formatPrice() (formattazione prezzo)
- `test-pricing-validation` - Validazione input
- `test-pricing-route` - Calcolo prezzo per tratta

#### **Gruppo 2: Edge Cases** (8 test)
- `test-pricing-same-stop` - Stessa fermata (prezzo 0)
- `test-pricing-out-of-range` - Indici fuori range
- `test-pricing-fallback` - Fallback prezzo
- `test-pricing-empty-tariffario` - Tariffario vuoto
- `test-pricing-negative-indices` - Indici negativi
- `test-pricing-string-indices` - Indici stringa
- `test-pricing-zero-price` - Prezzo zero
- `test-pricing-missing-matrices` - Matrici mancanti

#### **Gruppo 3: Validazione Dati** (6 test)
- `test-pricing-multiple-lines` - Linee multiple
- `test-pricing-null-price` - Prezzo null
- `test-pricing-undefined-price` - Prezzo undefined
- `test-pricing-string-price` - Prezzo stringa
- `test-pricing-line-not-exists` - Linea non esistente
- `test-pricing-result-structure` - Struttura risultato

#### **Gruppo 4: Edge Cases Estremi** (4 test)
- `test-pricing-nan-price` - Prezzo NaN
- `test-pricing-infinity-price` - Prezzo Infinity
- `test-pricing-negative-price` - Prezzo negativo
- `test-pricing-fermate-not-array` - Fermate non array

#### **Gruppo 5: Funzionalità Avanzate** (3 test)
- `test-pricing-code-with-spaces` - Codice con spazi
- `test-pricing-price-code-only` - Solo prezzo/codice
- `test-pricing-fallback-actual` - Fallback effettivo

#### **Gruppo 6: Performance e Validazione** (2 test)
- `test-pricing-performance` - Performance calcolo (benchmark)
- `test-pricing-symmetry` - Simmetria prezzi (A→B = B→A)
- `test-pricing-extreme-values` - Valori estremi

---

### 12. **🧭 Test Route Selector** (`section-route`)
**Tipo:** Test Funzionalità  
**Scopo:** Verifica selezione linea/partenza/arrivo, stato UI, Storage, swap, reset  
**Componente testato:** `js/features/route-selector.js` (modulo RouteSelector)  
**Utilità:** Verifica funzionamento selezione tratte, persistenza in Storage, stato UI  
**Modulo:** `js/tests/test-route-selector.js`  
**Test automatizzati:** ✅ Sì (10 test)

#### **Gruppo 1: Test Base** (2 test)
- `test-route-module` - Disponibilità modulo RouteSelector
- `test-route-initial-state` - Stato iniziale (vuoto)

#### **Gruppo 2: Selezione** (3 test)
- `test-route-select-linea` - Selezione linea
- `test-route-select-partenza` - Selezione partenza
- `test-route-select-arrivo` - Selezione arrivo

#### **Gruppo 3: Funzionalità** (3 test)
- `test-route-swap` - Swap partenza/arrivo
- `test-route-reset` - Reset selezioni
- `test-route-getters` - Metodi getter (getState(), getLineaIdx(), ecc.)

#### **Gruppo 4: Storage** (2 test)
- `test-route-storage-save` - Salvataggio Storage (localStorage)
- `test-route-storage-restore` - Ripristino Storage (localStorage)

---

### 13. **⚙️ Test Settings** (`section-settings`)
**Tipo:** Test Funzionalità  
**Scopo:** Verifica tutte le impostazioni utente (tema, font, accessibilità, scale, feedback)  
**Componente testato:** `js/features/settings.js` (modulo Settings)  
**Utilità:** Verifica funzionamento impostazioni, applicazione CSS, persistenza localStorage  
**Modulo:** `js/tests/test-settings.js`  
**Test automatizzati:** ✅ Sì (19 test)

#### **Gruppo 1: Dimensione Testo** (3 test)
- `test-settings-font-size-normal` - Font Size: Normal
- `test-settings-font-size-large` - Font Size: Large
- `test-settings-font-size-xlarge` - Font Size: XLarge

#### **Gruppo 2: Tema** (3 test)
- `test-settings-theme-light` - Tema: Light
- `test-settings-theme-dark` - Tema: Dark
- `test-settings-theme-system` - Tema: System

#### **Gruppo 3: Accessibilità** (6 test)
- `test-settings-high-contrast` - Contrasto Alto
- `test-settings-touch-friendly` - Touch Friendly
- `test-settings-reduce-motion` - Riduci Animazioni
- `test-settings-extra-spacing` - Spaziatura Extra
- `test-settings-compact-layout` - Layout Compatto
- `test-settings-blue-light-filter` - Filtro Luce Blu

#### **Gruppo 4: Dimensione Interfaccia** (5 test)
- `test-settings-interface-scale-75` - Interface Scale: 75%
- `test-settings-interface-scale-85` - Interface Scale: 85%
- `test-settings-interface-scale-100` - Interface Scale: 100%
- `test-settings-interface-scale-115` - Interface Scale: 115%
- `test-settings-interface-scale-125` - Interface Scale: 125%

#### **Gruppo 5: Feedback e Persistenza** (5 test)
- `test-settings-haptic-feedback` - Feedback Aptico
- `test-settings-animation-toggle` - Toggle Animazioni
- `test-settings-keep-screen-on` - Keep Screen On (Wake Lock)
- `test-settings-localstorage-persistence` - Persistenza localStorage
- `test-settings-css-classes` - Classi CSS applicate

---

### 14. **⚙️ Test Service Worker (PWA)** (`section-sw`)
**Tipo:** Test Funzionalità PWA + Benchmark  
**Scopo:** Verifica registrazione Service Worker, cache, offline fallback, update mechanism  
**Componente testato:** `sw.js` (Service Worker PWA)  
**Utilità:** Verifica funzionamento PWA, cache, offline, update mechanism, GitHub Pages patterns  
**Modulo:** `js/tests/test-sw.js`  
**Test automatizzati:** ✅ Sì (14 test)

#### **Gruppo 1: Registrazione e Base** (3 test)
- `test-sw-registration` - Registrazione Service Worker
- `test-sw-cache` - Verifica cache (static/dynamic)
- `test-sw-version-not-cached` - version.json non in cache (sempre network)

#### **Gruppo 2: Cache Management** (4 test)
- `test-sw-cache-size` - Dimensione cache (benchmark)
- `test-sw-cache-cleanup` - Cache cleanup (rimozione vecchie cache)
- `test-sw-static-assets` - Static assets verification (verifica risorse statiche)
- `test-sw-fetch-strategy` - Fetch strategy (cache-first per static, network-first per dynamic)

#### **Gruppo 3: Messaggi e Comunicazione** (4 test)
- `test-sw-messages` - Messaggi al Service Worker (postMessage)
- `test-sw-clear-cache-message` - CLEAR_CACHE message
- `test-sw-skip-waiting-message` - SKIP_WAITING message
- `test-sw-offline-fallback` - Offline fallback (fallback.html)

#### **Gruppo 4: Strategie e Patterns** (3 test)
- `test-sw-update-mechanism` - Update mechanism (verifica aggiornamenti)
- `test-sw-github-pages-patterns` - GitHub Pages patterns (gestione path GitHub Pages)
- `test-sw-error-handling` - Error handling (gestione errori)

---

### 15. **🎨 Test UI Components** (`section-ui`)
**Tipo:** Test Funzionalità UI  
**Scopo:** Verifica popolamento select, funzione swap, aggiornamento riepilogo  
**Componente testato:** `js/features/page-renderers.js` (funzioni UI)  
**Utilità:** Verifica funzionamento UI, popolamento select, swap partenza/arrivo, riepilogo  
**Modulo:** `js/tests/test-ui.js`  
**Test automatizzati:** ✅ Sì (3 test)

- `test-ui-selects` - Popolamento select (linee, fermate)
- `test-ui-swap` - Funzione swap percorso (partenza ↔ arrivo)
- `test-ui-summary` - Aggiornamento riepilogo (prezzo, codice)

---

### 16. **📱 Test Manifest PWA** (`section-manifest`)
**Tipo:** Test Validazione  
**Scopo:** Verifica caricamento e validazione `manifest.webmanifest`, icone PWA  
**Componente testato:** `manifest.webmanifest` (file manifest PWA)  
**Utilità:** Verifica validità manifest, presenza icone, campi obbligatori  
**Modulo:** `js/tests/test-manifest.js`  
**Test automatizzati:** ✅ Sì (2 test)

- `test-manifest-load` - Caricamento manifest.webmanifest
- `test-manifest-icons` - Validazione icone (verifica esistenza file icone)

---

### 17. **⚡ Test Performance** (`section-performance`)
**Tipo:** Test Benchmark  
**Scopo:** Verifica performance caricamento dati e calcolo prezzi  
**Componente testato:** Caricamento `database.json`, calcolo prezzi  
**Utilità:** Benchmark performance, verifica velocità su dispositivi diversi  
**Modulo:** `js/tests/test-performance.js`  
**Test automatizzati:** ✅ Sì (2 test)

- `test-perf-load-time` - Tempo caricamento dati (database.json)
- `test-perf-calc-time` - Tempo calcolo prezzo (benchmark calcolo)

---

## 📊 Riepilogo Test

### **Test Automatizzati**
- **Database:** 17 test
- **Dark Mode:** 2 test
- **Storage:** 24 test
- **Prezzi:** 26 test
- **Route Selector:** 10 test
- **Settings:** 19 test
- **Service Worker:** 14 test
- **UI Components:** 3 test
- **Manifest:** 2 test
- **Performance:** 2 test

**Totale test automatizzati:** **119 test**

### **Test Non Automatizzati (Rilevamento/Simulazione)**
- **Statistiche:** Dashboard (visualizzazione)
- **Modalità PWA:** Simulazione UI
- **Link Rapidi:** Navigazione
- **Connettività:** Simulazione offline
- **Device Info:** Rilevamento info (9 card)
- **Geolocalizzazione:** Test funzionalità GPS (parzialmente automatizzato)
- **Effetti:** Rilevamento CSS

**Totale sezioni non automatizzate:** **7 sezioni**

---

## 🎯 Tipi di Test

### **1. Test Validazione**
Verificano **correttezza dati** e **struttura**:
- Database (validazione `database.json`)
- Manifest (validazione `manifest.webmanifest`)
- Storage (validazione dati localStorage)

### **2. Test Funzionalità**
Verificano **funzionamento** componenti:
- Dark Mode (toggle, persistenza)
- Storage (salvataggio/lettura)
- Prezzi (calcolo, codici)
- Route Selector (selezione, swap, reset)
- Settings (impostazioni, CSS)
- Service Worker (cache, offline)
- UI Components (select, swap, riepilogo)

### **3. Test Benchmark**
Verificano **performance** e **velocità**:
- Database (tempo caricamento)
- Storage (performance read/write)
- Prezzi (tempo calcolo)
- Service Worker (dimensione cache)
- Performance (caricamento dati, calcolo prezzi)

### **4. Test Edge Cases**
Verificano **comportamento** in casi limite:
- Database (valori null, duplicati, edge cases)
- Storage (valori grandi, JSON invalido, caratteri speciali)
- Prezzi (indici fuori range, prezzi null, edge cases)

### **5. Rilevamento Info**
Rilevano **informazioni** su dispositivo/browser:
- Device Info (tipo, OS, browser, batteria, GPS, touch, PWA, connessione, display)
- Effetti (CSS attivi)

### **6. Simulazione**
Simulano **comportamento** per test:
- Modalità PWA (bottom navigation)
- Connettività (offline)
- GPS (posizione fake)

---

## 🔍 Test Mancanti (Non Implementati)

### **Test Non Necessari (Web App Statica)**
- ❌ **Test Back-end:** Non presente (web app statica)
- ❌ **Test API:** Non presente (nessuna API esterna)
- ❌ **Test Database Server:** Non presente (solo file JSON statico)
- ❌ **Test Autenticazione:** Non presente (app pubblica)
- ❌ **Test Pagamento:** Non presente (app informativa)

### **Test Potenzialmente Utili (Da Valutare)**
- ⚠️ **Test Geolocalizzazione Completo:** Attualmente parzialmente inline (da modularizzare)
- ⚠️ **Test Performance Esteso:** Attualmente solo 2 test (caricamento, calcolo)
- ⚠️ **Test Cross-Browser:** Attualmente non automatizzato (test manuale)
- ⚠️ **Test Responsive:** Attualmente non automatizzato (test manuale)
- ⚠️ **Test Accessibilità:** Attualmente non automatizzato (test manuale)

---

## 📝 Note Importanti

### **Web App Statica (GitHub Pages)**
- ✅ **Nessun back-end:** Tutti i test sono per componenti front-end
- ✅ **File JSON statico:** `database.json` caricato via fetch
- ✅ **localStorage:** Unico storage utilizzato (no database server)
- ✅ **Service Worker:** Cache risorse statiche (PWA)
- ✅ **Offline:** Funzionalità offline via Service Worker

### **Test per Sviluppatore**
- ✅ **Benchmark:** Verifica performance su dispositivi diversi
- ✅ **Debug:** Rilevamento info dispositivo/browser
- ✅ **Validazione:** Verifica correttezza dati e funzionalità
- ✅ **Edge Cases:** Verifica comportamento in casi limite

### **Test Non per Autisti**
- ❌ **Non sono test funzionali** per l'utente finale
- ❌ **Non sono test di integrazione** end-to-end
- ✅ **Sono test di sviluppo** per verificare componenti

---

## 🚀 Utilizzo

### **Eseguire Tutti i Test**
```javascript
// Clicca su "▶️ Esegui tutti i test" nella sezione Statistiche
```

### **Eseguire Test Singolo**
```javascript
// Clicca sul pulsante "▶" accanto al test specifico
```

### **Eseguire Test per Modulo**
```javascript
// Clicca sul pulsante "🧪 Test [Modulo]" nella sezione del modulo
```

### **Visualizzare Risultati**
```javascript
// I risultati vengono visualizzati nell'area "test-output" di ogni sezione
// Puoi copiare, scaricare o cancellare i log
```

---

## 📚 File Correlati

- `test.html` - Pagina test principale
- `js/tests/test-*.js` - Moduli test automatizzati
- `js/tests/test-*-wrappers.js` - Wrapper event delegation
- `js/tests/test-log-helpers.js` - Helper log (copia, download, clear)
- `js/tests/test-accordion-wrappers.js` - Gestione accordion gruppi
- `css/components/tests/*.css` - Stili test

---

**Ultimo aggiornamento:** 10 Novembre 2025  
**Versione documento:** 1.0

