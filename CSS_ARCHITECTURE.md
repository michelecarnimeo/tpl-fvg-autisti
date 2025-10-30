# 🎨 Architettura CSS - TPL FVG Autisti

Questo documento descrive l'architettura CSS modulare del progetto.

## 📁 Struttura delle Cartelle

```
tpl-fvg-autisti-4/
├── css/
│   ├── variables.css          ← Variabili globali CSS (:root)
│   ├── base.css               ← Reset, typography, body base
│   ├── layout.css             ← Container, grid, spacing globale
│   ├── themes.css             ← Dark mode, high contrast, filtri
│   ├── responsive.css         ← Media queries globali
│   └── components/            ← Componenti UI modulari
│       ├── footer.css         ✅ FATTO
│       ├── navbar.css         ⏳ TODO
│       ├── buttons.css        ⏳ TODO
│       ├── modals.css         ⏳ TODO
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
<link rel="stylesheet" href="css/variables.css">

<!-- 2. BASE (reset e typography) -->
<link rel="stylesheet" href="css/base.css">

<!-- 3. LAYOUT (struttura generale) -->
<link rel="stylesheet" href="css/layout.css">

<!-- 4. COMPONENTI (in qualsiasi ordine) -->
<link rel="stylesheet" href="css/components/navbar.css">
<link rel="stylesheet" href="css/components/footer.css">
<link rel="stylesheet" href="css/components/buttons.css">
<link rel="stylesheet" href="css/components/modals.css">
<link rel="stylesheet" href="css/components/cards.css">
<link rel="stylesheet" href="css/components/forms.css">
<link rel="stylesheet" href="css/components/pwa-nav.css">

<!-- 5. TEMI (quasi ultimo) -->
<link rel="stylesheet" href="css/themes.css">

<!-- 6. RESPONSIVE (sempre ultimo!) -->
<link rel="stylesheet" href="css/responsive.css">
```

**Perché questo ordine?**
- Le **variabili** devono esistere prima che altri file le usino
- Il **responsive** sovrascrive tutto quando necessario
- I **componenti** possono essere caricati in qualsiasi ordine tra loro

---

## 📋 Descrizione dei File

### **1. variables.css** (Fondamenta)
**Contenuto:**
- Variabili colori (`:root`)
- Variabili spacing
- Variabili font
- Variabili transizioni/animazioni

**Esempio:**
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
}
```

**Dipendenze:** Nessuna  
**Usato da:** Tutti gli altri file CSS

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
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto;
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

### **4. components/** (Componenti UI)

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

#### **components/modals.css** ⏳
**Contenuto:**
- Modal overlay
- Modal content
- Modal header/body/footer
- Animazioni apertura/chiusura

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

### **5. themes.css** (Temi)
**Contenuto:**
- Dark mode (`.dark`)
- High contrast (`.high-contrast`)
- Blue light filter (`.blue-light-filter`)
- Reduce motion (`.reduce-motion`)
- Touch friendly (`.touch-friendly`)

**Esempio:**
```css
.dark {
  --testo-principale: #ffffff;
  --bg: #0f172a;
}

.high-contrast {
  --contrasto: 1.5;
}
```

**Dipendenze:** `variables.css`  
**Usato da:** Tutte le pagine

---

### **6. responsive.css** (Media Queries)
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
- [ ] navbar.css
- [ ] buttons.css
- [ ] modals.css
- [ ] cards.css
- [ ] forms.css
- [ ] pwa-nav.css

---

## 📦 Service Worker

**IMPORTANTE**: Ogni volta che aggiungi un nuovo file CSS, aggiornalo in `sw.js`:

```javascript
const STATIC_ASSETS = [
  // ... altri file ...
  './css/variables.css',
  './css/base.css',
  './css/layout.css',
  './css/components/footer.css',  // ← Aggiungi qui
  './css/themes.css',
  './css/responsive.css',
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

**Ultimo aggiornamento**: 30 Ottobre 2025  
**Versione progetto**: 1.5.5 → 1.5.6 (in sviluppo)

