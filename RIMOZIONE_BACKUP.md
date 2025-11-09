# Rimozione File Backup da GitHub

## File da rimuovere dalla repository

Sono stati trovati **13 file di backup** tracciati da Git che devono essere rimossi:

1. `benvenuto.html.backup-settings-modal-20251106-150113.html`
2. `css/components/modals.css.backup`
3. `fermate.html.backup-settings-modal-20251106-145809.html`
4. `index.html.backup-settings-modal-20251106-142946.html`
5. `prezzi.html.backup-settings-modal-20251106-145519.html`
6. `script.js.backup`
7. `script.js.backup-prezzi-20251102-102554.js`
8. `style1.css.backup`
9. `style1.css.backup-settings`
10. `test.html.backup-20251103-112500.html`
11. `test.html.backup-darkmode-20251106-111030.html`
12. `test.html.backup-settings-modal-20251106-125453.html`
13. `test.html.backup-sw-20251106-111357.html`

## Procedura

I file sono già stati rimossi localmente. Per rimuoverli da GitHub:

```bash
# Opzione 1: Rimuovi tutti in un unico commit
git add -u
git commit -m "chore: Rimossi file di backup non necessari"
git push

# Opzione 2: Rimuovi uno alla volta (se preferisci)
git rm benvenuto.html.backup-settings-modal-20251106-150113.html
git commit -m "chore: Rimosso backup benvenuto.html"
git push

# E così via per ogni file...
```

## Nota

I file sono già stati cancellati localmente, quindi Git li rileva come "deleted" (D).
Il commit rimuoverà i file dalla repository GitHub mantenendo la cronologia.

