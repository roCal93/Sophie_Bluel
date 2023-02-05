//  afficher tous les travaux //
async function displayWorks() {
     // Récupération des travaux depuis l'API
    const reponse = await fetch("http://localhost:5678/api/works");
    const works = await reponse.json();
    for (let work of works) {
        // Récupération de l'élément du DOM qui accueillera les travaux
        const portfolioGallery = document.querySelector(".gallery");
        // Création d’une balise dédiée à un work
        const workElement = document.createElement("figure");
        // Création des balises 
        const imageElement = document.createElement("img");
        imageElement.src = work.imageUrl;
        imageElement.alt = work.title;
        imageElement.crossOrigin = "anonymous";
        const titleElement = document.createElement("figcaption");
        titleElement.innerText = work.title;
        
        // On rattache la balise figure à la section gallery
        portfolioGallery.appendChild(workElement);
        // On rattache l’image et figcaption à workElement (la balise figure)
        workElement.appendChild(imageElement);
        workElement.appendChild(titleElement);
        };
};
displayWorks();

// Recupérer et afficher toutes les catégories //
async function displayCategories() {
    const reponse = await fetch("http://localhost:5678/api/categories");
    const categories = await reponse.json();
    for (let categorie of categories) {
        const buttonsFilter = document.querySelector(".filtres")
        const buttonFilter = document.createElement("button");
        buttonFilter.className = "filter-btn";
        buttonFilter.innerText = categorie.name;
        buttonsFilter.appendChild(buttonFilter);
    }
}
displayCategories();

async function filterCategories() {
    const defaultButton = document.querySelector("#all");
    // Par défaut, la catégorie Tous est cliquée
    defaultButton.classList.add("active")
    //const buttonsFilter = document.querySelectorAll(".filter-btn");  
    const filterButton = document.querySelector(".filtres");
    filterButton.addEventListener("click", async function (event) {
        const categorieName = event.target.innerText;
        const buttonsFilter = document.querySelectorAll(".filter-btn");  
        console.log(buttonsFilter)
        for (let button of buttonsFilter) {
            button.addEventListener("click", () => {
                    for (let removeActive of buttonsFilter) {
                    // Retire la classe active
                    removeActive.classList.remove("active");
                    // Ajoute la classe active au bouton
                    button.classList.add("active");
                };
        });
        document.querySelector(".gallery").innerHTML = "";
        const reponse = await fetch("http://localhost:5678/api/works");
        const works = await reponse.json();
        if (categorieName != "Tous")
            for (let work of works) {
                if (categorieName === work.category.name) {
                    const portfolioGallery = document.querySelector(".gallery");
                    // Création d’une balise dédiée à un work
                    const workElement = document.createElement("figure");
                    // Création des balises 
                    const imageElement = document.createElement("img");
                    imageElement.src = work.imageUrl;
                    imageElement.alt = work.title;
                    imageElement.crossOrigin = "anonymous";
                    const titleElement = document.createElement("figcaption");
                    titleElement.innerText = work.title;
                    // On rattache la balise figure à la section gallery
                    portfolioGallery.appendChild(workElement);
                    // On rattache l’image et figcaption à workElement (la balise figure)
                    workElement.appendChild(imageElement);
                    workElement.appendChild(titleElement);
                    }
                } else {
                    displayWorks();
            }
        }
    });
}
filterCategories();

// affichage mode edition
const token = localStorage.getItem("Token")

if (token){
    const modeEdition = document.querySelectorAll(".edition-mode");
    for (let data of modeEdition) {
        data.classList.add("active"); 
    }
    const modeEditionFilter = document.querySelector(".filtres");
    modeEditionFilter.style.display = "none";
    const logout = document.getElementById("login-logout")
    logout.setAttribute("href", "./index.html");
    logout.innerText = "logout";
    logout.style.fontWeight ="700";
    logout.addEventListener("click", function (event) {
        localStorage.removeItem("Token");
    }
    )
    };