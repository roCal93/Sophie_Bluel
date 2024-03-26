// Création du conteneur principal de la galerie
const portfolio = document.getElementById("portfolio");
let gallery = document.querySelector(".gallery");
portfolio.appendChild(gallery);


  // Récupération des données de la galerie avec l'API
  const getData = fetch("http://localhost:5678/api/works")
    // Crée le fichier JSON avec les données reçues
    .then(response => response.json())
    // Envoie les données à la fonction createGalleryItems pour créer les éléments de la galerie
    .then(data => {
      console.log(data);
      gallery = createGalleryItems(data);
    })
    // En cas d'erreur
    .catch(error => {
      console.error("Une erreur s'est produite :", error);
    });

// Fonction pour créer les éléments de la galerie à partir de data
function createGalleryItems(data) {
  
    for (let i = 0; i < data.length; i++) {
        // Création des éléments de la galerie
        const figure = document.createElement("figure");
        const img = document.createElement("img");
        const figcaption = document.createElement("figcaption");
        figure.appendChild(img);
        figure.appendChild(figcaption);
        gallery.appendChild(figure);
  
        // Ajout des éléments de la galerie à partir de l'API
        img.src = data[i].imageUrl;
        img.alt = data[i].title;
        figcaption.textContent = data[i].title;
    }
      // Renvoi de la galerie assemblée
    return gallery;
  }