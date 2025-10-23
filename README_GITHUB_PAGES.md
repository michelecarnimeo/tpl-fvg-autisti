# 🚀 TPL FVG Autisti - Deployment su GitHub Pages

Guida rapida per pubblicare e aggiornare l'app su GitHub Pages.

## 📋 Setup Iniziale

### 1. Configurazione Repository

```bash
# Se non hai ancora inizializzato git
git init
git add .
git commit -m "Initial commit"

# Aggiungi remote (sostituisci con il tuo repository)
git remote add origin https://github.com/TUO-USERNAME/tpl-fvg-autisti.git
git branch -M main
git push -u origin main
```

### 2. Abilita GitHub Pages

1. Vai su **Settings** del repository
2. Nella sidebar, clicca su **Pages**
3. In **Source**, seleziona:
   - **Branch**: `main`
   - **Folder**: `/ (root)`
4. Clicca **Save**
5. Attendi 1-2 minuti per il deploy

La tua app sarà disponibile su:

```
https://TUO-USERNAME.github.io/tpl-fvg-autisti/
```

## 🔄 Aggiornare la Versione

### Metodo Automatico (GitHub Actions) ⭐ Raccomandato

1. Vai su **Actions** → **Aggiorna Versione App**
2. Clicca **Run workflow**
3. Inserisci:
   - **Nuova versione**: `1.3.4` (incrementa sempre)
   - **Note aggiornamento**: `Correzioni bug`
4. Clicca **Run workflow**

✅ **Fatto!** Il workflow automaticamente:

- Aggiorna tutti i file necessari
- Crea commit e tag
- Deploya su GitHub Pages

Attendi 2-3 minuti, poi l'app mostrerà il pulsante di aggiornamento agli utenti.

### Metodo Manuale

Se preferisci aggiornare manualmente, segui [AGGIORNAMENTI.md](AGGIORNAMENTI.md).

## 📱 Test dell'App

Dopo il deploy:

1. Apri l'URL GitHub Pages
2. Verifica che tutto funzioni:

   - ✅ Selezione linee
   - ✅ Calcolo prezzi
   - ✅ Modalità scura
   - ✅ Geolocalizzazione
   - ✅ PWA installabile

3. Test aggiornamenti:
   - Clicca su 🔄 (navbar o menu mobile)
   - Verifica lo stato della versione

## 🎯 URL Importanti

- **App Live**: `https://TUO-USERNAME.github.io/tpl-fvg-autisti/`
- **Repository**: `https://github.com/TUO-USERNAME/tpl-fvg-autisti`
- **Actions**: `https://github.com/TUO-USERNAME/tpl-fvg-autisti/actions`
- **Releases**: `https://github.com/TUO-USERNAME/tpl-fvg-autisti/releases`

## 🔧 Configurazione Custom Domain (Opzionale)

Se hai un dominio personalizzato:

1. Settings → Pages → Custom domain
2. Inserisci: `tpl.tuodominio.com`
3. Configura DNS:
   ```
   Type: CNAME
   Name: tpl
   Value: TUO-USERNAME.github.io
   ```
4. Abilita **Enforce HTTPS**

## 📊 Monitoraggio

### Visualizza Traffico

Settings → Insights → Traffic

### Check Deploy Status

Actions → Workflows → vedi status ultimo deploy

### Verificare Versione Live

Apri: `https://TUO-USERNAME.github.io/tpl-fvg-autisti/version.json`

Dovresti vedere:

```json
{
  "version": "1.3.3",
  "versionDate": "22 Ottobre 2025",
  "versionTime": "21:30",
  "updateNotes": "..."
}
```

## 🚨 Troubleshooting

### "Site not found"

**Problema**: Errore 404 su GitHub Pages

**Soluzione**:

1. Verifica che Pages sia abilitato
2. Controlla branch corretto (`main`)
3. Attendi 5 minuti per propagazione

### "App mostra versione vecchia"

**Problema**: Dopo push, app non si aggiorna

**Soluzione**:

1. Svuota cache browser: Ctrl+Shift+Del
2. Ricarica: Ctrl+F5
3. Verifica timestamp su `version.json`

### "Workflow Actions fallisce"

**Problema**: GitHub Actions in errore

**Soluzione**:

1. Vai su Actions → vedi log errore
2. Verifica permessi workflow:
   - Settings → Actions → Workflow permissions
   - Seleziona "Read and write permissions"
3. Riprova workflow

## 📦 Cache GitHub Pages

GitHub Pages automaticamente:

- ✅ Caching CDN per performance
- ✅ HTTPS forzato
- ✅ Compressione gzip

Il Service Worker gestisce:

- ✅ Cache offline degli asset
- ✅ Aggiornamenti versione (`version.json` mai in cache)
- ✅ Fallback per modalità offline

## 🎉 Best Practices

1. **Versioning Semantico**:

   - Patch: `1.3.3` → `1.3.4` (bug fix)
   - Minor: `1.3.4` → `1.4.0` (nuove feature)
   - Major: `1.4.0` → `2.0.0` (breaking changes)

2. **Commit Messages**:

   ```
   🚀 Release v1.3.4 - Descrizione breve
   🐛 Fix bug calcolo prezzi
   ✨ Aggiungi geolocalizzazione fermate
   📝 Aggiorna documentazione
   ```

3. **Testing Prima del Deploy**:

   - Test locale: `python -m http.server 8000`
   - Verifica funzionalità base
   - Test su mobile

4. **Frequenza Aggiornamenti**:
   - Bug critici: Immediatamente
   - Miglioramenti: Settimanale
   - Nuove feature: Quando pronte

## 📞 Supporto

- **Documentazione**: [AGGIORNAMENTI.md](AGGIORNAMENTI.md)
- **Test**: [TEST_AGGIORNAMENTI.md](TEST_AGGIORNAMENTI.md)
- **Issues**: Apri un issue su GitHub

---

**Pronto a Partire!** 🎉

```bash
# Push delle modifiche
git add .
git commit -m "Setup sistema aggiornamenti"
git push

# L'app sarà live in 2-3 minuti!
```
