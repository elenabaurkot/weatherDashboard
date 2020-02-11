// global variables
var citySearchList = $("#city-searches");
var cityInfoDiv = $("#city-info");
var date = moment().format('l'); 

// API key
var APIKey = "4e94c09846770a8063c5b4f4cf22765d";


// On click event for API call when user searches a city
$("#search-button").click(function() {
  event.preventDefault();
  var city = $("#city-search").val();
  // adds border box and spacing for city info content
  cityInfoDiv.addClass("info-container");
  // append header with city search name and date
  $("h3").append(city + " (" + date + ")");
  // query URL for city conditions
  var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;
  
  // API call for city conditions
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {

    // append temperature in Fahrenheit
    var kelvin = response.main.temp;
    var f = Math.floor((kelvin - 273.15) * 1.8 + 32)
    $(cityInfoDiv).append("Temperature: " + f + "&deg; F <br />");
    
    // append humdity and wind speed
    var humidity ="Humidity: " + response.main.humidity + "%";
    var windSpeed ="Wind Speed: " + response.wind.speed + " MPH";
    $(cityInfoDiv).append(humidity + "<br />"  + windSpeed + "<br/>");
    
    // set variable for latitude and longitude of searched location to use for API call for UV index
    var latitude = response.coord.lat;
    var longitude = response.coord.lon;
    var latLong = "&lat=" + latitude + "&lon=" + longitude; 
    console.log(latLong);
    
    // query URL for UV index
    var queryURL = "https://api.openweathermap.org/data/2.5/uvi/forecast?appid=" + APIKey + latLong;
    
    // API call for UV index
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {
      var uvIndex = response[0].value;
      var uvDiv = $("<div>")
      $(cityInfoDiv).append("UV Index: ");
      // append the actual UV index with class to add the coloring
      $('<span/>',{ class : 'uv', html: uvIndex}).appendTo(cityInfoDiv);
      

    });
  });
});

// code for section one--> still need the icon next to the weather

// code to append five day forecast with images

// code to save the search in storage and show it in list, when you click city again should call back the same info