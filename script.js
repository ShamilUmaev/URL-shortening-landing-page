const hamburgerBtn = document.querySelector('.hamburger-icon');
const urlInput = document.querySelector('input[type="text"]');
const form = document.querySelector('form');
const errorMsg = document.querySelector('.error-msg');
const cpyBtn = document.querySelectorAll('.copy-btn'); 
const resultsDiv = document.querySelector('.results');
const getStartedBtn = document.querySelector('.get-started-btn');

// Copy to clipboard
const copyToClipboard = (e) => {
    if(e.target.classList.contains('copy-btn')) {
        const copyText = e.target.previousElementSibling.textContent;
        navigator.clipboard.writeText(copyText);
        e.target.textContent = 'Copied';
        e.target.classList.remove('btn-primary');
        e.target.classList.add('btn-secondary');
        resetCopyBtnStyles(e);
    }
}

// Reset Copy button styles after copying text
const resetCopyBtnStyles = (e) => {
    setTimeout(() => {
        e.target.textContent = 'Copy';
        e.target.classList.remove('btn-secondary');
        e.target.classList.add('btn-primary');
    }, 3000)
}

resultsDiv.addEventListener('click', copyToClipboard);

// Show/Hide Hamburger Menu for mobile version
const showHideMobileMenu = () => {
    const navCtr = document.querySelector('.mobile-nav');
    navCtr.classList.toggle('show-mobile-menu');
}

// Check if the URL is valid
const checkUrl = (urlInput) => {
    const urlRegex = /(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})(\.[a-zA-Z0-9]{2,})?/
    return urlRegex.test(urlInput.value);
}

// Shorten the URL
const shortenUrl = async (urlInput) => {
    if(urlInput.value === '') {
        emptyInputError();
        return;
    } else if(!checkUrl(urlInput)) {
        invalidLinkError();
        return;
    } else {
        onFocus();
        const API_URL = `https://api.shrtco.de/v2/shorten?url=${urlInput.value}`
        const response = await fetch(API_URL);
        const { result } = await response.json();
        addToLocalStorage(result);
        displayLinks();
        urlInput.value = '';
    }
}

// Remove Erro styles
const onFocus = () => {
    urlInput.style.outline = "none";
    urlInput.classList.remove('error');
    urlInput.style.color = 'hsl(0, 0%, 40%)';
    errorMsg.classList.add('hide');
    errorMsg.classList.remove('show');
}

// Error that occurs when you try to submit an empty input
const emptyInputError = () => {
    urlInput.style.outline = "2px solid red";
    urlInput.classList.add('error');
    errorMsg.textContent = "Please add a link";
    errorMsg.classList.remove('hide');
    errorMsg.classList.add('show');
}

// Error that occurs when you try to submit an invalid link
const invalidLinkError = () => {
    urlInput.style.outline = "2px solid red";
    urlInput.style.color = 'red';
    urlInput.classList.add('error');
    errorMsg.textContent = "The link is not valid";
    errorMsg.classList.remove('hide');
    errorMsg.classList.add('show');
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
        resultBgCard.classList.add('result-bg-card', 'animate-result-card');
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

const scrollToUrlInput = () => {
    scrollBy({
        top: 550,
        behavior: "smooth"
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

// Event listeners
const init = () => {
    hamburgerBtn.addEventListener('click', showHideMobileMenu);
    urlInput.addEventListener('focus', onFocus);
    form.addEventListener('submit', submitUrl);
    document.addEventListener('DOMContentLoaded', displayLinks);
    getStartedBtn.addEventListener('click', scrollToUrlInput);
}

init();