import { backendCalc } from "../code/datahandler.js";

//Selected User is choosen
document.addEventListener("DOMContentLoaded", async function () {
    const user = JSON.parse(localStorage.getItem("selectedUser"));
    backendCalc.switchUser(user.id);

    //all Games from User are getted
    let games = await backendCalc.getGames(); // Falls getGames asynchron ist, benutze await
    console.log(games); // Überprüfen, ob die Daten korrekt geladen werden
    const divGames = document.getElementById("game");

    // emptying games tag
    divGames.innerHTML = "";

    // for each game a div is created
    games.forEach(game => {
        if (game.course_name !== undefined){
            const div = document.createElement("div");

            // Tailwind structure for the game
            div.innerHTML = `
        <div class="ml-20 bg-white shadow-md rounded-lg p-4 mb-4 border border-gray-200">
            <h2 class="text-lg font-bold text-darkseagreen">${game.course_name}</h2>
            <p class="text-gray-600"><strong>Datum:</strong> ${game.date}</p>
            <p class="text-gray-600"><strong>EGA:</strong> ${game.ega}</p>
            <p class="text-gray-600"><strong>WHS:</strong> ${game.whs}</p>
            <p class="text-gray-600"><strong>Score Differential:</strong> ${game.score_differential}</p>
            <p class="text-gray-600"><strong>Course Rating:</strong> ${game.course_rating}</p>
            <p class="text-gray-600"><strong>Slope Rating:</strong> ${game.slope_rating}</p>
            <p class="text-gray-600"><strong>PPC:</strong> ${game.ppc}</p>
            <p class="text-gray-600"><strong>Stableford:</strong> ${game.stableford}</p>
        </div>
    `;
            // div is put to container
            divGames.appendChild(div);
        }

        else {
            console.log("Noch keine Spiele vorhanden")
        }

    });
});