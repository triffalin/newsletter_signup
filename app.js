//jshint esversion: 6
/** request from run server with framework he need */
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const { allowedNodeEnvironmentFlags } = require("process");

const app = express();

/** for access to another folder, ex images/css, we need create static public folder, after copy all that folder to public folder */
app.use(express.static("public"));
/** for see what user inserted */
app.use(bodyParser.urlencoded({extended: true}));

/** request from user on root, response to signup.html */
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/signup.html")
});

/** post data inserted to form from user */
app.post("/", (req, res) => {

    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    const url = "https://us4.api.mailchimp.com/3.0/lists/424eb518ed";

    const options = {
        method: "POST",
        auth: "alin1:be0540e33ad76ddbca513ffd86640612-us4"
    };

    const request = https.request(url, options, (response) => {
        
        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        };
        
        response.on("data", (data) => {
            console.log(JSON.parse(data));
        });
    });

    request.write(jsonData);
    request.end();

});

/** for try again after failure, to redirect user to root page */
app.post("/failure", (req,res) => {
    res.redirect("/");
});

/** run server on port; for heroku server you need adding  process.env.PORT to 3000 port (for testing local + on heroku server) */
app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running on port 3000.");
});

// API KEY
// be0540e33ad76ddbca513ffd86640612-us4

// List ID
// 424eb518ed