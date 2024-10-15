

function loadTheme() {
    
    const savedTheme = localStorage.getItem('selectedTheme');
    if (savedTheme) {
        // Apply the saved theme
        changeTheme(savedTheme);
        
        // Set the corresponding radio button as checked
        const themeRadio = document.getElementById(savedTheme);
        if (themeRadio) {
            themeRadio.checked = true;
        }
    }
}

function changeTheme(theme) {
    
    // Clear existing theme classes
    document.documentElement.className = '';

    let font = localStorage.getItem('selectedFont');

    // Add the new theme class to the root element
    document.documentElement.classList.add(`theme-${theme}`);

    if (font){
        if (font == 'big'){
            document.documentElement.classList.add("big-font");
        }else if (font == 'normal'){
            document.documentElement.classList.remove("big-font")
            document.documentElement.classList.remove("small-font")
        }else if (font == 'small'){
            document.documentElement.classList.add("small-font")
        }
    }
    

    // Store the selected theme in localStorage
    localStorage.setItem('selectedTheme', theme);
}


window.onload = loadTheme;
