// Function to switch between light and dark mode
function toggleTheme() {
    const body = document.body;
    const btn = document.getElementById('themeBtn');
    
    body.classList.toggle('dark-theme');
    
    // Check if dark theme is currently turned on
    if (body.classList.contains('dark-theme')) {
        btn.innerHTML = "☀️ Light";
        localStorage.setItem('if_theme', 'dark'); // Remember dark mode
    } else {
        btn.innerHTML = "🌙 Dark";
        localStorage.setItem('if_theme', 'light'); // Remember light mode
    }
}

// Automatically apply the saved theme when the app opens up
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('if_theme');
    const body = document.body;
    const btn = document.getElementById('themeBtn');
    
    if (savedTheme === 'dark') {
        body.classList.add('dark-theme');
        if (btn) btn.innerHTML = "☀️ Light";
    }
});