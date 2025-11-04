# 🧪 Roadmap Moduli di Test - TPL FVG Autisti

Documento di pianificazione per l'espansione dei test automatici dell'applicazione.

---

## 📊 Stato Attuale

### ✅ Test già implementati (da modularizzare)
1. **📦 Database** - Caricamento e validazione database.json
2. **💾 LocalStorage** - Scrittura, lettura, cancellazione
3. **🌙 Dark Mode** - Toggle e persistenza tema
4. **💰 Prezzi** - Suite completa (26 test) ✅ **GIÀ MODULARIZZATO**
5. **⚙️ Service Worker** - Registrazione e cache PWA
6. **🎨 UI Components** - Popolamento select e funzioni DOM
7. **📱 Manifest PWA** - Validazione manifest.json e icone
8. **⚡ Performance** - Tempi caricamento e calcolo
9. **📍 Geolocalizzazione** - Permessi e mappa Leaflet (complesso)

---

## 🆕 Nuovi Moduli di Test Suggeriti

### 🔴 Alta Priorità (Fondamentali)

#### 1. ⚙️ Test Impostazioni (Settings)
**File:** `js/tests/test-settings.js`  
**Componente testato:** `js/features/settings.js`

**Cosa testare:**
- ✅ Salvataggio/caricamento di ogni impostazione in localStorage
- ✅ Applicazione corretta delle classi CSS
  - `font-size-normal`, `font-size-large`, `font-size-xlarge`
  - `high-contrast`, `touch-friendly`, `reduce-motion`
  - `interface-scale-75`, `interface-scale-85`, etc.
- ✅ Toggle on/off per ogni impostazione
- ✅ Cambio tema (system/light/dark)
- ✅ Rilevamento tema sistema (`prefers-color-scheme`)
- ✅ Feedback aptico (se supportato)
- ✅ Interface scale (75%-125%)
- ✅ Extra spacing e compact layout

**Valore:** Garantisce che tutte le 10+ preferenze utente funzionino e persistano correttamente.

**Test stimati:** ~15-20

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

## 📈 Piano di Implementazione

### Fase 1: Modularizzazione Test Esistenti ✅ (In Corso)
- [x] Crea file per categoria esistenti
- [x] Includi moduli in test.html
- [x] Rimuovi funzioni inline duplicate
- [x] Verifica funzionamento
- [ ] Commit e push

### Fase 2: Test Alta Priorità 🔴
**Ordine suggerito:**
1. Test Impostazioni (più complesso, fondamentale)
2. Test Aggiornamenti (critico per auto-update)
3. Test PWA Nav (visibile solo in PWA)
4. Test Connettività (offline-first)

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
- **Attuale:** ~9 categorie test (database, storage, UI, PWA, performance, prezzi)
- **Target Fase 2:** +4 categorie (settings, updates, pwa-nav, connectivity) → **13 categorie**
- **Target Fase 3:** +3 categorie (modals, changelog, cache) → **16 categorie**
- **Target Fase 4:** +3 categorie (footer, animations, routing) → **19 categorie**

### Test Count Target
- **Attuale:** ~60-70 test (26 solo prezzi)
- **Target Fase 2:** +40-50 test → **~110 test**
- **Target Fase 3:** +30-40 test → **~150 test**
- **Target Finale:** +20-30 test → **~180 test**

---

## 📚 Risorse

- **Test Utils:** `js/tests/test-utils.js` (logging, status, stats, copy-log)
- **Prezzi Tests:** `js/tests/test-prezzi.js` (esempio modulo completo)
- **TestUtils API:** `window.TestUtils.log()`, `window.TestUtils.updateTestStatus()`
- **Documentazione:** `JS_ARCHITECTURE.md`, `CSS_ARCHITECTURE.md`

---

## 🔄 Aggiornamenti

**Ultima modifica:** 2 Novembre 2025  
**Versione app:** 1.6.0  
**Stato:** Fase 1 in corso (modularizzazione test esistenti)

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
