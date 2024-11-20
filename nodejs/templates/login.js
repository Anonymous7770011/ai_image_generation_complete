async function login() {
var data = document.getElementById("datas").value;
var pass = document.getElementById("pass").value;

const res = await fetch("http://localhost:3000/login", {
    method: "POST",
    headers: {
    "Content-Type": "application/json",
    },
    body: JSON.stringify({
    data: data,
    pass: pass,
    }),
});
const result = await res.json();
console.log(result);

if (result.status === "Failed") {
    alert("Username or password is incorrect");
} else {
    // Store the token and username in sessionStorage
    sessionStorage.setItem("authToken", result.token);
    sessionStorage.setItem("username", result.username);

    // Redirect to the next page
    window.open("http://localhost:3000/", "_self");
}
}
