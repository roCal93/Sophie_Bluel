const form = document.querySelector('.loginForm');

form.addEventListener("submit", async function (event) {
    event.preventDefault();
    const formData = {
        "email": document.getElementById("email").value,
        "password": document.getElementById("pass").value
    };

    const formDataJson = JSON.stringify(formData);
   
   

    const reponse = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {"Content-Type": "application/json" },
        body: formDataJson,
    });

    const token = await reponse.json();
    console.log(token);

});


