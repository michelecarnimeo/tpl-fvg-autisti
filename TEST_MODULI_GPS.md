# 🧪 Test Moduli GPS - Guida Rapida

**Data:** 9 Novembre 2025  
**Moduli da testare:** helpers.js, fake-position.js, reset-data.js

---

## 📋 Test Rapido nella Console

### **1. Apri test.html nel browser**

### **2. Apri la Console (F12)**

### **3. Verifica che i moduli siano caricati:**

```javascript
// Test 1: Verifica disponibilità moduli
console.log('GPSHelpers:', typeof window.GPSHelpers !== 'undefined' ? '✅' : '❌');
console.log('GPSFakePosition:', typeof window.GPSFakePosition !== 'undefined' ? '✅' : '❌');
console.log('GPSResetData:', typeof window.GPSResetData !== 'undefined' ? '✅' : '❌');
```

### **4. Test GPSHelpers:**

```javascript
// Test calculateDistance
const distance = window.GPSHelpers.calculateDistance(45.6495, 13.7768, 46.0710, 13.2345);
console.log('Distanza Trieste → Udine:', distance.toFixed(2), 'km'); // Dovrebbe essere ~55-60 km

// Test getCardinalDirection
console.log('0°:', window.GPSHelpers.getCardinalDirection(0)); // Dovrebbe essere "⬆️ Nord"
console.log('90°:', window.GPSHelpers.getCardinalDirection(90)); // Dovrebbe essere "➡️ Est"
console.log('180°:', window.GPSHelpers.getCardinalDirection(180)); // Dovrebbe essere "⬇️ Sud"

// Test checkHttpsRequirement (non ha elementi DOM, ma dovrebbe funzionare)
const isSecure = window.GPSHelpers.checkHttpsRequirement();
console.log('HTTPS sicuro:', isSecure);
```

### **5. Test GPSFakePosition:**

```javascript
// Test getPresets
const presets = window.GPSFakePosition.getPresets();
console.log('Preset disponibili:', Object.keys(presets));

// Test isActive (dovrebbe essere false inizialmente)
console.log('Fake position attiva:', window.GPSFakePosition.isActive());

// Test apply
const position = window.GPSFakePosition.apply(45.6495, 13.7768, 10, 0);
console.log('Posizione fake applicata:', position);

// Test get
const fakePos = window.GPSFakePosition.get();
console.log('Posizione fake corrente:', fakePos);

// Test isActive (dovrebbe essere true ora)
console.log('Fake position attiva:', window.GPSFakePosition.isActive());

// Test clear
window.GPSFakePosition.clear();
console.log('Posizione fake rimossa');

// Verifica che sia stata rimossa
console.log('Posizione fake dopo clear:', window.GPSFakePosition.get()); // Dovrebbe essere null
```

### **6. Test GPSResetData:**

```javascript
// Test getKeys
const keys = window.GPSResetData.getKeys();
console.log('Chiavi GPS:', keys);

// Test reset (salva una chiave di test prima)
localStorage.setItem('tpl.useFakePosition', 'true');
console.log('Chiave salvata:', localStorage.getItem('tpl.useFakePosition'));

// Reset
const success = window.GPSResetData.reset();
console.log('Reset completato:', success);

// Verifica che la chiave sia stata rimossa
console.log('Chiave dopo reset:', localStorage.getItem('tpl.useFakePosition')); // Dovrebbe essere null
```

### **7. Test Integrazione:**

```javascript
// Test che GPSFakePosition e GPSHelpers funzionino insieme
window.GPSFakePosition.apply(45.6495, 13.7768, 10, 0);
const fakePos = window.GPSFakePosition.get();
const distance = window.GPSHelpers.calculateDistance(
    fakePos.coords.latitude,
    fakePos.coords.longitude,
    46.0710, // Udine
    13.2345
);
console.log('Distanza da posizione fake a Udine:', distance.toFixed(2), 'km');

// Test che GPSResetData resetti GPSFakePosition
window.GPSFakePosition.apply(45.6495, 13.7768, 10, 0);
window.GPSResetData.reset();
console.log('Posizione fake dopo reset:', window.GPSFakePosition.get()); // Dovrebbe essere null
```

---

## 🎯 Risultati Attesi

### **GPSHelpers:**
- ✅ `calculateDistance()` dovrebbe calcolare distanza corretta
- ✅ `getCardinalDirection()` dovrebbe restituire direzioni corrette
- ✅ `checkHttpsRequirement()` dovrebbe verificare HTTPS
- ⚠️ `copyCoordinates()` potrebbe fallire se non in HTTPS (normale)
- ⚠️ `reverseGeocode()` potrebbe fallire se offline (normale)

### **GPSFakePosition:**
- ✅ `getPresets()` dovrebbe restituire 4 preset (Udine, Trieste, Gorizia, Pordenone)
- ✅ `isActive()` dovrebbe essere false inizialmente
- ✅ `apply()` dovrebbe applicare posizione fake
- ✅ `get()` dovrebbe restituire posizione fake applicata
- ✅ `clear()` dovrebbe rimuovere posizione fake

### **GPSResetData:**
- ✅ `getKeys()` dovrebbe restituire array con 3 chiavi
- ✅ `reset()` dovrebbe rimuovere chiavi da localStorage
- ✅ `reset()` dovrebbe resettare GPSFakePosition se disponibile

---

## 🐛 Problemi Comuni

### **Moduli non disponibili:**
- Verifica che gli script siano caricati in `test.html`
- Controlla la console per errori JavaScript
- Verifica l'ordine di caricamento (helpers.js deve essere primo)

### **Funzioni non funzionano:**
- Verifica che le API siano esposte correttamente su `window`
- Controlla che non ci siano errori nella console
- Verifica che le dipendenze siano soddisfatte

### **localStorage errors:**
- Verifica che il browser supporti localStorage
- Controlla che non ci siano restrizioni (modalità privata, ecc.)

---

## ✅ Checklist Test

- [ ] GPSHelpers disponibile
- [ ] GPSFakePosition disponibile
- [ ] GPSResetData disponibile
- [ ] calculateDistance() funziona
- [ ] getCardinalDirection() funziona
- [ ] apply() funziona
- [ ] get() funziona
- [ ] clear() funziona
- [ ] reset() funziona
- [ ] Integrazione tra moduli funziona

---

**Ultimo aggiornamento:** 9 Novembre 2025

