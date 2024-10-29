//Check and change from home page to admin page if a token is find 
checkTokenExists()

function checkTokenExists() {
    // check if in the cookie storage the token exist
    if (document.cookie.split(";").some((item) => item.trim().startsWith("token"))) {
        logoutBtn();
        editionBanner();
        removeFilterAndAddModifyBtn();
    }


}




// Function that changes the login button into a logout button and deletes the token when clicked
function logoutBtn() {
    const logout = document.querySelector(".logout");
    logout.innerHTML = "logout";
    logout.href = "";
    // Delete the token cookie "logout" button is clicked
    logout.addEventListener("click", function () {
        // Set the expiration date in the past which delete the token 
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    });
}
// Function that creates an editing banner below the header
function editionBanner() {
    const editionBanner = document.querySelector("body");
    const childHeader = document.querySelector("header");
    const divEdition = document.createElement("div");
    let contenant = `<a class="aEdition" href="#modal"><i class="fa-regular fa-pen-to-square"></i>Mode édition</a>`;
    divEdition.innerHTML = contenant;
    divEdition.classList = "editionBanner";
    // Insert the banner at the top of the body not in the end
    editionBanner.insertBefore(divEdition, childHeader)
}

// Function that removes filters and adds a button for editing projects
function removeFilterAndAddModifyBtn() {
    const filters = document.querySelector(".filters")
    filters.remove();
    const titleMargin = document.querySelector(".adminMargin");
    titleMargin.style.margin = '0em 1em 3em 0em';
    const parentModifyLink = document.getElementById("portfolio");
    const modifyLink = document.createElement("div");
    const childGallery = document.querySelector(".gallery")
    let contenant = `<a class="aModifyLink" href="#modal"><i class="fa-regular fa-pen-to-square"></i>modifier</a>`;
    modifyLink.innerHTML = contenant;
    modifyLink.classList = "modifyLink";
    // Get the link at the top of portfolio section
    parentModifyLink.insertBefore(modifyLink, childGallery)
    // Put the link and the title in the same div
    modifyLink.appendChild(titleMargin)
}