const newsApi = "http://localhost:8080/api/auth/submissions/";
let searchParams = new URLSearchParams(location.search);
let sId = searchParams.get("sid");
function getNews(url) {
    const bearerToken = window.sessionStorage.getItem("groupomaniaToken");
    return new Promise(function (resolve, reject) {
        let newsAsk = new XMLHttpRequest();
        newsAsk.open("GET", url, true);
        newsAsk.onreadystatechange = function () {
            if (newsAsk.readyState === 4) {
                if (newsAsk.status === 200) {
                    resolve(newsAsk.response);
                } else {
                    reject(newsAsk.response);
                }
            } else {
                console.log("Ready state: " + newsAsk.readyState);
            }
        }
        console.log(bearerToken);
        newsAsk.setRequestHeader('Authorization', 'Bearer ' + bearerToken);
        newsAsk.send();
    });
};

async function kickoffNews(url) {
    let newsString = await getNews(url);
    return JSON.parse(newsString);
}

function makeFigure(obj) {
    const newFigure = document.createElement("figure");
    newFigure.classList.add("col-4");
    const newImg = document.createElement("img");
    newImg.classList.add("img-thumbnail");
    newImg.setAttribute("src", obj.image);
    newImg.setAttribute("alt", "user-submitted image");
    newFigure.appendChild(newImg);
    return newFigure;
}

function makeDiv(obj) {
    const newDiv = document.createElement("div");
    newDiv.classList.add("col-8");
    const newTitle = document.createElement("h2");
    newTitle.textContent = obj.title;
    const newAuthor = document.createElement("p");
    newAuthor.textContent = "Auteur : " + obj.author;
    const newDescription = document.createElement("p");
    newDescription.textContent = obj.submissionText;
    newDescription.classList.add("text-truncate");
    newDiv.appendChild(newTitle);
    newDiv.appendChild(newAuthor);
    newDiv.appendChild(newDescription);
    return newDiv;
};

function makeArticle(obj) {
    const newArticle = document.createElement("article");
    newArticle.classList.add("d-flex");
    newArticle.classList.add("flew-row");
    newArticle.classList.add("m-3");
    newArticle.appendChild(makeFigure(obj));
    newArticle.appendChild(makeDiv(obj));
    return newArticle;
}

function addToNews(obj) {
    const newsFeed = document.querySelector("#news");
    newsFeed.appendChild(makeArticle(obj));
}

kickoffNews(newsApi + sId).then(value => {
    console.log(value);
    newsList = value;
    addToNews(newsList);
}).catch(
    error => {
        console.log(error);
    }
);

const commentUrl = "http://localhost:8080/api/auth/comments";

const commentCaller = function (url) {
    const commentText = document.querySelector("#commentText");
    const commentJson = {
        commentText: commentText.value,
        submissionId: sId
    };
    const bearerToken = window.sessionStorage.getItem("groupomaniaToken");
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
        req.setRequestHeader('Authorization', 'Bearer ' + bearerToken);
        req.send(JSON.stringify(commentJson));
    })
}

/*window.onload = () => {
    console.log("onLoad function called");
    const submitButton = document.querySelector("#submitComment");
    submitButton.addEventListener("click", () => submitCaller(commentUrl).then(
            window.location = './feed'
        ).catch(
            error => {
                console.log(error);
            }
        )
    );
}
*/