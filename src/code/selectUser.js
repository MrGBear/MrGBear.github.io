//auswählen eines Users und weiterleiten je nach Rolle

import { DataHandler } from "../code/datahandler.js";

document.addEventListener("DOMContentLoaded", async function () {
    const calc = new DataHandler();

    //all Users are getted and buttons creating which are empty
    let players = calc.getUsers();
    const userButtonCon = document.getElementById("userButtons");
    userButtonCon.innerHTML = "";

    //for each player a button will be created with tailwind style
    players.forEach(player => {
        const button = document.createElement("button");
        button.textContent = player.name;
        button.className = "w-full text-white bg-darkseagreen hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mt-2";

        //rules which decide to what page it redirects
        button.addEventListener("click", function () {
            localStorage.setItem("selectedUser", JSON.stringify(player));
            //sekretaer goes to admin page
            if(player.role === "sekretaer") {
                window.location.href = "admin.html";
            }
            //spielfuehrer goes to start page may be changed
            else if (player.role === "spielfuehrer") {
                window.location.href = "spielfuehrer.html";
            }
            //spieler goes to start page
            else {
                window.location.href = "startPage.html";
            }
        });

        userButtonCon.appendChild(button);
    });
});