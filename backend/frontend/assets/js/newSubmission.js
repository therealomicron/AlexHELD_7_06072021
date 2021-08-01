const submissionUrl = "http://localhost:8080/api/auth/submissions";

const logoutLink = require('common');
async function submitCaller(url) {
    const submissionTitle = document.querySelector("#submissionTitle");
    const submissionText = document.querySelector("#submissionText");
    const submissionImage = document.querySelector("#submissionImage").files[0];
    const submissionJson = {
        title: submissionTitle.value,
        submissionText: submissionText.value
    };
    const bearerToken = window.sessionStorage.getItem("groupomaniaToken");
    let formData = new FormData();
    formData.append('submission', JSON.stringify(submissionJson));
    formData.append('image', submissionImage);


    const response = await fetch(url, {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: 'same-origin',
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
         headers: {
            'Authorization': 'Bearer ' + bearerToken
        },
        body: formData
        })
    return response;
}

window.onload = () => {
    console.log("onLoad function called");
    const submitButton = document.querySelector("#submitSubmission");
    submitButton.addEventListener("click", () => submitCaller(submissionUrl).then(
        response => {
            if (response.status == 201) {
            alert("Succès !");
            window.location = './feed';
            } else {
                alert("Une erreur inconnue est survenue pendant votre demande.")
            }
        }
        ).catch(
            error => {
                console.log(error);
            }
        )
    );
    logoutLink();
}
