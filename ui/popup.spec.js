describe(`popup`, function () {
    it(`should set a listener on the bolderize button`, async function () {
        document.body.innerHTML = '<button class="bolderize">Bolderize</button>';
        const bolderizeButton = document.querySelector('.bolderize');
        const originalAddEventListener = bolderizeButton.addEventListener;
        const spy = jest.fn();
        jest.spyOn(bolderizeButton, 'addEventListener').mockImplementation((eventName, _) => {
            originalAddEventListener(eventName, spy);
        });
        await import('./popup.js');
        bolderizeButton.click();
        expect(spy).toHaveBeenCalled();
    });
});
