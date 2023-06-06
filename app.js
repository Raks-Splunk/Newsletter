const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const request = require("request");
const { subscribe } = require("diagnostics_channel");

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/",function(req,res){
    res.sendFile(__dirname + "/signup.html");
})

app.post("/",function(req,res){
    const email=req.body.email;
    const name=req.body.name;
    console.log(email);
    console.log(name);

    const data ={
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: name
                }
            }
        ]
    };
    const jsonData =JSON.stringify(data);
    const url="https://us21.api.mailchimp.com/3.0/lists/6ad203aed5";
    const options={
        method: "POST",
        auth: "raks1:96d24835cb019bfdc53c1b9ac8ea7bb9-us21"
    }
    const request = https.request(url,options,function(response){
        if(response.statusCode===200){
            res.sendFile(__dirname+"/success.html");
        }
        else{
            res.sendFile(__dirname+"/failure.html");
        }
        response.on("data",function(data){
            console.log(JSON.parse(data));
        })
    })
    request.write(jsonData);
    request.end();
})

app.post("/failure", function(req,res){
    res.redirect("/");
})

app.listen(3002, function(){
    console.log("Server is running on port 3001");
})

// apikey
// 96d24835cb019bfdc53c1b9ac8ea7bb9-us21

//list id 6ad203aed5