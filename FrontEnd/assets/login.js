// Get the login form from the html
const form = document.querySelector('.loginForm');

// listen when the submit button from the login form is click 
form.addEventListener("submit", async function (event) {
    // Block the reload of the page 
    event.preventDefault();

    // Get the value from the input of the login form
    const formData = {
        "email": document.getElementById("email").value,
        "password": document.getElementById("pass").value
    }
    try {
        // Convert the data from the input in json
        const formDataJson = JSON.stringify(formData);
        // Send the data to the server and retrieve the server response
        const response = await fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: formDataJson,
        });

        // Execute if status is ok
        if (response.status === 200) {
            // Convert the response to a javascript object 
            const token = await response.json();
            // Convert the token into json
            const saveToken = JSON.stringify(token.token);
            // Save the token in a cookie
            setCookie("token", saveToken, 1);
            // redirect to the home page 
            window.location.href = "http://127.0.0.1:5500/FrontEnd/";
            // Execute if status is not ok  
        } else {
            displayError("E-mail ou mot de passe incorecte");
        }

    // Catch any error and display an error message
    } catch (error) {
        displayError("Un problème est survenu veuillez réessayer plus tard");
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