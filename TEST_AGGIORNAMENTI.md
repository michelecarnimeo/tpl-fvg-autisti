# Test Sistema Verifica Aggiornamenti

Guida passo-passo per testare il sistema di verifica aggiornamenti dell'app TPL FVG Autisti.

**⚠️ Nota**: Questo documento è stato aggiornato per riflettere il sistema attuale (v1.6.9+):

- La versione locale viene letta da `changelog.js` (non più da costanti in `script.js`)
- Il pulsante "Verifica aggiornamenti" si trova nel modal Impostazioni → Tab "Info"
- Dopo "Aggiorna Ora", l'app ricarica la pagina corrente (non reindirizza a `benvenuto.html`)
- Il workflow GitHub Actions richiede aggiornamento manuale di `changelog.js`

## 🧪 Prerequisiti

- App pubblicata su GitHub Pages
- Browser moderno (Chrome, Firefox, Safari, Edge)
- Connessione internet attiva

## 📝 Scenario 1: Nessun Aggiornamento Disponibile

**Obiettivo**: Verificare che l'app mostri "App Aggiornata" quando la versione locale è uguale a quella remota.

### Passi:

1. ✅ Verifica che `version.json` e `changelog.js` abbiano la stessa versione

   **version.json**:

   ```json
   { "version": "1.6.9" }
   ```

   **changelog.js**:

   ```javascript
   // La prima entry dell'array changelogData deve avere la stessa versione
   {
     version: '1.6.9',
     date: '9 Novembre 2025',
     time: '10:30',
     ...
   }
   ```

2. ✅ Apri l'app su GitHub Pages
3. ✅ Apri il modal Impostazioni (⚙️) → Tab "Info"
4. ✅ Clicca sul pulsante "Verifica aggiornamenti"
5. ✅ Attendi 1-2 secondi

### Risultato Atteso:

```
┌─────────────────────────────────────┐
│   ✅ App Aggiornata                 │
│                                     │
│   ✨ Stai usando l'ultima versione! │
│                                     │
│   Versione: 1.6.9                   │
│   9 Novembre 2025 alle 10:30        │
│                                     │
│   Vuoi comunque riavviare l'app?    │
│                                     │
│   [Chiudi]    [Riavvia App]         │
└─────────────────────────────────────┘
```

---

## 📝 Scenario 2: Aggiornamento Disponibile

**Obiettivo**: Verificare che l'app rilevi e notifichi un aggiornamento disponibile.

### Passi:

1. ✅ Modifica `version.json` su GitHub con una versione superiore:

   ```json
   {
     "version": "1.6.10",
     "versionDate": "10 Novembre 2025",
     "versionTime": "14:00",
     "updateNotes": "Correzioni bug e miglioramenti prestazioni"
   }
   ```

2. ✅ **IMPORTANTE**: Aggiorna anche `changelog.js` con la nuova versione (aggiungi entry all'inizio dell'array `changelogData`)

3. ✅ Commit e push su GitHub
4. ✅ Attendi 1-2 minuti (deploy GitHub Pages)
5. ✅ Apri l'app (senza refresh)
6. ✅ Apri il modal Impostazioni (⚙️) → Tab "Info"
7. ✅ Clicca sul pulsante "Verifica aggiornamenti"
8. ✅ Attendi la verifica

### Risultato Atteso:

```
┌─────────────────────────────────────┐
│   🎉 Aggiornamento Disponibile!     │
│                                     │
│   ✨ Nuova versione disponibile!    │
│   Versione attuale: 1.6.9           │
│   Nuova versione: 1.6.10            │
│                                     │
│   📝 Novità:                        │
│   Correzioni bug e miglioramenti    │
│   prestazioni                       │
│                                     │
│   ⚠️ Premendo "Aggiorna Ora",       │
│   l'app si aggiornerà e             │
│   riavvierà automaticamente.        │
│                                     │
│   [Chiudi]    [Aggiorna Ora]        │
└─────────────────────────────────────┘
```

### Test Aggiornamento:

9. ✅ Clicca su "Aggiorna Ora"
10. ✅ Verifica che l'app:

- Ricarica la pagina corrente (`window.location.reload()`)
- Scarica i nuovi asset
- Cache Service Worker viene pulita
- LocalStorage viene cancellato (opzionale, configurabile)

---

## 📝 Scenario 3: Errore di Rete / Offline

**Obiettivo**: Verificare che l'app gestisca correttamente l'assenza di connessione.

### Passi:

1. ✅ Apri DevTools (F12)
2. ✅ Network → Throttling → "Offline"
3. ✅ Apri il modal Impostazioni (⚙️) → Tab "Info"
4. ✅ Clicca sul pulsante "Verifica aggiornamenti"
5. ✅ Attendi

### Risultato Atteso:

```
┌─────────────────────────────────────┐
│   ⚠️ Verifica non Disponibile       │
│                                     │
│   ❌ Impossibile verificare         │
│   gli aggiornamenti                 │
│   Failed to fetch                   │
│                                     │
│   Versione locale: 1.6.9            │
│   9 Novembre 2025 alle 10:30        │
│                                     │
│   Verifica la connessione internet  │
│   e riprova.                        │
│   Puoi comunque riavviare l'app     │
│   se necessario.                    │
│                                     │
│   [Chiudi]    [Riavvia App]         │
└─────────────────────────────────────┘
```

---

## 📝 Scenario 4: Versione Diversa (Downgrade)

**Obiettivo**: Verificare il comportamento quando la versione remota è inferiore alla locale.

### Passi:

1. ✅ Modifica `version.json` su GitHub con versione **inferiore**:

   ```json
   {
     "version": "1.6.8",
     "versionDate": "7 Novembre 2025",
     "versionTime": "17:00",
     "updateNotes": "Versione precedente"
   }
   ```

2. ✅ **IMPORTANTE**: Aggiorna anche `changelog.js` con la versione inferiore (solo per test)
3. ✅ Commit e push
4. ✅ Attendi deploy
5. ✅ Apri il modal Impostazioni (⚙️) → Tab "Info"
6. ✅ Clicca sul pulsante "Verifica aggiornamenti"

### Risultato Atteso:

```
┌─────────────────────────────────────┐
│   ℹ️ Versione Diversa Rilevata      │
│                                     │
│   Versione server: 1.6.8            │
│   Versione locale: 1.6.9            │
│                                     │
│   Vuoi comunque riavviare l'app?    │
│                                     │
│   [Chiudi]    [Riavvia App]         │
└─────────────────────────────────────┘
```

---

## 📝 Scenario 5: Test Confronto Versioni

**Obiettivo**: Verificare che la funzione `compareVersions()` funzioni correttamente.

### Test Console:

```javascript
// Apri Console (F12) e testa:

// Nota: compareVersions() è una funzione privata in js/features/updates.js
// Per testarla, usa l'API pubblica di Updates (se esposta) oppure testa tramite checkForUpdates()

// Test tramite Updates module (se esposto):
// console.log(window.Updates.compareVersions("1.6.10", "1.6.9")); // Dovrebbe essere: 1

// Alternativa: Testa direttamente la logica tramite checkForUpdates()
// Modifica version.json con versioni diverse e verifica il comportamento del modal

// Test 1: Versione superiore
// Modifica version.json a "1.6.10" → Dovrebbe mostrare "Aggiornamento Disponibile"

// Test 2: Versione inferiore
// Modifica version.json a "1.6.8" → Dovrebbe mostrare "Versione Diversa Rilevata"

// Test 3: Versioni uguali
// version.json e changelog.js con "1.6.9" → Dovrebbe mostrare "App Aggiornata"
```

---

## 📝 Scenario 6: Test Cache Service Worker

**Obiettivo**: Verificare che `version.json` NON sia in cache.

### Passi:

1. ✅ Apri DevTools → Application → Cache Storage
2. ✅ Espandi le cache (`tpl-static-v4`, `tpl-dynamic-v4`)
3. ✅ Verifica che `version.json` **NON** sia presente

### Risultato Atteso:

```
Cache Storage
├── tpl-static-v4
│   ├── index.html ✅
│   ├── style1.css ✅
│   ├── script.js ✅
│   ├── database.json ✅
│   └── (altri file...)
└── tpl-dynamic-v4
    └── (cache dinamico)

❌ version.json NON deve essere in cache
```

### Test Network:

4. ✅ DevTools → Network
5. ✅ Clicca su 🔄
6. ✅ Verifica richiesta `version.json`:
   - **Request Headers**: `Cache-Control: no-cache`, `Pragma: no-cache`
   - **Response**: 200 (dal server, non da cache)

---

## 📝 Scenario 7: Test PWA Installata

**Obiettivo**: Verificare che funzioni anche con app installata.

### Passi:

1. ✅ Installa l'app come PWA
2. ✅ Apri l'app installata
3. ✅ Modifica `version.json` e `changelog.js` su GitHub (versione superiore)
4. ✅ Nella PWA, apri Impostazioni (⚙️) → Tab "Info"
5. ✅ Clicca sul pulsante "Verifica aggiornamenti"
6. ✅ Verifica che rilevi l'aggiornamento

### Risultato Atteso:

- ✅ PWA rileva aggiornamento
- ✅ Mostra modal "Aggiornamento Disponibile"
- ✅ Dopo "Aggiorna Ora", ricarica con nuova versione

---

## 📝 Scenario 8: Test GitHub Actions Workflow

**Obiettivo**: Testare l'aggiornamento automatico tramite workflow.

### Passi:

1. ✅ Vai su GitHub → Actions
2. ✅ Seleziona "Aggiorna Versione App"
3. ✅ Clicca "Run workflow"
4. ✅ Compila:
   - Versione: `1.6.10`
   - Note: `Test workflow automatico`
5. ✅ Clicca "Run workflow"
6. ✅ Attendi completamento (1-2 min)

### Verifica:

7. ✅ Controlla che siano stati aggiornati:

   - ✅ `version.json` → `"version": "1.6.10"`
   - ⚠️ `script.js` → Il workflow cerca di aggiornare costanti che non esistono più (può essere ignorato)
   - ✅ `manifest.json` → `"version": "1.6.10"`
   - ✅ `index.html` → `TPL Autisti 1.6.10` (se presente nel footer)

8. ✅ **IMPORTANTE**: Dopo l'esecuzione del workflow, aggiorna manualmente `changelog.js` con la nuova versione

9. ✅ Verifica nuovo commit:
   - Message: `🚀 Release v1.6.10 - Test workflow automatico`
   - Tag: `v1.6.10`

---

## 🔍 Checklist Finale

Segna ogni test completato:

- [ ] ✅ Scenario 1: App Aggiornata
- [ ] ✅ Scenario 2: Aggiornamento Disponibile
- [ ] ✅ Scenario 3: Errore Offline
- [ ] ✅ Scenario 4: Versione Diversa
- [ ] ✅ Scenario 5: Confronto Versioni
- [ ] ✅ Scenario 6: Cache Service Worker
- [ ] ✅ Scenario 7: PWA Installata
- [ ] ✅ Scenario 8: GitHub Actions

---

## 🐛 Troubleshooting

### "version.json non trovato"

**Problema**: 404 su `version.json`

**Soluzione**:

```bash
# Verifica che il file esista
ls -la version.json

# Se non esiste, crealo
cat > version.json << 'EOF'
{
  "version": "1.3.3",
  "versionDate": "22 Ottobre 2025",
  "versionTime": "21:30",
  "updateNotes": "Sistema aggiornamenti"
}
EOF

# Commit e push
git add version.json
git commit -m "Add version.json"
git push
```

### "Versione non si aggiorna"

**Problema**: Dopo aggiornamento, l'app mostra ancora versione vecchia

**Soluzione**:

1. Verifica che `changelog.js` sia aggiornato con la nuova versione
2. Svuota cache browser: Ctrl+Shift+Del
3. Disinstalla PWA
4. Cancella storage: DevTools → Application → Clear Storage
5. Verifica che `version.json` e `changelog.js` siano sincronizzati
6. Ricarica: Ctrl+F5

### "Modal non si apre"

**Problema**: Cliccando su 🔄 non succede nulla

**Soluzione**:

```javascript
// Verifica in console:
console.log(typeof window.Updates); // Dovrebbe essere: "object"
console.log(typeof window.Updates.checkForUpdates); // Dovrebbe essere: "function"

// Testa manualmente:
if (window.Updates && window.Updates.checkForUpdates) {
  window.Updates.checkForUpdates();
} else {
  console.error("❌ Updates.checkForUpdates non disponibile");
}
```

---

## 📊 Metriche di Successo

Il sistema funziona correttamente se:

- ✅ Tutti gli 8 scenari passano
- ✅ Nessun errore in console
- ✅ `version.json` non è mai in cache
- ✅ Aggiornamento funziona online e offline
- ✅ PWA rileva aggiornamenti
- ✅ GitHub Actions funziona

---

**Data Test**: **/**/\_**\_  
**Tester**: \*\*\*\***\_**\*\*\*\***  
**Esito**: ⬜ PASS | ⬜ FAIL  
**Note**: **\*\*\*\***\_\_\_**\*\*\*\***
