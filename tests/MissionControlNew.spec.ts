import { test, expect } from '../support/fixtures';
import * as missionData from '../support/missionData';
import * as db from '../support/db';

test.beforeEach(async ({ newMissionPage, page }) => {
    await newMissionPage.gotoNewMission();
    await expect(page).toHaveTitle('Nova missão · Mission Control');
})

test('Cadastrar uma missão com sucesso', async ({ newMissionPage, toast }) => {
    let mission: missionData.Mission;

    await test.step('Gerar massa de dados válida para a nova missão', async () => {
        mission = missionData.validMission();
    })

    await test.step('Preencher o formulário da missão', async () => {
        await newMissionPage.fillMissionData(mission.id, mission.baseId, mission.rocket, mission.departureDate, mission.price);
    })

    await test.step('Validar que a data de retorno é 7 dias após a data de partida', async () => {
        // Partida em 2028-01-20; a UI exibe o retorno (2028-01-27) por extenso.
        await expect(newMissionPage.returnDateValue).toHaveText('27 de jan. de 2028');
    })

    await test.step('Salvar a missão', async () => {
        await newMissionPage.saveButton.click();
    })

    await test.step('Validar que a nova missão foi cadastrada com sucesso', async () => {
        await expect(toast.message).toContainText('A nova missão foi adicionada ao catálogo e já está disponível para reservas.',);
    })

    //add uma validacao dentro do banco de dados que valida o insert da missao
})

test('Não deve cadastrar uma missão já existente', async ({ newMissionPage }) => {
    let mission: missionData.Mission;

    await test.step('Gerar massa de dados e garantir que a missão já exista no banco', async () => {
        mission = missionData.validMission();
        await Promise.all([
            db.deleteReservation(mission.id),
            db.deleteTicket(mission.id),
        ]);
        await db.deleteMission(mission.id);
        await db.insertMission(mission);
    })

    await test.step('Preencher o formulário com o ID já existente e tentar salvar', async () => {
        await newMissionPage.fillMissionData(mission.id,mission.baseId,mission.rocket,mission.departureDate,mission.price);
        await newMissionPage.saveButton.click();
    })

    await test.step('Validar que a missão duplicada não foi cadastrada', async () => {
        await expect(newMissionPage.alert).toHaveText('Já existe uma missão com este ID.');
    })

    //validar no banco que temos somente um registro para x id
})
