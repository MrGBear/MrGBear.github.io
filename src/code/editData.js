import { backendCalc } from './datahandler.js';

// Daten laden
document.addEventListener("DOMContentLoaded", function () {
    const user = JSON.parse(localStorage.getItem("selectedUser"));
    const gameData = JSON.parse(localStorage.getItem("gameData"));
    console.log(gameData)

    if (!gameData) {
        console.warn("Keine Spieldaten gefunden.");
        return;
    }

    // Formularfelder mit den Spieldaten füllen
    document.getElementById("player_name").value = user.name;
    document.getElementById("course_name").value = gameData.course_name;
    document.getElementById("date").value = gameData.date;
    document.getElementById("handycap_index").value = gameData.handicap_index;
    document.getElementById("slope_rating").value = gameData.slope_rating;
    document.getElementById("course_rating").value = gameData.course_rating;
    document.getElementById("ppc").value = gameData.ppc;

    if (gameData.holes.length > 9) {
        document.getElementById("number_holes").value = "18";
    } else if (gameData.holes[0].pos === 10) {
        document.getElementById("number_holes").value = "9_last";
    } else {
        document.getElementById("number_holes").value = "9_first";
    }

    // Löcher befüllen
    populateHole(gameData.holes);
});

// Funktion zum Befüllen der Tabelle mit Holes
function populateHole(holes) {
    const table = document.getElementById("scoreTable");

    let tbody = table.querySelector("tbody");
    if (!tbody) {
        tbody = document.createElement("tbody");
        table.appendChild(tbody);
    }

    tbody.innerHTML = ""; // Vorherigen Inhalt löschen

    const thead = document.createElement("thead");
    thead.innerHTML = `
        <tr class="bg-darkseagreen text-white rounded-lg">
            <th class="text-center py-2 px-4">Loch Nr</th>
            <th class="text-center py-2 px-4">HDC</th>
            <th class="text-center py-2 px-4">Par</th>
            <th class="text-center py-2 px-4">GBE</th>
        </tr>
    `;
    table.appendChild(thead);


    holes.forEach((hole) => {
        const row = document.createElement("tr");

        row.innerHTML = `
        <td class="py-2 px-4">
            <input type="number" name="holeNumber[]" value="${hole.pos}" class="w-full bg-darkseagreen text-center rounded-md p-1" readonly>
        </td>
        <td class="py-2 px-4">
            <input type="number" name="hdc[]" value="${hole.hdc}" min="1" max="18" required class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2 focus:ring-2 focus:ring-darkseagreen">
        </td>
        <td class="py-2 px-4">
            <input type="number" name="par[]" value="${hole.par}" min="1" required class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2 focus:ring-2 focus:ring-darkseagreen">
        </td>
        <td class="py-2 px-4">
            <input type="number" name="gbe[]" value="${hole.gbe}" min="1" required class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2 focus:ring-2 focus:ring-darkseagreen">
        </td>
    `;
        tbody.appendChild(row);
    });
}

function saveGameData() {
    const newGame = {
        course_name: document.getElementById("course_name").value,
        date: document.getElementById("date").value,
        handicap_index: document.getElementById("handycap_index").value,
        slope_rating: document.getElementById("slope_rating").value,
        ppc: document.getElementById("ppc").value,
    };

    backendCalc.edit(newGame);
}
