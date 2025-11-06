# 🧪 Guida Test Manuali - Modularizzazione

## 🚀 Quick Start (5 minuti)

### Test Rapido 1: Service Worker
1. Apri `index.html` nel browser
2. Apri DevTools (F12) → Console
3. **Verifica:** Dovresti vedere `✅ Service Worker registrato: ...`
4. **Verifica:** NON dovresti vedere errori rossi

### Test Rapido 2: Changelog
1. Apri `index.html` nel browser
2. Apri Impostazioni (⚙️) → Tab "Info"
3. **Verifica:** La sezione "Aggiornamenti Recenti" è popolata
4. **Verifica:** La versione è visualizzata correttamente

### Test Rapido 3: Scala Interfaccia
1. Apri `prezzi.html` nel browser
2. Apri Impostazioni (⚙️) → Tab "Aspetto"
3. Cambia la scala interfaccia (es. 115%)
4. **Verifica:** L'interfaccia si ridimensiona
5. Ricarica la pagina (F5)
6. **Verifica:** La scala rimane quella salvata

### Test Rapido 4: Pulsanti Impostazioni
1. Apri `index.html` nel browser
2. Apri Impostazioni (⚙️) → Tab "Info"
3. Clicca "Verifica Aggiornamenti"
4. **Verifica:** Si apre il modal di verifica aggiornamenti
5. Chiudi il modal
6. Clicca "Riavvia Ora"
7. **Verifica:** La pagina si ricarica

### Test Rapido 5: CSS Benvenuto
1. Apri `benvenuto.html` nel browser
2. **Verifica:** L'immagine di benvenuto è visibile
3. **Verifica:** Il pulsante "Inizia" è visibile
4. **Verifica:** Il pulsante Impostazioni (⚙️) in alto a destra è visibile
5. Ridimensiona la finestra (o usa DevTools mobile)
6. **Verifica:** Su mobile, la card diventa trasparente

---

## 🔍 Test Dettagliati

### Test 1: Service Worker Registration

**File da testare:** Tutte le pagine HTML

**Procedura:**
1. Apri una pagina HTML nel browser
2. Apri DevTools (F12) → Console
3. Cerca il messaggio: `✅ Service Worker registrato: ...`
4. Vai su DevTools → Application → Service Workers
5. **Verifica:** Il Service Worker è registrato e attivo

**Risultato atteso:**
- ✅ Service Worker registrato correttamente
- ✅ Nessun errore in console
- ✅ Service Worker attivo in Application tab

---

### Test 2: Changelog Rendering

**File da testare:** `index.html`, `prezzi.html`, `fermate.html`

**Procedura:**
1. Apri una pagina HTML nel browser
2. Apri Impostazioni (⚙️) → Tab "Info"
3. Scorri fino a "Aggiornamenti Recenti"
4. **Verifica:** Il changelog è visualizzato correttamente
5. **Verifica:** Le versioni sono elencate dal più recente al più vecchio
6. **Verifica:** I dettagli di ogni versione sono visibili

**Risultato atteso:**
- ✅ Changelog popolato correttamente
- ✅ Nessun errore in console
- ✅ Versione corrente visualizzata correttamente

**Note:**
- Se la pagina non ha il container `changelog-container`, non ci dovrebbero essere errori in console

---

### Test 3: Sistema Scala Interfaccia

**File da testare:** `prezzi.html`

**Procedura:**
1. Apri `prezzi.html` nel browser
2. Apri la console (F12)
3. **Verifica:** Dovresti vedere `🔍 Scala interfaccia applicata: 100%` (o la scala salvata)
4. Apri Impostazioni (⚙️) → Tab "Aspetto"
5. Vai a "Dimensione Interfaccia"
6. Cambia la scala a 75%
7. **Verifica:** L'interfaccia si ridimensiona immediatamente
8. Cambia la scala a 125%
9. **Verifica:** L'interfaccia si ridimensiona immediatamente
10. Ricarica la pagina (F5)
11. **Verifica:** La scala rimane quella salvata (125%)

**Risultato atteso:**
- ✅ Scala applicata correttamente
- ✅ Preferenza salvata in localStorage
- ✅ Scala persistente dopo ricaricamento
- ✅ Nessun errore in console

---

### Test 4: Pulsanti Impostazioni

**File da testare:** `index.html`

#### Test 4.1: Verifica Aggiornamenti
1. Apri `index.html` nel browser
2. Apri Impostazioni (⚙️) → Tab "Info"
3. Clicca "Verifica Aggiornamenti"
4. **Verifica:** Il modal Impostazioni si chiude
5. **Verifica:** Si apre il modal di verifica aggiornamenti
6. **Verifica:** Il processo di verifica inizia
7. Apri la console (F12)
8. **Verifica:** Dovresti vedere `🔄 Pulsante "Verifica Aggiornamenti" cliccato`
9. **Verifica:** Dovresti vedere `✅ Chiamata a Updates.checkForUpdates()`

**Risultato atteso:**
- ✅ Modal si chiude correttamente
- ✅ Modal verifica aggiornamenti si apre
- ✅ Processo di verifica funziona
- ✅ Nessun errore in console

#### Test 4.2: Riavvia Ora
1. Apri `index.html` nel browser
2. Apri Impostazioni (⚙️) → Tab "Info"
3. Clicca "Riavvia Ora"
4. **Verifica:** Il modal Impostazioni si chiude
5. **Verifica:** La pagina si ricarica dopo un breve delay

**Risultato atteso:**
- ✅ Modal si chiude correttamente
- ✅ Pagina si ricarica
- ✅ Nessun errore in console

---

### Test 5: CSS Benvenuto

**File da testare:** `benvenuto.html`

#### Test 5.1: Visualizzazione Desktop
1. Apri `benvenuto.html` nel browser (desktop)
2. **Verifica:** L'immagine di benvenuto è visibile e centrata
3. **Verifica:** Il titolo "Benvenuto in TPL FVG Autisti" è visibile
4. **Verifica:** Il pulsante "Inizia" è visibile e centrato
5. **Verifica:** Il pulsante Impostazioni (⚙️) è in alto a destra

**Risultato atteso:**
- ✅ Tutti gli elementi sono visibili
- ✅ Layout corretto
- ✅ Stili applicati correttamente

#### Test 5.2: Responsive Mobile
1. Apri `benvenuto.html` nel browser
2. Apri DevTools (F12) → Toggle device toolbar (Ctrl+Shift+M)
3. Seleziona un dispositivo mobile (es. iPhone 12)
4. **Verifica:** L'immagine si adatta correttamente (max-height: 320px)
5. **Verifica:** La card diventa trasparente (background: transparent)
6. **Verifica:** Il pulsante Impostazioni si ridimensiona (45x45px)

**Risultato atteso:**
- ✅ Layout responsive corretto
- ✅ Immagine adattata
- ✅ Card trasparente su mobile
- ✅ Pulsante Impostazioni ridimensionato

#### Test 5.3: Dark Mode
1. Apri `benvenuto.html` nel browser
2. Apri Impostazioni (⚙️) → Tab "Aspetto"
3. Cambia il tema a "Scuro"
4. **Verifica:** I titoli sono visibili (bianco su sfondo scuro)
5. **Verifica:** Il pulsante Impostazioni si adatta al tema scuro
6. **Verifica:** Il contrasto è sufficiente per la leggibilità

**Risultato atteso:**
- ✅ Dark mode applicata correttamente
- ✅ Testi visibili e leggibili
- ✅ Pulsante Impostazioni adattato
- ✅ Contrasto sufficiente

---

### Test 6: Manifest

**File da testare:** Tutte le pagine HTML

**Procedura:**
1. Apri una pagina HTML nel browser
2. Apri DevTools (F12) → Application → Manifest
3. **Verifica:** Il manifest è caricato correttamente
4. **Verifica:** Non ci sono errori di validazione
5. **Verifica:** Le icone sono caricate correttamente
6. **Verifica:** Il nome dell'app è "TPL FVG"
7. **Verifica:** Il display mode è "standalone"

**Risultato atteso:**
- ✅ Manifest caricato correttamente
- ✅ Nessun errore di validazione
- ✅ Tutte le proprietà corrette
- ✅ File: `manifest.webmanifest` (non `manifest.json`)

---

### Test 7: Performance Animazione Gradiente

**File da testare:** Tutte le pagine HTML (se animazione abilitata)

**Procedura:**
1. Apri una pagina HTML nel browser
2. Apri DevTools (F12) → Performance
3. Attiva l'animazione del gradiente (se disponibile nelle impostazioni)
4. Clicca "Record" (o Ctrl+E)
5. Aspetta 5-10 secondi
6. Clicca "Stop"
7. Analizza il profilo di performance
8. **Verifica:** Non ci sono repaint eccessivi
9. **Verifica:** L'animazione è fluida (60 FPS)

**Risultato atteso:**
- ✅ Animazione fluida
- ✅ Nessun repaint eccessivo
- ✅ Performance accettabili
- ✅ Uso di `transform` invece di `background-position`

---

## 🐛 Troubleshooting

### Problema: Service Worker non si registra
**Soluzione:**
- Verifica che il file `sw.js` esista
- Verifica che la pagina sia servita via HTTP/HTTPS (non file://)
- Controlla la console per errori

### Problema: Changelog non si visualizza
**Soluzione:**
- Verifica che `changelog.js` sia caricato prima di `app-init.js`
- Verifica che il container `changelog-container` esista nella pagina
- Controlla la console per errori

### Problema: Scala interfaccia non funziona
**Soluzione:**
- Verifica che `interface-scale.js` sia caricato
- Verifica che `settings.js` sia caricato
- Controlla la console per errori
- Verifica che i radio buttons abbiano `name="interface-scale"`

### Problema: Pulsanti Impostazioni non funzionano
**Soluzione:**
- Verifica che `modals.js` sia caricato
- Verifica che `updates.js` sia caricato (per Verifica Aggiornamenti)
- Controlla la console per errori
- Verifica che il modal sia inizializzato correttamente

### Problema: CSS benvenuto non applicato
**Soluzione:**
- Verifica che `benvenuto.css` sia caricato
- Verifica che il file esista in `css/pages/benvenuto.css`
- Controlla la console per errori 404
- Verifica che il Service Worker abbia aggiornato la cache

---

## ✅ Checklist Finale

- [ ] Tutti i test rapidi passati
- [ ] Tutti i test dettagliati passati
- [ ] Nessun errore in console
- [ ] Nessun warning in console
- [ ] Performance accettabili
- [ ] Responsive design funzionante
- [ ] Dark mode funzionante
- [ ] Service Worker funzionante
- [ ] Manifest valido

---

## 📝 Note Finali

- Se trovi problemi, annotali con:
  - Pagina interessata
  - Browser utilizzato
  - Versione browser
  - Messaggio di errore (se presente)
  - Screenshot (se utile)

- Per problemi critici, verifica:
  - Ordine di caricamento degli script
  - Cache del browser (prova in incognito)
  - Cache del Service Worker (disabilita e riabilita)

