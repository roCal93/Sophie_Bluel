// Set modal
let modal = null
// Defined the focusable element
const focusableSelector = "button, a, input, textarea"
// Creat an array for the focusable 
let focusables = []
// set previouslyFocusedElement
let previouslyFocusedElement = null


// Open the modal 
function openModal(e) {
    e.preventDefault()
    // Retrieve the id of the modal
    modal = document.querySelector(e.target.getAttribute("href"))
    // Retrieve all focusable elements of the modal in an array
    focusables = Array.from(modal.querySelectorAll(focusableSelector))
    // Saves the last element of the homepage that has focus
    previouslyFocusedElement = document.querySelector(":focus")
    // Display the modal
    modal.style.display = "flex"
    // Set the focus to the first element
    focusables[0].focus()
    // Make the modal visible for an accessibility API
    modal.removeAttribute("aria-hidden")
    // The aria-modal attribute indicates whether an element is modal when displayed.
    modal.setAttribute("aria-modal", "true")
    // Close the modal when a click hapens outside the window modal
    modal.addEventListener("click", closeModal)
    // Close the modal when the cross is cliked 
    modal.querySelector(".closeModal").addEventListener("click", closeModal)
    // Don't close the modal when a click happens inside the window modal
    modal.querySelector(".modalStop").addEventListener("click", stopPropagation)
}

// Close the modal
function closeModal(e) {
    // If the modal is closed this function won't happend
    if (modal === "none") return
    // Put the focused to the last element focused before the modal was display
    if (previouslyFocusedElement !== null) previouslyFocusedElement.focus()
    e.preventDefault()
    // Undisplay the modal
    modal.style.display = "none"
    // Hide the modal for an accessibility API
    modal.setAttribute("aria-hidden", "true")
    // Remove the aria-modal attribute
    modal.removeAttribute("aria-modal")
    // Delete the eventListener who close the modal when a click happen outside
    modal.removeEventListener("click", closeModal)
    // Delete the eventListener who close the modal when a click happen on the cross
    modal.querySelector(".closeModal").removeEventListener("click", closeModal)
    // Delete the eventListener who don't close the modal when a click happens inside the window modal
    modal.querySelector(".modalStop").removeEventListener("click", stopPropagation)
    // Reset the modal
    modal = null
}

// Function that stop the propagation of an event
function stopPropagation(e) {
    e.stopPropagation()
}

// function which allow to navigate in a loop in the modal
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

// Get links who open the modal
const bannerLink = document.querySelector(".aEdition")
const projectLink = document.querySelector(".aModifyLink")

// Start the openModal function when a click happens on links
bannerLink.addEventListener("click", openModal)
projectLink.addEventListener("click", openModal)

// close the modal when the escape key is down or focus on the modal if the tab key is down and the modal is displayed
window.addEventListener("keydown", function (e) {
    if (e.key === "Escape" || e.key === "Esc") {
        closeModal(e)
    }
    if (e.key === "Tab" && modal !== null) {
        focusInModal(e)
    }
})

// Retrieve the project in the local storage
let projects = window.localStorage.getItem("projects");
// Takes a JSON string and transforms it into a JavaScript object
projects = JSON.parse(projects); 

// Function who display the project into the modal 
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
