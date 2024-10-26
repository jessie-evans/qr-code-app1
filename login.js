const teachers = [
    { staffId: 'T001', password: 'password123' },
    { staffId: 'T002', password: 'password456' }
];

// Handle form submission
document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault();  // Prevent default form submission behavior

    const staffId = document.getElementById('staffId').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');

    // Check if entered staffId and password match any teacher's credentials
    const teacher = teachers.find(t => t.staffId === staffId && t.password === password);

    if (teacher) {
        // If login is successful, redirect to the home page
        window.location.href = 'home.html';
    } else {
        // Display error message for invalid credentials
        errorMessage.textContent = 'Invalid Staff ID or password. Please try again.';
    }
});

// Handle "Show Password" toggle
document.getElementById('showPassword').addEventListener('change', function () {
    const passwordInput = document.getElementById('password');
    if (this.checked) {
        passwordInput.type = 'text'; // Show the password
    } else {
        passwordInput.type = 'password'; // Hide the password
    }
});

// Handle "Forgot Password" click
document.getElementById('forgotPassword').addEventListener('click', function (event) {
    event.preventDefault(); // Prevent default link behavior
    alert('Please contact your administrator to reset your password.');
});
