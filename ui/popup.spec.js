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
});
