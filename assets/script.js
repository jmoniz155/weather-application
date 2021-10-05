// need a section with input, a search button, and a list below showing the recent searches stored in localStorage
// To the right want details for today and under, a 5 card weather forecast, both with aforementioned details
// // TODO Give button from html the functionality to submit the text from each query to the API when clicked. We want to pass the input into the searchWeather function
// // TODO We also want to clear the input once we click the button.
// Jquery initiator
$(document).ready(function () {
    $("#search-button").on("click", function () {
      var searchValue = $("#search-value").val();
  
    // clear input box
      $("#search-value").val("");
  
      searchWeather(searchValue);
    });
    // // TODO use history list from previous searches to act as a button with on("click") jquery event using the handler function to perform the api call using the current element's text and the searchWeather function: searchWeather($(this).text())
    $(".history").on("click", "li", function () {
      searchWeather($(this).text());
    });
    // // TODO Create a "makeRow" function that creates a list item, adds some classes and uses the text passed in as the parameter to render onto the UI. Store this all in a variable 'li' so you can append it to the <ul> element with class history
    // // NOTE this function is only called within the search event each time the user submits a query, which is where we get the text which is ("searchValue")
    function makeRow(text) {
      var li = $("<li>")
        .addClass("list-group-item list-group-item-action")
        .text(text);
      $(".history").append(li);
    }
  
    function searchWeather(searchValue) {
      $.ajax({
        type: "GET",
        url:
          "https://api.openweathermap.org/data/2.5/weather?q=" +
          searchValue +
          "&appid=87d907df5efa6ff8b7d23d4b308e1a32&units=imperial",
        dataType: "json",
        success: function (data) {
          // create history link for this search
          if (history.indexOf(searchValue) === -1) {
            history.push(searchValue);
            window.localStorage.setItem("history", JSON.stringify(history));
  
            makeRow(searchValue);
          }

          // clear any old content
        $("#today").empty();

        // create html content for current weather
        var title = $("<h3>")
          .addClass("card-title")
          .text(data.name + " (" + new Date().toLocaleDateString() + ")");
        var card = $("<div>").addClass("card");
        var wind = $("<p>")
          .addClass("card-text")
          .text("Wind Speed: " + data.wind.speed + " MPH");
        var humid = $("<p>")
          .addClass("card-text")
          .text("Humidity: " + data.main.humidity + "%");
        var temp = $("<p>")
          .addClass("card-text")
          .text("Temperature: " + data.main.temp + " °F");
        var cardBody = $("<div>").addClass("card-body");
        var img = $("<img>").attr(
          "src",
          "https://openweathermap.org/img/w/" + data.weather[0].icon + ".png"
        );

         // merge and add to page
         title.append(img);
         cardBody.append(title, temp, humid, wind);
         card.append(cardBody);
         $("#today").append(card);
 
         // call follow-up api endpoints
         getForecast(searchValue);
         getUVIndex(data.coord.lat, data.coord.lon);
       },
     });
   }
    // TODO create var APIKey to store API key once and use it in the value of each ajax call's "url" key
    // TODO create three functions using similar syntax to perform the needed API calls that return the information we are looking for (searchWeather, getForecast, getUVIndex).
    // TODO the function should use the API endpoint (url), retrieve the data in json format, parse the JSON object to find the information needed for UI, store the info into variables whiel creating divs and elements with classes.
    // TODO Append the divs and elements in your desired order so you end up appending the entire card to the div in the html file with id="today": $("#today").append(card);
    //Save some data to the server and notify the user once it's complete.
  var apiKey =  "87d907df5efa6ff8b7d23d4b308e1a32"
    // HANDLER function that gets called when user clicks SEARCH
  function getForecast(searchValue) {
    $.ajax({
      type: "GET",
      url:
        "https://api.openweathermap.org/data/2.5/forecast?q=" +
        searchValue +
        "&appid=" + apiKey + "&units=imperial",
      dataType: "json",
      success: function (data) {
        // overwrite any existing content with title and empty row
        $("#forecast")
          .html('<h4 class="mt-3">5-Day Forecast:</h4>')
          .append('<div class="row">');

        // loop over all forecasts (by 3-hour increments)
        for (var i = 0; i < data.list.length; i++) {
          // only look at forecasts around 3:00pm
          if (data.list[i].dt_txt.indexOf("15:00:00") !== -1) {
            // create html elements for a bootstrap card
            var col = $("<div>").addClass("col-md-2");
            var card = $("<div>").addClass("card bg-primary text-white");
            var body = $("<div>").addClass("card-body p-2");

            var title = $("<h5>")
              .addClass("card-title")
              .text(new Date(data.list[i].dt_txt).toLocaleDateString());

            var img = $("<img>").attr(
              "src",
              "https://openweathermap.org/img/w/" +
                data.list[i].weather[0].icon +
                ".png"
            );

            var p1 = $("<p>")
              .addClass("card-text")
              .text("Temp: " + data.list[i].main.temp_max + " °F");
            var p2 = $("<p>")
              .addClass("card-text")
              .text("Humidity: " + data.list[i].main.humidity + "%");

            // merge together and put on page
            col.append(card.append(body.append(title, img, p1, p2)));
            $("#forecast .row").append(col);
          }
        }
      },
    });
  }
  // TODO create GET REQUEST using lat and lon using json 
  function getUVIndex(lat, lon) {
    $.ajax({
      type: "GET",
      url:
        "https://api.openweathermap.org/data/2.5/uvi?appid=7ba67ac190f85fdba2e2dc6b9d32e93c&lat=" +
        lat +
        "&lon=" +
        lon,
      dataType: "json",
      success: function (data) {
        var uv = $("<p>").text("UV Index: ");
        var btn = $("<span>").addClass("btn btn-sm").text(data.value); 
        
        // change color depending on uv value
        if (data.value < 3) {
          btn.addClass("btn-success");
        } else if (data.value < 7) {
          btn.addClass("btn-warning");
        } else {
          btn.addClass("btn-danger");
        }

        $("#today .card-body").append(uv.append(btn));t(data.value);


    },
      });
    }

    // get current history, if any using json.parse turning a string into an object
  var history = JSON.parse(window.localStorage.getItem("history")) || [];
    // So if we have something in our local storage. If it's greater than zero, then we're running a search for the last item in that array, so that it's automatically rendering that upon to the screen
  if (history.length > 0) {
    searchWeather(history[history.length - 1]);
  }
    // taking every item in that array and were making a row appear at the top
  for (var i = 0; i < history.length; i++) {
    makeRow(history[i]);
  }
});

          