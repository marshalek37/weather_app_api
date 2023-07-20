const citySelect = document.getElementById('city-select');
const searchButton = document.getElementById('search-button');
const weatherDataContainer = document.getElementById('weather-data');

const storedWeatherData = localStorage.getItem('weatherData');
  if (storedWeatherData) {
    const parsedData = JSON.parse(storedWeatherData);
    displayWeatherData(parsedData);
  }

  searchButton.addEventListener('click', () => {
    const selectedCity = citySelect.value;
      if (selectedCity) {
        getWeatherData(selectedCity)
          .then(weatherData => {
            const formattedData = formatWeatherData(weatherData);
            displayWeatherData(formattedData);
            localStorage.setItem('weatherData', JSON.stringify(formattedData));
          })
          .catch(error => {
            console.error('Error:', error);
          });
      } else {
        weatherDataContainer.innerHTML = '<div class="error-wrapper"><p class="error-message">Miasto nie zostało wybrane!</p></div>';
      }
  });

  function getWeatherData(cityId) {
    const url = `https://danepubliczne.imgw.pl/api/data/synop/id/${cityId}`;
    return fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch weather data');
        }
        return response.json();
      });
  }

  function formatWeatherData(weatherData) {
    const formattedData = {
      date: weatherData.data_pomiaru,
      temperature: weatherData.temperatura,
      rainSum: weatherData.suma_opadu,
      pressure: weatherData.cisnienie,
    };
    return formattedData;
  }

  function displayWeatherData(weatherData) {
    const weatherHtml = `
      <div class="weather">
        <div class="text-wrapper">
          <h2 class="text-h2">Aktualna pogoda</h2>

          <p class="weather-data">
            <img class="svg date" src="Pics/date.svg" alt="Date svg" loading="eager">
            Data pomiaru: ${weatherData.date}
          </p>

          <p class="weather-data">
            <img class="svg thermometer" src="Pics/thermometer.svg" alt="Thermometer svg" loading="eager">
            Temperatura: ${weatherData.temperature}°C
          </p>

          <p class="weather-data">
            <img class="svg droplet" src="Pics/water-drop.svg" alt="Drop svg" loading="eager">
            Suma opadów: ${weatherData.rainSum} mm
          </p>

          <p class="weather-data">
            <img class="svg pressure" src="Pics/pressure.svg" alt="Pressure svg" loading="eager">
            Ciśnienie: ${weatherData.pressure} hPa
          </p>
        </div>
      </div>
    `;
    weatherDataContainer.innerHTML = weatherHtml;
  }