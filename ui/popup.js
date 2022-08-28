import {bolderizeWord} from "../utils/bolderizeWord";

function getSelectionText() {
    return window.getSelection().toString();
}

function modifySelection(newValue) {
    const range = document.getSelection().getRangeAt(0);
    range.deleteContents();
    range.insertNode(document.createTextNode(newValue));
}

const button = document.querySelector('.bolderize');
button.addEventListener('click', () => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        const tabId = tabs[0].id;
        chrome.scripting.executeScript( {
            target: {tabId},
            func: getSelectionText
        }, function(results) {
            const boldValues = bolderizeWord(results[0].result);
            chrome.scripting.executeScript( {
                target: {tabId},
                func: modifySelection,
                args: [boldValues]
            });
        });
    });
});
