const newsApi = "http://localhost:8080/api/auth/submissions";
function getNews(url) {
    const bearerToken = window.sessionStorage.getItem("groupomaniaToken");
    console.log("getting news with token " + bearerToken);
    return new Promise(function (resolve, reject) {
        let newsAsk = new XMLHttpRequest();
        newsAsk.open("GET", url, true);
        newsAsk.onreadystatechange = function () {
            console.log(newsAsk.readyState);
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
    const newLink = document.createElement("a");
    newLink.setAttribute("href", "./submission.html?sid=" + obj.id);
    newLink.textContent = "Lire la discussion";
    newDiv.appendChild(newTitle);
    newDiv.appendChild(newAuthor);
    newDiv.appendChild(newDescription);
    newDiv.appendChild(newLink);
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

kickoffNews(newsApi).then(value => {
    newsList = value;
    for (let i = 0; i < newsList.length; i++) {
        addToNews(newsList[i]);
    }
}).catch(
    error => {
        console.log(error);
    }
);