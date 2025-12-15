// --- KONFIGURATION ---
// Diese Liste enthält alle IDs der Eingabefelder, die gespeichert werden sollen.
const FIELD_IDS = [
    'charName', 'charRace', 'charClass',
    'ac', 'speed', 'gold',
    'weaponName', 'weaponEffect', 'inventory',
    'classEffect',
    'cantripName', 'cantripEffect',
    'spell1Name', 'spell1Used', 'spell1Effect',
    'spell2Name', 'spell2Used', 'spell2Effect'
];

// --- STATUS ---
let characters = []; // Hier werden alle Charaktere geladen
let currentId = null; // Die ID des aktuell geöffneten Charakters

// --- DOM ELEMENTE (Verweise auf das HTML) ---
const dashboardView = document.getElementById('dashboard');
const editorView = document.getElementById('character-editor');
const charListContainer = document.getElementById('charList');
const createBtn = document.getElementById('createCharBtn');
const backBtn = document.getElementById('backBtn');
const saveBtn = document.getElementById('saveBtn');
const deleteBtn = document.getElementById('deleteBtn');

// --- INITIALISIERUNG ---
// Wird ausgeführt, sobald die Seite geladen ist.
document.addEventListener('DOMContentLoaded', () => {
    loadAllCharsFromStorage();
    renderDashboard();
});

// --- EVENT LISTENER (Reaktionen auf Klicks) ---

// Klick auf "Neuer Charakter"
createBtn.addEventListener('click', () => {
    const newId = Date.now().toString(); // Erzeugt eine eindeutige ID basierend auf der Zeit
    const newChar = { id: newId, charName: '' }; // Leerer neuer Charakter
    characters.push(newChar);
    saveAllToStorage(); // Speichern, damit er nicht verloren geht
    openEditor(newId); // Öffnet den Editor für den neuen Charakter
});

// Klick auf "Zurück zum Menü"
backBtn.addEventListener('click', () => {
    saveCurrentChar(); // Automatisch speichern beim Verlassen
    showDashboard();
});

// Klick auf "Speichern"
saveBtn.addEventListener('click', () => {
    saveCurrentChar();
    // Kurzes visuelles Feedback (optional, aber nett)
    const originalText = saveBtn.innerText;
    saveBtn.innerText = "✅ Gespeichert!";
    setTimeout(() => { saveBtn.innerText = originalText; }, 1500);
});

// Klick auf "Löschen"
deleteBtn.addEventListener('click', () => {
    if(confirm("Möchtest du diesen Charakter wirklich unwiderruflich löschen?")) {
        // Filtert den aktuellen Charakter aus der Liste heraus
        characters = characters.filter(c => c.id !== currentId);
        saveAllToStorage();
        showDashboard();
    }
});


// --- FUNKTIONEN ---

// Lädt alle gespeicherten Charaktere aus dem Browser-Speicher (localStorage)
function loadAllCharsFromStorage() {
    const data = localStorage.getItem('rpg_characters_v2');
    if (data) {
        characters = JSON.parse(data);
    } else {
        characters = [];
    }
}

// Speichert die gesamte Charakterliste in den Browser-Speicher
function saveAllToStorage() {
    localStorage.setItem('rpg_characters_v2', JSON.stringify(characters));
}

// Zeichnet das Hauptmenü (Dashboard) mit den Charakter-Karten
function renderDashboard() {
    // Entfernt alle alten Karten, außer dem "Neu"-Button
    const existingCards = document.querySelectorAll('.char-card.generated');
    existingCards.forEach(card => card.remove());

    // Erstellt für jeden Charakter eine Karte
    characters.forEach(char => {
        const card = document.createElement('div');
        card.className = 'char-card generated'; // 'generated' Klasse zum leichteren Finden
        
        // Der Inhalt der Karte
        const name = char.charName || 'Namenloser Held';
        const details = char.charClass ? char.charClass : 'Keine Klasse';

        card.innerHTML = `
            <div style="font-size: 3rem; margin-bottom: 10px;">🧙‍♂️</div>
            <h3>${name}</h3>
            <p>${details}</p>
        `;
        
        // Klick auf die Karte öffnet den Editor
        card.addEventListener('click', () => openEditor(char.id));
        
        // Fügt die Karte VOR dem "Neu"-Button ein
        charListContainer.insertBefore(card, createBtn);
    });
}

// Öffnet den Editor für einen bestimmten Charakter
function openEditor(id) {
    currentId = id;
    const char = characters.find(c => c.id === id);
    if (!char) return; // Sollte nicht passieren, aber zur Sicherheit

    // 1. Formularfelder leeren
    FIELD_IDS.forEach(fieldId => {
        const el = document.getElementById(fieldId);
        if(el) {
            if(el.type === 'checkbox') el.checked = false;
            else el.value = '';
        }
    });

    // 2. Formularfelder mit den Daten des Charakters befüllen
    FIELD_IDS.forEach(fieldId => {
        const el = document.getElementById(fieldId);
        if (el && char[fieldId] !== undefined) {
            if (el.type === 'checkbox') {
                el.checked = char[fieldId];
            } else {
                el.value = char[fieldId];
            }
        }
    });

    // 3. Ansicht wechseln
    dashboardView.classList.remove('active');
    dashboardView.classList.add('hidden');
    editorView.classList.remove('hidden');
    editorView.classList.add('active');
    window.scrollTo(0, 0); // Nach oben scrollen
}

// Wechselt zurück zum Hauptmenü
function showDashboard() {
    currentId = null;
    editorView.classList.remove('active');
    editorView.classList.add('hidden');
    dashboardView.classList.remove('hidden');
    dashboardView.classList.add('active');
    renderDashboard(); // Menü neu zeichnen, um Änderungen (z.B. Namen) anzuzeigen
}

// Speichert die aktuellen Daten aus dem Editor in das Charakter-Objekt
function saveCurrentChar() {
    if (!currentId) return;

    // Findet den Charakter in der Liste
    const index = characters.findIndex(c => c.id === currentId);
    if (index === -1) return;

    // Aktualisiert das Charakter-Objekt mit den Daten aus den Eingabefeldern
    const updatedChar = { id: currentId };
    FIELD_IDS.forEach(fieldId => {
        const el = document.getElementById(fieldId);
        if (el) {
            if (el.type === 'checkbox') {
                updatedChar[fieldId] = el.checked;
            } else {
                updatedChar[fieldId] = el.value;
            }
        }
    });

    // Ersetzt den alten Charakter in der Liste durch den aktualisierten
    characters[index] = updatedChar;
    saveAllToStorage();
}
