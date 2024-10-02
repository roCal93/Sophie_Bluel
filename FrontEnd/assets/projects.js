// Get current projects in the local storage if there are any.
let projects = window.localStorage.getItem("projects");

if (projects === null) {
    // Get projects from API
    const reponse = await fetch("http://localhost:5678/api/works");
    projects = await reponse.json();
    // Transform format projects into JSON
    const jsonProjects = JSON.stringify(projects);
    // Put projects in the local storage 
    window.localStorage.setItem("projects", jsonProjects); 
} else {
    // Takes a JSON string and transforms it into a JavaScript object
    projects = JSON.parse(projects); {}
}

console.log(projects)

//function to display the different projects
function displayProjects(projects){
    for(let i = 0; i < projects.length; i++) {
        
        const  allProject = projects[i];
        // Retrieve the DOM element that will host the projects
        const divGallery = document.querySelector(".gallery");
        // Creating an element dedicated to a project
        const projectElement = document.createElement("figure");
        projectElement.dataset.id = projects[i].id;
        // Creating elements
        const imageElement = document.createElement("img");
		imageElement.src = allProject.imageUrl;
        imageElement.alt = allProject.title;
        const titleElement = document.createElement("figcaption");
        titleElement.innerText = allProject.title;

        divGallery.appendChild(projectElement);
        projectElement.appendChild(imageElement);
        projectElement.appendChild(titleElement);
    }
}

displayProjects(projects)