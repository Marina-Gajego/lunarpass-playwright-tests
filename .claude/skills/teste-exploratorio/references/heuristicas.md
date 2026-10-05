# Caixa de ferramentas de heurísticas

Heurísticas são **atalhos falíveis** para gerar ideias de teste — não são checklists nem
roteiros. Pegue uma quando estiver sem ideia, quando o charter pedir, ou quando algo
estranho aparecer e você quiser cutucar de outro ângulo. Largue-a quando parar de render.

## Para escolher onde olhar — SFDIPOT (James Bach, "San Francisco Depot")
- **Estrutura**: do que a tela/feature é feita (campos, componentes, URLs, rotas).
- **Função**: o que ela faz; o que deveria fazer e o que faz além disso.
- **Dados**: o que entra, sai, é salvo, é calculado; tamanhos, formatos, vazios.
- **Interfaces**: UI, API (veja `browser_network_requests`), console, URL, teclado.
- **Plataforma**: navegador, tamanho de tela (`browser_resize`), abas múltiplas.
- **Operações**: como pessoas reais usam — com pressa, distraídas, voltando depois.
- **Tempo**: datas, expiração, ordem dos eventos, lentidão, concorrência.

## Para perceber que algo está errado — oráculos (FEW HICCUPPS, Michael Bolton)
Um comportamento é suspeito quando é inconsistente com: a **História** do produto, a
**Imagem** que a empresa quer passar, **Produtos Comparáveis**, as **Reivindicações**
(docs, RFs, labels, mensagens), as **Expectativas do Usuário**, o **Próprio Produto**
(outra tela faz diferente), o **Propósito**, **Padrões/Normas**, **Explicabilidade**
(você consegue explicar por que fez isso?), o **Mundo** real.
Use isso para justificar um defeito: "inconsistente com X porque…".

## Para gerar variações
- **Abordagem contrária / "faça o que não deveria"**: viole a regra de negócio de propósito
  (comprar para missão esgotada, mesmo assento duas vezes, origem = destino).
- **Goldilocks**: pequeno demais, grande demais, na medida — e exatamente no limite.
- **Zero, um, muitos**: nenhum item, um item, o máximo, o máximo + 1.
- **Nunca e sempre**: o que o sistema nunca deveria permitir? O que sempre deveria acontecer?
- **CRUD**: criar, ler, atualizar, apagar — e fazer isso fora de ordem.
- **Interrupções**: voltar (`browser_navigate_back`), recarregar, fechar e reabrir aba,
  clicar duas vezes rápido, abandonar no meio do fluxo e voltar pela URL.
- **Concorrência**: duas abas (`browser_tabs`) disputando o mesmo recurso.
- **Dados hostis/estranhos**: espaços nas pontas, acentos, emoji, só espaços, texto
  colado gigante, caracteres especiais, maiúsculas/minúsculas, HTML/script como texto.
- **Personas**: o viajante apressado, o que erra tudo, o que conhece o sistema demais,
  o que usa só teclado.
- **Siga o dinheiro / siga o dado**: o valor que entrou aparece igual em todas as telas
  seguintes? Persistiu depois de recarregar? O que foi cadastrado no Mission Control chega
  igual ao Storefront? O que foi escolhido (assentos, passageiros, total) chega igual ao
  pagamento e ao ticket?
- **Dica x realidade**: compare o que a tela *promete* (placeholder, dica de formato,
  `min`/`step`/`maxLength`, máscara, mensagem de erro) com o que ela realmente aceita.
  Ex.: a dica de um campo mostra um formato fixo, mas valores fora dele passam.
- **Datas no limite do calendário**: ontem, hoje, passado distante, ano 9999, virada de
  mês e de ano, 29 de fevereiro, idade mínima/máxima em data de nascimento, validade de
  cartão. Confira também os valores *derivados* da data (retorno, duração, idade), que
  costumam quebrar antes da própria data.
- **Números no limite do armazenamento**: 0, mínimo, mínimo − 1 casa decimal, casas
  decimais a mais, notação científica (`1e3`), um valor enorme. Valem para preços,
  quantidades, documentos e cartões. Erros técnicos do banco que vazam para a tela (ex.:
  "numeric field overflow") aparecem aqui.
- **Cliente x servidor**: o que a tela bloqueia, o servidor também bloqueia? E sem sessão
  ativa? Veja `tecnicas-playwright.md`.

## Para estruturar o charter
"**Explore** <alvo> **com** <recursos/heurística/técnica> **para descobrir** <informação>"
(Elisabeth Hendrickson, *Explore It!*). Bons charters são focados o suficiente para guiar
e abertos o suficiente para permitir surpresa.
