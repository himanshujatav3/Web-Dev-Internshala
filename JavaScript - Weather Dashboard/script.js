// --- Constants and Variables ---
const apiKey = "13acdf6eaf16dbdf4485d741de843711";
const weatherApiBaseUrl = "https://api.openweathermap.org/data/2.5/weather";
const forecastApiBaseUrl = "https://api.openweathermap.org/data/2.5/forecast";
const recentCitiesKey = "recentWeatherAppCities";
const maxRecentCities = 5; // Max number of cities in the dropdown

// --- DOM Element References ---
const searchForm = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const currentLocationButton = document.getElementById('current-location-button');
const errorMessage = document.getElementById('error-message');
const weatherDisplay = document.getElementById('weather-display');
const currentWeatherDataElement = document.getElementById('current-weather');
const forecastSection = document.getElementById('forecast-section');
const forecastContainer = document.getElementById('forecast-container');
const loadingIndicator = document.getElementById('loading-indicator');
const recentSearchesContainer = document.getElementById('recent-searches-container');
const recentSearchesDropdown = document.getElementById('recent-searches-dropdown');

// --- Event Listeners ---
searchForm.addEventListener('submit', handleSearchFormSubmit);
currentLocationButton.addEventListener('click', handleCurrentLocationClick);
cityInput.addEventListener('focus', showRecentSearches); // Show dropdown on focus
cityInput.addEventListener('input', showRecentSearches); // Keep showing while typing (optional)
// Hide dropdown when clicking outside the input/dropdown area
document.addEventListener('click', (event) => {
    if (!recentSearchesContainer.contains(event.target) && event.target !== cityInput) {
        recentSearchesDropdown.classList.add('hidden');
    }
});

// --- Functions ---

/**
 * Handles the submission of the search form.
 * @param {Event} event - The form submission event.
 */
async function handleSearchFormSubmit(event) {
    event.preventDefault(); // Prevent default page reload
    const city = cityInput.value.trim();

    // Validation: Check for empty input
    if (!city) {
        showError("Please enter a city name.");
        return;
    }

    hideError();
    showLoading();
    clearWeatherData(); // Clear previous results immediately
    recentSearchesDropdown.classList.add('hidden'); // Hide dropdown after search

    try {
        const weatherData = await fetchWeatherData(city);
        const forecastData = await fetchForecastData(city);

        if (weatherData && forecastData) {
            displayCurrentWeather(weatherData);
            displayForecast(forecastData);
            addCityToRecentSearches(city);
            loadRecentSearches(); // Refresh dropdown
            showWeatherData();
        }
        // Error handling is done within fetch functions
    } catch (error) {
        // Catch any unexpected errors during the fetch process
        console.error("Error processing weather data:", error);
        showError("Could not fetch weather data. Please try again later.");
    } finally {
        hideLoading();
    }
}

/**
 * Handles the click event for the "Use Current Location" button.
 */
function handleCurrentLocationClick() {
    hideError();
    showLoading();
    clearWeatherData(); // Clear previous results
    recentSearchesDropdown.classList.add('hidden'); // Hide dropdown

    if (!navigator.geolocation) {
        showError("Geolocation is not supported by your browser.");
        hideLoading();
        return;
    }

    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const { latitude, longitude } = position.coords;
            try {
                const weatherData = await fetchWeatherData(null, latitude, longitude);
                const forecastData = await fetchForecastData(null, latitude, longitude);

                if (weatherData && forecastData) {
                    displayCurrentWeather(weatherData);
                    displayForecast(forecastData);
                    // Optionally add the fetched city name to recent searches
                    if (weatherData.name) {
                         addCityToRecentSearches(weatherData.name);
                         loadRecentSearches();
                    }
                    showWeatherData();
                }
            } catch (error) {
                 console.error("Error fetching weather by coordinates:", error);
                 showError("Could not fetch weather for your location.");
            } finally {
                 hideLoading();
            }
        },
        (error) => {
            console.error("Geolocation error:", error);
            let message = "Could not get your location. ";
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    message += "Please allow location access.";
                    break;
                case error.POSITION_UNAVAILABLE:
                    message += "Location information is unavailable.";
                    break;
                case error.TIMEOUT:
                    message += "The request to get user location timed out.";
                    break;
                default:
                    message += "An unknown error occurred.";
                    break;
            }
            showError(message);
            hideLoading();
        }
    );
}

/**
 * Fetches current weather data from the OpenWeatherMap API.
 * @param {string|null} city - The city name (or null if using coordinates).
 * @param {number|null} lat - The latitude (or null if using city).
 * @param {number|null} lon - The longitude (or null if using city).
 * @returns {Promise<object|null>} - A promise resolving to the weather data object or null on error.
 */
async function fetchWeatherData(city = null, lat = null, lon = null) {
    let url;
    if (city) {
        url = `${weatherApiBaseUrl}?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
    } else if (lat !== null && lon !== null) {
        url = `${weatherApiBaseUrl}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    } else {
        showError("Invalid parameters for fetching weather data.");
        return null;
    }

    try {
        const response = await fetch(url);
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: "Unknown API error" }));
            throw new Error(`API Error (${response.status}): ${errorData.message || response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Fetch Weather Error:", error);
        showError(`Failed to fetch current weather: ${error.message}. Please check the city name or your connection.`);
        return null;
    }
}

/**
 * Fetches 5-day forecast data from the OpenWeatherMap API.
 * @param {string|null} city - The city name (or null if using coordinates).
 * @param {number|null} lat - The latitude (or null if using city).
 * @param {number|null} lon - The longitude (or null if using city).
 * @returns {Promise<object|null>} - A promise resolving to the forecast data object or null on error.
 */
async function fetchForecastData(city = null, lat = null, lon = null) {
    let url;
    if (city) {
        url = `${forecastApiBaseUrl}?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
    } else if (lat !== null && lon !== null) {
        url = `${forecastApiBaseUrl}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    } else {
        // No need to show error here again, as fetchWeatherData would have failed first
        return null;
    }

    try {
        const response = await fetch(url);
        if (!response.ok) {
             const errorData = await response.json().catch(() => ({ message: "Unknown API error" }));
            throw new Error(`API Error (${response.status}): ${errorData.message || response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Fetch Forecast Error:", error);
        showError(`Failed to fetch forecast: ${error.message}.`);
        return null; // Don't block current weather if forecast fails
    }
}

/**
 * Displays the current weather information in the UI.
 * @param {object} data - The weather data object from the API.
 */
function displayCurrentWeather(data) {
    if (!data || !data.main || !data.weather || !data.wind) {
        console.error("Invalid current weather data received:", data);
        showError("Received incomplete weather data.");
        return;
    }

    const cityName = data.name || "Unknown Location";
    const date = new Date(data.dt * 1000).toLocaleDateString(); // Convert timestamp to readable date
    const temp = data.main.temp;
    const wind = data.wind.speed;
    const humidity = data.main.humidity;
    const description = data.weather[0].description;
    const iconCode = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    document.getElementById('current-city-name').textContent = `${cityName} (${date})`;
    document.getElementById('current-temp').textContent = `Temperature: ${temp.toFixed(1)}°C`;
    document.getElementById('current-wind').textContent = `Wind: ${wind.toFixed(1)} M/S`;
    document.getElementById('current-humidity').textContent = `Humidity: ${humidity}%`;
    document.getElementById('current-weather-desc').textContent = description;
    document.getElementById('current-weather-icon').src = iconUrl;
    document.getElementById('current-weather-icon').alt = description;

    // Make the section visible with a fade-in effect
    currentWeatherDataElement.classList.remove('hidden');
    setTimeout(() => currentWeatherDataElement.style.opacity = 1, 10); // Small delay for CSS transition
}

/**
 * Displays the 5-day forecast information in the UI.
 * Filters the API data to show one forecast per day.
 * @param {object} data - The forecast data object from the API.
 */
function displayForecast(data) {
    if (!data || !data.list) {
        console.error("Invalid forecast data received:", data);
         // Don't show error here, might just be unavailable
        forecastSection.classList.add('hidden');
        forecastContainer.innerHTML = ''; // Clear any old cards
        return;
    }

    forecastContainer.innerHTML = ''; // Clear previous forecast cards
    const dailyForecasts = {};

    // Filter forecast list to get roughly one forecast per day (e.g., around noon)
    data.list.forEach(item => {
        const date = new Date(item.dt * 1000);
        const day = date.toISOString().split('T')[0]; // Get YYYY-MM-DD

        // Store the forecast closest to noon (12:00) or the first one for that day
        if (!dailyForecasts[day] || Math.abs(date.getHours() - 12) < Math.abs(new Date(dailyForecasts[day].dt * 1000).getHours() - 12)) {
             if (Object.keys(dailyForecasts).length < 5 || dailyForecasts[day]) {
                  dailyForecasts[day] = item;
             }
        }
    });


    // Create and append forecast cards for the next 5 days
     Object.values(dailyForecasts).slice(0, 5).forEach(item => { // Ensure max 5 days
        const date = new Date(item.dt * 1000);
        const dayFormatted = date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }); // More readable date
        const temp = item.main.temp;
        const wind = item.wind.speed;
        const humidity = item.main.humidity;
        const description = item.weather[0].description;
        const iconCode = item.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

        const card = document.createElement('div');
        card.className = 'weather-card bg-white/40 backdrop-blur-sm p-4 rounded-lg shadow text-center text-gray-800 opacity-0'; // Start hidden for transition
        card.innerHTML = `
            <h4 class="font-semibold mb-1">${dayFormatted}</h4>
            <img src="${iconUrl}" alt="${description}" class="w-12 h-12 mx-auto">
            <p class="text-sm capitalize mb-1">${description}</p>
            <p class="text-sm">Temp: ${temp.toFixed(1)}°C</p>
            <p class="text-sm">Wind: ${wind.toFixed(1)} M/S</p>
            <p class="text-sm">Humidity: ${humidity}%</p>
        `;
        forecastContainer.appendChild(card);
         // Trigger fade-in for the card
         setTimeout(() => card.style.opacity = 1, 50 * Object.keys(dailyForecasts).indexOf(date.toISOString().split('T')[0]) + 10); // Staggered fade-in
    });

     // Make the forecast section visible
     forecastSection.classList.remove('hidden');
     setTimeout(() => forecastSection.style.opacity = 1, 10);
}


/**
 * Adds a successfully searched city to local storage for recent searches.
 * Ensures no duplicates and limits the list size.
 * @param {string} city - The city name to add.
 */
function addCityToRecentSearches(city) {
    if (!city) return;
    const normalizedCity = city.trim().toLowerCase();
    let cities = [];
    try {
        const storedCities = localStorage.getItem(recentCitiesKey);
        if (storedCities) {
            cities = JSON.parse(storedCities);
        }
        // Ensure it's an array
        if (!Array.isArray(cities)) {
            cities = [];
        }
    } catch (e) {
        console.error("Error reading recent cities from localStorage:", e);
        cities = [];
    }

    // Remove the city if it already exists to move it to the top
    cities = cities.filter(c => c.toLowerCase() !== normalizedCity);

    // Add the new city to the beginning
    cities.unshift(city); // Using original casing for display, comparison is lowercase

    // Limit the number of recent cities
    if (cities.length > maxRecentCities) {
        cities = cities.slice(0, maxRecentCities);
    }

    try {
        localStorage.setItem(recentCitiesKey, JSON.stringify(cities));
    } catch (e) {
        console.error("Error saving recent cities to localStorage:", e);
    }
}


/**
 * Loads recent searches from local storage and populates the dropdown.
 */
function loadRecentSearches() {
    recentSearchesDropdown.innerHTML = ''; // Clear existing items
    let cities = [];
    try {
        const storedCities = localStorage.getItem(recentCitiesKey);
        if (storedCities) {
            cities = JSON.parse(storedCities);
        }
         if (!Array.isArray(cities)) {
            cities = [];
        }
    } catch (e) {
        console.error("Error reading recent cities from localStorage:", e);
        cities = [];
    }


    if (cities.length === 0) {
        recentSearchesDropdown.classList.add('hidden'); // Hide if empty
        return;
    }

    cities.forEach(city => {
        const button = document.createElement('button');
        button.textContent = city;
        button.type = 'button'; // Prevent form submission
        button.addEventListener('click', () => {
            cityInput.value = city; // Fill input field
            recentSearchesDropdown.classList.add('hidden'); // Hide dropdown
            handleSearchFormSubmit(new Event('submit', { cancelable: true })); // Trigger search programmatically
        });
        recentSearchesDropdown.appendChild(button);
    });

    // Do not show dropdown automatically on load, only on focus/input
     // recentSearchesDropdown.classList.remove('hidden');
}

/**
 * Shows the recent searches dropdown if there are any searches saved.
 */
function showRecentSearches() {
     const cities = JSON.parse(localStorage.getItem(recentCitiesKey) || '[]');
     if (cities.length > 0) {
          recentSearchesDropdown.classList.remove('hidden');
     } else {
         recentSearchesDropdown.classList.add('hidden');
     }
}


/**
 * Displays an error message in the UI.
 * @param {string} message - The error message to display.
 */
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
}

/**
 * Hides the error message in the UI.
 */
function hideError() {
    errorMessage.textContent = '';
    errorMessage.classList.add('hidden');
}

/**
 * Shows the loading indicator.
 */
function showLoading() {
    loadingIndicator.classList.remove('hidden');
    // Disable buttons during load
    searchForm.querySelector('button').disabled = true;
    currentLocationButton.disabled = true;
}

/**
 * Hides the loading indicator.
 */
function hideLoading() {
    loadingIndicator.classList.add('hidden');
     // Enable buttons after load
    searchForm.querySelector('button').disabled = false;
    currentLocationButton.disabled = false;
}

/**
 * Clears the current weather and forecast display areas.
 */
function clearWeatherData() {
    currentWeatherDataElement.classList.add('hidden');
    currentWeatherDataElement.style.opacity = 0;
    forecastSection.classList.add('hidden');
    forecastSection.style.opacity = 0;
    forecastContainer.innerHTML = '';
     // Reset current weather text placeholders (optional)
    document.getElementById('current-city-name').textContent = 'City Name (Date)';
    document.getElementById('current-temp').textContent = 'Temperature: --°C';
    document.getElementById('current-wind').textContent = 'Wind: -- M/S';
    document.getElementById('current-humidity').textContent = 'Humidity: --%';
    document.getElementById('current-weather-desc').textContent = 'Description';
    document.getElementById('current-weather-icon').src = '';
    document.getElementById('current-weather-icon').alt = 'Weather icon';
}

/**
 * Makes the weather data sections visible after data is loaded.
 */
 function showWeatherData() {
 }

// --- Initial Setup ---
// Load recent searches when the page loads.
document.addEventListener('DOMContentLoaded', loadRecentSearches);
