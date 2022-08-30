import {bolderizeOrUnbolderizeWord} from "../utils/bolderizeWord.js";

function getSelectionText() {
    return window.getSelection().toString();
}

function modifySelection(newValue) {
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const clone = range.cloneRange();

    range.endContainer.textContent = range.endContainer.textContent.replace(range.cloneContents().textContent, newValue);

    selection.addRange(clone);
}

const button = document.querySelector('.bolderize');
button.addEventListener('click', () => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        const tabId = tabs[0].id;
        chrome.scripting.executeScript( {
            target: {tabId},
            func: getSelectionText
        }, function(results) {
            const boldValues = bolderizeOrUnbolderizeWord(results[0].result);
            chrome.scripting.executeScript( {
                target: {tabId},
                func: modifySelection,
                args: [boldValues]
            });
        });
    });
});
