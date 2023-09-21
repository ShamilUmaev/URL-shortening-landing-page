const hamburgerBtn = document.querySelector('.hamburger-icon');

const showHideMobileMenu = () => {
    const navCtr = document.querySelector('.mobile-nav');
    
    if(navCtr.classList.contains('hide')) {
        navCtr.classList.remove('hide');
        navCtr.classList.add('show');
    } else {
        navCtr.classList.remove('show');
        navCtr.classList.add('hide');
    }
} 

hamburgerBtn.addEventListener('click', showHideMobileMenu);