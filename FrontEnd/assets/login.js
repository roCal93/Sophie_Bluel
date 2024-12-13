// Gets the login form from the html
const form = document.querySelector('.loginForm');

// Listens when the submit button from the login form is clicked 
form.addEventListener("submit", async function (event) {
    // Block the reload of the page 
    event.preventDefault();

    // Gets the value from the input of the login form
    const formData = {
        "email": document.getElementById("email").value,
        "password": document.getElementById("pass").value
    }
    try {
        // Converts the data from the input into json
        const formDataJson = JSON.stringify(formData);
        // Sends the data to the server and retrieves the server response
        const response = await fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: formDataJson,
        });

        // Executes if status is ok
        if (response.status === 200) {
            // Converts the response to a javascript object 
            const token = await response.json();
            // Converts the token into json
            const saveToken = JSON.stringify(token.token);
            // Saves the token in a cookie
            setCookie("token", saveToken, 1);
            // Redirects to the home page 
            window.location.href = "http://127.0.0.1:5500/FrontEnd/";
            // Executes if status is not ok  
        } else {
            displayError("E-mail ou mot de passe incorecte");
        }

    // Catches any error and displays an error message
    } catch (error) {
        displayError("Un problème est survenu. Veuillez réessayer plus tard");
    }

});

// Function to set a cookie
function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

// Function to display an error message
function displayError(message) {
    let spanErrorMessage = document.getElementById("errorMessage");

    if (!spanErrorMessage) {
        let popup = document.querySelector(".loginForm");
        spanErrorMessage = document.createElement("span");
        spanErrorMessage.id = "errorMessage";
        spanErrorMessage.innerText = message;
        popup.append(spanErrorMessage);
    } else {
        spanErrorMessage.innerText = message;
    }
}