// Get references to the button and the area to show results
const fetchBtn = document.getElementById("fetchDataBtn");
const resultsContainer = document.getElementById("resultDisplay");
const postsApiUrl = "https://dummyjson.com/posts";

// Kicks off the data fetching. Needs a function (the 'done' callback) to handle the data or error once the fetch is complete.
function getDataWithCallback(apiUrl, done) {
  console.log("Starting fetch operation...");

  fetch(apiUrl)
    .then((response) => {
      console.log("Got response:", response.status);
      if (!response.ok) {
        throw new Error(`Hmm, network response wasn't ok (${response.status})`);
      }
      return response.json();
    })
    .then((data) => {
      // Successfully got data, call the 'done' function with no error
      console.log("Data parsed successfully.");
      done(null, data); // Standard callback pattern: error first (null here), then data
    })
    .catch((error) => {
      // Something went wrong during fetch or parsing
      console.error("Problem fetching data:", error);
      // Call the 'done' function with the error object
      done(error, null); // Pass the error, null for data
    });
}

// This function handles the result *after* getDataWithCallback is done.
// It gets either an error or the actual data.
function displayFetchedData(error, data) {
  // Always clear previous results first
  resultsContainer.innerHTML = "";

  if (error) {
    // There was a problem! Show the error message.
    resultsContainer.innerHTML = `<p class="error">Couldn't fetch posts. Reason: ${error.message}</p>`;
  } else if (data && data.posts && data.posts.length > 0) {
    resultsContainer.innerHTML = "<h2>Fetched Posts:</h2>";
    const listElement = document.createElement("ul");
    data.posts.slice(0, 7).forEach((post) => {
      const item = document.createElement("li");
      item.textContent = post.title;
      listElement.appendChild(item);
    });
    resultsContainer.appendChild(listElement);
  } else {
    resultsContainer.innerHTML = "<p>Fetched data, but no posts found.</p>";
  }
}

// --- Event Setup ---
fetchBtn.addEventListener("click", () => {
  resultsContainer.textContent = "Getting posts, one moment...";
  getDataWithCallback(postsApiUrl, displayFetchedData);
});
