const hamburgerBtn = document.querySelector('.hamburger-icon');
const urlInput = document.querySelector('input[type="text"]');
const form = document.querySelector('form');

// Show/Hide Hamburger Menu for mobile version
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

// Shorten the URL
const shortenUrl = async (urlInput) => {
    const API_URL = `https://api.shrtco.de/v2/shorten?url=${urlInput.value}`
    const response = await fetch(API_URL);
    const { result } = await response.json();
    addToLocalStorage(result);
    urlInput.value = '';
}

// Submit the URL
const submitUrl = (e) => {
    e.preventDefault();
    shortenUrl(urlInput);
}

// Get from local storage
const getFromLocalStorage = () => {
    let linksFromStorage;
    if(localStorage.getItem('links') === null) {
        linksFromStorage = [];
    } else {
        linksFromStorage = JSON.parse(localStorage.getItem('links'));
    }
    return linksFromStorage;
}

// Add to local storage
const addToLocalStorage = (apiResult) => {
    const linksFromStorage = getFromLocalStorage();
    if(linksFromStorage.length >= 3) {
        linksFromStorage.pop();
    }
    linksFromStorage.unshift(apiResult);
    localStorage.setItem('links', JSON.stringify(linksFromStorage));
    console.log(linksFromStorage);
}


hamburgerBtn.addEventListener('click', showHideMobileMenu);
form.addEventListener('submit', submitUrl);