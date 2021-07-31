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

function afficherCommentaires(data) {
    const newArticle = document.createElement("article");
    const newCommentaire = document.createElement("p");
    newArticle.appendChild(newCommentaire);
    newCommentaire.textContent = data.commentText;
    newArticle.classList.add("w-100");
    newArticle.classList.add("border");
    newArticle.classList.add("my-3");
    return newArticle;
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

const commentUrl = "http://localhost:8080/api/auth/comments/";

async function postComment(url){
    const commentText = document.querySelector("#cT");
    const bearerToken = window.sessionStorage.getItem("groupomaniaToken");
    const response = await fetch(url, {
        method: "POST",
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
            commentText: commentText.value,
            submissionId: sId
        })
    });
    return response;
}

async function getComments(url) {
    const bearerToken = window.sessionStorage.getItem("groupomaniaToken");
    const commentaires = await fetch(url, {
        method: "GET",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
            'Authorization': 'Bearer ' + bearerToken
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: null
    });
    const respo = await commentaires.json();
    return respo;
}


window.onload = () => {
    const commentButton = document.querySelector("#cB");
    commentButton.addEventListener("click", () => postComment(commentUrl).then(
            data => {
                console.log(data);
                window.location.reload();
            }
        ).catch(
            error => {
                commentButton.classList.add("bg-danger")
                alert(error);
                console.log(error);
            }
        )
    );
    getComments(commentUrl + sId).then(response => {
        console.log("array length: " + response.length);
        for (let i = 0; i < response.length; i++) {
            const commentsColumn = document.querySelector("#comments");
            const comment = afficherCommentaires(response[i]);
            commentsColumn.appendChild(comment);
        }
    }).catch(
        error => {
            const commentsColumn = document.querySelector("#comments");
            commentsColumn.classList.add("bg-warning");
            console.log(error);

        }
    );
}
