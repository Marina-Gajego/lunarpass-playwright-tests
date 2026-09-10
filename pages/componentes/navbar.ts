import { Page, Locator } from '@playwright/test';

export class Navbar {
  readonly page: Page;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.logoutButton = page.getByRole('button', { name: 'Sair' });
  }

  async logout() {
    await this.logoutButton.click();
  }
}