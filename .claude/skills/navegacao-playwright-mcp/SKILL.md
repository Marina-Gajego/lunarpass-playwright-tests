---
name: navegacao-playwright-mcp
description: Use esta skill para explorar/reconhecer o Storefront Lunar Pass em um navegador real via Playwright MCP antes de escrever ou atualizar testes E2E. Aciona quando o usuário pedir para "navegar", "explorar", "mapear fluxo", "investigar a tela", "ver como funciona na prática" ou quando as regras de negócio em docs/backup/storefront-rfs.md precisarem ser confirmadas contra o comportamento real do app (seletores, mensagens, estados) antes de criar Page Objects ou specs.
---

# Navegação com Playwright MCP

Reconhecimento exploratório do app Lunar Pass usando as ferramentas de navegador do
Playwright MCP (`browser_navigate`, `browser_click`, `browser_snapshot`, `browser_type`,
etc.), separado da suíte de testes automatizados em `tests/` (que usa `@playwright/test`).
Use esta skill para **observar o comportamento real da aplicação** e traduzir o que foi
visto em Page Objects (`pages/`) e specs (`tests/`) confiáveis — nunca para escrever
asserts de teste diretamente pelo MCP.

## Quando usar

- Antes de criar/alterar um Page Object, para confirmar os seletores reais da tela
  (roles, labels, testids) em vez de adivinhar.
- Antes de escrever uma spec nova, para percorrer o fluxo manualmente e entender estados,
  mensagens de erro e transições de tela.
- Quando uma regra de negócio em `docs/backup/storefront-rfs.md` estiver ambígua e precisar ser
  validada contra o comportamento real do app rodando em `http://localhost:3000`.
- Para investigar uma spec que está falhando, reproduzindo o fluxo passo a passo no
  navegador e comparando com o que o Page Object espera.

## Pré-requisitos

- O app precisa estar rodando localmente na `baseURL` configurada em
  `playwright.config.ts` (`http://localhost:3000`). Se não estiver, peça ao usuário para
  subir o app antes de navegar.
- O servidor MCP `playwright` (`.mcp.json` na raiz do projeto) precisa estar conectado.
  Se as ferramentas `browser_*` não estiverem disponíveis, avise o usuário e peça para
  aprovar/conectar o servidor MCP.

## Como navegar

1. **Abrir a tela de interesse** com `browser_navigate` para a URL relativa (ex.:
   `/mission-control`, `/`), sempre a partir da `baseURL` do projeto.
2. **Capturar o estado da página** com `browser_snapshot` (preferível a screenshot) para
   ler a árvore de acessibilidade — é dali que vêm os seletores idiomáticos já usados no
   projeto: `getByRole`, `getByLabel`, `getByTestId` (ver `pages/*.page.ts` para o padrão).
3. **Interagir passo a passo** (`browser_click`, `browser_type`, `browser_select_option`,
   etc.) reproduzindo o fluxo do usuário descrito em `docs/backup/storefront-rfs.md`, um passo por
   vez, conferindo o snapshot após cada ação relevante.
4. **Anotar o que foi observado**: nome acessível de cada elemento, mensagens de
   erro/alerta exatas (texto literal, para usar em `expect(...).toHaveText(...)`), e
   qualquer estado assíncrono (loading, desabilitado, esgotado).
5. **Fechar o navegador** (`browser_close`) ao final da investigação.

## Depois de navegar

- Traduza os seletores observados para Page Objects em `pages/`, seguindo o padrão já
  existente (locators tipados no construtor, métodos de ação como `fillMissionData`,
  `saveMission`) — veja `pages/missionControlNew.page.ts` como referência.
- Traduza o fluxo percorrido para uma spec em `tests/`, usando `test.step` para cada etapa
  e fixtures de `support/fixtures.ts`, seguindo o padrão de `tests/MissionControlLogin.spec.ts`.
- Nunca deixe interações do MCP substituindo a suíte automatizada: o MCP é para
  reconhecimento humano-no-loop, o teste de verdade continua sendo `npx playwright test`.

## Limites

- Não navegue para ambientes de produção ou URLs fora da `baseURL` do projeto sem
  confirmação explícita do usuário.
- Não use dados de pagamento reais nem preencha formulários com dados sensíveis reais —
  use os geradores de `support/missionData.ts` / `support/usersData.ts` como referência de
  dados de teste.
- Se as ferramentas `browser_*` do MCP não aparecerem disponíveis, não tente simular a
  navegação por outros meios (ex.: fetch/curl); informe o usuário que o servidor MCP
  `playwright` precisa estar conectado.
