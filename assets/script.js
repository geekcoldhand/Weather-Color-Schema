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
let lastCities = $("<button>");

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
let monthDay = day.format("D");
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
        "2a4c663f61b11d038fdd8933a0017ea9"
    )
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
        //uvScoreEl.text(data.current.uvi);
        weather.displayUV(data);
        weather.displayFiveDay(data);
      });
  },

  displayUV(data) {
    let index = data.current.uvi;
    let intIndex = parseInt(index);
    uvScoreEl.text(index);

    if (intIndex > 9) {
      uvIndexEl.addClass("harful-uv");
    }
    if (intIndex <= 9 && index > 5) {
      uvIndexEl.addClass("bad-uv");
    }
    if (intIndex <= 5 && index > 2) {
      uvIndexEl.addClass("fair-uv");
    } else {
      uvIndexEl.addClass("good-uv");
    }
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

    // loop current storage and render to cities to array box
    for (let i = 0; i < curr.length; i++) {
      // let cityName = $("<div>");
      lastCities = $("<button>");
      // cityName.text(curr[i]);
      lastCities.text(curr[i]);
      lastCities.addClass("lastCityNames");
      //cityBox.prepend(cityName);
      cityBox.prepend(lastCities);
    }
  },
  displayFiveDay(data) {
    // run for 5 days and populate the data to div
    let days = weather.displayDay(day.day());

    for (let i = 0; i < 5; i++) {
      let temp = data.daily[i].temp.day;
      let icon = data.daily[i].weather[0].icon;
      let desc = data.daily[i].weather[0].description;
      let iconURL = "https://openweathermap.org/img/wn/" + icon + ".png";

      let dayTemp = $("<div>");
      let dayDesc = $("<div>");
      let dayIcon = $("<div>");
      let dateOf = $("<div>");

      dateOf.append(days[i + 1].$d);
      dateOf.addClass("mb-4");
      dateOf.addClass("dateOf");

      dayTemp.addClass("temp");
      dayTemp.append(temp);
      fiveArray[i].append(dayTemp);
      dayIcon.css("background-image", "url(" + iconURL + ")");
      dayIcon.addClass("icon");
      fiveArray[i].append(dayIcon);
      // desc.addClass("mt-4");
      dayDesc.append(desc);
      fiveArray[i].prepend(dayDesc);
      fiveArray[i].prepend(dateOf);
      //fiveArray[i].prepend(days[i + 1].$d);
    }
  },

  displayDay(range) {
    let nextFive = [];

    for (let i = 0; i < 7; i++) {
      if (range === 6) {
        nextFive.push(day.day(range + i));
        range = 0;
      } else {
        nextFive.push(day.day(range + i));
      }
    }
    return nextFive;
  },
};

weather.renderStorgae();
searchCityBtn.click(weather.searchCity);
cityInput.keypress(function (e) {
  if (e.key === "Enter") weather.searchCity();
});
$(document).ready(function () {
  cityBox.on("click", "button", function (e) {
    let newCity = e.target.textContent;
    weather.fetchWeather(newCity);
  });
});
