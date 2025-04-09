# Weather Dashboard Application

## Project Description

This is a web-based weather forecast application built using HTML, Tailwind CSS (via CDN), and vanilla JavaScript. It allows users to search for weather information by city name or use their current location. The application fetches data from the OpenWeatherMap API and displays the current weather conditions along with a 5-day forecast. Recent city searches are saved locally for quick access.

This project fulfills the requirements of the "Weather Forecast Application Development in JavaScript" assignment (200 marks).

## Features

*   **Search by City:** Enter a city name to fetch and display its current weather and 5-day forecast.
*   **Current Location Weather:** Get weather data based on the user's current geographical location using the browser's Geolocation API.
*   **Current Weather Display:** Shows:
    *   City Name and Date
    *   Temperature (°C)
    *   Wind Speed (M/S)
    *   Humidity (%)
    *   Weather condition description (e.g., "clear sky", "light rain")
    *   Relevant weather icon.
*   **5-Day Forecast Display:** Shows a forecast for the next 5 days, including:
    *   Date
    *   Weather icon
    *   Temperature (°C)
    *   Wind Speed (M/S)
    *   Humidity (%)
*   **Recent Searches:** Remembers the last 5 unique cities searched via a dropdown menu integrated with the search input (uses Local Storage). Clicking a recent city re-runs the search for that city.
*   **Responsive Design:** The user interface adapts to various screen sizes (desktop, tablet, mobile) using Tailwind CSS utility classes.
*   **Error Handling:** Displays user-friendly messages for:
    *   Invalid city names or API errors.
    *   Geolocation errors (permission denied, unavailable, timeout).
    *   Empty search input.
*   **Loading Indicator:** Shows a visual indicator while weather data is being fetched.
*   **Custom Background:** Uses a scenic background image for enhanced visual appeal.


## Technologies Used

*   **HTML5:** Structure and content.
*   **CSS3:** Styling (primarily via Tailwind CSS).
    *   **Tailwind CSS (v3 via CDN):** Utility-first CSS framework for rapid UI development and responsiveness.
    *   Inline `<style>` block for background image and custom styles (e.g., recent searches dropdown).
*   **Vanilla JavaScript (ES6+):** Application logic, DOM manipulation, event handling, API calls.
    *   `fetch` API for making requests to the OpenWeatherMap API.
    *   `async/await` for handling asynchronous operations.
    *   Browser `navigator.geolocation` API.
    *   Browser `localStorage` API for storing recent searches.
*   **OpenWeatherMap API:** Source of weather and forecast data.
*   **(Optional) Font Awesome:** Used for the loading spinner icon.
*   

## Usage Instructions

*   **Search by City:** Type the name of a city (e.g., "London", "Tokyo") into the input field under "Enter a City Name" and click the "Search" button or press Enter.
*   **Use Current Location:** Click the "Use Current Location" button. Your browser may ask for permission to access your location.
*   **Recent Searches:** Click inside the city input field. If you have previously searched for cities, a dropdown list of the most recent ones will appear. Click on a city name in the dropdown to search for it again.
*   **View Data:** Once data is fetched, the "Current Weather" section and the "5-Day Forecast" section will be populated below the search area.
*   **Errors:** If there's an issue (invalid city, network error, location permission denied), an error message will be displayed below the search buttons.

## Project Structure

.
├── index.html # Main HTML file (structure, Tailwind classes, inline styles)
├── script.js # JavaScript file (API calls, DOM updates, logic, event handling)
└── README.md # This documentation file

