// volle Scorecard mit einem ausgewähltem Spiel
document.addEventListener("DOMContentLoaded", function() {
    // Den URL-Parameter abfragen
    const urlParams = new URLSearchParams(window.location.search);
    const gameDataString = urlParams.get('gameData');
    const name = urlParams.get('name');

    if (gameDataString && name) {
        // Die Daten wieder in ein Objekt umwandeln
        const gameData = JSON.parse(decodeURIComponent(gameDataString));
        const name = decodeURIComponent(urlParams.get('name'));
        console.log(name);
        displayScorecard(gameData, name);
    } else {
        alert("Keine Spiel-Daten gefunden!");
    }
});

function displayScorecard(gameData, name) {
    const scorecardContainer = document.getElementById("scorecard");
    // Summiere die Schläge und Punkte
    let totalScore = 0;
    let totalPoints = 0;

    // Durch alle Löcher iterieren und Summen berechnen
    gameData.holes.forEach(hole => {
        totalScore += hole.par; // Schläge addieren
        totalPoints += hole.gbe; // Punkte addieren
    });

    // Scorecard HTML erstellen
    scorecardContainer.innerHTML = `
        <h2 class="text-xl font-bold mb-2">Scorecard für ${gameData.course_name}</h2>
        <h2 class="text-xl font-bold mb-2">Besitzer dieser Golfcard ist: ${name}</h2>
        <p><strong>Datum:</strong> ${gameData.date}</p>
        <p><strong>Slope Rating:</strong> ${gameData.slope_rating}</p>
        <p><strong>WHS:</strong> ${gameData.whs}</p>
        <p><strong>EGA:</strong> ${gameData.ega}</p>

        <table class="w-full border mt-4">
            <thead>
                <tr class="bg-green-600 text-white">
                    <th class="py-2 px-4 border">Loch</th>
                    <th class="py-2 px-4 border">HDC</th>
                    <th class="py-2 px-4 border">Par</th>
                    <th class="py-2 px-4 border">GBE</th>
                </tr>
            </thead>
            <tbody>
                ${gameData.holes.map(hole => `
                    <tr class="bg-green-100 text-center">
                        <td class="py-2 px-4 border">${hole.pos}</td>
                        <td class="py-2 px-4 border">${hole.hdc}</td>
                        <td class="py-2 px-4 border">${hole.par}</td>
                        <td class="py-2 px-4 border">${hole.gbe}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
        <div class="my-4 text-xl font-bold">
            Gesamtschläge: <span id="gesamt-schlaege-mitte">${totalScore}</span>
        </div>
        <div class="my-4 text-xl font-bold">
            Gesamtpunkte: <span id="gesamt-punkte-mitte">${totalPoints}</span>
        </div>
    `;
}

function druckeSeite() {
    const druckButton = document.getElementById("druck-button");
    druckButton.classList.add("hidden"); // Button ausblenden
    window.print();
    druckButton.classList.remove("hidden");
}