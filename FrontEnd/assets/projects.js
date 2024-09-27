// Get current projects in the local storage if there are any.
let projects = window.localStorage.getItem("projects");

if (projects === null) {
    // Get projects from API
    const reponse = await fetch("http://localhost:5678/api/works");
    console$.log (reponse);
    projects = await reponse.json();
    // Transform format projects into JSON
    const jsonProjects = JSON.stringify(projects);
    // put projects in the local storage 
    window.localStorage.setItem("projects", jsonProjects); 
} else {
    projects = JSON.parse(projects); {}
}

