class LoginStatus {
  constructor() {
    this.token = sessionStorage.getItem("token");
    this.loginEl = document.querySelector("#login");
    this.editModePanel = document.querySelector("#edit-mode-panel");
    this.editEl = document.querySelector(".edit");
    this.loginStatus = false;

    this.checkLoginStatus();
    this.addEventListeners();
  }

  checkLoginStatus() {
    if (this.token) {
      this.loginEl.textContent = "logout";
      this.loginStatus = true;
      this.editModePanel.style.display = "flex";
      this.editEl.style.display = "flex";
    } else {
      this.loginEl.textContent = "login";
    }
  }

  logOut(e) {
    if (this.loginStatus) {
      e.preventDefault();
      this.loginStatus = false;
      this.loginEl.textContent = "login";
      this.editModePanel.style.display = "none";
      this.editEl.style.display = "none";
      sessionStorage.removeItem("token");
    }
  }

  addEventListeners() {
    this.loginEl.addEventListener("click", (e) => {
      this.logOut(e);
    });
  }
}

const loginStatus = new LoginStatus();