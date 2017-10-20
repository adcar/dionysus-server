const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const request = require('request');
const urlencode = require('urlencode');

// Pull in config
// const config = require('./config.json');

// Pull in config enviroment variables
require('env2')('./config.env');

if (process.env.API_KEY == "INSERT_API_KEY_HERE"){
  throw Error("You have not entered an API Key. Please edit the config.env file and place your alluc.ee API Key inside.");
}

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(__dirname + '/views'));

// Body Parser middleware
app.use(urlencodedParser = bodyParser.urlencoded({ extended: false }))


// Get home page
app.get("/", function(req, res){
  res.render("index", {
    title: "Dionysus",
    });
});


app.get("/watch/:id", function(req, res ){
  var encodedInput = urlencode(req.params.id);
  console.log("SEARCH: " + req.params.id + " (" + encodedInput + ")"); // Logging

  // Concatenation is fun :D
  request('https://www.alluc.ee/api/search/stream/?apikey=' + process.env.API_KEY + '&query=' + encodedInput + '%20' + process.env.QUALITY + '%20' + 'host%3Aopenload.co' + '&count=4&from=0&getmeta=0', function (error, response, body) {

    // Simple JSON parse from the request
    var parsedBody = JSON.parse(body);

    var links = []; // Initialize links array
    for (var i=0; i < 4; i++){ //  Creates an array with everything filled with "" (nothing) rather than undefined. (Undefined will cause node server to crash)
      links.push("");
    }

    if (parsedBody["result"].length > 0){
      for (var i=0; i < parsedBody["result"].length; i++){
        links[i] = parsedBody["result"][i]["hosterurls"][0]["url"]; // Replaces "" with links
      }
      var streamsError = "" // Sets the stream error content to nothing
    }
    else {
      console.log("ERR: There's no streams available"); // Logging
      var streamsError = "Sorry, there are no streams available for this TV Show / Movie :(" // Gives stream error some content
    }

    console.log("LINKS: " + links) // Logging

    res.render("watch", { // Render the watch page and pass some variables
      link1: links[0],
      link2: links[1],
      link3: links[2],
      link4: links[3],
      streamsError: streamsError
      });

    })

  });





app.post("/watch/submit", function(req, res){
  var userInput = req.body.userInput;
  var encodedInput = urlencode(userInput);
  res.redirect("/watch/" + userInput);
  });



app.listen(process.env.PORT, function(){
  console.log("Dionysus server started on port " + process.env.PORT + "...")
})
