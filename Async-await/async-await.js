const loadDataBtn = document.getElementById("fetchDataButton");
const outputDiv = document.getElementById("resultsArea");
const jsonPlaceholderUrl = "https://dummyjson.com/posts";

// Using 'async function' allows us to use 'await' inside it.
// Makes asynchronous code look more like synchronous code.
async function loadPostsData() {
  outputDiv.textContent = "Fetching posts, please wait...";

  try {
    console.log("Async: Starting fetch...");
    // 'await' pauses the function here until fetch() completes and gives us a response
    const response = await fetch(jsonPlaceholderUrl);
    console.log(`Async: Got response - Status ${response.status}`);

    // Check if the response status is not OK (e.g., 404 Not Found, 500 Server Error)
    if (!response.ok) {
      // If it's not okay, throw an error to be caught by the 'catch' block
      throw new Error(
        `Failed to fetch. Server responded with ${response.status}`
      );
    }

    console.log("Async: Parsing JSON...");
    // 'await' pauses again until the JSON data is parsed from the response body
    const data = await response.json();
    console.log("Async: Data parsed.");

    // --- Data processing and display ---
    outputDiv.innerHTML = ""; // Clear the loading message

    if (data && data.posts && data.posts.length > 0) {
      outputDiv.innerHTML = "<h2>Posts (Async/Await):</h2>";
      const postListElem = document.createElement("ul");
      data.posts.slice(0, 6).forEach((post) => {
        const postItem = document.createElement("li");
        postItem.textContent = post.title;
        postListElem.appendChild(postItem);
      });
      outputDiv.appendChild(postListElem);
    } else {
      // Handle case where data is received but no posts array exists or is empty
      outputDiv.textContent = "Successfully fetched, but no posts were found.";
    }
  } catch (error) {
    // If anything in the 'try' block failed (fetch, json parsing, network down), this block runs.
    console.error("Async: Fetch operation failed:", error);
    // Display a user-friendly error message
    outputDiv.innerHTML = `<p class="error">Could not load posts. Reason: ${error.message}</p>`;
  }
}

// --- Event Setup ---
// When the button is clicked, simply run our async function
loadDataBtn.addEventListener("click", loadPostsData);
