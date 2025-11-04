# 🔍 Analisi Ridondanza HTML: Modularizzazione `prezzi.js`

## ❌ **Codice Ridondante nelle HTML?**

### **Risposta: NO, non c'è ridondanza nelle HTML**

Dall'analisi dei file HTML:

#### **1. `index.html`**
```html
<!-- Unico riferimento inline ai prezzi -->
<button onclick="swapRoutes()">...</button>
```
- **1 riferimento**: `onclick="swapRoutes()"`
- **Funzione globale**: `window.swapRoutes()` già esiste in `script.js`
- **Nessuna logica calcolo prezzi inline**
- **Nessuna duplicazione**

#### **2. `prezzi.html`**
- **0 riferimenti** a funzioni calcolo prezzi
- **Nessuna logica calcolo inline**
- Solo rendering tabelle (chiama `renderPrezzi()` in `script.js`)

#### **3. Altre pagine HTML**
- **`fermate.html`**: Nessun riferimento calcolo prezzi
- **`benvenuto.html`**: Nessun riferimento calcolo prezzi
- **`test.html`**: Solo test, nessuna logica produzione

---

## ✅ **Ridondanza Eliminata (JavaScript)**

La ridondanza che eliminiamo è **DENTRO `script.js`**, non nelle HTML:

### **Prima Modularizzazione:**
```javascript
// script.js - Funzione calcolaPrezzo() (righe 400-442)
function calcolaPrezzo() {
  // Logica calcolo prezzo
  const val = tariffario[lineaIdx].prezzi[partenzaIdx][arrivoIdx];
  // Logica recupero codice
  let c = tariffario[lineaIdx].codici[partenzaIdx][arrivoIdx];
  // Fallback tariffarioAggiornato
  if (!c && tariffarioAggiornato) { ... }
}

// script.js - Funzione renderPrezzi() (righe 948-1000)
function renderPrezzi() {
  // Logica DUPLICATA:
  let codice = linea.codici?.[i]?.[j] ?? '';
  if (!codice && tariffarioAggiornato) {
    // Stesso fallback duplicato!
    const match = tariffarioAggiornato.find(...);
  }
  // Formattazione prezzo duplicata
  prezzo.toFixed(2) + ' €'
}
```

### **Dopo Modularizzazione:**
```javascript
// js/features/prezzi.js - Logica CENTRALIZZATA
window.Pricing = {
  calculatePrice(...) { /* logica unificata */ },
  getTicketCode(...) { /* logica unificata */ },
  formatPrice(...) { /* logica unificata */ }
}

// script.js - calcolaPrezzo() usa Pricing
function calcolaPrezzo() {
  const result = Pricing.calculatePrice(...);
  // Aggiorna DOM
}

// script.js - renderPrezzi() usa Pricing
function renderPrezzi() {
  const codice = Pricing.getTicketCode(...); // ✅ Non duplicato!
  const prezzoFormatted = Pricing.formatPrice(...); // ✅ Non duplicato!
}
```

---

## 📊 **Ridondanza Eliminata: Statistiche**

| Tipo Ridondanza | Prima | Dopo | Risparmio |
|-----------------|-------|------|-----------|
| **Logica calcolo prezzo** | 2 funzioni (calcolaPrezzo, renderPrezzi) | 1 funzione (Pricing.calculatePrice) | ✅ -50% |
| **Logica recupero codice** | 2 posti (calcolaPrezzo, renderPrezzi) | 1 funzione (Pricing.getTicketCode) | ✅ -50% |
| **Logica formattazione prezzo** | 2 posti | 1 funzione (Pricing.formatPrice) | ✅ -50% |
| **Fallback tariffarioAggiornato** | 2 posti (duplicato) | 1 funzione (centralizzato) | ✅ -50% |
| **Codice nelle HTML** | 0 (non c'era) | 0 (non c'è) | ✅ 0% |

---

## 🎯 **Conclusione**

### **Ridondanza HTML:**
- ❌ **NON eliminiamo ridondanza HTML** perché **non esiste**
- Le HTML usano solo `onclick="swapRoutes()"` che rimane compatibile

### **Ridondanza JavaScript:**
- ✅ **Eliminiamo ridondanza in `script.js`**:
  - Logica calcolo: da 2 funzioni → 1 modulo centralizzato
  - Logica codice: da 2 posti → 1 funzione
  - Formattazione: da 2 posti → 1 funzione
  - **Totale**: -50% codice duplicato in JavaScript

### **Beneficio Futuro:**
Se in futuro aggiungiamo una nuova pagina HTML che deve calcolare prezzi:
- ❌ **Prima**: Dovremmo duplicare logica in quella pagina
- ✅ **Dopo**: Usa `Pricing.calculatePrice()` - nessuna duplicazione!

---

## 📝 **Nota Finale**

La modularizzazione **non elimina ridondanza HTML** (non c'era), ma **elimina ridondanza JavaScript** e **previene future duplicazioni** in nuove pagine HTML.

**Verdetto**: Beneficio principale è **centralizzazione logica JavaScript**, non riduzione codice HTML (che è già minimale).

