# 🧪 Checklist Test Modularizzazione

**Data**: 7 Novembre 2025  
**Versione**: Dopo modularizzazione MODULI 1, 2, 3, 4

---

## ✅ Test MODULO 1: UI Helpers

### Test Scroll to Top
- [ ] Aprire una pagina (index.html, fermate.html, prezzi.html)
- [ ] Scorrere la pagina verso il basso
- [ ] Verificare che il pulsante "Torna su" appaia dopo 300px di scroll
- [ ] Cliccare sul pulsante "Torna su"
- [ ] Verificare che la pagina scrolli smooth verso l'alto
- [ ] Verificare che il pulsante scompaia quando si è in cima

### Test Swap Button (Home Page)
- [ ] Aprire index.html
- [ ] Selezionare una linea
- [ ] Selezionare partenza e arrivo
- [ ] Verificare che il pulsante swap sia visibile
- [ ] Cliccare sul pulsante swap
- [ ] Verificare che partenza e arrivo si scambino
- [ ] Verificare che il pulsante GPS si resetti (non più attivo)
- [ ] Verificare che il prezzo venga ricalcolato

---

## ✅ Test MODULO 2: Page Renderers

### Test Rendering Fermate (fermate.html)
- [ ] Aprire fermate.html
- [ ] Cliccare su "Seleziona una linea"
- [ ] Selezionare una linea (es: "Linea 400 Udine-Grado")
- [ ] Verificare che appaiano le liste fermate (andata e ritorno)
- [ ] Verificare che i titoli siano aggiornati correttamente
- [ ] Verificare che tutte le fermate siano visualizzate
- [ ] Verificare che i numeri delle fermate siano corretti

### Test Rendering Prezzi (prezzi.html)
- [ ] Aprire prezzi.html
- [ ] Cliccare su "Seleziona una linea"
- [ ] Selezionare una linea (es: "Linea 400 Udine-Grado")
- [ ] Verificare che appaiano le tabelle prezzi (andata e ritorno)
- [ ] Verificare che i titoli siano aggiornati correttamente
- [ ] Verificare che tutte le combinazioni partenza/arrivo siano visualizzate
- [ ] Verificare che i prezzi siano formattati correttamente (es: "5.50 €")
- [ ] Verificare che i codici biglietto siano visualizzati

### Test Ordinamento per Distanza (fermate.html)
- [ ] Aprire fermate.html
- [ ] Selezionare una linea
- [ ] Cliccare sul pulsante GPS "Rileva fermata più vicina" nel modal
- [ ] Concedere il permesso di geolocalizzazione
- [ ] Verificare che le fermate siano ordinate per distanza
- [ ] Verificare che la distanza in km sia visualizzata accanto a ogni fermata
- [ ] Verificare che la distanza sia corretta

---

## ✅ Test MODULO 3: Page Search

### Test Ricerca Prezzi (prezzi.html)
- [ ] Aprire prezzi.html
- [ ] Selezionare una linea
- [ ] Verificare che appaia la barra di ricerca
- [ ] Digitare il nome di una fermata (es: "Udine")
- [ ] Verificare che le righe delle tabelle vengano filtrate
- [ ] Verificare che solo le righe contenenti "Udine" siano visibili
- [ ] Verificare che il pulsante "✕" (clear) appaia
- [ ] Cliccare sul pulsante "✕"
- [ ] Verificare che tutte le righe tornino visibili
- [ ] Verificare che la barra di ricerca si svuoti
- [ ] Testare la ricerca con un codice biglietto
- [ ] Verificare che funzioni anche con testo in minuscolo/maiuscolo

---

## ✅ Test MODULO 4: Page Lines

### Test Modal Linee Fermate (fermate.html)
- [ ] Aprire fermate.html
- [ ] Verificare che il pulsante "Seleziona una linea" sia presente
- [ ] Cliccare sul pulsante
- [ ] Verificare che il modal si apra
- [ ] Verificare che tutte le linee siano visualizzate
- [ ] Verificare che ogni linea mostri:
  - [ ] Icona bus 🚌
  - [ ] Numero linea
  - [ ] Percorso (es: "Udine-Grado")
  - [ ] Numero fermate
- [ ] Cliccare su una linea
- [ ] Verificare che il modal si chiuda
- [ ] Verificare che la linea selezionata sia visualizzata nel pulsante
- [ ] Verificare che le fermate vengano renderizzate
- [ ] Cliccare sul pulsante "×" per chiudere il modal
- [ ] Verificare che il modal si chiuda correttamente
- [ ] Cliccare fuori dal modal
- [ ] Verificare che il modal si chiuda

### Test Modal Linee Prezzi (prezzi.html)
- [ ] Aprire prezzi.html
- [ ] Verificare che il pulsante "Seleziona una linea" sia presente
- [ ] Cliccare sul pulsante
- [ ] Verificare che il modal si apra
- [ ] Verificare che tutte le linee siano visualizzate
- [ ] Cliccare su una linea
- [ ] Verificare che il modal si chiuda
- [ ] Verificare che la linea selezionata sia visualizzata nel pulsante
- [ ] Verificare che le tabelle prezzi vengano renderizzate
- [ ] Verificare che la barra di ricerca appaia

### Test Reset Percorso (Home Page)
- [ ] Aprire index.html
- [ ] Selezionare una linea
- [ ] Selezionare partenza e arrivo
- [ ] Verificare che appaia il pulsante "Resetta percorso"
- [ ] Cliccare su "Resetta percorso"
- [ ] Verificare che partenza e arrivo vengano resettati
- [ ] Verificare che la linea rimanga selezionata
- [ ] Verificare che il risultato (prezzo) venga resettato
- [ ] Verificare che il pulsante GPS si resetti

### Test Swap con Reset GPS (Home Page)
- [ ] Aprire index.html
- [ ] Selezionare una linea
- [ ] Cliccare sul pulsante GPS e localizzare la posizione
- [ ] Verificare che la partenza venga auto-assegnata
- [ ] Selezionare manualmente l'arrivo
- [ ] Cliccare sul pulsante swap (⇅)
- [ ] Verificare che partenza e arrivo si scambino
- [ ] Verificare che il pulsante GPS si resetti (non più attivo)
- [ ] Verificare che sia possibile localizzare di nuovo dopo lo swap

---

## ✅ Test Integrazione Generale

### Test Caricamento Moduli
- [ ] Aprire la console del browser (F12)
- [ ] Verificare che non ci siano errori JavaScript
- [ ] Verificare che i moduli vengano caricati:
  - [ ] `✅ Modulo ui-helpers.js caricato`
  - [ ] `✅ Modulo page-renderers.js caricato`
  - [ ] `✅ Modulo tariffario.js caricato`
  - [ ] `✅ Modulo geolocation.js caricato`

### Test Retrocompatibilità
- [ ] Verificare che tutte le funzioni globali siano disponibili:
  - [ ] `window.renderFermate`
  - [ ] `window.renderPrezzi`
  - [ ] `window.setupRicercaPrezzi`
  - [ ] `window.populateLineeTratte`
  - [ ] `window.populateLineePrezzi`
  - [ ] `window.selectLineaFermate`
  - [ ] `window.selectLineaPrezzi`
  - [ ] `window.scrollToTop`
  - [ ] `window.toggleSwapButton`

### Test Service Worker
- [ ] Verificare che i nuovi moduli siano nella cache del Service Worker
- [ ] Aprire DevTools → Application → Service Workers
- [ ] Verificare che `page-renderers.js` sia nella cache
- [ ] Verificare che `ui-helpers.js` sia nella cache

### Test Performance
- [ ] Verificare che il caricamento delle pagine sia veloce
- [ ] Verificare che non ci siano rallentamenti evidenti
- [ ] Testare su dispositivo mobile (se possibile)

---

## 🐛 Bug Noti da Verificare

### Bug Fix GPS Reset
- [ ] Dopo "Riparti da capo", verificare che sia possibile localizzare di nuovo
- [ ] Verificare che il pulsante GPS si resetti correttamente

### Bug Fix PWA Settings
- [ ] In modalità PWA, verificare che il pulsante "Impostazioni" funzioni
- [ ] Verificare che il modal impostazioni si apra correttamente

### Bug Fix Theme Default
- [ ] Verificare che il tema di default sia "system" (non "light")
- [ ] Verificare che rispetti le preferenze del sistema operativo

---

## 📝 Note Test

### Come Eseguire i Test

1. **Aprire le pagine in un browser**:
   - `index.html` - Home page
   - `fermate.html` - Pagina fermate
   - `prezzi.html` - Pagina prezzi

2. **Aprire la console del browser** (F12):
   - Verificare che non ci siano errori
   - Verificare i log di caricamento moduli

3. **Testare ogni funzionalità**:
   - Seguire la checklist sopra
   - Segnare ogni test completato con ✅

4. **Segnalare eventuali bug**:
   - Descrivere il problema
   - Fornire screenshot se possibile
   - Includere log della console

### Browser da Testare

- [ ] Chrome/Edge (Desktop)
- [ ] Firefox (Desktop)
- [ ] Safari (Desktop - se disponibile)
- [ ] Chrome Mobile (Android)
- [ ] Safari Mobile (iOS - se disponibile)

---

## ✅ Risultati Test

**Data Test**: __________  
**Tester**: __________  
**Browser**: __________  
**Versione**: __________  

### Test Completati
- [ ] MODULO 1: UI Helpers
- [ ] MODULO 2: Page Renderers
- [ ] MODULO 3: Page Search
- [ ] MODULO 4: Page Lines
- [ ] Test Integrazione

### Bug Trovati
1. __________
2. __________
3. __________

### Note
__________
__________

---

## 🎯 Obiettivo

Verificare che tutte le funzionalità modulari funzionino correttamente e che non ci siano regressioni dopo la modularizzazione.

