# 🔒 Security Roadmap - Rimozione innerHTML

**Data Creazione:** 9 Novembre 2025  
**Versione Progetto:** 1.7.0  
**Priorità:** 🟡 Media-Alta  
**Stato:** 🟡 In Corso

## 🎯 Obiettivo

Rimuovere tutti gli utilizzi di `innerHTML` nel progetto e sostituirli con `createElement` per prevenire vulnerabilità XSS (Cross-Site Scripting) e migliorare la sicurezza complessiva dell'applicazione.

## 📊 Analisi Iniziale

### **File con `innerHTML` identificati:** 24 file

1. ✅ `js/tests/pwa-test-mode.js` - **COMPLETATO** (9 Novembre 2025)
2. ⚠️ `js/tests/gps/test-geolocation.js` - 5 occorrenze
3. ⚠️ `js/tests/gps/export-report.js` - 3 occorrenze
4. ⚠️ `js/tests/gps/quick-test.js` - 4 occorrenze
5. ⚠️ `js/tests/gps/watch-position.js` - 6 occorrenze
6. ⚠️ `js/tests/gps/distance-calculator.js` - 4 occorrenze
7. ⚠️ `js/tests/gps/fake-position.js` - 3 occorrenze
8. ⚠️ `js/tests/gps/reset-data.js` - 6 occorrenze
9. ⚠️ `js/tests/gps/helpers.js` - 3 occorrenze
10. ⚠️ `js/features/page-renderers.js` - 10 occorrenze
11. ⚠️ `js/features/route-selector.js` - 8 occorrenze
12. ⚠️ `js/features/updates.js` - 10 occorrenze
13. ⚠️ `js/components/modals.js` - 6 occorrenze
14. ⚠️ `js/tests/test-route-selector-wrappers.js` - 5 occorrenze
15. ⚠️ `js/tests/test-log-helpers.js` - 1 occorrenza
16. ⚠️ `js/utils/offline-notifications.js` - 1 occorrenza
17. ⚠️ `js/tests/test-database.js` - 1 occorrenza
18. ⚠️ `js/tests/test-prezzi-wrappers.js` - 2 occorrenze
19. ⚠️ `js/tests/test-sw.js` - 1 occorrenza
20. ⚠️ `js/tests/test-sw-wrappers.js` - 1 occorrenza
21. ⚠️ `js/tests/test-settings.js` - 1 occorrenza
22. ⚠️ `js/tests/test-settings-wrappers.js` - 2 occorrenze
23. ⚠️ `js/tests/test-storage-wrappers.js` - 4 occorrenze
24. ⚠️ `js/utils/offline-simulator.js` - 2 occorrenze
25. ⚠️ `js/tests/test-utils.js` - 4 occorrenze (verificare se sono solo per reset)

**Totale occorrenze stimate:** ~93 occorrenze

---

## 🎯 Strategia di Refactorizzazione

### **Metodo Raccomandato: `createElement`**

Seguire il pattern utilizzato in `js/tests/pwa-test-mode.js`:

1. **Creare funzioni helper** per elementi comuni:
   - `createLink(href, text)` - Per link
   - `createSimpleList(items)` - Per liste semplici
   - `createCard(title, content)` - Per card (se necessario)

2. **Usare `DocumentFragment`** per contenuti complessi:
   - Creare fragment
   - Aggiungere elementi al fragment
   - Appendere fragment al DOM una sola volta

3. **Sostituire `innerHTML = ''` con `textContent = ''`** per reset:
   - Più sicuro
   - Più veloce
   - Nessun rischio XSS

### **Eccezioni Accettabili**

Alcuni casi possono essere mantenuti con `innerHTML` se:
- **Contenuto statico** (non da input utente)
- **HTML caricato da file esterno** (es. `components/settings-modal.html`)
- **Reset contenuto** (`innerHTML = ''` può essere sostituito con `textContent = ''`)

---

## 📋 Piano di Lavoro

### **Fase 1: Moduli Test GPS** (Priorità Alta)
- [ ] `js/tests/gps/test-geolocation.js` - 5 occorrenze
- [ ] `js/tests/gps/export-report.js` - 3 occorrenze
- [ ] `js/tests/gps/quick-test.js` - 4 occorrenze
- [ ] `js/tests/gps/watch-position.js` - 6 occorrenze
- [ ] `js/tests/gps/distance-calculator.js` - 4 occorrenze
- [ ] `js/tests/gps/fake-position.js` - 3 occorrenze
- [ ] `js/tests/gps/reset-data.js` - 6 occorrenze
- [ ] `js/tests/gps/helpers.js` - 3 occorrenze

**Totale Fase 1:** ~34 occorrenze

### **Fase 2: Features Core** (Priorità Alta)
- [ ] `js/features/page-renderers.js` - 10 occorrenze
- [ ] `js/features/route-selector.js` - 8 occorrenze
- [ ] `js/features/updates.js` - 10 occorrenze
- [ ] `js/components/modals.js` - 6 occorrenze

**Totale Fase 2:** ~34 occorrenze

### **Fase 3: Test Wrappers** (Priorità Media)
- [ ] `js/tests/test-route-selector-wrappers.js` - 5 occorrenze
- [ ] `js/tests/test-prezzi-wrappers.js` - 2 occorrenze
- [ ] `js/tests/test-sw-wrappers.js` - 1 occorrenza
- [ ] `js/tests/test-settings-wrappers.js` - 2 occorrenze
- [ ] `js/tests/test-storage-wrappers.js` - 4 occorrenze

**Totale Fase 3:** ~14 occorrenze

### **Fase 4: Utils e Altri** (Priorità Bassa)
- [ ] `js/tests/test-log-helpers.js` - 1 occorrenza
- [ ] `js/utils/offline-notifications.js` - 1 occorrenza
- [ ] `js/tests/test-database.js` - 1 occorrenza
- [ ] `js/tests/test-sw.js` - 1 occorrenza
- [ ] `js/tests/test-settings.js` - 1 occorrenza
- [ ] `js/utils/offline-simulator.js` - 2 occorrenze
- [ ] `js/tests/test-utils.js` - 4 occorrenze (verificare se solo reset)

**Totale Fase 4:** ~11 occorrenze

---

## 🔍 Casi Speciali da Analizzare

### **1. `js/components/modals.js` - Caricamento HTML esterno**
```javascript
// Riga ~807: Caricamento HTML da file esterno
tempDiv.innerHTML = html.trim();
```
**Analisi:** Questo è un caso accettabile se l'HTML viene caricato da un file statico controllato. Tuttavia, si potrebbe considerare l'uso di `DOMParser` per maggiore sicurezza.

### **2. `js/tests/test-utils.js` - Reset contenuto**
```javascript
// Verificare se sono solo reset (innerHTML = '')
outputEl.innerHTML = '';
```
**Soluzione:** Sostituire con `textContent = ''` o `replaceChildren()`.

### **3. `js/features/page-renderers.js` - Rendering dinamico**
**Analisi:** Probabilmente contiene HTML dinamico complesso. Richiede analisi approfondita.

---

## ✅ Best Practices da Seguire

1. **Usare `createElement`** invece di `innerHTML`
2. **Usare `textContent`** invece di `innerHTML` per testo semplice
3. **Usare `DocumentFragment`** per contenuti complessi
4. **Evitare `innerHTML` con contenuto dinamico** da input utente
5. **Validare input** se necessario inserire dati esterni
6. **Usare `setAttribute`** per attributi invece di stringhe HTML

### **Pattern da Replicare:**

```javascript
// ❌ DA EVITARE
element.innerHTML = `<div>${userInput}</div>`;

// ✅ DA USARE
const div = document.createElement('div');
div.textContent = userInput; // o appendChild per contenuto complesso
element.appendChild(div);
```

---

## 📊 Progresso

### **Completato:**
- ✅ `js/tests/pwa-test-mode.js` (9 Novembre 2025)
  - Rimosse 2 occorrenze di `innerHTML`
  - Sostituite con `createElement` e `DocumentFragment`
  - Aggiunte funzioni helper: `createLink()`, `createSimpleList()`

### **In Corso:**
- 🟡 Nessuno al momento

### **Prossimi Passi:**
1. Analizzare `js/tests/gps/test-geolocation.js` (5 occorrenze)
2. Analizzare `js/features/page-renderers.js` (10 occorrenze)
3. Creare funzioni helper riutilizzabili per elementi comuni

---

## 🎯 Obiettivo Finale

- **Zero utilizzi di `innerHTML`** per contenuto dinamico
- **Tutti gli elementi creati con `createElement`**
- **Separazione HTML/JavaScript** completa
- **Maggiore sicurezza** contro XSS
- **Codice più mantenibile** e testabile

---

## 📝 Note

- Questo refactoring migliorerà la sicurezza dell'applicazione
- Alcuni casi potrebbero richiedere più tempo (es. `page-renderers.js`)
- Mantenere compatibilità con codice esistente durante la transizione
- Testare accuratamente dopo ogni modifica

---

**Ultimo aggiornamento:** 9 Novembre 2025

