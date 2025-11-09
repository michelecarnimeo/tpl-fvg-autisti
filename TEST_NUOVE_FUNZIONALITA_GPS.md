# 🧪 Test Nuove Funzionalità GPS - Linea Udine-Grado

**Data**: 7 Novembre 2025  
**Versione**: 1.6.7+  
**Funzionalità**: Auto-assegnazione partenza/arrivo e ordinamento manuale fermate

---

## 📋 Checklist Test

### **TEST 1: Modal Fermate - Ordinamento Manuale** ✅

#### **Scenario 1.1: Apertura Modal senza Ordinamento Automatico**
1. ✅ Apri l'applicazione su `index.html`
2. ✅ Seleziona la linea "Linea 400 Udine-Grado"
3. ✅ Clicca su "Seleziona la partenza"
4. ✅ **VERIFICA**: Il modal si apre e mostra le fermate nell'ordine originale (non ordinate)
5. ✅ **VERIFICA**: Nessuna distanza visibile accanto alle fermate
6. ✅ **VERIFICA**: Il pulsante "Rileva fermata più vicina" è visibile

**Risultato Atteso**: ✅ Fermate in ordine originale, nessuna distanza

---

#### **Scenario 1.2: Ordinamento Manuale con Distanza**
1. ✅ Con il modal fermate aperto, clicca su "Rileva fermata più vicina"
2. ✅ **VERIFICA**: Il pulsante mostra "Rilevamento..." (⏳)
3. ✅ **VERIFICA**: Dopo il rilevamento, le fermate vengono ordinate per distanza
4. ✅ **VERIFICA**: Ogni fermata mostra la distanza in km (es. "Udine" → "2.5 km")
5. ✅ **VERIFICA**: Le fermate sono ordinate dalla più vicina alla più lontana
6. ✅ **VERIFICA**: Gli indici originali sono preservati (cliccando una fermata, viene selezionata quella corretta)

**Risultato Atteso**: ✅ Fermate ordinate con distanze visibili

---

#### **Scenario 1.3: Distanza Visibile Solo Dopo Click**
1. ✅ Chiudi il modal
2. ✅ Riapri il modal fermate
3. ✅ **VERIFICA**: Le fermate sono nell'ordine originale (non ordinate)
4. ✅ **VERIFICA**: Nessuna distanza visibile
5. ✅ Clicca di nuovo su "Rileva fermata più vicina"
6. ✅ **VERIFICA**: Le distanze appaiono di nuovo

**Risultato Atteso**: ✅ Distanze visibili solo dopo click sul pulsante

---

### **TEST 2: Auto-Assegnazione Partenza/Arrivo (Home Page)** ✅

#### **Scenario 2.1: Auto-Assegnazione con Linea Udine-Grado**
1. ✅ Apri l'applicazione su `index.html`
2. ✅ Seleziona la linea "Linea 400 Udine-Grado"
3. ✅ **VERIFICA**: Il pulsante GPS (📍) è visibile accanto a "Seleziona la partenza"
4. ✅ Clicca sul pulsante GPS
5. ✅ **VERIFICA**: Il pulsante mostra "Rilevamento..." (⏳)
6. ✅ **VERIFICA**: Dopo il rilevamento, partenza e arrivo vengono auto-assegnati
7. ✅ **VERIFICA**: La notifica mostra: "Partenza: [Nome] (X.X km) → Arrivo: [Nome]"
8. ✅ **VERIFICA**: Il pulsante "Seleziona la partenza" mostra il nome della fermata più vicina
9. ✅ **VERIFICA**: Il pulsante "Seleziona la destinazione" mostra il capolinea opposto
10. ✅ **VERIFICA**: Il prezzo viene calcolato automaticamente

**Risultato Atteso**: ✅ Partenza e arrivo auto-assegnati correttamente

---

#### **Scenario 2.2: Verifica Logica Capolinea**
1. ✅ Test con posizione GPS vicina a Udine:
   - **VERIFICA**: Partenza = Udine, Arrivo = Grado

2. ✅ Test con posizione GPS vicina a Grado:
   - **VERIFICA**: Partenza = Grado, Arrivo = Udine

3. ✅ Test con posizione GPS vicina a Palmanova:
   - **VERIFICA**: Partenza = Palmanova, Arrivo = Grado (più vicino a Udine)

4. ✅ Test con posizione GPS vicina a Cervignano FS:
   - **VERIFICA**: Partenza = Cervignano FS, Arrivo = Grado (più vicino a Udine)

**Risultato Atteso**: ✅ Logica capolinea corretta per ogni scenario

---

#### **Scenario 2.3: Auto-Assegnazione Solo per Linea Udine-Grado**
1. ✅ Seleziona una linea diversa da "Linea 400 Udine-Grado"
2. ✅ Clicca sul pulsante GPS
3. ✅ **VERIFICA**: Il sistema rileva la posizione ma NON auto-assegna
4. ✅ **VERIFICA**: Mostra solo notifica "Posizione rilevata!"
5. ✅ **VERIFICA**: Partenza e arrivo rimangono vuoti

**Risultato Atteso**: ✅ Auto-assegnazione funziona solo per linea Udine-Grado

---

#### **Scenario 2.4: Nessuna Linea Selezionata**
1. ✅ Apri l'applicazione (senza selezionare linea)
2. ✅ **VERIFICA**: Il pulsante GPS non è visibile (o disabilitato)
3. ✅ Se il pulsante è visibile, cliccalo
4. ✅ **VERIFICA**: Il sistema rileva la posizione ma NON auto-assegna
5. ✅ **VERIFICA**: Mostra solo notifica "Posizione rilevata!"

**Risultato Atteso**: ✅ Nessuna auto-assegnazione se nessuna linea è selezionata

---

### **TEST 3: Gestione Errori** ✅

#### **Scenario 3.1: Permesso GPS Negato**
1. ✅ Nega il permesso di geolocalizzazione quando richiesto
2. ✅ **VERIFICA**: Mostra errore: "Permesso di geolocalizzazione negato"
3. ✅ **VERIFICA**: Il pulsante ritorna allo stato iniziale dopo 3 secondi

**Risultato Atteso**: ✅ Gestione corretta del permesso negato

---

#### **Scenario 3.2: GPS Non Disponibile**
1. ✅ Disattiva il GPS o simula un errore
2. ✅ **VERIFICA**: Mostra errore: "Posizione non disponibile"
3. ✅ **VERIFICA**: Il pulsante ritorna allo stato iniziale dopo 3 secondi

**Risultato Atteso**: ✅ Gestione corretta dell'errore GPS

---

## 🎯 Casi di Test Specifici

### **Caso 1: Posizione tra Palmanova e Cervignano**
- **Input**: Posizione GPS tra Palmanova e Cervignano
- **Atteso**: Partenza = fermata più vicina (Palmanova o Cervignano FS), Arrivo = Grado

### **Caso 2: Posizione molto vicina a Udine**
- **Input**: Posizione GPS molto vicina a Udine (< 1 km)
- **Atteso**: Partenza = Udine, Arrivo = Grado

### **Caso 3: Posizione molto vicina a Grado**
- **Input**: Posizione GPS molto vicina a Grado (< 1 km)
- **Atteso**: Partenza = Grado, Arrivo = Udine

### **Caso 4: Posizione lontana da tutte le fermate**
- **Input**: Posizione GPS lontana (> 50 km da tutte le fermate)
- **Atteso**: Partenza = fermata più vicina tra le 4 prioritarie, Arrivo = capolinea opposto

---

## 🔍 Verifiche Tecniche

### **Console Browser**
1. ✅ Apri la console del browser (F12)
2. ✅ Verifica che non ci siano errori JavaScript
3. ✅ Verifica i log:
   - `✅ Modulo geolocation.js caricato`
   - `✅ Fermate ordinate per distanza nel modal` (quando applicabile)
   - `ℹ️ Auto-assegnazione disponibile solo per la linea Udine-Grado` (per altre linee)

### **Network Tab**
1. ✅ Verifica che non ci siano richieste fallite
2. ✅ Verifica che il Service Worker carichi correttamente i nuovi file

### **Storage**
1. ✅ Verifica che `tpl.locationEnabled` sia salvato correttamente
2. ✅ Verifica che `tpl.partenzaIdx` e `tpl.arrivoIdx` siano salvati dopo auto-assegnazione

---

## 📝 Note di Test

### **Ambiente di Test**
- **Browser**: Chrome, Firefox, Safari (se disponibile)
- **Dispositivo**: Desktop, Tablet, Mobile
- **GPS**: Reale o simulato (DevTools)

### **Simulazione GPS (Chrome DevTools)**
1. Apri DevTools (F12)
2. Vai a "More tools" → "Sensors"
3. Simula una posizione GPS:
   - Udine: Lat 46.0625, Lon 13.2354
   - Grado: Lat 45.7667, Lon 13.4833
   - Palmanova: Lat 45.9000, Lon 13.3500
   - Cervignano FS: Lat 45.8300, Lon 13.4200

### **Test Mobile**
1. ✅ Test su dispositivo mobile reale
2. ✅ Verifica che il GPS funzioni correttamente
3. ✅ Verifica che l'auto-assegnazione funzioni
4. ✅ Verifica che le distanze siano visualizzate correttamente

---

## ✅ Criteri di Successo

### **Modal Fermate**
- ✅ Nessun ordinamento automatico all'apertura
- ✅ Ordinamento solo dopo click sul pulsante
- ✅ Distanze visibili solo dopo ordinamento
- ✅ Distanze formattate correttamente (X.X km)

### **Auto-Assegnazione**
- ✅ Funziona solo per linea Udine-Grado
- ✅ Trova correttamente la fermata più vicina
- ✅ Assegna correttamente partenza e arrivo
- ✅ Mostra notifica con informazioni corrette
- ✅ Calcola prezzo automaticamente

### **Gestione Errori**
- ✅ Gestisce correttamente permesso negato
- ✅ Gestisce correttamente GPS non disponibile
- ✅ Gestisce correttamente timeout
- ✅ UI ritorna allo stato iniziale dopo errore

---

## 🐛 Problemi Conosciuti / Da Verificare

### **Da Verificare**
- [ ] Il pulsante GPS è visibile solo quando una linea è selezionata?
- [ ] L'auto-assegnazione funziona correttamente su mobile?
- [ ] Le distanze sono formattate correttamente in tutte le lingue?
- [ ] Il Service Worker cache i nuovi file correttamente?

### **Possibili Problemi**
- Se il GPS non è disponibile, l'auto-assegnazione non funziona (comportamento atteso)
- Se il permesso è negato, l'auto-assegnazione non funziona (comportamento atteso)
- Se la linea non è Udine-Grado, l'auto-assegnazione non funziona (comportamento atteso)

---

## 📊 Risultati Test

**Data Test**: ___________  
**Tester**: ___________  
**Browser**: ___________  
**Dispositivo**: ___________

### **Risultati**
- [ ] TEST 1: Modal Fermate - ✅ PASS / ❌ FAIL
- [ ] TEST 2: Auto-Assegnazione - ✅ PASS / ❌ FAIL
- [ ] TEST 3: Gestione Errori - ✅ PASS / ❌ FAIL

### **Note**
_________________________________________________
_________________________________________________
_________________________________________________

---

## 🚀 Prossimi Passi

Dopo i test:
1. ✅ Correggere eventuali bug trovati
2. ✅ Aggiornare documentazione se necessario
3. ✅ Commit e push su GitHub
4. ✅ Aggiornare version.json e changelog.js

