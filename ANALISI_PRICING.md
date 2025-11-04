# 📊 Analisi: Modularizzazione Calcolo Biglietto

## 🔍 Stato Attuale

### **Funzioni Esistenti in `script.js`:**

1. **`calcolaPrezzo()`** (righe 400-442)
   - Calcola prezzo dalla matrice `tariffario[lineaIdx].prezzi[partenzaIdx][arrivoIdx]`
   - Recupera codice da `tariffario[lineaIdx].codici[partenzaIdx][arrivoIdx]`
   - Fallback su `tariffarioAggiornato` se codice non trovato
   - Aggiorna direttamente DOM: `summaryPrezzo`, `summaryCodice`, `prezzoErrore`
   - Gestisce stato pulsante swap

2. **`updateSummary()`** (righe 389-397)
   - Aggiorna UI partenza/arrivo (`summaryPartenza`, `summaryArrivo`)
   - Chiama `updatePriceCardState()`

3. **`updatePriceCardState()`** (righe 372-386)
   - Gestisce classe CSS `.inactive` sulla card prezzo
   - Basato su `partenzaIdx !== '' && arrivoIdx !== ''`

4. **`swapRoutes()`** (righe 445-461)
   - Scambia partenza ↔ arrivo
   - Aggiorna UI e ricalcola

5. **`calculatePrice()`** (righe 464-467)
   - Wrapper globale che setta `hasCalculated = true`

### **Dipendenze Attuali:**
- Variabili globali: `tariffario`, `lineaIdx`, `partenzaIdx`, `arrivoIdx`, `tariffarioAggiornato`
- Elementi DOM: `summaryPrezzo`, `summaryCodice`, `prezzoErrore`, `summaryPartenza`, `summaryArrivo`, `swapBtn`, `priceCard`
- Funzioni DOM: `partenzaText`, `arrivoText`

---

## 🎯 Proposta Modularizzazione

### **File: `js/features/pricing.js`**

#### **Responsabilità:**
- Logica di calcolo prezzi (PURE FUNCTIONS)
- Recupero codici biglietto
- Validazione tratte
- Calcolo validità selezioni

#### **API Pubblica Proposta:**

```javascript
// Pricing.js - API Pubblica
window.Pricing = {
  // Calcola prezzo per una tratta
  calculatePrice(lineaIdx, partenzaIdx, arrivoIdx, tariffario, tariffarioAggiornato = null) {
    // Ritorna: { prezzo: number|null, codice: string, valido: boolean }
  },
  
  // Recupera codice biglietto
  getTicketCode(lineaIdx, partenzaIdx, arrivoIdx, tariffario, tariffarioAggiornato = null) {
    // Ritorna: string (codice o '')
  },
  
  // Valida selezione (linea, partenza, arrivo)
  isValidSelection(lineaIdx, partenzaIdx, arrivoIdx, tariffario) {
    // Ritorna: boolean
  },
  
  // Calcola prezzo per tratte multiple (ANDATA + RITORNO)
  calculateRoundTrip(lineaIdx, partenzaIdx, arrivoIdx, tariffario) {
    // NUOVA FUNZIONE: Calcola prezzo andata + ritorno
    // Ritorna: { andata: number, ritorno: number, totale: number }
  },
  
  // Formatta prezzo per display
  formatPrice(prezzo) {
    // Ritorna: string "X.XX €" o "-"
  },
  
  // Valida se tratta esiste nella matrice
  isRouteAvailable(lineaIdx, partenzaIdx, arrivoIdx, tariffario) {
    // Ritorna: boolean
  }
};
```

---

## 🔄 Flusso Dati Proposto

```
[script.js / UI]
    ↓ chiama
[Pricing.calculatePrice()]
    ↓ usa
[data/tariffario.js] ← (futuro)
    ↓ ritorna
{ prezzo, codice, valido }
    ↓ aggiorna
[script.js → DOM]
```

---

## ✨ Nuova Funzionalità Proposta

### **Calcolo Andata + Ritorno**

**Motivazione:**
- Utenti spesso vogliono sapere il costo totale del viaggio di ritorno
- Utile per pianificazione viaggi
- Può essere mostrato in UI come "Totale andata/ritorno"

**Implementazione:**
```javascript
calculateRoundTrip(lineaIdx, partenzaIdx, arrivoIdx, tariffario) {
  const andata = this.calculatePrice(lineaIdx, partenzaIdx, arrivoIdx, tariffario);
  const ritorno = this.calculatePrice(lineaIdx, arrivoIdx, partenzaIdx, tariffario);
  
  return {
    andata: andata.prezzo,
    ritorno: ritorno.prezzo,
    totale: (andata.prezzo || 0) + (ritorno.prezzo || 0),
    valido: andata.valido && ritorno.valido
  };
}
```

**UI Possibile:**
```
┌─────────────────────────────┐
│ Codice biglietto: E3        │
│                             │
│ Andata:  4.00 €             │
│ Ritorno: 4.00 €             │
│ ─────────────────────────   │
│ Totale:  8.00 €             │
└─────────────────────────────┘
```

---

## 📦 Dipendenze Modulo

### **Input (Callback/Config):**
- `getTariffario()` - funzione per ottenere tariffario
- `getTariffarioAggiornato()` - funzione per fallback codici

### **Output (Callback):**
- Non aggiorna direttamente il DOM (separazione responsabilità)
- Ritorna oggetti con dati calcolati
- `script.js` si occupa di aggiornare il DOM

---

## 🎨 Vantaggi Modularizzazione

1. **Testabilità**: Funzioni pure facili da testare
2. **Riutilizzabilità**: Logica usabile in più pagine (index.html, prezzi.html)
3. **Manutenibilità**: Modifiche logica isolate
4. **Estendibilità**: Facile aggiungere nuove funzionalità (es. andata/ritorno)
5. **Separazione Responsabilità**: Logica separata da UI

---

## 🔧 Piano di Migrazione

### **Step 1: Creare `pricing.js`**
- Funzioni pure di calcolo
- Nessuna dipendenza DOM
- Testate in isolamento

### **Step 2: Refactor `script.js`**
- Sostituire `calcolaPrezzo()` con chiamate a `Pricing.calculatePrice()`
- Mantenere funzioni UI (`updateSummary()`, `updatePriceCardState()`)
- Usare callback per aggiornare DOM

### **Step 3: Aggiungere nuova funzione**
- Implementare `calculateRoundTrip()`
- Aggiungere UI per andata/ritorno (opzionale)

### **Step 4: Testing**
- Testare calcolo prezzi
- Testare nuova funzionalità
- Verificare compatibilità con pagine esistenti

---

## ❓ Domande Aperte

1. **Nuova funzione**: Quale esattamente vuoi aggiungere? (Andata/ritorno o altra?)
2. **UI Andata/Ritorno**: Vuoi mostrarla nella card prezzo principale o in un'altra sezione?
3. **Compatibilità**: Manteniamo `calcolaPrezzo()` come wrapper per retrocompatibilità?
4. **Tariffario Aggiornato**: Come gestiamo `tariffarioAggiornato`? Lo spostiamo in `data/tariffario.js`?

---

## 📝 Note

- Mantenere `window.calculatePrice()` e `window.swapRoutes()` per retrocompatibilità HTML
- Funzioni UI (`updateSummary()`, `updatePriceCardState()`) possono rimanere in `script.js` o essere spostate in un modulo `ui/pricing-ui.js` futuro

