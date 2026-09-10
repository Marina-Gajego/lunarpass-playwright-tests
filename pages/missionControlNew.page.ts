import { Page, Locator, expect } from '@playwright/test';
import { Navbar } from './componentes/navbar';
import { MissionControlPage } from './missionControl.page';

export class NewMissionPage {
    readonly page: Page;
    readonly navbar: Navbar;
    readonly title: Locator;
    readonly missionIdInput: Locator;
    readonly lunarBaseSelect: Locator;
    readonly returnDateValue: Locator;
    readonly rocketInput: Locator;
    readonly departureDateInput: Locator;
    readonly priceInput: Locator;
    readonly saveButton: Locator;
    readonly backButton: Locator;
    readonly alert: Locator;

    constructor(page: Page){
        this.page = page;
        this.navbar = new Navbar(page);
        this.title = page.getByRole('heading', { name: 'Nova missão · Mission Control' });
        this.missionIdInput = page.getByRole('textbox', { name: 'ID da missão' });
        this.lunarBaseSelect = page.getByLabel('Base lunar');
        this.returnDateValue = page.getByTestId('mission-form-return-date');
        this.rocketInput = page.getByRole('textbox', { name: 'Foguete' });
        this.departureDateInput = page.getByRole('textbox', { name: 'Data de partida' });
        this.priceInput = page.getByRole('spinbutton', { name: 'Preço por passagem (USD)' });
        this.saveButton = page.getByRole('button', { name: 'Salvar missão' });
        this.backButton = page.getByRole('button', { name: 'Voltar' });
        this.alert = page.getByRole('alert')
    }

    async selectLunarBase(base: string) {
        await this.lunarBaseSelect.selectOption(base);
    }

    async fillMissionData(id: string, base: string, rocket: string, departureDate: string, price: number){
        await this.missionIdInput.fill(id);
        await this.lunarBaseSelect.selectOption(base);
        await this.rocketInput.fill(rocket);
        await this.departureDateInput.fill(departureDate);
        await this.priceInput.fill(String(price));
    }

    async saveMission(){
        await this.saveButton.click();
    }

    async goBack(){
        await this.backButton.click();
    }

    async gotoNewMission(){
        await this.page.goto('/mission-control');
        const missionControlPage = new MissionControlPage(this.page);
        await missionControlPage.newMissionLink.click();
    }
}