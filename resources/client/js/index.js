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