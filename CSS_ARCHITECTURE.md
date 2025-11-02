# 🎨 Architettura CSS - TPL FVG Autisti

Questo documento descrive l'architettura CSS modulare del progetto.

## 📁 Struttura delle Cartelle

```
tpl-fvg-autisti-4/
├── css/
│   ├── variables.css          ✅ CREATO (vuoto, sarà popolato gradualmente)
│   ├── base.css               ← Reset, typography, body base
│   ├── layout.css             ← Container, grid, spacing globale
│   ├── animations.css         ✅ FATTO (variabili temporanee, saranno spostate in variables.css)
│   ├── themes.css             ← Dark mode, high contrast, filtri
│   ├── responsive.css         ← Media queries globali
│   └── components/            ← Componenti UI modulari
│       ├── footer.css         ✅ FATTO
│       ├── navbar.css         ⏳ TODO
│       ├── buttons.css        ⏳ TODO
│       ├── modals.css         ✅ FATTO (cache, fermate, linee - struttura base)
│       ├── settings/          ← Componente Settings modulare
│       │   ├── impostazioni.css     ✅ FATTO (struttura modale: overlay, header, tabs, layout)
│       │   ├── accessibilita.css    ✅ FATTO (tab "Accessibilità": font, touch, spacing, layout, blue filter, scale)
│       │   ├── aspetto.css          ✅ FATTO (tab "Aspetto": theme, animation, contrast, reduce motion)
│       │   └── info.css             ✅ FATTO (tab "Info": info-card, update-check-card)
│       ├── cards.css          ⏳ TODO
│       ├── forms.css          ⏳ TODO
│       └── pwa-nav.css        ⏳ TODO
├── style1.css                 ← File originale (da dismettere gradualmente)
└── ...
```

---

## 🎯 Ordine di Caricamento (IMPORTANTE!)

Gli stili devono essere caricati in questo ordine preciso:

```html
<!-- 1. VARIABILI (sempre per primo!) -->
<link rel="stylesheet" href="css/variables.css" />

<!-- 2. BASE (reset e typography) -->
<link rel="stylesheet" href="css/base.css" />

<!-- 3. LAYOUT (struttura generale) -->
<link rel="stylesheet" href="css/layout.css" />

<!-- 4. ANIMATIONS (dopo layout, prima componenti) -->
<link rel="stylesheet" href="css/animations.css" />

<!-- 5. COMPONENTI (in qualsiasi ordine) -->
<link rel="stylesheet" href="css/components/navbar.css" />
<link rel="stylesheet" href="css/components/footer.css" />
<link rel="stylesheet" href="css/components/buttons.css" />
<link rel="stylesheet" href="css/components/modals.css" />
<!-- Settings (dopo modals.css perché modifica modale esistente) -->
<link rel="stylesheet" href="css/components/settings/impostazioni.css" />
<link rel="stylesheet" href="css/components/settings/accessibilita.css" />
<link rel="stylesheet" href="css/components/settings/aspetto.css" />
<link rel="stylesheet" href="css/components/settings/info.css" />
<link rel="stylesheet" href="css/components/cards.css" />
<link rel="stylesheet" href="css/components/forms.css" />
<link rel="stylesheet" href="css/components/pwa-nav.css" />

<!-- 6. TEMI (quasi ultimo) -->
<link rel="stylesheet" href="css/themes.css" />

<!-- 7. RESPONSIVE (sempre ultimo!) -->
<link rel="stylesheet" href="css/responsive.css" />
```

**Perché questo ordine?**

- Le **variabili** devono esistere prima che altri file le usino
- Le **animazioni** devono essere disponibili prima dei componenti che le usano
- Il **responsive** sovrascrive tutto quando necessario
- I **componenti** possono essere caricati in qualsiasi ordine tra loro

---

## 📋 Descrizione dei File

### **1. variables.css** (Fondamenta) ✅ CREATO

**Contenuto:**

- Variabili colori (`:root`) - da spostare da style1.css
- Variabili spacing - da aggiungere quando servono
- Variabili font - da aggiungere quando servono
- Variabili transizioni/animazioni - da spostare da animations.css

**Stato attuale:** File creato vuoto, sarà popolato gradualmente durante la modularizzazione.

**Esempio futuro:**

```css
:root {
  /* Colori */
  --turchese: #007b8a;
  --bianco: #ffffff;
  --testo-principale: #0f172a;

  /* Spacing */
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 2rem;

  /* Font */
  --font-size-multiplier: 1;

  /* Animazioni */
  --anim-duration-normal: 0.3s;
  --easing-bezier-standard: cubic-bezier(0.4, 0, 0.2, 1);
}
```

**Dipendenze:** Nessuna  
**Usato da:** Tutti gli altri file CSS (attualmente non ancora incluso nell'HTML)

---

### **2. base.css** (Reset e Base)

**Contenuto:**

- Reset CSS globale (`* { margin: 0; padding: 0; }`)
- Font di sistema
- Stili body base
- Typography (h1, h2, h3, p)

**Esempio:**

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto;
  font-size: calc(16px * var(--font-size-multiplier));
  color: var(--testo-principale);
}
```

**Dipendenze:** `variables.css`  
**Usato da:** Tutto il progetto

---

### **3. layout.css** (Struttura)

**Contenuto:**

- Container principale (`.container`)
- Layout grid/flexbox globali
- Spacing e margin utilities
- Main content area

**Esempio:**

```css
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.main-content {
  min-height: 100vh;
  padding: 2rem 0;
}
```

**Dipendenze:** `variables.css`  
**Usato da:** Tutte le pagine

---

### **4. animations.css** (Animazioni e Transizioni) ✅ FATTO

**Contenuto:**

- Tutti i `@keyframes` comuni (fadeIn, slideUp, pulse, ecc.) ✅ Spostati da style1.css
- Utility classes per transizioni (`.transition-all`, `.transition-fast`, ecc.) ✅ Creati
- Utility classes per animazioni (`.fade-in`, `.slide-up`, ecc.) ✅ Creati
- Configurazione reduce-motion (prefers-reduced-motion) ✅ Implementato

**Esempio:**

```css
/* Variabili durate/easing vengono da variables.css */
.transition-all {
  transition: all var(--anim-duration-normal) var(--easing-ease);
}

.fade-in {
  animation: fadeIn var(--anim-duration-normal) var(--easing-ease-out);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

**Dipendenze:** `variables.css` (variabili temporanee in animations.css, saranno spostate)  
**Usato da:** Tutti i componenti (buttons.css, modals.css, ecc.)

**Stato modularizzazione animazioni:**

- ✅ **Tutti i `@keyframes` spostati** da style1.css → animations.css
- ✅ **Utility classes create** per animazioni e transizioni comuni
- ✅ **Duplicazioni rimosse** (SEZIONE 2 vs SEZIONE 5 unificate)
- ✅ **Variabili CSS** usate in tutte le utility classes

**Animazioni inline rimaste in style1.css:**

**🔵 ✅ Completate - Sostituite con utility classes:**

- ✅ Linea 4694: `.settings-tab-content.active` → sostituito con `.fade-in` (HTML + JS)
- ✅ Linea 6012: `.update-check-icon` → sostituito con `.rotate-slow` (HTML)
- ✅ Linea 6688: `.offline-icon` → sostituito con `.pulse` (JS dinamico)

**🟡 Componenti-specifiche (da spostare con componente):**

- Linea 190, 194: `body.animation-enabled` → `animation: gradientShift` (controllato da JS, OK così)
- Linea 1647: `.cache-modal-content` → `animation: modalSlideIn 0.3s ease-out` → spostare in `modals.css`
- Linea 2030: `.mobile-toggle-with-badge.active::after` → `animation: pulse-active` → spostare in `navbar.css`
- Linea 2063: `.mobile-toggle-with-badge.active .mobile-nav-icon` → `animation: rotate-icon` → spostare in `navbar.css`
- Linea 4015: `.pwa-install-banner` → `animation: slideUp 0.4s ease-out` → spostare in `pwa-nav.css`
- Linea 5780: `.display-optimal` → `animation: pulseGlow` → spostare con componente display
- Linea 6501: `.pwa-brand-header::before` → `animation: dotPulse` → spostare in `pwa-nav.css`
- Linea 6554: `.pwa-bottom-nav.show` → `animation: slideUpNav` → spostare in `pwa-nav.css`

**Note:**

- Le animazioni componenti-specifiche saranno spostate insieme ai rispettivi componenti durante la modularizzazione
- ✅ Le 3 animazioni sostituibili con utility classes sono state completate

---

### **5. components/** (Componenti UI)

#### **components/footer.css** ✅

**Contenuto:**

- Stili `.footer`
- Stili `.footer-links`
- Stili `.telegram-link`
- Media queries specifiche footer

**Dipendenze:** `variables.css`  
**Usato da:** Tutte le pagine (caricato da `footer.js`)

#### **components/navbar.css** ⏳

**Contenuto:**

- Header/navbar
- Logo e brand
- Menu mobile/desktop
- Hamburger button

#### **components/buttons.css** ⏳

**Contenuto:**

- Tutti i pulsanti dell'app
- Stati hover/active/disabled
- Varianti (primary, secondary, danger, etc.)

#### **components/modals.css** ✅

**Contenuto:**

- Modal cache (verifica aggiornamenti)
- Modal fermate (selezione fermate)
- Modal linee (selezione linee)
- Modal overlay, content, header, body, footer (struttura base)
- Animazioni apertura/chiusura
- Stili per barra ricerca, liste, toggle switch
- Dark mode per tutti i modali
- Responsive mobile e schermi piccoli

**Dipendenze:** `variables.css`, `animations.css`  
**Usato da:** Tutte le pagine (index.html, fermate.html, prezzi.html, benvenuto.html, test.html)

**Note:** Il modal impostazioni è stato modularizzato in `components/settings/` (vedi sotto)

---

#### **components/settings/** (Componente Settings modulare)

Struttura allineata all'UI del modal Impostazioni per facilità di manutenzione.

##### **impostazioni.css** ✅

**Contenuto:**

- Struttura modale impostazioni (`.settings-modal`, `.settings-modal-content`)
- Header modale (`.settings-modal-header`, `.settings-modal-close`)
- Sistema tabs (`.settings-tabs`, `.settings-tab`, `.tab-icon`)
- Layout content (`.settings-content`, `.settings-tab-content`)
- Section container (`.settings-section`, `.settings-section-title`)
- Responsive schermi piccoli

**Dipendenze:** `variables.css`, `animations.css`, `components/modals.css` (eredita struttura base)  
**Usato da:** Modal Impostazioni (tab container)

##### **accessibilita.css** ✅

**Contenuto:**

- **Stili UI tab "Accessibilità"** (componenti visibili nel modal):
  - `.settings-font-buttons`, `.font-sample`, `.font-label` (pulsanti dimensione testo)
  - `.scale-preset-selector`, `.scale-preset-card` (selettore dimensione interfaccia)
  - `.settings-item` per touch, spacing, layout, blue filter
  - Toggle switch e label della tab
- **NOTA**: Gli effetti globali (`.touch-friendly`, `.extra-spacing`, `.compact-layout`, `.blue-light-filter`, `.font-size-*`, `.interface-scale-*` applicati a `body`) sono in `themes.css`

**Dipendenze:** `variables.css`, `components/settings/impostazioni.css`  
**Usato da:** Tab "Accessibilità" del modal Impostazioni

**Note:** Allineato all'UI - modifichi la tab Accessibilità → modifichi questo file  
**Distinzione**: Questo file = UI della tab | `themes.css` = effetti globali applicati all'app

##### **aspetto.css** ✅

**Contenuto:**

- **Stili UI tab "Aspetto"** (componenti visibili nel modal):
  - `.settings-theme-options`, `.theme-option-card`, `.theme-option-icon`
  - `.settings-item` per animazione, contrasto, reduce motion
  - Toggle switch e label della tab
- **NOTA**: Gli effetti globali (`.dark`, `.high-contrast`, `.reduce-motion` applicati a `body`) sono in `themes.css`

**Dipendenze:** `variables.css`, `components/settings/impostazioni.css`  
**Usato da:** Tab "Aspetto" del modal Impostazioni

**Note:** Allineato all'UI - modifichi la tab Aspetto → modifichi questo file  
**Distinzione**: Questo file = UI della tab | `themes.css` = effetti globali applicati all'app

##### **info.css** ✅

**Contenuto:**

- Info card app (`.info-card`, `.info-header`, `.info-logo`, `.info-title`)
- Update check card (`.update-check-card`, `.update-check-header`, `.update-check-btn`)
- Link utili (`.info-links`)
- Aggiornamenti recenti (stili changelog nella tab Info)

**Dipendenze:** `variables.css`, `components/settings/impostazioni.css`  
**Usato da:** Tab "Info" del modal Impostazioni

**Note:** Allineato all'UI - modifichi la tab Info → modifichi questo file

#### **components/cards.css** ⏳

**Contenuto:**

- Price card
- Info card
- Settings card
- Glassmorphism effects

#### **components/forms.css** ⏳

**Contenuto:**

- Input, select, textarea
- Labels e placeholders
- Form groups
- Validation styles

#### **components/pwa-nav.css** ⏳

**Contenuto:**

- PWA bottom navigation
- PWA brand header
- Tab attivi/inattivi

---

### **6. themes.css** (Effetti Globali Temi)

**IMPORTANTE**: Questo file contiene gli **effetti globali** applicati all'intera app quando le impostazioni sono attive, NON gli stili UI delle tab (che sono in `components/settings/`).

**Contenuto:**

- **Effetti globali dark mode** (`.dark` applicato a `:root` - override variabili CSS)
- **Effetti globali high contrast** (`.high-contrast` applicato a `body` - stili globali)
- **Effetti globali blue light filter** (`.blue-light-filter` applicato a `body` - overlay globale)
- **Effetti globali reduce motion** (`.reduce-motion` applicato a `body` - disabilita animazioni globali)
- **Effetti globali touch friendly** (`.touch-friendly` applicato a `body` - stili globali pulsanti/spacing)

**Nota**: Gli stili UI delle tab (pulsanti, card, toggle) sono in:

- `components/settings/aspetto.css` → UI tab "Aspetto"
- `components/settings/accessibilita.css` → UI tab "Accessibilità"

**Esempio:**

```css
/* Effetti globali - applicati a body/:root quando la classe è attiva */
.dark {
  --testo-principale: #ffffff;
  --bg: #0f172a;
}

body.high-contrast button {
  border-width: 3px; /* Bordo più spesso globalmente */
}

body.blue-light-filter::after {
  background-color: rgba(255, 235, 200, 0.2); /* Overlay globale */
  opacity: 1;
}
```

**Dipendenze:** `variables.css`  
**Usato da:** Tutte le pagine (effetti globali quando impostazioni attive)  
**Caricato dopo:** `components/settings/*.css` (per poter sovrascrivere se necessario)

---

### **7. responsive.css** (Media Queries)

**Contenuto:**

- Media queries globali
- Breakpoints standard
- Adattamenti layout responsive

**Esempio:**

```css
@media (max-width: 768px) {
  .container {
    padding: 0 0.5rem;
  }
}
```

**Dipendenze:** Tutti i file precedenti  
**Usato da:** Tutte le pagine

---

## 🔄 Processo di Migrazione

### Step da seguire per ogni componente:

1. **Identifica** il CSS del componente in `style1.css`
2. **Crea** il file in `css/components/[nome].css`
3. **Copia** il CSS estratto
4. **Aggiungi** commenti e documentazione
5. **Aggiorna** gli HTML per caricare il nuovo CSS
6. **Testa** che tutto funzioni
7. **Aggiorna** il service worker (`sw.js`)
8. **Rimuovi** il CSS da `style1.css` (opzionale, dopo test)
9. **Aggiorna** questo README (✅ → componente completato)

---

## ✅ Componenti Completati

- [x] **footer.css** ✅ - Footer e link Telegram (30 Ottobre 2025)
- [x] **modals.css** ✅ - Modali cache, fermate, linee (struttura base) (31 Ottobre 2025)
- [x] **settings/impostazioni.css** ✅ - Struttura modale impostazioni (1 Novembre 2025)
- [x] **settings/accessibilita.css** ✅ - Tab Accessibilità (1 Novembre 2025)
- [x] **settings/aspetto.css** ✅ - Tab Aspetto (1 Novembre 2025)
- [x] **settings/info.css** ✅ - Tab Info (1 Novembre 2025)
- [ ] navbar.css
- [ ] buttons.css
- [ ] cards.css
- [ ] forms.css
- [ ] pwa-nav.css

---

## 📦 Service Worker

**IMPORTANTE**: Ogni volta che aggiungi un nuovo file CSS, aggiornalo in `sw.js`:

```javascript
const STATIC_ASSETS = [
  // ... altri file ...
  "./css/variables.css",
  "./css/base.css",
  "./css/layout.css",
  "./css/animations.css", // ← Animazioni comuni
  "./css/components/footer.css", // ← Componenti
  "./css/components/modals.css", // ← Modals (base)
  "./css/components/settings/impostazioni.css", // ← Settings (struttura)
  "./css/components/settings/accessibilita.css", // ← Settings (tab Accessibilità)
  "./css/components/settings/aspetto.css", // ← Settings (tab Aspetto)
  "./css/components/settings/info.css", // ← Settings (tab Info)
  "./css/themes.css",
  "./css/responsive.css",
  // ...
];
```

---

## 🎯 Vantaggi di questa Architettura

✅ **Manutenibilità**: Trova subito dove modificare uno stile  
✅ **Scalabilità**: Aggiungi componenti senza toccare il resto  
✅ **Riutilizzabilità**: Usa componenti in altri progetti  
✅ **Performance**: Carica solo ciò che serve (futuro)  
✅ **Git**: Diff più puliti, meno conflitti  
✅ **Team**: Più sviluppatori possono lavorare in parallelo  
✅ **Debug**: Isola problemi CSS velocemente

---

## 📝 Note

- **style1.css** verrà gradualmente svuotato e dismesso
- Mantieni sempre l'ordine di caricamento indicato
- Ogni componente deve essere **autosufficiente** (tranne variabili)
- Usa **commenti chiari** per documentare sezioni complesse
- Testa **sempre** dopo ogni migrazione

---

**Ultimo aggiornamento**: 1 Novembre 2025  
**Versione progetto**: 1.5.9 (modularizzazione test completata)
