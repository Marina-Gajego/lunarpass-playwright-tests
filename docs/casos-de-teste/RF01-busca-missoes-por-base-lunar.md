# Casos de Teste — RF-01: Buscar missões por base lunar

- **Módulo:** Storefront Lunar Pass
- **Funcionalidade:** Busca de Missões
- **Requisito:** RF-01 — Buscar missões por base lunar (`docs/storefront-rfs.md`)
- **Ambiente verificado:** `http://localhost:3000` (Storefront)
- **Data da verificação:** 2026-09-17
- **Gerado a partir de:** `docs/prompts/gerar-caso-de-teste-tradicional.md`

## Requisito (fonte)

> - Deve ser possível selecionar uma ou mais bases lunares como filtro da busca.
> - A busca pode ser iniciada tanto pelo formulário da página inicial quanto pelo destaque
>   de uma base lunar específica.
> - As missões que atendem às bases selecionadas devem ser apresentadas junto com a
>   quantidade de resultados encontrados.
> - Os resultados devem indicar quais bases estão sendo usadas como filtro.

Regra de negócio relacionada: quando nenhuma base é selecionada — ou quando todas as bases
são selecionadas —, a busca considera todas as bases.

## Observações (comportamento real x documentação)

1. **Texto de indicação do filtro com palavra duplicada.** Com 1 base selecionada, o texto
   exibido é literalmente "Base Base Lunar Alpha"; com 2 bases, "Bases Base Lunar Alpha e
   Base Lunar Aurora". O requisito só pede que "os resultados indiquem quais bases estão
   sendo usadas como filtro" — a informação está correta, mas o texto parece ter um defeito
   de composição (label "Base"/"Bases" concatenado sem separador ao nome completo da base).
   Os casos de teste abaixo documentam o texto **literal observado**; recomenda-se
   confirmar com o time de produto se esse é o texto esperado antes de tratar como bug.
2. **Massa de dados do ambiente verificado:** só as bases Alpha (1 missão) e Aurora (39
   missões) têm missões cadastradas; Orion e Selene não retornam nenhuma missão. Os dados
   de teste abaixo foram escolhidos considerando esse estado; se a massa de dados mudar, os
   valores de quantidade de resultados devem ser revistos.
3. Sem seleção de base e com **todas** as bases marcadas explicitamente, o comportamento é
   idêntico (mesma URL `/missions`, mesma contagem) — confirma a regra de negócio de que
   "nenhuma selecionada" e "todas selecionadas" são equivalentes.
4. Fora do escopo de RF-01, mas notado durante a verificação: o dropdown de refinar bases
   na página de resultados perde o nome acessível dos itens de menu (`menuitemcheckbox`)
   já marcados — relevante para quem for escrever a automação, não para este caso de teste.

## RF01-TC-01 — Buscar missões selecionando uma base pelo formulário da página inicial

| Campo | Detalhe |
|---|---|
| **Requisito relacionado** | RF-01, bullets 1, 3 e 4 |
| **Pré-condições** | Viajante está na página inicial do Storefront (`/`); catálogo contém ao menos 1 missão para a base selecionada. |
| **Dados de teste** | Base lunar: **Base Lunar Alpha** |
| **Passos** | 1. Acessar a página inicial (`/`).<br>2. No formulário de busca, marcar o checkbox "Base Lunar Alpha".<br>3. Clicar no botão "Buscar missões". |
| **Resultado esperado** | 1. O sistema navega para a página de resultados (`/missions?base=alpha`).<br>2. O título da página exibe a quantidade de resultados encontrados, ex.: "1 missão disponível".<br>3. É exibida a indicação de que o filtro aplicado é a Base Lunar Alpha (texto "Base Base Lunar Alpha").<br>4. A lista de resultados contém apenas missões com destino à Base Lunar Alpha. |
| **Prioridade** | Alta |
| **Tipo** | Funcional Positivo |

## RF01-TC-02 — Buscar missões pelo destaque de uma base lunar específica

| Campo | Detalhe |
|---|---|
| **Requisito relacionado** | RF-01, bullets 2, 3 e 4 |
| **Pré-condições** | Viajante está na página inicial do Storefront (`/`); catálogo contém ao menos 1 missão para a base selecionada. |
| **Dados de teste** | Base lunar: **Base Lunar Aurora** |
| **Passos** | 1. Acessar a página inicial (`/`).<br>2. Rolar até a seção "Bases lunares" (destaques de base).<br>3. Clicar no card/link "Ver missões" da Base Lunar Aurora, sem usar o formulário de busca. |
| **Resultado esperado** | 1. O sistema navega diretamente para a página de resultados filtrada por Aurora (`/missions?base=aurora`), sem passar pelo formulário.<br>2. O título exibe a quantidade de resultados encontrados, ex.: "39 missões disponíveis".<br>3. É exibida a indicação de que o filtro aplicado é a Base Lunar Aurora (texto "Base Base Lunar Aurora").<br>4. A lista de resultados contém apenas missões com destino à Base Lunar Aurora. |
| **Prioridade** | Alta |
| **Tipo** | Funcional Positivo |

## RF01-TC-03 — Buscar missões selecionando mais de uma base pelo formulário

| Campo | Detalhe |
|---|---|
| **Requisito relacionado** | RF-01, bullets 1, 3 e 4 |
| **Pré-condições** | Viajante está na página inicial do Storefront (`/`); catálogo contém missões para ambas as bases selecionadas. |
| **Dados de teste** | Bases lunares: **Base Lunar Alpha** e **Base Lunar Aurora** |
| **Passos** | 1. Acessar a página inicial (`/`).<br>2. No formulário de busca, marcar os checkboxes "Base Lunar Alpha" e "Base Lunar Aurora".<br>3. Clicar no botão "Buscar missões". |
| **Resultado esperado** | 1. O sistema navega para a página de resultados com as duas bases no filtro (`/missions?base=alpha,aurora`).<br>2. O título exibe a soma de resultados das duas bases, ex.: "40 missões disponíveis".<br>3. É exibida a indicação de que o filtro aplicado são as duas bases (texto "Bases Base Lunar Alpha e Base Lunar Aurora").<br>4. A lista de resultados contém missões de ambas as bases selecionadas (Alpha e Aurora), e nenhuma de outra base. |
| **Prioridade** | Alta |
| **Tipo** | Funcional Positivo |

## RF01-TC-04 — Buscar sem selecionar nenhuma base considera todas as bases

| Campo | Detalhe |
|---|---|
| **Requisito relacionado** | RF-01, bullet 3; regra de negócio "nenhuma base selecionada = todas as bases" |
| **Pré-condições** | Viajante está na página inicial do Storefront (`/`); catálogo contém missões cadastradas. |
| **Dados de teste** | Nenhuma base marcada |
| **Passos** | 1. Acessar a página inicial (`/`).<br>2. Não marcar nenhum checkbox de base lunar.<br>3. Clicar no botão "Buscar missões". |
| **Resultado esperado** | 1. O sistema navega para a página de resultados sem filtro de base na URL (`/missions`).<br>2. O título exibe a quantidade total de missões do catálogo, ex.: "40 missões disponíveis".<br>3. Nenhuma indicação de filtro de base é exibida (não há filtro ativo).<br>4. A lista de resultados contém missões de todas as bases com missões cadastradas. |
| **Prioridade** | Média |
| **Tipo** | Funcional Positivo |

## RF01-TC-05 — Buscar com todas as bases marcadas explicitamente equivale a nenhum filtro

| Campo | Detalhe |
|---|---|
| **Requisito relacionado** | RF-01, bullet 3; regra de negócio "todas as bases selecionadas = todas as bases" |
| **Pré-condições** | Viajante está na página inicial do Storefront (`/`); catálogo contém missões cadastradas. |
| **Dados de teste** | Bases lunares: **Base Lunar Alpha**, **Base Lunar Orion**, **Base Lunar Aurora** e **Base Lunar Selene** (todas marcadas) |
| **Passos** | 1. Acessar a página inicial (`/`).<br>2. Marcar os checkboxes das 4 bases lunares.<br>3. Clicar no botão "Buscar missões". |
| **Resultado esperado** | 1. O sistema navega para a página de resultados sem filtro de base na URL (`/missions`), comportamento idêntico ao de não selecionar nenhuma base.<br>2. O título exibe a mesma quantidade total de missões do catálogo, ex.: "40 missões disponíveis".<br>3. A lista de resultados é idêntica à obtida em RF01-TC-04. |
| **Prioridade** | Baixa |
| **Tipo** | Borda |

## RF01-TC-06 — Buscar por bases sem missões cadastradas retorna zero resultados com filtro indicado

| Campo | Detalhe |
|---|---|
| **Requisito relacionado** | RF-01, bullets 1, 3 e 4 (comportamento de contagem/indicação de filtro no cenário de menor volume); relacionado também a RF-05 (ausência de resultados) |
| **Pré-condições** | Viajante está na página inicial do Storefront (`/`); bases selecionadas não possuem missões cadastradas no catálogo atual. |
| **Dados de teste** | Bases lunares: **Base Lunar Orion** e **Base Lunar Selene** |
| **Passos** | 1. Acessar a página inicial (`/`).<br>2. No formulário de busca, marcar os checkboxes "Base Lunar Orion" e "Base Lunar Selene".<br>3. Clicar no botão "Buscar missões". |
| **Resultado esperado** | 1. O sistema navega para a página de resultados com as duas bases no filtro.<br>2. O título exibe "0 missões disponíveis".<br>3. É exibido o aviso "Nenhuma missão programada com esses filtros." e a orientação "Selecione outras bases lunares para encontrar mais janelas de lançamento." (comportamento de RF-05).<br>4. É oferecido o atalho "Ver todas as janelas", que leva a `/missions` sem filtro. |
| **Prioridade** | Média |
| **Tipo** | Funcional Negativo |
