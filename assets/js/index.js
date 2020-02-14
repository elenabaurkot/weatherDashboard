// global variables
var citySearchList = $("#city-searches");
var cityInfoDiv = $("#city-info");
var fiveDay = $("#five-day-forecast");
var date = moment().format("l");

var searches = [];

// init();

function renderSearches(){
    citySearchList.innerHTML = '';
    var search = $("#city-search").val();
    console.log(search);
    // create list item element and add CSS
    var li = document.createElement("li");
    li.textContent = search;
    // li.setAttribute("data-index", i);
    // li.textContent = search;
    li.setAttribute("class", "list");
    // add search to the list
    citySearchList.append(li);
};

// get stored searches from local storage
// parse JSON string to object
function init(){
  var storedSearches = JSON.parse(localStorage.getItem("searches"))
  if (storedSearches !== null) {
    searches = storedSearches;
  }

// render searches to the DOM
renderSearches();
};

function storeSearches(){
  // set array with new item
  localStorage.setItem("searches", JSON.stringify(searches));
};

// API key
var APIKey = "4e94c09846770a8063c5b4f4cf22765d";

// On click event for API call when user searches a city
$("#search-button").click(function() {
  event.preventDefault();

  // $("city-info").innerHTML = ""
  // $("five-day-forecast").innerHTML =""
  
  // cityInfoDiv.empty();
  var city = $("#city-search").val();

  // Return from function early if submitted search is blank
  if (city === "") {
    return;
  }
  // Add new search to searches array, clear the input
  searches.push(city);
  city.innerHTML= '';
  
  // Store updated searches in localStorage, re-render the list
  storeSearches();
  renderSearches();

  // adds border box and spacing for city info content
  cityInfoDiv.addClass("info-container");
  // append header with city search name and date
  $("h3").append(city + " (" + date + ")");

  // query URL for city conditions
  var queryURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&appid=" +
    APIKey;
  console.log(queryURL);

  // API call for city conditions
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
    
    console.log(response);

    // icon for today's weather
    var todayIcon = response.weather[0].icon;
    var todayIconURL =
      "https://openweathermap.org/img/wn/" + todayIcon + ".png";

    // append icon for today's weather next to header (city name and date)
    $("h3").append("<img src =" + todayIconURL + ">");

    // append temperature in Fahrenheit
    var kelvin = response.main.temp;
    var f = Math.floor((kelvin - 273.15) * 1.8 + 32);
    $(cityInfoDiv).append("Temperature: " + f + "&deg; F <br />");

    // append humdity and wind speed
    var humidity = "Humidity: " + response.main.humidity + "%";
    var windSpeed = "Wind Speed: " + response.wind.speed + " MPH";
    $(cityInfoDiv).append(humidity + "<br />" + windSpeed + "<br/>");

    // set variable for latitude and longitude of searched location to use for API call for UV index
    var latitude = response.coord.lat;
    var longitude = response.coord.lon;
    var latLong = "&lat=" + latitude + "&lon=" + longitude;
    console.log(latLong);

    // query URL for UV index
    var queryURL =
      "https://api.openweathermap.org/data/2.5/uvi/forecast?appid=" +
      APIKey +
      latLong;
    console.log(queryURL);

    // API call for UV index
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {
      console.log(queryURL);
      console.log(response);
      var uvIndex = response[0].value;
      var uvDiv = $("<div>");
      $(cityInfoDiv).append("UV Index: ");
      // append the actual UV index with class to add the coloring
      if (uvIndex < 3){
        $("<span/>", { class: "uvGreen", html: uvIndex }).appendTo(cityInfoDiv);
        }
        else if (uvIndex > 3 && uvIndex < 7){
          $("<span/>", { class: "uvYellow", html: uvIndex }).appendTo(cityInfoDiv);
        }
        else {
          $("<span/>", { class: "uvRed", html: uvIndex }).appendTo(cityInfoDiv);
        }
        }
      );

    // query URL for five day forecast
    var queryURL =
      "https://api.openweathermap.org/data/2.5/forecast?q=" +
      city +
      "&appid=" +
      APIKey;
    console.log(queryURL);

    // five day forecast ajax call
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {
      console.log(response);
      console.log("this is the length: " + response.list.length);


      // for loop to append class for 5-day weather containers
      for (var i = 7; i < response.list.length; i+=8) {
      $("#day" + i).addClass("five-day-weather");
      // convert date from unix time stamp to mm/dd/yyyy format
      var unixTime = new Date((response.list[i].dt)* 1000).toLocaleDateString("en-US");
      // date
      var date = "<strong>" + unixTime + "</strong><br/>";
      // icon
      var icon = response.list[i].weather[0].icon;
      var iconURL = "<img src=https://openweathermap.org/img/wn/" + icon + ".png>  <br>";
      // temp
      kelvin = response.list[i].main.temp;
      var temp = "Temp: " + Math.floor((kelvin - 273.15) * 1.8 + 32) + "&deg; F<br>";
      // humidity
      humidity = "Humidity: " + response.list[i].main.humidity + "%";
      // append date, icon, temp, humidity
      $("#day" + i).append(date, iconURL, temp, humidity);
      }
    });
  });
});