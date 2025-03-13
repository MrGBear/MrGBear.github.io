import { backendCalc } from "'../../../golf_handicap/src/datahandler.js";

document.addEventListener("DOMContentLoaded", function () {
    const gameListContainer = document.getElementById("gameList");

    // Spiele aus dem Backend abrufen
    const allPlayers = backendCalc.getGames(); // Alle Spieler mit ihren Spielen abrufen

    gameListContainer.innerHTML = ''; // Bestehende Liste leeren

    allPlayers.forEach(player => {
        player.games.forEach(game => {
            const listItem = document.createElement("div");
            listItem.classList.add("cursor-pointer", "bg-gray-200", "p-4", "mb-4", "rounded", "hover:bg-gray-300", "transition-all");

            listItem.innerHTML = `
                <strong>Spieler:</strong> ${player.player_name} <br>
                <strong>Platz:</strong> ${game.course_name} <br>
                <strong>Datum:</strong> ${game.date} <br>
                <button class="viewGame bg-blue-500 text-white px-4 py-2 rounded mt-2" data-game='${JSON.stringify(game)}'>Scorecard ansehen</button>
            `;

            gameListContainer.appendChild(listItem);
        });
    });

    // Eventlistener für die "Scorecard ansehen"-Buttons
    document.querySelectorAll(".viewGame").forEach(button => {
        button.addEventListener("click", function () {
            const gameData = JSON.parse(this.dataset.game);
            showScorecard(gameData);
        });
    });
});

function showScorecard(game) {
    const scorecardContainer = document.getElementById("scorecard");
    scorecardContainer.innerHTML = `
        <h2 class="text-xl font-bold mb-2">Scorecard für ${game.course_name}</h2>
        <p><strong>Datum:</strong> ${game.date}</p>
        <p><strong>Handicap Index:</strong> ${game.handicap_index}</p>
        <p><strong>Slope Rating:</strong> ${game.slope_rating}</p>
        <p><strong>WHS:</strong> ${game.whs}</p>
        <p><strong>EGA:</strong> ${game.ega}</p>

        <table class="w-full border mt-4">
            <thead>
                <tr class="bg-darkseagreen text-white">
                    <th class="py-2 px-4 border">Loch</th>
                    <th class="py-2 px-4 border">HDC</th>
                    <th class="py-2 px-4 border">Par</th>
                    <th class="py-2 px-4 border">GBE</th>
                </tr>
            </thead>
            <tbody>
                ${game.holes.map(hole => `
                    <tr class="bg-gray-100 text-center">
                        <td class="py-2 px-4 border">${hole.pos}</td>
                        <td class="py-2 px-4 border">${hole.hdc}</td>
                        <td class="py-2 px-4 border">${hole.par}</td>
                        <td class="py-2 px-4 border">${hole.gbe}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>

        <button id="printScorecard" class="mt-4 bg-green-500 text-white px-6 py-2 rounded">Drucken</button>
    `;

    document.getElementById("printScorecard").addEventListener("click", function () {
        window.print();
    });
}
