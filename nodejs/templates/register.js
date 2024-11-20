async function register()
{
var data = document.getElementById("data").value;
var pass = document.getElementById("pass").value;

const res = await fetch('http://localhost:3000/register',{
    method:'POST',
    headers:{
        'Content-Type':'application/json'
    },
    body:JSON.stringify(
    {
        data:data,
        pass:pass
    })
});
const result = await res.json();
console.log(result['status']);
if(result['status']=="success")
    {
        alert("User is added")
        window.open("http://localhost:3000/loginpage", "_self");
    }
else{
    alert("User is already existed");
    
}

}