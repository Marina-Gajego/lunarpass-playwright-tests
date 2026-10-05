import { test, expect } from '../support/fixtures';
import * as db from '../support/db';

test.beforeEach(async ({ newMissionPage, page }) => {
    await newMissionPage.gotoNewMission();
    await expect(page).toHaveTitle('Nova missão · Mission Control');
})

test('Cadastrar uma missão com sucesso', async ({ newMissionPage, toast, createMission }) => {
    const mission = await test.step('Gerar massa de dados válida para a nova missão', async () => {
        return createMission();
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

test('Não deve cadastrar uma missão já existente', async ({ newMissionPage, createMission }) => {
    const mission = await test.step('Gerar massa de dados e garantir que a missão já exista no banco', async () => {
        const existingMission = createMission();
        await db.cleanAndInsertMission(existingMission);
        return existingMission;
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

test('Não deve cadastrar uma missão sem informar o id da missão', async ({ newMissionPage, createMission }) => {
    const mission = await test.step('Gerar massa de dados válida para a nova missão', async () => {
        return createMission();
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

test('Não deve cadastrar uma missão passando o formato inválido no id da missão', async ({ newMissionPage, createMission }) => {
    const mission = await test.step('Gerar massa de dados válida para a nova missão', async () => {
        return createMission();
    })

    await test.step('Preencher o formulário da missão com o formato inválido no id da missão', async () => {
        await newMissionPage.fillMissionData('MG-12345', mission.baseId, mission.rocket, mission.departureDate, mission.price);
    })

    await test.step('Salvar missão', async () => {
        await newMissionPage.saveButton.click();
    })

    await test.step('Validar a mensagem de erro', async () => {
        await expect(newMissionPage.alert).toHaveText('Use o formato LP-0000');
    })

    await test.step('Validar que a missão não foi inserida no banco de dados', async () => {
        const missions = await db.selectMission('MG-12345');
        expect(missions).toHaveLength(0);
    })
})

test('Não deve cadastrar uma missão sem informar o foguete', async ({ newMissionPage, createMission }) => {
    const mission = await test.step('Gerar massa de dados válida para a nova missão', async () => {
        return createMission();
    })

    await test.step('Preencher o formulário da missão sem informar o foguete', async () => {
        await newMissionPage.fillMissionData(mission.id, mission.baseId, '', mission.departureDate, mission.price);
    })

    await test.step('Salvar missão', async () => {
        await newMissionPage.saveButton.click();
    })

    await test.step('Validar a mensagem de erro', async () => {
        await expect(newMissionPage.alert).toHaveText('Informe o foguete');
    })

    await test.step('Validar que a missão não foi inserida no banco de dados', async () => {
        const missions = await db.selectMission(mission.id);
        expect(missions).toHaveLength(0);
    })
})

test('Não deve cadastrar uma missão sem informar a data de partida', async ({ newMissionPage, createMission }) => {
    const mission = await test.step('Gerar massa de dados válida para a nova missão', async () => {
        return createMission();
    })

    await test.step('Preencher o formulário da missão sem informar a data de partida', async () => {
        await newMissionPage.fillMissionData(mission.id, mission.baseId, mission.rocket, '', mission.price);
    })

    await test.step('Salvar missão', async () => {
        await newMissionPage.saveButton.click();
    })

    await test.step('Validar a mensagem de erro', async () => {
        await expect(newMissionPage.alert).toHaveText('Informe uma data válida');
    })

    await test.step('Validar que a missão não foi inserida no banco de dados', async () => {
        const missions = await db.selectMission(mission.id);
        expect(missions).toHaveLength(0);
    })
})

test('Não deve cadastrar uma missão sem informar o preço', async ({ newMissionPage, createMission }) => {
    const mission = await test.step('Gerar massa de dados válida para a nova missão', async () => {
        return createMission({ price: null });
    })

    await test.step('Preencher o formulário da missão sem informar o preço', async () => {
        await newMissionPage.fillMissionData(mission.id, mission.baseId, mission.rocket, mission.departureDate, mission.price);
    })

    await test.step('Salvar missão', async () => {
        await newMissionPage.saveButton.click();
    })

    await test.step('Validar a mensagem de erro', async () => {
        await expect(newMissionPage.alert).toHaveText('Informe um preço válido');
    })

    await test.step('Validar que a missão não foi inserida no banco de dados', async () => {
        const missions = await db.selectMission(mission.id);
        expect(missions).toHaveLength(0);
    })
})

// DEFEITO (sessão exploratória 05/10/2026): o preço é livre pelo requisito, mas o sistema impõe um
// limite não documentado e exibe o erro técnico do banco "numeric field overflow" ao operador.
// Este teste valida o comportamento atual; ajustar a mensagem esperada quando o defeito for corrigido.
test('Não deve cadastrar uma missão com o preço excedendo o tamanho do campo', async ({ newMissionPage, createMission }) => {
    const mission = await test.step('Gerar massa de dados válida para a nova missão', async () => {
        return createMission({ price: 10000000000 });
    })

    await test.step('Preencher o formulário da missão com o preço excedendo o tamanho do campo', async () => {
        await newMissionPage.fillMissionData(mission.id, mission.baseId, mission.rocket, mission.departureDate, mission.price);
    })

    await test.step('Salvar missão', async () => {
        await newMissionPage.saveButton.click();
    })

    await test.step('Validar a mensagem de erro', async () => {
        await expect(newMissionPage.alert).toHaveText('numeric field overflow');
    })

    await test.step('Validar que a missão não foi inserida no banco de dados', async () => {
        const missions = await db.selectMission(mission.id);
        expect(missions).toHaveLength(0);
    })
})

test('Deve cadastrar a missão com o id em letras maiúsculas quando informado em minúsculas', async ({ newMissionPage, toast, createMission }) => {
    const mission = await test.step('Gerar massa de dados válida para a nova missão', async () => {
        return createMission();
    })

    await test.step('Preencher o formulário da missão com o id em letras minúsculas', async () => {
        await newMissionPage.fillMissionData(mission.id.toLowerCase(), mission.baseId, mission.rocket, mission.departureDate, mission.price);
    })

    await test.step('Salvar missão', async () => {
        await newMissionPage.saveButton.click();
    })

    await test.step('Validar que a nova missão foi cadastrada com sucesso', async () => {
        await expect(toast.message).toContainText('A nova missão foi adicionada ao catálogo e já está disponível para reservas.');
    })

    await test.step('Validar no banco de dados que a missão foi inserida com o id em letras maiúsculas', async () => {
        const missions = await db.selectMission(mission.id);
        expect(missions).toHaveLength(1);
    })
})

test('Não deve cadastrar uma missão já existente informando o id com espaços nas pontas', async ({ newMissionPage, createMission }) => {
    const mission = await test.step('Gerar massa de dados e garantir que a missão já exista no banco', async () => {
        const existingMission = createMission();
        await db.cleanAndInsertMission(existingMission);
        return existingMission;
    })

    await test.step('Preencher o formulário com o id já existente entre espaços e tentar salvar', async () => {
        await newMissionPage.fillMissionData(` ${mission.id} `, mission.baseId, mission.rocket, mission.departureDate, mission.price);
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

test('Não deve cadastrar uma missão informando apenas espaços no foguete', async ({ newMissionPage, createMission }) => {
    const mission = await test.step('Gerar massa de dados com o foguete preenchido apenas com espaços', async () => {
        return createMission({ rocket: '   ' });
    })

    await test.step('Preencher o formulário da missão', async () => {
        await newMissionPage.fillMissionData(mission.id, mission.baseId, mission.rocket, mission.departureDate, mission.price);
    })

    await test.step('Salvar missão', async () => {
        await newMissionPage.saveButton.click();
    })

    await test.step('Validar a mensagem de erro', async () => {
        await expect(newMissionPage.alert).toHaveText('Informe o foguete');
    })

    await test.step('Validar que a missão não foi inserida no banco de dados', async () => {
        const missions = await db.selectMission(mission.id);
        expect(missions).toHaveLength(0);
    })
})

test('Deve cadastrar uma missão com o foguete no limite de 80 caracteres', async ({ newMissionPage, toast, createMission }) => {
    const mission = await test.step('Gerar massa de dados com o foguete de 80 caracteres', async () => {
        return createMission({ rocket: 'A'.repeat(80) });
    })

    await test.step('Preencher o formulário da missão', async () => {
        await newMissionPage.fillMissionData(mission.id, mission.baseId, mission.rocket, mission.departureDate, mission.price);
    })

    await test.step('Salvar missão', async () => {
        await newMissionPage.saveButton.click();
    })

    await test.step('Validar que a nova missão foi cadastrada com sucesso', async () => {
        await expect(toast.message).toContainText('A nova missão foi adicionada ao catálogo e já está disponível para reservas.');
    })

    await test.step('Validar no banco de dados que a missão foi inserida com sucesso', async () => {
        const missions = await db.selectMission(mission.id);
        expect(missions).toHaveLength(1);
    })
})

test('Não deve cadastrar uma missão com o foguete acima de 80 caracteres', async ({ newMissionPage, createMission }) => {
    const mission = await test.step('Gerar massa de dados com o foguete de 81 caracteres', async () => {
        return createMission({ rocket: 'A'.repeat(81) });
    })

    await test.step('Preencher o formulário da missão', async () => {
        await newMissionPage.fillMissionData(mission.id, mission.baseId, mission.rocket, mission.departureDate, mission.price);
    })

    await test.step('Salvar missão', async () => {
        await newMissionPage.saveButton.click();
    })

    await test.step('Validar a mensagem de erro', async () => {
        await expect(newMissionPage.alert).toHaveText('Use no máximo 80 caracteres');
    })

    await test.step('Validar que a missão não foi inserida no banco de dados', async () => {
        const missions = await db.selectMission(mission.id);
        expect(missions).toHaveLength(0);
    })
})

for (const price of [0, -5]) {
    test(`Não deve cadastrar uma missão com o preço ${price}`, async ({ newMissionPage, createMission }) => {
        const mission = await test.step(`Gerar massa de dados com o preço ${price}`, async () => {
            return createMission({ price });
        })

        await test.step('Preencher o formulário da missão', async () => {
            await newMissionPage.fillMissionData(mission.id, mission.baseId, mission.rocket, mission.departureDate, mission.price);
        })

        await test.step('Salvar missão', async () => {
            await newMissionPage.saveButton.click();
        })

        await test.step('Validar a mensagem de erro', async () => {
            await expect(newMissionPage.alert).toHaveText('Informe um preço válido');
        })

        await test.step('Validar que a missão não foi inserida no banco de dados', async () => {
            const missions = await db.selectMission(mission.id);
            expect(missions).toHaveLength(0);
        })
    })
}

test('Deve cadastrar uma missão com o preço mínimo de 0.01', async ({ newMissionPage, toast, createMission }) => {
    const mission = await test.step('Gerar massa de dados com o preço mínimo', async () => {
        return createMission({ price: 0.01 });
    })

    await test.step('Preencher o formulário da missão', async () => {
        await newMissionPage.fillMissionData(mission.id, mission.baseId, mission.rocket, mission.departureDate, mission.price);
    })

    await test.step('Salvar missão', async () => {
        await newMissionPage.saveButton.click();
    })

    await test.step('Validar que a nova missão foi cadastrada com sucesso', async () => {
        await expect(toast.message).toContainText('A nova missão foi adicionada ao catálogo e já está disponível para reservas.');
    })

    await test.step('Validar no banco de dados que a missão foi inserida com sucesso', async () => {
        const missions = await db.selectMission(mission.id);
        expect(missions).toHaveLength(1);
    })
})

const returnDates = [
    { scenario: 'na virada do ano', departureDate: '2027-12-28', returnDate: '04 de jan. de 2028' },
    { scenario: 'em ano bissexto', departureDate: '2028-02-25', returnDate: '03 de mar. de 2028' },
];

for (const { scenario, departureDate, returnDate } of returnDates) {
    test(`Deve calcular a data de retorno 7 dias após a partida ${scenario}`, async ({ newMissionPage }) => {
        await test.step(`Informar a data de partida ${departureDate}`, async () => {
            await newMissionPage.fillDepartureDate(departureDate);
        })

        await test.step('Validar que a data de retorno é 7 dias após a data de partida', async () => {
            await expect(newMissionPage.returnDateValue).toHaveText(returnDate);
        })
    })
}

test('Deve cadastrar apenas uma missão ao clicar duas vezes em salvar', async ({ newMissionPage, toast, createMission }) => {
    const mission = await test.step('Gerar massa de dados válida para a nova missão', async () => {
        return createMission();
    })

    await test.step('Preencher o formulário da missão', async () => {
        await newMissionPage.fillMissionData(mission.id, mission.baseId, mission.rocket, mission.departureDate, mission.price);
    })

    await test.step('Clicar duas vezes em salvar missão', async () => {
        await newMissionPage.saveMissionWithDoubleClick();
    })

    await test.step('Validar que a nova missão foi cadastrada com sucesso', async () => {
        await expect(toast.message).toContainText('A nova missão foi adicionada ao catálogo e já está disponível para reservas.');
    })

    await test.step('Validar no banco de dados que só existe uma missão com o ID informado', async () => {
        const missions = await db.selectMission(mission.id);
        expect(missions).toHaveLength(1);
    })
})

// DEFEITO (sessão exploratória 05/10/2026): com partida em 31/12/9999 o retorno automático aparece
// como "Invalid Date" e a missão é salva assim, contrariando o RF-04 (exibir a data de retorno).
// Marcado com test.fail: quando o defeito for corrigido, o teste passará a falhar e o test.fail deve ser removido.
test('Não deve exibir data de retorno inválida para a partida em 31/12/9999', async ({ newMissionPage }) => {
    test.fail(true, 'Defeito conhecido: sessão exploratória de 05/10/2026 — o retorno é exibido como "Invalid Date" (RF-04)');

    await test.step('Informar a data de partida 9999-12-31', async () => {
        await newMissionPage.fillDepartureDate('9999-12-31');
    })

    await test.step('Validar que a data de retorno não é exibida como inválida', async () => {
        await expect(newMissionPage.returnDateValue).not.toHaveText('Invalid Date', { timeout: 3_000 });
    })
})
