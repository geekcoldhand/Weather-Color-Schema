// Weather variables
const iconEl = $(".icon");
const humidityEl = $(".humidity");
const speedEl = $(".speed");
const cityEl = $(".city");
const tempEl = $(".temp");
const uvIndexEl = $(".uv-index");
const uvScoreEl = $(".uv-score");
const cityInput = $("#city-name");
const searchCityBtn = $("#search-button");
const currDay = $(".date");
const citiesEl = $(".cities-box");
const cityBox = $(".city-box");
//five day weather
const fiveBox = $(".five-day-box");
const fiveDay0 = $("#1");
const fiveDay1 = $("#2");
const fiveDay2 = $("#3");
const fiveDay3 = $("#4");
const fiveDay4 = $("#5");
const fiveArray = [fiveDay0, fiveDay1, fiveDay2, fiveDay3, fiveDay4];

// date variables
const day = dayjs();
let weekDay = day.format("dddd");
let monthDay = day.month();
let year = day.year();
let hour = day.hour();
currDay.text(weekDay + ", " + monthDay + " " + year);

let weather = {
  key: "2a4c663f61b11d038fdd8933a0017ea9",

  fetchWeather(city) {
    let currWeather;
    fetch(
      "https://api.openweathermap.org/data/2.5/weather?q=" +
        city +
        "&units=imperial&appid=" +
        this.key
    ) //fetch url to GET weather data and parse to json
      .then((res) => res.json())
      //send the data to the display
      .then((data) => this.displayWeather(data));
  },

  //renders the uv data and calls the display five day forcast
  fetchUV(lat, lon) {
    fetch(
      "https://api.openweathermap.org/data/3.0/onecall?lat=" +
        lat +
        "&lon=" +
        lon +
        "&units=imperial&appid=39e0b8987bdf556ee880fdea15fd4fb4"
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        uvScoreEl.text(data.current.uvi);
        weather.displayFiveDay(data);
      });
  },

  displayWeather(data) {
    let city = data.name;
    let temp = data.main.temp;
    let icon = data.weather[0].icon;
    let humidity = data.main.humidity;
    let speed = data.wind.speed;
    let { lat, lon } = data.coord;
    let iconURL = "https://openweathermap.org/img/wn/" + icon + ".png";
    weather.fetchUV(lat, lon);
    //render data to the screen
    iconEl.css("background-image", "url(" + iconURL + ")");
    cityEl.text(city);
    humidityEl.text("Humidity: " + humidity + " %");
    speedEl.text("Wind: " + speed + " mph");
    tempEl.text(temp + " °F");
  },
  searchCity() {
    weather.fetchWeather(cityInput.val());
    weather.saveStorage(cityInput.val());
    cityInput.val("");
  },

  saveStorage(newItem) {
    let curr = window.localStorage.getItem("cities").split(",");
    let array = [];
    // loop current storage and render to cities to array box
    for (let i = 0; i < curr.length; i++) {
      array[i] = curr[i];
    }
    array.push(newItem);
    localStorage.setItem("cities", array);
  },

  renderStorgae() {
    //return array of current items and append new then save
    let curr = window.localStorage.getItem("cities").split(",");
    let cityName = $("<div>");
    console.log(curr);
    // loop current storage and render to cities to array box
    for (let i = 0; i < curr.length; i++) {
      let cityName = $("<div>");
      cityName.text(curr[i]);
      cityBox.prepend(cityName);
    }
  },
  displayFiveDay(data) {
    // run for 5 days and populate the data to div
    for (let i = 0; i < 5; i++) {
      let temp = data.daily[i].temp.day;
      let icon = data.daily[i].weather[0].icon;
      let desc = data.daily[i].weather[0].description;
      let iconURL = "https://openweathermap.org/img/wn/" + icon + ".png";

      console.log(temp, icon, desc);
      let dayTemp = $("<div>");
      let dayDesc = $("<div>");
      let dayIcon = $("<div>");

      dayTemp.append(temp);
      fiveArray[i].append(dayTemp);
      dayIcon.css("background-image", "url(" + iconURL + ")");
      dayIcon.addClass("icon");
      fiveArray[i].append(dayIcon);
      dayDesc.append(desc);
      fiveArray[i].append(dayDesc);
    }
  },
};

weather.renderStorgae();
searchCityBtn.click(weather.searchCity);
cityInput.keypress(function (e) {
  if (e.key === "Enter") weather.searchCity();
});
