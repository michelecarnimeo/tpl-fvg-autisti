# 📜 Architettura JavaScript - TPL FVG Autisti

Questo documento descrive l'architettura JavaScript modulare del progetto.

## 📁 Struttura delle Cartelle

```
tpl-fvg-autisti/
├── js/
│   ├── core/
│   │   ├── config.js          ← Configurazione globale ⏳ TODO
│   │   ├── utils.js           ← Utilities generiche ⏳ TODO
│   │   └── storage.js         ← Gestione localStorage ⏳ TODO
│   │
│   ├── components/
│   │   ├── footer.js           ✅ FATTO
│   │   ├── changelog.js        ✅ FATTO
│   │   ├── navbar.js           ⏳ TODO
│   │   ├── modals.js           ✅ FATTO - UI modali (Fermate, Linee, Settings)
│   │   └── pwa.js              ⏳ TODO
│   │
│   ├── features/
│   │   ├── updates.js          ✅ FATTO - Verifica aggiornamenti
│   │   ├── settings.js         ⏳ TODO - Logica impostazioni (tema, font, accessibilità)
│   │   ├── animations.js       ← Logica animazioni JS ⏳ TODO
│   │   ├── location.js         ← Geolocalizzazione ⏳ TODO
│   │   └── pricing.js          ← Calcolo prezzi ⏳ TODO
│   │
│   ├── data/
│   │   ├── tariffario.js       ← Gestione dati tariffario ⏳ TODO
│   │   └── database.js         ← Gestione database.json ⏳ TODO
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
<script src="js/data/database.js"></script>
<script src="js/data/tariffario.js"></script>

<!-- 3. FEATURES (in qualsiasi ordine) -->
<script src="js/features/updates.js"></script>
<script src="js/features/settings.js"></script>
<script src="js/features/location.js"></script>
<script src="js/features/pricing.js"></script>
<script src="js/features/animations.js"></script>

<!-- 4. COMPONENTI (in qualsiasi ordine) -->
<script src="js/components/footer.js"></script>
<script src="js/components/changelog.js"></script>
<script src="js/components/navbar.js"></script>
<script src="js/components/modals.js"></script>
<script src="js/components/pwa.js"></script>

<!-- 5. MAIN (sempre ultimo!) -->
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
**Usato da:** Features (pricing.js)

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

#### **features/pricing.js** ⏳

**Contenuto:**

- Calcolo prezzi biglietti
- Validazione tratte
- Gestione codici biglietto
- Calcolo andata/ritorno

**Esempio:**

```javascript
// Calcolo prezzi
import { getTariffario } from "../data/tariffario.js";

export function calculatePrice(lineaIndex, partenzaIndex, arrivoIndex) {
  const tariffario = getTariffario();
  const linea = tariffario[lineaIndex];

  // Logica calcolo prezzo...
  return {
    prezzo: 2.5,
    codice: "ABC123",
  };
}
```

**Dipendenze:** `data/tariffario.js`, `core/utils.js`  
**Usato da:** Componenti, main.js

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
- Caricamento versione
- Gestione link

**Dipendenze:** `core/utils.js`, `core/storage.js`  
**Usato da:** Tutte le pagine

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

- [x] **footer.js** ✅ - Footer dinamico
- [x] **changelog.js** ✅ - Dati e visualizzazione changelog
- [x] **features/updates.js** ✅ - Verifica aggiornamenti
- [x] **components/modals.js** ✅ - UI modali (Fermate, Linee, Settings)
- [ ] core/config.js
- [ ] core/utils.js
- [ ] core/storage.js
- [ ] data/database.js
- [ ] data/tariffario.js
- [ ] features/settings.js
- [ ] features/location.js
- [ ] features/pricing.js
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
  "./js/features/pricing.js",
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
- **Import**: `import { calculatePrice } from './features/pricing.js'`

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

**Ultimo aggiornamento**: 31 Ottobre 2025  
**Versione progetto**: 1.5.8 (in sviluppo)
