import { Page, Locator } from '@playwright/test';

export class MissionControlPage {
    readonly page: Page;
    readonly newMissionLink: Locator;
    readonly logoutButton: Locator;
    readonly searchInput: Locator;

    constructor(page: Page){
        this.page = page;
        this.newMissionLink = page.getByRole('link', { name: 'Nova Missão' });
        this.logoutButton = page.getByRole('button', { name: 'Sair'})
        this.searchInput = page.getByTestId('mission-control-search')
    }
}