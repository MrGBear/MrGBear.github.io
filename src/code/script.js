import { backendCalc } from './datahandler.js';

document.getElementById("number_holes").addEventListener("change", function () {
    const selectedOption = document.getElementById("number_holes").value;
    let numberOfHoles = 0;

    // Bestimme die Anzahl der Löcher basierend auf der Dropdown-Auswahl
    if (selectedOption === "9_first" || selectedOption === "9_last") {
        numberOfHoles = 9;
    } else if (selectedOption === "18") {
        numberOfHoles = 18;
    }

    const table = document.getElementById("scoreTable");

    if (numberOfHoles < 1 || numberOfHoles > 18) {
        alert("Bitte eine Anzahl zwischen 1 und 18 wählen.");
        return;
    }

    table.innerHTML = ""; // Lösche die bestehende Tabelle, falls vorhanden

    // Erstelle die Kopfzeile
    const thead = document.createElement("thead");
    thead.innerHTML = `
        <tr class="bg-darkseagreen text-white rounded-lg">
            <th class="text-center py-2 px-4 text-left">Loch Nr</th>
            <th class="text-center py-2 px-4 text-left">HDC</th>
            <th class="text-center py-2 px-4 text-left">Par</th>
            <th class="text-center py-2 px-4 text-left">GBE</th>
        </tr>
    `;
    table.appendChild(thead);

    // Erstelle den Tabellenkörper
    const tbody = document.createElement("tbody");

    let startHole = 1;
    let endHole = numberOfHoles;

    if (selectedOption === "9_last") {
        startHole = 10; // Die letzten 9 Löcher beginnen bei Loch 10
        endHole = 18;
    }

    // Tabelle mit Eingabefeldern erstellen
    for (let i = startHole; i <= endHole; i++) {
        const row = document.createElement("tr");
        row.className = i % 2 === 0 ? "bg-lightgreen" : "bg-lightgreen";  // Alternierende Farben

        row.innerHTML = `
            <td class="py-2 px-4">
                <input type="number" name="holeNumber[]" value="${i}" class="w-full bg-darkseagreen text-center rounded-md p-1" readonly>
            </td>
            <td class="py-2 px-4">
                <input type="number" name="hdc[]" min="1" max="18" required class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2 border border-lightgreen focus:ring-2 focus:ring-darkseagreen" data-hole="${i}">
            </td>
            <td class="py-2 px-4">
                <input type="number" name="par[]" min="1" required class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2 border border-lightgreen focus:ring-2 focus:ring-darkseagreen">
            </td>
            <td class="py-2 px-4">
                <input type="number" name="gbe[]" min="1" required class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2 border border-lightgreen focus:ring-2 focus:ring-darkseagreen">
            </td>
        `;
        tbody.appendChild(row);
    }

    table.appendChild(tbody);
});

document.addEventListener("DOMContentLoaded", function () {
    const loadDataButton = document.getElementById("loadData");
    const modal = document.getElementById("dataModal");
    const closeModalButton = document.getElementById("closeModal");
    const savedGamesList = document.getElementById("savedGamesList");
    const numberHolesDropdown = document.getElementById("number_holes");

    // Standardwert für "number_holes" auf "9_first" setzen
    numberHolesDropdown.value = "9_first";

    // Event Listener für den "Alte Daten laden" Button
    loadDataButton.addEventListener("click", function () {
        // Get current user
        const user = JSON.parse(localStorage.getItem("selectedUser"));
        backendCalc.switchUser(user.id);
        const savedGames = backendCalc.getGames(false); // Spiele aus DataHandler abrufen

        savedGamesList.innerHTML = ''; // Liste zurücksetzen

        // Wenn gespeicherte Spiele vorhanden sind, zeige sie im Modal
        if (savedGames.length > 0) {
            savedGames.forEach((game) => {
                const listItem = document.createElement("div");
                listItem.classList.add("cursor-pointer", "bg-gray-200", "p-4", "mb-4", "rounded", "hover:bg-gray-300", "transition-all");

                const gameDetails = document.createElement("div");
                gameDetails.classList.add("flex", "flex-col");

                gameDetails.innerHTML = `
                    ${game.course_name}<br>
                    ${game.date}<br>
                    ${game.handicap_index}<br>
                `;

                listItem.addEventListener("click", function () {
                    document.getElementById("course_name").value = game.course_name;
                    document.getElementById("date").value = game.date;
                    document.getElementById("handycap_index").value = game.handicap_index;
                    document.getElementById("slope_rating").value = game.slope_rating;
                    document.getElementById("ppc").value = game.ppc;
                    modal.classList.add("hidden");
                });

                listItem.appendChild(gameDetails);
                savedGamesList.appendChild(listItem);
            });
        } else {
            savedGamesList.innerHTML = '<div class="text-center p-4">Keine gespeicherten Spiele gefunden.</div>';
        }

        modal.classList.remove("hidden");
    });

    closeModalButton.addEventListener("click", function () {
        modal.classList.add("hidden");
    });

    // Funktion zum Speichern der neuen Spieldaten im Backend
    function saveGameData() {
        const courseName = document.getElementById("course_name").value;
        const date = document.getElementById("date").value;
        const handicapIndex = document.getElementById("handycap_index").value;
        const slopeRating = document.getElementById("slope_rating").value;
        const ppc = document.getElementById("ppc").value;

        const newGame = {
            course_name: courseName,
            date: date,
            handicap_index: handicapIndex,
            slope_rating: slopeRating,
            ppc: ppc,
        };

        backendCalc.addGame(newGame);
    }

});

document.addEventListener("DOMContentLoaded", function () {
    const numberHolesDropdown = document.getElementById("number_holes");
    const table = document.getElementById("scoreTable");

    // Standardwert setzen und Tabelle initial laden
    numberHolesDropdown.value = "9_first";
    generateTable(9, 1);

    // Event Listener für Änderungen am Dropdown
    numberHolesDropdown.addEventListener("change", function () {
        let numberOfHoles = 9;
        let startHole = 1;

        if (numberHolesDropdown.value === "9_last") {
            startHole = 10;
        } else if (numberHolesDropdown.value === "18") {
            numberOfHoles = 18;
            startHole = 1;
        }

        generateTable(numberOfHoles, startHole);
    });

    function generateTable(numberOfHoles, startHole) {
        table.innerHTML = ""; // Bestehende Tabelle löschen

        // Kopfzeile
        const thead = document.createElement("thead");
        thead.innerHTML = `
            <tr class="bg-darkseagreen text-white text-center">
                <th class="py-2 px-4 border-b">Loch Nr</th>
                <th class="py-2 px-4 border-b">HDC</th>
                <th class="py-2 px-4 border-b">Par</th>
                <th class="py-2 px-4 border-b">GBE</th>
            </tr>
        `;
        table.appendChild(thead);

        // Tabellenkörper erstellen
        const tbody = document.createElement("tbody");

        for (let i = startHole; i < startHole + numberOfHoles; i++) {
            const row = document.createElement("tr");
            row.className = i % 2 === 0 ? "bg-darkseagreen" : "bg-lightgreen";

            row.innerHTML = `
                <td class="py-2 px-4 text-center border-b font-bold">
                    <input type="number" name="holeNumber[]" value="${i}" class="w-full bg-gray-200 text-center rounded-md p-1" readonly>
                </td>
                <td class="py-2 px-4 text-center border-b">
                    <input type="number" name="hdc[]" min="1" max="18" required class="w-full bg-gray-50 border rounded-lg p-2 text-center focus:ring-2 focus:ring-darkseagreen">
                </td>
                <td class="py-2 px-4 text-center border-b">
                    <input type="number" name="par[]" min="1" required class="w-full bg-gray-50 border rounded-lg p-2 text-center focus:ring-2 focus:ring-darkseagreen">
                </td>
                <td class="py-2 px-4 text-center border-b">
                    <input type="number" name="gbe[]" min="1" required class="w-full bg-gray-50 border rounded-lg p-2 text-center focus:ring-2 focus:ring-darkseagreen">
                </td>
            `;
            tbody.appendChild(row);
        }

        table.appendChild(tbody);
    }
});


// Funktion zum Speichern der neuen Spieldaten im Backend
function saveGameData() {
    const courseName = document.getElementById("course_name").value;
    const date = document.getElementById("date").value;
    const handicapIndex = document.getElementById("handycap_index").value;
    const slopeRating = document.getElementById("slope_rating").value;
    const ppc = document.getElementById("ppc").value;

    const newGame = {
        course_name: courseName,
        date: date,
        handicap_index: handicapIndex,
        slope_rating: slopeRating,
        ppc: ppc,
    };

    // Spiel über das Backend speichern
    backendCalc.addGame(newGame);
}
