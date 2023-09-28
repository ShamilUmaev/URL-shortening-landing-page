const hamburgerBtn = document.querySelector('.hamburger-icon');
const urlInput = document.querySelector('input[type="text"]');
const form = document.querySelector('form');

// Show/Hide Hamburger Menu for mobile version
const showHideMobileMenu = () => {
    const navCtr = document.querySelector('.mobile-nav');
    navCtr.classList.toggle('show');
} 

// Shorten the URL
const shortenUrl = async (urlInput) => {
    if(urlInput.value === '') {
        urlInput.style.outline = "2px solid red";
        urlInput.classList.add('error');
        return;
    } else {
        urlInput.style.outline = "none";
        urlInput.classList.remove('error');
        const API_URL = `https://api.shrtco.de/v2/shorten?url=${urlInput.value}`
        const response = await fetch(API_URL);
        const { result } = await response.json();
        addToLocalStorage(result);
        displayLinks();
        urlInput.value = '';
    }
}

const onFocus = () => {
    urlInput.style.outline = "none";
    urlInput.classList.remove('error');
}

// Submit the URL
const submitUrl = (e) => {
    e.preventDefault();
    shortenUrl(urlInput);
}

// Get from local storage
const getFromLocalStorage = () => {
    if(localStorage.getItem('links') === null) {
        return [];
    } else {
        return linksFromStorage = JSON.parse(localStorage.getItem('links'));
    }
}

// Add to local storage
const addToLocalStorage = (apiResult) => {
    const linksFromStorage = getFromLocalStorage();
    if(linksFromStorage.length >= 3) {
        linksFromStorage.pop();
    }
    linksFromStorage.unshift(apiResult);
    localStorage.setItem('links', JSON.stringify(linksFromStorage));
}

// Display the data from local storage
const displayLinks = () => {
    const linksFromStorage = getFromLocalStorage();
    const resultsParentContainer = document.querySelector('div.results');
    resultsParentContainer.innerHTML = '';
    linksFromStorage.forEach(link => {
        const resultBgCard = document.createElement('div');
        resultBgCard.classList.add('result-bg-card');
        resultBgCard.innerHTML = `
            <div class="pasted-url">
                <p>${link.original_link}</p>
            </div>
            <div class="result">
                <a href="${link.full_short_link}">${link.full_short_link}</a>
                <button class="copy-btn btn-primary">Copy</button>
            </div>
        `
        resultsParentContainer.appendChild(resultBgCard);
    })
}

// // Another way of displaying links using the DOM
// const displayLinksUsingDom = () => {
//     const linksFromStorage = getFromLocalStorage();
//     const resultsParentContainer = document.querySelector('div.results');
//     resultsParentContainer.innerHTML = '';
//     linksFromStorage.forEach(link => {
//         // Create a Background Card for each Result
//         const resultBgCard = document.createElement('div');
//         resultBgCard.classList.add('result-bg-card');
    
//         // Create a parent div called pasted-url for original-link paragraph
//         const pastedUrlDiv = document.createElement('div');
//         pastedUrlDiv.classList.add('pasted-url');
//         resultBgCard.appendChild(pastedUrlDiv);
    
//         // Create a paragraph with original link
//         const originalLink = document.createElement('p');
//         originalLink.appendChild(document.createTextNode(link.original_link));
//         pastedUrlDiv.appendChild(originalLink);
    
//         // Create a div for the result
//         const result = document.createElement('div');
//         result.classList.add('result');
    
//         // Create an anchor tag for full_short_link
//         const fullShortlink = document.createElement('a');
//         fullShortlink.setAttribute('href', link.full_short_link);
//         fullShortlink.appendChild(document.createTextNode(link.full_short_link));
//         result.appendChild(fullShortlink);
    
//         // Create a button to copy the full_short_link
//         const cpyBtn = document.createElement('button');
//         cpyBtn.classList.add('copy-btn', 'btn-primary');
//         cpyBtn.appendChild(document.createTextNode('Copy'));
//         result.appendChild(cpyBtn);
    
//         // Append the div of the result to the Background Card for each Result
//         resultBgCard.appendChild(result);
    
//         resultsParentContainer.appendChild(resultBgCard);
//     })
// }

hamburgerBtn.addEventListener('click', showHideMobileMenu);
urlInput.addEventListener('focus', onFocus);
form.addEventListener('submit', submitUrl);
document.addEventListener('DOMContentLoaded', displayLinks);