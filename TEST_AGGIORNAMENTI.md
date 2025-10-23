# Test Sistema Verifica Aggiornamenti

Guida passo-passo per testare il sistema di verifica aggiornamenti dell'app TPL FVG Autisti.

## 🧪 Prerequisiti

- App pubblicata su GitHub Pages
- Browser moderno (Chrome, Firefox, Safari, Edge)
- Connessione internet attiva

## 📝 Scenario 1: Nessun Aggiornamento Disponibile

**Obiettivo**: Verificare che l'app mostri "App Aggiornata" quando la versione locale è uguale a quella remota.

### Passi:

1. ✅ Verifica che `version.json` e `script.js` abbiano la stessa versione

   **version.json**:

   ```json
   { "version": "1.3.3" }
   ```

   **script.js**:

   ```javascript
   const CURRENT_VERSION = "1.3.3";
   ```

2. ✅ Apri l'app su GitHub Pages
3. ✅ Clicca sul pulsante 🔄 nella navbar (o menu mobile)
4. ✅ Attendi 1-2 secondi

### Risultato Atteso:

```
┌─────────────────────────────────────┐
│   ✅ App Aggiornata                 │
│                                     │
│   ✨ Stai usando l'ultima versione! │
│                                     │
│   Versione: 1.3.3                   │
│   22 Ottobre 2025 alle 21:30        │
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

1. ✅ Modifica **SOLO** `version.json` su GitHub con una versione superiore:

   ```json
   {
     "version": "1.3.4",
     "versionDate": "23 Ottobre 2025",
     "versionTime": "10:00",
     "updateNotes": "Correzioni bug e miglioramenti prestazioni"
   }
   ```

2. ✅ Commit e push su GitHub
3. ✅ Attendi 1-2 minuti (deploy GitHub Pages)
4. ✅ Apri l'app (senza refresh)
5. ✅ Clicca sul pulsante 🔄
6. ✅ Attendi la verifica

### Risultato Atteso:

```
┌─────────────────────────────────────┐
│   🎉 Aggiornamento Disponibile!     │
│                                     │
│   ✨ Nuova versione disponibile!    │
│   Versione attuale: 1.3.3           │
│   Nuova versione: 1.3.4             │
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

7. ✅ Clicca su "Aggiorna Ora"
8. ✅ Verifica che l'app:
   - Si reindirizza a `benvenuto.html`
   - Scarica i nuovi asset
   - Cache viene pulita

---

## 📝 Scenario 3: Errore di Rete / Offline

**Obiettivo**: Verificare che l'app gestisca correttamente l'assenza di connessione.

### Passi:

1. ✅ Apri DevTools (F12)
2. ✅ Network → Throttling → "Offline"
3. ✅ Clicca sul pulsante 🔄
4. ✅ Attendi

### Risultato Atteso:

```
┌─────────────────────────────────────┐
│   ⚠️ Verifica non Disponibile       │
│                                     │
│   ❌ Impossibile verificare         │
│   gli aggiornamenti                 │
│   Failed to fetch                   │
│                                     │
│   Versione locale: 1.3.3            │
│   22 Ottobre 2025 alle 21:30        │
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
     "version": "1.3.2",
     "versionDate": "21 Ottobre 2025",
     "versionTime": "15:00",
     "updateNotes": "Versione precedente"
   }
   ```

2. ✅ Commit e push
3. ✅ Attendi deploy
4. ✅ Clicca sul pulsante 🔄

### Risultato Atteso:

```
┌─────────────────────────────────────┐
│   ℹ️ Versione Diversa Rilevata      │
│                                     │
│   Versione server: 1.3.2            │
│   Versione locale: 1.3.3            │
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

// Test 1: Versione superiore
console.log(compareVersions("1.3.4", "1.3.3")); // Dovrebbe essere: 1

// Test 2: Versione inferiore
console.log(compareVersions("1.3.2", "1.3.3")); // Dovrebbe essere: -1

// Test 3: Versioni uguali
console.log(compareVersions("1.3.3", "1.3.3")); // Dovrebbe essere: 0

// Test 4: Major version
console.log(compareVersions("2.0.0", "1.9.9")); // Dovrebbe essere: 1

// Test 5: Minor version
console.log(compareVersions("1.4.0", "1.3.9")); // Dovrebbe essere: 1

// Test 6: Patch version
console.log(compareVersions("1.3.10", "1.3.9")); // Dovrebbe essere: 1
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
3. ✅ Modifica `version.json` su GitHub (versione superiore)
4. ✅ Nella PWA, clicca su 🔄
5. ✅ Verifica che rilevi l'aggiornamento

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
   - Versione: `1.3.5`
   - Note: `Test workflow automatico`
5. ✅ Clicca "Run workflow"
6. ✅ Attendi completamento (1-2 min)

### Verifica:

7. ✅ Controlla che siano stati aggiornati:

   - ✅ `version.json` → `"version": "1.3.5"`
   - ✅ `script.js` → `CURRENT_VERSION = '1.3.5'`
   - ✅ `manifest.json` → `"version": "1.3.5"`
   - ✅ `index.html` → `TPL Autisti 1.3.5`

8. ✅ Verifica nuovo commit:
   - Message: `🚀 Release v1.3.5 - Test workflow automatico`
   - Tag: `v1.3.5`

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

1. Svuota cache browser: Ctrl+Shift+Del
2. Disinstalla PWA
3. Cancella storage: DevTools → Application → Clear Storage
4. Ricarica: Ctrl+F5

### "Modal non si apre"

**Problema**: Cliccando su 🔄 non succede nulla

**Soluzione**:

```javascript
// Verifica in console:
console.log(typeof checkForUpdates); // Dovrebbe essere: "function"

// Testa manualmente:
checkForUpdates();
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
**Tester**: ******\_********  
**Esito**: ⬜ PASS | ⬜ FAIL  
**Note**: ********\_\_\_********
