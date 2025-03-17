// leere Scorecard mit einem User -> Daten müssen noch in HTML ergänzt werden
document.addEventListener("DOMContentLoaded", function() {
    // Den URL-Parameter abfragen
    const urlParams = new URLSearchParams(window.location.search);
    const gameDataString = urlParams.get('selectedCourse');
    const name = urlParams.get('username');

    if (gameDataString && name) {
        // Die Daten wieder in ein Objekt umwandeln
        const selectedCourse = JSON.parse(decodeURIComponent(gameDataString));
        const name = decodeURIComponent(urlParams.get('name'));
        console.log(name);
        displayEmptyScorecard(selectedCourse, name);
    } else {
        alert("Keine Spiel-Daten gefunden!");
    }
});

function displayEmptyScorecard(selectedCourse, name) {
    const infosContainer = document.getElementById("infos_spieler");

    // Scorecard HTML erstellen
    infosContainer.innerHTML = `
        <h2 class="text-xl font-bold mb-2">Scorecard für ${selectedCourse}</h2>
        <h2 class="text-xl font-bold mb-2">Besitzer dieser Golfcard ist: ${name}</h2>`;
}

function druckeEmptySeite() {
    window.print();
}