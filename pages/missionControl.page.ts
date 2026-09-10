import { Page, Locator } from '@playwright/test';
import { Navbar } from './componentes/navbar';

export class MissionControlPage {
    readonly page: Page;
    readonly newMissionLink: Locator;
    readonly navbar: Navbar;

    constructor(page: Page){
        this.page = page;
        this.newMissionLink = page.getByRole('link', { name: 'Nova Missão' });
        this.navbar = new Navbar(page);
    }
}