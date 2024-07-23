document.addEventListener('DOMContentLoaded', function () {
    var menuToggle = document.getElementById('menu-toggle');
    var menu = document.getElementById('menu');

    menuToggle.addEventListener('click', function () {
        if (menu.classList.contains('menu-open')) {
            menu.classList.remove('menu-open');
        } else {
            menu.classList.add('menu-open');
        }
    });
});
