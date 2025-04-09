const fetchButton = document.getElementById("fetchBtnPromise");
const resultDisplayArea = document.getElementById("resultDivPromise");
const postsUrl = "https://dummyjson.com/posts";
const TIMEOUT_DURATION = 5000; // 5 seconds for timeout

// This function *returns* a Promise.
function fetchDataPromise() {
  return new Promise((resolve, reject) => {
    let fetchTimer = null; // Variable to hold our timeout timer

    // Safety net: If the fetch takes longer than TIMEOUT_DURATION, reject the promise.
    fetchTimer = setTimeout(() => {
      console.warn("Fetch timed out!");
      reject(
        new Error(
          `Request took too long (more than ${
            TIMEOUT_DURATION / 1000
          } seconds).`
        )
      );
    }, TIMEOUT_DURATION);

    // Start the actual fetch process
    fetch(postsUrl)
      .then((response) => {
        // Got a response! Important: clear the timeout timer now.
        clearTimeout(fetchTimer);
        console.log("Promise: Got response status", response.status);
        if (!response.ok) {
          // If status code is bad (e.g., 404, 500), reject the promise.
          throw new Error(
            `Network request failed with status: ${response.status}`
          );
        }
        return response.json();
      })
      .then((data) => {
        console.log("Promise: Data parsed.");
        resolve(data);
      })
      .catch((error) => {
        // An error occurred during fetch or parsing. Clear timer and reject.
        clearTimeout(fetchTimer); // Make sure timer is cleared even if fetch fails early
        console.error("Promise: Fetch/parse error:", error);
        reject(error); // Reject the promise with the actual error object.
      });
  });
}

// --- Event Setup ---
fetchButton.addEventListener("click", () => {
  // Show loading state immediately
  resultDisplayArea.textContent = "Loading posts...";

  // Call the promise-based function
  fetchDataPromise()
    .then((data) => {
      // This block runs if the Promise 'resolved' (was successful)
      resultDisplayArea.innerHTML = ""; // Clear loading message
      if (data && data.posts && data.posts.length > 0) {
        resultDisplayArea.innerHTML = "<h2>Posts via Promise:</h2>";
        const list = document.createElement("ul");
        data.posts.slice(0, 8).forEach((post) => {
          const item = document.createElement("li");
          item.textContent = post.title;
          list.appendChild(item);
        });
        resultDisplayArea.appendChild(list);
      } else {
        resultDisplayArea.textContent = "No posts found in the response.";
      }
    })
    .catch((error) => {
      // This block runs if the Promise 'rejected' (failed, including timeout)
      resultDisplayArea.innerHTML = `<p class="error">Something went wrong: ${error.message}</p>`;
    });
});
