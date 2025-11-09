# 📋 Analisi Modularizzazione script.js

**Data Analisi:** 9 Novembre 2025  
**Versione Progetto:** 1.7.0  
**Righe totali:** ~1598 righe

## 🎯 Obiettivo

Identificare tutte le funzionalità rimanenti in `script.js` che possono essere estratte in moduli separati per migliorare la manutenibilità, testabilità e organizzazione del codice.

---

## 📊 Categorie di Funzionalità

### ✅ **Già Modularizzate** (non da toccare)

1. **Storage Helper** - ✅ Già in `js/core/storage.js`
2. **Feedback Aptico** - ✅ Già in `js/features/settings.js`
3. **Rilevamento Posizione** - ✅ Già in `js/features/geolocation.js` (wrapper rimasti per retrocompatibilità)
4. **Animazione Sfondo** - ✅ Già in `js/features/settings.js`
5. **Accessibilità (Dimensione Testo)** - ✅ Già in `js/features/settings.js`
6. **Modal Fermate/Linee** - ✅ Già in `js/components/modals.js` (wrapper rimasti per retrocompatibilità)
7. **Route Selector** - ✅ Già in `js/features/route-selector.js` (wrapper rimasti per retrocompatibilità)
8. **Prezzi** - ✅ Già in `js/features/prezzi.js` (wrapper rimasti per retrocompatibilità)
9. **Tariffario** - ✅ Già in `js/data/tariffario.js` (wrapper rimasti per retrocompatibilità)
10. **Page Renderers** - ✅ Già in `js/features/page-renderers.js` (wrapper rimasti per retrocompatibilità)
11. **UI Helpers** - ✅ Già in `js/utils/ui-helpers.js` (swap button listener rimasto)
12. **Offline Notifications** - ✅ Già in `js/utils/offline-notifications.js`
13. **Settings Modal** - ✅ Già in `js/components/modals.js`
14. **Updates** - ✅ Già in `js/features/updates.js`
15. **Hamburger Menu** - ✅ Già in `js/components/hamburger-menu.js` (09/11/2025)

---

## 🔍 **Funzionalità da Modularizzare**

### **1. PWA Install Banner** 🔴 **PRIORITÀ ALTA**
- **Righe:** ~125 (1117-1242)
- **File proposto:** `js/components/pwa-install.js`
- **Descrizione:** Gestione banner installazione PWA (Android/Chrome/iOS)
- **Funzionalità:**
  - Gestione `beforeinstallprompt` event
  - Gestione `appinstalled` event
  - Rilevamento dispositivo (iOS/Android/Safari/Chrome)
  - Gestione frequenza mostra banner (7 giorni)
  - Istruzioni installazione iOS
  - Nascondi banner quando app è in background
- **Dipendenze:** `window.Storage` (già disponibile)
- **Stato:** ✅ File già creato (`js/components/pwa-install.js`), da integrare
- **Note:** Variabile globale `deferredInstallPrompt` da gestire

---

### **2. PWA Bottom Navigation** 🔴 **PRIORITÀ ALTA**
- **Righe:** ~200 (1285-1479)
- **File proposto:** `js/components/pwa-bottom-nav.js`
- **Descrizione:** Gestione bottom navigation e brand header in modalità PWA
- **Funzionalità:**
  - Mostra/nascondi bottom nav in base a modalità PWA
  - Gestione brand header
  - Evidenzia tab attiva
  - Gestione pulsante impostazioni in bottom nav
  - Listener per cambio modalità test PWA
  - Gestione simulazione offline globale
  - Funzione `refreshPWABottomNav()` esposta globalmente
- **Dipendenze:** `window.Storage`, `window.SettingsModal`, `window.HamburgerMenu`
- **Note:** Complesso, interagisce con PWA test mode

---

### **3. Dark Mode Toggle** 🟡 **PRIORITÀ MEDIA**
- **Righe:** ~35 (175-209)
- **File proposto:** `js/utils/dark-mode-toggle.js` o integrato in `js/features/settings.js`
- **Descrizione:** Funzioni `setDarkMode()` e `toggleDark()` per gestione tema
- **Funzionalità:**
  - `setDarkMode(isDark)` - Imposta tema dark/light
  - `toggleDark()` - Toggle tema manuale
  - Integrazione con `window.Settings.setThemeMode()`
  - Fallback se Settings non disponibile
- **Dipendenze:** `window.Storage`, `window.Settings`
- **Note:** Potrebbe essere integrato in `settings.js` invece di creare nuovo modulo

---

### **4. Mobile Version Card** 🟡 **PRIORITÀ MEDIA**
- **Righe:** ~45 (1035-1079)
- **File proposto:** `js/components/mobile-version-card.js`
- **Descrizione:** Gestione card versione nel menu mobile
- **Funzionalità:**
  - Inizializza card versione
  - Aggiorna numero versione da `changelog.js`
  - Aggiorna data versione
  - Click su card apre modal aggiornamenti
  - Chiude menu mobile quando cliccato
- **Dipendenze:** `changelog.js`, `window.Updates`, `window.HamburgerMenu`
- **Note:** Solo su alcune pagine (con menu mobile)

---

### **5. Swap Button Listener** 🟢 **PRIORITÀ BASSA**
- **Righe:** ~20 (1001-1022)
- **File proposto:** Integrato in `js/utils/ui-helpers.js` o `js/features/route-selector.js`
- **Descrizione:** Event listener per pulsante swap route
- **Funzionalità:**
  - Listener per `swap-btn`
  - Chiama `window.swapRoutes()` (da RouteSelector)
- **Dipendenze:** `window.RouteSelector`
- **Note:** Piccolo, potrebbe essere integrato in RouteSelector o ui-helpers

---

### **6. PWA Scroll Progress Bar** 🟢 **PRIORITÀ BASSA**
- **Righe:** ~20 (1545-1564)
- **File proposto:** `js/components/pwa-scroll-progress.js`
- **Descrizione:** Barra di progresso scroll nel brand header PWA
- **Funzionalità:**
  - Calcola percentuale scroll
  - Aggiorna CSS custom property `--scroll-progress`
  - Listener scroll event
- **Dipendenze:** Nessuna
- **Note:** Molto semplice, potrebbe essere integrato in `pwa-bottom-nav.js`

---

### **7. PWA Update Check Button** 🟢 **PRIORITÀ BASSA**
- **Righe:** ~25 (1571-1597)
- **File proposto:** `js/components/pwa-update-button.js` o integrato in `pwa-bottom-nav.js`
- **Descrizione:** Pulsante verifica aggiornamenti nel modal Impostazioni
- **Funzionalità:**
  - Listener per `pwa-cache-reset` button
  - Chiude modal impostazioni
  - Chiama `Updates.checkForUpdates()`
- **Dipendenze:** `window.SettingsModal`, `window.Updates`
- **Note:** Piccolo, potrebbe essere integrato in `pwa-bottom-nav.js` o `updates.js`

---

### **8. Show All Updates Button** 🟢 **PRIORITÀ BASSA**
- **Righe:** ~30 (1484-1515)
- **File proposto:** `js/components/show-all-updates-button.js` o integrato in `changelog.js`
- **Descrizione:** Pulsante "Vedi tutti gli aggiornamenti" nel changelog
- **Funzionalità:**
  - Toggle mostra/nascondi aggiornamenti nascosti
  - Animazione fade-in/fade-out
  - Aggiorna testo pulsante
- **Dipendenze:** Nessuna (solo DOM)
- **Note:** Piccolo, potrebbe essere integrato in `changelog.js`

---

### **9. Restart App Button** 🟢 **PRIORITÀ BASSA**
- **Righe:** ~18 (1520-1538)
- **File proposto:** `js/utils/restart-button.js` o integrato in `updates.js`
- **Descrizione:** Pulsante "Riavvia App" nel modal aggiornamenti
- **Funzionalità:**
  - Listener per `restart-app-btn`
  - Feedback visivo (testo "Riavvio...")
  - `location.reload()` dopo 300ms
- **Dipendenze:** Nessuna
- **Note:** Molto semplice, potrebbe essere integrato in `updates.js`

---

### **10. Footer Year Update** 🟢 **PRIORITÀ BASSA**
- **Righe:** ~1 (618)
- **File proposto:** Integrato in `footer.js`
- **Descrizione:** Aggiornamento anno nel footer
- **Funzionalità:**
  - Aggiorna `footer-year` con anno corrente
- **Dipendenze:** Nessuna
- **Note:** Già gestito in `footer.js`, rimuovere da `script.js`

---

### **11. Event Listeners Vari** 🟡 **PRIORITÀ MEDIA**
- **Righe:** ~100 (sparse)
- **File proposto:** Organizzare meglio o integrare nei moduli esistenti
- **Descrizione:** Event listeners sparsi per vari elementi
- **Funzionalità:**
  - Dark mode toggle listener (377)
  - Font size listeners (380-387)
  - Cache reset listeners (390-415)
  - ESC key listener (418-437)
  - Linea button listener (439-441)
  - Partenza/Arrivo buttons listeners (444-449)
  - Location button listener (452-462)
  - Fermate location button listener (466-468)
  - Animation toggle listeners (1082-1109)
  - Reset button listeners (1246-1264)
- **Dipendenze:** Vari moduli
- **Note:** Organizzare meglio o integrare nei moduli corrispondenti

---

### **12. Wrapper Functions per Retrocompatibilità** 🟢 **PRIORITÀ BASSA**
- **Righe:** ~200 (sparse)
- **File proposto:** Mantenere o creare `js/utils/legacy-wrappers.js`
- **Descrizione:** Funzioni wrapper che delegano ai moduli per retrocompatibilità
- **Funzionalità:**
  - Wrapper geolocation (52-112)
  - Wrapper modals (243-296)
  - Wrapper route selector (304-351)
  - Wrapper page renderers (759-891)
  - Wrapper version (359-371)
- **Dipendenze:** Tutti i moduli
- **Note:** Questi wrapper possono essere mantenuti per retrocompatibilità con onclick nell'HTML

---

### **13. Initialize Modals Modules** 🟡 **PRIORITÀ MEDIA**
- **Righe:** ~110 (471-577)
- **File proposto:** `js/utils/app-init.js` (già esistente) o nuovo `js/utils/modals-init.js`
- **Descrizione:** Inizializzazione moduli modali dopo caricamento dati
- **Funzionalità:**
  - Inizializza FermateModal
  - Inizializza LineeModal
  - Inizializza SettingsModal
  - Setup callbacks e dipendenze
- **Dipendenze:** Tutti i moduli modali, RouteSelector, Tariffario
- **Note:** Potrebbe essere spostato in `app-init.js` o creato modulo separato

---

### **14. Load Data Function** 🟡 **PRIORITÀ MEDIA**
- **Righe:** ~125 (623-747)
- **File proposto:** `js/utils/app-init.js` (già esistente) o nuovo `js/utils/data-loader.js`
- **Descrizione:** Caricamento dati e ripristino stato iniziale
- **Funzionalità:**
  - Carica tariffario usando modulo Tariffario
  - Ripristina selezioni route (RouteSelector.restore())
  - Ripristina tema/dimensione testo
  - Fallback se moduli non disponibili
- **Dipendenze:** `window.Tariffario`, `window.RouteSelector`, `window.Settings`
- **Note:** Potrebbe essere spostato in `app-init.js`

---

### **15. Search Functionality (tratte.html)** 🟢 **PRIORITÀ BASSA**
- **Righe:** ~35 (955-990)
- **File proposto:** `js/features/page-renderers.js` (già esistente)
- **Descrizione:** Funzionalità ricerca per tratte.html
- **Funzionalità:**
  - Search input listener
  - Filtra fermate in base a search term
  - Clear button listener
- **Dipendenze:** Nessuna (solo DOM)
- **Note:** Sembra codice obsoleto o non utilizzato (tratte.html non esiste)

---

## 📈 **Priorità e Ordine di Modularizzazione**

### **Fase 1: Componenti PWA (Priorità Alta)**
1. ✅ **PWA Install Banner** - File già creato, da integrare
2. **PWA Bottom Navigation** - Complesso, importante per UX PWA

### **Fase 2: Utilities e Helpers (Priorità Media)**
3. **Dark Mode Toggle** - Integrare in `settings.js` o nuovo modulo
4. **Mobile Version Card** - Componente isolato
5. **Initialize Modals Modules** - Spostare in `app-init.js`
6. **Load Data Function** - Spostare in `app-init.js`

### **Fase 3: Piccoli Componenti (Priorità Bassa)**
7. **PWA Scroll Progress Bar** - Integrare in `pwa-bottom-nav.js`
8. **PWA Update Check Button** - Integrare in `pwa-bottom-nav.js` o `updates.js`
9. **Show All Updates Button** - Integrare in `changelog.js`
10. **Restart App Button** - Integrare in `updates.js`
11. **Swap Button Listener** - Integrare in `route-selector.js` o `ui-helpers.js`
12. **Footer Year Update** - Rimuovere (già in `footer.js`)

### **Fase 4: Pulizia e Organizzazione**
13. **Event Listeners Vari** - Organizzare meglio o integrare nei moduli
14. **Wrapper Functions** - Mantenere per retrocompatibilità o creare `legacy-wrappers.js`
15. **Search Functionality** - Verificare se utilizzato, rimuovere se obsoleto

---

## 📊 **Statistiche Stimate**

- **Righe totali script.js:** ~1598
- **Righe da modularizzare:** ~800-900 (stima)
- **Righe wrapper/retrocompatibilità:** ~200 (da mantenere o organizzare meglio)
- **Righe da rimuovere (duplicate/obsolete):** ~50-100

**Risultato atteso:** `script.js` ridotto a ~500-600 righe (solo orchestrazione e wrapper)

---

## 🎯 **Raccomandazioni**

1. **Iniziare con PWA Install Banner** - File già creato, facile da integrare
2. **PWA Bottom Navigation** - Complesso ma ben isolato, alta priorità
3. **Integrare piccoli componenti** nei moduli esistenti invece di crearne di nuovi
4. **Spostare inizializzazione** in `app-init.js` per centralizzare
5. **Mantenere wrapper** per retrocompatibilità con onclick nell'HTML
6. **Verificare codice obsoleto** (es. search tratte.html) e rimuoverlo

---

## 📝 **Note Finali**

- Molte funzionalità sono già delegate ai moduli, ma il codice wrapper rimane in `script.js`
- Alcuni event listeners potrebbero essere spostati nei moduli corrispondenti
- `script.js` dovrebbe diventare principalmente un file di orchestrazione e retrocompatibilità
- Considerare di creare `js/utils/legacy-wrappers.js` per centralizzare i wrapper

