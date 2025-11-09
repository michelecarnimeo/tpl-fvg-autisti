# TPL FVG Autisti

> **Tutti i diritti riservati.**  
> Questo software è di proprietà esclusiva dell'autore.  
> È vietata la copia, la distribuzione o la modifica senza autorizzazione scritta.  
> Per richieste di utilizzo o licenza, contattare l'autore.

Applicazione web **Progressive Web App (PWA)** per la consultazione e gestione delle tariffe dei biglietti autobus, pensata per l'uso interno da parte degli autisti TPL FVG.

**Versione attuale:** 1.6.9+ (Novembre 2025)

---

## ✨ Funzionalità principali

### 🎯 Core

- **Selezione linea, fermata di partenza e arrivo** - Interfaccia intuitiva con modali
- **Calcolo immediato del prezzo** - Calcolo in tempo reale del biglietto per la tratta selezionata
- **Visualizzazione tabelle prezzi complete** - Pagina dedicata con tabelle andata/ritorno
- **Visualizzazione fermate per linea** - Lista fermate ordinabile per distanza

### 📍 Geolocalizzazione

- **Auto-assegnazione fermata più vicina** - Selezione automatica della partenza basata sulla posizione GPS
- **Ordinamento fermate per distanza** - Le fermate vengono ordinate dalla più vicina alla più lontana
- **Mappa interattiva Leaflet** - Visualizzazione posizione su mappa (pagina test)
- **Calcolo distanze** - Formula Haversine per calcolo preciso distanze

### 🎨 Personalizzazione e Accessibilità

- **Modalità scura/chiara/sistema** - Tema automatico basato sulle preferenze del sistema
- **Impostazioni avanzate** - Pannello completo di personalizzazione:
  - Dimensione font (normale, grande, extra-grande)
  - Spaziatura extra e layout compatto
  - Contrasto alto
  - Touch-friendly (pulsanti più grandi)
  - Riduzione animazioni (preferenza accessibilità)
  - Scala interfaccia (75% - 125%)
  - Filtro blu per daltonismo
- **Feedback aptico** - Vibrazione su dispositivi supportati

### 📱 Progressive Web App (PWA)

- **Installabile su dispositivi** - Può essere installata come app nativa
- **Funzionalità offline** - Service Worker per utilizzo senza connessione
- **Cache intelligente** - Aggiornamenti automatici e gestione cache
- **Notifiche aggiornamenti** - Avviso quando sono disponibili nuove versioni

### 🧪 Suite di Test Completa

- **100+ test automatici** - Copertura completa delle funzionalità:
  - Test database e tariffario
  - Test storage e localStorage
  - Test calcolo prezzi (29 test)
  - Test Service Worker e PWA
  - Test UI components
  - Test performance
  - Test settings e accessibilità
  - Test geolocalizzazione
  - Test route selector
- **Pagina test dedicata** - Interfaccia completa per esecuzione e visualizzazione test

### 🏗️ Architettura Modulare

- **JavaScript modulare** - Codice organizzato in moduli riutilizzabili:
  - `js/core/` - Core functionality (storage)
  - `js/features/` - Features principali (prezzi, geolocation, settings, route-selector, page-renderers)
  - `js/components/` - Componenti UI (modals, footer, changelog)
  - `js/data/` - Gestione dati (tariffario)
  - `js/utils/` - Utility functions
  - `js/tests/` - Suite test modulare
- **CSS modulare** - Stili organizzati per componenti e pagine
- **Manutenibilità** - Codice pulito, documentato e testabile

---

## 🚀 Come usare l'applicazione

### Installazione Locale

1. **Scarica o clona il progetto**

   ```bash
   git clone <repository-url>
   cd tpl-fvg-autisti-4
   ```

2. **Avvia un server locale**

   - **Python**: `python -m http.server 8000`
   - **Node.js**: `npx http-server -p 8000`
   - **VSCode**: Usa l'estensione "Live Server"

3. **Apri nel browser**
   - Naviga a `http://localhost:8000`
   - Apri `index.html` tramite il server locale

### Utilizzo Base

1. **Seleziona la linea** - Clicca sul pulsante "Seleziona una linea"
2. **Seleziona partenza e arrivo** - Scegli le fermate dalla lista
3. **Visualizza il prezzo** - Il prezzo viene calcolato automaticamente
4. **Scambia partenza/arrivo** - Usa il pulsante di scambio per invertire

### Funzionalità Avanzate

- **Geolocalizzazione**: Clicca sul pulsante GPS per auto-selezionare la fermata più vicina
- **Tabelle prezzi**: Vai alla pagina "Prezzi" per vedere tutte le tariffe
- **Impostazioni**: Apri il menu impostazioni per personalizzare l'interfaccia
- **Test**: Accedi alla pagina test per verificare tutte le funzionalità

### Installazione come PWA

1. Apri l'applicazione nel browser
2. Clicca sull'icona "Installa" nella barra degli indirizzi (o nel menu)
3. Segui le istruzioni per installare l'app sul dispositivo
4. L'app funzionerà anche offline dopo la prima installazione

---

## 📋 Note tecniche

### Dati e Storage

- **Tariffario: `tariffario.json`** - File JSON contenente linee, fermate e prezzi
- **LocalStorage** - Preferenze utente e stato applicazione salvati localmente
- **Service Worker** - Cache dei file per funzionamento offline
- **Aggiornamenti automatici** - Verifica periodica di nuove versioni

### Tecnologie

- **HTML5** - Struttura semantica
- **CSS3** - Stili modulari con variabili CSS e design system
- **JavaScript ES6+** - Moduli, async/await, classi
- **Service Worker API** - PWA e funzionalità offline
- **Geolocation API** - Posizionamento GPS
- **LocalStorage API** - Persistenza dati locale
- **Leaflet.js** - Mappe interattive (pagina test)

### Architettura

- **Modulare** - Codice organizzato in moduli indipendenti
- **Testabile** - Suite test completa per ogni modulo
- **Documentata** - Documentazione tecnica completa (JS_ARCHITECTURE.md, CSS_ARCHITECTURE.md)
- **Manutenibile** - Pattern consistenti e codice pulito

### Browser Supportati

- Chrome/Edge (consigliato)
- Firefox
- Safari
- Opera

**Nota**: Alcune funzionalità (PWA, Service Worker) richiedono HTTPS in produzione o localhost per sviluppo.

---

## 📚 Documentazione

Il progetto include documentazione tecnica completa:

- **`JS_ARCHITECTURE.md`** - Architettura JavaScript e moduli
- **`CSS_ARCHITECTURE.md`** - Architettura CSS e design system
- **`TEST_MODULES_ROADMAP.md`** - Roadmap e stato dei test
- **`ANALISI_TEST_HTML.md`** - Analisi modularizzazione test
- **`GUIDA_TEST_MANUALI.md`** - Guida test manuali
- **`README_GITHUB_PAGES.md`** - Guida deploy su GitHub Pages

---

## 🎯 Per TPL FVG

Questa applicazione è pensata per facilitare il lavoro degli autisti e del personale interno, offrendo uno strumento:

- ✅ **Semplice** - Interfaccia intuitiva e chiara
- ✅ **Veloce** - Calcolo istantaneo e navigazione fluida
- ✅ **Affidabile** - Funziona anche offline
- ✅ **Personalizzabile** - Impostazioni per ogni esigenza
- ✅ **Accessibile** - Supporto per diverse necessità di accessibilità
- ✅ **Testato** - Suite test completa per garantire qualità

### Integrazioni Future

Per eventuali integrazioni con sistemi aziendali o per la persistenza delle modifiche, è possibile collegare facilmente la logica a un backend o database. L'architettura modulare facilita l'integrazione di nuove funzionalità.

---

## 📝 Changelog

Per la lista completa delle modifiche e aggiornamenti, consulta `changelog.js` o apri l'applicazione e vai alla sezione "Info" nelle impostazioni.

**Ultime versioni principali:**

- **v1.6.9** - Modularizzazione completa moduli 1-5, refactoring strutturale
- **v1.6.8** - Fix bug tema default, PWA, GPS
- **v1.6.7** - Modularizzazione route-selector, geolocation, page-renderers
- **v1.6.6** - Suite test settings completa (19 test)

---

**Autore:** Michele Carnimeo  
**Progetto dimostrativo - Settembre 2025**  
**Versione:** 1.6.9+ (Novembre 2025)
