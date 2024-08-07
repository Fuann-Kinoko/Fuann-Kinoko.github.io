document.addEventListener("DOMContentLoaded", function() {
    var h1 = 0;
    var siteHeader = document.querySelector('.site-header');

    // Check if the current page is the homepage
    if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
        siteHeader.classList.add('is-homepage');
    } else {
        siteHeader.classList.remove('is-homepage');
    }

    // Handle scroll events only if on the homepage
    window.addEventListener("scroll", function() {
        var s = document.documentElement.scrollTop || document.body.scrollTop;

        if (s === h1) {
            siteHeader.classList.remove('yya');
        }
        if (s > h1) {
            siteHeader.classList.add('yya');
        }
    });
});
