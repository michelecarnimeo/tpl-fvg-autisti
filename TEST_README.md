# 🧪 TPL FVG - Test Suite

## Descrizione
Suite di test completa per verificare tutte le funzionalità dell'applicazione TPL FVG (Trasporto Pubblico Locale Friuli-Venezia Giulia).

## Accesso
Apri il file `test.html` nel browser o naviga dalla navbar dell'applicazione cliccando su "🧪 Test".

## Funzionalità di Test

### 📦 Test Caricamento Database
- **Caricamento database.json**: Verifica che il file database.json venga caricato correttamente
- **Validazione struttura dati**: Controlla che i dati abbiano la struttura corretta (array, oggetti linea, fermate, prezzi)
- **Verifica linee disponibili**: Conferma che ci siano linee disponibili con fermate e tariffe

### 💾 Test LocalStorage
- **Scrittura localStorage**: Testa la capacità di scrivere dati nel localStorage
- **Lettura localStorage**: Verifica la lettura corretta dei dati salvati
- **Cancellazione localStorage**: Controlla la rimozione dei dati

### 🌙 Test Dark Mode
- **Toggle dark mode**: Verifica il cambio tra modalità chiara e scura
- **Persistenza preferenza**: Controlla che la preferenza venga salvata e ripristinata

### 💰 Test Calcolo Prezzi
- **Calcolo prezzo semplice**: Verifica il calcolo del prezzo tra due fermate
- **Gestione tratte non valide**: Controlla la gestione di tratte non valide (stessa fermata)
- **Recupero codice biglietto**: Verifica il recupero del codice biglietto quando disponibile

### ⚙️ Test Service Worker (PWA)
- **Registrazione Service Worker**: Verifica che il service worker sia registrato
- **Verifica cache**: Controlla che le risorse siano cached per funzionamento offline

### 🎨 Test Componenti UI
- **Popolamento select**: Verifica che le dropdown vengano popolate correttamente
- **Funzione swap percorso**: Testa la funzionalità di inversione partenza/arrivo
- **Aggiornamento riepilogo**: Controlla l'aggiornamento del riepilogo selezioni

### 📱 Test Manifest PWA
- **Caricamento manifest.json**: Verifica il caricamento del manifest
- **Validazione icone**: Controlla che le icone PWA siano definite correttamente

### ⚡ Test Performance
- **Tempo caricamento dati**: Misura il tempo di caricamento del database
- **Tempo calcolo prezzo**: Misura il tempo necessario per calcolare un prezzo

## Come Usare

### Test Singoli
1. Clicca sul pulsante "🧪 Test [Nome Categoria]" per eseguire i test di una specifica categoria
2. Visualizza i risultati nel pannello di output sotto ogni categoria
3. I test mostrano:
   - ✅ **Passato**: Test superato con successo
   - ❌ **Fallito**: Test non superato, controlla i dettagli nell'output
   - ⏳ **In attesa**: Test non ancora eseguito

### Esegui Tutti i Test
1. Clicca sul pulsante verde "▶️ Esegui tutti i test" in alto
2. Tutti i test verranno eseguiti in sequenza
3. Le statistiche in alto mostrano:
   - **Totali**: Numero totale di test
   - **Passati**: Test superati (verde)
   - **Falliti**: Test falliti (rosso)
   - **In attesa**: Test non ancora eseguiti (giallo)

## Output dei Test
Ogni test produce un output dettagliato che include:
- **[Timestamp]**: Momento di esecuzione
- **Info** (blu): Informazioni generali
- **Success** (verde): Operazioni riuscite
- **Error** (rosso): Errori riscontrati
- **Warning** (giallo): Avvisi

## Interpretazione Risultati

### Tutti i Test Passati ✅
L'applicazione funziona correttamente! Tutte le funzionalità sono operative.

### Alcuni Test Falliti ❌
- **Service Worker**: Normale se esegui l'app senza server HTTPS
- **Cache**: Normale se il service worker non è attivo
- **Performance**: Potrebbe variare in base alla connessione

### Debugging
1. Apri la console del browser (F12)
2. Esegui i test
3. Controlla eventuali errori nella console
4. Leggi i dettagli nell'output di ciascun test

## Test Automatici vs Manuali

### Automatici
Tutti i test in questa suite sono **automatici** e non richiedono interazione manuale.

### Manuali (da fare separatamente)
- Test di navigazione tra pagine
- Test di responsività su dispositivi mobili
- Test di installazione PWA
- Test funzionamento offline completo

## Requisiti
- Browser moderno (Chrome, Firefox, Safari, Edge)
- JavaScript abilitato
- Per test Service Worker: server HTTPS o localhost

## Note Tecniche
- I test sono non invasivi e non modificano i dati dell'applicazione
- Il test LocalStorage crea e cancella chiavi temporanee (`tpl.test`)
- I test di performance eseguono 1000 iterazioni per maggiore precisione
- La suite è compatibile con dark mode

## Sviluppo Futuro
- [ ] Test di integrazione con API esterne
- [ ] Test di stress con grandi quantità di dati
- [ ] Test di compatibilità cross-browser automatizzati
- [ ] Test di accessibilità (WCAG)
- [ ] Report esportabili in PDF/JSON

## Supporto
Per problemi o suggerimenti sulla suite di test, contatta il team di sviluppo.

---

**Ultima modifica**: Ottobre 2025  
**Versione**: 1.0.0
