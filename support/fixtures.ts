import { test as base } from '@playwright/test';
import { MissionControlLoginPage } from '../pages/missionControlLogin.page';
import { MissionControlPage } from '../pages/missionControl.page';
import { NewMissionPage } from '../pages/missionControlNew.page';
import { Navbar } from '../pages/componentes/navbar';
import { Toast } from '../pages/componentes/toast';

type Fixtures = {
    loginPage: MissionControlLoginPage;
    missionControlPage: MissionControlPage;
    newMissionPage: NewMissionPage;
    navbar: Navbar;
    toast: Toast;
};

export const test = base.extend<Fixtures>({
    loginPage: async ({ page }, use) => {
        await use(new MissionControlLoginPage(page));
    },
    missionControlPage: async ({ page }, use) => {
        await use(new MissionControlPage(page));
    },
    newMissionPage: async ({ page }, use) => {
        await use(new NewMissionPage(page));
    },
    navbar: async ({ page }, use) => {
        await use(new Navbar(page));
    },
    toast: async ({ page }, use) => {
        await use(new Toast(page));
    },
});

export { expect } from '@playwright/test';