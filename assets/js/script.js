// Get form element value
let leftColumnEL = document.querySelector("#left-column")

// Get all the elements of cities list for event handler
let citiesListContainerBtnEl = document.querySelector(".list-group-item");
// Daily forcast Containter
let dailyWeatherContainerEl = document.querySelector("#forecast-output-container"); 

// Create a form container and containing elements
let dynFormContainer = document.createElement("form");
dynFormContainer.setAttribute("id", "dymCityForm");
dynFormContainer.classList = "city-search-forecast-container";
leftColumnEL.appendChild(dynFormContainer)


// Create H3 element
let formH3 = document.createElement("h3");
formH3.textContent = " Search for a City ";
dynFormContainer.appendChild(formH3);

// Create input element
let formInput = document.createElement("input");
formInput.setAttribute("id", "city-name")
formInput.setAttribute("type", "text");
formInput.setAttribute("autofocus", "true");
formInput.classList = "form-input";
dynFormContainer.appendChild(formInput);

// Create button element
let formButton = document.createElement("button");
formButton.setAttribute("type", "submit");
formButton.classList= ("btn fas fa-search");
dynFormContainer.appendChild(formButton);

// Find the city form
let seachEventHanglerEl = document.querySelector("#dymCityForm");
let searchByCityEl = document.querySelector("#city-name");


// Left column cities container
let citiesContainerEl = document.createElement("div");
citiesContainerEl.setAttribute("id", "dym-cities-list");
citiesContainerEl.classList = "list-group";

// Append to the left column
leftColumnEL.appendChild(citiesContainerEl);

// Find the list div container
let citiesListContainerEl = document.querySelector("#dym-cities-list");



var populateSavedCities = function() {
       // Get array from local storage
       let citiesLocalStorage = JSON.parse(localStorage.getItem("savedCities"));

       // City exist or not. 0 = not, 1 = yes
       let cityExist = 0;
         
       if (citiesLocalStorage === null) {
           // It does note exist, therefore, no items to add to saved cities
           //console.log("No items to add");  
       } else { // we will popualte the saved cities

       $(".list-group-item").remove(); // Remove all list items from the document with jquery
           
        for (i=0; i< citiesLocalStorage.length;i++) {

            // Populate the cities as anchors and add necessary attribures and classes.
            let cityNameEl = document.createElement("a")
            let splitCityText = "";
            cityNameEl.setAttribute("href", "#")
            cityNameEl.setAttribute("data-city", citiesLocalStorage[i]);
            cityNameEl.setAttribute("id", citiesLocalStorage[i]);
            cityNameEl.setAttribute("role", "button");
            cityNameEl.classList = "list-group-item list-group-item-action list-group-item-primary";
            cityNameEl.textContent = citiesLocalStorage[i];
            //citiesListContainerEl.appendChild(cityNameEl);
            // dynContainer
            citiesContainerEl.appendChild(cityNameEl);
        };
          // alert("All saved cities have been populated");
       };
};

// *** Second fetch call, this will run as non asynchronous *** //

function fetchSecondCall(searchByCity, latNum, lonNum, unixTimeCurrentDay, currentDayIcon, currentTempImperial, currentHumidity, currentMPS, mphWindSpeed) {

    // Assign API URL
    let openWeatherApiFiveDayUrl =  "https://api.openweathermap.org/data/2.5/onecall?lat=" + latNum + "&lon=" + lonNum + "&appid=32a27c42260b02de3ba5e1466def4861&units=imperial"
    
    fetch( // Do fetch on lat and lon for the "onecall" open weather API
        openWeatherApiFiveDayUrl
    )
    .then(function (response) {
      return response.json();
    })
    .then(function (secondCallData) {
        // *** Current Day data *** //
        // Current Day UV
        let uvIndex = secondCallData.current.uvi
        //console.log(uvIndex)

        // *** Curent date forrmat ** //
        //console.log("today is in unix time: " + unixTimeCurrentDay);

        let unix_timestamp = unixTimeCurrentDay;
        // Create a new JavaScript Date object based on the timestamp
        // multiplied by 1000 so that the argument is in milliseconds, not seconds.
        var date = new Date(unix_timestamp * 1000);
        // Hours part from the timestamp
        var year = date.getFullYear(); // Year format to be used
        var monthOfYear = date.getMonth() + 1; // month Jan =0, then +1 for actual January for display
        var dayOfMonth = date.getDate();
        var fullDayDaily = "(" + (date.getMonth() + 1) + "/" + date.getDate() + "/"  + date.getFullYear() + ")";      
        //console.log("unix day format is " + dayOfMonth);
        //console.log("unix month format is " + monthOfYear);
        //console.log("unix year format is " + year);
        //console.log("Full day of unix format is: " + fullDayDaily);
        //alert("Full day of unix format is: " + fullDayDaily)
                
        // Populate current day data
        populateCurrentDayHtml(searchByCity, fullDayDaily, currentDayIcon, currentTempImperial, currentHumidity, currentMPS, mphWindSpeed, uvIndex);

        // Populate 5 day forcast
        populate5DayForecast(secondCallData)
    });
};

// Function to populate current day forecast
function populateCurrentDayHtml(searchByCity, fullDayDaily, currentDayIcon, currentTempImperial, currentHumidity, currentMPS, mphWindSpeed, uvIndex) {
    // Populate current Day html elements
    let dailyForecastContainerEl = document.createElement("div");
    dailyForecastContainerEl.setAttribute("id", "daily-forecast-container");
    dailyForecastContainerEl.classList = "borderDiv";

    let currentDayTitle = document.createElement("h3");
    currentDayTitle.textContent = ( searchByCity.charAt(0).toUpperCase() + searchByCity.slice(1) + " " + fullDayDaily);

    let currentIconEl = document.createElement("span")
   // "<i class='fas fa-check-square status-icon icon-success'></i>"
    let currentIconSymbol = "http://openweathermap.org/img/wn/" + currentDayIcon + "@2x.png";
   // alert(currentIconSymbol);
   currentIconEl.innerHTML = "<img src=" + currentIconSymbol + "></img>";
   currentDayTitle.append(currentIconEl)

    // Create p elements to hold the rest of current day informatino
    let currentTempEl = document.createElement("p");
    let currentHumidityEl = document.createElement("p");
    let currentWinSpEl = document.createElement("p");
    let currentUvIEl = document.createElement("p");

    // Assign helments text content
    // Round temperature to no decimal places
    currentTempEl.textContent = "Temperature: " + (currentTempImperial.toFixed(1)) + " °F";
    currentHumidityEl.textContent = "Humidity: " + currentHumidity + "%";
    currentWinSpEl.textContent = "Wind Speed: " + currentMPS + " MPH";
    currentUvIEl.textContent = "UV Index: " + uvIndex;

    $("#daily-forecast-container").remove(); // Remove all list items from the document with jquery

    // *** Append to forecast output container
    // Append daily forecast
    dailyWeatherContainerEl.appendChild(dailyForecastContainerEl);
    dailyForecastContainerEl.appendChild(currentDayTitle);
    dailyForecastContainerEl.appendChild(currentTempEl);
    dailyForecastContainerEl.appendChild(currentHumidityEl);
    dailyForecastContainerEl.appendChild(currentWinSpEl);
    dailyForecastContainerEl.appendChild(currentUvIEl);
};

  
function populate5DayForecast(secondCallData) {
    
    $("#weekly-forecast-container").remove(); // Remove all list items from the document with jquery

    // Populate current Day html elements
    let weeklyForecastContainerEl = document.createElement("div");
    weeklyForecastContainerEl.setAttribute("id", "weekly-forecast-container");
    //weeklyForecastContainerEl.classList = "borderDiv";
    weeklyForecastContainerEl.classList = "border-Div-right-column"; 

    let fiveDayForecast = document.createElement("h3");
    fiveDayForecast.textContent = "5-Day Forecast:"

    // Append as topmost before for loop to generate contents of each div container.
    dailyWeatherContainerEl.appendChild(weeklyForecastContainerEl);
    weeklyForecastContainerEl.appendChild(fiveDayForecast);

    // Create a div just to hold the 5 day as a flex row 
    let weeklyFlexContainerEL = document.createElement("div");
    weeklyFlexContainerEL.classList = "weekly-flex-conatiner"

    // Append only after the date on the 5 Day Forecast
    weeklyForecastContainerEl.appendChild(weeklyFlexContainerEL);

    for (i=1; i <= 5; i++) { // Get 5 days worth of conent from the 5 day forecast.
        let unixTime = secondCallData.daily[i].dt;
        //console.log("Correct 5 day forcast" + unixTime)
    
        let unix_timestamp = unixTime;
        // Create a new JavaScript Date object based on the timestamp
        // multiplied by 1000 so that the argument is in milliseconds, not seconds.
        var date = new Date(unix_timestamp * 1000);
        // Hours part from the timestamp
        var year = date.getFullYear();
        var monthOfYear = date.getMonth() + 1;
        var dayOfMonth = date.getDate();
    
        // Values to be displayed
        var fullDay = (date.getMonth() + 1) + "/" + date.getDate() + "/"  + date.getFullYear(); // Date
        var iconWeather = secondCallData.daily[i].weather[0].icon // icon
        let fahrenheitTemp = secondCallData.daily[i].temp.day // Temp @ fahrenheit
        let humidity = secondCallData.daily[i].humidity;
        //console.log(fullDay)
        //console.log(iconWeather)
        //console.log("Temp: " + fahrenheitTemp.toFixed(1) + " °F"); // Fahrenheit temperature
        //console.log("Temp: " + fahrenheitTemp + " °F")
        //console.log("Humidity: " + humidity);
    
        // *** Create 5 Day elements and display them on screen.
        // Create a div to hold each day of the 5 day weekly forecast.
        let eachDayContainer = document.createElement("div");
        eachDayContainer.setAttribute("id", ("day=" + [i]));
        eachDayContainer.classList = "border-div-five-day-forecast";
       
        let currentDayTitle = document.createElement("p");
        currentDayTitle.textContent = (fullDay);

        // Span to hold the icon
        let iconSpan = document.createElement("p");
        iconSpan.textContent = "";

        let currentIconEl = document.createElement("span")
        let currentIconSymbol = "http://openweathermap.org/img/wn/" + iconWeather + "@2x.png";
        // alert(currentIconSymbol);
        currentIconEl.innerHTML = "<img src=" + currentIconSymbol + "></img>";
        iconSpan.append(currentIconEl)

        // Create p elements to hold the rest of current day informatino
        let currentTempEl = document.createElement("p");
        let currentHumidityEl = document.createElement("p");
        
        currentTempEl.textContent = "Temperature: " +  (fahrenheitTemp.toFixed(2)) + " °F";
        currentHumidityEl.textContent = "Humidity: " + humidity + "%";
          
        // *** Append to forecast output container
        // Append daily forecast
        eachDayContainer.appendChild(currentDayTitle);
        eachDayContainer.appendChild(currentIconEl);
        eachDayContainer.appendChild(currentTempEl);
        eachDayContainer.appendChild(currentHumidityEl);
        // Once all items have been appended to the eachDayContainer we can append to the parent.
        weeklyFlexContainerEL.appendChild(eachDayContainer);
    };
};
