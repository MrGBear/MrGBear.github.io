import { DataHandler } from "./datahandler.js";

const backendCalc = new DataHandler();

document.getElementById("createUser").addEventListener("click", () => {
    // Eingaben erfassen und bereinigen
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const role = document.getElementById("role").value;

    // Fehlermeldungen zurücksetzen
    clearErrors();

    let hasError = false;

    // Überprüfung: Name darf nicht leer sein
    if (!name) {
        showError("name", "Bitte gib einen Namen ein.");
        hasError = true;
    }

    // Überprüfung: E-Mail darf nicht leer sein und muss gültig sein
    if (!email) {
        showError("email", "Bitte gib eine E-Mail-Adresse ein.");
        hasError = true;
    } else if (!validateEmail(email)) {
        showError("email", "Bitte gib eine gültige E-Mail-Adresse ein.");
        hasError = true;
    }

    // Überprüfung: Rolle muss ausgewählt sein
    if (role === "not_selected") {
        showError("role", "Bitte wähle eine Rolle aus.");
        hasError = true;
    }

    // Wenn ein Fehler vorliegt, Abbruch


    // Alle User holen
    const existingUsers = backendCalc.getUsers();

    // Überprüfung: Benutzer existiert bereits?
    if (existingUsers.some(user => user.user_name === name || user.email === email)) {
        console.log("Den Spieler gibt es bereits");
        showError("name", "Ein Benutzer mit diesem Namen oder dieser E-Mail existiert bereits.");
        backendCalc.removeUser(length-1);
        hasError = true;
    }

    if (hasError) {
        return;
    }
    else {
        backendCalc.addUser({ user_name: name, email: email, role: role });
        console.log(backendCalc.getUsers());
        window.location.href = "src/html/selectUser.html"
    }
});

// Funktion zur E-Mail-Validierung
function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Funktion zur Anzeige von Fehlermeldungen
function showError(inputId, message) {
    const inputField = document.getElementById(inputId);
    inputField.classList.add("border-red-500");

    let errorElement = document.createElement("p");
    errorElement.className = "text-red-500 text-xs mt-1";
    errorElement.innerText = message;
    errorElement.id = `error-${inputId}`;

    inputField.parentNode.appendChild(errorElement);
}

// Funktion zum Entfernen aller vorherigen Fehler
function clearErrors() {
    document.querySelectorAll(".text-red-500").forEach(el => el.remove());
    document.querySelectorAll("input, select").forEach(el => el.classList.remove("border-red-500"));
}
