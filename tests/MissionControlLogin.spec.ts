import { test, expect } from '@playwright/test';
import { MissionControlLoginPage } from '../pages/missionControlLogin.page';
import { MissionControlPage } from '../pages/missionControl.page';
import * as usersData from '../support/usersData';

let loginPage: MissionControlLoginPage;
let missionControlPage: MissionControlPage;

test.beforeEach(async ({page}) => {
    loginPage = new MissionControlLoginPage(page);
    missionControlPage = new MissionControlPage(page);
    await loginPage.gotoLoginMissionControl();
    await expect(page).toHaveTitle('Mission Control · Lunar Pass');
})

test('Login com sucesso', async ({ page }) => {
    await test.step('Preencher credenciais válidas e realizar login', async () => {
        const user = usersData.validUser();
        await loginPage.login(user.email, user.password);
    });

    await test.step('Validar que o login foi realizado com sucesso', async () => {
        await expect(missionControlPage.logoutButton).toBeVisible({ timeout: 15000 });
    });
})

test('Login com credenciais inválidas não deve logar', async ({ page }) => {
    await test.step('Preencher credenciais inválidas e tentar realizar login', async () => {
        const user = usersData.invalidUser();
        await loginPage.login(user.email, user.password);
    })

    await test.step('Validar que o login não foi realizado', async () => {
        await expect(loginPage.alert).toHaveText('E-mail ou senha inválidos.')
    });
});

test('Login com email inválido não deve logar', async ({ page }) => {
    await test.step('Preencher email inválido e senha válida', async () => {
        const user = usersData.invalidEmail();
        await loginPage.login(user.email, user.password);
    })

    await test.step('Validar que o login não foi realizado', async () => {
        await expect(loginPage.alert).toHaveText('E-mail ou senha inválidos.')
    });
});

test('Login com senha inválida não deve logar', async ({ page }) => {
    await test.step('Preencher email válido e senha inválida', async () => {
        const user = usersData.invalidPassword();
        await loginPage.login(user.email, user.password);
    })

    await test.step('Validar que o login não foi realizado', async () => {
        await expect(loginPage.alert).toHaveText('E-mail ou senha inválidos.')
    });
});

test('Login sem informar email não deve logar', async ({ page }) => {
    await test.step('Preencher senha válida e não informar email', async () => {
        const user = usersData.validUser();
        await loginPage.login('', user.password);
    })

    await test.step('Validar que o login não foi realizado', async () => {
        await expect(loginPage.alert).toHaveText('Informe um e-mail válido')
    });
});

test('Login sem informar senha não deve logar', async ({ page }) => {
    await test.step('Preencher email válido e não informar senha', async () => {
        const user = usersData.validUser();
        await loginPage.login(user.email, '');
    })

    await test.step('Validar que o login não foi realizado', async () => {
        await expect(loginPage.alert).toHaveText('Informe a senha')
    });
});

test('Login sem informar email e senha não deve logar', async ({ page }) => {
    await test.step('Não informar email nem senha', async () => {
        const user = usersData.validUser();
        await loginPage.login('', '');
    })

    await test.step('Validar que o login não foi realizado', async () => {
        await expect(loginPage.alert).toHaveText('Informe um e-mail válido')
    });
});

test('Login com email em formato inválido não deve logar', async ({ page }) => {
    await test.step('Preencher email em formato inválido e senha válida', async () => {
        const user = usersData.validUser();
        await loginPage.login('teste@gmailcom', user.password);
    })

    await test.step('Validar que o login não foi realizado', async () => {
        await expect(loginPage.alert).toHaveText('Informe um e-mail válido')
    });
});