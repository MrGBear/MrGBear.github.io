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
        const headerRow = document.createElement("tr");

        ["Loch Nr", "Par", "GBE"].forEach(text => {
            const th = document.createElement("th");
            th.textContent = text;
            headerRow.appendChild(th);
        });

        thead.appendChild(headerRow);
        table.appendChild(thead);

        // Erstelle die Tabelle mit Eingabefeldern
        const tbody = document.createElement("tbody");

        for (let i = 1; i <= numberOfHoles; i++) {
            const row = document.createElement("tr");

            // Loch Nr
            const holeCell = document.createElement("td");
            const holeInput = document.createElement("input");
            holeInput.type = "number";
            holeInput.name = "holeNumber[]";
            holeInput.value = i;
            holeInput.readOnly = true; // Loch Nr nicht veränderbar
            holeCell.appendChild(holeInput);
            row.appendChild(holeCell);

            // Par
            const parCell = document.createElement("td");
            const parInput = document.createElement("input");
            parInput.type = "number";
            parInput.name = "par[]";
            parInput.min = "1";
            parInput.required = true;
            parCell.appendChild(parInput);
            row.appendChild(parCell);

            // GBE (Benötigte Schläge)
            const gbeCell = document.createElement("td");
            const gbeInput = document.createElement("input");
            gbeInput.type = "number";
            gbeInput.name = "gbe[]";
            gbeInput.min = "1";
            gbeInput.required = true;
            gbeCell.appendChild(gbeInput);
            row.appendChild(gbeCell);

            tbody.appendChild(row);
        }

        table.appendChild(tbody);
    });