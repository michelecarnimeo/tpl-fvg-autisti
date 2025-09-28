// --- LOGICA ADMIN (solo se siamo su admin.html) ---
const adminLineaSelect = document.getElementById('admin-linea');
const adminPrezziDiv = document.getElementById('admin-prezzi');
const adminSaveBtn = document.getElementById('admin-save');
const adminJsonDiv = document.getElementById('admin-json');
const adminNomiLineeDiv = document.getElementById('admin-nomi-linee');

if (adminLineaSelect && adminPrezziDiv && adminSaveBtn && adminJsonDiv && adminNomiLineeDiv) {
    // Siamo in admin.html
    function popolaAdminLinee() {
        adminLineaSelect.innerHTML = '<option value="">Seleziona una linea</option>';
        tariffario.forEach((linea, idx) => {
            const opt = document.createElement('option');
            opt.value = idx;
            opt.textContent = linea.nome;
            adminLineaSelect.appendChild(opt);
        });
        adminPrezziDiv.innerHTML = '';
        adminJsonDiv.style.display = 'none';
    }

    function popolaNomiLinee() {
        adminNomiLineeDiv.innerHTML = '';
        tariffario.forEach((linea, idx) => {
            const div = document.createElement('div');
            div.className = 'flex items-center space-x-3 mb-2';
            div.innerHTML = `
                <label class="w-24 text-sm font-medium">Linea ${idx + 1}:</label>
                <input type="text" value="${linea.nome}" data-linea-idx="${idx}" class="flex-1 px-3 py-2 bg-input-light dark:bg-input-dark border border-border-light dark:border-border-dark rounded-lg" />
            `;
            adminNomiLineeDiv.appendChild(div);
        });
    }

    function popolaTabellaPrezzi(lineaIdx) {
        const linea = tariffario[lineaIdx];
        const fermate = linea.fermate;
        let html = '<div class="overflow-x-auto"><table class="w-full border-collapse border border-border-light dark:border-border-dark"><thead><tr class="bg-gray-50 dark:bg-gray-800">';
        html += '<th class="border border-border-light dark:border-border-dark p-2 text-left font-medium"></th>';
        fermate.forEach(f => { 
            html += `<th class="border border-border-light dark:border-border-dark p-2 text-center font-medium text-sm">${f}</th>`; 
        });
        html += '</tr></thead><tbody>';
        fermate.forEach((fPart, i) => {
            html += `<tr class="hover:bg-gray-50 dark:hover:bg-gray-800"><th class="border border-border-light dark:border-border-dark p-2 text-left font-medium text-sm">${fPart}</th>`;
            fermate.forEach((fArr, j) => {
                if (i === j) {
                    html += '<td class="border border-border-light dark:border-border-dark p-2 text-center bg-gray-100 dark:bg-gray-700">—</td>';
                } else {
                    html += `<td class="border border-border-light dark:border-border-dark p-2 text-center"><input type="number" min="0" step="0.01" value="${linea.prezzi[i][j]}" data-partenza="${i}" data-arrivo="${j}" data-linea="${lineaIdx}" class="w-20 px-2 py-1 text-center bg-input-light dark:bg-input-dark border border-border-light dark:border-border-dark rounded" /></td>`;
                }
            });
            html += '</tr>';
        });
        html += '</tbody></table></div>';
        adminPrezziDiv.innerHTML = html;
        // Listener per ogni input
        adminPrezziDiv.querySelectorAll('input[type="number"]').forEach(input => {
            input.addEventListener('change', function() {
                const l = parseInt(this.dataset.linea);
                const p = parseInt(this.dataset.partenza);
                const a = parseInt(this.dataset.arrivo);
                const val = parseFloat(this.value);
                tariffario[l].prezzi[p][a] = isNaN(val) ? 0 : val;
            });
        });
    }

    function salvaModifiche() {
        const json = JSON.stringify(tariffario, null, 2);
        adminJsonDiv.textContent = json;
        adminJsonDiv.style.display = 'block';
    }

    function salvaNomiLinee() {
        const inputs = adminNomiLineeDiv.querySelectorAll('input[type="text"]');
        inputs.forEach(input => {
            const lineaIdx = parseInt(input.dataset.lineaIdx);
            const nuovoNome = input.value.trim();
            if (nuovoNome && nuovoNome !== tariffario[lineaIdx].nome) {
                tariffario[lineaIdx].nome = nuovoNome;
            }
        });
        popolaAdminLinee();
        popolaNomiLinee();
        const conferma = document.createElement('div');
        conferma.className = 'mt-2 p-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded text-sm';
        conferma.textContent = 'Nomi delle linee salvati con successo!';
        adminNomiLineeDiv.appendChild(conferma);
        setTimeout(() => { if (conferma.parentNode) conferma.parentNode.removeChild(conferma); }, 3000);
    }

    // Event listeners admin
    adminLineaSelect.addEventListener('change', function() {
        const idx = this.value;
        if (idx === "") {
            adminPrezziDiv.innerHTML = '';
            return;
        }
        popolaTabellaPrezzi(idx);
        adminJsonDiv.style.display = 'none';
    });

    adminSaveBtn.addEventListener('click', salvaModifiche);

    adminNomiLineeDiv.addEventListener('input', function() {
        // no-op, nomi applicati solo quando si clicca 'Salva modifiche'
    });

    // Inizializza admin dopo aver caricato i dati
    function initAdmin() {
        popolaAdminLinee();
        popolaNomiLinee();
    }

    // Dopo aver caricato tariffario, chiama initAdmin
    // Modifica la funzione di fetch per chiamare initAdmin
    // Quindi, dopo popolaLinee(), aggiungi:
    const oldPopolaLinee = popolaLinee;
    popolaLinee = function() {
        oldPopolaLinee();
        initAdmin();
    };
}
let tariffario = [];

const lineaSelect = document.getElementById('linea');
const partenzaSelect = document.getElementById('partenza');
const arrivoSelect = document.getElementById('arrivo');
const calcolaBtn = document.getElementById('calcola');
// Rimosso prezzoDiv: usiamo solo summary-prezzo e prezzo-errore
// elementi di riepilogo (sincronizzati con la UI)
const summaryPartenza = document.getElementById('summary-partenza');
const summaryArrivo = document.getElementById('summary-arrivo');
const summaryPrezzo = document.getElementById('summary-prezzo');
const summaryCodice = document.getElementById('summary-codice');

// Admin moved to a separate page (admin.html). Admin DOM elements and functions removed from this script.

// --- SWAP PARTENZA/ARRIVO ---
const swapBtn = document.getElementById('swap-btn');

// --- DARK MODE ---
const darkModeBtn = document.getElementById('darkmode-toggle');

// --- INIZIALIZZAZIONE ADATTIVA ---
// Se c'è una welcome page con pulsanti, la rispettiamo; altrimenti inizializziamo subito l'app
const welcomePage = document.getElementById('welcome-page');
const mainApp = document.getElementById('main-app');
const startAppBtn = document.getElementById('start-app');
const backToWelcomeBtn = document.getElementById('back-to-welcome');
const darkModeWelcomeBtn = document.getElementById('darkmode-toggle-welcome');

async function initApp() {
    try {
    // Carica database.json
    const res = await fetch('database.json');
        tariffario = await res.json();
        // Prova a caricare anche tariffario aggiornato.json se esiste
        try {
            const res2 = await fetch('tariffario aggiornato.json');
            if (res2.ok) {
                window.tariffarioAggiornato = await res2.json();
            }
        } catch (e) {
            window.tariffarioAggiornato = null;
        }
        popolaLinee();
    } catch (err) {
        const erroreDiv = document.getElementById('prezzo-errore');
        if (erroreDiv) {
            erroreDiv.textContent = 'Errore nel caricamento dei dati.';
            erroreDiv.style.display = 'block';
        }
        if (summaryPrezzo) summaryPrezzo.textContent = '-';
        if (lineaSelect) lineaSelect.disabled = true;
    }
    updateDarkModeButtons();
    // inizializza i placeholder dei riepiloghi
    if (summaryPartenza) summaryPartenza.textContent = '-';
    if (summaryArrivo) summaryArrivo.textContent = '-';
    if (summaryPrezzo) summaryPrezzo.textContent = '-';
}

// Se esistono i pulsanti di navigazione, colleghiamo i listener (retrocompatibilità)
if (startAppBtn) {
    startAppBtn.addEventListener('click', function() {
        if (mainApp && welcomePage) {
            welcomePage.style.display = 'none';
            mainApp.style.display = 'flex';
        }
        initApp();
    });
} else {
    // altrimenti inizializza subito
    initApp();
}

if (backToWelcomeBtn && welcomePage && mainApp) {
    backToWelcomeBtn.addEventListener('click', function() {
        welcomePage.style.display = 'flex';
        mainApp.style.display = 'none';
    });
}

// Popola il dropdown delle linee
function popolaLinee() {
    lineaSelect.innerHTML = '<option value="">Seleziona una linea</option>';
    tariffario.forEach((linea, idx) => {
        const opt = document.createElement('option');
        opt.value = idx;
        opt.textContent = linea.nome;
        lineaSelect.appendChild(opt);
    });
}

// Popola le fermate in base alla linea scelta
function popolaFermate(lineaIdx) {
    partenzaSelect.innerHTML = '<option value="">Seleziona la partenza</option>';
    arrivoSelect.innerHTML = '<option value="">Seleziona l\'arrivo</option>';
    if (lineaIdx === "") {
        partenzaSelect.disabled = true;
        arrivoSelect.disabled = true;
        calcolaBtn.disabled = true;
        return;
    }
    const fermate = tariffario[lineaIdx].fermate;
    fermate.forEach((f, idx) => {
        const opt1 = document.createElement('option');
        opt1.value = idx;
        opt1.textContent = f;
        partenzaSelect.appendChild(opt1);
        const opt2 = document.createElement('option');
        opt2.value = idx;
        opt2.textContent = f;
        arrivoSelect.appendChild(opt2);
    });
    partenzaSelect.disabled = false;
    arrivoSelect.disabled = false;
    calcolaBtn.disabled = true;
}

// Abilita il pulsante solo se partenza e arrivo sono validi e diversi
function controllaSelezioni() {
    if (
        lineaSelect.value !== "" &&
        partenzaSelect.value !== "" &&
        arrivoSelect.value !== "" &&
        partenzaSelect.value !== arrivoSelect.value
    ) {
        calcolaBtn.disabled = false;
        // Abilita il pulsante di swap quando ci sono selezioni valide
        if (swapBtn) swapBtn.disabled = false;
    } else {
        calcolaBtn.disabled = true;
        if (swapBtn) swapBtn.disabled = true;
    }
    // Rimosso prezzoElement: usiamo solo summary-prezzo e prezzo-errore
    const erroreDiv = document.getElementById('prezzo-errore');
    if (erroreDiv) erroreDiv.style.display = 'none';
    // se il calcolo non è disponibile, azzera il riepilogo prezzo
    if (summaryPrezzo && calcolaBtn.disabled) {
        summaryPrezzo.textContent = '-';
    }
    // aggiorna i riassunti visivi
    if (summaryPartenza) {
        summaryPartenza.textContent = (partenzaSelect && partenzaSelect.value !== "") ? partenzaSelect.options[partenzaSelect.selectedIndex].text : '-';
    }
    if (summaryArrivo) {
        summaryArrivo.textContent = (arrivoSelect && arrivoSelect.value !== "") ? arrivoSelect.options[arrivoSelect.selectedIndex].text : '-';
    }
}

// Calcola e mostra il prezzo
function mostraPrezzo() {
    const lineaIdx = parseInt(lineaSelect.value);
    const partenzaIdx = parseInt(partenzaSelect.value);
    const arrivoIdx = parseInt(arrivoSelect.value);
    console.log('Linea:', lineaIdx, 'Partenza:', partenzaIdx, 'Arrivo:', arrivoIdx);
    let prezzo = null;
    let codice = '';
    try {
        prezzo = tariffario[lineaIdx].prezzi[partenzaIdx][arrivoIdx];
        if (tariffario[lineaIdx].codici && tariffario[lineaIdx].codici[partenzaIdx]) {
            codice = tariffario[lineaIdx].codici[partenzaIdx][arrivoIdx];
        }
    } catch (e) {
        prezzo = null;
        codice = '';
    }
    const erroreDiv = document.getElementById('prezzo-errore');
    if (prezzo !== null && !isNaN(prezzo)) {
        if (summaryPrezzo) summaryPrezzo.textContent = `${prezzo.toFixed(2)} €`;
        if (erroreDiv) erroreDiv.style.display = 'none';
    } else {
        if (summaryPrezzo) summaryPrezzo.textContent = '-';
        if (erroreDiv) {
            erroreDiv.textContent = 'Attenzione: prezzo non disponibile per questa tratta.';
            erroreDiv.style.display = 'block';
        }
    }
    if (summaryPartenza) summaryPartenza.textContent = partenzaSelect.options[partenzaSelect.selectedIndex].text;
    if (summaryArrivo) summaryArrivo.textContent = arrivoSelect.options[arrivoSelect.selectedIndex].text;
    if (summaryCodice) {
        // fallback: cerca in tariffario aggiornato.json se presente
        if (!codice && window.tariffarioAggiornato) {
            const partenza = partenzaSelect.options[partenzaSelect.selectedIndex].text;
            const arrivo = arrivoSelect.options[arrivoSelect.selectedIndex].text;
            const match = window.tariffarioAggiornato.find(e => e.partenza === partenza && e.arrivo === arrivo);
            if (match) {
                codice = match.codice_biglietto;
            }
        }
        summaryCodice.textContent = codice ? `Codice biglietto: ${codice}` : 'Codice non disponibile';
    }
    console.log('Prezzo:', prezzo, 'Codice:', codice);
}

// Popola il select delle linee in area admin
// Admin functions moved to admin.html/admin.js

// Event listeners
lineaSelect.addEventListener('change', function() {
    popolaFermate(this.value);
    controllaSelezioni();
});
partenzaSelect.addEventListener('change', controllaSelezioni);
arrivoSelect.addEventListener('change', controllaSelezioni);
calcolaBtn.addEventListener('click', mostraPrezzo);

// Funzione per invertire partenza e arrivo
if (swapBtn) {
    swapBtn.addEventListener('click', function() {
        const pVal = partenzaSelect.value;
        const aVal = arrivoSelect.value;
        // scambia i valori
        partenzaSelect.value = aVal;
        arrivoSelect.value = pVal;
        // aggiorna lo stato del bottone e mostra prezzo se possibile
        controllaSelezioni();
        if (!calcolaBtn.disabled) {
            mostraPrezzo();
        }
    });
}

// Admin event listeners moved to admin.html/admin.js

// Nota: l'inizializzazione dell'app viene eseguita da initApp() all'avvio

// Funzione per aggiornare tutti i pulsanti di modalità scura
function updateDarkModeButtons() {
    const isDark = document.documentElement.classList.contains('dark');
    
    // Pulsante nell'header principale
    const mainIcon = darkModeBtn.querySelector('.material-symbols-outlined');
    if (mainIcon) {
        mainIcon.textContent = isDark ? 'light_mode' : 'dark_mode';
    }
    
    // Pulsante nella pagina di benvenuto
    const welcomeIcon = darkModeWelcomeBtn.querySelector('.material-symbols-outlined');
    const welcomeText = darkModeWelcomeBtn.childNodes[2];
    if (welcomeIcon) {
        welcomeIcon.textContent = isDark ? 'light_mode' : 'dark_mode';
    }
    if (welcomeText && welcomeText.textContent) {
        welcomeText.textContent = isDark ? 'Modalità Chiara' : 'Modalità Scura';
    }
}

// --- DARK MODE ---
darkModeBtn.addEventListener('click', function() {
    document.documentElement.classList.toggle('dark');
    updateDarkModeButtons();
});

darkModeWelcomeBtn.addEventListener('click', function() {
    document.documentElement.classList.toggle('dark');
    updateDarkModeButtons();
});