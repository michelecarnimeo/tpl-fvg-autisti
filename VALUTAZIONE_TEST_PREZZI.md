# 🧪 Valutazione: Test per `prezzi.js`

## ✅ **Risposta: SÌ, ha molto senso!**

## 🎯 **Perché ha senso testare `prezzi.js`?**

### **1. Funzioni Pure = Facili da Testare**
```javascript
// ✅ Input/Output prevedibili
Pricing.calculatePrice(0, 0, 5, tariffario)
// → { prezzo: 3.50, codice: 'E3', valido: true }

// ✅ Nessuna dipendenza DOM/Network
// ✅ Testabili in isolamento
// ✅ Risultati deterministici
```

### **2. Logica Critica (Core Business)**
- **Calcolo prezzi** = funzionalità principale dell'app
- **Errore = impatto diretto su utenti** (prezzi sbagliati!)
- **Validazione cruciale** per affidabilità

### **3. Edge Cases Complessi**
- Stessa fermata (partenza = arrivo)
- Indici fuori range
- Tariffario mancante/incompleto
- Fallback `tariffarioAggiornato`
- Codici mancanti
- Prezzi null/undefined

### **4. Già Esistono Test Manuali**
- `test.html` ha già `testPriceCalculation()` (righe 2854-2879)
- **Con modularizzazione**: possiamo **automatizzarli** e renderli più robusti

---

## 📊 **Tipi di Test Utili**

### **1. Test Unitari Base**
```javascript
// Test calcolo prezzo valido
Pricing.calculatePrice(0, 0, 5, tariffario)
// → { prezzo: 3.50, codice: 'E3', valido: true }

// Test stessa fermata
Pricing.calculatePrice(0, 2, 2, tariffario)
// → { prezzo: null, codice: '', valido: false }

// Test indici fuori range
Pricing.calculatePrice(0, 100, 200, tariffario)
// → { prezzo: null, codice: '', valido: false }
```

### **2. Test Validazione**
```javascript
Pricing.isValidSelection('', 0, 5, tariffario)
// → false (linea mancante)

Pricing.isValidSelection(0, 0, 5, tariffario)
// → true

Pricing.isRouteAvailable(0, 0, 999, tariffario)
// → false (indice fuori range)
```

### **3. Test Recupero Codice**
```javascript
// Codice nella matrice principale
Pricing.getTicketCode(0, 0, 5, tariffario)
// → 'E3'

// Fallback tariffarioAggiornato
Pricing.getTicketCode(0, 0, 5, tariffario, tariffarioAggiornato)
// → 'E3' (se non trovato nella matrice, cerca in tariffarioAggiornato)

// Codice mancante
Pricing.getTicketCode(0, 0, 0, tariffario)
// → '' (stessa fermata)
```

### **4. Test Formattazione**
```javascript
Pricing.formatPrice(3.50)
// → '3.50 €'

Pricing.formatPrice(null)
// → '-'

Pricing.formatPrice(0)
// → '0.00 €'
```

### **5. Test Edge Cases**
```javascript
// Tariffario vuoto
Pricing.calculatePrice(0, 0, 5, [])
// → { prezzo: null, codice: '', valido: false }

// Linea non esistente
Pricing.calculatePrice(999, 0, 5, tariffario)
// → { prezzo: null, codice: '', valido: false }

// Prezzo null nella matrice
// (gestione corretta?)
```

---

## 🏗️ **Struttura Test Proposta**

### **Opzione 1: Test in `test.html` (esistente)**
```javascript
// test.html - Sezione esistente migliorata
async function testPriceCalculation() {
  // Usa Pricing.calculatePrice() invece di logica inline
  const result = Pricing.calculatePrice(0, 0, 5, tariffario);
  assert(result.prezzo === 3.50, 'Prezzo corretto');
  assert(result.codice === 'E3', 'Codice corretto');
  assert(result.valido === true, 'Selezione valida');
}
```

**Vantaggi:**
- ✅ Già integrato nel sistema test esistente
- ✅ Visibile in `test.html` (test manuali)
- ✅ Nessuna nuova infrastruttura

**Svantaggi:**
- ❌ Test non automatizzati (richiedono click manuale)
- ❌ Difficile eseguire in CI/CD

---

### **Opzione 2: File test dedicato (`js/tests/prezzi.test.js`)**
```javascript
// js/tests/prezzi.test.js
(function() {
  'use strict';
  
  const TEST_TARIFFARIO = [{
    nome: "Linea Test",
    fermate: ["A", "B", "C"],
    prezzi: [[0, 1.50, 2.50], [1.50, 0, 1.00], [2.50, 1.00, 0]],
    codici: [["", "E1", "E2"], ["E1", "", "E1"], ["E2", "E1", ""]]
  }];
  
  function testCalculatePrice() {
    const result = Pricing.calculatePrice(0, 0, 1, TEST_TARIFFARIO);
    console.assert(result.prezzo === 1.50, 'Prezzo corretto');
    console.assert(result.codice === 'E1', 'Codice corretto');
  }
  
  // Esegui tutti i test
  testCalculatePrice();
  console.log('✅ Tutti i test passati!');
})();
```

**Vantaggi:**
- ✅ Separazione chiara
- ✅ Facile da mantenere
- ✅ Potenzialmente automatizzabile

**Svantaggi:**
- ❌ Richiede caricamento in HTML o runner test
- ❌ Non visibile in `test.html` attuale

---

### **Opzione 3: Test ibrido (Raccomandato)**
1. **File test dedicato** (`js/tests/prezzi.test.js`) per test unitari
2. **Integrazione in `test.html`** per test manuali/visivi
3. **Test configurabili** da `test-config.js` esistente

```javascript
// js/tests/prezzi.test.js - Test unitari puri
const PrezziTests = {
  runAll() {
    this.testCalculatePrice();
    this.testGetTicketCode();
    this.testFormatPrice();
    // ...
  },
  
  testCalculatePrice() { /* ... */ }
};

// test.html - Integrazione
async function testPriceCalculation() {
  // Carica modulo test
  await loadScript('js/tests/prezzi.test.js');
  
  // Esegui test unitari
  PrezziTests.runAll();
  
  // Test integrazione con dati reali
  const result = Pricing.calculatePrice(0, 0, 5, tariffario);
  // ...
}
```

---

## 📋 **Scenari Test Raccomandati**

### **✅ Must Have (Critici)**
- [ ] Calcolo prezzo valido (tratta normale)
- [ ] Stessa fermata (partenza = arrivo) → null
- [ ] Indici fuori range → gestione errori
- [ ] Codice recuperato correttamente
- [ ] Fallback `tariffarioAggiornato` funziona
- [ ] Formattazione prezzo corretta

### **✅ Should Have (Importanti)**
- [ ] Validazione selezione (linea/partenza/arrivo)
- [ ] Tratta non disponibile nella matrice
- [ ] Prezzo null nella matrice
- [ ] Codice vuoto nella matrice
- [ ] Tariffario vuoto/undefined

### **✅ Nice to Have (Opzionali)**
- [ ] Performance (calcolo < 10ms per 1000 iterazioni)
- [ ] Memory leak test
- [ ] Stress test (matrice molto grande)

---

## 🎯 **Raccomandazione Finale**

**SÌ, crea i test!** Perché:

1. ✅ **Logica critica** → deve funzionare sempre
2. ✅ **Funzioni pure** → facili da testare
3. ✅ **Edge cases complessi** → validazione importante
4. ✅ **Già infrastruttura test** → integrazione semplice

**Approccio suggerito:**
- Inizia con **Opzione 3 (ibrida)**:
  - Test unitari in `js/tests/prezzi.test.js`
  - Integrazione in `test.html` esistente
  - Configurazione in `test-config.js`

**Complessità:**
- ⚡ **Bassa**: Test semplici (input/output)
- ⏱️ **Tempo**: ~1-2 ore per suite completa
- 📈 **ROI**: Altissimo (previene bug critici)

---

## 💡 **Esempio Pratico**

```javascript
// js/tests/prezzi.test.js
(function() {
  'use strict';
  
  // Mock tariffario minimo
  const mockTariffario = [{
    nome: "Test Line",
    fermate: ["Fermata A", "Fermata B", "Fermata C"],
    prezzi: [
      [0.00, 1.50, 2.50],
      [1.50, 0.00, 1.00],
      [2.50, 1.00, 0.00]
    ],
    codici: [
      ["", "E1", "E2"],
      ["E1", "", "E1"],
      ["E2", "E1", ""]
    ]
  }];
  
  // Test suite
  function runTests() {
    console.log('🧪 Esecuzione test prezzi.js...');
    
    // Test 1: Calcolo prezzo valido
    const result1 = Pricing.calculatePrice(0, 0, 1, mockTariffario);
    console.assert(result1.prezzo === 1.50, '✓ Test 1: Prezzo corretto');
    console.assert(result1.codice === 'E1', '✓ Test 1: Codice corretto');
    console.assert(result1.valido === true, '✓ Test 1: Valido');
    
    // Test 2: Stessa fermata
    const result2 = Pricing.calculatePrice(0, 0, 0, mockTariffario);
    console.assert(result2.prezzo === null, '✓ Test 2: Prezzo null per stessa fermata');
    console.assert(result2.valido === false, '✓ Test 2: Non valido');
    
    // Test 3: Formattazione
    console.assert(Pricing.formatPrice(1.50) === '1.50 €', '✓ Test 3: Formattazione');
    console.assert(Pricing.formatPrice(null) === '-', '✓ Test 3: Formattazione null');
    
    console.log('✅ Tutti i test passati!');
  }
  
  // Esegui se Pricing è disponibile
  if (typeof Pricing !== 'undefined') {
    runTests();
  } else {
    console.warn('⚠️ Pricing non disponibile, test saltati');
  }
})();
```

---

## ✅ **Conclusione**

**SÌ, assolutamente crea i test!** È uno dei moduli che beneficia di più dai test perché:
- Core business logic
- Funzioni pure (facili da testare)
- Edge cases complessi
- Già infrastruttura esistente

**ROI**: Altissimo - previene bug critici con investimento minimo (1-2 ore).

---

## 📍 **Integrazione in `test.html`**

### **Sezione Esistente:**
```html
<!-- Test 4: Calcolo Prezzi -->
<div class="test-section">
    <h2>💰 Test Calcolo Prezzi</h2>
    <div class="test-item" id="test-price-calculation">
        <span>Calcolo prezzo semplice</span>
        <span class="test-status pending">In attesa</span>
    </div>
    <!-- ... altri test items ... -->
    <button class="test-button" onclick="testPriceCalculation()">🧪 Test Calcolo Prezzi</button>
    <div class="test-output" id="output-price" style="display:none;"></div>
</div>
```

### **Espansione Proposta:**

```html
<!-- Test 4: Calcolo Prezzi (Modulo prezzi.js) -->
<div class="test-section">
    <h2>💰 Test Calcolo Prezzi - prezzi.js</h2>
    
    <!-- Test Unitari Pricing -->
    <div class="test-item" id="test-pricing-calculate">
        <span>Pricing.calculatePrice()</span>
        <span class="test-status pending">In attesa</span>
    </div>
    <div class="test-item" id="test-pricing-ticket-code">
        <span>Pricing.getTicketCode()</span>
        <span class="test-status pending">In attesa</span>
    </div>
    <div class="test-item" id="test-pricing-format">
        <span>Pricing.formatPrice()</span>
        <span class="test-status pending">In attesa</span>
    </div>
    <div class="test-item" id="test-pricing-validation">
        <span>Pricing.isValidSelection()</span>
        <span class="test-status pending">In attesa</span>
    </div>
    <div class="test-item" id="test-pricing-route">
        <span>Pricing.isRouteAvailable()</span>
        <span class="test-status pending">In attesa</span>
    </div>
    
    <!-- Test Edge Cases -->
    <div class="test-item" id="test-pricing-same-stop">
        <span>Stessa fermata (partenza = arrivo)</span>
        <span class="test-status pending">In attesa</span>
    </div>
    <div class="test-item" id="test-pricing-out-of-range">
        <span>Indici fuori range</span>
        <span class="test-status pending">In attesa</span>
    </div>
    <div class="test-item" id="test-pricing-fallback">
        <span>Fallback tariffarioAggiornato</span>
        <span class="test-status pending">In attesa</span>
    </div>
    
    <button class="test-button" onclick="testPriceCalculation()">🧪 Test Modulo Prezzi</button>
    <div class="test-output" id="output-price" style="display:none;"></div>
</div>
```

### **Funzione Test Aggiornata:**

```javascript
// test.html - Funzione testPriceCalculation() migliorata
async function testPriceCalculation() {
    const output = 'output-price';
    document.getElementById(output).innerHTML = '';
    log(output, '=== Test Modulo prezzi.js ===', 'info');
    
    // Verifica che Pricing sia disponibile
    if (typeof Pricing === 'undefined') {
        log(output, '✗ Pricing non disponibile! Assicurati che prezzi.js sia caricato.', 'error');
        return;
    }
    
    try {
        // Carica dati se necessario
        if (tariffario.length === 0) {
            log(output, 'Caricamento tariffario...', 'info');
            await loadData();
        }
        
        const linea = tariffario[0];
        
        // === TEST 1: calculatePrice() ===
        log(output, 'Test Pricing.calculatePrice()...', 'info');
        const result = Pricing.calculatePrice(0, 0, 5, tariffario);
        if (result.prezzo === linea.prezzi[0][5] && result.valido === true) {
            updateTestStatus('test-pricing-calculate', 'pass');
            log(output, `✓ Prezzo calcolato: €${result.prezzo?.toFixed(2)}`, 'success');
        } else {
            throw new Error('calculatePrice() non funziona correttamente');
        }
        
        // === TEST 2: getTicketCode() ===
        log(output, 'Test Pricing.getTicketCode()...', 'info');
        const codice = Pricing.getTicketCode(0, 0, 5, tariffario);
        if (codice === linea.codici[0][5]) {
            updateTestStatus('test-pricing-ticket-code', 'pass');
            log(output, `✓ Codice recuperato: ${codice}`, 'success');
        } else {
            throw new Error('getTicketCode() non funziona correttamente');
        }
        
        // === TEST 3: formatPrice() ===
        log(output, 'Test Pricing.formatPrice()...', 'info');
        const formatted = Pricing.formatPrice(3.50);
        if (formatted === '3.50 €') {
            updateTestStatus('test-pricing-format', 'pass');
            log(output, `✓ Formattazione: ${formatted}`, 'success');
        }
        const formattedNull = Pricing.formatPrice(null);
        if (formattedNull === '-') {
            log(output, `✓ Formattazione null: ${formattedNull}`, 'success');
        }
        
        // === TEST 4: isValidSelection() ===
        log(output, 'Test Pricing.isValidSelection()...', 'info');
        const valid = Pricing.isValidSelection(0, 0, 5, tariffario);
        const invalid = Pricing.isValidSelection('', 0, 5, tariffario);
        if (valid === true && invalid === false) {
            updateTestStatus('test-pricing-validation', 'pass');
            log(output, '✓ Validazione selezioni funziona', 'success');
        }
        
        // === TEST 5: isRouteAvailable() ===
        log(output, 'Test Pricing.isRouteAvailable()...', 'info');
        const available = Pricing.isRouteAvailable(0, 0, 5, tariffario);
        const notAvailable = Pricing.isRouteAvailable(0, 0, 999, tariffario);
        if (available === true && notAvailable === false) {
            updateTestStatus('test-pricing-route', 'pass');
            log(output, '✓ Verifica tratta disponibile funziona', 'success');
        }
        
        // === TEST 6: Stessa fermata ===
        log(output, 'Test stessa fermata (edge case)...', 'info');
        const sameStop = Pricing.calculatePrice(0, 2, 2, tariffario);
        if (sameStop.valido === false && sameStop.prezzo === null) {
            updateTestStatus('test-pricing-same-stop', 'pass');
            log(output, '✓ Stessa fermata gestita correttamente', 'success');
        }
        
        // === TEST 7: Indici fuori range ===
        log(output, 'Test indici fuori range (edge case)...', 'info');
        const outOfRange = Pricing.calculatePrice(0, 999, 1000, tariffario);
        if (outOfRange.valido === false) {
            updateTestStatus('test-pricing-out-of-range', 'pass');
            log(output, '✓ Indici fuori range gestiti correttamente', 'success');
        }
        
        log(output, '', 'info'); // Spazio
        log(output, '✅ Tutti i test del modulo prezzi.js completati!', 'success');
        
    } catch (error) {
        // Gestisci errori...
        log(output, `✗ Errore: ${error.message}`, 'error');
    }
}
```

### **Vantaggi Integrazione:**

1. ✅ **Visibilità**: Tutti i test in un'unica pagina
2. ✅ **Coerenza**: Stessa struttura degli altri test
3. ✅ **Manutenibilità**: Facile aggiungere/modificare test
4. ✅ **UX**: Output colorato e dettagliato come altri test
5. ✅ **Debug**: Facile vedere quali test falliscono

---

## 📋 **Piano Implementazione**

1. **Prima**: Creare `prezzi.js` con tutte le funzioni
2. **Poi**: Aggiornare `test.html`:
   - Espandere sezione HTML con nuovi test items
   - Aggiornare `testPriceCalculation()` per usare `Pricing.*`
   - Aggiungere test per tutte le funzioni
3. **Testare**: Verificare che tutti i test passino

**Ordine logico**: Prima modularizziamo `prezzi.js`, poi aggiungiamo i test in `test.html`.

