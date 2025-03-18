// how data is sent to calculation to be correctly permitted

import { backendCalc } from './datahandler.js';
import {send_email} from "./email_service";
import {ega_calc} from "./ega_handicap";

const calculateHandicap = () => {
  // error handling
  function validateInputs() {
    let isValid = true;
    const errorMessages = {}; // Speichert Fehler pro Feld

    // Eingaben abrufen
    const playerName = document.getElementById("player_name").value.trim();
    const courseName = document.getElementById("course_name").value.trim();
    const courseRating = document.getElementById("course_rating").value.trim();
    const slopeRating = document.getElementById("slope_rating").value.trim();
    const ppc = document.getElementById("ppc").value.trim();
    const date = document.getElementById("date").value.trim();
    const cba = document.getElementById("cba").value.trim();
    const number_holes = document.getElementById("number_holes").value.trim();

    clearErrorsInput();

    let hasError = false;

    // error handing
    if (!playerName) {
      showError("player_name", "Bitte gib deinen Namen ein.");
      hasError = true;
    }

    if (!courseName) {
      showError("course_name", "Bitte gib deinen Kurs ein.");
      hasError = true;
    }

    if (!courseRating) {
      showError("course_rating", "Bitte gib die Kurs Bewertung ein.");
      hasError = true;
    }

    if (!slopeRating) {
      showError("slope_rating", "Bitte gib die Slope Bewertung ein.");
      hasError = true;
    }

    if (!ppc) {
      showError("ppc", "Bitte gib deinen PPC ein.");
      hasError = true;
    }

    //Handicap Index ist optional, weil manche Leute auch zu ersten Mal erst spielen

    if (!date) {
      showError("date", "Bitte gib das Datum an dem du gespielt hast ein.");
      hasError = true;
    }

    // Überprüfung: Rolle muss ausgewählt sein
    if (cba === "not_selected") {
      showError("cba", "Bitte wähle eine CBA aus (Gibt auch Option not Calculated).");
      hasError = true;
    }

    if (cba === "not_selected") {
      showError("number_holes", "Bitte die Anzahl der Löcher auswählen");
    }

    // Überprüfung: Spiel existiert bereits?


    // Wenn ein Fehler vorliegt, Abbruch
    if (hasError) return;

// Funktion zur Anzeige von Fehlermeldungen
  function showError(inputId, message) {
    const inputField = document.getElementById(inputId);
    inputField.classList.add("border-red-500");

    let errorElement = document.createElement("p");
    errorElement.className = "ml-6 text-red-500 text-xs";
    errorElement.innerText = message;
    errorElement.id = `error-${inputId}`;

    inputField.parentNode.appendChild(errorElement);
  }

// Funktion zum Entfernen aller vorherigen Fehler
  function clearErrorsInput() {
    document.querySelectorAll(".text-red-500").forEach(el => el.remove());
    document.querySelectorAll("input, select").forEach(el => el.classList.remove("border-red-500"));
  }
}

  // Event Listener für den Handicap-Berechnen-Button
  document.getElementById("calculateHandicap").addEventListener("click", function () {
    if (validateInputs()) {
      console.log("Daten sind gültig, Berechnung wird gestartet...");
      // Get the current user
      const user = JSON.parse(localStorage.getItem("selectedUser"));
      backendCalc.switchUser(user.id);

      // get Data from frontend
      const player_name = document.getElementById("player_name").value;  // Player name
      const course_name = document.getElementById("course_name").value;  // Course name
      const course_rating = parseFloat(document.getElementById("course_rating").value);  // Course rating
      const slope_rating = parseInt(document.getElementById("slope_rating").value);  // Slope rating
      const ppc = parseInt(document.getElementById("ppc").value);  // PPC
      const handicap_index = document.getElementById("handycap_index").value ? parseFloat(document.getElementById("handycap_index").value) : null;  // Handicap index
      const date = document.getElementById("date").value;  // Date

      const numberOfHoles = parseInt(document.getElementById("number_holes").value);

      const tableRows = document.querySelectorAll("#scoreTable tbody tr");

      // get Holes Data
      const holes = [];

      tableRows.forEach((row, index) => {
        const par = row.querySelector('input[name="par[]"]').value;
        const gbe = row.querySelector('input[name="gbe[]"]').value;
        const hdc = row.querySelector('input[name="hdc[]"]').value;

        if (par && gbe) {
          holes.push({
            pos: index + 1, // Loch Nummer
            par: parseInt(par),
            gbe: parseInt(gbe),
            hdc: parseInt(hdc)
          });
        }
      });
      // endregion:    Get the data

      // Store Data for calculation
      const dataToCalc =
          {
            course_name: course_name,
            course_rating: course_rating,
            slope_rating: slope_rating,
            ppc: ppc,
            handicap_index: handicap_index,
            date: date,
            holes: holes
          }

      console.log("Try to store the data", dataToCalc);

      backendCalc.addGame(dataToCalc);

      console.log("games:" + JSON.stringify(backendCalc.getGames()));

      //muss noch angepasst werden -> sends email to user that data has been edited
      send_email(player_name, backendCalc.getUserData().egq, backendCalc.getUserData().whs, user.email);
    } else {
      console.log("Fehlerhafte Eingaben.");
    }
  });
}

// if button calculate is clicked
// brauchen wir das
const btn = document.getElementById("calculateHandicap");

btn.addEventListener("click", calculateHandicap);