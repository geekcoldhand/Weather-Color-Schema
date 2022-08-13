const iconEl = $(".icon");
const humidityEl = $(".humidity");
const speedEl = $(".speed");
const cityEl = $(".city");
const tempEl = $(".temp");
const uvIndexEl = $(".uv-index");
const cityInput = $("#city-name");
const searchCityBtn = $("#search-button");

let weather = {
  key: "2a4c663f61b11d038fdd8933a0017ea9",

  fetchWeather(city) {
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

  //
  displayWeather(data) {
    let city = data.name;
    let temp = data.main.temp;
    let icon = data.weather[0].icon;
    let humidity = data.main.humidity;
    let speed = data.wind.speed;
    let iconURL = "https://openweathermap.org/img/wn/" + icon + ".png";

    console.log("icon", iconURL);
    iconEl.css("background-image", "url(" + iconURL + ")");

    cityEl.text(city);
    humidityEl.text(humidity + " %");
    speedEl.text(speed + " mph");
    tempEl.text(temp + " °F");
  },
  searchCity() {
    console.log(cityInput.val(), cityInput);
    weather.fetchWeather(cityInput.val());
    cityInput.val("");
  },
};
searchCityBtn.click(weather.searchCity);
cityInput.keypress(function (e) {
  if (e.key === "Enter") weather.searchCity();
});
