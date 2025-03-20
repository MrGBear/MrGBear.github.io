import { DataHandler } from "./datahandler.js";

document.addEventListener("DOMContentLoaded", async function () {
    const calc = new DataHandler();

    // all Users are getted
    let players = calc.getUsers();
    const userButtonCon = document.getElementById("userButtons");
    userButtonCon.innerHTML = "";

    // for each player a button in created (not sekretär)
    players.forEach(player => {
        if (player.role === "spieler") {
            const button = document.createElement("button");
            button.textContent = player.name;
            button.className = "w-full text-white bg-darkseagreen hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mt-2";

            //if User is created, players of Users are displayed
            button.addEventListener("click", function () {
                localStorage.setItem("selectedUser", JSON.stringify(player));
                showGamesPopup(player.id, player.name);
            });

            userButtonCon.appendChild(button);
        }

    });
});


// games of each User
function showGamesPopup(playerId, name) {
    const calc = new DataHandler();
    // get all Games of individual User, maybe add switchUser
    calc.switchUser(playerId);
    const playerData = calc.getGames(); // Spieler-ID übergeben

    console.log(calc.getGames(playerId));

    // if the player has no Games
    if (!playerData || playerData.length === 0) {
        alert("Keine Spiele gefunden.");
        return;
    }
    // a pop up where all games are printed of a selected User (hover function of drucken and bearbeiten has to be added)
    let popupHTML = `<div class="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
        <div class="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full">
            <h2 class="text-lg font-bold text-darkseagreen mb-4">${name}'s Scorecards</h2>
            <div class="max-h-80 overflow-y-auto">`;

    playerData.forEach(game => {
        popupHTML += `<div class="bg-white shadow-md rounded-lg p-4 mb-4 border border-gray-200 relative group">
            <h2 class="text-lg font-bold text-darkseagreen">${game.course_name}</h2>
            <p class="text-gray-600"><strong>Datum:</strong> ${game.date}</p>
            <p class="text-gray-600"><strong>EGA:</strong> ${game.ega}</p>
            <p class="text-gray-600"><strong>WHS:</strong> ${game.whs}</p>

            <!-- Hover-Buttons -->
            <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
                <!-- edit data -->
                <button class="editGame bg-yellow-500 text-white px-3 py-1 rounded" data-game='${JSON.stringify(game)}'>✏ Bearbeiten</button>
            </div>
        </div>`;
    });

    // close popup
    popupHTML += `</div>
        <button id="closePopup" class="mt-4 bg-gray-400 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">Schließen</button>
        </div>
    </div>`;

    const popupContainer = document.createElement("div");
    popupContainer.innerHTML = popupHTML;
    document.body.appendChild(popupContainer);

    document.getElementById("closePopup").addEventListener("click", function () {
        popupContainer.remove();
    });

    // send to edit data
    document.querySelectorAll(".editGame").forEach(button => {
        button.addEventListener("click", function () {
            const gameData = JSON.parse(this.dataset.game);
            localStorage.setItem("gameData", JSON.stringify(gameData));  // Save selected game to localStorage
            console.log("gameData: ", gameData);
            window.location.href = "../html/edit_data.html";  // Redirect to the input data page
        });
    });
}
