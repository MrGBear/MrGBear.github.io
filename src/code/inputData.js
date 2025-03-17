import { backendCalc } from './datahandler.js';

// Table-Erstellung basierend auf der Anzahl der Löcher
document.getElementById("number_holes").addEventListener("change", function () {
    const selectedOption = document.getElementById("number_holes").value.trim();
    let numberOfHoles = selectedOption === "18" ? 18 : 9;

    const table = document.getElementById("scoreTable");
    table.innerHTML = ""; // Vorherige Tabelle löschen

    // Tabelle mit Header erstellen
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

    const tbody = document.createElement("tbody");

    let startHole = selectedOption === "9_last" ? 10 : 1;
    let endHole = startHole + numberOfHoles - 1;

    // Löcher in die Tabelle eintragen
    for (let i = startHole; i <= endHole; i++) {
        const row = document.createElement("tr");
        row.className = i % 2 === 0 ? "bg-lightgreen" : "bg-lightgreen";

        row.innerHTML = `
            <td class="py-2 px-4">
                <input type="number" name="holeNumber[]" value="${i}" class="w-full bg-darkseagreen text-center rounded-md p-1" readonly>
            </td>
            <td class="py-2 px-4">
                <input type="number" name="hdc[]" min="1" max="18" required class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2 focus:ring-2 focus:ring-darkseagreen">
            </td>
            <td class="py-2 px-4">
                <input type="number" name="par[]" min="1" required class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2 focus:ring-2 focus:ring-darkseagreen">
            </td>
            <td class="py-2 px-4">
                <input type="number" name="gbe[]" min="1" required class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2 focus:ring-2 focus:ring-darkseagreen">
            </td>
        `;
        tbody.appendChild(row);
    }

    table.appendChild(tbody);
});


//save games wird nicht benötigt -> passiert in sendToCalc
function saveGameData() {
    const newGame = {
        course_name: document.getElementById("course_name").value,
        date: document.getElementById("date").value,
        handicap_index: document.getElementById("handycap_index").value,
        slope_rating: document.getElementById("slope_rating").value,
        ppc: document.getElementById("ppc").value,
    };

    backendCalc.addGame(newGame);
}