// Session timeout limit (30 minutes in milliseconds)
const TIMEOUT_LIMIT = 1800000; // 30 minutes

// Function to update the last active time in localStorage
function updateLastActiveTime() {
    const currentTime = new Date().getTime();
    localStorage.setItem('last-active-time', currentTime); // Store the current timestamp
}

// Function to check if the session has timed out
function checkSessionTimeout() {
    const lastActiveTime = localStorage.getItem('last-active-time');
    const currentTime = new Date().getTime();

    // If the session has expired
    if (!lastActiveTime || (currentTime - lastActiveTime > TIMEOUT_LIMIT)) {
        // Clear the user's login information
        localStorage.removeItem('logged-in-user');
        localStorage.removeItem('last-active-time');

        // Show the alert and redirect the user to the login page
        alert("Session has expired. You will be redirected to the login page.");
        window.location.href = "main_login.html";
    }
}

// Set up an interval to check for session timeout every minute
setInterval(checkSessionTimeout, 60000); 


// Call this function on page load to update the last active time
window.addEventListener('load', updateLastActiveTime);

// Attach event listeners for any user interaction to update the last active time
window.addEventListener('mousemove', updateLastActiveTime); // Mouse movement
window.addEventListener('keydown', updateLastActiveTime); // Keyboard interaction
window.addEventListener('click', updateLastActiveTime); // Click events
