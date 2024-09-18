<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>JoJo Simulator</title>
    <style>
        /* Basic styles for the UI */
        .character { display: flex; align-items: center; margin-bottom: 10px; }
        .character img { width: 50px; height: 50px; margin-right: 10px; }
        #eventLog { margin-top: 20px; }
    </style>
</head>
<body>
    <h1>JoJo's Bizarre Adventure Simulator</h1>

    <div>
        <h3>Add Character</h3>
        <input type="text" id="charName" placeholder="Character Name">
        <input type="text" id="charImg" placeholder="Image URL (Optional)">
        <button onclick="addCharacter()">Add Character</button>
    </div>

    <div>
        <h3>Characters</h3>
        <div id="characters"></div>
    </div>

    <div>
        <h3>Main Character</h3>
        <select id="mainCharacterSelect"></select>
    </div>

    <button onclick="startSimulation()">Start Simulation</button>

    <div>
        <h3>Event Log</h3>
        <div id="eventLog"></div>
    </div>

    <div>
        <h3>Import/Export Characters</h3>
        <button onclick="exportCharacters()">Export Characters</button>
        <input type="file" id="importFile" onchange="importCharacters(event)">
    </div>

    <script>
        let characters = [];
        let events = [
            "fights with",
            "forms an alliance with",
            "betrays",
            "saves",
            "uses a stand arrow and gets",
            "turns into a vampire",
            "runs into a villain and dies",
            "battles to the death with",
            "steals from",
            "sabotages",
            "heals with a mysterious ability",
            "drains blood from"
        ];
        let stands = [
            "Star Platinum", "The World", "Silver Chariot", "Hermit Purple", "Crazy Diamond",
            "Killer Queen", "Sticky Fingers", "Aerosmith", "Stone Free", "Gold Experience",
            "King Crimson", "The Hand", "Heaven's Door", "Echoes", "Weather Report",
            "Tusk", "Soft & Wet", "Dirty Deeds Done Dirt Cheap", "Anubis", "Made in Heaven"
        ];

        let npcs = ["Dio", "Kars", "Diavolo", "Yoshikage Kira", "Enrico Pucci"];

        // Add a character with an image, health, stand, and vampire status
        function addCharacter() {
            let charName = document.getElementById('charName').value;
            let charImg = document.getElementById('charImg').value || 'https://via.placeholder.com/50';
            
            if (charName) {
                characters.push({
                    name: charName,
                    health: 100,
                    stand: null,
                    isVampire: false,
                    image: charImg
                });
                displayCharacters();
                updateMainCharacterSelect();
                document.getElementById('charName').value = '';
                document.getElementById('charImg').value = '';
            }
        }

        // Display characters on the page with their images and status
        function displayCharacters() {
            let charDisplay = document.getElementById('characters');
            charDisplay.innerHTML = '';
            characters.forEach((character, index) => {
                charDisplay.innerHTML += `
                    <div class="character">
                        <img src="${character.image}" alt="${character.name}">
                        <span>${character.name} - HP: ${character.health}</span>
                        <button onclick="removeCharacter(${index})">Remove</button>
                    </div>
                `;
            });
        }

        // Update the select box for choosing the main character
        function updateMainCharacterSelect() {
            let selectBox = document.getElementById('mainCharacterSelect');
            selectBox.innerHTML = '';
            characters.forEach((character, index) => {
                let option = document.createElement('option');
                option.value = index;
                option.textContent = character.name;
                selectBox.appendChild(option);
            });
        }

        // Remove a character
        function removeCharacter(index) {
            characters.splice(index, 1);
            displayCharacters();
            updateMainCharacterSelect();
        }

        // Start the simulation with expanded outcomes
        function startSimulation() {
            if (characters.length < 2) {
                alert("Add at least 2 characters for the simulation.");
                return;
            }

            let eventLog = document.getElementById('eventLog');
            eventLog.innerHTML = '';

            let mainCharIndex = document.getElementById('mainCharacterSelect').value;
            let mainCharacter = characters[mainCharIndex];

            for (let i = 0; i < 10; i++) {
                let char1 = characters[Math.floor(Math.random() * characters.length)];
                let char2 = characters[Math.floor(Math.random() * characters.length)];
                while (char1 === char2) {
                    char2 = characters[Math.floor(Math.random() * characters.length)];
                }

                let randomEvent = Math.random();

                // NPC Villain Encounters
                if (randomEvent < 0.1) {
                    let villain = npcs[Math.floor(Math.random() * npcs.length)];
                    char1.health = 0;
                    eventLog.innerHTML += `<p>${char1.name} ran into ${villain} and was killed!</p>`;
                    removeCharacterFromSimulation(char1);
                
                // Vampire turns and drains blood
                } else if (randomEvent < 0.15 && !char1.isVampire) {
                    char1.isVampire = true;
                    eventLog.innerHTML += `<p>${char1.name} turns into a vampire!</p>`;
                } else if (char1.isVampire && randomEvent < 0.2) {
                    char2.health -= 50;
                    char1.health += 50;
                    eventLog.innerHTML += `<p>${char1.name} drains blood from ${char2.name}, stealing 50 health!</p>`;
                    if (char2.health <= 0) {
                        eventLog.innerHTML += `<p>${char2.name} has been killed by ${char1.name}!</p>`;
                        removeCharacterFromSimulation(char2);
                    }

                // Stand Arrow Event
                } else if (randomEvent < 0.3 && !char1.stand) {
                    let stand = stands[Math.floor(Math.random() * stands.length)];
                    char1.stand = stand;
                    eventLog.innerHTML += `<p>${char1.name} uses a stand arrow and obtains the stand ${stand}!</p>`;

                // Stand Battle
                } else if (randomEvent < 0.45 && char1.stand && char2.stand) {
                    let damage = Math.floor(Math.random() * 50) + 20;
                    char2.health -= damage;
                    eventLog.innerHTML += `<p>${char1.name} battles ${char2.name} using ${char1.stand}, dealing ${damage} damage!</p>`;
                    if (char2.health <= 0) {
                        eventLog.innerHTML += `<p>${char2.name} has been killed by ${char1.name}!</p>`;
                        removeCharacterFromSimulation(char2);
                    }

                // Sabotage or Betrayal
                } else if (randomEvent < 0.55) {
                    let damage = Math.floor(Math.random() * 30) + 10;
                    char2.health -= damage;
                    eventLog.innerHTML += `<p>${char1.name} sabotages ${char2.name}, causing ${damage} damage!</p>`;
                    if (char2.health <= 0) {
                        eventLog.innerHTML += `<p>${char2.name} has been eliminated!</p>`;
                        removeCharacterFromSimulation(char2);
                    }

                // Healing Event
                } else if (randomEvent < 0.65) {
                    let heal = Math.floor(Math.random() * 20) + 10;
                    char1.health += heal;
                    eventLog.innerHTML += `<p>${char1.name} heals using a mysterious ability, gaining ${heal} health!</p>`;
                
                // Decision Options
                } else {
                    let options = ["attack", "defend", "run", "heal"];
                    let action = prompt(`What will ${mainCharacter.name} do? Choose: ${options.join(', ')}`);
                    eventLog.innerHTML += `<p>${mainCharacter.name} decided to ${action}.</p>`;
                }
            }
        }

        // Remove characters with zero health from the simulation
        function removeCharacterFromSimulation(char) {
            let index = characters.findIndex(c => c.name === char.name);
            if (index !== -1) {
               

 characters.splice(index, 1);
            }
            displayCharacters();
            updateMainCharacterSelect();
        }

        // Export characters as a JSON file
        function exportCharacters() {
            let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(characters));
            let downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute("href", dataStr);
            downloadAnchorNode.setAttribute("download", "characters.json");
            document.body.appendChild(downloadAnchorNode);
            downloadAnchorNode.click();
            downloadAnchorNode.remove();
        }

        // Import characters from a JSON file
        function importCharacters(event) {
            let file = event.target.files[0];
            let reader = new FileReader();
            reader.onload = function(e) {
                let importedCharacters = JSON.parse(e.target.result);
                characters = characters.concat(importedCharacters);
                displayCharacters();
                updateMainCharacterSelect();
            };
            reader.readAsText(file);
        }
    </script>
</body>
</html>
