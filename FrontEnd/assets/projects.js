
// Get current projects in the local storage if there are any.
let projects = window.localStorage.getItem("projects");
try{
    if (projects === null) {
        // Get projects from API
        const reponse = await fetch("http://localhost:5678/api/works");
        // Transform the format of projects into JSON
        projects = await reponse.json();
        // Takes a JavaScript object and transforms it into JSON string
        const jsonProjects = JSON.stringify(projects);
        // Put projects in the local storage 
        window.localStorage.setItem("projects", jsonProjects);
    } else {
        // Takes a JSON string and transforms it into a JavaScript object
        projects = JSON.parse(projects); { }
    }

    // Function to display the different projects
    function displayProjects(projects) {
        for (let i = 0; i < projects.length; i++) {
            // Current project is the project that iterate
            const currentProject = projects[i];
            // Retrieve the DOM element that will host the projects
            const divGallery = document.querySelector(".gallery");
            // Creating an element dedicated to a project
            const projectElement = document.createElement("figure");
            projectElement.dataset.id = projects[i].id;
            // Creating elements
            const imageElement = document.createElement("img");
            imageElement.src = currentProject.imageUrl;
            imageElement.alt = currentProject.title;
            const titleElement = document.createElement("figcaption");
            titleElement.innerText = currentProject.title;
            // Append elements
            divGallery.appendChild(projectElement);
            projectElement.appendChild(imageElement);
            projectElement.appendChild(titleElement);
        }
    }

    displayProjects(projects);

    // Retrieve the div where all the buttons go 
    const btnFilter = document.querySelector(".filters");
    // Creating filters button and add text to them
    const btnAll = document.createElement("button");
    btnAll.innerHTML = "Tous";
    const btnObject = document.createElement("button");
    btnObject.innerHTML = "Objets"
    const btnApartment = document.createElement("button");
    btnApartment.innerHTML = "Appartements"
    const btnHotelsAndRestaurants = document.createElement("button");
    btnHotelsAndRestaurants.innerHTML = "Hotels & Restaurants"

    // Append buttons to the div 
    btnFilter.appendChild(btnAll);
    btnFilter.appendChild(btnObject);
    btnFilter.appendChild(btnApartment);
    btnFilter.appendChild(btnHotelsAndRestaurants);

    // Display all the project when "Tous" button is clicked
    btnAll.addEventListener("click", function () {
        // Clear screen and regenerate page with all parts 
        document.querySelector(".gallery").innerHTML = "";
        displayProjects(projects);
    });

    // Only display object project when "Objets" button is clicked
    btnObject.addEventListener("click", function () {
        const projectsFiltrees = projects.filter(function (project) {
            return project.categoryId === 1;
        });
        // Clear screen and regenerate page with filtered parts only
        document.querySelector(".gallery").innerHTML = "";
        displayProjects(projectsFiltrees);
    });

    // Only display apartment project when "Appartements" button is clicked
    btnApartment.addEventListener("click", function () {
        const projectsFiltrees = projects.filter(function (project) {
            return project.categoryId === 2;
        });
        // Clear screen and regenerate page with filtered parts only
        document.querySelector(".gallery").innerHTML = "";
        displayProjects(projectsFiltrees);
    });

    // Only display hotels and restaurants project when "Hotels & Restaurants" button is clicked
    btnHotelsAndRestaurants.addEventListener("click", function () {
        const projectsFiltrees = projects.filter(function (project) {
            return project.categoryId === 3;
        });
        // Clear screen and regenerate page with filtered parts only
        document.querySelector(".gallery").innerHTML = "";
        displayProjects(projectsFiltrees);
    });
} catch (error) {
    console.log(error)
    //displayProjectError("Un problème est survenu veuillez réessayer plus tard");
}

function displayProjectError(message) {
    let spanErrorMessage = document.getElementById("errorMessage");

    if (!spanErrorMessage) {
        let popup = document.querySelector(".gallery");
        spanErrorMessage = document.createElement("span");
        spanErrorMessage.id = "errorMessage";
        spanErrorMessage.innerText = message;
        popup.append(spanErrorMessage);
    } else {
        spanErrorMessage.innerText = message;
    }
}