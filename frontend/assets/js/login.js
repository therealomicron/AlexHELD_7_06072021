const signup = "http://localhost:8080/api/auth/users/signup";
const login = "http://localhost:8080/api/auth/users/login";

function apiCall(url) {
    return new Promise(function (resolve, reject) {
        let apiRequest = new XMLHttpRequest();
        apiRequest.open("POST", url, true);
        apiRequest.onreadystatechange = function () {
            if (apiRequest.readyState === 4) {
                if (apiRequest.status === 200) {
                    resolve(apiRequest.response);
                } else {
                    reject(apiRequest.response);
                }
            } else {
                console.log("Ready state: " + apiRequest.readyState);
            }
        }
        apiRequest.send();
    });
};

async function connect(url) {
    let  = await apiCall(url);
    return JSON.parse(productString);
}


productArray(productAPI).then(value => {
    productList = value;
    for (let i = 0; i < productList.length; i++) {
        addToProducts(productList[i]);
    }
});