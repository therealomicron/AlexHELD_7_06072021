const signupUrl = "http://localhost:8080/api/auth/users/signup";
const loginUrl = "http://localhost:8080/api/auth/users/login";

const logoutLink = require('common');
const connecter = function (url) {
    const uid = document.querySelector("#pseudo");
    const mdp = document.querySelector("#hashedPassword");
    console.log(uid.value);
    console.log(mdp.value);
    return new Promise(function (resolve, reject) {
        let req = new XMLHttpRequest()
        req.open('POST', url, true)
        req.onreadystatechange = function () {
            if (req.readyState == 4) {
                if (req.status == 200) {
                    resolve(JSON.parse(req.response))
                } else {
                    reject(req)
                }
            }
        };
        req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        req.send(JSON.stringify({
            "pseudo": uid.value,
            "hashedPassword": mdp.value
        }));
    })
}

async function sinscrire(url) {
    const uid = document.querySelector("#pseudo");
    const mdp = document.querySelector("#hashedPassword");
    const response = await fetch(url, {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify({
            pseudo: uid.value,
            hashedPassword: mdp.value
        })
    });
    return response;
}

window.onload = () => {
    console.log("onLoad function called");
    const loginButton = document.querySelector("#connecter");
    const signupButton = document.querySelector("#sinscrire");
    loginButton.addEventListener("click", () => connecter(loginUrl).then(
        value => {
            console.log(value);
            window.sessionStorage.setItem("groupomaniaToken", value.token);
            window.location = "./feed";
        }).catch(
            error => {
                console.log(error);
            }
        )
    );
    signupButton.addEventListener("click", () => sinscrire(signupUrl).then(
            response => {
                if (response.status == 201) {
            connecter(loginUrl).then(
                value => {
                console.log(value);
                window.sessionStorage.setItem("groupomaniaToken", value.token);
                window.location = "./feed";
            }).catch(
                error => {
                    console.log(error);
                }
            )} else {
                console.log("echec");
            }}
        ).catch(
            error => {
                console.log(error);
            }
        )
    );
    logoutLink();
}
