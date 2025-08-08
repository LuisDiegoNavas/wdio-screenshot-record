import { expect, browser, $ } from '@wdio/globals'

describe('Login', () => {
    const loginUrl = 'https://myaccount.withuloans.com/login'; 

    beforeEach(async () => {
        await browser.url(loginUrl);
    });
    
    it('Verify login user with correct credentials', async () => {
        await browser.pause(15000);
        await $('#Username').setValue('tom');
        await $('#password').setValue('SuperSecretPassword!');
        await $("//*[contains(text(), 'Sign In')]").click();

        await expect('#errorLabel').toHaveText(
            expect.stringContaining('You logged into a secure area!'));
        
    })

    it('Verify Terms Of Use link functionality', async () => {

        const originalWindow = await browser.getWindowHandle();

        const link = await browser.$("//*[contains(text(), 'Terms Of Use')]");
        await link.click();

        await browser.waitUntil(async () => {
            const handles = await browser.getWindowHandles();
            return handles.length > 1;
        }, { timeout: 5000, timeoutMsg: 'New tab did not open' });

        const windowHandles = await browser.getWindowHandles();
        const newTab = windowHandles.find(handle => handle !== originalWindow);
        await browser.switchToWindow(newTab!);
        
        await expect(browser.getUrl()).toHaveText('https://www.withuloans.com/terms');
    })

})

