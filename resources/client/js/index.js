// Logout function
function logout() {
    debugger;
    console.log("Invoked logout");
    let url = "/users/logout";
    fetch(url, {method: "POST"
    }).then(response => {
        return response.json();                 //now return that promise to JSON
    }).then(response => {
        if (response.hasOwnProperty("Error")) {
            alert(JSON.stringify(response));        // if it does, convert JSON object to string and alert
        } else {
            Cookies.remove("token", response.token);    //UserName and Token are removed
            Cookies.remove("name", response.name);
            window.open("login.html", "_self");       //open signup.html in same tab
        }
    });
    // test
}
// Tutorial redirect button
function tutorialRed(){
    window.open("tutorial.html", "_self");
}
// Game redirect button
function gameRed(){
    window.open("game.html","_self");
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function output(){
    let a = getCookie("name");
    let x = document.getElementById("username");
    console.log(a);
    x.innerHTML = a;
}

function getUserChips(){
    let a = getCookie("name");
    console.log("Invoked getUserChips");
    let url = "/users/getChips/";
    fetch(url+a, {method: "GET"
    }).then(response => {
        return response.json();                 //now return that promise to JSON
    }).then(response => {
        if (response.hasOwnProperty("Error")) {
            alert(JSON.stringify(response));        // if it does, convert JSON object to string and alert
        } else {
            displayChipCount(response);
        }
    });
}

function returnChipCount(response){
   return response.chipcount;
}

function displayChipCount(response){
    let a = returnChipCount(response);
    let x = document.getElementById("chips");
    x.innerHTML = "Chips: " + a;
}
