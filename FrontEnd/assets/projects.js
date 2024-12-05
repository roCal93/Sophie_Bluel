

// Get current projects in the local storage if there are any.
let projects = window.localStorage.getItem("projects");

if (projects === null) {
    try {
        // Get projects from API
        const reponse = await fetch("http://localhost:5678/api/works");
        // Transform the format of projects into JSON
        projects = await reponse.json();
        // Takes a JavaScript object and transforms it into JSON string
        const jsonProjects = JSON.stringify(projects);
        // Put projects in the local storage 
        window.localStorage.setItem("projects", jsonProjects);
    } catch (error) {
        displayProjectError("Un problème est survenu lors du chargement des projets veuillez réessayer plus tard");
    }
} else {
    // Takes a JSON string and transforms it into a JavaScript object
    projects = JSON.parse(projects);
}
// Display all the projects 
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





////////////////////////

//////////////////////////////////1ere etape///////////////////////////////////////////////////////

addPhotoBtnModal()
// Fonction who make the add photo btn 

function addPhotoBtnModal() {
    const btnModalContent = document.querySelector(".btnModalContent")
    const photoBtnModal = document.createElement("button")
    photoBtnModal.classList.add("photoBtnModal")
    photoBtnModal.innerHTML = "Ajouter une photo"
    btnModalContent.appendChild(photoBtnModal)
}

//////////////////////////////////2emes etape////////////////////////////////////////////
displayProjectsModal(projects)

//Function who display the project in the modal 
function displayProjectsModal(projects) {
    //Add the title
    const titleModal = document.getElementById("titleModal")
    titleModal.innerHTML = "Galerie photo"
    // Retrieve the DOM element that will host the modal gallery
    const divContent = document.querySelector(".modalContent")
    // Creating an element dedicated to host the projects
    let divGallery = document.createElement("div");
    divGallery.classList.add("modalGallery")
    // Append element
    divContent.appendChild(divGallery);

    for (let i = 0; i < projects.length; i++) {
        // Current project is the project that iterate
        const currentProject = projects[i];
        // Retrieve the DOM element that will host the projects
        let divGallery = document.querySelector(".modalGallery")
        // Creates an element dedicated to a project
        const projectElement = document.createElement("figure");
        projectElement.dataset.id = projects[i].id;
        projectElement.classList.add("projectsModal")
        // Creates element trash
        const trashIcon = document.createElement("button");
        trashIcon.classList.add("btnTrash")
        trashIcon.innerHTML = '<i class="fa-solid fa-trash-can"></i>'
        // Adding the attribute project id to the trash element 
        trashIcon.dataset.id = projects[i].id
        // Creates element image
        const imageElement = document.createElement("img");
        imageElement.src = currentProject.imageUrl;
        imageElement.alt = currentProject.title;
        // Append elements
        if (divGallery !== null) {
            divGallery.appendChild(projectElement);
        }
        projectElement.appendChild(imageElement);
        projectElement.appendChild(trashIcon)
    }
    divGallery = null
}
////////////////////////////////////3èmes etape ////////////////////////////////////////////////////
deleteProject(projects)

// Function who delete project
function deleteProject(projects) {
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

            try {
                // Send the request of deletion to the server
                const response = await fetch('http://localhost:5678/api/works/' + idTrashValue, {
                    method: 'DELETE',
                    headers: {
                        'accept': '*/*',
                        'Authorization': 'Bearer ' + token
                    }
                });

                // If the response confirm the deletion de project is removed of the DOM
                if (response.status === 204) {
                    // Get the project from the homepage and the modal 
                    let deletedProjectHome = Array.from(document.querySelectorAll(".projectsHome"))
                    let deletedProjectModal = Array.from(document.querySelectorAll(".projectsModal"))

                    // Remove the project from who was deleted from the DOM
                    deletedProjectModal[i].remove()
                    deletedProjectHome[i].remove()

                    // remove all the projects of the local storage
                    window.localStorage.removeItem("projects")
                    // Get projects from API
                    const reponse = await fetch("http://localhost:5678/api/works");
                    // Transform the format of projects into JSON
                    projects = await reponse.json();
                    // Takes a JavaScript object and transforms it into JSON string
                    const jsonProjects = JSON.stringify(projects);
                    // Put projects in the local storage 
                    window.localStorage.setItem("projects", jsonProjects);
                }
            } catch (error) {
                displayProjectErroradmin("Un problème est survenu lors du chargement des projets veuillez réessayer plus tard");
            }

        })
    }
}

////////////////////////////////////////////////////4etape///////////////////////////////////////////////////////

// ajout d'un listener pour fabriquer la deuxième page 
let backArrow = null
const photoBtnModal = document.querySelector(".photoBtnModal")
const divGallery = document.querySelector(".modalGallery")
const titleModal = document.getElementById("titleModal")
const divContent = document.querySelector(".modalContent")
let addPhotoContent = null
let validateBtnModal = null

photoBtnModal.addEventListener("click", function () {
    // hide the photo btn modal
    photoBtnModal.style.display = "none"

    // hide the project gallery
    divGallery.style.display = "none"
    // change the modal title 
    titleModal.innerHTML = "Ajout photo"


    if (validateBtnModal === null) {
        addValidateBtnModal()


        function addValidateBtnModal() {

            const btnModalContent = document.querySelector(".btnModalContent")
            const validateBtnModal = document.createElement("button")
            validateBtnModal.classList.add("validateBtnModal")
            validateBtnModal.innerHTML = "Valider"
            btnModalContent.appendChild(validateBtnModal)
        }
    }

    if (addPhotoContent === null) {
        const addPhotoContent = document.createElement("form")
        addPhotoContent.setAttribute("id", "addWorkForm")
        addPhotoContent.classList.add("formPhoto")
        addPhotoContent.innerHTML = `<div class="addPhoto">
                                        <i class="fa-regular fa-image"></i>
                                        <label for="imgInp">
                                            <div class="addPhotoBtn">
                                                <img id="preview" src="#" alt="your image" />
                                                <span>+ Ajouter photo</span>
                                            </div>
                                            <p>jpg, png : 4mo max</p>
                                            <input name="image" accept="image/*" type="file" id="imgInp" multiple/>
                                        </label>
                                    </div>
                                    <div class="photoInfo">
                                        <label for="photoTitle">Titre</label>
                                        <input type="text" name="title" id="photoTitle">
                                        <label for="categorySelect">Catégorie</label>
                                        <select name="category" id="categorySelect">
                                            <option value="1">Objets</option>
                                            <option value="2">Appartements</option>
                                            <option value="3">Hotels & restaurants</option>
                                        </select>
                                    </div>`
        divContent.appendChild(addPhotoContent)

        const imgInp = document.getElementById("imgInp")
        imgInp.addEventListener("change", function (event) {
            event.preventDefault()
            const [file] = imgInp.files
            const addPhoto = document.querySelector(".addPhotoBtn")
            if (file) {
                addPhoto.style.width = "100px"
                preview.style.display = "flex"
                preview.src = URL.createObjectURL(file)
                const photoInfo = document.getElementById("photoTitle")
                photoInfo.value = imgInp.files[0].name;
            }
        })

        const photoCat = document.getElementById("categorySelect")
        const photoInfo = document.getElementById("photoTitle")
        const btnSubmit = document.querySelector(".validateBtnModal")
        btnSubmit.addEventListener("click", async function (event) {

            event.preventDefault();
            console.log(photoInfo.value)
            console.log(photoCat.value)
            console.log(imgInp.files[0])

            let token = getCookie("token")
            // Delete the quotation marks
            token = token.replace(/"/g, "");


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
            const form = new FormData();
            form.append('image', imgInp.files[0]);
            form.append('title', photoInfo.value);
            form.append('category', photoCat.value);

            const response = await fetch('http://localhost:5678/api/works', {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'Authorization': 'Bearer ' + token,
                },
                body: form
            });
        })


        //add the back arrow
        addBackArrow(divGallery, titleModal, addPhotoContent)

        function addBackArrow(divGallery, titleModal, addPhotoContent) {
            const modalHeader = document.querySelector(".modalHeader")
            backArrow = document.createElement("button")
            backArrow.innerHTML = `<i class="fa-solid fa-arrow-left"></i>`
            backArrow.classList.add("backArrow")
            modalHeader.style.justifyContent = "space-between"
            modalHeader.style.flexDirection = "row-reverse";
            modalHeader.appendChild(backArrow)
            let validateBtnModal = document.querySelector(".validateBtnModal")
            backArrow.addEventListener("click", function () {
                validateBtnModal.remove()
                validateBtnModal = null
                addPhotoContent.remove()
                addPhotoContent = null
                backArrow.remove()
                backArrow = null
                if (photoBtnModal.style.display === "none") {
                    photoBtnModal.style.display = "initial"
                }
                if (divGallery.style.display === "none") {
                    divGallery.style.display = "grid"
                }
                if (titleModal.innerHTML === "Ajout photo") {
                    titleModal.innerHTML = "Galerie photo"
                }
            })
        }

    }
})

//////////////////////////////5 etape//////////////////////////////////////////////////////////




















//////////////////////////////////////////////// Functions ///////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////

// Fonction who display an error message if the API won't work homepage
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


// Function to display the different projects homepage
function displayProjects(projects) {
    for (let i = 0; i < projects.length; i++) {
        // Current project is the project that iterate
        const currentProject = projects[i];
        // Retrieve the DOM element that will host the projects
        const divGallery = document.querySelector(".gallery");
        // Creates an element dedicated to a project
        const projectElement = document.createElement("figure");
        projectElement.dataset.id = projects[i].id;
        projectElement.classList.add("projectsHome")
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




function displayProjectErroradmin(message) {
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



