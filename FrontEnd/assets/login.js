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
    };


    // Convert the data from the input in json
    const formDataJson = JSON.stringify(formData);
    // Send the data to the server and retrieve the server response
    const response = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: formDataJson,
    });
    console.log(response)

    // Execute if status is ok
    if (response.status === 200) {
        // Convert the response to a javascript object 
        const token = await response.json();
        // Convert the token into json
        const saveToken = JSON.stringify(token);
        // Save the token to the local storage
        window.localStorage.setItem("token", saveToken);

        console.log(token);

        // redirect to the home page 
        window.location.href = "http://127.0.0.1:5500/FrontEnd/";
      // Execute if the usuer is unknow
    } else if (response.status === 404) {
        displayError();
      // Execute if the password of the user is wrong
    } else {
        displayWrongPass()
    }
});

// Function to display an unknow user message
function displayError() {
    let spanErrorMessage = document.getElementById("errorMessage");

    if (!spanErrorMessage) {
        let popup = document.querySelector(".loginForm");
        spanErrorMessage = document.createElement("span");
        spanErrorMessage.id = "errorMessage";
        spanErrorMessage.innerText = "Utilisateur inconnu";
        popup.append(spanErrorMessage);
    } else {
        spanErrorMessage.innerText = "Utilisateur inconnu";
    }
};

// Function to display a wrong combination of email and pass
function displayWrongPass() {
    let spanMessage = document.getElementById("errorMessage");

    if (!spanMessage) {
        let popup = document.querySelector(".loginForm");
        spanMessage = document.createElement("span");
        spanMessage.id = "errorMessage";
        spanMessage.innerText = "Combinaison e-mail / mot de passe incorrect";
        popup.append(spanMessage);
    } else {
        spanMessage.innerText = "Combinaison e-mail / mot de passe incorrect";
    }
};