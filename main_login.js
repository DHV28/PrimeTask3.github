const firebaseConfig = {
    apiKey: "AIzaSyCSzTbYhygkAEratuYSLjziC8dAHxm_0kM",
    authDomain: "primetask-3b148.firebaseapp.com",
    databaseURL: "https://primetask-3b148-default-rtdb.firebaseio.com",
    projectId: "primetask-3b148",
    storageBucket: "primetask-3b148.appspot.com",
    messagingSenderId: "914891090322",
    appId: "1:914891090322:web:832ef0efe1205b8f33f94b"
};
firebase.initializeApp(firebaseConfig);

// Reference to the database
const database = firebase.database();

// Store default admin credentials
const adminCredentialsRef = database.ref('admin-credentials');
const memberCredentialsRef = database.ref('team-members');



// Rest of your login form code
const loginForm = document.getElementById("login-form");
const loginButton = document.getElementById("login-form-submit");
const loginErrorMsg = document.getElementById("login-error-msg");

loginButton.addEventListener("click", (e) => {
    e.preventDefault();

    const username = loginForm.username.value.trim();
    const password = loginForm.password.value.trim();

    if (username === "" || password === "") {
        alert("Username and password fields cannot be empty.");
        return;
    }

    let isAuthenticated = false;

    // Check admin credentials first
    adminCredentialsRef.once('value', (admin) => {
        const adminCredentials = admin.val();
        const adminUsername = adminCredentials.username;
        const adminPassword = adminCredentials.password;

        if (username === adminUsername && password === adminPassword) {
            isAuthenticated = true;
            // Store in localStorage for admin login 
            localStorage.setItem('logged-in-user', JSON.stringify({ username: adminUsername, role: 'admin' })); 
            updateLastActiveTime(); 
            checkAdminFirstTime();

            alert("You have successfully logged in as Admin.");
            window.location.href = "sprint_board.html"; 
            return true; // Exit the forEach loop
        }

        // If not authenticated as admin, check member credentials
        if (!isAuthenticated) {
            memberCredentialsRef.once('value', (membersSnapshot) => {
                let assignees = membersSnapshot.val();
                let members = Object.keys(assignees);
                members.forEach(member => {
                    const memberID = member;
                    const memberCredentials = assignees[member];
                    const memberUsername = memberCredentials.memberEmail;
                    const memberPassword = memberCredentials.memberPassword;

                    if (username === memberUsername && password === memberPassword) {
                        isAuthenticated = true;
                        // Store in localStorage for member login 
                        localStorage.setItem('logged-in-user', JSON.stringify({ username: memberCredentials.memberName, ID: memberID, role: 'member', email: memberUsername })); 
                        updateLastActiveTime();

                        alert("You have successfully logged in as Team Member.");
                        window.location.href = "sprint_board.html"; 
                        return true; // Exit the forEach loop
                    }
                });

                // If still not authenticated, show error message
                if (!isAuthenticated) {
                    loginErrorMsg.style.opacity = 1;
                    alert("Please enter the correct username and password.");
                }
            }).catch((error) => {
                console.error("Error fetching login credentials:", error);
            });
        }
    }).catch((error) => {
        console.error("Error fetching admin credentials:", error);
    });
});

// Check login status from localStorage 
window.addEventListener('load', () => {
    checkSessionTimeout(); 

    const loggedInUser = JSON.parse(localStorage.getItem('logged-in-user'));

    // Ensure this check only happens when the user hasn't logged out
    if (loggedInUser) {
        updateLastActiveTime();
        alert(`Welcome back, ${loggedInUser.username}. Redirecting you to the dashboard...`);
        
        // Redirect to the correct dashboard depending on role
        if (loggedInUser.role === 'admin') {
            window.location.href = "admin_view.html"; 
        } else if (loggedInUser.role === 'member') {
            window.location.href = "team_view_select.html"; 
        }
    } else {
        console.log("No user logged in."); 
    }
});

// // check if first time from admin credentials in database
// // also check if is admin
// adminCredentialsRef.once('value', (admin) => {
//     let firstTime = admin.val().firstTime;
// 
//     // submitButton = document.getElementById("login-form-submit");
//     const username = document.getElementById("username-field").value.trim();
//     const loginButton = document.getElementById("login-form-submit");
//     const adminUsername = admin.val().username;
// 
//     loginButton.addEventListener("click", function(){
//         if (username === adminUsername && firstTime === true) {
//             window.location.href = "security_question_first.html";
//             // Update firstTime in the database to false
//             adminCredentialsRef.update({ firstTime: false });
//         }
//     });
// });

function checkAdminFirstTime() {
    adminCredentialsRef.once('value', (admin) => {
        let firstTime = admin.val().firstTime;

        if (firstTime === true) {
            window.location.href = "security_question_first.html";
            // adminCredentialsRef.update({ firstTime: false });
        }
    });
}

// Function to check if the session has timed out
function checkSessionTimeout() {
    const lastActiveTime = localStorage.getItem('last-active-time');
    const currentTime = new Date().getTime();

    const loggedInUser = JSON.parse(localStorage.getItem('logged-in-user'));

    // Ensure this check only happens when the user hasn't logged out
    if (loggedInUser) {

        // If no last active time is stored or 1 hour has passed, timeout the session
        if (!lastActiveTime || (currentTime - lastActiveTime > TIMEOUT_LIMIT)) {
            // Session has timed out
            localStorage.removeItem('logged-in-user'); // Clear login information
            localStorage.removeItem('last-active-time'); // Clear last active time
            alert("Session has expired. You have been logged out due to inactivity.");
            window.location.href = "main_login.html"; 
        }
    }
}


// Function to update the last active time for a specific user
function updateLastActiveTime(username) {
    const currentTime = new Date().getTime();
    localStorage.setItem(`${username}-last-active-time`, currentTime); // Store the current timestamp for the specific user
}


// Function to log in a user and store their session data
function loginUser(username) {
    // Store the user-specific login information in localStorage
    localStorage.setItem(`${username}-logged-in-user`, JSON.stringify({ username }));
    updateLastActiveTime(username); // Initialize the last active time for the user
}


// Function to handle logging out a specific user
function logoutUser(username) {
    localStorage.removeItem(`${username}-logged-in-user`); // Clear the user's login information
    localStorage.removeItem(`${username}-last-active-time`); // Clear the user's last active time
    alert(`${username}, you have been logged out.`);
    window.location.href = "main_login.html"; // Redirect to login page
}

// Attach event listeners to update the last active time on user interaction
window.addEventListener('mousemove', () => {
    const loggedInUser = JSON.parse(localStorage.getItem('logged-in-user'));
    if (loggedInUser) {
        updateLastActiveTime(loggedInUser.username); // Update activity for the specific user
    }
});
window.addEventListener('keydown', () => {
    const loggedInUser = JSON.parse(localStorage.getItem('logged-in-user'));
    if (loggedInUser) {
        updateLastActiveTime(loggedInUser.username); // Update activity for the specific user
    }
});
window.addEventListener('click', () => {
    const loggedInUser = JSON.parse(localStorage.getItem('logged-in-user'));
    if (loggedInUser) {
        updateLastActiveTime(loggedInUser.username); // Update activity for the specific user
    }
});
