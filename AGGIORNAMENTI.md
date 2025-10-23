# Sistema di Verifica Aggiornamenti

Questo documento spiega come funziona il sistema di verifica degli aggiornamenti per l'app TPL FVG Autisti ospitata su GitHub Pages.

## 🎯 Funzionalità

L'app include un sistema intelligente di verifica aggiornamenti che:

- ✅ Controlla automaticamente se ci sono nuove versioni disponibili
- ✅ Mostra notifiche chiare all'utente
- ✅ Confronta la versione locale con quella remota
- ✅ Permette di aggiornare con un singolo click
- ✅ Funziona anche offline (con messaggio appropriato)

## 📋 Come Funziona

### File Chiave

1. **`version.json`** - Contiene la versione corrente pubblicata su GitHub Pages

   ```json
   {
     "version": "1.3.3",
     "versionDate": "22 Ottobre 2025",
     "versionTime": "21:30",
     "updateNotes": "Sistema di verifica aggiornamenti implementato"
   }
   ```

2. **`script.js`** - Contiene la logica di verifica:

   - Costanti `CURRENT_VERSION`, `VERSION_DATE`, `VERSION_TIME`
   - Funzione `checkForUpdates()` che confronta le versioni
   - Funzione `compareVersions()` che compara le versioni semantiche

3. **`sw.js`** - Service Worker configurato per:
   - NON cachare `version.json` (sempre fetch dal server)
   - Permettere la verifica anche con app installata come PWA

## 🚀 Come Aggiornare la Versione

### Metodo 1: GitHub Actions (Raccomandato)

1. Vai su GitHub → Actions → "Aggiorna Versione App"
2. Clicca su "Run workflow"
3. Inserisci:
   - **Nuova versione** (es: `1.3.4`)
   - **Note aggiornamento** (es: "Correzioni bug e miglioramenti")
4. Clicca "Run workflow"

Il workflow automaticamente:

- ✅ Aggiorna `version.json`
- ✅ Aggiorna `manifest.json`
- ✅ Aggiorna le costanti in `script.js`
- ✅ Aggiorna la versione nel footer di `index.html`
- ✅ Crea un commit con le modifiche
- ✅ Crea un tag git per la release
- ✅ Pubblica su GitHub Pages

### Metodo 2: Manuale

Se preferisci aggiornare manualmente:

1. **Aggiorna `version.json`**:

   ```json
   {
     "version": "1.3.4",
     "versionDate": "23 Ottobre 2025",
     "versionTime": "10:00",
     "updateNotes": "Descrizione aggiornamento"
   }
   ```

2. **Aggiorna `script.js`**:

   ```javascript
   const CURRENT_VERSION = "1.3.4";
   const VERSION_DATE = "23 Ottobre 2025";
   const VERSION_TIME = "10:00";
   ```

3. **Aggiorna `manifest.json`**:

   ```json
   {
     "version": "1.3.4",
     "version_date": "23 Ottobre 2025",
     "version_time": "10:00"
   }
   ```

4. **Aggiorna `index.html`** (cerca "TPL Autisti" nel footer):

   ```html
   <a href="test.html">TPL Autisti 1.3.4</a>
   ```

5. **Commit e push**:
   ```bash
   git add version.json script.js manifest.json index.html
   git commit -m "Release v1.3.4"
   git tag -a v1.3.4 -m "Release v1.3.4"
   git push && git push --tags
   ```

## 🔄 Flusso di Aggiornamento Utente

1. **Utente apre l'app**
2. **Clicca su "🔄 Info o Riavvia"** (navbar o menu mobile)
3. **L'app verifica** se `version.json` ha una versione più recente
4. **Mostra una di queste schermate**:

   - ✅ **App Aggiornata** - Versione locale = versione remota
   - 🎉 **Aggiornamento Disponibile** - Versione remota più recente
   - ⚠️ **Verifica non Disponibile** - Errore di rete/offline
   - ℹ️ **Versione Diversa** - Versione locale diversa (non più recente)

5. **Utente clicca "Aggiorna Ora"**
6. **L'app**:
   - Cancella cache del Service Worker
   - Cancella localStorage
   - Ricarica verso `benvenuto.html`
   - Ri-scarica tutti gli asset aggiornati

## 🎨 Interfaccia Utente

### Pulsante Verifica Aggiornamenti

- **Desktop**: Pulsante 🔄 nella navbar
- **Mobile**: Mini card "🔄 Info o Riavvia" nel menu hamburger

### Stati del Modal

| Stato                     | Icona | Colore    | Azione         |
| ------------------------- | ----- | --------- | -------------- |
| Verifica in corso         | ⏳    | Grigio    | Nessuna        |
| Aggiornamento disponibile | 🎉    | Verde     | "Aggiorna Ora" |
| App aggiornata            | ✅    | Verde     | "Riavvia App"  |
| Errore verifica           | ⚠️    | Rosso     | "Riavvia App"  |
| Versione diversa          | ℹ️    | Arancione | "Riavvia App"  |

## 🔧 Configurazione GitHub Pages

Per garantire che il sistema funzioni correttamente:

1. **Abilita GitHub Pages** nel repository
2. **Branch**: `main` o `master`
3. **Cartella**: `/` (root)
4. **Custom domain** (opzionale): configura se necessario

### Cache e Headers

GitHub Pages automaticamente:

- ✅ Serve i file con cache appropriata
- ✅ Supporta HTTPS
- ✅ Rigenera il sito ad ogni push

Il Service Worker è configurato per:

- ❌ NON cachare `version.json` (fetch sempre dal server)
- ✅ Aggiungere parametri `?t=timestamp` per evitare cache browser
- ✅ Headers `Cache-Control: no-cache` su `version.json`

## 🧪 Come Testare

1. **Test locale**:

   ```bash
   # Simula GitHub Pages in locale
   python -m http.server 8000
   # oppure
   npx serve
   ```

2. **Modifica version.json** con una versione più alta
3. **Apri l'app** e clicca su 🔄
4. **Verifica** che mostri "Aggiornamento Disponibile"

## 📱 PWA e Aggiornamenti

Se l'app è installata come PWA:

1. **Service Worker** controlla gli aggiornamenti
2. **`version.json`** non viene cachato
3. **Utente può verificare** manualmente tramite pulsante
4. **Reset cache** scarica la nuova versione

## 🐛 Risoluzione Problemi

### "Impossibile verificare aggiornamenti"

- Controlla connessione internet
- Verifica che `version.json` esista su GitHub Pages
- Apri Console → Network per vedere errori

### "Versione non aggiornata dopo update"

1. Svuota cache browser (Ctrl+Shift+Del)
2. Disinstalla PWA e reinstalla
3. Usa modalità incognito per testare

### "Workflow GitHub Actions non funziona"

- Verifica permessi del workflow
- Controlla che il file `.github/workflows/update-version.yml` esista
- Vedi log del workflow per errori

## 📊 Versioning Semantico

Il sistema usa il formato `MAJOR.MINOR.PATCH`:

- **MAJOR** (1.x.x): Modifiche incompatibili, breaking changes
- **MINOR** (x.3.x): Nuove funzionalità, retrocompatibili
- **PATCH** (x.x.4): Bug fix, piccole modifiche

Esempi:

- `1.3.3` → `1.3.4` = Patch (bug fix)
- `1.3.4` → `1.4.0` = Minor (nuova feature)
- `1.4.0` → `2.0.0` = Major (breaking changes)

## 🎉 Vantaggi del Sistema

- ✅ **Automatico**: Workflow GitHub Actions
- ✅ **Affidabile**: Confronto versioni semantiche
- ✅ **User-friendly**: UI chiara e intuitiva
- ✅ **Offline-safe**: Gestisce errori di rete
- ✅ **PWA-ready**: Compatibile con app installata
- ✅ **Zero-config**: Funziona out-of-the-box su GitHub Pages

---

**Autore**: Michele Carnimeo  
**Ultima modifica**: 23 Ottobre 2025
