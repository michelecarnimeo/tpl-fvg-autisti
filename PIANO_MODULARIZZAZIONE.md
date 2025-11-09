# 📋 Piano di Modularizzazione Progressiva - script.js

**Data Inizio**: 7 Novembre 2025  
**Obiettivo**: Modularizzare completamente `script.js` (~2087 righe → ~300 righe orchestratore)

---

## 🎯 Strategia

**Approccio**: Modularizzazione incrementale, partendo dai moduli più semplici e isolati, poi quelli più complessi.

**Regole**:
- ✅ Ogni modulo viene testato prima di procedere
- ✅ Wrapper mantenuti per retrocompatibilità
- ✅ Pulizia finale solo alla fine

---

## 📦 Elenco Moduli da Creare

### **MODULO 1: UI Helpers** ⭐ INIZIAMO QUI
**File**: `js/utils/ui-helpers.js`  
**Righe stimate**: ~40 righe  
**Complessità**: ⭐ (Bassa)  
**Dipendenze**: Nessuna

**Funzioni da estrarre**:
- `scrollToTop()` - Scroll smooth alla cima
- `toggleScrollToTopButton()` - Mostra/nascondi pulsante scroll
- `toggleSwapButton(show)` - Mostra/nascondi pulsante swap

**Benefici**:
- ✅ Modulo isolato, zero dipendenze
- ✅ Facile da testare
- ✅ Rimuove ~40 righe da script.js

---

### **MODULO 2: Page Renderers** 
**File**: `js/features/page-renderers.js`  
**Righe stimate**: ~220 righe  
**Complessità**: ⭐⭐ (Media)  
**Dipendenze**: `Tariffario`, `Geolocation`, `Pricing`

**Funzioni da estrarre**:
- `renderFermate(lineaIndex, sortByDistance)` - Renderizza liste fermate (andata/ritorno)
- `renderPrezzi(lineaIndex)` - Renderizza tabelle prezzi (andata/ritorno)

**Benefici**:
- ✅ Logica rendering centralizzata
- ✅ Rimuove ~220 righe da script.js
- ✅ Facilita test e manutenzione

**Note**:
- Dipende da `window.Tariffario.getData()`
- Dipende da `window.Geolocation.sortFermateByDistance()` (opzionale)
- Dipende da `window.Pricing.calculatePrice()` (opzionale)

---

### **MODULO 3: Page Search**
**File**: `js/features/page-search.js`  
**Righe stimate**: ~70 righe  
**Complessità**: ⭐⭐ (Media)  
**Dipendenze**: Nessuna (solo DOM)

**Funzioni da estrarre**:
- `setupRicercaPrezzi()` - Setup ricerca per tabella prezzi
- `setupRicercaFermate()` - Setup ricerca per lista fermate (se presente)

**Benefici**:
- ✅ Logica ricerca centralizzata
- ✅ Rimuove ~70 righe da script.js
- ✅ Facile da testare (solo DOM)

---

### **MODULO 4: Page Lines (Fermate/Prezzi)**
**File**: `js/features/page-lines.js`  
**Righe stimate**: ~280 righe  
**Complessità**: ⭐⭐⭐ (Media-Alta)  
**Dipendenze**: `Tariffario`, `PageRenderers`

**Funzioni da estrarre**:
- `populateLineeTratte()` - Popola modal linee per pagina fermate
- `populateLineePrezzi()` - Popola modal linee per pagina prezzi
- `selectLineaFermate(idx, nome)` - Selezione linea in pagina fermate
- `selectLineaPrezzi(idx, nome)` - Selezione linea in pagina prezzi
- `openLineeModalFermate()` - Apri modal linee fermate
- `closeLineeModalFermate()` - Chiudi modal linee fermate
- `openLineeModalPrezzi()` - Apri modal linee prezzi
- `closeLineeModalPrezzi()` - Chiudi modal linee prezzi

**Benefici**:
- ✅ Logica gestione linee centralizzata
- ✅ Rimuove ~280 righe da script.js
- ✅ Facilita manutenzione modali

**Note**:
- Dipende da `window.Tariffario.getData()`
- Dipende da `window.PageRenderers.renderFermate()` e `renderPrezzi()`

---

### **MODULO 5: Page Initialization**
**File**: `js/features/page-init.js`  
**Righe stimate**: ~60 righe  
**Complessità**: ⭐⭐ (Media)  
**Dipendenze**: `PageLines`, `PageSearch`

**Funzioni da estrarre**:
- `initFermatePrezzi()` - Inizializza pagine fermate/prezzi
- `initFermatePage()` - Inizializza pagina fermate
- `initPrezziPage()` - Inizializza pagina prezzi

**Benefici**:
- ✅ Logica inizializzazione centralizzata
- ✅ Rimuove ~60 righe da script.js
- ✅ Coordina altri moduli

**Note**:
- Dipende da `window.PageLines.populateLineeTratte()` e `populateLineePrezzi()`
- Dipende da `window.PageSearch.setupRicercaPrezzi()`
- Ascolta evento `tariffarioLoaded`

---

## 📊 Stima Impatto

| Modulo | Righe Rimosse | Righe Aggiunte | Netto | Complessità |
|--------|---------------|----------------|-------|-------------|
| **UI Helpers** | ~40 | ~50 | +10 | ⭐ |
| **Page Renderers** | ~220 | ~250 | +30 | ⭐⭐ |
| **Page Search** | ~70 | ~90 | +20 | ⭐⭐ |
| **Page Lines** | ~280 | ~320 | +40 | ⭐⭐⭐ |
| **Page Init** | ~60 | ~80 | +20 | ⭐⭐ |
| **TOTALE** | **~670** | **~790** | **+120** | - |

**script.js finale**: ~2087 - 670 + 120 (wrapper) = **~1537 righe** (riduzione del 26%)

---

## 🔄 Ordine di Esecuzione Raccomandato

1. **MODULO 1: UI Helpers** ⭐ INIZIAMO QUI
   - ✅ Più semplice
   - ✅ Zero dipendenze
   - ✅ Test immediato

2. **MODULO 2: Page Renderers**
   - ✅ Isolato (solo rendering)
   - ✅ Testabile con dati mock

3. **MODULO 3: Page Search**
   - ✅ Isolato (solo DOM)
   - ✅ Testabile facilmente

4. **MODULO 4: Page Lines**
   - ✅ Dipende da Page Renderers
   - ✅ Testabile dopo modulo 2

5. **MODULO 5: Page Initialization**
   - ✅ Coordina tutti i moduli precedenti
   - ✅ Test finale integrazione

---

## ✅ Checklist per Ogni Modulo

Per ogni modulo, seguire questi passi:

- [ ] Creare file modulo con IIFE
- [ ] Estrarre funzioni da script.js
- [ ] Creare API pubblica `window.ModuleName = { ... }`
- [ ] Aggiungere wrapper in script.js per retrocompatibilità
- [ ] Aggiornare HTML (aggiungere script tag)
- [ ] Aggiornare sw.js (aggiungere alla cache)
- [ ] Testare funzionalità
- [ ] Verificare che tutto funzioni
- [ ] Aggiornare documentazione (JS_ARCHITECTURE.md)

---

## 🎯 Risultato Finale Atteso

Dopo la modularizzazione completa:
- ✅ `script.js` ridotto a ~300-400 righe (orchestratore)
- ✅ 5 nuovi moduli creati
- ✅ Codice più manutenibile e testabile
- ✅ Zero breaking changes (wrapper per retrocompatibilità)

---

## 📝 Note Finali

- **Wrapper**: Mantenuti per retrocompatibilità, rimossi nella pulizia finale
- **Test**: Ogni modulo viene testato prima di procedere
- **Documentazione**: Aggiornata dopo ogni modulo
- **Commit**: Un commit per modulo (facilita rollback se necessario)

