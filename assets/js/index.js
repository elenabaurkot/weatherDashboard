// somehow will need to grab the lat and lon from the first response for the UV index api call
// global variables
// var city = $("#city-search").val();
var citySearchList = $("#city-searches");
var cityInfoDiv = $("#city-info");
var date = moment().format('l'); 

// API key
var APIKey = "4e94c09846770a8063c5b4f4cf22765d";

// On click event for API call when user searches a city
$("#search-button").click(function() {
  event.preventDefault();
  var city = $("#city-search").val();
  
  // append header with city search name and date
  $("h3").append(city + " (" + date + ")");
  // query URL
  var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;
  
  // API call
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
    console.log(queryURL);
    console.log(response);

    // append temperature in Fahrenheit
    var kelvin = response.main.temp;
    var f = Math.floor((kelvin - 273.15) * 1.8 + 32)
    $(cityInfoDiv).append("Temperature: " + f + "&deg; F <br />");
    
    var humidity ="Humidity: " + response.main.humidity + "%";
    var windSpeed ="Wind Speed: " + response.wind.speed + " MPH";
    $(cityInfoDiv).append(humidity + "<br />"  + windSpeed);
    
  });
});


// code for section one--> append city name and the current date (maybe with moment.js) as a header-- under that append temp, humidity, wind speed and Uv index

// code to append five day forecast with images

// code to save the search in storage and show it in list, when you click city again should call back the same info
