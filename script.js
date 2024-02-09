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

// Check if the link is already shortened
const isAlreadyShortened = (urlInput) => {
    const regexPattern = /shrtco\.de/i;
    return regexPattern.test(urlInput.value)
}

const postRequest = async () => {
    const url = 'https://api-ssl.bitly.com/v4/shorten';
    const token = '9e76626892b45db47833502875af221e817e04f8';
    const options = {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "long_url": urlInput.value
        })
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json();
        addToLocalStorage(result);
        displayLinks();
        urlInput.value = '';
    } catch (error) {
        console.error(error);
    }
}

// Shorten the URL
const shortenUrl = async (urlInput) => {
    if(urlInput.value === '') {
        invalidLinkError('Please add a link');
        return;
    } else if(!checkUrl(urlInput)) {
        invalidLinkError('The link is not valid');
        return;
    } else if(isAlreadyShortened(urlInput)) {
        invalidLinkError('The link is already shortened');
        return;   
    }
    onFocus();
    postRequest();
}

// Remove Error styles
const onFocus = () => {
    urlInput.style.outline = "none";
    urlInput.classList.remove('error');
    urlInput.style.color = 'hsl(0, 0%, 40%)';
    errorMsg.classList.add('hide');
    errorMsg.classList.remove('show');
}

// Error that occurs when you try to submit an invalid link
const invalidLinkError = (errorText) => {
    urlInput.style.outline = "2px solid red";
    urlInput.style.color = 'red';
    urlInput.classList.add('error');
    errorMsg.textContent = errorText;
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
        return JSON.parse(localStorage.getItem('links'));
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
                <p>${link.long_url}</p>
            </div>
            <div class="result">
                <a href="${link.link}">${link.link}</a>
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