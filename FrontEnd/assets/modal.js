const openModal = function (e) {
    e.preventDefault()
    const target = document.querySelector(e.target.getAttribut("href"))
    target.style.display = null
    target
}

const bannerLink = document.querySelector(".aEdition")
const projectLink = document.querySelector(".aModifyLink")

bannerLink.addEventListener("click", openModal)
projectLink.addEventListener("click", openModal)

