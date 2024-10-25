//Check and change from home page to admin page if a token is find 
checkTokenExists()

function checkTokenExists() {
    // check if in the cookie storage the token exist
    if (document.cookie.split(";").some((item) => item.trim().startsWith("token"))) {
        logoutBtn();
        editionBanner();
        const filters = document.querySelector(".filters")
        filters.remove();
        

    }
}





function logoutBtn() {
    const logout = document.querySelector(".logout");
    logout.innerHTML = "logout";
    logout.href = "";
    // Delete the token cookie "logout" button is clicked
    logout.addEventListener("click", function () {
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    });
}
function editionBanner() {
    const editionBanner = document.querySelector("body");
    const childHeader = document.querySelector("header");
    const divEdition = document.createElement("div");
    let contenant = `<a class="aEdition" href=""><i class="fa-regular fa-pen-to-square"></i>Mode édition</a>`;
    divEdition.innerHTML = contenant;
    divEdition.classList = "editionBanner";
    editionBanner.insertBefore(divEdition, childHeader)
}