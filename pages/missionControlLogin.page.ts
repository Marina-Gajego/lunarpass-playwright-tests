import { Page, Locator } from '@playwright/test';

export class MissionControlLoginPage {
    readonly page: Page;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;
    readonly alert: Locator

    constructor(page: Page){
        this.page = page;
        this.emailInput = page.getByRole('textbox', { name: 'Informe seu email' });
        this.passwordInput = page.getByRole('textbox', { name: 'Sua senha secreta' });
        this.loginButton = page.getByRole('button', { name: 'Entrar' })
        this.alert = page.getByRole('alert')
    }

    async gotoLoginMissionControl(){
        await this.page.goto('/mission-control/login');
    }

    async login(email: string, password: string){
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }

    async loginAsDefaultUser(){
        await this.gotoLoginMissionControl();
        await this.login('buzz@lunarpass.dev', 'pwd123');
    }
}