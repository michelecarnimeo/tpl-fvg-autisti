let tariffario = [];

const lineaSelect = document.getElementById('linea');
const partenzaSelect = document.getElementById('partenza');
const arrivoSelect = document.getElementById('arrivo');
const calcolaBtn = document.getElementById('calcola');
const prezzoDiv = document.getElementById('prezzo');

// --- SEZIONE ADMIN ---
const adminToggle = document.getElementById('admin-toggle');
const adminPanel = document.getElementById('admin-panel');
const adminLineaSelect = document.getElementById('admin-linea');
const adminPrezziDiv = document.getElementById('admin-prezzi');
const adminSaveBtn = document.getElementById('admin-save');
const adminJsonDiv = document.getElementById('admin-json');

// --- DARK MODE ---
const darkModeBtn = document.getElementById('darkmode-toggle');

<<<<<<< HEAD
// --- WELCOME PAGE ---
const welcomePage = document.getElementById('welcome-page');
const mainApp = document.getElementById('main-app');
const startAppBtn = document.getElementById('start-app');
const backToWelcomeBtn = document.getElementById('back-to-welcome');
const darkModeWelcomeBtn = document.getElementById('darkmode-toggle-welcome');

// Funzioni per la navigazione tra pagine
function showWelcomePage() {
    welcomePage.style.display = 'flex';
    mainApp.style.display = 'none';
}

function showMainApp() {
    welcomePage.style.display = 'none';
    mainApp.style.display = 'flex';
}

// Event listeners per la navigazione
startAppBtn.addEventListener('click', function() {
    showMainApp();
    // Inizializza l'app se non è già stata inizializzata
    if (tariffario.length === 0) {
        fetch('tariffario.json')
            .then(response => response.json())
            .then(data => {
                tariffario = data;
                popolaLinee();
            })
            .catch(err => {
                const prezzoElement = prezzoDiv.querySelector('p');
                if (prezzoElement) {
                    prezzoElement.textContent = 'Errore nel caricamento dei dati.';
                    prezzoElement.className = 'text-red-500 text-lg mt-2';
                }
                lineaSelect.disabled = true;
            });
    }
});

backToWelcomeBtn.addEventListener('click', function() {
    showWelcomePage();
});


=======
>>>>>>> b96f21f8aaeb4504219ce2aa4f13697d96c59fb4
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
    } else {
        calcolaBtn.disabled = true;
    }
<<<<<<< HEAD
    const prezzoElement = prezzoDiv.querySelector('p');
    if (prezzoElement) {
        prezzoElement.textContent = "";
    }
=======
    prezzoDiv.textContent = "";
>>>>>>> b96f21f8aaeb4504219ce2aa4f13697d96c59fb4
}

// Calcola e mostra il prezzo
function mostraPrezzo() {
    const lineaIdx = parseInt(lineaSelect.value);
    const partenzaIdx = parseInt(partenzaSelect.value);
    const arrivoIdx = parseInt(arrivoSelect.value);
    const prezzo = tariffario[lineaIdx].prezzi[partenzaIdx][arrivoIdx];
<<<<<<< HEAD
    const prezzoElement = prezzoDiv.querySelector('p');
    prezzoElement.textContent = `${prezzo.toFixed(2)} €`;
=======
    prezzoDiv.textContent = `Prezzo: € ${prezzo.toFixed(2)}`;
>>>>>>> b96f21f8aaeb4504219ce2aa4f13697d96c59fb4
}

// Popola il select delle linee in area admin
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

// Mostra la tabella prezzi modificabile per la linea scelta
function popolaTabellaPrezzi(lineaIdx) {
    const linea = tariffario[lineaIdx];
    const fermate = linea.fermate;
<<<<<<< HEAD
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
                html += `<td class="border border-border-light dark:border-border-dark p-2 text-center"><input type="number" min="0" step="0.01" value="${linea.prezzi[i][j]}" data-partenza="${i}" data-arrivo="${j}" data-linea="${lineaIdx}" class="w-20 px-2 py-1 text-center bg-input-light dark:bg-input-dark border border-border-light dark:border-border-dark rounded focus:ring-2 focus:ring-primary focus:border-primary" /></td>`;
=======
    let html = '<table><thead><tr><th></th>';
    fermate.forEach(f => { html += `<th>${f}</th>`; });
    html += '</tr></thead><tbody>';
    fermate.forEach((fPart, i) => {
        html += `<tr><th>${fPart}</th>`;
        fermate.forEach((fArr, j) => {
            if (i === j) {
                html += '<td style="background:#eee">—</td>';
            } else {
                html += `<td><input type="number" min="0" step="0.01" value="${linea.prezzi[i][j]}" data-partenza="${i}" data-arrivo="${j}" data-linea="${lineaIdx}" /></td>`;
>>>>>>> b96f21f8aaeb4504219ce2aa4f13697d96c59fb4
            }
        });
        html += '</tr>';
    });
<<<<<<< HEAD
    html += '</tbody></table></div>';
=======
    html += '</tbody></table>';
>>>>>>> b96f21f8aaeb4504219ce2aa4f13697d96c59fb4
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

// Salva modifiche e mostra JSON aggiornato
function salvaModifiche() {
    const json = JSON.stringify(tariffario, null, 2);
    adminJsonDiv.textContent = json;
    adminJsonDiv.style.display = 'block';
}

// Event listeners
lineaSelect.addEventListener('change', function() {
    popolaFermate(this.value);
    controllaSelezioni();
});
partenzaSelect.addEventListener('change', controllaSelezioni);
arrivoSelect.addEventListener('change', controllaSelezioni);
calcolaBtn.addEventListener('click', mostraPrezzo);

// Mostra/nasconde il pannello admin
adminToggle.addEventListener('click', function() {
    if (adminPanel.style.display === 'none') {
        adminPanel.style.display = 'block';
        popolaAdminLinee();
    } else {
        adminPanel.style.display = 'none';
        adminJsonDiv.style.display = 'none';
    }
});

// Mostra la tabella prezzi modificabile per la linea scelta
adminLineaSelect.addEventListener('change', function() {
    const idx = this.value;
    if (idx === "") {
        adminPrezziDiv.innerHTML = '';
        return;
    }
    popolaTabellaPrezzi(idx);
    adminJsonDiv.style.display = 'none';
});

// Salva modifiche e mostra JSON aggiornato
adminSaveBtn.addEventListener('click', salvaModifiche);

<<<<<<< HEAD
// Inizializzazione: mostra la pagina di benvenuto
showWelcomePage();
updateDarkModeButtons();

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
=======
// Carica i dati dal file JSON e inizializza
fetch('tariffario.json')
    .then(response => response.json())
    .then(data => {
        tariffario = data;
        popolaLinee();
    })
    .catch(err => {
        prezzoDiv.textContent = 'Errore nel caricamento dei dati.';
        lineaSelect.disabled = true;
    });

// --- DARK MODE ---
darkModeBtn.addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
    if(document.body.classList.contains('dark-mode')) {
        darkModeBtn.textContent = '☀️ Modalità Chiara';
    } else {
        darkModeBtn.textContent = '🌙 Modalità Scura';
    }
>>>>>>> b96f21f8aaeb4504219ce2aa4f13697d96c59fb4
});
