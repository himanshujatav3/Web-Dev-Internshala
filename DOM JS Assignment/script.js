document.addEventListener("DOMContentLoaded", function () {
  // --- Grab references to DOM elements we'll need ---
  const form = document.getElementById("studentForm");
  const tbody = document.getElementById("studentBody"); // Where student rows go
  const searchInput = document.getElementById("search"); // Desktop search
  const mobileSearchInput = document.getElementById("mobileSearch"); // Mobile search
  const hamburgerIcon = document.getElementById("hamburgerIcon");
  const mobileMenu = document.getElementById("mobileMenu");
  const navButtons = document.querySelectorAll(".nav-btn[data-section]");

  // --- Application State ---
  // Load existing students from browser storage, or start fresh if none exist
  let students = JSON.parse(localStorage.getItem("students")) || [];
  let isEditing = false; // Flag to check if we're editing or adding
  let editIndex = -1; // Stores the index of the student being edited

  // --- Core Functions ---

  // Utility to save the current student list to localStorage
  const saveToStorage = () => {
    localStorage.setItem("students", JSON.stringify(students));
  };

  // Re-draws the entire student table based on the current `students` array
  const renderTable = () => {
    tbody.innerHTML = "";
    students.forEach((student, index) => {
      const row = document.createElement("tr");
      // Set data attributes on buttons to easily get the index later
      row.innerHTML = `
          <td>${student.name}</td>
          <td>${student.id}</td>
          <td>${student.email}</td>
          <td>${student.contact}</td>
          <td class="actions">
            <button class="edit" data-index="${index}">Edit</button>
            <button class="delete" data-index="${index}">Delete</button>
          </td>
        `;
      tbody.appendChild(row); // Add the new row to the table body
    });
  };

  // Removes any previous validation error messages and styles
  const clearErrors = () => {
    document.querySelectorAll(".error-message").forEach((e) => e.remove());
    document
      .querySelectorAll("#studentForm input.error")
      .forEach((el) => el.classList.remove("error"));
  };

  // Displays an error message next to the specified input field
  const showError = (fieldId, message) => {
    const field = document.getElementById(fieldId);
    field.classList.add("error");
    // Check if an error message div already exists, if not create one
    let errorElem = field.nextElementSibling;
    if (!errorElem || !errorElem.classList.contains("error-message")) {
      errorElem = document.createElement("div");
      errorElem.classList.add("error-message");
      // Insert the error message right after the input field
      field.parentNode.insertBefore(errorElem, field.nextSibling);
    }
    errorElem.textContent = message;
  };

  // Checks the form inputs against validation rules
  const validateForm = (data) => {
    let isValid = true;
    clearErrors();

    // Name: Should only contain letters and spaces
    if (!/^[A-Za-z ]+$/.test(data.name)) {
      showError("name", "Name can only contain letters and spaces.");
      isValid = false;
    }

    // Student ID: Must be numbers only
    if (!/^\d+$/.test(data.id)) {
      showError("studentId", "Student ID must contain only numbers.");
      isValid = false;
    }

    // Email: Basic email format check
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(data.email)) {
      showError("email", "Please enter a valid email address.");
      isValid = false;
    }

    // Contact: Must be exactly 10 digits
    if (!/^\d{10}$/.test(data.contact)) {
      showError("contact", "Contact number must be exactly 10 digits.");
      isValid = false;
    }

    return isValid; // Return true if all checks pass, false otherwise
  };

  // Scrolls the page smoothly to the target section
  const scrollToSection = (sectionId) => {
    // Find the section element and scroll to it
    const sectionElement = document.getElementById(sectionId);
    if (sectionElement) {
      sectionElement.scrollIntoView({ behavior: "smooth" });
    } else {
      console.warn(`Section with ID "${sectionId}" not found.`);
    }
  };

  // Toggles the visibility of the mobile navigation menu
  const toggleMobileMenu = () => {
    if (mobileMenu.style.display === "flex") {
      mobileMenu.style.display = "none";
    } else {
      mobileMenu.style.display = "flex";
    }
  };

  // Handles editing a student: fills form, sets flags, scrolls view
  const handleEdit = (index) => {
    const student = students[index]; // Get the student data by index
    // Populate the form fields with the student's current data
    form.name.value = student.name;
    form.studentId.value = student.id;
    form.email.value = student.email;
    form.contact.value = student.contact;

    isEditing = true;
    editIndex = index;
    form.querySelector("button").textContent = "Update Student";

    scrollToSection("registration");
    clearErrors();
  };

  // Handles deleting a student after confirmation
  const handleDelete = (index) => {
    // Ask for confirmation before deleting
    if (
      confirm(
        `Are you sure you want to delete ${students[index].name}'s record?`
      )
    ) {
      students.splice(index, 1);
      saveToStorage();
      renderTable();
    }
  };

  // Filters the table display based on search input (name)
  const searchStudents = (event) => {
    // Use the event target to get the current input value (works for both inputs)
    const query = event.target.value.trim().toLowerCase();

    // Get all rows from the table body
    const rows = tbody.getElementsByTagName("tr");

    // Loop through each row and hide/show based on the query
    Array.from(rows).forEach((row) => {
      // Get the student name text from the first cell (td)
      const nameCell = row.getElementsByTagName("td")[0];
      if (nameCell) {
        const name = nameCell.textContent.toLowerCase();
        // If the name includes the query, show the row, otherwise hide it
        if (name.includes(query)) {
          row.style.display = "";
        } else {
          row.style.display = "none";
        }
      }
    });
  };

  // --- Event Listeners Setup ---

  // Handle the form submission (Add or Update)
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = {
      name: form.name.value.trim(),
      id: form.studentId.value.trim(),
      email: form.email.value.trim(),
      contact: form.contact.value.trim(),
    };

    // Stop if validation fails
    if (!validateForm(formData)) return;

    if (isEditing) {
      // If editing, update the student at the stored index
      students[editIndex] = formData;
      isEditing = false;
      editIndex = -1;
      form.querySelector("button").textContent = "Add Student";
    } else {
      // If not editing, add the new student data to the array
      students.push(formData);
    }

    saveToStorage(); // Save the updated array
    renderTable(); // Refresh the table display
    form.reset(); // Clear the form fields
    clearErrors(); // Clear any errors after successful submission
  });

  // Use event delegation for Edit/Delete buttons inside the table body
  tbody.addEventListener("click", (e) => {
    // Check if the clicked element is an Edit button
    if (e.target.classList.contains("edit")) {
      // Get the index from the button's data-index attribute
      const index = parseInt(e.target.getAttribute("data-index"), 10);
      handleEdit(index);
    }
    // Check if the clicked element is a Delete button
    if (e.target.classList.contains("delete")) {
      // Get the index from the button's data-index attribute
      const index = parseInt(e.target.getAttribute("data-index"), 10);
      handleDelete(index);
    }
  });

  // Listen for input in both search fields
  searchInput.addEventListener("keyup", searchStudents);
  mobileSearchInput.addEventListener("keyup", searchStudents);

  // Add click listener for the hamburger icon
  hamburgerIcon.addEventListener("click", toggleMobileMenu);

  // Add click listeners for all navigation buttons (desktop and mobile)
  navButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const sectionId = button.getAttribute("data-section");
      scrollToSection(sectionId);
      // If the mobile menu is open, close it after clicking a nav item
      if (mobileMenu.style.display === "flex") {
        toggleMobileMenu();
      }
    });
  });

  // --- Initial Load ---
  renderTable(); // Draw the table for the first time when the page loads
});
