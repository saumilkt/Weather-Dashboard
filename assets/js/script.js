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
