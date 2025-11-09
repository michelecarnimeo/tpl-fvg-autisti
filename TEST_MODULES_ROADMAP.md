# 🧪 Roadmap Moduli di Test - TPL FVG Autisti

Documento di pianificazione per l'espansione dei test automatici dell'applicazione.

> **🔒 Nota Sicurezza:** Per la roadmap di sicurezza (rimozione innerHTML/XSS), vedi [SECURITY_ROADMAP.md](./SECURITY_ROADMAP.md)

---

## 📊 Stato Attuale

### ✅ Test già implementati e modularizzati

1. **📦 Database** - Caricamento e validazione database.json ✅ `test-database.js`
2. **💾 LocalStorage** - Scrittura, lettura, cancellazione ✅ `test-storage.js` (24 test)
3. **🌙 Dark Mode** - Toggle e persistenza tema ✅ `test-darkmode.js`
4. **💰 Prezzi** - Suite completa (29 test) ✅ `test-prezzi.js`
5. **⚙️ Service Worker** - Registrazione e cache PWA ✅ `test-sw.js`
6. **🎨 UI Components** - Popolamento select e funzioni DOM ✅ `test-ui.js`
7. **📱 Manifest PWA** - Validazione manifest.json e icone ✅ `test-manifest.js`
8. **⚡ Performance** - Tempi caricamento e calcolo ✅ `test-performance.js`
9. **⚙️ Impostazioni** - Suite completa (19 test) ✅ `test-settings.js` **GIÀ IMPLEMENTATO**
10. **🛣️ Route Selector** - Selezione linee e tratte ✅ `test-route-selector.js` **GIÀ IMPLEMENTATO**
11. **📍 Geolocalizzazione** - Permessi e mappa Leaflet ⚠️ **ANCORA INLINE** (da modularizzare)

---

## 🆕 Nuovi Moduli di Test Suggeriti

### 🔴 Alta Priorità (Fondamentali)

#### 1. ⚙️ Test Impostazioni (Settings) ✅ **GIÀ IMPLEMENTATO**

**File:** `js/tests/test-settings.js`  
**Componente testato:** `js/features/settings.js`  
**Stato:** ✅ **COMPLETO** (19 test, 868 righe)

**Test implementati:**

- ✅ Salvataggio/caricamento di ogni impostazione in localStorage
- ✅ Applicazione corretta delle classi CSS
  - `font-size-normal`, `font-size-large`, `font-size-xlarge`
  - `high-contrast`, `touch-friendly`, `reduce-motion`
  - `interface-scale-75`, `interface-scale-85`, `interface-scale-100`, `interface-scale-115`, `interface-scale-125`
- ✅ Toggle on/off per ogni impostazione
- ✅ Cambio tema (system/light/dark)
- ✅ Feedback aptico (se supportato)
- ✅ Interface scale (75%-125%)
- ✅ Extra spacing e compact layout
- ✅ Animazioni toggle
- ✅ Keep screen on (Wake Lock API)
- ✅ Persistenza localStorage

**Valore:** Garantisce che tutte le 10+ preferenze utente funzionino e persistano correttamente.

**Test implementati:** 19 test

---

#### 2. 🔄 Test Aggiornamenti (Updates)

**File:** `js/tests/test-updates.js`  
**Componente testato:** `js/features/updates.js`

**Cosa testare:**

- ✅ Confronto versioni semantiche
  - `compareVersions('1.6.0', '1.5.9')` → 1
  - `compareVersions('1.5.0', '1.6.0')` → -1
  - `compareVersions('1.5.5', '1.5.5')` → 0
- ✅ Verifica aggiornamenti (mock fetch di `version.json`)
- ✅ Gestione errori rete (fetch fallito)
- ✅ Lettura versione da `changelog.js`
  - `getChangelogVersion()` ritorna oggetto corretto
  - `getChangelogVersionString()` ritorna stringa versione
- ✅ Reset cache e localStorage
- ✅ Riavvio app (redirect a benvenuto.html)

**Valore:** Evita bug nel meccanismo critico di auto-aggiornamento.

**Test stimati:** ~10-12

---

#### 3. 📱 Test PWA Bottom Navigation

**File:** `js/tests/test-pwa-nav.js`  
**Componente testato:** Sezione PWA in `script.js`

**Cosa testare:**

- ✅ Rilevamento modalità standalone
  - `window.matchMedia('(display-mode: standalone)')`
  - `window.navigator.standalone` (iOS)
- ✅ Show/hide bottom nav in base a standalone
- ✅ Show/hide brand header in base a standalone
- ✅ Classe `pwa-mode` applicata a `<body>`
- ✅ Evidenziazione tab attiva in base alla pagina corrente
  - `index.html` → tab Home attiva
  - `fermate.html` → tab Fermate attiva
  - `prezzi.html` → tab Prezzi attiva
- ✅ Pulsante impostazioni nella bottom nav funzionante
- ✅ Simulazione PWA test mode (localStorage `tpl.pwaTestMode`)

**Valore:** Componente visibile solo in PWA installata; bug difficili da scoprire in sviluppo.

**Test stimati:** ~8-10

---

#### 4. 🌐 Test Connettività Offline/Online

**File:** `js/tests/test-connectivity.js`  
**Componente testato:** Sezione connettività in `script.js`

**Cosa testare:**

- ✅ Rilevamento stato `navigator.onLine`
- ✅ Banner offline appare quando `navigator.onLine === false`
- ✅ Banner scompare quando torna online
- ✅ Eventi `online` e `offline` gestiti correttamente
- ✅ Simulazione offline mode (localStorage `tpl.offlineTestMode`)
- ✅ Dispatch eventi custom `offlineTestModeChanged`
- ✅ Service Worker cache fallback (file disponibili offline)

**Valore:** PWA deve funzionare offline; test garantisce robustezza.

**Test stimati:** ~8-10

---

### 🟡 Media Priorità (Migliora Copertura)

#### 5. 📝 Test Modal Impostazioni

**File:** `js/tests/test-settings-modal.js`  
**Componente testato:** `js/components/modals.js` (SettingsModal)

**Cosa testare:**

- ✅ Apertura/chiusura modal
  - Click su `#open-settings` (mobile)
  - Click su `#desktop-settings-btn` (desktop)
  - Click su `#settings-modal-close`
  - Click fuori dal modal
  - Tasto ESC
- ✅ Switch tra tab (Aspetto, Accessibilità, Info)
  - Tab attiva ha classe `active`
  - Contenuto corrispondente visibile
- ✅ Sincronizzazione stato UI con localStorage all'apertura
  - Tutti i toggle riflettono stato salvato
  - Pulsanti font size mostrano selezione corretta
  - Radio button tema selezionato correttamente
- ✅ Event listeners per tutti i toggle e pulsanti
- ✅ Callback chiamati correttamente

**Valore:** Modal usato frequentemente; errori impattano UX.

**Test stimati:** ~12-15

---

#### 6. 📋 Test Changelog

**File:** `js/tests/test-changelog.js`  
**Componente testato:** `changelog.js`

**Cosa testare:**

- ✅ Lettura versione corrente
  - `getChangelogVersion()` ritorna oggetto `{version, date, time}`
  - `getChangelogVersionString()` ritorna stringa versione
- ✅ Array `changelogData` ben formato
  - Ogni voce ha `version`, `date`, `title`, `changes`
  - Versioni ordinate dal più recente al più vecchio
- ✅ Rendering HTML changelog
  - `renderChangelog('changelog-container')` genera HTML corretto
  - Versioni `hidden: true` non visualizzate (opzionale)
- ✅ Aggiornamento automatico versione UI
  - `updateAppVersion()` aggiorna `.info-version` e `.info-date`
- ✅ Filtraggio versioni nascoste

**Valore:** Garantisce coerenza versione su tutta l'app (5 pagine + footer).

**Test stimati:** ~8-10

---

#### 7. 🔗 Test Modal Cache/Aggiornamenti

**File:** `js/tests/test-cache-modal.js`  
**Componente testato:** Modal cache in `js/features/updates.js`

**Cosa testare:**

- ✅ Apertura modal con `resetCache()`
- ✅ Stati modal:
  - "Verifica in corso..." (iniziale)
  - "Aggiornamento disponibile!" (nuova versione)
  - "Stai usando l'ultima versione!" (nessun aggiornamento)
  - "Errore di connessione" (fetch fallito)
- ✅ Pulsanti visibili/nascosti in base allo stato
  - "Chiudi" sempre visibile
  - "Riavvia e Aggiorna" solo se aggiornamento disponibile
- ✅ Funzioni callback:
  - `cancelResetCache()` chiude modal
  - `confirmResetCache()` resetta cache e riavvia
- ✅ Chiusura con ESC o click fuori

**Valore:** UX fondamentale per aggiornamenti app.

**Test stimati:** ~10-12

---

### 🟢 Bassa Priorità (Nice-to-Have)

#### 8. 🦶 Test Footer Dinamico

**File:** `js/tests/test-footer.js`  
**Componente testato:** `footer.js`

**Cosa testare:**

- ✅ Generazione HTML footer
  - `generateFooterHTML('1.6.0')` ritorna HTML valido
  - Anno dinamico corretto
  - Link Telegram presenti
  - Link test.html presente con versione
- ✅ Caricamento versione
  - Prima prova da `changelogData` (se disponibile)
  - Poi fallback a `version.json`
  - Infine fallback costante
- ✅ Aggiornamento versione dinamico
  - `updateFooterVersion('1.7.0')` aggiorna link

**Valore:** Footer visibile su ogni pagina; bug molto evidenti (già testato visivamente).

**Test stimati:** ~6-8

---

#### 9. 🎬 Test Animazioni CSS

**File:** `js/tests/test-animations.js`  
**Componente testato:** `js/features/settings.js` (toggleAnimation) + `css/animations.css`

**Cosa testare:**

- ✅ Toggle animazione sfondo
  - localStorage `tpl.animation` = 'true'/'false'
  - Classe `.animated-background` applicata/rimossa su `<body>`
- ✅ Rispetto `prefers-reduced-motion`
  - Se utente ha `prefers-reduced-motion: reduce`, animazioni disabilitate
- ✅ Presenza keyframes CSS
  - `@keyframes fadeIn`
  - `@keyframes fadeInUp`
  - `@keyframes rotateIn`
  - `@keyframes pulse`

**Valore:** Accessibilità (reduced motion) e UX.

**Test stimati:** ~6-8

---

#### 10. 🧭 Test Routing/Navigazione

**File:** `js/tests/test-routing.js`  
**Componente testato:** Link e navigazione tra pagine

**Cosa testare:**

- ✅ Link funzionanti tra pagine
  - index.html → fermate.html
  - index.html → prezzi.html
  - Tutte le pagine → test.html
  - Tutte le pagine → benvenuto.html
- ✅ Evidenziazione pagina attiva nella bottom nav
  - Classe `active` applicata correttamente
- ✅ Back button browser funziona
- ✅ Deep linking (se PWA)

**Valore:** Navigazione è core UX; bug bloccano l'uso dell'app (coperto da test manuali).

**Test stimati:** ~8-10

---

## 🧪 Test Aggiuntivi Proposti per Moduli Esistenti

### 💰 Test Aggiuntivi per `prezzi.js`

**File:** `js/tests/test-prezzi.js`  
**Stato attuale:** 29 test implementati  
**Proposta:** 16 test aggiuntivi per migliorare robustezza

#### ✅ Test già presenti (29 test):

1. calculatePrice() base
2. getTicketCode() base
3. formatPrice() base
4. isValidSelection() base
5. isRouteAvailable() base
6. Stessa fermata
7. Indici fuori range
8. Fallback tariffarioAggiornato
9. Tariffario vuoto/null
10. Indici negativi
11. Indici come stringhe
12. Prezzo zero
13. Matrici mancanti
14. Più linee
15. Performance
    16-29. Altri test implementati

#### 📋 Test Aggiuntivi Utili (Proposta)

##### **Test Robusteza (Dati Malformati)**

- **Test 30: Prezzo null nella matrice** - Verifica gestione `prezzi[i][j] = null`
- **Test 31: Prezzo undefined nella matrice** - Verifica gestione `prezzi[i][j] = undefined`
- **Test 32: Prezzo come stringa ("3.50")** - Verifica rifiuto di stringhe
- **Test 33: Prezzo NaN nella matrice** - Verifica gestione NaN
- **Test 34: Prezzo Infinity nella matrice** - Verifica gestione Infinity
- **Test 35: Prezzo negativo** - Verifica gestione prezzi negativi (-1.50)
- **Test 36: Linea non esistente** - Indice linea fuori range (999)
- **Test 37: fermate non array** - Linea con `fermate` non array

##### **Test Struttura Dati**

- **Test 38: Struttura risultato corretta** - Verifica che ritorni sempre `{prezzo, codice, valido}`
- **Test 39: Codice con spazi** - Verifica gestione codici con spazi ("E 1")
- **Test 40: Codice null vs vuoto** - Verifica differenza tra `""` e `null`

##### **Test Valori Estremi**

- **Test 41: Prezzo molto grande** - Test con prezzo 999999.99
- **Test 42: Prezzo molto piccolo** - Test con prezzo 0.01
- **Test 43: Prezzo con molti decimali** - Test con prezzo 3.9999999

##### **Test Consistenza**

- **Test 44: Prezzo null ma codice presente** - Verifica che risultato sia valido se c'è codice
- **Test 45: Simmetria andata/ritorno** - Verifica che A→B = B→A (se applicabile)

#### 🎯 Priorità Raccomandata

##### **Alta Priorità** (Test Critici):

- ✅ **Test 30**: Prezzo null nella matrice (comune in dati reali)
- ✅ **Test 31**: Prezzo undefined (può accadere)
- ✅ **Test 36**: Linea non esistente (importante per robustezza)
- ✅ **Test 38**: Struttura risultato (verifica API corretta)

##### **Media Priorità** (Edge Cases):

- ✅ **Test 32**: Prezzo come stringa (può capitare da JSON malformato)
- ✅ **Test 33**: Prezzo NaN (gestione errori)
- ✅ **Test 37**: fermate non array (robustezza)

##### **Bassa Priorità** (Nice to Have):

- Test 34, 35, 39-45 (casi molto rari)

#### 💡 Raccomandazione

Aggiungere almeno i **4 test ad alta priorità** per garantire robustezza del modulo in scenari reali.

**Valore:** Migliora la robustezza del modulo `prezzi.js` gestendo edge cases e dati malformati che potrebbero verificarsi in produzione.

**Test stimati:** 16 test aggiuntivi (4 alta priorità, 3 media priorità, 9 bassa priorità)

---

## 📈 Piano di Implementazione

### Fase 1: Modularizzazione Test Esistenti ✅ **COMPLETATO**

- [x] Crea file per categoria esistenti
- [x] Includi moduli in test.html
- [x] Rimuovi funzioni inline duplicate
- [x] Verifica funzionamento
- [x] Test Settings implementato (19 test)
- [x] Test Route Selector implementato (10 test)
- [x] Commit e push

### Fase 2: Test Alta Priorità 🔴

**Ordine suggerito:**

1. ~~Test Impostazioni~~ ✅ **COMPLETATO** (già implementato)
2. Test Aggiornamenti (critico per auto-update) ⏳ **DA IMPLEMENTARE**
3. Test PWA Nav (visibile solo in PWA) ⏳ **DA IMPLEMENTARE**
4. Test Connettività (offline-first) ⏳ **DA IMPLEMENTARE**

### Fase 3: Test Media Priorità 🟡

5. Test Modal Impostazioni
6. Test Changelog
7. Test Modal Cache

### Fase 4: Test Bassa Priorità 🟢

8. Test Footer
9. Test Animazioni
10. Test Routing

---

## 📝 Template per Nuovo Modulo di Test

```javascript
/**
 * js/tests/test-<nome>.js
 *
 * Suite di test per <componente>
 * <numero> test che coprono <funzionalità>
 *
 * API Pubblica: window.<Nome>Tests
 */

(function(){
  'use strict';

  // Test 1: <Descrizione>
  function test<Nome>Feature() {
    const output = 'output-<nome>';
    const outEl = document.getElementById(output);
    if (outEl) outEl.innerHTML = '';
    log(output, '=== Inizio Test <Nome> ===', 'info');

    try {
      // Logica test
      log(output, 'Test <descrizione>...', 'info');

      // Asserzioni
      if (/* condizione */) {
        updateTestStatus('test-<nome>-<id>', 'pass');
        log(output, '✓ Test passato', 'success');
      } else {
        throw new Error('Test fallito');
      }

    } catch (error) {
      updateTestStatus('test-<nome>-<id>', 'fail');
      log(output, `✗ Errore: ${error.message}`, 'error');
    }
  }

  // API globale
  window.test<Nome> = test<Nome>Feature;
  console.log('✅ Modulo test-<nome>.js caricato');
})();
```

---

## 🎯 Metriche di Successo

### Copertura Test Target

- **Attuale:** ~11 categorie test (database, storage, darkmode, UI, PWA, performance, prezzi, settings, route-selector, manifest, accordion)
- **Target Fase 2:** +3 categorie (updates, pwa-nav, connectivity) → **14 categorie**
- **Target Fase 3:** +3 categorie (modals, changelog, cache) → **17 categorie**
- **Target Fase 4:** +3 categorie (footer, animations, routing) → **20 categorie**

### Test Count Target

- **Attuale:** ~100-110 test (29 prezzi, 24 storage, 19 settings, 10 route-selector, altri)
- **Target Fase 2:** +30-40 test → **~140 test**
- **Target Fase 3:** +30-40 test → **~180 test**
- **Target Finale:** +20-30 test → **~200 test**

---

## 📚 Risorse

- **Test Utils:** `js/tests/test-utils.js` (logging, status, stats, copy-log)
- **Esempi Moduli Completi:**
  - `js/tests/test-prezzi.js` (29 test, 1028 righe)
  - `js/tests/test-settings.js` (19 test, 868 righe)
  - `js/tests/test-route-selector.js` (10 test, 505 righe)
- **TestUtils API:** `window.TestUtils.log()`, `window.TestUtils.updateTestStatus()`
- **Documentazione:** `JS_ARCHITECTURE.md`, `CSS_ARCHITECTURE.md`, `ANALISI_TEST_HTML.md`

---

## 🔄 Aggiornamenti

**Ultima modifica:** 9 Novembre 2025  
**Versione app:** 1.6.9  
**Stato:** Fase 1 completata ✅, Fase 2 in corso (test alta priorità)

---

## ✅ Checklist Implementazione Nuovo Test

- [ ] Creare file `js/tests/test-<nome>.js`
- [ ] Implementare funzione test con try/catch
- [ ] Usare `log()` e `updateTestStatus()` da TestUtils
- [ ] Esporre API pubblica `window.test<Nome>`
- [ ] Aggiungere `<script>` in `test.html`
- [ ] Creare sezione HTML in `test.html` con:
  - ID sezione: `section-<nome>`
  - Pulsante: `onclick="test<Nome>()"`
  - Output: `id="output-<nome>"`
  - Test items: `id="test-<nome>-<id>"`
- [ ] Aggiungere chiamata in `runAllTests()`
- [ ] Testare manualmente cliccando pulsante
- [ ] Verificare assenza errori in console
- [ ] Commit con messaggio descrittivo

---

_Fine documento roadmap test modules_
