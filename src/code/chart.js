import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs';
mermaid.initialize({ startOnLoad: true });
//x-Achse WHS 
const xLabelsWHS = [];
//y-Achse WHS
const valuesWHS = [];

function writeChartWHS(){
    const chartCode = ' xychart-beta\n'
        + `    x-axis [${xLabelsWHS.join(",")}]
`
        + '    y-axis "Handicap" 0 --> 70\n'
        + `    bar [${valuesWHS.join(",")}]
`
        + `    line [${valuesWHS.join(",")}]`;

    document.getElementById("mermaidContainerWHS").innerHTML = chartCode;
}

writeChartWHS();

//x-Achse EGA 
const xLabelsEGA = [];
//y-Achse EGA
const valuesEGA = [];


function writeChartEGA(){
    const chartCode = ' xychart-beta\n'
        + `    x-axis [${xLabelsEGA.join(",")}]
`
        + '    y-axis "Handicap" 0 --> 70\n'
        + `    bar [${valuesEGA.join(",")}]
`
        + `    line [${valuesEGA.join(",")}]`;

    document.getElementById("mermaidContainerEGA").innerHTML = chartCode;
}

writeChartEGA();

//function, where the ega and whs numbers can be added
function addValueToChartWHS(xLabel, value){
    xLabelsWHS.push(xLabel);
    valuesWHS.push(value);
    console.log(xLabelsWHS);
    console.log(valuesWHS);
    writeChartWHS();
}

function addValueToChartEGA(xLabel, value){
    xLabelsEGA.push(xLabel);
    valuesEGA.push(value);
    console.log(xLabelsEGA);
    console.log(valuesEGA);
    writeChartEGA();
}

import { backendCalc } from "./datahandler.js";

// Get the user data
const user = JSON.parse(localStorage.getItem("selectedUser"));
backendCalc.switchUser(user.id);
const games = backendCalc.getGames();

console.log(backendCalc.getGames());

console.log(games);
console.log(user.id);
console.log(games[0].game_id);

function addGames(){
    games.forEach(element => {
        addValueToChartWHS(element.game_id, element.whs);
        addValueToChartEGA(element.game_id, element.ega);
    });
}

// gets ega and whs from updateHandicap in datahandler.js
document.addEventListener("DOMContentLoaded", function () {
    if (games.whs != null && games.ega != null) {
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

addGames();