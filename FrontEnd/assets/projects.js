/////////////////////////////////////////////// Project Homepage //////////////////////////////////////////////////////////////////////////////////

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


////////////////////////////////////////////// Filter Button Homepage ///////////////////////////////////////////////////////////////////

// Retrieve the div where all the buttons go 
const btnFilter = document.querySelector(".filters");
// Creates filters button and add text to them
const btnAll = document.createElement("button");
btnAll.innerHTML = "Tous";
// Append button to the div 
btnFilter.appendChild(btnAll);
// Display all the project when "Tous" button is clicked
btnAll.addEventListener("click", function () {
    // Clear screen and regenerate page with all parts 
    document.querySelector(".gallery").innerHTML = "";
    displayProjects(projects);
});
try {
    // request that get category
    const response = await fetch('http://localhost:5678/api/categories', {
        headers: {
            'accept': 'application/json'
        }
    });
    // Transform the format of projects into JSON
    const category = await response.json()
    // Loop to create a button for each category, which when clicked will display only the projects in its category.
    for (let i = 0; i < category.length; i++) {
        const btnFilter = document.querySelector(".filters");
        const currentCategory = category[i];
        const btnCategory = document.createElement("button");
        btnCategory.innerHTML = currentCategory.name
        // Append buttons to the div 
        btnFilter.appendChild(btnCategory)
        btnCategory.addEventListener("click", function () {
            const projectsFiltrees = projects.filter(function (project) {
                return project.categoryId === currentCategory.id;
            });
            // Clear screen and regenerate page with filtered parts only
            document.querySelector(".gallery").innerHTML = "";
            displayProjects(projectsFiltrees);
        })
    }
} catch (error) {
    displayCategoryError("Un problème est survenu lors du chargement des catégories veuillez réessayer plus tard");
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////// Modal //////////////////////////////////////////////////////////////


// Fonction who make the add photo btn 
addPhotoBtnModal()

//Function who display the project in the modal 
displayProjectsModal(projects)

// Function who delete project
deleteProject(projects)

// ajout d'un listener pour fabriquer la deuxième page 
let backArrow = null
const photoBtnModal = document.querySelector(".photoBtnModal")
const divGallery = document.querySelector(".modalGallery")
const titleModal = document.getElementById("titleModal")
const divContent = document.querySelector(".modalContent")
let addPhotoContent = null
let validateBtnModal = null

photoBtnModal.addEventListener("click", async function () {
    // hide the photo btn modal
    photoBtnModal.style.display = "none"
    // hide the project gallery
    divGallery.style.display = "none"
    // change the modal title 
    titleModal.innerHTML = "Ajout photo"

    if (validateBtnModal === null) {
        // Function who add the validate button
        addValidateBtnModal()
    }

    if (addPhotoContent === null) {
        // Function that inserts the form part
        addPhotoPart()
        //Function that searches for categories and inserts them into the select element
        addSelectCategory()
        //Function that creates a preview of the image before sending. 
        previewPhoto()

        const imgInp = document.getElementById("imgInp")
        const photoCat = document.getElementById("categorySelect")
        const photoInfo = document.getElementById("photoTitle")
        const btnSubmit = document.querySelector(".validateBtnModal")

        //Sends the project when the validated button is clicked and adds it to the home page 
        btnSubmit.addEventListener("click", async function (event) {
            event.preventDefault();
            // Retrieve the token value in cookies 
            let token = getCookie("token")
            // Delete the quotation marks
            token = token.replace(/"/g, "");

            //New FormData object 
            const form = new FormData();
            form.append('image', imgInp.files[0]);
            form.append('title', photoInfo.value);
            form.append('category', photoCat.value);
            try {
                //Send new project 
                const response = await fetch('http://localhost:5678/api/works', {
                    method: 'POST',
                    headers: {
                        'accept': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                    body: form
                });

                // Function who reset the modalform 
                resetModalForm()

                if (response.status === 201) {
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
                    // Clear homescreen and regenerate page with all parts 
                    document.querySelector(".gallery").innerHTML = "";
                    displayProjects(projects);
                    // Clear modalscreen and regenerate page with all parts 
                    document.querySelector(".modalGallery").innerHTML = "";
                    displayProjectsModal(projects);
                }

            } catch {
                sendProjectError("Problème est lors de l'envoi veuillez réessayer plus tard")
            }
        })
        //Add the back arrow and its functions 
        addBackArrow(divGallery, titleModal,)
    }
})
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

// Fonction who display an error message if the API won't work category
function displayCategoryError(message) {
    if (!document.cookie.split(";").some((item) => item.trim().startsWith("token"))) {

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
}

// Fonction who make the add photo btn 
function addPhotoBtnModal() {
    const btnModalContent = document.querySelector(".btnModalContent")
    const photoBtnModal = document.createElement("button")
    photoBtnModal.classList.add("photoBtnModal")
    photoBtnModal.innerHTML = "Ajouter une photo"
    btnModalContent.appendChild(photoBtnModal)
}

// Function who display the project in the modal 
function displayProjectsModal(projects) {
    //only creates the modal gallery if it doesn't already exist 
    if (document.querySelector(".modalGallery") === null) {
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
    }

    for (let i = 0; i < projects.length; i++) {
        // Current project is the project that iterate
        const currentProject = projects[i];
        // Retrieve the DOM element that will host the projects
        const divGallery = document.querySelector(".modalGallery")
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
        divGallery.appendChild(projectElement);
        projectElement.appendChild(imageElement);
        projectElement.appendChild(trashIcon)
    }
}

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
            console.log(idTrashValue)
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

// Function who add the validate button
function addValidateBtnModal() {

    const btnModalContent = document.querySelector(".btnModalContent")
    const validateBtnModal = document.createElement("button")
    validateBtnModal.classList.add("validateBtnModal")
    validateBtnModal.innerHTML = "Valider"
    btnModalContent.appendChild(validateBtnModal)
}

// Function that inserts the form part
function addPhotoPart() {
    const addPhotoContent = document.createElement("form")
    addPhotoContent.setAttribute("id", "addWorkForm")
    addPhotoContent.classList.add("formPhoto")
    addPhotoContent.method = 'POST'
    addPhotoContent.enctype = 'multipart/form-data'
    addPhotoContent.innerHTML = `<div class="addPhoto">
                                <i class="fa-regular fa-image"></i>
                                <label for="imgInp">
                                    <div class="addPhotoBtn">
                                        <img id="preview" src="#" alt="your image" />
                                        <span>+ Ajouter photo</span>
                                    </div>
                                    <p>jpg, png : 4mo max</p>
                                    <input type="file" id="imgInp" accept="image/*" name="image"/>
                                </label>
                            </div>
                            <div class="photoInfo">
                                <label for="photoTitle">Titre</label>
                                <input type="text" name="title" id="photoTitle">
                                <label for="categorySelect">Catégorie</label>
                                <select name="category" id="categorySelect">
                                    <option value="">Définir une catégorie</option>
                                </select>
                            </div>`
    divContent.appendChild(addPhotoContent)
}

//Function that searches for categories and inserts them into the select element
async function addSelectCategory() {
    try {
        const response = await fetch('http://localhost:5678/api/categories', {
            headers: {
                'accept': 'application/json'
            }
        });
        // Transform the format of projects into JSON
        const category = await response.json()

        //Loop that creates a selector for each category found
        for (let i = 0; i < category.length; i++) {
            const selectBase = document.getElementById("categorySelect")
            const currentCategory = category[i];
            const optionCategory = document.createElement("option");
            optionCategory.innerHTML = currentCategory.name
            optionCategory.value = currentCategory.id
            // Append selector to the select element
            selectBase.appendChild(optionCategory)
        }
    } catch {
        displaySelectCatError("Problème lors du chargement réessayer plus tard")
    }
}

// Fonction who display an error message if the API won't work category select
function displaySelectCatError(message) {
    let spanErrorMessage = document.getElementById("errorMessage");

    if (!spanErrorMessage) {
        let popup = document.querySelector(".photoInfo")
        spanErrorMessage = document.createElement("span");
        spanErrorMessage.id = "errorMessage";
        spanErrorMessage.innerText = message;
        popup.append(spanErrorMessage);
    } else {
        spanErrorMessage.innerText = message;
    }
}

//Function that creates a preview of the image before sending. 
function previewPhoto() {
    const imgInp = document.getElementById("imgInp")
    imgInp.addEventListener("change", function (event) {
        event.preventDefault()
        const [file] = imgInp.files
        const addPhoto = document.querySelector(".addPhotoBtn")
        const preview = document.getElementById("preview")
        if (file) {
            addPhoto.style.width = "100px"
            preview.style.display = "flex"
            preview.src = URL.createObjectURL(file)
            const photoInfo = document.getElementById("photoTitle")
            photoInfo.value = imgInp.files[0].name;
        }
    })
}

// Function who reset the form 
function resetModalForm() {
    document.querySelector(".addPhotoBtn").style.width = "173px"
    document.getElementById("addWorkForm").reset()
    preview.style.display = "none"
}

function sendProjectError(message) {
    let spanErrorMessage = document.getElementById("errorMessage");

    if (!spanErrorMessage) {
        let popup = document.querySelector(".formPhoto");
        spanErrorMessage = document.createElement("span");
        spanErrorMessage.id = "errorMessage";
        spanErrorMessage.innerText = message;
        popup.append(spanErrorMessage);
    } else {
        spanErrorMessage.innerText = message;
    }
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

//Add the back arrow and its functions 
function addBackArrow(divGallery, titleModal) {
    let addPhotoContent = document.getElementById("addWorkForm")
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




