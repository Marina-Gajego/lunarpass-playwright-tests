import { Locator, Page } from "@playwright/test"

export class Toast {
    readonly page: Page;
    readonly message: Locator

    constructor(page: Page){
        this.page = page;
        this.message = page.getByRole('listitem');
    }
}