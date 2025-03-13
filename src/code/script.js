document.getElementById("generateTable").addEventListener("click", function() {
    const numberOfHoles = parseInt(document.getElementById("number_holes").value);
    const table = document.getElementById("scoreTable");

    if (numberOfHoles < 1 || numberOfHoles > 18) {
        alert("Bitte eine Anzahl zwischen 1 und 18 wählen.");
        return;
    }

    table.innerHTML = "";

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

    // Erstelle die Tabelle mit Eingabefeldern
    const tbody = document.createElement("tbody");

    for (let i = 1; i <= numberOfHoles; i++) {
        const row = document.createElement("tr");
        row.className = i % 2 === 0 ? "bg-lightgreen" : "bg-lightgreen";

        row.innerHTML = `
                    <td class="py-2 px-4">
                        <input type="number" name="holeNumber[]" value="${i}" class="w-full bg-darkseagreen text-center rounded-md p-1" readonly>
                    </td>
                    <td class="py-2 px-4">
                        <input type="number" name="hdc[]" min="1" required class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2 border border-lightgreen focus:ring-2 focus:ring-darkseagreen">
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