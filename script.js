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
    prezzoDiv.textContent = "";
}

// Calcola e mostra il prezzo
function mostraPrezzo() {
    const lineaIdx = parseInt(lineaSelect.value);
    const partenzaIdx = parseInt(partenzaSelect.value);
    const arrivoIdx = parseInt(arrivoSelect.value);
    const prezzo = tariffario[lineaIdx].prezzi[partenzaIdx][arrivoIdx];
    prezzoDiv.textContent = `Prezzo: € ${prezzo.toFixed(2)}`;
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
            }
        });
        html += '</tr>';
    });
    html += '</tbody></table>';
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
});
