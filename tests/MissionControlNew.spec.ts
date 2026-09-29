import { test, expect } from '../support/fixtures';
import * as missionData from '../support/missionData';
import * as db from '../support/db';
import { NewMissionPage } from '../pages/missionControlNew.page';
import { assert } from 'node:console';

test.beforeEach(async ({ newMissionPage, page }) => {
    await newMissionPage.gotoNewMission();
    await expect(page).toHaveTitle('Nova missão · Mission Control');
})

let mission: missionData.Mission;

test('Cadastrar uma missão com sucesso', async ({ newMissionPage, toast }) => {
    await test.step('Gerar massa de dados válida para a nova missão', async () => {
        mission = missionData.validMission();
    })

    await test.step('Preencher o formulário da missão', async () => {
        await newMissionPage.fillMissionData(mission.id, mission.baseId, mission.rocket, mission.departureDate, mission.price);
    })

    await test.step('Validar que a data de retorno é 7 dias após a data de partida', async () => {
        await expect(newMissionPage.returnDateValue).toHaveText('27 de jan. de 2028');
    })

    await test.step('Salvar a missão', async () => {
        await newMissionPage.saveButton.click();
    })

    await test.step('Validar que a nova missão foi cadastrada com sucesso', async () => {
        await expect(toast.message).toContainText('A nova missão foi adicionada ao catálogo e já está disponível para reservas.',);
    })

    await test.step('Validar no banco de dados que a missão foi inserida com sucesso', async () => {
        const missions = await db.selectMission(mission.id);
        expect(missions).toHaveLength(1);
    })
})

test('Não deve cadastrar uma missão já existente', async ({ newMissionPage }) => {
    await test.step('Gerar massa de dados e garantir que a missão já exista no banco', async () => {
        mission = missionData.validMission();
        await db.cleanAndInsertMission(mission);
    })

    await test.step('Preencher o formulário com o ID já existente e tentar salvar', async () => {
        await newMissionPage.fillMissionData(mission.id,mission.baseId,mission.rocket,mission.departureDate,mission.price);
        await newMissionPage.saveButton.click();
    })

    await test.step('Validar que a missão duplicada não foi cadastrada', async () => {
        await expect(newMissionPage.alert).toHaveText('Já existe uma missão com este ID.');
    })

    await test.step('Validar no banco de dados que só existe uma missão com o ID informado', async () => {
        const missions = await db.selectMission(mission.id);
        expect(missions).toHaveLength(1);
    })
})

test('Não deve cadastrar uma missão sem informar o id da missão', async ({ newMissionPage }) => {
    await test.step('Gerar massa de dados válida para a nova missão', async () => {
        mission = missionData.validMission();
    })

    await test.step('Preencher o formulário da missão sem informar o id da missão', async () => {
        await newMissionPage.fillMissionData('', mission.baseId, mission.rocket, mission.departureDate, mission.price);
    })

    await test.step('Salvar missão', async () => {
        await newMissionPage.saveButton.click();
    })

    await test.step('Validar que o campo id da missão precisa ser informado', async () => {
        await expect(newMissionPage.alert).toHaveText('Use o formato LP-0000');
    })

    await test.step('Validar que a missão não foi inserida no banco de dados', async () => {
        const missions = await db.selectMission(mission.id);
        expect(missions).toHaveLength(0);
    })
})

test('Não deve cadastrar uma missão passando o formato invalido no id da missão', async ({ newMissionPage }) => {
    await test.step('Gerar massa de dados válida para a nova missão', async () => {
        mission = missionData.validMission();
    })

    await test.step('preenche dados', async () => {
        await newMissionPage.fillMissionData('MG-12345', mission.baseId, mission.rocket, mission.departureDate, mission.price)
    })

    await test.step('salvar missao', async () => {
        await newMissionPage.saveButton.click();
    })

    await test.step('validar mensagem de erro', async () => {
        await expect(newMissionPage.alert).toHaveText('Use o formato LP-0000');
    })

    await test.step('validar que nao foi inserido no banco de dados', async () => {
        const missions = await db.selectMission('MG-12345');
        expect(missions).toHaveLength(0)
    })
})

//tentar cadastrar uma misso passando um formato diferente no id da missao
//tentar cadastrar uma missao semp passar o foguete
// tentar cadsatrar a missao sem passar a data de paetida 
//tentar cadastrar uma missao sem passar o valor 
//tentar cadastrar uma missao com uma dadta invalida de partida 
//tentar cadastrar uma missao excedendo o vlaor permitido