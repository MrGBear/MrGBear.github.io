import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs';
mermaid.initialize({ startOnLoad: true });
//x-Achse
const xLabels = [1];
//y-Achse
const values = [20];

function writeChart(){
    const chartCode = ' xychart-beta\n'
        + `    x-axis [${xLabels.join(",")}]
`
        + '    y-axis "Handicap" 0 --> 70\n'
        + `    bar [${values.join(",")}]
`
        + `    line [${values.join(",")}]`;

    document.getElementById("mermaidContainerWHS").innerHTML = chartCode;
    document.getElementById("mermaidContainerEGA").innerHTML = chartCode;
}

writeChart();

//function, where the ega and whs numbers can be added
function addValueToChart(xLabel, value){
    xLabels.push(xLabel);
    values.push(value);
    console.log(xLabels);
    console.log(values);
    writeChart();
}

import { backendCalc } from "./datahandler.js";

// Get the user data
const user = JSON.parse(localStorage.getItem("selectedUser"));
backendCalc.switchUser(user.id);
const games = backendCalc.getGames();

// gets ega and whs from updateHandicap in datahandler.js
document.addEventListener("DOMContentLoaded", function () {
    if (games.whs && games.ega) {
        document.getElementById('whs').textContent = games[length - 1].whs;
        document.getElementById('ega').textContent = games[length - 1].ega;
    }
    else {

    }
});

//has to be in a different file
function displayUsername() {
    if (user) {
        document.querySelectorAll(".usernameDisplay").forEach(element => {
            element.textContent = user.name;
        });
    }
}

document.addEventListener("DOMContentLoaded", displayUsername);