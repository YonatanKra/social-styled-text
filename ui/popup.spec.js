import chrome from 'sinon-chrome';
global.chrome = chrome;

function setButtonInPage() {
    document.body.innerHTML = '<button class="bolderize">Bolderize</button>';
}

function spyOnClickCallback(bolderizeButton) {
    const originalAddEventListener = bolderizeButton.addEventListener;
    const spy = jest.fn();
    jest.spyOn(bolderizeButton, 'addEventListener').mockImplementation((eventName, cb) => {
        spy.mockImplementation(cb);
        originalAddEventListener(eventName, spy);
    });
    return spy;
}

function prepChromeExtensionApi() {
    jest.spyOn(chrome.tabs, 'query').mockImplementation((options, cb) => {
        cb([{id: 1, title: 'test'}]);
    });
    chrome.scripting = {
        executeScript: (options, cb) => {
            const result = options.args ? options.func(...options.args) : options.func()
            cb ? cb([{result}]) : null;
        },
    };
}

function createDOMWithText(text) {
    const textElement = document.createElement('div');
    textElement.innerHTML = `<span>${text}</span>`;
    document.body.appendChild(textElement);

    return textElement;
}

async function usePopupFlowToBolderizeElement(bolderizeButton, element) {
    await import('./popup.js');
    window.getSelection().selectAllChildren(element);
    bolderizeButton.click();
    const actualText = element.textContent.trim();
    return actualText;
}

describe(`popup`, function () {
    let bolderizeButton;

    beforeEach(function () {
        setButtonInPage();
        bolderizeButton = document.querySelector('.bolderize');
    });

    afterEach(function () {
        jest.restoreAllMocks();
    });

    it(`should set a listener on the bolderize button`, async function () {
        const spy = spyOnClickCallback(bolderizeButton);
        await import('./popup.js');

        bolderizeButton.click();

        expect(spy).toHaveBeenCalled();
    });

    it(`should work on current tab`, async function () {
        jest.spyOn(chrome.tabs, 'query');

        await import('./popup.js');

        bolderizeButton.click();

        expect(chrome.tabs.query).toHaveBeenCalledWith({active: true, currentWindow: true}, expect.any(Function));
    });

    it('should replace the text of the button with bold text', async function () {
        prepChromeExtensionApi();
        const textElement = createDOMWithText('Bolderize');
        const actualText = await usePopupFlowToBolderizeElement(bolderizeButton, textElement);

        expect(actualText).toEqual('𝗕𝗼𝗹𝗱𝗲𝗿𝗶𝘇𝗲');
    });

    it('should replace bolderized text of the button with unbolderized text', async function () {
        prepChromeExtensionApi();
        const textElement = createDOMWithText('𝗕𝗼𝗹𝗱𝗲𝗿𝗶𝘇𝗲');
        const actualText = await usePopupFlowToBolderizeElement(bolderizeButton, textElement);

        expect(actualText).toEqual('Bolderize');
    });

    it('should replace partially bolderized text of the button with bolderized text', async function () {
        prepChromeExtensionApi();
        const textElement = createDOMWithText('B𝗼𝗹𝗱𝗲𝗿𝗶𝘇𝗲');
        const actualText = await usePopupFlowToBolderizeElement(bolderizeButton, textElement);

        expect(actualText).toEqual('𝗕𝗼𝗹𝗱𝗲𝗿𝗶𝘇𝗲');
    });
});
