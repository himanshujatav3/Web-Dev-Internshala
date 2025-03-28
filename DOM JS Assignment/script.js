// script.js
document.addEventListener("DOMContentLoaded", function () {
  // Retrieve students from localStorage or initialize an empty array
  let students = JSON.parse(localStorage.getItem("students")) || [];
  let isEditing = false;
  let editIndex = -1;

  const form = document.getElementById("studentForm");
  const tbody = document.getElementById("studentBody");
  const searchInput = document.getElementById("search");

  // Save students array to localStorage
  const saveToStorage = () => {
    localStorage.setItem("students", JSON.stringify(students));
  };

  // Render the student table with global indices for edit/delete
  const renderTable = () => {
    tbody.innerHTML = "";
    students.forEach((student, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
          <td>${student.name}</td>
          <td>${student.id}</td>
          <td>${student.email}</td>
          <td>${student.contact}</td>
          <td class="actions">
            <button class="edit" onclick="handleEdit(${index})">Edit</button>
            <button class="delete" onclick="handleDelete(${index})">Delete</button>
          </td>
        `;
      tbody.appendChild(row);
    });
  };

  // Clear existing inline error messages
  const clearErrors = () => {
    document.querySelectorAll(".error-message").forEach((e) => e.remove());
    document
      .querySelectorAll(".error")
      .forEach((el) => el.classList.remove("error"));
  };

  // Show error message inline for a specific field
  const showError = (fieldId, message) => {
    const field = document.getElementById(fieldId);
    let errorElem = field.nextElementSibling;
    if (!errorElem || !errorElem.classList.contains("error-message")) {
      errorElem = document.createElement("div");
      errorElem.classList.add("error-message");
      field.parentNode.insertBefore(errorElem, field.nextSibling);
    }
    errorElem.textContent = message;
    field.classList.add("error");
  };

  // Validate form data and display inline errors if needed
  const validateForm = (data) => {
    let isValid = true;
    clearErrors();

    // Validate Name: only letters and spaces allowed
    if (!/^[A-Za-z ]+$/.test(data.name)) {
      showError("name", "Invalid name! Only letters and spaces allowed.");
      isValid = false;
    }

    // Validate Student ID: must be numeric
    if (!/^\d+$/.test(data.id)) {
      showError("studentId", "Student ID must be numeric.");
      isValid = false;
    }

    // Validate Email using regex
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(data.email)) {
      showError("email", "Invalid email format.");
      isValid = false;
    }

    // Validate Contact: exactly 10 digits
    if (!/^\d{10}$/.test(data.contact)) {
      showError("contact", "Contact must be exactly 10 digits.");
      isValid = false;
    }
    return isValid;
  };

  // Smooth scroll to a specific section
  window.scrollToSection = (sectionId) => {
    document.getElementById(sectionId).scrollIntoView({ behavior: "smooth" });
  };

  // Form submit handler
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = {
      name: form.name.value.trim(),
      id: form.studentId.value.trim(),
      email: form.email.value.trim(),
      contact: form.contact.value.trim(),
    };

    if (!validateForm(formData)) return;

    if (isEditing) {
      students[editIndex] = formData;
      isEditing = false;
      editIndex = -1;
      form.querySelector("button").textContent = "Add Student";
    } else {
      students.push(formData);
    }

    saveToStorage();
    renderTable();
    form.reset();
  });

  // Delete a student record
  window.handleDelete = (index) => {
    if (confirm("Are you sure you want to delete this record?")) {
      students.splice(index, 1);
      saveToStorage();
      renderTable();
    }
  };

  // Edit a student record: pre-fill the form and scroll to registration section
  window.handleEdit = (index) => {
    const student = students[index];
    form.name.value = student.name;
    form.studentId.value = student.id;
    form.email.value = student.email;
    form.contact.value = student.contact;
    isEditing = true;
    editIndex = index;
    form.querySelector("button").textContent = "Update Student";
    window.scrollToSection("registration");
  };

  // Search students by name and update the table view
  window.searchStudents = () => {
    const query = searchInput.value.trim().toLowerCase();
    if (!query) {
      renderTable();
      return;
    }
    // Map students with their global index for proper edit/delete functionality
    const filtered = students
      .map((student, index) => ({ ...student, globalIndex: index }))
      .filter((student) => student.name.toLowerCase().includes(query));

    tbody.innerHTML = "";
    filtered.forEach((student) => {
      const row = document.createElement("tr");
      row.innerHTML = `
          <td>${student.name}</td>
          <td>${student.id}</td>
          <td>${student.email}</td>
          <td>${student.contact}</td>
          <td class="actions">
            <button class="edit" onclick="handleEdit(${student.globalIndex})">Edit</button>
            <button class="delete" onclick="handleDelete(${student.globalIndex})">Delete</button>
          </td>
        `;
      tbody.appendChild(row);
    });
  };

  // Initial render on page load
  renderTable();
});
