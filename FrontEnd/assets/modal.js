
let modal = null
const focusableSelector = "button, a, input, textarea"
let focusables = []
let previouslyFocusedElement = null

function openModal(e) {
    e.preventDefault()
    modal = document.querySelector(e.target.getAttribute("href"))
    focusables = Array.from(modal.querySelectorAll(focusableSelector))
    previouslyFocusedElement = document.querySelector(":focus")
    modal.style.display = null;
    focusables[0].focus()
    modal.removeAttribute("aria-hidden")
    modal.setAttribute("aria-modal", "true")
    modal.addEventListener("click", closeModal)
    modal.querySelector(".closeModal").addEventListener("click", closeModal)
    modal.querySelector(".modalStop").addEventListener("click", stopPropagation)
}

function closeModal(e) {
    if (modal === null) return
    if (previouslyFocusedElement !== null) previouslyFocusedElement.focus()
    e.preventDefault()
    modal.style.display = "none"
    modal.setAttribute("aria-hidden", "true")
    modal.removeAttribute("aria-modal")
    modal.removeEventListener("click", closeModal)
    modal.querySelector(".closeModal").removeEventListener("click", closeModal)
    modal.querySelector(".modalStop").removeEventListener("click", stopPropagation)
    modal = null
}

function stopPropagation(e) {
    e.stopPropagation()
}

function focusInModal(e) {
    e.preventDefault()
    let index = focusables.findIndex(f => f === modal.querySelector(":focus"))
    if (e.shiftKey === true) {
        index --
    } else {
        index ++
    }
    if (index >= focusables.length) {
        index = 0
    }
    if (index < 0) {
        index = focusables.length - 1
    }
    focusables[index].focus()
}

const bannerLink = document.querySelector(".aEdition")
const projectLink = document.querySelector(".aModifyLink")

bannerLink.addEventListener("click", openModal)
projectLink.addEventListener("click", openModal)

window.addEventListener("keydown", function (e) {
    if (e.key === "Escape" || e.key === "Esc") {
        closeModal(e)
    }
    if (e.key === "Tab" && modal !== null) {
        focusInModal(e)
    }
})

let projects = window.localStorage.getItem("projects");
projects = JSON.parse(projects); 

displayProjects(projects)

function displayProjects(projects) {
    for (let i = 0; i < projects.length; i++) {
        // Current project is the project that iterate
        const currentProject = projects[i];
        // Retrieve the DOM element that will host the projects
        const divGallery = document.querySelector(".modalGallery");
        // Creating an element dedicated to a project
        const projectElement = document.createElement("figure");
        projectElement.dataset.id = projects[i].id;
        // Creating elements
        const imageElement = document.createElement("img");
        imageElement.src = currentProject.imageUrl;
        imageElement.alt = currentProject.title;
        
        // Append elements
        divGallery.appendChild(projectElement);
        projectElement.appendChild(imageElement);
    }
}
