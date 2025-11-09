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
│   │   └── pwa.js              ⏳ TODO
│   │
│   ├── features/
│   │   ├── updates.js          ✅ FATTO - Verifica aggiornamenti
│   │   ├── settings.js         ✅ FATTO - Logica impostazioni (tema, font, accessibilità)
│   │   ├── prezzi.js           ✅ FATTO - Calcolo prezzi (funzioni pure)
│   │   ├── route-selector.js   ✅ FATTO - Gestione selezione linea/partenza/arrivo
│   │   ├── geolocation.js      ✅ FATTO - Geolocalizzazione e ordinamento fermate
│   │   ├── page-renderers.js   ✅ FATTO - Rendering pagine fermate/prezzi, selezione linee, ricerca
│   │   ├── tests-ui.js         ✅ FATTO - UI componenti test
│   │   └── animations.js       ← Logica animazioni JS ⏳ TODO
│   │
│   ├── data/
│   │   ├── tariffario.js       ✅ FATTO - Gestione dati tariffario (caricamento, cache, eventi)
│   │   └── database.js         ← Gestione database.json ⏳ TODO
│   │
│   ├── utils/
│   │   ├── ui-helpers.js       ✅ FATTO - Funzioni UI helper (scroll to top, swap button)
│   │   └── offline-notifications.js ✅ FATTO - Notifiche online/offline
│   │
│   ├── tests/
│   │   ├── test-accordion.js   ✅ FATTO - Gestione accordion gruppi
│   │   ├── test-accordion-wrappers.js ✅ FATTO - Wrapper funzioni accordion
│   │   ├── test-all-wrappers.js ✅ FATTO - Wrapper runAllTests()
│   │   ├── test-database.js    ✅ FATTO - Suite test database.json
│   │   ├── test-darkmode.js    ✅ FATTO - Suite test dark mode
│   │   ├── test-log-helpers.js ✅ FATTO - Funzioni gestione log (copia, download, clear)
│   │   ├── test-manifest.js    ✅ FATTO - Suite test manifest PWA
│   │   ├── test-performance.js ✅ FATTO - Suite test performance
│   │   ├── test-prezzi.js      ✅ FATTO - Suite test per prezzi.js
│   │   ├── test-prezzi-wrappers.js ✅ FATTO - Wrapper funzioni Prezzi test
│   │   ├── test-settings.js    ✅ FATTO - Suite test per settings.js
│   │   ├── test-settings-wrappers.js ✅ FATTO - Wrapper funzioni Settings test
│   │   ├── test-storage.js     ✅ FATTO - Suite test per storage.js (24 test)
│   │   ├── test-storage-wrappers.js ✅ FATTO - Wrapper funzioni Storage test
│   │   ├── test-sw.js          ✅ FATTO - Suite test Service Worker
│   │   ├── test-sw-wrappers.js ✅ FATTO - Wrapper funzioni Service Worker test
│   │   ├── test-ui.js          ✅ FATTO - Suite test UI componenti
│   │   └── test-utils.js       ✅ FATTO - Utility test (logging, status, statistiche)
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
<!-- Test wrappers (funzioni globali per onclick) -->
<script src="js/tests/test-storage-wrappers.js"></script>
<script src="js/tests/test-prezzi-wrappers.js"></script>
<script src="js/tests/test-settings-wrappers.js"></script>
<script src="js/tests/test-sw-wrappers.js"></script>
<script src="js/tests/test-all-wrappers.js"></script>

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

**Responsabilità Dettagliate:**

`prezzi.js` gestisce **TUTTE** le responsabilità relative al calcolo prezzi:

1. **Gestione Parametri** (validazione/normalizzazione):

   - `isValidSelection()` - Valida che selezione sia corretta (indici validi, non uguali, ecc.)
   - `isRouteAvailable()` - Verifica che la tratta esista nella matrice
   - Normalizzazione indici (parseInt, controlli bounds)

2. **Calcolo Prezzo** (logica matematica):

   - `calculatePrice()` - Legge dalla matrice `prezzi[][]`
   - Gestione errori (try/catch, controlli tipo)
   - Fallback su `tariffarioAggiornato` se codice non trovato

3. **Recupero Codice**:

   - `getTicketCode()` - Legge dalla matrice `codici[][]`
   - Fallback su `tariffarioAggiornato` per codici mancanti

4. **Formattazione**:
   - `formatPrice()` - Formatta numero in "X.XX €" o "-"

**Architettura e Flusso Dati:**

```
┌─────────────────────────────────────────┐
│          prezzi.js                      │
│      (COMPLETAMENTE INDIPENDENTE)       │
├─────────────────────────────────────────┤
│ 1. Gestione Parametri                   │
│    - isValidSelection()                 │
│    - isRouteAvailable()                 │
│                                         │
│ 2. Calcolo Prezzo                       │
│    - calculatePrice()                   │
│      → Legge matrice prezzi[][]         │
│      → Gestisce errori                  │
│                                         │
│ 3. Recupero Codice                      │
│    - getTicketCode()                    │
│      → Legge matrice codici[][]         │
│      → Fallback tariffarioAggiornato     │
│                                         │
│ 4. Formattazione                        │
│    - formatPrice()                      │
└─────────────────────────────────────────┘
         ↑
         │ riceve parametri (NO variabili globali)
         │
┌─────────────┐
│ script.js   │ ← Carica tariffario (fetch)
│             │ ← Passa dati a Pricing.calculatePrice()
│             │ ← Aggiorna DOM con risultati
└─────────────┘
```

**Indipendenza da script.js:**

- ✅ `prezzi.js` NON importa nulla da `script.js`
- ✅ `prezzi.js` NON legge variabili globali di `script.js`
- ✅ `prezzi.js` riceve TUTTO come parametri (funzioni pure)
- ✅ `script.js` dipende da `prezzi.js` (chiama le funzioni)
- ✅ Separazione netta: Logica (`prezzi.js`) vs UI (`script.js`)

**Esempio Test Isolato:**

```javascript
// Test completamente isolato (senza script.js)
const tariffario = [
  {
    fermate: ["A", "B", "C"],
    prezzi: [
      [0, 2.5, 3.5],
      [2.5, 0, 2.0],
      [3.5, 2.0, 0],
    ],
    codici: [
      ["", "E1", "E2"],
      ["E1", "", "E1"],
      ["E2", "E1", ""],
    ],
  },
];

const result = Pricing.calculatePrice(0, 0, 1, tariffario);
// { prezzo: 2.5, codice: 'E1', valido: true }
```

**Futuro - Integrazione con tariffario.js:**

Quando sarà creato `data/tariffario.js`, `prezzi.js` potrà usarlo direttamente:

```javascript
// FUTURO (quando tariffario.js esisterà)
window.Pricing = {
  calculatePrice(lineaIdx, partenzaIdx, arrivoIdx) {
    // Non riceve più tariffario come parametro!
    const tariffario = window.Tariffario.get(); // ← Legge da tariffario.js
    // ... resto della logica ...
  },
};
```

Attualmente `prezzi.js` riceve `tariffario` come parametro per mantenere l'indipendenza e la testabilità.

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

#### **tests/test-storage-wrappers.js** ✅

**Contenuto:**

- Wrapper functions globali per test Storage
- `window.testStorage()` - Esegue tutti i test Storage
- `window.runSingleStorageTest()` - Esegue un singolo test
- `window.resetStorageModuleTests()` - Reset completo
- `window.updateStorageHeader()` - Aggiorna header con statistiche
- Funzioni log: `copyStorageLog()`, `downloadStorageLog()`, `clearStorageLog()`

**Dipendenze:** `tests/test-storage.js`, `tests/test-log-helpers.js`  
**Usato da:** `test.html` (onclick attributes)

---

#### **tests/test-prezzi-wrappers.js** ✅

**Contenuto:**

- Wrapper functions globali per test Prezzi
- `window.testPriceCalculation()` - Esegue tutti i test Prezzi
- `window.runSinglePriceTest()` - Esegue un singolo test
- Caricamento automatico tariffario se vuoto (da `window.tariffario` o `database.json`)

**Dipendenze:** `tests/test-prezzi.js`, `tests/test-log-helpers.js`  
**Usato da:** `test.html` (onclick attributes)

---

#### **tests/test-settings-wrappers.js** ✅

**Contenuto:**

- Wrapper functions globali per test Settings
- `window.testSettings()` - Esegue tutti i test Settings
- `window.runSingleSettingsTest()` - Esegue un singolo test

**Dipendenze:** `tests/test-settings.js`, `tests/test-log-helpers.js`  
**Usato da:** `test.html` (onclick attributes)

---

#### **tests/test-sw-wrappers.js** ✅

**Contenuto:**

- Wrapper functions globali per test Service Worker
- `window.testServiceWorker()` - Esegue tutti i test SW

**Dipendenze:** `tests/test-sw.js`, `tests/test-log-helpers.js`  
**Usato da:** `test.html` (onclick attributes)

---

#### **tests/test-all-wrappers.js** ✅

**Contenuto:**

- Wrapper function globale per eseguire tutti i test in sequenza
- `window.runAllTests()` - Esegue tutti i test (Database, Storage, Dark Mode, Prezzi, Settings, SW, UI, Manifest, Performance)

**Dipendenze:** Tutti i wrapper test  
**Usato da:** `test.html` (onclick attribute)

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

### Features

- [x] **features/updates.js** ✅ - Verifica aggiornamenti
- [x] **features/settings.js** ✅ - Logica impostazioni (tema, font, accessibilità)
- [x] **features/prezzi.js** ✅ - Calcolo prezzi (funzioni pure, logica business)

### Tests

- [x] **tests/test-utils.js** ✅ - Utility test (logging, status, statistiche)
- [x] **tests/test-log-helpers.js** ✅ - Funzioni gestione log (copia, download, clear)
- [x] **tests/test-database.js** ✅ - Suite test database.json
- [x] **tests/test-storage.js** ✅ - Suite test completa per storage.js (24 test)
- [x] **tests/test-storage-wrappers.js** ✅ - Wrapper funzioni Storage test
- [x] **tests/test-prezzi.js** ✅ - Suite test completa per prezzi.js (26+ test)
- [x] **tests/test-prezzi-wrappers.js** ✅ - Wrapper funzioni Prezzi test
- [x] **tests/test-settings.js** ✅ - Suite test per settings.js
- [x] **tests/test-settings-wrappers.js** ✅ - Wrapper funzioni Settings test
- [x] **tests/test-sw.js** ✅ - Suite test Service Worker
- [x] **tests/test-sw-wrappers.js** ✅ - Wrapper funzioni Service Worker test
- [x] **tests/test-all-wrappers.js** ✅ - Wrapper runAllTests()
- [ ] core/config.js
- [ ] core/utils.js
- [ ] data/database.js
- [ ] data/tariffario.js
- [ ] features/location.js
- [ ] features/animations.js
- [ ] components/navbar.js
- [ ] components/pwa.js
- [ ] main.js

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

**Ultimo aggiornamento**: 6 Novembre 2025  
**Versione progetto**: 1.6.7 (modularizzazione test completata)
