//displays username after selecting user

function displayUsername() {
    const user = JSON.parse(localStorage.getItem("selectedUser"));
    if (user) {
        document.querySelectorAll(".usernameDisplay").forEach(element => {
            element.textContent = user.name;
        });
    }
}

document.addEventListener("DOMContentLoaded", displayUsername);