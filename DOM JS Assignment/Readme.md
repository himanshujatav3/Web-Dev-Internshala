# Student Registration System

A simple, front-end web application for managing student records. This system allows users to add, view, edit, and delete student information (Name, Student ID, Email, Contact No.). Data is persisted locally in the browser using `localStorage`.

This project was developed as part of an assignment, focusing on fundamental HTML, CSS, and JavaScript skills, including DOM manipulation, event handling, form validation, and local storage management.

## Features

*   **Add Students:** Register new students through a dedicated form.
*   **View Students:** Display all registered students in a clear, organized table.
*   **Edit Students:** Modify the details of existing students.
*   **Delete Students:** Remove student records (with confirmation).
*   **Data Persistence:** Student data is saved in the browser's `localStorage`, so records are not lost on page refresh.
*   **Input Validation:** Ensures data integrity with checks for:
    *   Name (letters and spaces only)
    *   Student ID (numbers only)
    *   Email (valid format)
    *   Contact No. (exactly 10 digits)
    *   Visual feedback for invalid fields.
*   **Search Functionality:** Filter the student list dynamically by name in real-time.
*   **Responsive Navigation:** Includes a navigation bar that adapts to smaller screens with a hamburger menu.
*   **Smooth Scrolling:** Navigation links provide smooth scrolling to different sections of the page.
*   **Dynamic Table:** The student list table updates automatically after add, edit, or delete actions.
*   **Scrollable Table:** The student database table includes a vertical scrollbar if the content exceeds the maximum height.


## Technologies Used

*   **HTML5:** For the structure and content of the web page.
*   **CSS3:** For styling, layout, responsiveness, and animations.
    *   CSS Variables for theme management.
    *   Flexbox for layout.
*   **Vanilla JavaScript (ES6+):** For dynamic behavior, DOM manipulation, event handling, validation, and local storage interaction.
*   **Browser Local Storage API:** For persisting student data locally.


### How to Use:

*   **Navigate:** Use the links ("Home", "Registration", "Database") in the navigation bar (or mobile menu) to scroll to different sections.
*   **Add Student:** Go to the "Registration" section, fill in the form fields correctly, and click "Add Student". Invalid input will show error messages.
*   **View Students:** Go to the "Database" section to see the list of registered students.
*   **Edit Student:** In the "Database" table, click the "Edit" button next to a student record. The form in the "Registration" section will be populated with that student's data. Modify the details and click "Update Student".
*   **Delete Student:** In the "Database" table, click the "Delete" button next to a student record. A confirmation prompt will appear before deletion.
*   **Search:** Type a student's name into the search bar in the navigation area (desktop or mobile) to filter the list in the "Database" section instantly.


## Code Explanation

### `index.html`

*   Sets up the basic HTML document structure with appropriate `meta` tags and title.
*   Links the `style.css` stylesheet and `script.js` script file.
*   Uses semantic HTML elements like `<nav>`, `<section>`, `<footer>`, `<table>`, `<form>`.
*   **Navigation (`<nav>`):** Contains links for scrolling and the search input. Includes a separate structure for the mobile hamburger menu (`.hamburger`, `.mobile-menu`). Navigation buttons use `data-section` attributes for JS targeting.
*   **Sections (`<section>`):** Divides the page content logically (Home, Registration Form, Student Database, Contact). Each section has a unique ID for navigation.
*   **Form (`<form id="studentForm">`):** Contains input fields (`<input>`) for student details with appropriate `id`, `type`, `placeholder`, and basic HTML5 validation attributes (`required`, `pattern`).
*   **Table (`<table id="studentTable">`):** Displays student data. Includes `<thead>` for headers and an empty `<tbody id="studentBody">` which is populated dynamically by JavaScript.

### `style.css`

*   Uses CSS Variables (`:root`) for easy theme management (colors, dimensions).
*   Includes a basic reset (`*`) for consistent styling across browsers.
*   Styles all major components: Navigation (desktop & mobile), Sections, Form inputs and button, Table appearance, Footer.
*   Uses Flexbox (`display: flex`) for layout in the navigation and home section.
*   Provides specific styling for form input focus (`input:focus`) and validation errors (`input.error`, `.error-message`).
*   Styles the Edit and Delete buttons within the table.
*   Implements responsiveness using a media query (`@media (max-width: 768px)`) to adjust navigation for smaller screens (hiding desktop links, showing hamburger).
*   Adds subtle transitions and hover effects (e.g., `popUp` animation) for better user experience.
*   Sets `max-height` and `overflow-y: auto` on the `.database-section` to enable vertical scrolling for the table.

### `script.js`

This file contains all the logic for the application.

*   **Initialization (`DOMContentLoaded`):** Ensures the script runs only after the HTML is fully loaded. It gets references to key DOM elements and performs the initial table render.
*   **State Management:**
    *   `students` array: Holds the list of student objects. Loaded from `localStorage` on startup or initialized as empty.
    *   `isEditing`, `editIndex`: Flags to manage the state when editing a student record.
*   **LocalStorage:**
    *   `saveToStorage()`: Serializes the `students` array to JSON and saves it to `localStorage`.
    *   Initial load reads from `localStorage`.
*   **DOM Manipulation:**
    *   `renderTable()`: Clears the existing table body (`tbody`) and dynamically creates and appends table rows (`<tr>`) for each student in the `students` array. Crucially, it adds `data-index` attributes to Edit/Delete buttons, linking them to the correct student in the `students` array.
*   **Form Validation:**
    *   `validateForm()`: Checks each input field against predefined rules (regex for name, ID, email, contact length).
    *   `showError()`, `clearErrors()`: Functions to display and remove inline validation error messages and apply/remove the `.error` class to input fields.
*   **Event Handling (`addEventListener`):**
    *   **Form Submission:** Listens for the `submit` event on the form. Prevents default submission, gathers data, validates it, then either adds a new student or updates an existing one based on the `isEditing` flag. Saves data and re-renders the table.
    *   **Table Actions (Edit/Delete):** Uses *event delegation* by adding a single click listener to the `tbody`. It checks if the clicked element (`e.target`) has the class `.edit` or `.delete`. If so, it retrieves the student's index from the button's `data-index` attribute and calls `handleEdit()` or `handleDelete()`.
    *   **Search:** Listens for the `keyup` event on both search inputs. Calls `searchStudents()` to filter the table rows based on the input value.
    *   **Navigation:** Adds `click` listeners to navigation buttons to trigger `scrollToSection()`. Also handles closing the mobile menu after a selection.
    *   **Hamburger Menu:** Adds a `click` listener to the hamburger icon to toggle the mobile menu's visibility using `toggleMobileMenu()`.
*   **CRUD Logic:**
    *   **Create/Update:** Handled within the form's `submit` event listener.
    *   **Read:** Implicitly done by `renderTable()`.
    *   **Edit (`handleEdit()`):** Populates the form with the selected student's data, sets editing flags, changes the button text, and scrolls to the form.
    *   **Delete (`handleDelete()`):** Prompts the user for confirmation, removes the student from the `students` array using `splice()`, saves to storage, and re-renders the table.
*   **UI Helpers:**
    *   `scrollToSection()`: Provides smooth scrolling to page sections.
    *   `toggleMobileMenu()`: Manages the display of the mobile navigation.
    *   `searchStudents()`: Filters table rows directly by manipulating their `display` style based on the search query.

---
