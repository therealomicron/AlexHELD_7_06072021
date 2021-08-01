exports.logOutEvent = () => {
    logOutLink = document.querySelector("logout");
    logOutLink.addEventListener("click", ()=> {
        window.sessionStorage.removeItem("groupomaniaToken");
        window.location = "./home";
    })
}