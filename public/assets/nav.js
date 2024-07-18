const menuIcon = document.getElementById('menu-icon');
const menuList = document.getElementById('main-menu');

let menuIsVisible;

menuIcon.addEventListener('click', (event) => {
    
    event.preventDefault();

    if (window.getComputedStyle(menuList).display === 'none') {
        menuList.style.display = 'block';
        menuIcon.name = 'close-outline';
    }
    else if (window.getComputedStyle(menuList).display === 'block') {
        menuList.style.display = 'none';
        menuIcon.name = 'menu-outline';
    };

});