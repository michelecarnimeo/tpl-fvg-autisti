# 📜 Architettura JavaScript - TPL FVG Autisti

Questo documento descrive l'architettura JavaScript modulare del progetto.

## 📁 Struttura delle Cartelle

```
tpl-fvg-autisti/
├── js/
│   ├── core/
│   │   ├── config.js          ← Configurazione globale ⏳ TODO
│   │   ├── utils.js           ← Utilities generiche ⏳ TODO
│   │   └── storage.js         ← Gestione localStorage ✅ FATTO
│   │
│   ├── components/
│   │   ├── footer.js           ✅ FATTO
│   │   ├── changelog.js        ✅ FATTO
│   │   ├── navbar.js           ⏳ TODO
│   │   ├── modals.js           ✅ FATTO - UI modali (Fermate, Linee, Settings)
│   │   ├── notification-modal.js ✅ FATTO - Modal notifica riutilizzabile
│   │   ├── hamburger-menu.js   ✅ FATTO (09/11/2025) - Menu mobile hamburger
│   │   ├── mega-dropdown-settings.js ✅ FATTO (09/11/2025) - Mega dropdown impostazioni (desktop)
│   │   ├── pwa-install.js      ✅ FATTO (09/11/2025) - Banner installazione PWA
│   │   └── pwa.js              ⏳ TODO (PWA bottom nav da modularizzare)
│   │
│   ├── features/
│   │   ├── updates.js          ✅ FATTO - Verifica aggiornamenti
│   │   ├── settings.js         ✅ FATTO - Logica impostazioni (tema, font, accessibilità)
│   │   ├── prezzi.js           ✅ FATTO - Calcolo prezzi (funzioni pure)
│   │   ├── route-selector.js   ✅ FATTO - Gestione selezione linea/partenza/arrivo
│   │   ├── geolocation.js      ✅ FATTO - Geolocalizzazione e ordinamento fermate
│   │   ├── page-renderers.js   ✅ FATTO - Rendering pagine fermate/prezzi, selezione linee, ricerca
│   │   ├── tests-ui.js         ✅ FATTO - UI componenti test
│   │   ├── toc-navigation.js   ✅ FATTO (2025-11-10) - Smooth scroll e highlight TOC (indice mobile + sidebar desktop)
│   │   └── animations.js       ← Logica animazioni JS ⏳ TODO
│   │
│   ├── data/
│   │   ├── tariffario.js       ✅ FATTO - Gestione dati tariffario (caricamento, cache, eventi)
│   │   └── database.js         ← Gestione database.json ⏳ TODO
│   │
│   ├── utils/
│   │   ├── ui-helpers.js       ✅ FATTO - Funzioni UI helper (scroll to top, swap button)
│   │   ├── offline-notifications.js ✅ FATTO - Notifiche online/offline
│   │   ├── connection-monitor.js ✅ FATTO - Monitor connessione internet
│   │   ├── offline-simulator.js ✅ FATTO - Simulatore offline
│   │   ├── display-detector.js ✅ FATTO - Rilevamento display
│   │   └── interface-scale.js  ✅ FATTO - Scala interfaccia
│   │
│   ├── tests/
│   │   ├── test-accordion.js   ✅ FATTO - Gestione accordion gruppi
│   │   ├── test-accordion-wrappers.js ✅ FATTO - Wrapper funzioni accordion + Event delegation toggle gruppi
│   │   ├── test-all-wrappers.js ✅ FATTO - Wrapper runAllTests() + Event delegation
│   │   ├── test-database.js    ✅ FATTO - Suite test database.json
│   │   ├── test-darkmode.js    ✅ FATTO - Suite test dark mode
│   │   ├── test-darkmode-wrappers.js ✅ FATTO - Wrapper funzioni Dark Mode test + Event delegation
│   │   ├── test-log-helpers.js ✅ FATTO - Funzioni gestione log (copia, download, clear)
│   │   ├── test-manifest.js    ✅ FATTO - Suite test manifest PWA
│   │   ├── test-performance.js ✅ FATTO - Suite test performance
│   │   ├── test-prezzi.js      ✅ FATTO - Suite test per prezzi.js
│   │   ├── test-prezzi-wrappers.js ✅ FATTO - Wrapper funzioni Prezzi test + Event delegation
│   │   ├── test-route-selector.js ✅ FATTO - Suite test Route Selector
│   │   ├── test-route-selector-wrappers.js ✅ FATTO - Wrapper funzioni Route Selector test + Event delegation
│   │   ├── test-settings.js    ✅ FATTO - Suite test per settings.js
│   │   ├── test-settings-wrappers.js ✅ FATTO - Wrapper funzioni Settings test + Event delegation
│   │   ├── test-storage.js     ✅ FATTO - Suite test per storage.js (24 test)
│   │   ├── test-storage-wrappers.js ✅ FATTO - Wrapper funzioni Storage test + Event delegation
│   │   ├── test-sw.js          ✅ FATTO - Suite test Service Worker
│   │   ├── test-sw-wrappers.js ✅ FATTO - Wrapper funzioni Service Worker test + Event delegation
│   │   ├── test-ui.js          ✅ FATTO - Suite test UI componenti
│   │   ├── test-ui-manifest-performance-wrappers.js ✅ FATTO (09/11/2025) - Wrapper test UI/Manifest/Performance + Event delegation
│   │   ├── test-utils.js       ✅ FATTO - Utility test (logging, status, statistiche)
│   │   ├── device-detector.js  ✅ FATTO (09/11/2025) - Rilevamento informazioni dispositivo
│   │   ├── effects-status.js   ✅ FATTO (09/11/2025) - Status effetti (dark mode, animazioni, ecc.) + Event delegation
│   │   ├── error-404-simulator.js ✅ FATTO (09/11/2025) - Simulatore errore 404
│   │   ├── pwa-test-mode.js    ✅ FATTO (09/11/2025) - Modalità test PWA
│   │   └── gps/                ✅ FATTO (09/11/2025) - Moduli GPS avanzati
│   │       ├── helpers.js      ✅ FATTO - Helper funzioni GPS
│   │       ├── fake-position.js ✅ FATTO - Simulazione posizione GPS
│   │       ├── reset-data.js   ✅ FATTO - Reset dati GPS
│   │       ├── distance-calculator.js ✅ FATTO - Calcolo distanze
│   │       ├── map-leaflet.js  ✅ FATTO - Integrazione mappa Leaflet
│   │       ├── watch-position.js ✅ FATTO - Monitoraggio continuo posizione
│   │       ├── quick-test.js   ✅ FATTO - Test rapido GPS
│   │       ├── export-report.js ✅ FATTO - Esportazione report GPS
│   │       └── test-geolocation.js ✅ FATTO - Test geolocalizzazione principale
│   │
│   └── main.js                 ← Entry point, orchestra tutto ⏳ TODO
│
├── script.js                   ← File originale (da dismettere gradualmente)
├── footer.js                   ✅ FATTO (da mantenere o spostare)
├── changelog.js                ✅ FATTO (da mantenere o spostare)
└── ...
```

---

## 🎯 Ordine di Caricamento (IMPORTANTE!)

I file JavaScript devono essere caricati in questo ordine preciso:

```html
<!-- 1. CORE (sempre per primo!) -->
<script src="js/core/config.js"></script>
<script src="js/core/utils.js"></script>
<script src="js/core/storage.js"></script>

<!-- 2. DATA (dopo core, prima features) -->
<script src="js/data/tariffario.js"></script>

<!-- 3. FEATURES (ordine importante per dipendenze) -->
<script src="js/features/updates.js"></script>
<script src="js/features/settings.js"></script>
<script src="js/features/prezzi.js"></script>
<script src="js/features/route-selector.js"></script>
<script src="js/features/geolocation.js"></script>
<script src="js/features/page-renderers.js"></script>
<script src="js/features/tests-ui.js"></script>

<!-- 4. UTILS (funzioni helper) -->
<script src="js/utils/ui-helpers.js"></script>
<script src="js/utils/offline-notifications.js"></script>

<!-- 4. COMPONENTI (in qualsiasi ordine) -->
<script src="js/components/footer.js"></script>
<script src="js/components/changelog.js"></script>
<script src="js/components/navbar.js"></script>
<script src="js/components/modals.js"></script>
<script src="js/components/notification-modal.js"></script>
<script src="js/components/pwa.js"></script>

<!-- 5. TEST (solo per test.html, opzionali) -->
<!-- Core test utilities -->
<script src="js/tests/test-utils.js"></script>
<script src="js/tests/test-log-helpers.js"></script>
<!-- Test modules -->
<script src="js/tests/test-database.js"></script>
<script src="js/tests/test-storage.js"></script>
<script src="js/tests/test-prezzi.js"></script>
<script src="js/tests/test-settings.js"></script>
<script src="js/tests/test-sw.js"></script>
<script src="js/tests/test-route-selector.js"></script>
<script src="js/tests/test-darkmode.js"></script>
<!-- Test wrappers (event delegation automatica, NO onclick inline) -->
<script src="js/tests/test-accordion-wrappers.js"></script>
<script src="js/tests/test-storage-wrappers.js"></script>
<script src="js/tests/test-prezzi-wrappers.js"></script>
<script src="js/tests/test-settings-wrappers.js"></script>
<script src="js/tests/test-sw-wrappers.js"></script>
<script src="js/tests/test-route-selector-wrappers.js"></script>
<script src="js/tests/test-darkmode-wrappers.js"></script>
<script src="js/tests/test-all-wrappers.js"></script>
<script src="js/tests/test-ui-manifest-performance-wrappers.js"></script>
<!-- Features test page -->
<script src="js/features/toc-navigation.js"></script>
<script src="js/tests/effects-status.js"></script>
<script src="js/tests/device-detector.js"></script>

<!-- 6. MAIN (sempre ultimo!) -->
<script src="js/main.js"></script>
```

**Perché questo ordine?**

- Il **core** fornisce utilities fondamentali usate da tutti
- I **data** forniscono dati usati da features e componenti
- I **features** usano core e data
- I **componenti** usano core, data e features
- Il **main** orchestra tutto e inizializza l'app

---

## 📋 Descrizione dei File

### **1. core/** (Fondamenta)

#### **core/config.js** ⏳

**Contenuto:**

- Costanti globali dell'app
- Configurazioni di default
- Variabili d'ambiente
- Versioni e metadata

**Esempio:**

```javascript
// Configurazione globale app
export const APP_CONFIG = {
  version: "1.5.6",
  name: "TPL FVG Autisti",
  cacheVersion: "v4",
  defaultLanguage: "it",
};

// Configurazioni animazioni
export const ANIMATION_CONFIG = {
  duration: {
    fast: 200,
    normal: 300,
    slow: 500,
  },
  easing: {
    ease: "ease",
    bezier: "cubic-bezier(0.4, 0, 0.2, 1)",
  },
};

// Configurazioni haptic
export const HAPTIC_PATTERNS = {
  light: 20,
  medium: 50,
  strong: 100,
};
```

**Dipendenze:** Nessuna  
**Usato da:** Tutti gli altri file JavaScript

---

#### **core/utils.js** ⏳

**Contenuto:**

- Utilities generiche riutilizzabili
- Helper functions comuni
- Validazioni base
- Formattazione dati

**Esempio:**

```javascript
// Utilities generiche
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export function formatPrice(price) {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
  }).format(price);
}

export function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
```

**Dipendenze:** Nessuna (o `core/config.js`)  
**Usato da:** Tutti gli altri file JavaScript

---

#### **core/storage.js** ⏳

**Contenuto:**

- Wrapper per localStorage
- Gestione errori localStorage
- Validazione dati
- Migrazione dati (se necessario)

**Esempio:**

```javascript
// Storage utilities
export function setItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error("Errore salvataggio localStorage:", error);
    return false;
  }
}

export function getItem(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error("Errore lettura localStorage:", error);
    return defaultValue;
  }
}
```

**Dipendenze:** Nessuna  
**Usato da:** Features e componenti

---

### **2. data/** (Gestione Dati)

#### **data/database.js** ⏳

**Contenuto:**

- Caricamento `database.json`
- Caching dati
- Gestione errori caricamento
- Validazione struttura dati

**Esempio:**

```javascript
// Gestione database.json
let databaseCache = null;

export async function loadDatabase() {
  if (databaseCache) return databaseCache;

  try {
    const response = await fetch("./database.json");
    databaseCache = await response.json();
    return databaseCache;
  } catch (error) {
    console.error("Errore caricamento database:", error);
    throw error;
  }
}

export function getDatabase() {
  return databaseCache;
}
```

**Dipendenze:** `core/utils.js`  
**Usato da:** Features e componenti

---

#### **data/tariffario.js** ⏳

**Contenuto:**

- Accesso ai dati del tariffario
- Query e filtri
- Calcolo tratte
- Validazione linee/fermate

**Esempio:**

```javascript
// Gestione tariffario
import { loadDatabase } from "./database.js";

let tariffario = null;

export async function loadTariffario() {
  const db = await loadDatabase();
  tariffario = db.tariffario;
  return tariffario;
}

export function getLinea(index) {
  return tariffario?.[index];
}

export function getFermata(lineaIndex, fermataIndex) {
  const linea = getLinea(lineaIndex);
  return linea?.fermate?.[fermataIndex];
}
```

**Dipendenze:** `data/database.js`  
**Usato da:** Features (prezzi.js)

---

### **3. features/** (Funzionalità)

#### **features/updates.js** ✅

**Contenuto:**

- Verifica aggiornamenti disponibili
- Confronto versioni semantiche
- Reset cache e aggiornamento app
- Gestione modal verifica aggiornamenti

**Dipendenze:** `components/changelog.js` (usa API pubblica `getChangelogVersion()`)  
**Usato da:** Componenti (modals.js, navbar.js), script.js

**Nota:** Usa solo l'API pubblica di `changelog.js` per ottenere la versione corrente, mantenendo la separazione delle responsabilità.

**Come aggiornare la versione:**
1. **GitHub Actions** (raccomandato): Vai su Actions → "Aggiorna Versione App" → Inserisci versione e note → Esegui workflow → **Aggiorna manualmente `changelog.js`** dopo l'esecuzione
2. **Manuale**: Aggiorna `version.json`, `changelog.js`, `manifest.json` → Commit e push
3. **⚠️ Importante**: Il workflow GitHub Actions cerca di aggiornare costanti in `script.js` che non esistono più. Dopo l'esecuzione, aggiorna manualmente `changelog.js` con la nuova versione.

---

#### **features/settings.js** ⏳

**Contenuto:**

- Logica di gestione impostazioni applicazione
- Funzioni di settaggio: tema, dimensione testo, accessibilità
- Salvataggio/caricamento preferenze da localStorage
- Gestione classi CSS per le impostazioni

**Funzioni principali:**

- `setThemeMode(mode)` - Imposta tema (system/light/dark)
- `setFontSize(level)` - Imposta dimensione testo
- `setHighContrast(enabled)` - Attiva/disattiva contrasto alto
- `setTouchFriendly(enabled)` - Attiva/disattiva modalità touch-friendly
- `setHapticFeedback(enabled)` - Attiva/disattiva feedback aptico
- `setReduceMotion(enabled)` - Attiva/disattiva riduzione animazioni
- `setKeepScreenOn(enabled)` - Attiva/disattiva Wake Lock API
- `setExtraSpacing(enabled)` - Attiva/disattiva spaziatura extra
- `setCompactLayout(enabled)` - Attiva/disattiva layout compatto
- `setBlueLightFilter(enabled)` - Attiva/disattiva filtro luce blu
- `setInterfaceScale(scale)` - Imposta scala interfaccia
- `toggleAnimation()` - Toggle animazione sfondo
- `triggerHaptic(pattern, force)` - Trigger feedback aptico
- Funzioni di caricamento: `loadTheme()`, `loadFontSize()`, ecc.

**Dipendenze:** `core/storage.js` (opzionale, usa localStorage direttamente)  
**Usato da:** `components/modals.js` (SettingsModal passa queste funzioni come callback)

**Nota:** Gestisce solo la logica di business delle impostazioni. La UI del modal Settings è in `components/modals.js`.

---

#### **features/location.js** ⏳

**Contenuto:**

- Geolocalizzazione utente
- Calcolo distanze (Haversine)
- Ordinamento fermate per distanza
- Gestione permessi

**Esempio:**

```javascript
// Geolocalizzazione
export function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocalizzazione non supportata"));
      return;
    }

    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 8000,
      maximumAge: 0,
    });
  });
}

export function calculateDistance(lat1, lon1, lat2, lon2) {
  // Formula Haversine
}
```

**Dipendenze:** `core/utils.js`, `data/tariffario.js`  
**Usato da:** Componenti (modals.js, navbar.js)

---

#### **features/prezzi.js** ✅ FATTO

**Contenuto:**

- **Logica pura di calcolo prezzi** (senza dipendenze DOM)
- Calcolo prezzo dalla matrice `tariffario[lineaIdx].prezzi[partenzaIdx][arrivoIdx]`
- Recupero codice biglietto da `tariffario[lineaIdx].codici[partenzaIdx][arrivoIdx]`
- Fallback su `tariffarioAggiornato` per codici mancanti
- Validazione tratte e selezioni
- Formattazione prezzi per display
- **Futuro**: Calcolo andata/ritorno

**Completato:** 1 Novembre 2025

**API Pubblica:**

```javascript
window.Pricing = {
  // Calcola prezzo per una tratta
  calculatePrice(
    lineaIdx,
    partenzaIdx,
    arrivoIdx,
    tariffario,
    tariffarioAggiornato = null
  ) {
    // Ritorna: { prezzo: number|null, codice: string, valido: boolean }
  },

  // Recupera solo il codice biglietto
  getTicketCode(
    lineaIdx,
    partenzaIdx,
    arrivoIdx,
    tariffario,
    tariffarioAggiornato = null
  ) {
    // Ritorna: string (codice o '')
  },

  // Valida selezione (linea, partenza, arrivo)
  isValidSelection(lineaIdx, partenzaIdx, arrivoIdx, tariffario) {
    // Ritorna: boolean
  },

  // Valida se tratta esiste nella matrice
  isRouteAvailable(lineaIdx, partenzaIdx, arrivoIdx, tariffario) {
    // Ritorna: boolean
  },

  // Formatta prezzo per display
  formatPrice(prezzo) {
    // Ritorna: string "X.XX €" o "-"
  },

  // FUTURO: Calcolo andata + ritorno
  // calculateRoundTrip(...) { ... }
};
```

**Principi di Design:**

- **Funzioni pure**: Stesso input → stesso output, nessun effetto collaterale
- **Nessuna dipendenza DOM**: Logica completamente separata dall'UI
- **Parametri espliciti**: `tariffario` passato come parametro (non globale) per testabilità
- **Gestione errori**: Ritorna oggetti con flag `valido` invece di lanciare eccezioni
- **Fallback opzionale**: `tariffarioAggiornato` come parametro opzionale

**Esempio d'uso:**

```javascript
// In script.js
const result = Pricing.calculatePrice(
  lineaIdx,
  partenzaIdx,
  arrivoIdx,
  tariffario,
  tariffarioAggiornato
);

if (result.valido) {
  summaryPrezzo.textContent = Pricing.formatPrice(result.prezzo);
  summaryCodice.textContent = result.codice || "-";
} else {
  // Gestisci errore...
}
```

**Dipendenze:** Nessuna (logica pura)  
**Usato da:** `script.js` (orchestrazione UI), future pagine che necessitano calcolo prezzi

---

#### **features/toc-navigation.js** ✅ (2025-11-10)

**Contenuto:**

- Gestione navigazione Table of Contents (TOC)
- Smooth scroll per link dell'indice mobile (`#section-index`)
- Smooth scroll per link della sidebar desktop (`#toc-sidebar`)
- Intersection Observer per highlight dinamico delle sezioni attive
- Scroll automatico della sidebar per mantenere visibile il link attivo
- Evidenziazione della prima sezione visibile all'avvio
- Aggiornamento URL senza ricaricare la pagina

**API Pubblica:**

```javascript
window.TOCNavigation = {
  init: init,              // Inizializza tutto
  initMobile: initMobileTOC,  // Solo indice mobile
  initSidebar: initSidebarTOC // Solo sidebar desktop
};
```

**Dipendenze:** Nessuna (solo DOM)  
**Usato da:** `test.html`

**Funzionalità:**

1. **Indice Mobile (`#section-index`)**:
   - Smooth scroll per link `.toc-link`
   - Aggiorna URL con `history.replaceState`

2. **Sidebar Desktop (`#toc-sidebar`)**:
   - Smooth scroll con offset per navbar (80px)
   - Intersection Observer per evidenziare sezione attiva
   - Scroll automatico sidebar per mantenere link visibile
   - Evidenziazione prima sezione visibile all'avvio

**Auto-inizializzazione:** Si attiva automaticamente su `DOMContentLoaded`

---

### **5. tests/** (Test Suite)

#### **tests/test-utils.js** ✅

**Contenuto:**

- Utility functions per logging, status updates, statistiche nei test
- `TestUtils.log()` - Logging con colori e tipi
- `TestUtils.updateTestStatus()` - Aggiornamento status test (pass/fail/running)
- `TestUtils.updateStats()` - Aggiornamento statistiche test (passed, failed, time)

**Dipendenze:** Nessuna  
**Usato da:** Tutti i moduli test

---

#### **tests/test-log-helpers.js** ✅

**Contenuto:**

- Funzioni helper per gestione log nei test
- `copyLog()`, `downloadLog()`, `clearLog()` - Funzioni generiche
- Wrapper globali per ogni modulo test (es. `copyDatabaseLog`, `downloadPriceLog`, ecc.)
- Integrazione con `notification-modal.js` per feedback utente

**Dipendenze:** `components/notification-modal.js`  
**Usato da:** Tutti i moduli test wrapper

---

#### **tests/test-database.js** ✅

**Contenuto:**

- Suite test per `database.json`
- Test caricamento, struttura, validazione dati, performance
- Esposizione `window.tariffario` per altri test (es. `test-prezzi.js`)
- Funzioni header: `updateDatabaseHeader()`, `resetDatabaseTests()`

**Dipendenze:** `tests/test-utils.js`  
**Usato da:** `test.html`

---

#### **tests/test-storage.js** ✅

**Contenuto:**

- Suite test completa per `storage.js` (24 test)
- Test base (getItem, setItem, removeItem, clear)
- Test JSON (boolean, numeric, null, objects, arrays)
- Funzioni avanzate (hasItem, getItemsByPrefix, removeItemsByPrefix)
- Edge cases (migration, quota exceeded, invalid JSON)
- Test retrocompatibilità con localStorage diretto

**Dipendenze:** `core/storage.js`, `tests/test-utils.js`  
**Usato da:** `test.html`

---

#### **tests/test-prezzi.js** ✅

**Contenuto:**

- Suite test completa per `prezzi.js` (26+ test)
- Test unitari: tutte le funzioni di `Pricing.*`
- Test edge cases: stessa fermata, indici fuori range, dati malformati
- Test robustezza: null, undefined, stringhe, NaN, Infinity
- Test performance: misura velocità calcoli
- Mock data helpers: creazione tariffari di test
- Funzioni header: `updatePriceHeader()`, `resetPriceTests()`

**Dipendenze:** `features/prezzi.js`, `tests/test-utils.js`  
**Usato da:** `test.html`

---

#### **tests/test-settings.js** ✅

**Contenuto:**

- Suite test per `settings.js`
- Test impostazioni (theme, font size, accessibilità)
- Funzioni header: `updateSettingsHeader()`, `resetSettingsTests()`

**Dipendenze:** `features/settings.js`, `tests/test-utils.js`  
**Usato da:** `test.html`

---

#### **tests/test-sw.js** ✅

**Contenuto:**

- Suite test per Service Worker
- Test registrazione, cache, offline support
- Funzioni header: `updateSwHeader()`, `resetSwTests()`

**Dipendenze:** `tests/test-utils.js`  
**Usato da:** `test.html`

---

#### **tests/test-accordion-wrappers.js** ✅

**Contenuto:**

- Wrapper functions globali per toggle accordion gruppi
- `window.toggleDbGroup()`, `window.toggleStorageGroup()`, `window.togglePriceGroup()`, ecc.
- `window.toggleAllDbGroups()`, `window.toggleAllStorageGroups()`, ecc.
- **Event delegation automatica** per toggle gruppi usando `data-toggle-group` e `data-group-id`
- Sostituisce completamente gli `onclick` inline nell'HTML

**Dipendenze:** `tests/test-accordion.js` (opzionale)  
**Usato da:** `test.html` (event delegation, NO onclick inline)

**Event Delegation:**
- Gestisce automaticamente click su elementi con `data-toggle-group` (db, storage, price, sw, route, settings)
- Usa `data-group-id` per identificare il gruppo da aprire/chiudere
- Auto-inizializza su `DOMContentLoaded`

---

#### **tests/test-storage-wrappers.js** ✅

**Contenuto:**

- Wrapper functions globali per test Storage
- `window.testStorage()` - Esegue tutti i test Storage
- `window.runSingleStorageTest()` - Esegue un singolo test
- `window.resetStorageModuleTests()` - Reset completo
- `window.updateStorageHeader()` - Aggiorna header con statistiche
- Funzioni log: `copyStorageLog()`, `downloadStorageLog()`, `clearStorageLog()`
- **Event delegation automatica** per pulsanti test e utility

**Dipendenze:** `tests/test-storage.js`, `tests/test-log-helpers.js`  
**Usato da:** `test.html` (event delegation, NO onclick inline)

**Event Delegation:**
- `data-test="storage"` - Pulsante test principale
- `data-test="storage-single" data-test-id="..."` - Test singoli
- `data-storage-action` - Azioni utility (toggle-open, toggle-close, reset, copy-log, download-log, clear-log)

---

#### **tests/test-prezzi-wrappers.js** ✅

**Contenuto:**

- Wrapper functions globali per test Prezzi
- `window.testPriceCalculation()` - Esegue tutti i test Prezzi
- `window.runSinglePriceTest()` - Esegue un singolo test
- Caricamento automatico tariffario se vuoto (da `window.tariffario` o `database.json`)
- **Event delegation automatica** per pulsanti test e utility

**Dipendenze:** `tests/test-prezzi.js`, `tests/test-log-helpers.js`  
**Usato da:** `test.html` (event delegation, NO onclick inline)

**Event Delegation:**
- `data-test="price"` - Pulsante test principale
- `data-test="price-single" data-test-id="..."` - Test singoli
- `data-price-action` - Azioni utility (toggle-open, toggle-close, reset, copy-log, download-log, clear-log)

---

#### **tests/test-settings-wrappers.js** ✅

**Contenuto:**

- Wrapper functions globali per test Settings
- `window.testSettings()` - Esegue tutti i test Settings
- `window.runSingleSettingsTest()` - Esegue un singolo test
- **Event delegation automatica** per pulsanti test e utility

**Dipendenze:** `tests/test-settings.js`, `tests/test-log-helpers.js`  
**Usato da:** `test.html` (event delegation, NO onclick inline)

**Event Delegation:**
- `data-test="settings"` - Pulsante test principale
- `data-test="settings-single" data-test-id="..."` - Test singoli
- `data-settings-action` - Azioni utility (toggle-open, toggle-close, reset, copy-log, download-log, clear-log)

---

#### **tests/test-sw-wrappers.js** ✅

**Contenuto:**

- Wrapper functions globali per test Service Worker
- `window.testServiceWorker()` - Esegue tutti i test SW
- `window.runSingleSwTest()` - Esegue un singolo test
- **Event delegation automatica** per pulsanti test e utility

**Dipendenze:** `tests/test-sw.js`, `tests/test-log-helpers.js`  
**Usato da:** `test.html` (event delegation, NO onclick inline)

**Event Delegation:**
- `data-test="serviceworker"` - Pulsante test principale
- `data-test="sw-single" data-test-id="..."` - Test singoli
- `data-sw-action` - Azioni utility (toggle-open, toggle-close, reset, copy-log, download-log, clear-log)

---

#### **tests/test-route-selector-wrappers.js** ✅

**Contenuto:**

- Wrapper functions globali per test Route Selector
- `window.testRouteSelector()` - Esegue tutti i test Route Selector
- `window.runSingleRouteTest()` - Esegue un singolo test
- **Event delegation automatica** per pulsanti test e utility

**Dipendenze:** `tests/test-route-selector.js`, `tests/test-log-helpers.js`  
**Usato da:** `test.html` (event delegation, NO onclick inline)

**Event Delegation:**
- `data-test="route"` - Pulsante test principale
- `data-test="route-single" data-test-id="..."` - Test singoli
- `data-route-action` - Azioni utility (toggle-open, toggle-close, reset, copy-log, download-log, clear-log)

---

#### **tests/test-darkmode-wrappers.js** ✅

**Contenuto:**

- Wrapper functions globali per test Dark Mode
- `window.testDarkMode()` - Esegue tutti i test Dark Mode
- `window.runSingleDarkModeTest()` - Esegue un singolo test
- **Event delegation automatica** per pulsanti test

**Dipendenze:** `tests/test-darkmode.js`, `tests/test-log-helpers.js`  
**Usato da:** `test.html` (event delegation, NO onclick inline)

**Event Delegation:**
- `data-test="darkmode"` - Pulsante test principale
- `data-test="darkmode-single" data-test-id="..."` - Test singoli (se presenti)

---

#### **tests/test-all-wrappers.js** ✅

**Contenuto:**

- Wrapper function globale per eseguire tutti i test in sequenza
- `window.runAllTests()` - Esegue tutti i test (Database, Storage, Dark Mode, Prezzi, Settings, SW, UI, Manifest, Performance)
- **Event delegation automatica** per pulsante `data-test="run-all"`

**Dipendenze:** Tutti i wrapper test  
**Usato da:** `test.html` (event delegation, NO onclick inline)

**Event Delegation:**
- `data-test="run-all"` - Pulsante esegui tutti i test

---

#### **tests/test-ui-manifest-performance-wrappers.js** ✅ (09/11/2025)

**Contenuto:**

- Wrapper functions globali per test UI, Manifest e Performance
- `window.testUIComponents()` - Esegue test UI componenti
- `window.testManifest()` - Esegue test manifest PWA
- `window.testPerformance()` - Esegue test performance
- Delega alle rispettive funzioni `UITests.runAll()`, `ManifestTests.runAll()`, `PerformanceTests.runAll()`
- **Event delegation automatica** per pulsanti test

**Dipendenze:** `tests/test-ui.js`, `tests/test-manifest.js`, `tests/test-performance.js`  
**Usato da:** `test.html` (event delegation, NO onclick inline)

**Event Delegation:**
- `data-test="ui"` - Pulsante test UI
- `data-test="manifest"` - Pulsante test Manifest
- `data-test="performance"` - Pulsante test Performance

---

#### **tests/device-detector.js** ✅ (09/11/2025)

**Contenuto:**

- Rilevamento informazioni dispositivo (batteria, PWA mode, user agent)
- `detectDeviceInfo()` - Rileva informazioni dispositivo
- `updateBatteryCardColor()` - Aggiorna colore card batteria
- `updatePWAMode()` - Aggiorna modalità PWA

**Dipendenze:** Nessuna  
**Usato da:** `test.html`

---

#### **tests/effects-status.js** ✅ (09/11/2025)

**Contenuto:**

- Status effetti attivi (dark mode, animazioni, contrasto, ecc.)
- `updateEffectsStatus()` - Aggiorna status effetti
- `detectEffects()` - Rileva effetti attivi
- Auto-inizializza su `DOMContentLoaded` e su eventi `resize`, `darkmode-toggle`
- **Event delegation automatica** per pulsante aggiorna status

**Dipendenze:** Nessuna (solo DOM)  
**Usato da:** `test.html`

**Event Delegation:**
- `data-action="update-effects-status"` - Pulsante aggiorna status effetti

---

#### **tests/error-404-simulator.js** ✅ (09/11/2025)

**Contenuto:**

- Simulatore errore 404 per test
- `simulate(options)` - Simula reindirizzamento a 404.html
- Supporta apertura in nuova tab
- Auto-inizializza per pulsanti con `data-simulate-404="true"`

**Dipendenze:** Nessuna  
**Usato da:** `test.html`

---

#### **tests/pwa-test-mode.js** ✅ (09/11/2025)

**Contenuto:**

- Modalità test PWA (simula installazione PWA senza installare)
- `togglePWATestMode()` - Toggle modalità test
- `getTestModeState()` - Legge stato modalità test
- `setTestModeState(state)` - Salva stato modalità test
- `updateUI(isTestMode)` - Aggiorna UI pulsante e info
- Dispatch evento `pwaTestModeChanged` per aggiornare altre parti dell'app
- **Sicurezza:** Usa `createElement` invece di `innerHTML` per prevenire XSS

**Dipendenze:** `window.Storage` (localStorage)  
**Usato da:** `test.html`, `script.js` (PWA bottom nav)

---

#### **tests/gps/helpers.js** ✅ (09/11/2025)

**Contenuto:**

- Helper functions per funzionalità GPS avanzate
- `copyCoordinates(lat, lng)` - Copia coordinate negli appunti
- `reverseGeocode(lat, lng)` - Reverse geocoding (coordinate → indirizzo)
- `getCardinalDirection(degrees)` - Direzione cardinale da gradi
- `checkGeolocationPermission()` - Verifica permessi geolocalizzazione
- `checkHttpsRequirement()` - Verifica requisito HTTPS
- `calculateDistance(lat1, lon1, lat2, lon2)` - Calcolo distanza (Haversine)
- Auto-inizializza controlli HTTPS e permessi

**Dipendenze:** Nessuna  
**Usato da:** Altri moduli GPS

---

#### **tests/gps/fake-position.js** ✅ (09/11/2025)

**Contenuto:**

- Simulazione posizione GPS per test
- `setFakePosition(lat, lng, name)` - Imposta posizione fake
- `getFakePosition()` - Legge posizione fake corrente
- `isActive()` - Verifica se posizione fake è attiva
- `clearFakePosition()` - Rimuove posizione fake
- Preset città (Udine, Trieste, Gorizia, Pordenone)

**Dipendenze:** `tests/gps/helpers.js`  
**Usato da:** `tests/gps/test-geolocation.js`, `tests/gps/watch-position.js`

---

#### **tests/gps/reset-data.js** ✅ (09/11/2025)

**Contenuto:**

- Reset dati GPS in localStorage
- `showResetModal()` - Mostra modal conferma reset
- `hideResetModal()` - Nasconde modal
- `confirmResetGPS()` - Conferma e esegue reset
- Reset chiavi localStorage GPS-related
- Reset stato altri moduli GPS

**Dipendenze:** Altri moduli GPS  
**Usato da:** `test.html`

---

#### **tests/gps/distance-calculator.js** ✅ (09/11/2025)

**Contenuto:**

- Calcolo distanze e tempi stimati
- `calculateDistanceToTarget(lat, lng, targetLat, targetLng)` - Calcola distanza a target
- `estimateTime(distance, speed)` - Stima tempo di percorrenza
- `formatTime(seconds)` - Formatta tempo in formato leggibile
- `setLastPosition(lat, lng)` - Salva ultima posizione
- `getLastPosition()` - Legge ultima posizione

**Dipendenze:** `tests/gps/helpers.js`  
**Usato da:** `tests/gps/test-geolocation.js`, `tests/gps/watch-position.js`

---

#### **tests/gps/map-leaflet.js** ✅ (09/11/2025)

**Contenuto:**

- Integrazione mappa Leaflet per visualizzazione posizione
- `initializeMap(containerId, initialLat, initialLng)` - Inizializza mappa Leaflet
- `updatePosition(lat, lng)` - Aggiorna posizione sulla mappa
- `recenterMap(lat, lng)` - Ricentra mappa su posizione
- `setupConnectionBadge()` - Setup badge connessione
- `updateConnectionStatus(isOnline)` - Aggiorna status connessione
- `isInitialized()` - Verifica se mappa è inizializzata
- `getCurrentPosition()` - Legge posizione corrente dalla mappa

**Dipendenze:** Leaflet.js (CDN), `tests/gps/helpers.js`  
**Usato da:** `tests/gps/test-geolocation.js`, `tests/gps/watch-position.js`

---

#### **tests/gps/watch-position.js** ✅ (09/11/2025)

**Contenuto:**

- Monitoraggio continuo posizione GPS
- `start()` - Avvia monitoraggio continuo
- `stop()` - Ferma monitoraggio
- `reset()` - Reset stato monitoraggio
- `clearHistory()` - Cancella cronologia posizioni
- `updateUI()` - Aggiorna UI stato monitoraggio
- `updateHistoryUI()` - Aggiorna UI cronologia
- `setup()` - Setup iniziale (event listeners)

**Dipendenze:** `tests/gps/helpers.js`, `tests/gps/map-leaflet.js`, `tests/gps/distance-calculator.js`, `tests/gps/fake-position.js`  
**Usato da:** `test.html`

---

#### **tests/gps/quick-test.js** ✅ (09/11/2025)

**Contenuto:**

- Test rapido GPS (one-click test)
- `quickGPSTest()` - Esegue 5 test rapidi:
  1. Verifica permessi geolocalizzazione
  2. Verifica supporto hardware GPS
  3. Test rilevamento posizione
  4. Test reverse geocoding
  5. Verifica libreria Leaflet
- Aggiorna UI con risultati

**Dipendenze:** `tests/gps/helpers.js`, `tests/gps/map-leaflet.js`  
**Usato da:** `test.html`

---

#### **tests/gps/export-report.js** ✅ (09/11/2025)

**Contenuto:**

- Esportazione report test GPS
- `exportGPSReport(format)` - Esporta report (JSON o TXT)
- `generateReportData()` - Genera dati report
- `formatReportJSON(data)` - Formatta report JSON
- `formatReportTXT(data)` - Formatta report TXT
- `downloadFile(content, filename, mimeType)` - Download file
- Include informazioni dispositivo (screen, pixelRatio)

**Dipendenze:** Altri moduli GPS  
**Usato da:** `test.html`

---

#### **tests/gps/test-geolocation.js** ✅ (09/11/2025)

**Contenuto:**

- Test geolocalizzazione principale
- `testGeolocation()` - Test rilevamento posizione GPS
- Gestisce posizione reale e fake
- Integra con altri moduli GPS (FakePosition, DistanceCalculator, Map)
- Reverse geocoding automatico
- Gestione errori e permessi
- Aggiorna UI con risultati

**Dipendenze:** Tutti gli altri moduli GPS  
**Usato da:** `test.html`

---

#### **components/hamburger-menu.js** ✅ (09/11/2025)

**Contenuto:**

- Gestione menu mobile hamburger
- `open()` - Apre menu mobile
- `close()` - Chiude menu mobile
- `isOpen()` - Verifica se menu è aperto
- `init()` - Inizializza listener
- Chiude menu con tasto ESC
- Chiude menu al click su link di navigazione
- Integrazione con dark mode toggle e update checks
- Auto-inizializza su `DOMContentLoaded`

**Dipendenze:** `window.Settings`, `window.Updates`  
**Usato da:** Tutte le pagine (index.html, fermate.html, prezzi.html, 404.html, test.html)

---

#### **components/mega-dropdown-settings.js** ✅ (09/11/2025)

**Contenuto:**

- Mega dropdown impostazioni (solo desktop)
- `initMegaDropdown()` - Inizializza dropdown
- `testMegaDropdownFunctionality()` - Test verifica funzionamento
- Gestione tema (Sistema/Chiaro/Scuro)
- Gestione animazione sfondo
- Gestione alto contrasto
- Gestione dimensione testo
- Azioni rapide (Apri Settings Modal, Verifica Aggiornamenti, Cancella Cache)
- Auto-inizializza su `DOMContentLoaded`
- **Nota:** Componente condiviso, disponibile su tutte le pagine desktop

**Dipendenze:** `window.SettingsModal`, `window.Settings`, `window.Updates`  
**Usato da:** Tutte le pagine desktop (index.html, fermate.html, prezzi.html, 404.html, test.html)

---

#### **components/pwa-install.js** ✅ (09/11/2025)

**Contenuto:**

- Banner installazione PWA
- Gestione `beforeinstallprompt` event (Android/Chrome)
- Gestione `appinstalled` event
- Rilevamento dispositivo (iOS/Android/Safari/Chrome)
- Gestione frequenza mostra banner (7 giorni)
- Istruzioni installazione iOS
- Nasconde banner quando app è in background
- **Nota:** File già creato, da integrare in script.js

**Dipendenze:** `window.Storage` (localStorage)  
**Usato da:** Tutte le pagine (da integrare)

---

#### **utils/connection-monitor.js** ✅ (09/11/2025)

**Contenuto:**

- Monitor connessione internet
- `detectConnectionInfo(showDate)` - Rileva stato connessione
- `updateUI(isOnline, showDate)` - Aggiorna UI stato connessione
- Timeout gestito con `Promise.race` e `AbortController`
- Gestione errori silenziosa per `no-cors` fetch (comportamento atteso del browser)
- Aggiorna UI con stato online/offline e data ultimo test

**Dipendenze:** Nessuna  
**Usato da:** `test.html`, altre pagine (se necessario)

---

#### **features/animations.js** ⏳

**Contenuto:**

- Micro-interazioni (ripple, loading, success)
- Gestione animazioni programmatiche
- Helpers per animazioni
- Integrazione con prefers-reduced-motion

**Esempio:**

```javascript
// Animazioni JavaScript
import { prefersReducedMotion } from "../core/utils.js";

export function addRipple(element, event) {
  if (prefersReducedMotion()) return;

  // Logica ripple effect...
}

export function showSuccess(element, message) {
  // Animazione success...
}

export function showLoading(element) {
  // Loading state...
}
```

**Dipendenze:** `core/utils.js`  
**Usato da:** Componenti

---

### **4. components/** (Componenti UI)

#### **components/footer.js** ✅

**Contenuto:**

- Generazione HTML footer
- Caricamento versione da `changelogData` o `version.json`
- Gestione link Telegram
- Aggiornamento dinamico versione nel footer

**Dipendenze:** Nessuna (componente completamente indipendente)  
**Usato da:** Tutte le pagine (index.html, fermate.html, prezzi.html, benvenuto.html, test.html)

**Note:**

- Legge la versione da `changelogData` (se disponibile) o da `version.json` via fetch
- Versione fallback: `1.6.7`
- Il footer viene generato dinamicamente al caricamento della pagina

---

#### **components/changelog.js** ✅

**Contenuto:**

- Dati changelog (`changelogData`)
- Rendering changelog (`renderChangelog()`)
- Aggiornamento automatico versione nell'UI (`updateAppVersion()`)
- API pubblica per versione: `getChangelogVersion()`, `getChangelogVersionString()`

**Dipendenze:** Nessuna (componente standalone)  
**Usato da:** Pagina impostazioni, `features/updates.js` (via API pubblica)

**Nota:** La logica di verifica aggiornamenti è separata in `features/updates.js` per mantenere la separazione delle responsabilità (dati/visualizzazione vs logica funzionale).

---

#### **components/navbar.js** ⏳

**Contenuto:**

- Gestione navbar/menu mobile
- Hamburger toggle
- Navigazione
- Menu drawer

**Dipendenze:** `core/utils.js`, `features/animations.js`  
**Usato da:** Tutte le pagine

---

#### **components/modals.js** ✅

**Contenuto:**

- Gestione UI modali (apertura/chiusura)
- Modal Fermate (selezione fermata partenza/arrivo)
- Modal Linee (selezione linea)
- Modal Settings (UI: tabs, event listeners, sincronizzazione stato)
- Animazioni modali

**Dipendenze:**

- `data/tariffario.js` (per FermateModal e LineeModal)
- `features/settings.js` (per SettingsModal - riceve funzioni come callback)

**Usato da:** Pagine principali (index.html, fermate.html, prezzi.html, ecc.)

**Nota:**

- Gestisce solo la **UI** dei modali (apertura/chiusura, tabs, event listeners)
- La logica di business è delegata:
  - FermateModal/LineeModal → callback verso script.js
  - SettingsModal → callback verso `features/settings.js`

---

#### **components/notification-modal.js** ✅

**Contenuto:**

- Modal notifica riutilizzabile per messaggi e conferme
- Sostituisce `alert()` nativo del browser
- API semplice: `showNotificationModal(title, message)`
- Inizializzazione automatica su `DOMContentLoaded`

**API Pubblica:**

```javascript
// Mostra modale notifica
NotificationModal.show("Titolo", "Messaggio");

// O tramite wrapper globale (retrocompatibilità)
window.showNotificationModal("Titolo", "Messaggio");
```

**Dipendenze:** Nessuna  
**Usato da:** Test page (`test.html`), log helpers (`test-log-helpers.js`)

**Note:**

- Fallback a `alert()` se gli elementi DOM non sono trovati
- Stili CSS in `css/components/modals.css` (sezione `.notification-modal`)

---

#### **components/pwa.js** ⏳

**Contenuto:**

- Gestione PWA install
- Bottom navigation
- Brand header
- Service worker registration

**Dipendenze:** `core/utils.js`  
**Usato da:** Tutte le pagine (PWA mode)

---

### **5. main.js** (Entry Point)

**Contenuto:**

- Inizializzazione app
- Orchestrazione moduli
- Event listeners globali
- Setup iniziale

**Esempio:**

```javascript
// Entry point app
import { loadDatabase } from "./data/database.js";
import { loadTariffario } from "./data/tariffario.js";
import { initializeFooter } from "./components/footer.js";
import { initializeModals } from "./components/modals.js";
import { initializePWA } from "./components/pwa.js";

async function init() {
  // Carica dati
  await loadDatabase();
  await loadTariffario();

  // Inizializza componenti
  initializeFooter();
  initializeModals();
  initializePWA();

  // Setup event listeners...
}

// Avvia app
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
```

**Dipendenze:** Tutti i moduli  
**Usato da:** Entry point dell'app

---

## 🔄 Processo di Migrazione

### Step da seguire per ogni modulo:

1. **Identifica** il codice del modulo in `script.js`
2. **Crea** il file in `js/[cartella]/[nome].js`
3. **Estrai** il codice, mantieni la logica
4. **Esporta** funzioni/classi con `export`
5. **Importa** dipendenze necessarie
6. **Aggiorna** gli HTML per caricare il nuovo JS
7. **Testa** che tutto funzioni
8. **Aggiorna** il service worker (`sw.js`)
9. **Rimuovi** il codice da `script.js` (opzionale, dopo test)
10. **Aggiorna** questo README (✅ → modulo completato)

---

## ✅ Moduli Completati

### Core

- [x] **core/storage.js** ✅ - Gestione localStorage con wrapper e utilità

### Components

- [x] **components/footer.js** ✅ - Footer dinamico
- [x] **components/changelog.js** ✅ - Dati e visualizzazione changelog
- [x] **components/modals.js** ✅ - UI modali (Fermate, Linee, Settings)
- [x] **components/notification-modal.js** ✅ - Modal notifica riutilizzabile
- [x] **components/hamburger-menu.js** ✅ (09/11/2025) - Menu mobile hamburger
- [x] **components/mega-dropdown-settings.js** ✅ (09/11/2025) - Mega dropdown impostazioni (desktop, condiviso)
- [x] **components/pwa-install.js** ✅ (09/11/2025) - Banner installazione PWA (da integrare)

### Features

- [x] **features/updates.js** ✅ - Verifica aggiornamenti
- [x] **features/settings.js** ✅ - Logica impostazioni (tema, font, accessibilità)
- [x] **features/prezzi.js** ✅ - Calcolo prezzi (funzioni pure, logica business)
- [x] **features/toc-navigation.js** ✅ (2025-11-10) - Smooth scroll e highlight TOC (indice mobile + sidebar desktop)

### Tests

- [x] **tests/test-utils.js** ✅ - Utility test (logging, status, statistiche)
- [x] **tests/test-log-helpers.js** ✅ - Funzioni gestione log (copia, download, clear)
- [x] **tests/test-database.js** ✅ - Suite test database.json
- [x] **tests/test-storage.js** ✅ - Suite test completa per storage.js (24 test)
- [x] **tests/test-storage-wrappers.js** ✅ - Wrapper funzioni Storage test + Event delegation
- [x] **tests/test-prezzi.js** ✅ - Suite test completa per prezzi.js (26+ test)
- [x] **tests/test-prezzi-wrappers.js** ✅ - Wrapper funzioni Prezzi test + Event delegation
- [x] **tests/test-route-selector.js** ✅ - Suite test Route Selector
- [x] **tests/test-route-selector-wrappers.js** ✅ - Wrapper funzioni Route Selector test + Event delegation
- [x] **tests/test-settings.js** ✅ - Suite test per settings.js
- [x] **tests/test-settings-wrappers.js** ✅ - Wrapper funzioni Settings test + Event delegation
- [x] **tests/test-sw.js** ✅ - Suite test Service Worker
- [x] **tests/test-sw-wrappers.js** ✅ - Wrapper funzioni Service Worker test + Event delegation
- [x] **tests/test-darkmode-wrappers.js** ✅ - Wrapper funzioni Dark Mode test + Event delegation
- [x] **tests/test-all-wrappers.js** ✅ - Wrapper runAllTests() + Event delegation
- [x] **tests/test-ui-manifest-performance-wrappers.js** ✅ (09/11/2025) - Wrapper test UI/Manifest/Performance + Event delegation
- [x] **tests/test-accordion-wrappers.js** ✅ - Wrapper funzioni accordion + Event delegation toggle gruppi
- [x] **tests/device-detector.js** ✅ (09/11/2025) - Rilevamento informazioni dispositivo
- [x] **tests/effects-status.js** ✅ (09/11/2025) - Status effetti (dark mode, animazioni, ecc.) + Event delegation
- [x] **tests/error-404-simulator.js** ✅ (09/11/2025) - Simulatore errore 404
- [x] **tests/pwa-test-mode.js** ✅ (09/11/2025) - Modalità test PWA
- [x] **tests/gps/helpers.js** ✅ (09/11/2025) - Helper funzioni GPS
- [x] **tests/gps/fake-position.js** ✅ (09/11/2025) - Simulazione posizione GPS
- [x] **tests/gps/reset-data.js** ✅ (09/11/2025) - Reset dati GPS
- [x] **tests/gps/distance-calculator.js** ✅ (09/11/2025) - Calcolo distanze
- [x] **tests/gps/map-leaflet.js** ✅ (09/11/2025) - Integrazione mappa Leaflet
- [x] **tests/gps/watch-position.js** ✅ (09/11/2025) - Monitoraggio continuo posizione
- [x] **tests/gps/quick-test.js** ✅ (09/11/2025) - Test rapido GPS
- [x] **tests/gps/export-report.js** ✅ (09/11/2025) - Esportazione report GPS
- [x] **tests/gps/test-geolocation.js** ✅ (09/11/2025) - Test geolocalizzazione principale

### Utils

- [x] **utils/ui-helpers.js** ✅ - Funzioni UI helper (scroll to top, swap button)
- [x] **utils/connection-monitor.js** ✅ (09/11/2025) - Monitor connessione internet
- [x] **utils/offline-simulator.js** ✅ - Simulatore offline
- [x] **utils/display-detector.js** ✅ - Rilevamento display
- [x] **utils/interface-scale.js** ✅ - Scala interfaccia

### Da Completare

- [ ] core/config.js
- [ ] core/utils.js
- [ ] data/database.js
- [ ] features/animations.js
- [ ] components/navbar.js
- [ ] components/pwa-bottom-nav.js (da modularizzare da script.js)
- [ ] main.js

**Nota:** `data/tariffario.js` e `features/geolocation.js` sono già completati e documentati sopra nella sezione "Features" e "Data".

---

## 📦 Service Worker

**IMPORTANTE**: Ogni volta che aggiungi un nuovo file JavaScript, aggiornalo in `sw.js`:

```javascript
const STATIC_ASSETS = [
  // ... altri file ...
  "./js/core/config.js",
  "./js/core/utils.js",
  "./js/core/storage.js",
  "./js/data/database.js",
  "./js/data/tariffario.js",
  "./js/features/updates.js",
  "./js/features/settings.js",
  "./js/features/location.js",
  "./js/features/prezzi.js",
  "./js/features/animations.js",
  "./js/components/footer.js",
  "./js/components/changelog.js",
  // ... altri componenti ...
  "./js/main.js",
  // ...
];
```

---

## 📱 PWA (Progressive Web App) - Architettura e Componenti

### **Cosa è una PWA?**

Una **PWA (Progressive Web App)** è un'applicazione web che usa tecnologie moderne per offrire un'esperienza simile a un'app nativa. Può essere installata sul dispositivo dell'utente e funzionare offline.

### **Componenti Necessari per una PWA Installabile**

Per rendere la tua web app installabile come PWA, sono necessari **4 componenti essenziali**:

#### **1. Manifest (`manifest.webmanifest`)** ✅

**Cosa fa:**
- Definisce metadati dell'app (nome, icone, colori)
- Specifica il comportamento quando l'app è installata (display mode: `standalone`)
- Permette al browser di identificare l'app come installabile

**Dove si trova:**
- File: `manifest.webmanifest`
- Riferimento HTML: `<link rel="manifest" href="manifest.webmanifest">` nel `<head>`

**Contenuto minimo:**
```json
{
  "name": "TPL FVG",
  "short_name": "TPL FVG",
  "start_url": "./index.html",
  "display": "standalone",
  "icons": [...],
  "theme_color": "#17b7b1",
  "background_color": "#17b7b1"
}
```

**Verifica:**
- Il test `test-manifest.js` verifica che il manifest sia caricato correttamente
- Il test PWA Install Banner verifica la presenza del tag `<link rel="manifest">`

---

#### **2. Service Worker (`sw.js`)** ✅

**Cosa fa:**
- Abilita funzionalità offline (caching)
- Permette all'app di funzionare senza connessione internet
- **REQUISITO OBBLIGATORIO** per l'installazione su Android/Chrome

**Dove si trova:**
- File: `sw.js` (root del progetto)
- Registrazione: `navigator.serviceWorker.register('/sw.js')`

**Funzionalità:**
- Cache static assets (HTML, CSS, JS, immagini)
- Cache API responses (dati dinamici)
- Offline fallback (mostra contenuto cached quando offline)
- Update management (verifica aggiornamenti)

**Verifica:**
- Il test `test-sw.js` verifica la registrazione e funzionalità del Service Worker
- Condizione installabilità: `'serviceWorker' in navigator` deve essere `true`

---

#### **3. HTTPS (o localhost)** ✅

**Cosa fa:**
- Fornisce connessione sicura (crittografata)
- **REQUISITO OBBLIGATORIO** per Service Worker e installazione PWA

**Dove si verifica:**
- GitHub Pages: Automaticamente HTTPS
- Localhost: Supportato per sviluppo
- 127.0.0.1: Supportato per sviluppo

**Verifica:**
- Condizione installabilità: `location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1'`

---

#### **4. beforeinstallprompt Event** ⚠️

**Cosa fa:**
- Evento del browser che indica che l'app è installabile
- Viene emesso quando **tutte le condizioni** sono soddisfatte:
  - ✅ Manifest presente e valido
  - ✅ Service Worker registrato e attivo
  - ✅ HTTPS (o localhost)
  - ✅ App **non già installata**
  - ✅ Utente **non ha già rifiutato** l'installazione

**Dove si gestisce:**
- File: `js/components/pwa-install.js`
- Event listener: `window.addEventListener('beforeinstallprompt', (e) => { ... })`

**Nota importante:**
- Il `beforeinstallprompt` **NON viene sempre emesso**, anche se tutte le condizioni sono soddisfatte
- Il browser decide autonomamente quando mostrare il prompt
- **Non disponibile in DevTools mobile** (emulazione non supporta correttamente l'evento)
- **Non disponibile se l'app è già installata** (standalone mode)

**Verifica:**
- Il test PWA Install Banner verifica: `hasDeferredPrompt: !!deferredInstallPrompt`
- Se `false`, può essere normale (browser non ha emesso l'evento)

---

### **Condizioni di Installabilità - Checklist**

Il modulo `pwa-install.js` verifica automaticamente tutte le condizioni:

```javascript
const checks = {
  hasServiceWorker: 'serviceWorker' in navigator,           // ✅ Browser supporta SW
  hasManifest: !!document.querySelector('link[rel="manifest"]'), // ✅ Manifest presente
  isHTTPS: location.protocol === 'https:' || ...,           // ✅ HTTPS o localhost
  isStandalone: window.matchMedia('(display-mode: standalone)').matches, // ❌ Non già installata
  hasDeferredPrompt: !!deferredInstallPrompt,               // ⚠️ Evento emesso (opzionale)
  userAgent: navigator.userAgent                            // Info dispositivo
};
```

**Risultato:**
- ✅ **Tutte le condizioni soddisfatte**: App installabile
- ❌ **Alcune condizioni mancanti**: App non installabile
- ⚠️ **Deferred prompt non disponibile**: Normale, può essere installabile comunque

---

### **Come Funziona l'Installazione**

#### **Android/Chrome:**
1. Browser emette `beforeinstallprompt` event
2. Banner PWA mostra pulsante "Installa"
3. Utente clicca "Installa"
4. Browser mostra prompt nativo di installazione
5. Utente conferma installazione
6. App installata come standalone

#### **iOS/Safari:**
1. Banner PWA mostra istruzioni manuali
2. Utente deve usare menu "Condividi" → "Aggiungi a Home"
3. Nessun `beforeinstallprompt` (Safari non supporta)
4. App installata come standalone

---

### **Moduli PWA nel Progetto**

#### **1. `js/components/pwa-install.js`** ✅

**Funzionalità:**
- Banner installazione PWA (Android/Chrome)
- Istruzioni installazione iOS/Safari
- Gestione `beforeinstallprompt` event
- Gestione `appinstalled` event
- Rilevamento dispositivo (iOS/Android)
- Gestione frequenza mostra banner (7 giorni)
- Nasconde banner quando app è in background

**API Pubblica:**
```javascript
window.PWAInstall = {
  show: () => {},              // Mostra banner manualmente
  hide: () => {},              // Nasconde banner
  testShowBanner: () => {},    // Forza visualizzazione (test)
  checkInstallability: () => {} // Verifica condizioni installabilità
};
```

**Dipendenza:** `window.Storage` (localStorage per frequenza banner)

---

#### **2. `manifest.webmanifest`** ✅

**Contenuto:**
- Nome app: "TPL FVG"
- Display mode: "standalone" (app-like experience)
- Icons: 192x192, 512x512
- Theme color: #17b7b1
- Start URL: "./index.html"

**Riferimento HTML:**
- `<link rel="manifest" href="manifest.webmanifest">` in `<head>`

---

#### **3. `js/components/pwa-bottom-nav.js`** ✅

**Funzionalità:**
- Brand header e bottom navigation (mostra/nascondi in modalità PWA)
- Evidenziazione tab attiva in base alla pagina corrente
- Gestione pulsante impostazioni nella bottom nav
- Scroll progress bar nel brand header
- PWA Update Check Button (verifica aggiornamenti)
- Simulazione offline globale (per test)
- Listener per cambio modalità test PWA

**API Pubblica:**
```javascript
window.PWABottomNav = {
  toggle: () => {},              // Mostra/nascondi bottom nav
  highlightActiveTab: () => {},  // Evidenzia tab attiva
  refresh: () => {}              // Aggiorna tutto
};

// Retrocompatibilità
window.refreshPWABottomNav = () => {};
```

**Dipendenze:**
- `window.Storage` (localStorage per modalità test)
- `window.SettingsModal` (apertura modal impostazioni)
- `window.Updates` (verifica aggiornamenti)

**File CSS:** `css/components/pwa-bottom-nav.css` (586 righe)

**Stili:**
- Brand header (glassmorphism, scroll progress bar)
- Bottom navigation (barra inferiore sospesa)
- Navigation items (tab/icone)
- Logo e brand title
- Dark mode support
- Responsive (mobile, tablet, schermi piccoli)

---

#### **4. `sw.js` (Service Worker)** ✅

**Funzionalità:**
- Cache static assets
- Cache API responses
- Offline fallback
- Update management

**Registrazione:**
- Automatica all'avvio dell'app
- Verificata da `test-sw.js`

---

### **Test PWA Install Banner**

Il test in `test.html` verifica:
1. ✅ Banner HTML presente
2. ✅ Modulo PWAInstall caricato
3. ✅ Condizioni installabilità (Service Worker, Manifest, HTTPS, Standalone, Deferred Prompt)

**Pulsanti di test:**
- 🧪 **Test PWA Install Banner**: Esegue tutti i test
- 👁️ **Mostra Banner**: Forza visualizzazione banner (test)
- 🙈 **Nascondi Banner**: Nasconde banner
- 🔍 **Verifica Condizioni**: Mostra dettagli condizioni installabilità

---

### **Troubleshooting**

#### **Problema: Banner non appare su Android**
- ✅ Verifica: Manifest presente (`<link rel="manifest">`)
- ✅ Verifica: Service Worker registrato
- ✅ Verifica: HTTPS (o localhost)
- ⚠️ Nota: `beforeinstallprompt` potrebbe non essere emesso (normale)
- 💡 Soluzione: Usa pulsante "Mostra Banner" per testare manualmente

#### **Problema: Deferred Prompt non disponibile**
- ⚠️ Normale se app già installata
- ⚠️ Normale se utente ha già rifiutato installazione
- ⚠️ Normale in DevTools mobile (emulazione non supporta)
- ✅ Banner può essere mostrato comunque (test manuale)

#### **Problema: Manifest non trovato**
- ✅ Verifica: Tag `<link rel="manifest" href="manifest.webmanifest">` nel `<head>`
- ✅ Verifica: File `manifest.webmanifest` esiste nella root
- ✅ Verifica: Path corretto (relativo alla pagina HTML)

---

### **Riferimenti**

- **Manifest:** `manifest.webmanifest`
- **Service Worker:** `sw.js`
- **Banner PWA:** `js/components/pwa-install.js`
- **Test Manifest:** `js/tests/test-manifest.js`
- **Test Service Worker:** `js/tests/test-sw.js`
- **Test PWA Install:** Sezione "Test PWA Install Banner" in `test.html`

---

## 🎯 Convenzioni di Codice

### **Naming:**

- **File**: kebab-case (`micro-interactions.js`)
- **Funzioni**: camelCase (`calculatePrice`, `addRipple`)
- **Costanti**: UPPER_SNAKE_CASE (`APP_CONFIG`, `HAPTIC_PATTERNS`)
- **Classi**: PascalCase (`ModalManager`, `PriceCalculator`)

### **Export/Import:**

- **Named exports**: `export function calculatePrice() { ... }`
- **Default exports**: `export default function init() { ... }` (solo per entry points)
- **Import**: `import { calculatePrice } from './features/prezzi.js'`

### **Organizzazione:**

- Una funzione per file (piccoli helpers) o gruppo logico (features grandi)
- Commenti JSDoc per funzioni pubbliche
- Separazione logica per tipo (data, UI, business logic)

---

## 🎯 Vantaggi di questa Architettura

✅ **Manutenibilità**: Trova subito dove modificare una funzionalità  
✅ **Scalabilità**: Aggiungi moduli senza toccare il resto  
✅ **Riutilizzabilità**: Usa moduli in altri progetti  
✅ **Testabilità**: Testa moduli in isolamento  
✅ **Performance**: Lazy loading futuro dei moduli  
✅ **Git**: Diff più puliti, meno conflitti  
✅ **Team**: Più sviluppatori possono lavorare in parallelo  
✅ **Debug**: Isola problemi JavaScript velocemente

---

## 📝 Note

- **script.js** verrà gradualmente svuotato e dismesso
- Mantieni sempre l'ordine di caricamento indicato
- Ogni modulo deve essere **autosufficiente** (dipendenze esplicite)
- Usa **JSDoc** per documentare funzioni complesse
- Testa **sempre** dopo ogni migrazione
- Gestisci **errori** appropriatamente (try/catch, validazioni)

---

## 🔗 Relazioni con CSS Architecture

Questa architettura JS è allineata con l'architettura CSS:

```
CSS                          JavaScript
────────────────────────────────────────────
variables.css         →      core/config.js
animations.css        →      features/animations.js
components/footer.css →      components/footer.js
components/modals.css →      components/modals.js
```

Ogni componente CSS ha il suo corrispondente JavaScript per la logica.

---

---

## 🎯 Event Delegation - Sostituzione onclick inline

**Data implementazione:** 2025-11-10

Tutti i `onclick` inline in `test.html` sono stati sostituiti con **event delegation** usando data attributes.

### **Vantaggi:**

1. **Separazione HTML/JS**: Nessun JavaScript inline nell'HTML
2. **Performance**: Un solo listener per tipo di evento invece di centinaia
3. **Manutenibilità**: Modifiche agli event handlers senza toccare l'HTML
4. **Scalabilità**: Facile aggiungere nuovi elementi senza modificare il codice
5. **Best Practice**: Pattern moderno e raccomandato

### **Pattern Event Delegation:**

#### **Toggle Gruppi Accordion:**
```html
<!-- Prima: onclick="toggleDbGroup('group1')" -->
<!-- Dopo: -->
<div class="test-group-header" data-toggle-group="db" data-group-id="group1">
```

**Gestito da:** `test-accordion-wrappers.js`  
**Data attributes:** `data-toggle-group`, `data-group-id`

#### **Test Singoli:**
```html
<!-- Prima: onclick="runSingleStorageTest('test-id')" -->
<!-- Dopo: -->
<button class="test-run-single" data-test="storage-single" data-test-id="test-id">
```

**Gestito da:** Wrapper modules (storage, price, route, settings, sw)  
**Data attributes:** `data-test="[module]-single"`, `data-test-id`

#### **Pulsanti Test Principali:**
```html
<!-- Prima: onclick="testStorage()" -->
<!-- Dopo: -->
<button class="test-button" data-test="storage">
```

**Gestito da:** Wrapper modules  
**Data attributes:** `data-test="[module]"`

#### **Azioni Utility:**
```html
<!-- Prima: onclick="toggleAllStorageGroups(true)" -->
<!-- Dopo: -->
<button class="test-button" data-storage-action="toggle-open">
```

**Gestito da:** Wrapper modules  
**Data attributes:** `data-[module]-action` (toggle-open, toggle-close, reset, copy-log, download-log, clear-log)

### **Moduli con Event Delegation:**

- ✅ `test-accordion-wrappers.js` - Toggle gruppi accordion
- ✅ `test-storage-wrappers.js` - Test Storage + utility
- ✅ `test-prezzi-wrappers.js` - Test Prezzi + utility
- ✅ `test-route-selector-wrappers.js` - Test Route Selector + utility
- ✅ `test-settings-wrappers.js` - Test Settings + utility
- ✅ `test-sw-wrappers.js` - Test Service Worker + utility
- ✅ `test-darkmode-wrappers.js` - Test Dark Mode
- ✅ `test-all-wrappers.js` - Run all tests
- ✅ `test-ui-manifest-performance-wrappers.js` - Test UI/Manifest/Performance
- ✅ `effects-status.js` - Update effects status
- ✅ `toc-navigation.js` - TOC navigation (smooth scroll)

### **Risultato:**

- **120+ onclick rimossi** da `test.html`
- **0 onclick rimasti** nel file
- **Event delegation centralizzata** nei wrapper modules
- **Funzioni globali mantenute** per retrocompatibilità
- **Codice più pulito e manutenibile**

---

**Ultimo aggiornamento**: 10 Novembre 2025 ore 16:15  
**Versione progetto**: 1.7.2 (modularizzazione PWA Bottom Navigation, riduzione script.js e style1.css, migliorata organizzazione codice)
