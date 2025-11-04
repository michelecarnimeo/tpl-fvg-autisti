# 🧪 Proposta Test Aggiuntivi per `prezzi.js`

## ✅ Test già presenti (15):
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

---

## 📋 Test Aggiuntivi Utili (Proposta)

### **Test Robusteza (Dati Malformati)**
- **16. Prezzo null nella matrice** - Verifica gestione `prezzi[i][j] = null`
- **17. Prezzo undefined nella matrice** - Verifica gestione `prezzi[i][j] = undefined`
- **18. Prezzo come stringa ("3.50")** - Verifica rifiuto di stringhe
- **19. Prezzo NaN nella matrice** - Verifica gestione NaN
- **20. Prezzo Infinity nella matrice** - Verifica gestione Infinity
- **21. Prezzo negativo** - Verifica gestione prezzi negativi (-1.50)
- **22. Linea non esistente** - Indice linea fuori range (999)
- **23. fermate non array** - Linea con `fermate` non array

### **Test Struttura Dati**
- **24. Struttura risultato corretta** - Verifica che ritorni sempre `{prezzo, codice, valido}`
- **25. Codice con spazi** - Verifica gestione codici con spazi ("E 1")
- **26. Codice null vs vuoto** - Verifica differenza tra `""` e `null`

### **Test Valori Estremi**
- **27. Prezzo molto grande** - Test con prezzo 999999.99
- **28. Prezzo molto piccolo** - Test con prezzo 0.01
- **29. Prezzo con molti decimali** - Test con prezzo 3.9999999

### **Test Consistenza**
- **30. Prezzo null ma codice presente** - Verifica che risultato sia valido se c'è codice
- **31. Simmetria andata/ritorno** - Verifica che A→B = B→A (se applicabile)

---

## 🎯 Priorità Raccomandata

### **Alta Priorità** (Test Critici):
- ✅ **Test 16**: Prezzo null nella matrice (comune in dati reali)
- ✅ **Test 17**: Prezzo undefined (può accadere)
- ✅ **Test 22**: Linea non esistente (importante per robustezza)
- ✅ **Test 24**: Struttura risultato (verifica API corretta)

### **Media Priorità** (Edge Cases):
- ✅ **Test 18**: Prezzo come stringa (può capitare da JSON malformato)
- ✅ **Test 19**: Prezzo NaN (gestione errori)
- ✅ **Test 23**: fermate non array (robustezza)

### **Bassa Priorità** (Nice to Have):
- Test 20, 21, 25-31 (casi molto rari)

---

## 💡 Raccomandazione

Aggiungere almeno i **4 test ad alta priorità** per garantire robustezza del modulo in scenari reali.

