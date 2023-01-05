const cityNameInput = document.querySelector('input');
const sendButton = document.querySelector('button');
const cityMainName = document.querySelector('.city-main-name');
const cityLocatedName = document.querySelector('.city-located-name');
const cityLatLon = document.querySelector('.city-lat-lon');
const warningMsg = document.querySelector('.warning');
const weatherStatusPhoto = document.querySelector('.photo');
const weatherCondition = document.querySelector('.weather');
const weatherTemperature = document.querySelector('.temperature');
const weatherHumidity = document.querySelector('.humidity');

const API_GEO_LINK = 'http://api.openweathermap.org/geo/1.0/direct?q=';
const API_DATA_LINK = 'https://api.openweathermap.org/data/2.5/weather?';
const API_LAT = 'lat=';
const API_LON = '&lon=';
const API_KEY = '&appid=7a5548f881e3c0490f03d49cb1bc2ca3';
const API_UNITS = '&units=metric';

function getWeather() {
	const cityName = cityNameInput.value || 'Warszawa';
	const URL_GEO = API_GEO_LINK + cityName + API_KEY;
	getCityGeolocation(URL_GEO);
}

const getCityGeolocation = (URL) => {
	axios
		.get(URL)
		.then((result) => {
			const lat = result.data[0].lat;
			const lon = result.data[0].lon;

			const URL_WEATHER =
				API_DATA_LINK + API_LAT + lat + API_LON + lon + API_KEY + API_UNITS;

			cityMainName.textContent = result.data[0].name;
			cityLocatedName.textContent = result.data[0].country;
			getWeatherData(URL_WEATHER);
		})
		.catch((err) => {
			if (err.code == 'ERR_BAD_REQUEST') {
				warningMsg.textContent = 'Wpisz poprawną nazwę miasta!';
			} else {
				console.error(err);
			}
		});
};

const getWeatherData = (URL) => {
	axios
		.get(URL)
		.then((result) => {
			warningMsg.textContent = '';
			setWeatherData(result.data);
		})
		.catch((err) => {
			if (err.code == 'ERR_BAD_REQUEST') {
				warningMsg.textContent = 'Wpisz poprawną nazwę miasta!';
			} else {
				console.error(err);
			}
		});
};

const setWeatherData = (data) => {
	const { lat: latitude, lon: longitude } = data.coord;
	const locationName = data.name;
	const weatherStatus = Object.assign({}, ...data.weather);
	const { temp: temperature, humidity } = data.main;
	const weatherPhotoPath = './img/' + getWeatherPhotoName(weatherStatus);

	warningMsg.textContent = '';
	cityNameInput.value = '';

	cityLatLon.textContent = latitude + ', ' + longitude;
	cityLocatedName.textContent += ', ' + locationName;
	weatherCondition.textContent = weatherStatus.main;
	weatherTemperature.textContent = temperature + '°C';
	weatherHumidity.textContent = humidity + '%';
	weatherStatusPhoto.setAttribute('src', weatherPhotoPath);
};

const getWeatherPhotoName = (status) => {
	switch (true) {
		case status.id >= 200 && status.id < 300:
			return 'thunderstorm.png';
		case status.id >= 300 && status.id < 400:
			return 'drizzle.png';
		case status.id >= 500 && status.id < 600:
			return 'rain.png';
		case status.id >= 600 && status.id < 700:
			return 'ice.png';
		case status.id >= 700 && status.id < 800:
			return 'fog.png';
		case status.id === 800:
			return 'sun.png';
		case status.id > 800 && status.id < 900:
			return 'cloud.png';
		default:
			return 'unknown.png';
	}
};

const enterKeyCheck = (e) => {
	if (e.key === 'Enter') getWeather();
};

getWeather();
sendButton.addEventListener('click', getWeather);
cityNameInput.addEventListener('keyup', enterKeyCheck);
