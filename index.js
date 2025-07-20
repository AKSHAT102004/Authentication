const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const JWT_SECRET = "randomIAMakshat";
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public")); // This serves index.html


const users = [];

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/public/index.html");
})

// function generateToken() {
//     let options = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

//     let token = "";
//     for (let i = 0; i < 32; i++) {
//         // use a simple function here
//         token += options[Math.floor(Math.random() * options.length)];
//     }
//     return token;
// } 

app.post("/signup", function(req, res) {
    const username = req.body.username;
    const password = req.body.password;

    if (users.find(u => u.username === username)) {
        return res.status(409).json({ message: "Username already exists" });
    }


    users.push({
        username: username,
        password: password
    })

    res.json({
        message: "You are signed up"
    })

    console.log(users);
})


app.post("/signin", function(req, res) {
    const username = req.body.username;
    const password = req.body.password;

    let founduser = null;

    for(let i = 0; i<users.length;i++)
    {
        if(users[i].username == username && users[i].password == password){
            founduser = users[i];
        }
    }

    if(founduser){
        const token = jwt.sign({username: username},JWT_SECRET);           //generateToken();
        // founduser.token = token;
        res.json({
            token: token
        })
    }
    else {
        res.status(403).send({
            message: "Invalid username or password"
        })
    }
    console.log(users);
})

function auth(req,res,next)
{
    const token = req.headers.token;
    const decodedData = jwt.verify(token, JWT_SECRET);
    if(decodedData.username){
        req.username = decodedData.username;
        next();
    }
    else{
        res.json({
            message: "You are not logged in"
        })
    }
}

app.get("/me", auth, function(req, res){
    let founduser = null;

    for(let i=0; i< users.length; i++)
    {
        if(users[i].username === req.username) founduser = users[i];
    }

    if(founduser){
        res.json({
            username: founduser.username,
            password: founduser.password
        })
    }
    else {
        res.json({
            message:"not found"
        })
    }
})

app.listen(3000);