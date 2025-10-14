# 📋 DOCUMENTAZIONE TECNICA CSS - TPL FVG AUTISTI

## 🎯 **Panoramica del Progetto**

Questo documento contiene la documentazione tecnica completa del file `style.css` del progetto **TPL FVG Autisti** - un'applicazione web per il calcolo delle tariffe dei trasporti pubblici del Friuli Venezia Giulia.

### **Caratteristiche Principali:**
- **Design**: Glassmorphism con palette colori ciano/turchese
- **Responsive**: Layout adattivo per tutti i dispositivi
- **Dark Mode**: Supporto completo per modalità scura
- **PWA**: Progressive Web App con Service Worker

---

## 📁 **Struttura del File CSS**

Il file `style.css` è organizzato in **12 sezioni principali**, ognuna documentata con commenti dettagliati:

---

## 🔧 **SEZIONE 1: RESET CSS**

### **Scopo**: Reset delle proprietà CSS di default per garantire consistenza cross-browser

```css
/* Reset CSS universale */
* {
  margin: 0;                    /* Rimuove margini di default */
  padding: 0;                   /* Rimuove padding di default */
  box-sizing: border-box;       /* Include bordi nel calcolo dimensioni */
}

/* Reset per elementi specifici */
html, body {
  height: 100%;                 /* Altezza completa */
  overflow-x: hidden;           /* Nasconde scroll orizzontale */
}

/* Reset per liste */
ul, ol {
  list-style: none;             /* Rimuove stili lista di default */
}

/* Reset per link */
a {
  text-decoration: none;        /* Rimuove sottolineatura di default */
  color: inherit;               /* Usa colore ereditato */
}
```

---

## 🔤 **SEZIONE 2: FONT DI SISTEMA**

### **Scopo**: Importazione e configurazione dei font

```css
/* Import font Inter da Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

/* Font di sistema di fallback */
body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  font-size: 16px;              /* Dimensione font base */
  line-height: 1.6;             /* Altezza riga per leggibilità */
  font-weight: 400;             /* Peso font normale */
  -webkit-font-smoothing: antialiased;  /* Smoothing font per WebKit */
  -moz-osx-font-smoothing: grayscale;   /* Smoothing font per Firefox */
}
```

---

## 🎨 **SEZIONE 3: VARIABILI CSS - PALETTA COLORI**

### **Scopo**: Definizione delle variabili CSS per consistenza del design

#### **3.1: Colori Principali**
```css
:root {
  /* Colori principali */
  --turchese: #17b7b1;          /* Colore principale turchese */
  --turchese-scuro: #0f9b96;    /* Turchese più scuro */
  --turchese-light: #4ecdc4;    /* Turchese più chiaro */
  
  /* Colori testo */
  --testo-principale: #1e293b;  /* Testo scuro principale */
  --testo-secondario: #64748b;  /* Testo grigio secondario */
  --bianco: #ffffff;            /* Bianco puro */
  
  /* Colori grigi */
  --grigio-chiaro: #f1f5f9;     /* Grigio molto chiaro */
  --grigio-medio: #e2e8f0;      /* Grigio medio */
  --grigio-scuro: #475569;      /* Grigio scuro */
  --bordo: #cbd5e1;             /* Colore bordi */
}
```

#### **3.2: Variabili Glassmorphism**
```css
:root {
  /* Effetti glassmorphism */
  --glass-bg: rgba(255, 255, 255, 0.25);        /* Sfondo trasparente */
  --glass-border: rgba(255, 255, 255, 0.18);    /* Bordo trasparente */
  --glass-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);  /* Ombra glassmorphism */
  --backdrop-blur: blur(10px);                  /* Sfocatura del background */
}
```

#### **3.3: Colori Dark Mode**
```css
:root {
  /* Colori per modalità scura */
  --dark-bg: #0f172a;           /* Sfondo scuro principale */
  --dark-surface: #1e293b;      /* Superficie scura */
  --dark-text: #f1f5f9;         /* Testo chiaro */
  --dark-border: #334155;       /* Bordi scuri */
}
```

#### **3.4: Glassmorphism Dark Mode**
```css
:root {
  /* Effetti glassmorphism scuri */
  --glass-bg-dark: rgba(30, 41, 59, 0.5);       /* Sfondo scuro trasparente */
  --glass-border-dark: rgba(148, 163, 184, 0.2); /* Bordo scuro trasparente */
}
```

---

## 🌙 **SEZIONE 4: MODALITÀ SCURA (DARK MODE)**

### **Scopo**: Configurazione completa della modalità scura

```css
/* Attivazione modalità scura */
.dark {
  /* Colori di base */
  --testo-principale: #f1f5f9;  /* Testo chiaro */
  --testo-secondario: #cbd5e1;  /* Testo grigio chiaro */
  --bianco: #0f172a;            /* Bianco diventa scuro */
  
  /* Colori grigi invertiti */
  --grigio-chiaro: #1e293b;     /* Grigio chiaro diventa scuro */
  --grigio-medio: #334155;      /* Grigio medio diventa scuro */
  --grigio-scuro: #64748b;      /* Grigio scuro diventa chiaro */
  --bordo: #475569;             /* Bordi scuri */
  
  /* Glassmorphism scuro */
  --glass-bg: rgba(30, 41, 59, 0.5);           /* Sfondo scuro trasparente */
  --glass-border: rgba(148, 163, 184, 0.2);    /* Bordo scuro trasparente */
  --glass-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.6);  /* Ombra scura */
}
```

---

## 🎭 **SEZIONE 5: BACKGROUND DEL BODY - GRADIENTE ANIMATO**

### **Scopo**: Sfondo animato con gradiente per l'intera applicazione

#### **5.1: Font e Layout Base**
```css
body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  font-size: 16px;
  line-height: 1.6;
  font-weight: 400;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

#### **5.2: Gradiente Bianco (Modalità Chiara)**
```css
body {
  /* Gradiente bianco animato */
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 25%, #cbd5e1 50%, #94a3b8 75%, #64748b 100%);
  background-size: 400% 400%;        /* Dimensione per animazione */
  animation: gradientShift 15s ease infinite;  /* Animazione continua */
}
```

#### **5.3: Layout Flexbox**
```css
body {
  min-height: 100vh;             /* Altezza minima viewport */
  display: flex;                 /* Layout flexbox */
  flex-direction: column;        /* Direzione verticale */
  overflow-x: hidden;            /* Nasconde scroll orizzontale */
  position: relative;            /* Posizione relativa */
  transition: all 0.3s ease;     /* Transizione fluida */
}
```

#### **5.4: Animazione Gradiente**
```css
@keyframes gradientShift {
  0% { background-position: 0% 50%; }      /* Posizione iniziale */
  50% { background-position: 100% 50%; }   /* Posizione intermedia */
  100% { background-position: 0% 50%; }    /* Posizione finale */
}
```

#### **5.5: Background Dark Mode**
```css
.dark body {
  /* Gradiente scuro: blu → viola → grigio scuro → nero */
  background: linear-gradient(135deg, #1e293b 0%, #334155 25%, #475569 50%, #64748b 75%, #0f172a 100%);
  background-size: 400% 400%;        /* Stessa dimensione per animazione */
  animation: gradientShift 15s ease infinite;  /* Stessa animazione */
}
```

---

## 📦 **SEZIONE 6: CONTAINER PRINCIPALE**

### **Scopo**: Container wrapper per tutto il contenuto dell'applicazione

```css
.container {
  max-width: none;        /* Nessuna larghezza massima - usa tutto lo spazio */
  margin: 0 auto;         /* Centra il container orizzontalmente */
  padding: 0 0.25rem;     /* Padding laterale minimo per evitare attaccarsi ai bordi */
  width: 100%;            /* Usa tutta la larghezza disponibile */
  box-sizing: border-box; /* Include padding nel calcolo delle dimensioni */
}
```

#### **6.1: Media Query per Schermi Grandi (1200px+)**
```css
@media (min-width: 1200px) {
  /* Container del main content con layout grid */
  .main-content>.container {
    display: grid;              /* Layout a griglia */
    grid-template-columns: 1fr; /* Una colonna (layout verticale) */
    gap: 2rem;                  /* Spazio tra gli elementi */
  }

  /* Container speciale per la griglia delle tariffe */
  #tariffe-grid-container {
    display: grid;                    /* Layout a griglia */
    grid-template-columns: 1fr 1fr;   /* Due colonne per layout orizzontale */
    gap: 3rem;                       /* Spazio maggiore tra le colonne */
    width: 100%;                     /* Larghezza completa */
    max-width: 1800px;               /* Larghezza massima per schermi molto grandi */
    margin: 2rem auto;               /* Margine verticale e centratura */
  }
}
```

---

## 🧭 **SEZIONE 7: NAVBAR - GLASSMORPHISM**

### **Scopo**: Barra di navigazione superiore con effetto vetro

#### **7.1: Sfondo Gradiente Ciano**
```css
.navbar {
  /* Gradiente ciano: da 90% opacità a 50% opacità */
  background: linear-gradient(135deg, rgba(0, 123, 138, 0.9) 0%, rgba(0, 123, 138, 0.7) 50%, rgba(0, 123, 138, 0.5) 100%);
}
```

#### **7.2: Effetti Glassmorphism**
```css
.navbar {
  backdrop-filter: var(--backdrop-blur);        /* Sfocatura del background */
  -webkit-backdrop-filter: var(--backdrop-blur); /* Supporto WebKit per Safari */
}
```

#### **7.3: Spaziatura e Bordi**
```css
.navbar {
  padding: 1rem 0;                              /* Padding verticale */
  box-shadow: 0 8px 32px 0 rgba(0, 123, 138, 0.3);  /* Ombra ciano */
  border-bottom: 1px solid rgba(0, 123, 138, 0.3);   /* Bordo inferiore ciano */
}
```

#### **7.4: Posizionamento Sticky**
```css
.navbar {
  position: sticky;  /* Rimanere in cima durante lo scroll */
  top: 0;           /* Posizione in cima */
  z-index: 1000;    /* Sopra tutti gli altri elementi */
}
```

#### **7.5: Layout del Contenuto Navbar**
```css
.navbar-content {
  display: flex;                    /* Layout flexbox orizzontale */
  justify-content: space-between;   /* Logo a sinistra, menu a destra */
  align-items: center;              /* Allineamento verticale centrale */
  flex-wrap: nowrap;               /* Non andare a capo su schermi piccoli */
}
```

#### **7.6: Brand/Logo della Navbar**
```css
.navbar-brand {
  display: flex;        /* Layout flexbox per logo + titolo */
  align-items: center;  /* Allineamento verticale centrale */
  gap: 12px;           /* Spazio tra logo e titolo */
}

.navbar-logo {
  width: 40px;         /* Larghezza logo */
  height: 40px;        /* Altezza logo */
  border-radius: 8px;  /* Bordi arrotondati */
  object-fit: cover;   /* Adatta l'immagine mantenendo proporzioni */
}

.navbar-title {
  color: rgba(255, 255, 255, 0.95);  /* Testo bianco con 95% opacità */
  font-size: 1.5rem;                              /* Dimensione font grande */
  font-weight: 700;                               /* Peso font bold */
  text-decoration: none;                          /* Nessuna sottolineatura */
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.4);    /* Ombra testo per leggibilità */
}
```

#### **7.7: Badge BETA con Glassmorphism**
```css
.beta-badge {
  display: inline-flex;                    /* Layout flexbox inline */
  align-items: center;                     /* Allineamento verticale centrale */
  justify-content: center;                 /* Allineamento orizzontale centrale */
  
  /* Stile glassmorphism giallo */
  background: rgba(255, 193, 7, 0.3);      /* Sfondo giallo trasparente */
  backdrop-filter: blur(10px);             /* Sfocatura del background */
  -webkit-backdrop-filter: blur(10px);     /* Supporto WebKit */
  
  /* Testo e tipografia */
  color: #ffffff;                          /* Testo bianco */
  font-size: 0.65rem;                      /* Font piccolo */
  font-weight: 800;                        /* Font extra bold */
  letter-spacing: 1px;                     /* Spaziatura tra lettere */
  
  /* Dimensioni e bordi */
  padding: 0.25rem 0.6rem;                 /* Padding interno */
  border-radius: 8px;                      /* Bordi arrotondati */
  border: 1px solid rgba(255, 255, 255, 0.4);  /* Bordo bianco trasparente */
  
  /* Effetti visivi finali */
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);      /* Ombra testo */
  box-shadow: 0 2px 10px rgba(255, 193, 7, 0.3);   /* Ombra gialla */
  margin-left: 0.5rem;                              /* Margine sinistro dal titolo */
}
```

#### **7.8: Menu di Navigazione**
```css
.navbar-nav {
  display: flex;           /* Layout flexbox orizzontale */
  align-items: center;     /* Allineamento verticale centrale */
  gap: 2rem;              /* Spazio tra i link di navigazione */
}
```

#### **7.9: Link di Navigazione**
```css
.nav-link {
  /* Stile base */
  color: rgba(255, 255, 255, 0.95);        /* Testo bianco con 95% opacità */
  text-decoration: none;                    /* Nessuna sottolineatura */
  font-weight: 600;                         /* Peso font semi-bold */
  
  /* Dimensioni e bordi */
  padding: 0.5rem 1rem;                     /* Padding interno */
  border-radius: 12px;                      /* Bordi arrotondati */
  
  /* Transizioni e effetti */
  transition: all 0.3s ease;                /* Transizione fluida per tutti i cambiamenti */
  background: transparent;                  /* Sfondo trasparente */
  backdrop-filter: none;                    /* Nessuna sfocatura */
  -webkit-backdrop-filter: none;            /* Nessuna sfocatura WebKit */
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);  /* Ombra testo per leggibilità */
}
```

#### **7.10: Effetto Hover sui Link**
```css
.nav-link:hover {
  /* Sfondo glassmorphism */
  background: rgba(255, 255, 255, 0.1);      /* Sfondo bianco trasparente */
  backdrop-filter: blur(5px);                /* Sfocatura leggera */
  -webkit-backdrop-filter: blur(5px);        /* Supporto WebKit */
  
  /* Effetti di movimento */
  transform: translateY(-2px);               /* Solleva leggermente il link */
  box-shadow: 0 4px 15px rgba(255, 255, 255, 0.1);  /* Ombra bianca */
  
  /* Testo migliorato */
  color: rgba(255, 255, 255, 1);             /* Testo bianco al 100% */
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.6);  /* Ombra testo più forte */
}
```

#### **7.11: Stato Attivo dei Link**
```css
.nav-link.active {
  /* Sfondo glassmorphism attivo */
  background: rgba(255, 255, 255, 0.25);      /* Sfondo bianco più opaco */
  backdrop-filter: blur(10px);               /* Sfocatura più forte */
  -webkit-backdrop-filter: blur(10px);       /* Supporto WebKit */
  border: 1px solid rgba(255, 255, 255, 0.3); /* Bordo bianco trasparente */
  
  /* Tipografia attiva */
  font-weight: 700;                          /* Peso font bold */
  color: rgba(255, 255, 255, 1);            /* Testo bianco al 100% */
  
  /* Effetti visivi attivi */
  box-shadow: 0 4px 15px rgba(255, 255, 255, 0.2);  /* Ombra bianca più forte */
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.8);       /* Ombra testo molto forte */
}
```

#### **7.12: Toggle Modalità Scura**
```css
.dark-mode-toggle {
  background: none;                    /* Nessuno sfondo */
  border: none;                        /* Nessun bordo */
  color: var(--bianco);                /* Colore bianco */
  cursor: pointer;                     /* Cursore pointer */
  padding: 0.5rem;                     /* Padding interno */
  border-radius: 6px;                  /* Bordi arrotondati */
  transition: all 0.3s ease;           /* Transizione fluida */
}

.dark-mode-toggle:hover {
  background-color: rgba(255, 255, 255, 0.1);  /* Sfondo bianco trasparente al hover */
}
```

---

## 🎯 **SEZIONE 8: MAIN CONTENT E MAIN CARD**

### **Scopo**: Area contenuto principale e card principale dell'applicazione

#### **8.1: Area Contenuto Principale**
```css
.main-content {
  padding: 0;                    /* Nessun padding */
  flex: 1;                      /* Occupa tutto lo spazio disponibile */
  display: flex;                /* Layout flexbox */
  align-items: center;          /* Allineamento verticale centrale */
  justify-content: center;      /* Allineamento orizzontale centrale */
  overflow: visible;            /* Contenuto visibile senza scroll */
  min-height: 0;                /* Altezza minima zero */
}
```

#### **8.2: Layout Specifico per Pagine Tratte e Tariffe**
```css
.tratte-page {
  display: flex;                /* Layout flexbox */
  flex-direction: column;       /* Direzione verticale */
  min-height: 100vh;           /* Altezza minima viewport */
}

.tratte-page .main-content {
  min-height: auto;            /* Altezza minima automatica */
  align-items: flex-start;     /* Allineamento in alto */
  padding: 1rem 0;            /* Padding verticale */
  flex: 1;                    /* Occupa spazio disponibile */
  overflow: visible;          /* Contenuto visibile */
}
```

#### **8.3: Layout Ottimizzato per Pagina Benvenuto**
```css
body:not(.tratte-page) .main-content {
  align-items: center;         /* Allineamento centrale */
  padding: 1rem 0;           /* Padding verticale */
}

body:not(.tratte-page) .main-card {
  max-width: 600px !important;  /* Larghezza massima 600px */
  padding: 2rem;               /* Padding interno */
  margin: 1rem auto !important; /* Margine automatico e centrato */
}
```

#### **8.4: Card Principale con Glassmorphism**
```css
.main-card {
  /* Sfondo glassmorphism */
  background: var(--glass-bg);                    /* Sfondo trasparente */
  backdrop-filter: var(--backdrop-blur);         /* Sfocatura del background */
  -webkit-backdrop-filter: var(--backdrop-blur); /* Supporto WebKit */
  
  /* Forma e dimensioni */
  border-radius: 24px;                           /* Bordi molto arrotondati */
  padding: 1.25rem;                              /* Padding interno */
  width: 95% !important;                         /* Larghezza 95% */
  max-width: 600px !important;                   /* Larghezza massima 600px */
  margin: 0.25rem auto !important;               /* Margine minimo e centrato */
  
  /* Ombreggiatura base (SENZA HOVER) */
  box-shadow: var(--glass-shadow);               /* Ombra glassmorphism */
  
  /* Bordi e layout */
  border: 1px solid var(--glass-border);         /* Bordo trasparente */
  box-sizing: border-box;                        /* Include bordi nel calcolo */
  max-height: 100%;                              /* Altezza massima */
  overflow-y: auto;                              /* Scroll verticale se necessario */
  
  /* Transizioni RIMOSSE per eliminare effetti hover */
  /* transition: box-shadow 0.3s ease; - COMMENTATO */
}
```

#### **8.5: Media Query per Schermi Medi (600px+)**
```css
@media (min-width: 600px) {
  .main-card {
    width: 94% !important;           /* Larghezza 94% */
    max-width: 650px !important;     /* Larghezza massima 650px */
    padding: 1.75rem;               /* Padding maggiore */
    margin: 0.25rem auto !important; /* Margine centrato */
  }
  
  body:not(.tratte-page) .main-card {
    max-width: 650px !important;     /* Larghezza massima 650px */
    padding: 2rem;                  /* Padding ancora maggiore */
  }
}
```

#### **8.6: Media Query per Schermi Grandi (900px+)**
```css
@media (min-width: 900px) {
  .main-card {
    width: 92% !important;           /* Larghezza 92% */
    max-width: 700px !important;     /* Larghezza massima 700px */
    padding: 2rem;                  /* Padding standard */
    margin: 0.25rem auto !important; /* Margine centrato */
  }
  
  body:not(.tratte-page) .main-card {
    max-width: 700px !important;     /* Larghezza massima 700px */
    padding: 2.5rem;                /* Padding maggiore */
  }
}
```

#### **8.7: Media Query per Schermi Molto Grandi (992px+)**
```css
@media (min-width: 992px) {
  .main-card {
    width: 97% !important;           /* Larghezza 97% */
    max-width: 750px !important;     /* Larghezza massima 750px */
    padding: 2rem;                  /* Padding standard */
    margin: 0.25rem auto !important; /* Margine centrato */
  }
  
  body:not(.tratte-page) .main-card {
    max-width: 750px !important;     /* Larghezza massima 750px */
    padding: 3rem;                  /* Padding massimo */
  }

  .main-content>.container {
    max-width: 1800px !important;    /* Larghezza massima container */
    display: flex;                    /* Layout flexbox */
    justify-content: center;          /* Centra orizzontalmente */
    align-items: center;              /* Centra verticalmente */
    padding: 0 1rem;                 /* Padding laterale */
  }
}
```

#### **8.8: Layout Mobile - Forza Layout Verticale**
```css
@media (max-width: 991px) {
  #main-app .main-card {
    display: block !important;        /* Layout a blocchi verticali */
  }

  #main-app .card-title,
  #main-app .form-group,
  #main-app .route-section,
  #main-app .calculate-section,
  #main-app .price-result,
  #main-app .history-section {
    grid-column: unset !important;    /* Reset colonne griglia */
    grid-row: unset !important;       /* Reset righe griglia */
  }
}
```

#### **8.9: Media Query per Schermi Extra Grandi (1600px+)**
```css
@media (min-width: 1600px) {
  .main-card {
    width: 95% !important;           /* Larghezza 95% */
    max-width: 900px !important;     /* Larghezza massima 900px */
    padding: 2rem;                  /* Padding standard */
    margin: 0.25rem auto !important; /* Margine centrato */
  }
  
  body:not(.tratte-page) .main-card {
    max-width: 850px !important;     /* Larghezza massima 850px */
    padding: 2.5rem;                /* Padding maggiore */
  }
}
```

#### **8.10: Eccezione per Pagine Tratte/Tariffe - Layout Verticale Normale**
```css
.tratte-page .main-content>.container {
  display: block !important;        /* Layout a blocchi */
  align-items: normal;             /* Allineamento normale */
  overflow: visible;               /* Contenuto visibile */
}
```

#### **8.11: Layout a Due Colonne per Desktop**
```css
#main-app .main-card {
  display: grid;                    /* Layout a griglia */
  grid-template-columns: 1fr 1fr;   /* Due colonne uguali */
  gap: 2rem;                       /* Spazio tra le colonne */
  align-items: start;              /* Allineamento in alto */
}

/* Titolo della card - occupa tutta la larghezza */
#main-app .card-title {
  grid-column: 1 / -1;            /* Dalla prima all'ultima colonna */
  margin-bottom: 1.2rem;          /* Margine inferiore */
}

/* Gruppo form - occupa tutta la larghezza */
#main-app .form-group {
  grid-column: 1 / -1;            /* Dalla prima all'ultima colonna */
  margin-bottom: 1.5rem;          /* Margine inferiore */
}

/* Sezione route - prima colonna */
#main-app .route-section {
  grid-column: 1 / 2;             /* Prima colonna */
}

/* Sezione calcolo - prima colonna */
#main-app .calculate-section {
  grid-column: 1 / 2;             /* Prima colonna */
  margin-top: 1rem;               /* Margine superiore */
}

/* Risultato prezzo - seconda colonna */
#main-app .price-result {
  grid-column: 2 / 3;             /* Seconda colonna */
  grid-row: 3 / 5;                /* Dalla terza alla quinta riga */
  display: flex;                  /* Layout flexbox */
  flex-direction: column;         /* Direzione verticale */
  justify-content: center;        /* Centra verticalmente */
  align-items: center;            /* Centra orizzontalmente */
  background: rgba(255, 255, 255, 0.2);  /* Sfondo bianco trasparente */
  backdrop-filter: blur(15px);    /* Sfocatura del background */
  -webkit-backdrop-filter: blur(15px);  /* Supporto WebKit */
  border-radius: 20px;            /* Bordi arrotondati */
  padding: 2rem;                  /* Padding interno */
  border: 1px solid rgba(255, 255, 255, 0.3);  /* Bordo bianco trasparente */
  min-height: 250px;              /* Altezza minima */
}

/* Sezione cronologia - occupa tutta la larghezza */
#main-app .history-section {
  grid-column: 1 / -1;            /* Dalla prima all'ultima colonna */
}
```

---

## 📝 **SEZIONE 9: FORM ELEMENTS**

### **Scopo**: Elementi del form con stile glassmorphism

#### **9.1: Titolo della Card**
```css
.card-title {
  text-align: center;              /* Testo centrato */
  margin-bottom: 1.5rem;           /* Margine inferiore */
}

.card-title h1 {
  font-size: 2rem;                 /* Dimensione font grande */
  font-weight: 800;                /* Peso font extra bold */
  color: rgba(15, 23, 42, 0.95);   /* Colore scuro con 95% opacità */
  text-shadow: 0 2px 15px rgba(255, 255, 255, 0.3);  /* Ombra testo bianca */
  margin-bottom: 0.5rem;           /* Margine inferiore */
}

.card-title p {
  font-size: 1.05rem;              /* Dimensione font media */
  color: rgba(51, 65, 85, 0.8);    /* Colore grigio con 80% opacità */
  max-width: 90%;                  /* Larghezza massima 90% */
  margin: 0 auto;                  /* Centra orizzontalmente */
  text-shadow: 0 1px 5px rgba(255, 255, 255, 0.2);  /* Ombra testo leggera */
}
```

#### **9.2: Elementi del Form**
```css
.form-group {
  margin-bottom: 1.2rem;           /* Margine inferiore tra i gruppi */
}

.form-label {
  display: block;                   /* Display a blocchi */
  font-weight: 600;                 /* Peso font semi-bold */
  color: rgba(30, 41, 59, 0.9);    /* Colore scuro con 90% opacità */
  margin-bottom: 0.3rem;            /* Margine inferiore */
  text-shadow: 0 1px 3px rgba(255, 255, 255, 0.2);  /* Ombra testo leggera */
}
```

#### **9.3: Selettori del Form con Glassmorphism**
```css
.form-select {
  width: 100%;                      /* Larghezza completa */
  padding: 0.6rem 0.8rem;           /* Padding interno */
  border: 1px solid var(--glass-border);  /* Bordo trasparente */
  border-radius: 12px;              /* Bordi arrotondati */
  background: var(--glass-bg);      /* Sfondo trasparente */
  backdrop-filter: var(--backdrop-blur);  /* Sfocatura del background */
  -webkit-backdrop-filter: var(--backdrop-blur);  /* Supporto WebKit */
  color: rgba(15, 23, 42, 0.95);   /* Colore testo scuro */
  font-size: 1rem;                  /* Dimensione font standard */
  transition: all 0.3s ease;        /* Transizione fluida */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);  /* Ombra leggera */
  font-weight: 500;                  /* Peso font medium */
}

.form-select option {
  background: rgba(30, 41, 59, 0.95);  /* Sfondo scuro per le opzioni */
  color: #ffffff;                    /* Testo bianco */
}

.form-select:focus {
  outline: none;                     /* Rimuove il bordo di default */
  border-color: rgba(23, 183, 177, 0.5);  /* Bordo turchese */
  box-shadow: 0 0 0 3px rgba(23, 183, 177, 0.2);  /* Ombra turchese */
  background: rgba(255, 255, 255, 0.35);  /* Sfondo più opaco */
}

.form-select:disabled {
  background: rgba(233, 236, 239, 0.3);  /* Sfondo grigio trasparente */
  cursor: not-allowed;                   /* Cursore non consentito */
  opacity: 0.6;                         /* Opacità ridotta */
}
```

#### **9.4: Sezione Partenza/Arrivo**
```css
.route-section {
  background: rgba(255, 255, 255, 0.15);  /* Sfondo bianco trasparente */
  backdrop-filter: blur(10px);            /* Sfocatura del background */
  -webkit-backdrop-filter: blur(10px);    /* Supporto WebKit */
  border-radius: 20px;                    /* Bordi arrotondati */
  padding: 1.5rem;                       /* Padding interno */
  margin: 1rem 0;                        /* Margine verticale */
  border: 1px solid rgba(255, 255, 255, 0.2);  /* Bordo bianco trasparente */
}

.route-row {
  display: flex;                   /* Layout flexbox orizzontale */
  align-items: center;             /* Allineamento verticale centrale */
  gap: 1rem;                      /* Spazio tra gli elementi */
  margin-bottom: 1.2rem;          /* Margine inferiore */
}

.route-row:last-child {
  margin-bottom: 0;               /* Nessun margine inferiore */
}

.route-icon {
  display: flex;                   /* Layout flexbox */
  align-items: center;             /* Allineamento verticale centrale */
  font-size: 1.2rem;              /* Dimensione font grande */
  flex-shrink: 0;                   /* Non si rimpicciolisce */
  gap: 0.5rem;                     /* Spazio tra icona e testo */
  min-width: 120px;                /* Larghezza minima */
}

.route-icon span:first-child {
  font-size: 1.5rem;              /* Dimensione font grande */
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));  /* Ombra dell'icona */
}

.route-icon span:last-child {
  font-weight: 600;               /* Peso font semi-bold */
  min-width: 80px;                /* Larghezza minima */
  color: rgba(30, 41, 59, 0.9);   /* Colore scuro con 90% opacità */
  text-shadow: 0 1px 3px rgba(255, 255, 255, 0.2);  /* Ombra testo leggera */
}

.route-select {
  flex: 1;                        /* Occupa tutto lo spazio rimanente */
}
```

---

## 🔘 **SEZIONE 10: BOTTONI E PULSANTI**

### **Scopo**: Pulsanti interattivi con effetti glassmorphism

#### **10.1: Container Pulsante Swap**
```css
.swap-button {
  display: flex;                   /* Layout flexbox */
  justify-content: center;         /* Centra orizzontalmente */
  margin: 1rem 0;                 /* Margine verticale */
}
```

#### **10.2: Pulsante Swap (Inverti Percorso)**
```css
.swap-btn {
  /* Stile glassmorphism */
  background: var(--glass-bg);                    /* Sfondo trasparente */
  backdrop-filter: var(--backdrop-blur);         /* Sfocatura del background */
  -webkit-backdrop-filter: var(--backdrop-blur); /* Supporto WebKit */
  border: 1px solid var(--glass-border);         /* Bordo trasparente */
  border-radius: 50px;                           /* Bordi completamente arrotondati */
  
  /* Dimensioni e layout */
  padding: 0.7rem 1rem;                          /* Padding interno */
  display: flex;                                 /* Layout flexbox */
  align-items: center;                          /* Allineamento verticale centrale */
  justify-content: center;                      /* Allineamento orizzontale centrale */
  min-width: 50px;                              /* Larghezza minima */
  
  /* Interattività */
  cursor: pointer;                               /* Cursore pointer */
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);  /* Transizione fluida */
  
  /* Tipografia */
  font-size: 1.1rem;                            /* Dimensione font grande */
  color: var(--testo-principale);               /* Colore testo principale */
  font-weight: 600;                             /* Peso font semi-bold */
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);   /* Ombra testo leggera */
  
  /* Effetti visivi */
  box-shadow: var(--glass-shadow);              /* Ombra glassmorphism */
  position: relative;                           /* Posizione relativa */
  overflow: hidden;                             /* Nasconde contenuto che esce */
}
```

#### **10.3: Effetto Shimmer del Pulsante Swap**
```css
.swap-btn::before {
  content: '';                     /* Contenuto vuoto */
  position: absolute;              /* Posizione assoluta */
  top: 0;                         /* Posizione in alto */
  left: -100%;                    /* Posizione iniziale fuori dal pulsante */
  width: 100%;                    /* Larghezza completa */
  height: 100%;                   /* Altezza completa */
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);  /* Gradiente shimmer */
  transition: left 0.5s ease;     /* Transizione della posizione */
}

.swap-btn:hover::before {
  left: 100%;                     /* Muove il gradiente attraverso il pulsante */
}
```

#### **10.4: Effetto Hover del Pulsante Swap**
```css
.swap-btn:hover {
  transform: translateY(-3px) scale(1.05);  /* Solleva e ingrandisce leggermente */
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15),  /* Ombra più forte */
    0 5px 15px rgba(23, 183, 177, 0.3);      /* Ombra turchese */
  border-color: rgba(23, 183, 177, 0.5);     /* Bordo turchese */
  background: rgba(255, 255, 255, 0.35);     /* Sfondo più opaco */
}
```

#### **10.5: Effetto Active del Pulsante Swap**
```css
.swap-btn:active {
  transform: translateY(-1px) scale(0.98);  /* Leggero abbassamento e rimpicciolimento */
  transition: all 0.1s ease;                /* Transizione veloce */
}
```

#### **10.6: Stato Disabilitato del Pulsante Swap**
```css
.swap-btn:disabled {
  opacity: 0.5;                            /* Opacità ridotta */
  cursor: not-allowed;                     /* Cursore non consentito */
  transform: none;                         /* Nessuna trasformazione */
}
```

#### **10.7: Span del Pulsante Swap**
```css
.swap-btn span {
  transition: transform 0.3s ease;  /* Transizione della rotazione */
  position: relative;               /* Posizione relativa */
  z-index: 1;                       /* Sopra l'effetto shimmer */
}

.swap-btn:active span {
  transform: rotate(180deg);        /* Ruota l'icona di 180 gradi */
}
```

#### **10.8: Sezione Pulsante Calcola**
```css
.calculate-section {
  text-align: center;              /* Testo centrato */
  margin: 1.2rem 0;               /* Margine verticale */
  display: flex;                  /* Layout flexbox */
  flex-direction: column;         /* Direzione verticale */
  align-items: center;            /* Allineamento centrale */
  gap: 0.8rem;                   /* Spazio tra gli elementi */
}
```

#### **10.9: Pulsante Calcola**
```css
.calculate-btn {
  /* Stile glassmorphism turchese */
  background: rgba(23, 183, 177, 0.6);    /* Sfondo turchese trasparente */
  backdrop-filter: blur(10px);            /* Sfocatura del background */
  -webkit-backdrop-filter: blur(10px);   /* Supporto WebKit */
  color: #ffffff;                        /* Testo bianco */
  border: 1px solid rgba(255, 255, 255, 0.3);  /* Bordo bianco trasparente */
  
  /* Dimensioni e layout */
  padding: 1rem 2rem;                   /* Padding interno */
  border-radius: 16px;                  /* Bordi arrotondati */
  width: 100%;                          /* Larghezza completa */
  max-width: 300px;                     /* Larghezza massima */
  
  /* Tipografia */
  font-size: 1.1rem;                   /* Dimensione font grande */
  font-weight: 600;                    /* Peso font semi-bold */
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);  /* Ombra testo */
  
  /* Interattività */
  cursor: pointer;                     /* Cursore pointer */
  transition: all 0.3s ease;          /* Transizione fluida */
  
  /* Effetti visivi */
  box-shadow: 0 4px 15px rgba(23, 183, 177, 0.3);  /* Ombra turchese */
}
```

#### **10.10: Effetto Hover del Pulsante Calcola**
```css
.calculate-btn:hover {
  background: rgba(23, 183, 177, 0.8);    /* Sfondo turchese più opaco */
  transform: translateY(-3px);            /* Solleva il pulsante */
  box-shadow: 0 8px 25px rgba(23, 183, 177, 0.5);  /* Ombra turchese più forte */
  border-color: rgba(255, 255, 255, 0.5); /* Bordo bianco più opaco */
}
```

#### **10.11: Stato Disabilitato del Pulsante Calcola**
```css
.calculate-btn:disabled {
  background: rgba(108, 117, 125, 0.3);   /* Sfondo grigio trasparente */
  cursor: not-allowed;                    /* Cursore non consentito */
  transform: none;                        /* Nessuna trasformazione */
  box-shadow: none;                       /* Nessuna ombra */
  border-color: rgba(255, 255, 255, 0.1); /* Bordo bianco molto trasparente */
}
```

#### **10.12: Pulsante Modalità Scura**
```css
.dark-mode-btn {
  background-color: transparent;     /* Sfondo trasparente */
  color: var(--testo-principale);    /* Colore testo principale */
  border: 2px solid var(--grigio-scuro);  /* Bordo grigio scuro */
  padding: 0.75rem 1.5rem;          /* Padding interno */
  border-radius: 8px;               /* Bordi arrotondati */
  font-size: 1rem;                  /* Dimensione font standard */
  font-weight: 500;                 /* Peso font medium */
  cursor: pointer;                  /* Cursore pointer */
  transition: all 0.3s ease;       /* Transizione fluida */
  display: flex;                    /* Layout flexbox */
  align-items: center;              /* Allineamento verticale centrale */
  justify-content: center;          /* Allineamento orizzontale centrale */
  gap: 0.5rem;                     /* Spazio tra icona e testo */
  width: 100%;                     /* Larghezza completa */
  max-width: 300px;                /* Larghezza massima */
}

.dark-mode-btn:hover {
  background-color: var(--grigio-scuro);  /* Sfondo grigio scuro al hover */
  color: var(--bianco);                   /* Testo bianco al hover */
  transform: translateY(-1px);            /* Leggero sollevamento */
}

.dark-mode-btn.dark-mode-active {
  background-color: var(--testo-principale);  /* Sfondo scuro quando attivo */
  color: var(--bianco);                       /* Testo bianco quando attivo */
  border-color: var(--testo-principale);      /* Bordo scuro quando attivo */
}
```

---

## 💰 **SEZIONE 11: RISULTATI E PREZZI**

### **Scopo**: Stili per la visualizzazione dei risultati e dei prezzi

#### **11.1: Tratte e Tariffe in Dark Mode - Glassmorphism**
```css
.dark .tratte-card {
  background: rgba(30, 41, 59, 0.5);      /* Sfondo scuro trasparente */
  backdrop-filter: blur(15px);            /* Sfocatura del background */
  -webkit-backdrop-filter: blur(15px);    /* Supporto WebKit */
  border-color: rgba(148, 163, 184, 0.2); /* Bordo grigio chiaro trasparente */
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.6);  /* Ombra molto forte in dark mode */
}
```

#### **11.2: Form Select in Dark Mode**
```css
.dark .form-select {
  color: rgba(248, 250, 252, 0.95);      /* Testo chiaro con 95% opacità in dark mode */
}
```

#### **11.3: Titoli delle Card Tratte in Dark Mode**
```css
.dark .tratte-card h3 {
  color: rgba(255, 255, 255, 0.95);      /* Testo bianco con 95% opacità */
  border-bottom-color: rgba(255, 255, 255, 0.3);  /* Bordo inferiore bianco trasparente */
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.7);     /* Ombra testo molto forte */
}
```

#### **11.4: Titoli, Etichette e Testo in Dark Mode**
```css
.dark .card-title h1 {
  color: rgba(241, 245, 249, 0.95);      /* Testo chiaro con 95% opacità */
  text-shadow: 0 2px 15px rgba(0, 0, 0, 0.5);  /* Ombra testo forte */
}

.dark .card-title p {
  color: rgba(203, 213, 225, 0.85);      /* Testo grigio chiaro con 85% opacità */
  text-shadow: 0 1px 5px rgba(0, 0, 0, 0.3);   /* Ombra testo leggera */
}

.dark .form-label {
  color: rgba(226, 232, 240, 0.9);       /* Testo grigio molto chiaro con 90% opacità */
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);   /* Ombra testo leggera */
}
```

#### **11.5: Etichetta Prezzo in Dark Mode**
```css
.dark .price-label {
  color: rgba(203, 213, 225, 0.8);       /* Testo grigio chiaro con 80% opacità */
}
```

#### **11.6: Codice Prezzo in Dark Mode**
```css
.dark .price-code {
  color: rgba(248, 250, 252, 0.95);      /* Testo chiaro con 95% opacità */
  background: rgba(255, 255, 255, 0.05); /* Sfondo bianco molto trasparente */
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);  /* Ombra testo leggera */
}
```

#### **11.7: Elemento Tratte in Dark Mode**
```css
.dark .tratte-item {
  background: rgba(30, 41, 59, 0.6);      /* Sfondo scuro trasparente */
  backdrop-filter: blur(8px);            /* Sfocatura del background */
  -webkit-backdrop-filter: blur(8px);    /* Supporto WebKit */
  border-color: rgba(148, 163, 184, 0.3); /* Bordo grigio chiaro trasparente */
  color: rgba(248, 250, 252, 0.95);      /* Testo chiaro con 95% opacità */
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);  /* Ombra testo per leggibilità */
}
```

#### **11.8: Effetto Hover Elemento Tratte in Dark Mode**
```css
.dark .tratte-item:hover {
  background: rgba(23, 183, 177, 0.4);    /* Sfondo turchese trasparente al hover */
  backdrop-filter: blur(15px);            /* Sfocatura più forte al hover */
  -webkit-backdrop-filter: blur(15px);    /* Supporto WebKit */
  color: #ffffff;                         /* Testo bianco al hover */
  border-color: rgba(78, 205, 196, 0.5); /* Bordo turchese più chiaro al hover */
}
```

#### **11.9: Scrollbar in Dark Mode**
```css
.dark .tratte-list::-webkit-scrollbar-track {
  background: rgba(15, 23, 42, 0.3);      /* Sfondo scuro trasparente per la track */
}

.dark .tratte-list::-webkit-scrollbar-thumb {
  background: rgba(23, 183, 177, 0.6);    /* Sfondo turchese trasparente per il thumb */
}
```

#### **11.10: Barra di Ricerca in Dark Mode**
```css
.dark .search-input {
  background-color: var(--grigio-scuro);    /* Sfondo grigio scuro */
  border-color: var(--bordo);               /* Colore bordo */
  color: var(--testo-principale);           /* Colore testo principale */
}

.dark .search-input:focus {
  border-color: var(--turchese);            /* Bordo turchese al focus */
  box-shadow: 0 0 0 4px rgba(23, 183, 177, 0.2);  /* Ombra turchese al focus */
}

.dark .clear-btn:hover {
  background-color: var(--bordo);           /* Sfondo bordo al hover */
}
```

#### **11.11: Risultato Prezzo**
```css
.price-result {
  text-align: center;              /* Testo centrato */
  margin: 1.5rem 0;               /* Margine verticale */
}

.price-label {
  color: rgba(71, 85, 105, 0.8);  /* Colore grigio scuro con 80% opacità */
  font-size: 1rem;                /* Dimensione font standard */
  margin-bottom: 0.8rem;          /* Margine inferiore */
  font-weight: 500;               /* Peso font medium */
  letter-spacing: 1px;            /* Spaziatura tra lettere */
  text-transform: uppercase;      /* Testo maiuscolo */
}

.price-value {
  font-size: 4rem;                /* Dimensione font molto grande */
  font-weight: 900;               /* Peso font extra bold */
  color: #ffffff;                 /* Testo bianco */
  margin-bottom: 1rem;            /* Margine inferiore */
  text-shadow: 0 6px 20px rgba(23, 183, 177, 0.8), 0 2px 8px rgba(0, 0, 0, 0.6);  /* Ombra turchese + ombra scura */
  line-height: 1;                    /* Altezza riga compatta */
  letter-spacing: -0.02em;          /* Spaziatura lettere negativa per compattezza */
}

.price-code {
  color: rgba(15, 23, 42, 0.85);      /* Colore scuro con 85% opacità */
  font-size: 0.95rem;                 /* Dimensione font leggermente piccola */
  background: rgba(255, 255, 255, 0.1);  /* Sfondo bianco trasparente */
  padding: 0.5rem 1rem;               /* Padding interno */
  border-radius: 12px;                /* Bordi arrotondati */
  display: inline-block;              /* Display inline-block */
  backdrop-filter: blur(5px);         /* Sfocatura del background */
  -webkit-backdrop-filter: blur(5px); /* Supporto WebKit */
  font-weight: 600;                   /* Peso font semi-bold */
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);  /* Ombra testo leggera */
}
```

---

## 📚 **SEZIONE 12: CRONOLOGIA E ALTRI ELEMENTI**

### **Scopo**: Elementi aggiuntivi come cronologia, titoli delle pagine e selettori

#### **12.1: Cronologia**
```css
.history-section {
  margin-top: 2rem;                    /* Margine superiore */
}

.history-title {
  font-size: 1.2rem;                   /* Dimensione font grande */
  font-weight: 600;                    /* Peso font semi-bold */
  color: var(--testo-principale);      /* Colore testo principale */
  margin-bottom: 1rem;                 /* Margine inferiore */
}

.history-item {
  background-color: var(--grigio-chiaro);  /* Sfondo grigio chiaro */
  border: 1px solid var(--bordo);      /* Bordo */
  border-radius: 8px;                  /* Bordi arrotondati */
  padding: 1rem;                       /* Padding interno */
  margin-bottom: 0.5rem;               /* Margine inferiore */
  cursor: pointer;                     /* Cursore pointer */
  transition: all 0.3s ease;          /* Transizione fluida */
}

.history-item:hover {
  background-color: var(--grigio-medio);  /* Sfondo grigio medio al hover */
  border-color: var(--turchese);       /* Bordo turchese al hover */
}
```

#### **12.2: Titoli delle Pagine**
```css
.page-title {
  text-align: center;              /* Testo centrato */
  font-size: 2rem;                 /* Dimensione font grande */
  font-weight: 700;                /* Peso font bold */
  color: var(--testo-principale);  /* Colore testo principale */
  margin: 1rem auto 1rem;         /* Margine verticale e centratura */
  padding: 0;                      /* Nessun padding */
  letter-spacing: 0.5px;           /* Spaziatura tra lettere */
  width: 100%;                     /* Larghezza completa */
  display: block;                  /* Display a blocchi */
  max-width: 100%;                 /* Larghezza massima */
}
```

#### **12.3: Titolo Specifico per Pagine Tratte/Tariffe**
```css
.tratte-page .page-title {
  text-align: center !important;        /* Centratura forzata */
  margin: 1rem auto 1rem auto !important;  /* Margine centrato forzato */
  width: 100% !important;              /* Larghezza completa forzata */
  display: block !important;           /* Display a blocchi forzato */
  position: relative;                  /* Posizione relativa */
  left: 0;                            /* Posizione sinistra zero */
  transform: none;                     /* Nessuna trasformazione */
}
```

#### **12.4: Selettore Linea**
```css
.line-selector-container {
  max-width: 600px;                /* Larghezza massima */
  margin: 0 auto 1.5rem;          /* Margine centrato */
  padding-top: 1rem;              /* Padding superiore */
  border-top: 2px solid var(--bordo);  /* Bordo superiore */
}

.line-selector-container .search-container {
  margin-top: 1rem;               /* Margine superiore */
  margin-bottom: 0;               /* Nessun margine inferiore */
}
```

#### **12.5: FORZA il Design Glassmorphism per Tutti i Selettori**
```css
select.form-select,
#linea-tratte,
#linea-tariffe,
.line-selector-container select,
.line-search-container select {
  background: rgba(255, 255, 255, 0.25) !important;  /* Sfondo bianco trasparente forzato */
  backdrop-filter: blur(10px) !important;            /* Sfocatura forzata */
  -webkit-backdrop-filter: blur(10px) !important;    /* Supporto WebKit forzato */
  border: 1px solid rgba(255, 255, 255, 0.18) !important;  /* Bordo bianco trasparente forzato */
  border-radius: 12px !important;                    /* Bordi arrotondati forzati */
  color: rgba(15, 23, 42, 0.95) !important;         /* Colore testo scuro forzato */
  padding: 0.6rem 0.8rem !important;                 /* Padding interno forzato */
  font-size: 1rem !important;                        /* Dimensione font forzata */
  transition: all 0.3s ease !important;              /* Transizione forzata */
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37) !important;  /* Ombra glassmorphism forzata */
}
```

#### **12.6: Stato Focus Forzato per Selettori**
```css
select.form-select:focus,
#linea-tratte:focus,
#linea-tariffe:focus {
  outline: none !important;                            /* Nessun outline forzato */
  border-color: rgba(23, 183, 177, 0.5) !important;    /* Bordo turchese forzato */
  box-shadow: 0 0 0 3px rgba(23, 183, 177, 0.2) !important;  /* Ombra turchese forzata */
  background: rgba(255, 255, 255, 0.35) !important;   /* Sfondo più opaco forzato */
}
```

#### **12.7: Modalità Scura per Selettori**
```css
.dark select.form-select,
.dark #linea-tratte,
.dark #linea-tariffe,
.dark .line-selector-container select,
.dark .line-search-container select {
  background: rgba(30, 41, 59, 0.3) !important;      /* Sfondo scuro trasparente forzato */
  border: 1px solid rgba(148, 163, 184, 0.1) !important;  /* Bordo grigio chiaro forzato */
  color: rgba(248, 250, 252, 0.95) !important;       /* Testo chiaro forzato */
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.5) !important;  /* Ombra scura forzata */
}
```

#### **12.8: Focus in Modalità Scura**
```css
.dark select.form-select:focus,
.dark #linea-tratte:focus,
.dark #linea-tariffe:focus {
  border-color: rgba(23, 183, 177, 0.5) !important;    /* Bordo turchese forzato */
  background: rgba(30, 41, 59, 0.4) !important;        /* Sfondo scuro più opaco forzato */
}
```

#### **12.9: Container di Ricerca Linea**
```css
.line-search-container {
  display: flex;                   /* Layout flexbox */
  flex-direction: column;          /* Direzione verticale */
  gap: 1.5rem;                    /* Spazio tra gli elementi */
  margin-bottom: 2rem;            /* Margine inferiore */
}

.search-container {
  margin-bottom: 2rem;            /* Margine inferiore */
  display: flex;                  /* Layout flexbox */
  justify-content: center;        /* Centra orizzontalmente */
}
```

---

## 🎨 **TECNOLOGIE E DESIGN PATTERN UTILIZZATI**

### **1. Glassmorphism**
- **Sfondo trasparente**: `rgba()` con opacità bassa
- **Backdrop-filter**: `blur()` per effetto vetro
- **Bordi sottili**: Trasparenti con opacità
- **Ombreggiature**: Leggere e diffuse

### **2. Responsive Design**
- **Mobile First**: Design ottimizzato per dispositivi mobili
- **Media Queries**: Breakpoint a 600px, 900px, 992px, 1200px, 1600px
- **Flexbox e Grid**: Layout moderni e flessibili

### **3. Dark Mode**
- **Variabili CSS**: Colori dinamici per light/dark mode
- **Contrasto**: Ottimizzato per accessibilità
- **Consistenza**: Stessi pattern di design in entrambe le modalità

### **4. Animazioni**
- **Gradiente animato**: Background con movimento continuo
- **Transizioni**: Smooth per hover e focus
- **Effetti shimmer**: Pulsanti con effetti di luce

### **5. Typography**
- **Font Inter**: Google Fonts per leggibilità
- **Gerarchia**: Dimensioni e pesi font ben definiti
- **Text-shadow**: Ombre sui testi per leggibilità

---

## 🔧 **UTILIZZO E MANUTENZIONE**

### **Modifiche ai Colori**
Per modificare la palette colori, aggiornare le variabili CSS nella **SEZIONE 3**:
```css
:root {
  --turchese: #17b7b1;          /* Colore principale */
  --turchese-scuro: #0f9b96;    /* Variante scura */
  --turchese-light: #4ecdc4;    /* Variante chiara */
}
```

### **Aggiunta di Nuovi Componenti**
Seguire la struttura esistente:
1. **Glassmorphism**: Utilizzare le variabili `--glass-*`
2. **Responsive**: Aggiungere media queries appropriate
3. **Dark Mode**: Includere stili per `.dark`
4. **Commenti**: Documentare ogni sezione

### **Debug e Ottimizzazione**
- **Browser DevTools**: Utilizzare per testare modifiche
- **Performance**: Monitorare l'uso di `backdrop-filter`
- **Accessibilità**: Verificare contrasti e focus states

---

## 📱 **COMPATIBILITÀ BROWSER**

### **Supporto Completo**
- ✅ Chrome 76+
- ✅ Firefox 103+
- ✅ Safari 14+
- ✅ Edge 79+

### **Funzionalità Progressive**
- **Backdrop-filter**: Fallback per browser non supportati
- **CSS Grid**: Fallback con Flexbox
- **Custom Properties**: Fallback con valori statici

---

## 🎯 **CONCLUSIONI**

Il file `style.css` del progetto **TPL FVG Autisti** rappresenta un esempio moderno di design system basato su **Glassmorphism** e **Responsive Design**. La struttura modulare e la documentazione dettagliata facilitano la manutenzione e l'estensione del codice.

### **Punti di Forza**
- **Design moderno**: Glassmorphism con palette colori coerente
- **Accessibilità**: Dark mode e contrasti ottimizzati
- **Performance**: CSS ottimizzato con variabili e media queries
- **Manutenibilità**: Struttura modulare e documentazione completa

### **Aree di Miglioramento Futuro**
- **CSS Custom Properties**: Espansione per temi personalizzati
- **Container Queries**: Supporto per layout più avanzati
- **CSS Grid**: Utilizzo più estensivo per layout complessi

---

*Documentazione generata automaticamente per il progetto TPL FVG Autisti v0.8 build 21*

