const button = document.querySelector('.bolderize');
button.addEventListener('click', () => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {

    });
});
