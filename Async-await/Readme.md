# Asynchronous Programming Exercises in JavaScript

This project contains a series of simple web pages demonstrating different techniques for handling asynchronous operations in JavaScript: Callbacks, Promises, and Async/Await. Each example fetches data from the [dummyjson.com](https://dummyjson.com/docs) posts API and displays it on the page.

This was developed as an exercise to understand and compare these fundamental asynchronous patterns.

## Concepts Demonstrated

*   **Callbacks:** Using functions passed as arguments to handle results after an asynchronous operation (simulated delay and API fetch).
*   **Promises:** Using the `Promise` object to represent the eventual result (success or failure) of an asynchronous operation, including:
    *   Wrapping `fetch` calls in a Promise.
    *   Handling success (`.then()`) and failure (`.catch()`).
    *   Implementing a timeout (`setTimeout` with `reject`).
*   **Async/Await:** Using `async` functions and the `await` keyword to write asynchronous code that looks more synchronous and is often easier to read and manage.
    *   Using `await` with `fetch` and `.json()`.
    *   Using `try...catch` blocks for error handling with `async/await`.
*   **Fetch API:** Interacting with a REST API to retrieve data over the network.
*   **DOM Manipulation:** Updating the HTML content of elements dynamically based on the results of asynchronous operations.
*   **Error Handling:** Basic handling of network errors, non-OK HTTP responses, and timeouts.

## Technologies Used

*   HTML5
*   CSS3
*   Vanilla JavaScript (ES6+)
*   Fetch API (Browser built-in)
*   [DummyJSON API](https://dummyjson.com/posts) (for sample data)


## Code Explanation Snippets

### Callbacks (`callbacks.js`)

*   Demonstrates the traditional callback pattern where a function (`getDataWithCallback`) takes another function (`displayFetchedData`) as an argument.
*   The callback (`displayFetchedData`) is invoked *after* the asynchronous `fetch` operation completes, receiving either an `error` or the `data`.
*   Error handling relies on the callback checking its first argument.

### Promises (`promises.js`)

* Uses the Promise object to encapsulate the asynchronous fetch operation.
* The fetchDataPromise function returns a Promise that will either resolve with data or reject with an error.
* Includes a setTimeout to implement a timeout condition that rejects the promise if the fetch takes too long. clearTimeout is crucial upon success/failure.
* Uses .then() to handle the resolved data and .catch() to handle any rejected errors (including the timeout).

### Async/Await (`async-await.js`)

* Provides syntactic sugar over Promises, making the code appear more linear.
* The async function loadPostsData() allows the use of await.
* await fetch(...) pauses the function until the fetch promise settles.
* await response.json() pauses until the JSON parsing promise settles.
* Error handling is done using standard try...catch blocks, which catch errors from awaited promises or explicit throw statements.
