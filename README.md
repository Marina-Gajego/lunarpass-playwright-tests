# 🌙 LunarPass Tests

![Playwright](https://img.shields.io/badge/Playwright-1.62-2EAD33?logo=playwright&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Claude Code](https://img.shields.io/badge/Claude%20Code-agentes%20de%20IA-D97757)
![Postgres](https://img.shields.io/badge/Postgres-Kysely-4169E1?logo=postgresql&logoColor=white)

Suíte de testes E2E do **LunarPass**, uma aplicação fictícia de venda de passagens para a Lua, escrita com **Playwright + TypeScript**. O repositório junta automação de testes com **agentes de IA** (Claude Code + Playwright MCP), que ajudam a explorar o app, desenhar cenários, gerar casos de teste e conduzir sessões de teste exploratório.

> O projeto começou na extensão universitária **Método ADT (AI-Driven Testing)** e continua evoluindo com novas práticas de qualidade e de IA.

## O que tem aqui

| Área | O que é |
|---|---|
| **Testes E2E** | Specs Playwright para o **Mission Control** (login e cadastro de missões), com Page Objects, fixtures e validação direto no banco |
| **Agentes e skills de IA** | Skills do Claude Code para Gherkin, casos de teste tradicionais, navegação via MCP e teste exploratório |
| **Documentação de QA** | Requisitos, especificação Gherkin, casos de teste e relatórios de sessões exploratórias |

## Arquitetura dos testes

```
├── tests/                  # Specs (*.spec.ts) e setup de autenticação
├── pages/                  # Page Objects
│   └── componentes/        # Componentes compartilhados (navbar, toast)
├── support/
│   ├── fixtures.ts         # Fixtures customizadas: Page Objects + massa de dados com limpeza automática
│   ├── db.ts               # Acesso ao Postgres com Kysely (setup e asserts no banco)
│   ├── missionData.ts      # Fábricas de massa de dados (Faker)
│   └── usersData.ts
├── docs/                   # Artefatos de QA
└── .claude/                # Agentes e skills de IA
```

Algumas decisões do projeto:

- **Page Object Model** com locators acessíveis (`getByRole`, `getByLabel`) em vez de seletores CSS frágeis.
- **Fixtures customizadas**: os testes recebem os Page Objects prontos, e a fixture `createMission` remove do banco tudo o que o teste criou, mesmo quando ele falha.
- **Login uma vez só**: o projeto `setup` autentica e salva o `storageState`, que os demais testes reaproveitam.
- **Validação em duas camadas**: além da interface, os testes conferem no banco que a missão foi gravada (ou não).
- **`test.step`** em cada etapa, o que deixa o relatório HTML fácil de ler.
- **Técnicas de design de testes**: valores-limite (foguete com 80/81 caracteres, preço mínimo de 0,01), classes de equivalência, normalização de entrada, duplo clique e datas extremas.

## Cobertura atual

| Módulo | Spec | Cenários |
|---|---|---|
| Mission Control: Login | `tests/MissionControlLogin.spec.ts` | Login válido, credenciais inválidas, campos vazios e formato de e-mail |
| Mission Control: Nova missão | `tests/MissionControlNew.spec.ts` | Cadastro, duplicidade, campos obrigatórios, limites, normalização do ID, ano bissexto, duplo clique e datas extremas |

## IA aplicada a testes

O projeto usa o [Claude Code](https://claude.com/claude-code) com o servidor [Playwright MCP](https://github.com/microsoft/playwright-mcp) (configurado em `.mcp.json`), o que permite que a IA navegue no app de verdade antes de escrever qualquer teste.

| Skill / agente | O que faz |
|---|---|
| `navegacao-playwright-mcp` | Explora o app e mapeia telas, seletores e mensagens antes de criar Page Objects |
| `navegador-playwright-mcp` (agente) | Agente de reconhecimento que só navega e relata o que viu, sem editar arquivos |
| `gherkin-qa-design` | Transforma requisitos em cenários Gherkin declarativos usando técnicas de design de testes |
| `caso-de-teste-tradicional` | Gera casos de teste tradicionais a partir de um RF, conferindo o comportamento real do app |
| `teste-exploratorio` | Conduz uma sessão exploratória (SBTM) e gera um relatório `.docx` com notas, riscos e defeitos |

Exemplos do que essas skills geraram estão em [`docs/`](docs/):

- [`docs/storefront.md`](docs/storefront.md): especificação Gherkin do Storefront
- [`docs/casos-de-teste/`](docs/casos-de-teste/): casos de teste tradicionais
- [`docs/sessoes-exploratorias/`](docs/sessoes-exploratorias/): relatórios de sessão com evidências

## Como rodar

Pré-requisitos: Node.js 20.12+, Yarn e a aplicação LunarPass rodando em `http://localhost:3000`.

```bash
yarn install
npx playwright install chromium

cp .env.example .env   # preencha DATABASE_URL

yarn test              # roda a suíte toda
yarn test:ui           # modo UI do Playwright
yarn report            # abre o último relatório HTML
```

## Próximos passos

- [ ] Cobrir o Storefront (busca, mapa de assentos, passageiros e pagamento)
- [ ] Pipeline de CI com GitHub Actions
- [ ] Testes de API
- [ ] Mutation testing
