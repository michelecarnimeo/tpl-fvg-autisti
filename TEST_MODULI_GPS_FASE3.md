# 🧪 Test Moduli GPS - Fase 3

**Data:** 9 Novembre 2025  
**Moduli da testare:** distance-calculator.js, map-leaflet.js

---

## 📋 Test Rapido nella Console di test.html

### **1. Apri test.html nel browser**

### **2. Apri la Console (F12)**

### **3. Verifica che i moduli siano caricati:**

```javascript
// Test 1: Verifica disponibilità moduli
console.log('GPSDistanceCalculator:', typeof window.GPSDistanceCalculator !== 'undefined' ? '✅' : '❌');
console.log('GPSMap:', typeof window.GPSMap !== 'undefined' ? '✅' : '❌');
console.log('Leaflet:', typeof L !== 'undefined' ? '✅' : '❌');
```

### **4. Test GPSDistanceCalculator:**

```javascript
// Test estimateTime
const times = window.GPSDistanceCalculator.estimateTime(10); // 10 km
console.log('Tempo stimato 10km:', times);
// Dovrebbe essere: { walk: 120, bus: 20, car: 12 }

// Test formatTime
console.log('30 min:', window.GPSDistanceCalculator.formatTime(30)); // "30 min"
console.log('90 min:', window.GPSDistanceCalculator.formatTime(90)); // "1h 30min"
console.log('120 min:', window.GPSDistanceCalculator.formatTime(120)); // "2h"

// Test setLastPosition/getLastPosition
const testPosition = {
    coords: {
        latitude: 45.6495,
        longitude: 13.7768,
        accuracy: 10
    },
    timestamp: Date.now()
};
window.GPSDistanceCalculator.setLastPosition(testPosition);
const saved = window.GPSDistanceCalculator.getLastPosition();
console.log('Posizione salvata:', saved.coords.latitude, saved.coords.longitude);

// Test calculateToTarget (richiede elementi DOM)
// Prima imposta una posizione
window.GPSDistanceCalculator.setLastPosition(testPosition);
// Poi calcola distanza (mostra risultato nella UI)
window.GPSDistanceCalculator.calculateToTarget(46.0710, 13.2345, 'Udine');
```

### **5. Test GPSMap:**

```javascript
// Test isInitialized (dovrebbe essere false inizialmente)
console.log('Mappa inizializzata:', window.GPSMap.isInitialized());

// Test initialize (richiede elementi DOM)
window.GPSMap.initialize(45.6495, 13.7768, 10);
console.log('Mappa inizializzata:', window.GPSMap.isInitialized());

// Test getCurrentPosition
const pos = window.GPSMap.getCurrentPosition();
console.log('Posizione corrente mappa:', pos);

// Test updatePosition
window.GPSMap.updatePosition(46.0710, 13.2345, 15);
console.log('Posizione aggiornata:', window.GPSMap.getCurrentPosition());

// Test recenter
window.GPSMap.recenter();

// Test setupConnectionBadge
window.GPSMap.setupConnectionBadge();
window.GPSMap.updateConnectionStatus();
```

### **6. Test Integrazione con altri moduli:**

```javascript
// Test GPSFakePosition + GPSDistanceCalculator
const fakePos = window.GPSFakePosition.apply(45.6495, 13.7768, 10, 0);
window.GPSDistanceCalculator.setLastPosition(fakePos);
const result = window.GPSDistanceCalculator.calculateToTarget(46.0710, 13.2345, 'Udine');
console.log('Distanza da posizione fake:', result.distanceKm.toFixed(2), 'km');

// Test GPSFakePosition + GPSMap
const fakePos2 = window.GPSFakePosition.apply(45.6495, 13.7768, 10, 0);
window.GPSMap.initialize(
    fakePos2.coords.latitude,
    fakePos2.coords.longitude,
    fakePos2.coords.accuracy
);
console.log('Mappa inizializzata con posizione fake:', window.GPSMap.isInitialized());

// Test GPSHelpers + GPSDistanceCalculator (uso interno)
// GPSDistanceCalculator usa GPSHelpers.calculateDistance internamente
// Verifica che la distanza calcolata sia corretta
const distance = window.GPSHelpers.calculateDistance(45.6495, 13.7768, 46.0710, 13.2345);
console.log('Distanza diretta (GPSHelpers):', distance.toFixed(2), 'km');
```

---

## 🎯 Test Funzionali in test.html

### **1. Test Calcolatore Distanza:**

1. Vai alla sezione "Calcolatore Distanza" in test.html
2. Rileva la tua posizione GPS (pulsante "Testa Geolocalizzazione")
3. Clicca su un preset città (es. "Udine")
4. Verifica che:
   - ✅ Il calcolo distanza venga eseguito
   - ✅ Il risultato venga mostrato con distanza in km/metri
   - ✅ I tempi stimati (piedi/bus/auto) vengano mostrati
   - ✅ Le coordinate di partenza e arrivo siano visibili

### **2. Test Mappa:**

1. Vai alla sezione "Mappa Interattiva" in test.html
2. Rileva la tua posizione GPS
3. Verifica che:
   - ✅ La mappa venga inizializzata
   - ✅ Il marker posizione sia visibile
   - ✅ Il cerchio accuratezza sia visibile
   - ✅ Il badge connessione mostri lo stato (online/offline)
   - ✅ Il pulsante "Centra" ricentri la mappa
   - ✅ La mappa si aggiorni quando la posizione cambia

### **3. Test Integrazione:**

1. Applica una posizione fake (es. Trieste)
2. Calcola distanza a Udine
3. Verifica che:
   - ✅ La distanza venga calcolata correttamente
   - ✅ I tempi stimati siano ragionevoli
   - ✅ La mappa mostri la posizione fake (se inizializzata)

---

## 🎯 Risultati Attesi

### **GPSDistanceCalculator:**
- ✅ `estimateTime()` dovrebbe calcolare tempi corretti
- ✅ `formatTime()` dovrebbe formattare tempo correttamente
- ✅ `setLastPosition()`/`getLastPosition()` dovrebbero salvare/recuperare posizione
- ✅ `calculateToTarget()` dovrebbe calcolare distanza e mostrare risultato nella UI
- ✅ I preset città dovrebbero popolare gli input e calcolare automaticamente

### **GPSMap:**
- ✅ `initialize()` dovrebbe creare mappa Leaflet
- ✅ `updatePosition()` dovrebbe aggiornare marker e cerchio accuratezza
- ✅ `recenter()` dovrebbe ricentrare mappa sulla posizione corrente
- ✅ `setupConnectionBadge()` dovrebbe inizializzare badge connessione
- ✅ `updateConnectionStatus()` dovrebbe aggiornare badge (online/offline)
- ✅ `isInitialized()` dovrebbe restituire stato corretto
- ✅ `getCurrentPosition()` dovrebbe restituire posizione corrente

---

## 🐛 Problemi Comuni

### **Moduli non disponibili:**
- Verifica che gli script siano caricati in `test.html`
- Controlla la console per errori JavaScript
- Verifica l'ordine di caricamento (helpers.js deve essere primo)

### **Distance Calculator non funziona:**
- Verifica che `lastKnownPosition` sia impostata (rileva posizione GPS prima)
- Controlla che gli elementi DOM esistano (`distance-calculator`, `calculate-distance-btn`, ecc.)
- Verifica che GPSHelpers.calculateDistance sia disponibile

### **Mappa non funziona:**
- Verifica che Leaflet.js sia caricato (CDN)
- Controlla che gli elementi DOM esistano (`map-container`, `map`, ecc.)
- Verifica che la connessione internet sia attiva (per caricare tile)

### **Badge connessione non si aggiorna:**
- Verifica che `setupMapConnectionBadge()` sia chiamato
- Controlla che gli elementi DOM esistano (`map-connection-badge`, ecc.)
- Verifica che gli event listener siano registrati (online/offline)

---

## ✅ Checklist Test

- [ ] GPSDistanceCalculator disponibile
- [ ] GPSMap disponibile
- [ ] Leaflet.js disponibile
- [ ] estimateTime() funziona
- [ ] formatTime() funziona
- [ ] setLastPosition()/getLastPosition() funzionano
- [ ] calculateToTarget() funziona
- [ ] Preset città funzionano
- [ ] initialize() funziona
- [ ] updatePosition() funziona
- [ ] recenter() funziona
- [ ] setupConnectionBadge() funziona
- [ ] updateConnectionStatus() funziona
- [ ] Integrazione con GPSFakePosition funziona
- [ ] Integrazione con GPSHelpers funziona

---

## 📝 Note

- **Distance Calculator** richiede che `lastKnownPosition` sia impostata prima di calcolare distanza
- **Map** richiede Leaflet.js (CDN) e connessione internet per caricare tile
- **Badge connessione** si aggiorna automaticamente quando cambia lo stato online/offline
- I moduli si auto-inizializzano al caricamento DOM

---

**Ultimo aggiornamento:** 9 Novembre 2025

