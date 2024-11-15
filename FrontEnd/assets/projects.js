
try {
    // Get current projects in the local storage if there are any.
    let projects = window.localStorage.getItem("projects");

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
        projects = JSON.parse(projects);
    }

    displayProjects(projects);

    // Retrieve the div where all the buttons go 
    const btnFilter = document.querySelector(".filters");
    // Creates filters button and add text to them
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
    displayProjectError("Un problème est survenu lors du chargement des projets veuillez réessayer plus tard");
}

// Function to display the different projects
function displayProjects(projects) {
    for (let i = 0; i < projects.length; i++) {
        // Current project is the project that iterate
        const currentProject = projects[i];
        // Retrieve the DOM element that will host the projects
        const divGallery = document.querySelector(".gallery");
        // Creates an element dedicated to a project
        const projectElement = document.createElement("figure");
        projectElement.dataset.id = projects[i].id;
        // Creates elements
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
// Fonction who display an error message if the API won't work 
function displayProjectError(message) {
    let spanErrorMessage = document.getElementById("errorMessage");

    if (!spanErrorMessage) {
        let popup = document.querySelector(".filters");
        spanErrorMessage = document.createElement("span");
        spanErrorMessage.id = "errorMessage";
        spanErrorMessage.innerText = message;
        popup.append(spanErrorMessage);
    } else {
        spanErrorMessage.innerText = message;
    }
}

////////////////////////

// first modal title
let modalGalleryTitle = {
    name: "Galerie Photo"
}
// second modal title 
let modalAddPhotoTitle = {
    name: "Ajout photo"
}

// Function who diplay the title 
function displayTitleModal() {
    const title = document.getElementById("titleModal")
    title.innerHTML = this.name
}
// display the modal gallery title
let displayTitleModal1 = displayTitleModal.bind(modalGalleryTitle);
displayTitleModal1()




// First button title 
let addPhoto = {
    name: "Ajouter une photo"
}
// Second button title
let validate = {
    name: "Valider"
}
function displayTitleBtnModal() {
    const btnModal = document.querySelector(".btnModal")
    btnModal.innerHTML = this.name
}
let displayTitleBtnModal1 = displayTitleBtnModal.bind(addPhoto);
displayTitleBtnModal1()






// Function who display the project into the modal 
displayProjectsModal()

function displayProjectsModal() {
    // Retrieve the project in the local storage
    let projects = window.localStorage.getItem("projects");
    // Takes a JSON string and transforms it into a JavaScript object
    projects = JSON.parse(projects);
    // Retrieve the DOM element that will host the modal gallery
    const divContent = document.querySelector(".modalContent")
    // Creating an element dedicated to host the projects
    const divGallery = document.createElement("div");
    divGallery.classList.add("modalGallery")
    // Append element
    divContent.appendChild(divGallery);

    for (let i = 0; i < projects.length; i++) {
        // Current project is the project that iterate
        const currentProject = projects[i];
        // Retrieve the DOM element that will host the projects
        const divGallery = document.querySelector(".modalGallery")
        // Creates an element dedicated to a project
        const projectElement = document.createElement("figure");
        projectElement.dataset.id = projects[i].id;
        // Creates element trash
        const trashIcon = document.createElement("button");
        trashIcon.className = "btnTrash"
        trashIcon.innerHTML = '<i class="fa-solid fa-trash-can"></i>'
        // Adding the attribute project id to the trash element 
        trashIcon.dataset.id = projects[i].id
        // Creates element image
        const imageElement = document.createElement("img");
        imageElement.src = currentProject.imageUrl;
        imageElement.alt = currentProject.title;
        // Append elements
        divGallery.appendChild(projectElement);
        projectElement.appendChild(imageElement);
        projectElement.appendChild(trashIcon)
    }

    // Loop who iterate for each project
    for (let i = 0; i < projects.length; i++) {
        // Creates an array with all the trash button 
        let trashIcons = []
        trashIcons = Array.from(document.querySelectorAll(".btnTrash"))

        // Listen the click for each icon trash 
        trashIcons[i].addEventListener("click", async function () {
            // Retrieve the project id 
            const idTrashValue = trashIcons[i].getAttribute("data-id")
            // Retrieve the token value in cookies 
            let token = getCookie("token")
            // Delete the quotation marks
            token = token.replace(/"/g, "");

            // // Send the request of deletion to the server
            const response = await fetch('http://localhost:5678/api/works/' + idTrashValue, {
                method: 'DELETE',
                headers: {
                    'accept': '*/*',
                    'Authorization': 'Bearer ' + token
                }
            });
            if (response.status === 204) {
                window.localStorage.removeItem("projects")



            }
        })


    }

    // Fonction who retrieve the value of a cookie by name 
    function getCookie(name) {
        const cookies = document.cookie.split('; ')
        const value = cookies
            .find(c => c.startsWith(name + "="))
            ?.split('=')[1]
        if (value === undefined) {
            return null
        }
        return decodeURIComponent(value)
    }
}












////// Add photo page
const btnModal = document.querySelector(".btnModal")
btnModal.addEventListener("click", function () {

    let displayTitleModal2 = displayTitleModal.bind(modalAddPhotoTitle);
    displayTitleModal2()
    let displayTitle2BtnModal = displayTitleBtnModal.bind(validate);
    displayTitle2BtnModal()
})





