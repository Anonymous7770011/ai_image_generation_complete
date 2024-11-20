const username = sessionStorage.getItem("username");
const authToken = sessionStorage.getItem("authToken");
console.log(username);

if (!username || !authToken) {
  alert("You are not logged in!");
  window.open("http://localhost:3000/loginpage", "_self");
} else {
  
  document.getElementById("welcome-message").innerText = `Welcome, ${username}!`;
}

function logout() {
  sessionStorage.clear();
  window.open("http://localhost:3000/loginpage", "_self");
}
async function generate()
{
var currentDate = document.getElementById("currentDate");
var status = document.createElement("h1"); 
status.innerHTML="Generating";
currentDate.appendChild(status);
const prompt = document.getElementById('prompt');
const model = document.getElementById('model');
const server = document.getElementById('server');
const widthSlider = document.getElementById('widthSlider');
const heightSlider = document.getElementById('heightSlider');
const steps = document.getElementById('steps');
const res = await fetch('http://localhost:3000/create',{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify(
        {
            server:server.value,
            name:prompt.value,
            model:model.value,
            height:heightSlider.value,
            width:widthSlider.value,
            steps:steps.value,
            username:username,
    })
    });
let obj = await res.json()

console.log(obj['imageUrl'])

if(obj.imageUrl != null){
    const data = obj.imageUrl;
    currentDate.removeChild(status)
    var firstid = document.createElement("img"); 
    firstid.src=data;
    currentDate.appendChild(firstid);
    

}
else{
    
    // status.innerHTML="Error";
}

}
async function loaddata()
{
  const res = await fetch('http://localhost:3000/loaddata',{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify(
        {
            username:username,
    })
    });
    let source = await res.json()
    for(let elements in source)
    {
      var firstid = document.createElement("img"); 
      firstid.src=source[elements]['imageurl'];
      currentDate.appendChild(firstid);
    }

}