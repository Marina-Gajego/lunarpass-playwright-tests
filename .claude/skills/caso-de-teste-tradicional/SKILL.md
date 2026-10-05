---
name: caso-de-teste-tradicional
description: Gera casos de teste tradicionais (documento Markdown com ID, pré-condições, dados, passos e resultado esperado) a partir de um requisito funcional (RF) de docs/backup/storefront-rfs.md do Storefront Lunar Pass, confirmando antes o comportamento real do app via Playwright MCP. Use SEMPRE que o usuário pedir "gera o caso de teste do RF-0X", "casos de teste tradicionais", "caso de teste manual", "documentar testes do requisito", "escrever casos de teste para a funcionalidade X" ou algo parecido, mesmo que não cite a palavra "tradicional". Não use para specs Playwright automatizadas nem para cenários Gherkin (para isso há a skill gherkin-qa-design).
---

# Caso de teste tradicional a partir de um RF

Produz um documento de casos de teste no formato tradicional para um requisito funcional do
Storefront Lunar Pass. O documento serve de base para os casos dos demais RFs, então
estrutura e precisão importam mais que volume.

O ponto central é **não escrever a partir da documentação sozinha**: o texto do RF pode
divergir do app real (já aconteceu, ex.: texto de filtro com palavra duplicada). Por isso o
fluxo sempre passa por navegar o app antes de escrever.

## Entradas

- `RF_ID` e `RF_TITULO` (ex.: `RF-01`, "Buscar missões por base lunar") e a
  `FUNCIONALIDADE`, exatamente como aparecem em `docs/backup/storefront-rfs.md`. Se o usuário
  passar só o número do RF, busque o resto no arquivo.
- O app deve estar rodando em `http://localhost:3000` e o servidor MCP `playwright`
  conectado. Se não estiver, peça ao usuário para subir/conectar; não simule a navegação
  com curl/fetch.

## Fluxo

1. **Ler o requisito.** Em `docs/backup/storefront-rfs.md`, extraia a história de usuário da
   funcionalidade, as regras de negócio relevantes ao RF e os bullets exatos do requisito.

2. **Navegar o app real.** Siga a skill `navegacao-playwright-mcp` (ou o agente
   `navegador-playwright-mcp`) e execute o fluxo do RF passo a passo: caminho feliz mais as
   variações das regras de negócio (seleção única/múltipla, ausência de seleção, bordas).
   Anote nomes acessíveis, textos literais de mensagens, contadores, estados (loading,
   vazio, esgotado, desabilitado) e a URL de cada tela. Os textos literais entram no
   resultado esperado, então copie-os exatamente.

3. **Comparar com a documentação.** Se o app divergir do texto do RF, registre a divergência
   explicitamente no documento e avise no chat. Não decida qual lado está "certo" e não
   corrija em silêncio: a decisão é do time de produto, e os casos documentam o
   comportamento literal observado.

4. **Escrever o documento** em `docs/casos-de-teste/{RF_ID sem hífen}-{slug-do-titulo}.md`
   (ex.: `RF01-busca-missoes-por-base-lunar.md`), com um caso por critério observável (um
   cenário positivo por bullet, mais bordas e negativos vindos das regras de negócio). Use
   `docs/casos-de-teste/RF01-busca-missoes-por-base-lunar.md` como modelo de formato.

5. **Fechar o navegador** (`browser_close`) e resumir no chat: quantidade de casos criados,
   caminho do arquivo e divergências relevantes.

## Formato do documento

Cabeçalho no topo: módulo, funcionalidade, requisito, ambiente verificado, data da
verificação e origem. Depois, a fonte do requisito (bullets citados), as regras de negócio
relacionadas e uma seção **Observações** com as divergências do passo 3 (ou "Nenhuma
divergência encontrada"). Inclua ali também a massa de dados do ambiente que condiciona as
quantidades esperadas (ex.: quais bases têm missões), porque os números mudam se ela mudar.

Cada caso é uma tabela com estes campos:

- **ID** no título: `RFxx-TC-01`, `RFxx-TC-02`... e um título curto e específico
- **Requisito relacionado** (RF e bullet/regra correspondente)
- **Pré-condições**
- **Dados de teste** (valores concretos)
- **Passos** (numerados, ações do usuário)
- **Resultado esperado** (observável, com texto literal de mensagens e rota)
- **Prioridade** (Alta/Média/Baixa)
- **Tipo** (Funcional Positivo / Funcional Negativo / Borda)

## Cuidados

- Casos tradicionais descrevem o que uma pessoa faz e vê; não escreva código Playwright
  nem seletores no documento.
- Não invente regra de negócio: tudo no resultado esperado vem da documentação ou da
  observação do app. O que for só suposição vai em Observações.
- Achados fora do escopo do RF (ex.: problema de acessibilidade útil para quem for
  automatizar) entram em Observações, marcados como fora de escopo.
