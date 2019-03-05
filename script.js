// REQUIREMENTS //////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

//Read and set any environment variables with the dotenv package
require("dotenv").config();

//Grab all other packages required by liri.js
var fs = require("fs");
var axios = require("axios");
var moment = require("moment");
var Spotify = require("node-spotify-api");

//Enable the Spotify API call /////////////////////////////////////////////////
//Import the keys.js file and store it in a variable
var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);

//Capture input from command line and concatenate arguments ///////////////////
var inputArray = process.argv;
var actionRequest = process.argv[2];
var inputString = inputArray.splice(3).join("+");

//Divider will be used as a spacer in console log and/or in export txt file
var divider = "\n------------------------------------------------------------";

// FUNCTIONS ///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

// Execute Bands in Town Artist Event request
function concertThis (arg) {
    var artist = arg;
    var queryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

    axios.get(queryUrl).then(function(response) {

        var jsonData = response.data[0];
        var dateOfEvent = moment(jsonData.datetime);
        var dateOfEventClean = dateOfEvent.format('MM DD YYYY');

        // showData ends up being the string containing the show data we will print to the console
        var showData = [
            divider,
            "This is the next " + jsonData.description + " concert !!!!!!",
            "Name of Venue: " + jsonData.venue.name,
            "Venue Location: " + jsonData.venue.city,
            "Date of the Event: " + dateOfEventClean,
            divider
        ].join("\n\n");

        console.log(showData);
        printToLog(showData);
        }
    );
};

// Execute Spotify request
function spotifyThisSong (arg) {
    
    spotify
    .search({ type: 'track', query: arg })
    .then(function(response) {

        var jsonData = response.tracks.items[0];

        // songData ends up being the string containing the show data we will print to the console
        var songData = [
            divider,
            "Artist(s): " + jsonData.album.artists[0].name,
            "Song: " + jsonData.name,
            "Preview Link: " + jsonData.external_urls.spotify,
            "Album: " + jsonData.album.name,
            divider
        ].join("\n\n");

        console.log(songData);
        printToLog(songData);
    })
    .catch(function(err) {
        console.log(err);
    });
};

// Execute Movie-This request
function movieThis (arg) {
    var movieName = arg;
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
    
    axios.get(queryUrl).then(function(response) {
        
        var jsonData = response.data;

        // movieData ends up being the string containing the movie data we will print to the console
        var movieData = [
            divider,
            "Title: " + jsonData.Title,
            "Year: " + jsonData.Year,
            "IMDB Rating: " + jsonData.imdbRating,
            "Rotten Tomatoes Rating: " + jsonData.Ratings[1].Value,
            "Country: " + jsonData.Country,
            "Language: " + jsonData.Language,
            "Plot: " + jsonData.Plot,
            "Actors: " + jsonData.Actors,
            divider
        ].join("\n\n");

        console.log(movieData);
        printToLog(movieData);
        }
    );
};

// Execute Do What It Says request
function doWhatItSays () {
    
    fs.readFile('random.txt', "utf8", function read(err, data) {
        if (err) throw err;
        var randomArray = data.split(",");
        trafficFlow (randomArray[0],randomArray[1]);
    }); 
};

// Print to log.txt
function printToLog (consolePrint) {
    fs.appendFile('log.txt', consolePrint, (err) => {
        if (err) throw err;
        console.log('Results of your query can also be found on log.txt' + divider);
      });
}

// Channel requests
function trafficFlow (action,query) {
    switch(action) {
    case "concert-this":
        concertThis(query);
        break;
    case "spotify-this-song":
        if (query==="") {query="The Sign Ace of Base"};
        spotifyThisSong(query);
        break;
    case "movie-this":
        if (query==="") {query="Mr.+Nobody"};
        movieThis(query);
        break;
    case "do-what-it-says":
        doWhatItSays();
        break;
    };
};

// RUN LOGIC //////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

trafficFlow(actionRequest,inputString);