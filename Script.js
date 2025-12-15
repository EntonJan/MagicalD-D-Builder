// --- KONFIGURATION ---
const FIELD_IDS = [
    'charName', 'charRace', 'charClass', 'classEffect', 'charImage',
    'ac', 'speed', 'gold',
    'weaponName', 'weaponEffect', 'inventory',
    'cantripName', 'cantripEffect',
    'spell1Name', 'spell1Used', 'spell1Effect',
    'spell2Name', 'spell2Used', 'spell2Effect'
];

// STATE
let characters = [];
let currentId = null;

// --- ELEMENTE ---
const dashboard = document.getElementById('dashboard');
const editor = document.getElementById('character-editor');
const charList = document.getElementById('charList');
const createBtn = document.getElementById('createCharBtn');
const backBtn = document.getElementById('backBtn');
const saveBtn = document.getElementById('saveBtn');
const deleteBtn = document.getElementById('deleteBtn');
const displayImage = document.getElementById('displayImage');
const imageInput = document.getElementById('charImage');

// --- INIT ---
document.addEventListener('DOMContentLoaded', () => {
    loadAllChars();
    renderDashboard();
});

// --- NAVIGATION & LOGIK ---

createBtn.addEventListener('click', () => {
    // Neuen leeren Charakter erstellen
    const newId = Date.now().toString(); // Simple einzigartige ID
    const newChar = { id: newId, charName: 'Neuer Held' };
    characters.push(newChar);
    saveAllToStorage();
    openEditor(newId);
});

backBtn.addEventListener('click', () => {
    saveCurrentChar(); // Auto-Save beim Zurückgehen
    showDashboard();
});

saveBtn.addEventListener('click', () => {
    saveCurrentChar();
    alert("Gespeichert!");
});

deleteBtn.addEventListener('click', () => {
    if(confirm("Diesen Charakter unwiderruflich löschen?")) {
        characters = characters.filter(c => c.id !== currentId);
        saveAllToStorage();
        showDashboard();
    }
});

// Bild-Update Logik
imageInput.addEventListener('input', () => {
    if(imageInput.value) {
        displayImage.src = imageInput.value;
    } else {
        displayImage.src = "https://via.placeholder.com/300x400?text=Kein+Bild";
    }
});

// Fehler beim Laden des Bildes abfangen
displayImage.addEventListener('error', () => {
    displayImage.src = "https://via.placeholder.com/300x400?text=Fehler";
});

// --- FUNKTIONEN ---

function loadAllChars() {
    const data = localStorage.getItem('rpg_characters');
    if (data) {
        characters = JSON.parse(data);
    }
}

function saveAllToStorage() {
    localStorage.setItem('rpg_characters', JSON.stringify(characters));
}

function renderDashboard() {
    // Liste leeren (bis auf den "Neu" Button)
    const existingCards = document.querySelectorAll('.char-card:not(.new-char)');
    existingCards.forEach(card => card.remove());

    characters.forEach(char => {
        const card = document.createElement('div');
        card.className = 'char-card';
        
        // Bild für Karte (oder Placeholder)
        const imgSrc = char.charImage || "https://via.placeholder.com/150?text=?";
        
        card.innerHTML = `
            <img src="${imgSrc}" class="char-preview-img" onerror="this.src='https://via.placeholder.com/150?text=?'">
            <h3>${char.charName || 'Namenlos'}</h3>
            <p style="color:#888; font-size:0.9rem">${char.charClass || 'Keine Klasse'}</p>
            <p style="color:#d4af37; font-size:0.8rem">Lvl ${char.level || '1'}</p>
        `;
        
        card.addEventListener('click', () => openEditor(char.id));
        
        // Füge die Karte VOR dem "Neu"-Button ein
        charList.insertBefore(card, createBtn);
    });
}

function openEditor(id) {
    currentId = id;
    const char = characters.find(c => c.id === id);
    if (!char) return;

    // Felder befüllen
    FIELD_IDS.forEach(fieldId => {
        const el = document.getElementById(fieldId);
        if (el) {
            if (el.type === 'checkbox') {
                el.checked = char[fieldId] || false;
            } else {
                el.value = char[fieldId] || '';
            }
        }
    });

    // Bild aktualisieren
    displayImage.src = char.charImage || "https://via.placeholder.com/300x400?text=Kein+Bild";

    // View wechseln
    dashboard.classList.remove('active');
    dashboard.classList.add('hidden');
    editor.classList.remove('hidden');
    editor.classList.add('active');
}

function showDashboard() {
    currentId = null;
    editor.classList.remove('active');
    editor.classList.add('hidden');
    dashboard.classList.remove('hidden');
    dashboard.classList.add('active');
    renderDashboard();
}

function saveCurrentChar() {
    if (!currentId) return;

    // Finde den Index des aktuellen Charakters im Array
    const index = characters.findIndex(c => c.id === currentId);
    if (index === -1) return;

    // Daten aus Inputs lesen
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

    // Array aktualisieren
    characters[index] = updatedChar;
    saveAllToStorage();
}
