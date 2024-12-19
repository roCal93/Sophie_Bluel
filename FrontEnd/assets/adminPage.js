// Checks if a token exists and changes from home page to admin page if applicable
checkTokenExists()

function checkTokenExists() {
    // Checks in the cookie storage if the token exists
    if (document.cookie.split(";").some((item) => item.trim().startsWith("token"))) {
        changeLoginIntoLogoutBtn();
        addEditionBanner();
        removeFilterAndAddModifyBtn();
    }
}

// Function that changes the login button into a logout button and deletes the token when clicked
function changeLoginIntoLogoutBtn() {
    const logout = document.querySelector(".logout");
    logout.innerHTML = "logout";
    logout.href = "#";
    // Deletes the token cookie when the "logout" button is clicked
    logout.addEventListener("click", function () {
        // Sets the expiration date in the past which deletes the token 
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        window.location.reload();
    });
}

// Function that creates an editing banner under the header
function addEditionBanner() {
    const editionBanner = document.querySelector("html");
    const childHeader = document.querySelector("body");
    const divEdition = document.createElement("div");
    let contenant = `<a class="aModalLink" href="#modal"><i class="fa-regular fa-pen-to-square"></i>Mode édition</a>`;
    divEdition.innerHTML = contenant;
    divEdition.classList = "editionBanner";
    // Inserts the banner at the top of the body not at the end
    editionBanner.insertBefore(divEdition, childHeader)
}

// Function that removes filters and adds a button to edit projects
function removeFilterAndAddModifyBtn() {
    const filters = document.querySelector(".filters")
    filters.remove();
    const titleMargin = document.querySelector(".adminMargin");
    titleMargin.style.margin = '0em 1em 3em 0em';
    const parentModifyLink = document.getElementById("portfolio");
    const modifyLink = document.createElement("div");
    const childGallery = document.querySelector(".gallery")
    let contenant = `<a class="aModalLink" href="#modal"><i class="fa-regular fa-pen-to-square"></i>modifier</a>`;
    modifyLink.innerHTML = contenant;
    modifyLink.classList.add("modifyLink")
    // Gets the link at the top of the portfolio section
    parentModifyLink.insertBefore(modifyLink, childGallery)
    // Puts the link and the title in the same div
    modifyLink.appendChild(titleMargin)
}