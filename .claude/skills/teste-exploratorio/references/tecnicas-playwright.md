# Técnicas práticas com Playwright MCP numa sessão exploratória

Truques que funcionaram na prática no Lunar Pass. Use quando servirem e adapte quando
precisar.

## Rodar vários experimentos de uma vez (`browser_run_code_unsafe`)

Fazer um clique por chamada é ótimo para *aprender* uma tela nova. Depois que você já
entendeu a tela, testar variações uma a uma (limites, formatos, dados hostis, combinações de
filtros, quantidades) gasta contexto à toa. Monte um lote: cada caso começa com um `goto`
limpo, aplica a variação, age e devolve só o que interessa (mensagem, URL final, valor
calculado, se um botão ficou habilitado).

Serve para qualquer tela: um formulário (cadastro, passageiros, pagamento), uma busca com
filtros, um mapa de seleção. O esqueleto é sempre o mesmo:

```js
async (page) => {
  const URL = 'http://localhost:3000/<rota-da-tela>';
  const base = { /* valores válidos de referência */ };
  const cases = [ { /* só o que muda neste caso */ } ];
  const out = [];
  page.on('dialog', d => { out.push({ DIALOG: d.message() }); d.dismiss(); });
  for (const c0 of cases) {
    const c = { ...base, ...c0 };
    await page.goto(URL);
    // aplicar c: page.fill / selectOption / click, com os seletores que você já descobriu
    // agir: enviar, buscar, avançar
    await page.waitForTimeout(1200);
    const body = await page.locator('body').innerText();
    out.push({ c: c0, url: page.url(), trecho: body.slice(-300) });
  }
  return out;
}
```

Dicas:
- Se o caso cria um registro, use um identificador único por caso. Um caso que "deveria
  falhar" pode ser salvo, e aí o próximo falha por duplicidade, o que confunde a leitura
  do resultado.
- Recorte o texto devolvido no trecho que interessa (ex.: entre o último campo e os
  botões) para a resposta não crescer à toa.
- Leia o texto de `body` e não de `main`: nem toda página tem `<main>`, e o locator
  fica esperando 30 s até dar timeout.
- Primeiro explore à mão; o lote serve para varrer variações depois que você já sabe o que
  procurar. Se algo surpreender, volte para o passo a passo e puxe o fio.

## Ler o que a tela não mostra

- Atributos do formulário revelam as regras do lado do cliente (`required`, `min`, `step`,
  `maxLength`, opções do select):
  `[...document.querySelectorAll('input,select')].map(e => ({name:e.name, type:e.type, req:e.required, min:e.min, step:e.step, maxl:e.maxLength}))`.
  Compare com o que o app realmente aceita: diferenças entre as duas coisas costumam
  esconder defeitos (ex.: `step=0.01`, mas 100.999 é aceito e arredondado).
- Antes de inventar parâmetros de URL, colete os links reais da página
  (`a[href]`) para descobrir os nomes e valores que o app usa. Inventar parâmetros de
  propósito é uma boa abordagem contrária, mas saiba quando está fazendo isso.
- Fique de olho no evento **Events → New console entries** nas respostas do MCP. Os logs
  vão para `.playwright-mcp/console-*.log`; leia o arquivo (`cut -c1-300`), porque é ali
  que aparecem 500s e exceções que a tela engole.

## Testar por trás da interface (servidor x cliente)

A validação da tela pode ser só cosmética. Para saber se o servidor também valida:
1. Capture a requisição real de uma ação válida (salvar, reservar, pagar):
   `page.on('request', r => r.method() !== 'GET' && log.push({u: r.url(), body: r.postData()}))`.
   O Lunar Pass usa *server functions* do TanStack (`POST /_serverFn/<hash>`) com corpo
   serializado. Cada ação tem o seu hash. Copie o formato e troque só os valores.
2. Reenvie com `fetch` dentro de `page.evaluate`, que já leva os cookies da sessão, usando
   dados que a tela não deixaria passar: opção que não existe no select, campo vazio,
   número negativo, formato inválido, assento já ocupado, quantidade acima do limite.
3. Nas áreas com login, repita depois do logout para checar a autorização.

Isso vale só para o `localhost` do projeto e para a massa de teste. Nunca use contra
outro ambiente sem autorização explícita.

## Sinais que parecem erro da ferramenta, mas são informação

- Um `click` que estoura o timeout com "element is not enabled" logo após outro clique
  quer dizer que o app desabilitou o botão durante o envio. É proteção contra duplo
  clique: registre como (I) e confirme quantos registros foram criados.
- Se o `goto` foi redirecionado para `/login`, a sessão caiu. Faça login de novo antes de
  concluir qualquer coisa sobre a tela.

## Evidências

- `page.screenshot({ path: '.playwright-mcp/01-descricao.png', fullPage: true })` funciona
  dentro do `browser_run_code_unsafe`. Numere os arquivos (01, 02…) e cite o número no
  texto do defeito.
- Dê uma olhada no screenshot com `Read` antes de citá-lo, para confirmar que ele mostra
  o que você afirma.
