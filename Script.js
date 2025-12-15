document.addEventListener('DOMContentLoaded', () => {
    loadCharacter();
});

const saveBtn = document.getElementById('saveBtn');
const resetBtn = document.getElementById('resetBtn');
const statusMsg = document.getElementById('statusMsg');

// Alle IDs der Felder, die wir speichern wollen
const fieldIds = [
    'charName', 'charRace', 'charClass', 'classEffect',
    'ac', 'speed', 'gold',
    'cantripName', 'cantripEffect',
    'spell1Name', 'spell1Effect', 'spell1Used',
    'spell2Name', 'spell2Effect', 'spell2Used',
    'weaponName', 'weaponEffect', 'inventory'
];

// SPEICHERN
saveBtn.addEventListener('click', () => {
    const charData = {};

    fieldIds.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            if (element.type === 'checkbox') {
                charData[id] = element.checked;
            } else {
                charData[id] = element.value;
            }
        }
    });

    // Speichert als JSON String im LocalStorage des Browsers
    localStorage.setItem('myHomebrewChar', JSON.stringify(charData));
    
    // Visuelles Feedback
    statusMsg.innerText = "Charakter erfolgreich gespeichert!";
    setTimeout(() => { statusMsg.innerText = ""; }, 3000);
});

// LADEN
function loadCharacter() {
    const savedData = localStorage.getItem('myHomebrewChar');
    
    if (savedData) {
        const charData = JSON.parse(savedData);

        fieldIds.forEach(id => {
            const element = document.getElementById(id);
            if (element && charData[id] !== undefined) {
                if (element.type === 'checkbox') {
                    element.checked = charData[id];
                } else {
                    element.value = charData[id];
                }
            }
        });
    }
}

// RESET (Löschen)
resetBtn.addEventListener('click', () => {
    if(confirm("Möchtest du wirklich den Charakterbogen leeren? Das kann nicht rückgängig gemacht werden.")) {
        localStorage.removeItem('myHomebrewChar');
        location.reload(); // Seite neu laden
    }
});
