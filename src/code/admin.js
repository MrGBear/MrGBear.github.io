import {backendCalc, DataHandler} from "./datahandler.js";

// prints all Users that exist and have role "spieler" or "spielfuehrer"
document.addEventListener("DOMContentLoaded", async function () {
    const calc = new DataHandler();

    // all Users are getted
    let players = calc.getUsers();
    const userButtonCon = document.getElementById("userButtons");
    userButtonCon.innerHTML = "";

    // for each player a button in created (not sekretär)
    players.forEach(player => {
        if(player.role === "spielfuehrer" || player.role === "spieler") {
            const button = document.createElement("button");
            button.textContent = player.name;
            button.className = "w-full text-white bg-darkseagreen hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mt-2";

            //if User is created, players of Users are displayed
            button.addEventListener("click", function () {

                // Optional: Speichern des Benutzers im localStorage
                localStorage.setItem("selectedUser", JSON.stringify(player));
                console.log(player);

                // Zeige die Spiele des ausgewählten Benutzers
                showGamesPopup(player.id, player.name);
            });

            userButtonCon.appendChild(button);
        }

    });
});


// games of each User
function showGamesPopup(id, name) {
    const calc = new DataHandler();
    calc.switchUser(id);

    const playerData = calc.getGames();  // Spieler-ID übergeben

    console.log(playerData);  // Debugging-Ausgabe

    //score Card belongs to
    let popupHTML = `
        <div class="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
            <div class="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full">
                <h2 id="nameH2" class="text-lg font-bold text-darkseagreen mb-4">${name}'s Scorecards</h2>
                <div class="max-h-80 overflow-y-auto">`;

    // each game is printed if defined
    playerData.forEach(game => {
        if (game.course_name === undefined) {
            popupHTML += `
                <div class="bg-white shadow-md rounded-lg p-4 mb-4 border border-gray-200 relative group">
                    <h2 class="text-lg font-bold text-darkseagreen">Es wurden noch keine Spiele gespielt</h2>
                </div>`;
            console.log("Keine Spiele gefunden.");
            return;
        } else {
            popupHTML += `
                <div class="bg-white shadow-md rounded-lg p-4 mb-4 border border-gray-200 relative group">
                    <h2 class="text-lg font-bold text-darkseagreen">${game.course_name}</h2>
                    <p class="text-gray-600"><strong>Datum:</strong> ${game.date}</p>
                    <p class="text-gray-600"><strong>EGA:</strong> ${game.ega}</p>
                    <p class="text-gray-600"><strong>WHS:</strong> ${game.whs}</p>

                    <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
                        <button class="printGame bg-blue-500 text-white px-3 py-1 rounded" data-game='${JSON.stringify(game)}'>🖨 Drucken</button>
                    </div>
                </div>`;
        }
    });

    // close and copy empty chart for specific player
    popupHTML += `
        </div>
        <button class="chooseCourse bg-blue-500 text-white px-3 py-1 rounded">🖨 Leere Scorecard für ein Turnier Drucken</button>
        <button id="closePopup" class="mt-4 bg-gray-400 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">Schließen</button>
        </div>
    </div>`;

    // Popup Container in das DOM einfügen
    const popupContainer = document.createElement("div");
    popupContainer.innerHTML = popupHTML;
    document.body.appendChild(popupContainer);

    // Event-Listener für 'Schließen' Button
    document.getElementById("closePopup").addEventListener("click", function () {
        popupContainer.remove();
    });

    // copy empty score card for specific player has to select course where to copy
    function showCourseSelectionPopup(name) {
        // Hole alle Kurse (aus der backendCalc Klasse)
        const courses = backendCalc.getCourses();
        console.log(courses);

        // Erstelle das Popup-HTML
        let popupHTML = `
        <div id="coursePopup" class="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
            <div class="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                <h2 class="text-lg font-bold text-darkseagreen mb-4">Wähle den Golfkurs</h2>
                <select id="courseSelect" class="w-full p-2 border rounded">
                    ${courses.map(course => `<option value="${course.name}">${course.name}</option>`).join('')}
                </select>
                <div class="flex justify-end mt-4">
                    <button class="confirmCourse bg-green-500 text-white px-4 py-2 rounded">OK</button>
                    <button id="closePopup2" class="ml-2 bg-gray-400 text-white px-4 py-2 rounded">Abbrechen</button>
                </div>
            </div>
        </div>
    `;

        // Füge das Popup dem Body hinzu
        const popupContainer = document.createElement("div");
        popupContainer.innerHTML = popupHTML;
        document.body.appendChild(popupContainer);

        // Event-Listener für Abbrechen-Button
        document.getElementById("closePopup2").addEventListener("click", function () {
            document.getElementById("coursePopup").remove();
        });

        document.querySelectorAll(".confirmCourse").forEach(button => {
            button.addEventListener("click", function () {
                console.log("Funktion wird aufgerufen")
                const courseSelect = document.getElementById("courseSelect");
                const selectedCourse = courseSelect.value;

                // Der Benutzername ist der 'name' der Funktion
                const userName = encodeURIComponent(name);

                console.log("Ausgewählter Kurs: " + selectedCourse);
                console.log("Benutzername: " + userName);

                // Weiterleiten zu einer anderen Seite mit den Daten
                window.location.href = `../html/scorecard_empty.html?course=${encodeURIComponent(selectedCourse)}&name=${userName}`;
            });
        });
    }


    // Event-Listener für 'printGame' Button hinzufügen
    document.querySelectorAll(".printGame").forEach(button => {
        button.addEventListener("click", function () {
            const gameData = JSON.parse(this.dataset.game);
            const queryString = encodeURIComponent(JSON.stringify(gameData));
            const nameString = encodeURIComponent(name);
            window.location.href = `../html/scorecard_drucken.html?gameData=${queryString}&name=${nameString}`;
        });
    });

    // Event-Listener für 'chooseCourse' Button hinzufügen
    document.querySelectorAll(".chooseCourse").forEach(button => {
        button.addEventListener("click", function () {
            let name = document.getElementById("nameH2").innerHTML.split("'");
            showCourseSelectionPopup(name[0]);
        });
    });
}