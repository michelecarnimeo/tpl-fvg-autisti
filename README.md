# TPL FVG Autisti

> **Tutti i diritti riservati.**  
> Questo software è di proprietà esclusiva dell’autore.  
> È vietata la copia, la distribuzione o la modifica senza autorizzazione scritta.  
> Per richieste di utilizzo o licenza, contattare l’autore.

Applicazione web per la consultazione e gestione delle tariffe dei biglietti autobus, pensata per l’uso interno da parte degli autisti TPL FVG.

## Funzionalità principali

- Selezione della linea, fermata di partenza e arrivo
- Calcolo immediato del prezzo del biglietto per la tratta selezionata
- Interfaccia ottimizzata per tablet e smartphone
- Modalità scura attivabile/disattivabile
- Area amministratore per la modifica rapida delle tariffe (prototipo)
- Esportazione del nuovo tariffario in formato JSON

## Come usare l’applicazione

1. **Scarica o clona il progetto**
2. Avvia un server locale nella cartella del progetto (es. `python -m http.server` oppure con Live Server di VSCode)
3. Apri `index.html` dal browser tramite l’indirizzo del server (es. http://localhost:8000)
4. Seleziona la linea, la partenza e l’arrivo per visualizzare il prezzo
5. (Opzionale) Accedi all’area amministratore per modificare le tariffe e visualizzare il nuovo JSON

## Note tecniche

- I dati delle linee, fermate e prezzi sono contenuti nel file `tariffario.json`
- Le modifiche effettuate nell’area amministratore NON vengono salvate automaticamente nel file, ma il nuovo JSON aggiornato viene mostrato e può essere copiato manualmente
- L’applicazione è completamente statica e non richiede backend

## Per TPL FVG

Questa applicazione è pensata per facilitare il lavoro degli autisti e del personale interno, offrendo uno strumento semplice, veloce e personalizzabile per la consultazione e gestione delle tariffe.

Per eventuali integrazioni con sistemi aziendali o per la persistenza delle modifiche, è possibile collegare facilmente la logica a un backend o database.

---

**Autore:** [Michele Carnimeo]
**Progetto dimostrativo - Settembre 2025**
