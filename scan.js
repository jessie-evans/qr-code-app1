function domReady(fn) {
    if (
        document.readyState === "complete" ||
        document.readyState === "interactive"
    ) {
        setTimeout(fn, 1000);
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
}

domReady(function () {
    // Declare htmlscanner outside onScanSuccess function
    let htmlscanner;

    // Function that runs when QR code is successfully scanned
    function onScanSuccess(decodeResult) {
        // Get the current date and time when QR code is scanned
        const date = new Date().toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false  // Use 24-hour format. Set to true for 12-hour format with AM/PM
        });

        // Print the QR code result and timestamp to the console
        console.log("QR Code Data:", decodeResult);
        console.log("Scanned at:", date);

        alert('Attendance Recorded!');

        // Stop the scanner after successfully scanning the QR code
        htmlscanner.clear().then(() => {
            console.log("QR code scanning stopped.");
            window.location.href = 'scan.html';  // Redirect to scan.html
        }).catch(err => {
            console.error("Error stopping the scanner:", err);
        });
    }

    // Initialize the QR code scanner
    htmlscanner = new Html5QrcodeScanner(
        "my-qr-reader",
        { fps: 10, qrbox: 300 }
    );
    htmlscanner.render(onScanSuccess);
});
