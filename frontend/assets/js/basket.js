const productAPI = "http://localhost:3000/api/cameras/"; ///API that contains all product data. combined with ID number to pull information on a single product.
const quantityInputClasses = ["mx-3", "my-1"]; ///array of bootstrap classes that define the <input> markup for each individual product.
let contact;
let basketContents;
let total = 0;
let orderObj;
if (typeof window.localStorage.getItem('basket') === 'object') {
    basketContents = 0;
} else {
    basketContents = window.localStorage.getItem("basket").split(",");
}
const articleClasses = ["d-flex", "flex-md-row", "flex-column", "border", "border-light", "col-md-8", "m-md-3", "my-3"]; ///bootstrap classes that define the article in which the product is displayed
const divBuyClasses = ["d-flex", "flex-column", "justify-content-start", "m-3", "col-md-4"]; ///array of bootstrap classes that define the container of inputs for each individual product.
const newImgClasses = ["w-100", "h-auto", "m-0"]; ///array of bootstrap classes that define the image of each product.
const figureClasses = ["col-md-4", "m-0"] ///array of classes that define the <figure> element that contains the product photo.
async function getProductObject(url) {
    let productObject = await getProductList(url);
    return productObject;
};
function getProductList(url) {
    return new Promise(function (resolve, reject) {
        let productListAsk = new XMLHttpRequest;
        productListAsk.open('GET', url, true);
        productListAsk.onreadystatechange = function () {
            if (productListAsk.readyState === 4) {
                if (productListAsk.status === 200) {
                    resolve(JSON.parse(productListAsk.response))
                } else {
                    alert("Status: " + url + " " + productListAsk.status);
                }
            } else {
                ///console.log("Ready state: " + console.log(productListAsk.readyState))
            }
        }
        productListAsk.send();
    });
};
function postCommande() {
    return new Promise(function (resolve, reject) {
        
        let postOrder = new XMLHttpRequest;
        postOrder.open('POST', productAPI + "order", true);
        postOrder.onreadystatechange = function () {
            if (postOrder.readyState === 4) {
                if (postOrder.status === 201) {
                    resolve(JSON.parse(postOrder.response));
                } else {
                    alert("Status: " + postOrder.status);
                    resolve(JSON.parse(postOrder.response));
                }
            } else {
                console.log("Ready state: " + console.log(postOrder.readyState))
            }
        };
        postOrder.setRequestHeader('Content-Type', 'application/json');
        postOrder.send(JSON.stringify(orderObj));
    });
}
function addToProducts(obj) {
    const products = document.querySelector("#products");
    products.appendChild(makeArticle(obj));
    onSubmit(obj._id);
}
function makeArticle(obj) {
    const newArticle = document.createElement("article");
    articleClasses.forEach(element => { newArticle.classList.add(element) });
    newArticle.appendChild(makeFigure(obj));
    newArticle.appendChild(makeDiv(obj));
    newArticle.appendChild(makeOrderInputs(obj));
    return newArticle;
}
function makeFigure(obj) {
    const newFigure = document.createElement("figure");
    figureClasses.forEach(element => { newFigure.classList.add(element) });
    const newImg = document.createElement("img");
    newImgClasses.forEach(element => { newImg.classList.add(element) });
    newImg.setAttribute("src", obj.imageUrl);
    newImg.setAttribute("alt", "A camera for hipsters");
    newFigure.appendChild(newImg);
    return newFigure;
}
function makeDiv(obj) {
    const newDiv = document.createElement("div");
    newDiv.classList.add("col-md-4");
    const newTitle = document.createElement("h2");
    newTitle.textContent = obj.name;
    const newPrice = document.createElement("p");
    newPrice.textContent = "Prix: " + (obj.price / 100) + "€";
    const newDescription = document.createElement("p");
    newDescription.textContent = obj.description;
    newDescription.classList.add("text-truncate");
    const newLink = document.createElement("a");
    newLink.setAttribute("href", "../pages/product.html?pid=" + obj._id);
    newLink.textContent = "Afficher le produit";
    newDiv.appendChild(newTitle);
    newDiv.appendChild(newPrice);
    newDiv.appendChild(newDescription);
    newDiv.appendChild(newLink);
    return newDiv;
};
function makeOrderInputs(obj) {
    const newDivOrder = document.createElement("div");
    divBuyClasses.forEach(element => { newDivOrder.classList.add(element) });
    const newLabel = document.createElement("label");
    newLabel.setAttribute("for", "quantity");
    newLabel.textContent = "Quantité commandé : ";
    quantityInputClasses.forEach(element => { newLabel.classList.add(element) });
    const newQuantityInput = document.createElement('input');
    newQuantityInput.setAttribute("type", "number");
    newQuantityInput.setAttribute("min", "0");
    newQuantityInput.setAttribute("value", parseInt(window.localStorage.getItem(obj._id)))
    newQuantityInput.setAttribute("id", "qty" + obj._id);
    newQuantityInput.setAttribute("name", "quantity");
    quantityInputClasses.forEach(element => { newQuantityInput.classList.add(element) });
    const newBuyButton = document.createElement("input");
    newBuyButton.setAttribute("type", "submit");
    newBuyButton.setAttribute("value", "Modifier");
    newBuyButton.setAttribute("id", "mod" + obj._id);
    quantityInputClasses.forEach(element => { newBuyButton.classList.add(element) });
    newDivOrder.appendChild(newLabel);
    newDivOrder.appendChild(newQuantityInput);
    newDivOrder.appendChild(newBuyButton);
    return newDivOrder;
};
function onSubmit(obj) {
    const pID = obj;
    const modBtn = document.querySelector("#mod" + pID);
    const qty = document.querySelector("#qty" + pID);
    modBtn.addEventListener('click', () => changeBasket(Number(qty.value), pID));

}
function changeBasket(qty, id) {
    if (qty === 0 || qty < 0) {
        window.localStorage.removeItem(id);
        basketContents.splice(basketContents.indexOf(id), 1);
        window.localStorage.setItem('basket', basketContents);
        location.reload(true);
    } else if (typeof qty === 'number') {
        window.localStorage.setItem(id, qty);
        location.reload(true);
    } else {
        alert("Quantity is not a number!");
    }
};
function makeContact() {
    console.log("makeContact function commencing")
    const nom = document.querySelector("#nom");
    const prenom = document.querySelector("#prenom");
    const adresse = document.querySelector("#adresse");
    const ville = document.querySelector("#ville");
    const courriel = document.querySelector("#email");
    const tos = document.querySelector("#tos");
    commander = document.querySelector("#commander");
    if ([nom, prenom, adresse, ville, courriel].every(element => {
        if (element.value !== "" && typeof element.value === 'string') {
            return true;
        } else {
            commander.setAttribute("disabled", "true");
            tos.checked = false;
            alert("Veuillez bien vérifier votre saisie.")
            return false;
        }
    })) {
        commander.removeAttribute("disabled");
        contact = {
            lastName: nom.value,
            firstName: prenom.value,
            address: adresse.value,
            city: ville.value,
            email: courriel.value
        }
        orderObj = {
            contact,
            products: basketContents
        };
    };
}
window.onload = () => {
    const commander = document.querySelector("#commander");
    const tos = document.querySelector("#tos");
    if (basketContents === 0) {
        const product = document.querySelector("#products");
        const empty = document.createElement('p');
        empty.textContent = 'Ton panier est vide.';
        product.appendChild(empty);
        tos.addEventListener("change", () => makeContact());
    } else {
        basketContents.forEach(element => getProductObject(productAPI + element).then(value => {
            productObject = value;
            const prixTotal = document.querySelector("#prixTotal");
            addToProducts(productObject);
            total = total + ((productObject.price / 100) * Number(window.localStorage.getItem(productObject._id)));
            prixTotal.textContent = "Total de la commande : " + total + "€";
            window.localStorage.setItem("total", total);
        }));
        tos.addEventListener("change", () => makeContact());
        commander.addEventListener("click", () => postCommande().then(value => {
            orderId = value.orderId;
            window.localStorage.setItem("orderId", orderId);
            window.location.replace("./confirmation.html");
        } ));
    }
};