// Login func
function usersLogin() {
    //debugger;
    console.log("Invoked UsersLogin()");
    let url = "/users/login";
    let formData = new FormData(document.getElementById('LoginForm'));

    fetch(url, {
        method: "POST",
        body: formData,
    }).then(response => {
        return response.json();                 //now return that promise to JSON
    }).then(response => {
        if (response.hasOwnProperty("Error")) {
            alert(JSON.stringify(response));        // if it does, convert JSON object to string and alert
        } else {
            debugger;
            console.log(response.token + " " + response.name);
            Cookies.set("token", response.token);
            Cookies.set("name", response.name);
            window.open("index.html", "_self");       //open misc.html in same tab
        }
    });
}