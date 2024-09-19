const apikey = "4106adeb555246d9a25b92b453a8ead2";

const main = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");

const url = (city) =>
  `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}`;

async function getWeatherByLocation(city) {
  try {
    // Validate the input
    if (!city || city.trim() === "") {
      throw new Error("Please enter a city name.");
    }

    const resp = await fetch(url(city));

    // Check if the response is okay
    if (!resp.ok) {
      if (resp.status === 404) {
        throw new Error("City not found. Please enter a valid city name.");
      } else {
        throw new Error("An error occurred while fetching the weather data.");
      }
    }

    const respData = await resp.json();
    addWeatherToPage(respData);
  } catch (error) {
    handleError(error.message);
  }
}

function addWeatherToPage(data) {
  const temp = KtoC(data.main.temp);
  const humidity = data.main.humidity;
  const windSpeed = data.wind.speed;

  const weather = document.createElement("div");
  weather.classList.add("weather");

  weather.innerHTML = `
    <h2><img src="https://openweathermap.org/img/wn/${
      data.weather[0].icon
    }@2x.png" alt="${data.weather[0].description}" /> ${temp}°C</h2>
    <small>${data.weather[0].main}</small>
    <div class="more-info">
      <p>Humidity: <span>${humidity}%</span></p>
      <p>Wind speed: <span>${+Math.trunc(windSpeed * 3.6)} km/h</span></p>
    </div>
  `;

  // Cleanup
  main.innerHTML = "";
  main.appendChild(weather);
}

function KtoC(K) {
  return Math.floor(K - 273.15);
}

function handleError(message) {
  // Display error message to the user
  main.innerHTML = `<div class="error">${message}</div>`;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const city = search.value.trim();
  getWeatherByLocation(city);
});
