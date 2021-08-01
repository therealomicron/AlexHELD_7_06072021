const submissionUrl = "http://localhost:8080/api/auth/submissions";

const submitCaller = function (url) {
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
        req.setRequestHeader('Authorization', 'Bearer ' + bearerToken);
        req.send(formData);
    })
}

window.onload = () => {
    console.log("onLoad function called");
    const submitButton = document.querySelector("#submitSubmission");
    submitButton.addEventListener("click", () => submitCaller(submissionUrl).then(
            window.location = './feed'
        ).catch(
            error => {
                console.log(error);
            }
        )
    );
}
