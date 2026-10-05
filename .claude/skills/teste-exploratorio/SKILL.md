---
name: teste-exploratorio
description: Conduz uma sessão de teste exploratório (Session-Based Test Management) no app Lunar Pass, navegando de verdade via Playwright MCP com mentalidade de testador exploratório, e entrega um Relatório de Sessão em .docx no padrão do projeto (charter Explore/Com/Para descobrir, tamanho da sessão, notas de Informação e Risco, defeitos e perguntas). Use SEMPRE que o usuário pedir "teste exploratório", "sessão exploratória", "explora a tela/fluxo X procurando problemas", "caça bugs", "testa livremente", "SBTM", "charter", "relatório de sessão", ou quiser que a IA investigue o app atrás de defeitos e riscos — mesmo sem dizer "exploratório". Não use para apenas mapear seletores para Page Objects (use navegacao-playwright-mcp) nem para escrever casos de teste/Gherkin.
---

# Teste exploratório com IA

Você vai fazer o que um bom testador exploratório faz: **aprender sobre o produto,
desenhar testes e executá-los ao mesmo tempo**, deixando o resultado de cada ação decidir
a próxima. Não existe roteiro. O valor está em notar o que ninguém escreveu num requisito.

Esta skill não é uma lista de regras — é uma mentalidade. Use seu julgamento.
Liberdade, porém, não é aleatoriedade: o que separa o exploratório do ad-hoc é ter um
propósito (o charter), raciocinar sobre o que testar a seguir e registrar o que aprendeu.

## A mentalidade

- **Curiosidade acima de cobertura.** Você não está "passando" por telas; está fazendo
  perguntas ao produto. "O que acontece se…?" é o motor da sessão.
- **Aprender → desenhar → executar → observar → aprender.** Cada resposta do app sugere o
  próximo experimento. Se algo pareceu estranho, puxe esse fio — é ali que costuma estar o bug.
- **Desconfie do caminho feliz.** Ele quase sempre funciona. Os problemas moram nas bordas,
  nas interrupções, nas combinações, nos dados estranhos e nas regras ditas pela metade.
- **Você é o oráculo.** Não há resultado esperado escrito. Julgue se algo está errado
  comparando com a documentação (`docs/backup/storefront-rfs.md`, com os RFs, e
  `docs/storefront.md`, com a análise de regras), com o resto do próprio app, com o que um
  usuário esperaria e com o bom senso. Diga sempre *por que* algo te parece errado.
  Quando a área explorada não tiver requisitos próprios, procure as regras e premissas de
  outras áreas que dependem dela: elas mostram o que essa área precisa garantir.
- **Siga o dado até o outro lado.** O dado que entra numa tela é usado em outras: no
  backoffice e na vitrine, nas etapas seguintes de um fluxo, no ticket, depois de
  recarregar. Um valor estranho que uma tela aceita costuma virar dano real só na outra
  ponta. Vá conferir onde ele aparece.
- **Separe a tela do servidor.** Validar só na interface não protege o dado. Quando a
  tela bloquear algo, vale perguntar se o servidor também bloqueia (técnica em
  `references/tecnicas-playwright.md`).
- **O charter guia, não aprisiona.** Ele dá foco; se aparecer algo importante fora dele,
  anote e decida se vale desviar. Desvios conscientes fazem parte.
- **Observe mais do que a tela.** Console (`browser_console_messages`), requisições de rede
  (`browser_network_requests`), URL, o que persiste após recarregar, o que muda em outra aba.
  Em telas com listas grandes o `browser_snapshot` fica enorme; um `browser_evaluate` que
  resume o que interessa (textos dos cards, `aria-disabled`, atributos `data-*`) poupa contexto
  e ainda revela coisas que a tela não mostra.
- **Aprenda à mão, varra em lote.** Faça os primeiros experimentos passo a passo para
  entender a tela. Depois, para testar muitas variações de dados, use um lote com
  `browser_run_code_unsafe` (um `goto` limpo por caso, devolvendo só o resultado). É
  muito mais rápido e gasta menos contexto. Veja `references/tecnicas-playwright.md`.
- **Anote enquanto testa**, não no fim — notas frescas guardam detalhes que somem da memória.

Quando faltar ideia, consulte `references/heuristicas.md` (SFDIPOT, FEW HICCUPPS,
Goldilocks, abordagem contrária, interrupções, concorrência, datas e números no limite…).
São ferramentas, não etapas. Para o *como* fazer no navegador (lotes de experimentos, ler
atributos, testar o servidor por trás da tela, evidências), veja
`references/tecnicas-playwright.md`.

## Como uma sessão acontece

### 1. Charter
Se o usuário trouxe um charter, use-o. Se trouxe só um alvo ("explora o checkout"), monte
um no formato **Explore** <alvo> **Com** <heurística/recurso/foco> **Para descobrir**
<informação> e siga em frente, sem esperar aprovação, a menos que o pedido esteja realmente
vago. Se não trouxe nada, escolha uma área com risco. O charter aparece no relatório e no
resumo final, então quem pediu sempre vê qual foi o foco.

Sobre o timebox: você executa ações muito mais rápido que uma pessoa, então "10 minutos"
pedidos pelo usuário indicam mais a **profundidade** desejada (uma sessão curta e focada)
do que um cronômetro. Sem indicação, pense numa sessão de 20–30 minutos humanos. Registre o
horário de início e de fim (`date "+%d/%m/%Y %I:%M %p %s"`; o `%s` facilita calcular a
diferença) e, no relatório, informe a duração real de relógio. Se quiser,
acrescente a quantidade de experimentos (ex.: "4 minutos (≈30 experimentos)").

### 2. Ambiente
O app roda em `http://localhost:3000` (baseURL de `playwright.config.ts`) e precisa estar
no ar — se não estiver, peça para o usuário subir. A navegação é pelas ferramentas
`browser_*` do Playwright MCP; a skill `navegacao-playwright-mcp` tem os detalhes práticos.
O Mission Control pede login. Use as credenciais que o usuário passar; se ele não passar
nenhuma, use o usuário de teste de `support/usersData.ts`.
Ler o código ou os docs para se contextualizar é ótimo; o que conta, porém, é o que você
**observa no navegador**.

A massa de dados é compartilhada com as suítes E2E, então pode haver muitas missões
repetidas criadas por testes, e pode faltar o estado que você quer investigar (ex.:
nenhuma missão esgotada). Se o charter depender de um estado específico, você pode criá-lo
pelo próprio Mission Control. Se não der, registre a lacuna como (R) ou pergunta.

Tudo o que você cria (missões, reservas, passageiros…) fica nesse banco compartilhado e
pode aparecer para outras pessoas e outras suítes. Use dados fáceis de reconhecer como seus
(uma faixa de IDs, um prefixo nos nomes) e vá anotando cada registro criado. Ao final,
liste esses registros numa nota (R) do relatório e **pergunte** ao usuário se quer
apagá-los. Não apague por conta própria: pode haver dados de outras pessoas parecidos com
os seus.

### 3. Explorar
Navegue, tente, varie, interrompa, repita com dados diferentes. Use `browser_snapshot`
para ler o estado da tela; tire `browser_take_screenshot` quando algo for evidência de
defeito (salve na pasta da sessão, veja abaixo). Vá registrando, num rascunho, notas
curtas classificadas como:
- **(I) Informação** — o que você fez, aprendeu ou percebeu, inclusive o que funcionou bem
  e o que te levou ao próximo experimento.
- **(R) Risco** — algo que não é (ainda) um defeito comprovado, mas pode causar dano ao
  usuário/negócio; explique a consequência.

Quando bater no timebox, encerre — sessão é tempo fechado. Feche o navegador.

### 4. Classificar o que achou
- **Defeito**: comportamento que você consegue reproduzir e que **contraria o documento de
  requisitos** (`docs/backup/storefront-rfs.md`). Cite a regra ou o RF violado. Escreva de
  modo que alguém reproduza: onde, o que fez (com os dados usados), o que aconteceu, por
  que está errado. Mencione o screenshot se houver.
- **Melhoria**: algo que parece ruim pelo bom senso, pela consistência do app ou pelo que
  o usuário esperaria, mas que nenhum requisito proíbe. No projeto, isso **não é defeito**.
  Registre como nota (R) começando com "Melhoria:" e explique o impacto. Se o requisito
  deixa o ponto em aberto (ex.: "Premissas e pontos em aberto"), diga isso.
- **Pergunta**: dúvidas sobre regra de negócio que só alguém do produto responde
  ("Deveria ser possível…?"). Ambiguidade não é defeito — vira pergunta. Antes de perguntar,
  confira se o documento de requisitos já responde. Se o requisito não fala do assunto, a
  resposta padrão é "não há restrição", então só pergunte quando a dúvida tiver impacto
  real.

Se o usuário responder às perguntas depois da sessão, atualize o `sessao.json`: adicione
uma nota (I) com as respostas, marque cada pergunta como "Respondida — …" (mantendo o que
ainda estiver em aberto), reclassifique os achados e gere o .docx de novo.

### 5. Relatório
Monte um JSON e gere o .docx com o script incluso (só usa a biblioteca padrão do Python):

```bash
python3 .claude/skills/teste-exploratorio/scripts/gerar_relatorio.py \
  docs/sessoes-exploratorias/<AAAA-MM-DD>-<modulo>/sessao.json \
  docs/sessoes-exploratorias/<AAAA-MM-DD>-<modulo>/relatorio-sessao.docx
```

Formato do JSON (o script usa `assets/modelo-relatorio-sessao.docx`, mantendo o visual do
padrão do projeto):

```json
{
  "data_hora_inicio": "5 de outubro de 2026 08:15 PM",
  "testador": "Claude (IA)",
  "modulo": "Storefront — Seleção de assentos",
  "charter": {
    "explore": "a seleção de assentos na cabine",
    "com": "a heurística de interrupções e concorrência entre abas",
    "para_descobrir": "se o app evita que o mesmo assento seja vendido duas vezes"
  },
  "duracao": "25 minutos",
  "notas": [
    {"tipo": "I", "texto": "Selecionei A1 e recarreguei a página; a seleção se perdeu sem aviso."},
    {"tipo": "R", "texto": "Se o viajante recarregar no meio do fluxo, pode achar que já reservou o assento."}
  ],
  "defeitos": ["Ao clicar duas vezes rápido em 'Pagar' com o cartão ... foram criadas duas reservas ..."],
  "perguntas": ["Um assento selecionado deveria ficar bloqueado para outros viajantes por quanto tempo?"]
}
```

Escreva as notas em primeira pessoa e linguagem natural, como no exemplo do padrão — elas
contam a história da sessão. A data segue o formato "5 de outubro de 2026 08:15 PM" e a
duração é o tempo real que você explorou. O testador é "Claude (IA)", a menos que o
usuário peça outro nome.

Screenshots: o Playwright MCP só grava dentro do projeto, na pasta `.playwright-mcp/`
(snapshots e logs de console também vão para lá). Salve os screenshots numerados
(`01-…png`) durante a sessão, cite o número no defeito e confira a imagem antes de
citá-la. Ao final, mova os `.png` para a pasta da sessão e apague `.playwright-mcp/`, para
não deixar lixo não rastreado no git. O .docx não embute imagens, então elas ficam ao lado
dele, na pasta da sessão.

Achados fora do charter entram como nota (I) e, se forem defeitos, na lista de defeitos com
o prefixo "(Fora do charter)", para quem lê saber que não foram o foco.

### 6. Devolver ao usuário
Diga onde está o .docx e faça um resumo curto: o charter, quantos defeitos/riscos/perguntas,
e os achados mais relevantes. Avise se ficaram dados de teste no banco e ofereça a
limpeza. Se surgiram ideias de sessões futuras (áreas que mereciam mais
tempo), sugira 1–3 próximos charters.
