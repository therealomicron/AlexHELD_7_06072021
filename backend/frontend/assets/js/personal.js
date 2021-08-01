const signupUrl = "http://localhost:8080/api/auth/users/signup";
const loginUrl = "http://localhost:8080/api/auth/users/login";
const logoutLink = require('common');


async function supprimerCompte(url) {
    const mdp = document.querySelector("#hashedPassword");
    const bearerToken = window.sessionStorage.getItem("groupomaniaToken");
    const response = await fetch(url, {
        method: "DELETE",
        mode: "cors",
        cache: "no-cache",
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + bearerToken
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify({
            hashedPassword: mdp.value
        })
    });
    return response;
}
deleteRoute = "http://localhost:8080/api/auth/users/suppression";
window.onload = () => {
    const deleteButton = document.querySelector("#deletion");
    deleteButton.addEventListener("click", () => supprimerCompte(deleteRoute).then(
                value => {
                if (value.status == 200) {
                    alert("Votre compte a été supprimé.")
                window.sessionStorage.removeItem("groupomaniaToken");
                window.location = "./home"; }
            }).catch(
                error => {
                    console.log(error);
                }
            )
    )
    logoutLink();
}
