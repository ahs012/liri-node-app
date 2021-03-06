require("dotenv").config();

//Required Packages 
var fs = require("fs");
var axios = require("axios");
var moment = require("moment");
var Spotify = require("node-spotify-api");

//Spotify API call 
var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);


var inputArray = process.argv;
var actionRequest = process.argv[2];
var inputString = inputArray.splice(3).join("+");


var divider = "\n------------------------------------------------------------";

// Functions 

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

// Movie-This ///////
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

// Do What it Says ////////////////
function doWhatItSays () {
    
    fs.readFile('random.txt', "utf8", function read(err, data) {
        if (err) throw err;
        var randomArray = data.split(",");
        trafficFlow (randomArray[0],randomArray[1]);
    }); 
};

// Print to log.txt file
function printToLog (consolePrint) {
    fs.appendFile('log.txt', consolePrint, (err) => {
        if (err) throw err;
        console.log('Query results can also be found on log.txt' + divider);
      });
}

// Channel requests
function trafficFlow (action,query) {
    switch(action) {
    case "concert-this":
        concertThis(query);
        break;
    case "spotify-this-song":
        if (query==="") {query="The Hand that Feeds"};
        spotifyThisSong(query);
        break;
    case "movie-this":
        if (query==="") {query="Waking Life"};
        movieThis(query);
        break;
    case "do-what-it-says":
        doWhatItSays();
        break;
    };
};

trafficFlow(actionRequest,inputString);