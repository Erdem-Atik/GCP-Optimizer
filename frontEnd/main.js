
// Get references to the DOM elements
    const kmzFileInput = document.getElementById('kmzFileInput');
    const uploadButton = document.getElementById('uploadButton');
    const map = L.map('map').setView([0, 0], 2); // Centered at lat 0, lng 0, zoom level 2
// Wait until the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the Leaflet map


    // Add OpenStreetMap tile layer to the map
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
    }).addTo(map);

    // Add an event listener to the upload button
    uploadButton.addEventListener('click', () => {
        // Check if a file has been selected
        if (kmzFileInput.files.length === 0) {
            alert('Please select a KMZ file to upload.');
            return;
        }

        // Create a new FormData object
        const formData = new FormData();
        formData.append('file', kmzFileInput.files[0]);

        // Send the file to the backend using fetch
        fetch('http://127.0.0.1:5000/upload', {
            method: 'POST',
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert(`Error: ${data.error}`);
            } else {
                alert('File uploaded successfully!');
                // Process the data and plot GCPs on the map (Placeholder for now)
                // You will need to add the logic here to process the KMZ file and display GCPs
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
});
