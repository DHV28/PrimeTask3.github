function loadFont() {

    let savedFont = localStorage.getItem('selectedFont');
    
    if (! savedFont){
        localStorage.setItem('selectedFont','medium')
        savedFont = localStorage.getItem('selectedFont');
    }

    if (savedFont) {
        // Apply the saved theme
        changeFont(savedFont);


        
        // Set the corresponding radio button as checked
        const fontRadio = document.getElementById(savedFont);
        if (fontRadio) {
            fontRadio.checked = true;
        } 
    }
}

function changeFont(font) {
    // Clear existing theme classes
    document.documentElement.className = '';

    
    // Add the new theme class to the root element
    
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
    localStorage.setItem('selectedFont', font);

    let currentTheme = localStorage.getItem('selectedTheme')
    
    document.documentElement.classList.add(`theme-${currentTheme}`);
    
}

window.onload = loadFont;