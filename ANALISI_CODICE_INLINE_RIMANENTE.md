# 🔍 Analisi Codice Inline Rimanente

**Data:** 6 Novembre 2025

---

## 📋 Riepilogo Parti Inline Trovate

### 1. **CSS Inline in `fermate.html`** (~23 righe)

**Posizione:** Righe 22-44

**Contenuto:**
- Media query per `.show-on-mobile` su mobile
- Animazione `@keyframes bounce`

**Analisi:**
- ✅ **Specifico della pagina:** Le regole sono specifiche per `fermate.html` (`.fermate-page`)
- ✅ **Animazione bounce:** Non presente in `css/animations.css`
- ⚠️ **Da valutare:** Se estrarre in `css/pages/fermate.css` o lasciare inline

**Raccomandazione:** Estrarre in `css/pages/fermate.css` per coerenza con `benvenuto.css`

---

### 2. **JavaScript Inline in `benvenuto.html`** (~23 righe)

**Posizione:** Righe 71-93

**Contenuto:**
- Event listener per pulsante "Inizia" (`#start-btn`)
- Aggiornamento anno nel footer (`#footer-year`)

**Analisi:**
- ✅ **Specifico della pagina:** Logica specifica per `benvenuto.html`
- ⚠️ **Aggiornamento anno footer:** Potrebbe essere già gestito da `footer.js`
- ⚠️ **Da valutare:** Se estrarre in `js/pages/benvenuto.js` o lasciare inline

**Raccomandazione:** Estrarre in `js/pages/benvenuto.js` per coerenza

---

### 3. **Attributo style inline in `benvenuto.html`** (1 riga)

**Posizione:** Riga 39

**Contenuto:**
```html
<p style="font-size: 1.05rem; line-height: 1.6; margin-top: 16px;">
```

**Analisi:**
- ⚠️ **Stile specifico:** Solo per questo paragrafo
- ✅ **Da estrarre:** Spostare in `css/pages/benvenuto.css`

**Raccomandazione:** Estrarre in CSS

---

### 4. **Attributi `style="display: none;"`** (molti)

**Posizione:** Vari file HTML

**Contenuto:**
- `style="display: none;"` su vari elementi

**Analisi:**
- ✅ **Gestiti dinamicamente:** Questi sono gestiti da JavaScript per mostrare/nascondere elementi
- ✅ **OK lasciare:** Sono necessari per lo stato iniziale degli elementi
- ⚠️ **Alternativa:** Potrebbero essere gestiti con classi CSS (es. `.hidden`)

**Raccomandazione:** Lasciare così (sono gestiti dinamicamente da JS)

---

## 🎯 Raccomandazioni

### Priorità Alta (Da fare)
1. ✅ **Estrarre CSS `fermate.html`** → `css/pages/fermate.css`
2. ✅ **Estrarre JavaScript `benvenuto.html`** → `js/pages/benvenuto.js`
3. ✅ **Estrarre attributo style inline** → `css/pages/benvenuto.css`

### Priorità Bassa (Opzionale)
4. ⚠️ **Sostituire `style="display: none;"` con classi CSS** (es. `.hidden`)
   - Richiede modifiche a JavaScript per usare classi invece di `style.display`
   - Beneficio: migliore separazione HTML/CSS

---

## 📊 Statistiche

- **CSS inline rimanente:** ~23 righe (`fermate.html`)
- **JavaScript inline rimanente:** ~23 righe (`benvenuto.html`)
- **Attributi style inline:** 1 (`benvenuto.html`) + molti `display: none;` (OK)
- **Totale da estrarre:** ~47 righe

---

## ✅ Conclusione

Ci sono ancora alcune parti inline da estrarre:
1. CSS in `fermate.html` (specifico pagina)
2. JavaScript in `benvenuto.html` (specifico pagina)
3. 1 attributo style inline in `benvenuto.html`

Gli attributi `style="display: none;"` sono OK perché gestiti dinamicamente da JavaScript.

