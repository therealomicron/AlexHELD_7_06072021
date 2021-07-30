window.onload = () => {
    const total = document.querySelector("#total");
    const orderNumber = document.querySelector("#orderNumber");
    total.textContent = "Merci de votre commande de " + window.localStorage.getItem("total") +"€";
    orderNumber.textContent = "Votre commande " + window.localStorage.getItem("orderId") + " sera traitée dans un delai le plus bref possible.";
    window.localStorage.clear();
}