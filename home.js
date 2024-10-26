// Get the About Us link and the About Us section
const aboutUsLink = document.getElementById('aboutUsLink');
const aboutUsSection = document.getElementById('aboutUs');

// Add click event listener to the About Us link
aboutUsLink.addEventListener('click', function(event) {
    event.preventDefault(); // Prevent the default link behavior

    // Toggle the display of the About Us section
    if (aboutUsSection.style.display === 'none' || aboutUsSection.style.display === '') {
        aboutUsSection.style.display = 'block'; // Show the section
        aboutUsSection.scrollIntoView({ behavior: 'smooth' }); // Scroll to the section
    } else {
        aboutUsSection.style.display = 'none'; // Hide the section
    }
});

// Logout functionality
document.getElementById('logoutButton').addEventListener('click', function () {
    alert("Logging out...");
    window.location.href = 'login.html';  // Redirect to login page
});

// Event listener for the Scan QR Code button
document.getElementById('scan-qr').addEventListener('click', function() {
    // Redirect to the scan.html page
    window.location.href = "scan.html";
});
