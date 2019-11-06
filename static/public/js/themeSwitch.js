// Set theme switch button based on current theme
class Theme {
    constructor() {
        this.refresh();
    }

    refresh() {
        this.theme = localStorage.getItem('theme') || 'light'; // Light theme is default
        if (this.theme === 'light') {
            // Set navbar theme
            $('.navbar').removeClass('navbar-dark').addClass('navbar-light');
            // Set navbar bg color
            $('.navbar').css('background-color', '#D3D3D3');
            // Set light bg for relevant elements
            $('.bg').removeClass('bg-dark').addClass('bg-light');
            // Add text-dark class to relevant text elements
            $('.text').removeClass('text-white').addClass('text-dark');
            // Update and show theme indicator/switch
            $('#themeIndicator').attr('class', 'fas fa-sun');
            $('#themeSwitch').removeClass('d-none');
        }
        else if (this.theme === 'dark') {
            // Set navbar theme
            $('.navbar').removeClass('navbar-light').addClass('navbar-dark');
            // Set navbar bg color
            $('.navbar').css('background-color', '#222222');
            // Set dark bg for relevant elements
            $('.bg').removeClass('bg-light').addClass('bg-dark');
            // Add text-white class to relevant text elements
            $('.text').removeClass('text-dark').addClass('text-white');
            // Update and show theme indicator/switch
            $('#themeIndicator').attr('class', 'fas fa-moon');
            $('#themeSwitch').removeClass('d-none');
        }
        // Set background
        $(document.body).attr('style', `background-image: url("/img/${this.theme}/bg.png")`);
    }

    change() {
        if (this.theme === 'light') {
            localStorage.setItem('theme', 'dark');
            this.refresh();
        }
        else if (this.theme === 'dark') {
            localStorage.setItem('theme', 'light');
            this.refresh();
        }
    }
}

$(document).ready(() => {
    const theme = new Theme();

    document.getElementById('themeSwitch').onclick = () => {
        // Change the theme and update the page
        theme.change();
    };
});