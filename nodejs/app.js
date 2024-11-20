const express = require('express');
const app = express();
const path = require('path');
var mysql = require('mysql2');
app.use(express.json())
var cors = require('cors');
app.use(cors())
app.use(express.static(path.join(__dirname, 'templates')));
const conn = mysql.createConnection({
  host: '127.0.0.1',          
  database: 'mydb',      
  user: 'root',          
  password: '1234'       
})
app.post('/register',function(req,res){
    var data = req.body['data'];
    var pass = req.body['pass'];
      conn.connect(function(err) {
        if (err) throw err;
        conn.query('SELECT * FROM persons WHERE username = (?)',[data], function (err, result, fields) {
          if (err) throw err;
          if(result[0]==undefined)
            {
                conn.connect(function(err) {
                    if (err) throw err;
                    console.log("Connected!");
                    var sql = "INSERT INTO persons (username,password) VALUES (?,?)";
                    conn.query(sql,[data,pass], function (err, result) {
                      if (err) throw err;
                      console.log("1 record inserted");
                    });
                  });
                res.json({ message: 'User Registered', status: 'success' });
            }
            else
                {
                    res.json({message:'User is already Existed',status:'Failed'});
                }
        });
      });
});
app.post('/login', function (req, res) {
  var data = req.body['data'];
  var pass = req.body['pass'];

  conn.connect(function (err) {
    if (err) throw err;
    conn.query(
      'SELECT * FROM persons WHERE username = (?) and password = (?)',
      [data, pass],
      function (err, result, fields) {
        if (err) throw err;
        console.log(result);

        if (result[0] == undefined) {
          res.json({ message: 'Wrong', status: 'Failed' });
        } else {
          res.json({
            token: "secureRandomToken123", // Replace this with a generated token
            username: result[0].username, // Send back the username for personalization
            status: "Success",
          });
        }
      }
    );
  });
});
app.post('/create',function(req,res)
{
    var data = req.body
    console.log(data)
    let obj;
    let obj1;


    const url = 'https://api.prodia.com/v1/sd/generate';
    const options = {
    method: 'POST',
    headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        'X-Prodia-Key': data['server']
    },
    body: JSON.stringify({
        model: data['model'],
        prompt: data['name'],
        negative_prompt: 'badly drawn',
        steps: Number(data['steps']),
        cfg_scale: 7,
        seed: -1,
        upscale: false,
        sampler: 'DPM++ 2M Karras',
        width: Number(data['width']),
        height: Number(data['height']),
      
        
    })
    };
    foo()
    async function foo()
    {
        const resp = await fetch(url,options)
        
        obj = await resp.json()
        console.log(obj)
        results()
    }

    
    async function results()
    {
    const url1 = `https://api.prodia.com/v1/job/${obj['job']}`;
    const options1 = {method: 'GET', headers: {accept: 'application/json', 'X-Prodia-Key': data['server']}};
        const res1 = await fetch(url1,options1)
        obj1 = await res1.json()
        if(obj1['status']=="succeeded")
            {
              conn.connect(function(err) {
                if (err) throw err;
                console.log("Connected!");
                var sql = "INSERT INTO sources (username,imageurl) VALUES (?,?)";
                conn.query(sql,[data['username'],obj1['imageUrl']], function (err, result) {
                  if (err) throw err;
                  console.log("1 record inserted");
                });
              });
                res.send(obj1)
                
            }
        else{
            results()
            console.log(obj1)
        }
    }

    // foo()
    // results()
})
app.get('/registerpage', function(req, res) {
  res.sendFile(path.join(__dirname, 'templates','register.html'));
});
app.get('/loginpage', function(req, res) {
  res.sendFile(path.join(__dirname, 'templates','login.html'));
});
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'templates','index.html'));
});
app.post('/loaddata', function(req, res) {
  var data= req.body
  conn.query(
    'SELECT * FROM sources WHERE username = (?)',
    [data['username']],
    function (err, result, fields) {
      if (err) throw err;
      console.log(result);
      res.send(result)
    })

});

app.listen(3000,function()
{
    console.log("Server is Listening");
})