function toggleMenu() 
{
    let menu = document.getElementById('menu');

    if (menu.classList.contains('show')) 
    {
        menu.classList.remove('show');
    } 
    else 
    {
        menu.classList.add('show');
    }
}

signOut = () => {

    localStorage.removeItem('logged-in-user');
    localStorage.removeItem('selectedTheme');
    localStorage.removeItem('selectedFont')
    window.location.href = "main_login.html";

}

function changeTheme(theme) 
{

    let font = localStorage.getItem('selectedFont');

    if (font)
    {
        if (font == 'big')
        {
            document.documentElement.classList.add("big-font");
        }
        else if (font == 'normal')
        {
            document.documentElement.classList.remove("big-font")
            document.documentElement.classList.remove("small-font")
        }
        else if (font == 'small')
        {
            document.documentElement.classList.add("small-font")
        }
    }

    document.documentElement.className = '';
    document.documentElement.classList.add(`theme-${theme}`);
    localStorage.setItem('selectedTheme', theme);
}

function changeFont(font) 
{
    document.documentElement.className = '';
    
    if (font == 'big'){
        document.documentElement.classList.add("big-font");
    }else if (font == 'normal'){
        document.documentElement.classList.remove("big-font");
        document.documentElement.classList.remove("small-font");
    }else if (font == 'small'){
        document.documentElement.classList.add("small-font")
    }

    // Store the selected theme in localStorage
    localStorage.setItem('selectedFont', font);

    let currentTheme = localStorage.getItem('selectedTheme')
    document.documentElement.classList.add(`theme-${currentTheme}`);
}


// Load the navigation dynamically and then attach event listeners
document.addEventListener('DOMContentLoaded', function () {
    // Fetch the navigator.html and inject it into the page
    fetch('navigator.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('menu-container').innerHTML = data;

        
        const teamDashboardLink = document.getElementById('team-dashboard-link');
        if (teamDashboardLink) {
            teamDashboardLink.addEventListener('click', function (e) {
                e.preventDefault(); 

                // Retrieve the logged-in user from localStorage
                const loggedInUser = JSON.parse(localStorage.getItem('logged-in-user'));

                // Check if the user is an admin or member and redirect accordingly
                if (loggedInUser && loggedInUser.role === 'admin') {
                    window.location.href = "admin_view.html"; // Redirect admin to admin view
                } else if (loggedInUser && loggedInUser.role === 'member') {
                    window.location.href = "team_view_select.html"; // Redirect team member to team view
                } else {
                    // If no valid user is found, redirect to the login page
                    alert("You are not logged in. Redirecting to login page.");
                    window.location.href = "main_login.html"; // Redirect to login if no user is found
                }
            });
        } else {
            console.error("Team Dashboard link not found.");
        }
    })
    .catch(err => {
        console.error("Error loading navigator.html:", err);
    });
});