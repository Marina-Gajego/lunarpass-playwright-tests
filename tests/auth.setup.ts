import { test as setup, expect } from '../support/fixtures';

const authFile = 'playwright/.auth/user.json';

setup('Autenticar em Mission Control', async ({ loginPage, navbar, page }) => {
    await loginPage.loginAsDefaultUser();
    await expect(navbar.logoutButton).toBeVisible({ timeout: 30_000 });
    await page.context().storageState({ path: authFile });
});