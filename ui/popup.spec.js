function setButtonInPage() {
    document.body.innerHTML = '<button class="bolderize">Bolderize</button>';
}

function spyOnClickCallback(bolderizeButton) {
    const originalAddEventListener = bolderizeButton.addEventListener;
    const spy = jest.fn();
    jest.spyOn(bolderizeButton, 'addEventListener').mockImplementation((eventName, _) => {
        originalAddEventListener(eventName, spy);
    });
    return spy;
}

describe(`popup`, function () {
    it(`should set a listener on the bolderize button`, async function () {
        setButtonInPage();
        const bolderizeButton = document.querySelector('.bolderize');
        const spy = spyOnClickCallback(bolderizeButton);
        await import('./popup.js');

        bolderizeButton.click();
        
        expect(spy).toHaveBeenCalled();
    });
});
