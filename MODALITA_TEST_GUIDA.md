# 🧪 Modalità Test - Guida Utilizzo

## Cos'è la Modalità Test?

La **Modalità Test** è un sistema centralizzato per attivare funzionalità di debug e test su tutte le pagine dell'applicazione TPL FVG Autisti.

## 🎯 Funzionalità

Quando la Modalità Test è attiva:

- ✅ **Badge visivo** in alto a destra su tutte le pagine
- 📍 **GPS Debug Panel** automatico quando si preme "Rileva" nella home
- 🔍 **Log dettagliati** in console per ogni operazione
- 🐛 **Elementi debug** visibili (normalmente nascosti)
- 💾 **Stato persistente** (rimane attivo anche cambiando pagina)

## 🚀 Come Attivare

### Metodo 1: Da Pagina Test (Consigliato)

1. Vai su **test.html**
2. Scorri alla sezione **"🐛 Debug Logger"**
3. Clicca su **"🟢 Attiva Test Mode"**
4. Vedrai comparire il badge arancione in alto a destra

### Metodo 2: Da Console Browser

```javascript
// Attiva
TestMode.enable()

// Disattiva
TestMode.disable()

// Toggle (attiva/disattiva)
TestMode.toggle()

// Verifica stato
TestMode.isEnabled()
```

## 📱 GPS Debug Panel

Quando la Modalità Test è attiva e premi **"Rileva fermata più vicina"** nella home:

1. **Si apre automaticamente** il pannello GPS Debug
2. **Mostra in tempo reale**:
   - 📍 Latitudine e Longitudine
   - 📏 Precisione GPS in metri
   - 🎯 Fermata più vicina trovata
   - 📊 Distanza calcolata in km e metri
   - 🗺️ Coordinate della fermata

### Controlli Pannello:

- **Trascinare**: Click e tieni premuto sull'header per spostare
- **Minimizzare**: Click sul pulsante **▼** / **▲**
- **Chiudere**: Click sul pulsante **✕**
- **Cancellare log**: Click su **🗑️ Cancella log**

La posizione del pannello viene salvata automaticamente!

## 🔧 Per Sviluppatori

### Aggiungere Elementi Debug

Per creare elementi che appaiono solo in Test Mode:

```html
<!-- Metodo 1: Classe CSS -->
<button class="debug-only">Pulsante Test</button>

<!-- Metodo 2: Data Attribute -->
<div data-debug-only>
  Contenuto visibile solo in test mode
</div>
```

### Container Stilizzati

```html
<div class="debug-container">
  <div class="debug-container-title">🧪 Sezione Debug</div>
  <button class="debug-btn">Azione Debug</button>
</div>
```

### Log Condizionali

```javascript
if (window.DEBUG_LOGS_ENABLED) {
  console.log('📍 Dettaglio debug importante');
}
```

### Eventi Custom

Ascolta i cambi di stato:

```javascript
window.addEventListener('testModeChanged', (e) => {
  if (e.detail.enabled) {
    console.log('✅ Test Mode attivato');
    // Attiva funzionalità extra
  } else {
    console.log('⚪ Test Mode disattivato');
    // Disattiva funzionalità extra
  }
});
```

## 📦 File Coinvolti

### JavaScript
- `js/debug/test-mode.js` - Manager principale
- `js/debug/gps-debug-panel.js` - Pannello GPS
- `js/features/geolocation.js` - Integrazione GPS

### CSS
- `css/components/test-mode.css` - Stili badge e toast
- `css/components/gps-debug-panel.css` - Stili pannello GPS

### HTML
Integrato in:
- `index.html` - Home page
- `test.html` - Pagina test (con pulsanti di controllo)
- `fermate.html` - Pagina fermate
- `prezzi.html` - Pagina prezzi

## 🎨 Personalizzazione

### Modificare Colori Badge

In `css/components/test-mode.css`:

```css
.test-mode-badge {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  border: 2px solid #fbbf24;
}
```

### Modificare Posizione Badge

```css
.test-mode-badge {
  top: 20px;    /* Distanza dall'alto */
  right: 20px;  /* Distanza da destra */
}
```

## ⚠️ Note Importanti

1. **Produzione**: La modalità test è pensata per sviluppo. In produzione può essere lasciata ma non verrà attivata automaticamente.

2. **Prestazioni**: Quando attiva, vengono generati più log in console. Non impatta significativamente le prestazioni.

3. **Privacy**: I log GPS mostrano coordinate precise. Non condividere screenshot in pubblico.

4. **Persistenza**: Lo stato viene salvato in localStorage con chiave `tpl.testMode`.

5. **Compatibilità**: Funziona su desktop e mobile, touch-friendly per il drag del pannello.

## 🐛 Troubleshooting

### Il badge non appare
- Controlla la console: dovrebbe esserci `✅ Test Mode: 🟢 ATTIVO`
- Verifica localStorage: `localStorage.getItem('tpl.testMode')`
- Prova a riattivare: `TestMode.enable()`

### Il pannello GPS non si apre
- Verifica che Test Mode sia attivo
- Controlla errori in console
- Ricarica la pagina

### Gli elementi debug non appaiono
- Assicurati che abbiano classe `debug-only` o attributo `data-debug-only`
- Verifica che il CSS di test-mode.css sia caricato

## 📝 Changelog

### v1.0.0 (2025-11-19)
- ✨ Prima implementazione
- 📍 GPS Debug Panel con drag & drop
- 🧪 Sistema toggle centralizzato
- 💾 Persistenza stato in localStorage
- 📱 Supporto mobile completo

---

**Creato da**: AI Assistant per TPL FVG Autisti  
**Data**: 19 Novembre 2025  
**Versione**: 1.0.0

