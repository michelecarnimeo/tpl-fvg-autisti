# 📋 Piano di Consolidamento Test Modules

## Problema Attuale
- **62 file JavaScript** caricati in test.html
- **Molti wrapper files** ridondanti (-wrappers.js)
- **Caricamento lento** della pagina

## Struttura Proposta

### 1. Consolidare Wrapper Files
Unire tutti i file `-wrappers.js` in un unico file:
```
js/tests/test-all-wrappers.js (già esiste, ma va popolato con tutti)
```

### 2. Raggruppare Test per Categoria
```
js/tests/core/
  ├── storage-tests.js (unisce test-storage + test-database)
  ├── settings-tests.js (unisce test-settings + test-darkmode)
  └── sw-tests.js (test-sw)

js/tests/ui/
  ├── ui-tests.js (test-ui + test-accordion)
  └── performance-tests.js (test-performance + test-manifest)

js/tests/features/
  ├── route-tests.js (test-route-selector + test-prezzi)
  └── gps-tests.js (tutti i file in gps/)
```

### 3. File da Rimuovere/Consolidare
- Tutti i file `-wrappers.js` individuali
- File di test duplicati o obsoleti
- Console.log di debug non necessari

### 4. Ordine di Caricamento Ottimizzato
1. Core modules (storage, settings)
2. Feature modules (geolocation, route-selector)
3. UI modules (modals, hamburger)
4. Test utilities
5. Test specifici
6. Script principale

## Benefici
- **Riduzione richieste HTTP**: da 62 a ~20-25
- **Caricamento più veloce**
- **Manutenzione semplificata**
- **Meno conflitti tra moduli**
