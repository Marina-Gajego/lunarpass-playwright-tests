#!/usr/bin/env python3
"""Gera o Relatório de Sessão (.docx) a partir de um JSON, usando o modelo em
assets/modelo-relatorio-sessao.docx (mantém estilos, cabeçalho, rodapé e listas).

Uso:
    python3 gerar_relatorio.py sessao.json saida.docx

Formato do JSON:
{
  "data_hora_inicio": "5 de outubro de 2026 08:15 PM",
  "testador": "Claude (IA) — sessão pedida por Marina",
  "modulo": "Storefront — Checkout",
  "charter": {
    "explore": "o fluxo de compra de passagem ...",
    "com": "a heurística ... com foco em ...",
    "para_descobrir": "se ..."
  },
  "duracao": "25 minutos",
  "notas": [{"tipo": "I", "texto": "..."}, {"tipo": "R", "texto": "..."}],
  "defeitos": ["..."],
  "perguntas": ["..."]
}
Só usa a biblioteca padrão do Python.
"""
import json
import sys
import zipfile
from pathlib import Path
from xml.sax.saxutils import escape

MODELO = Path(__file__).resolve().parent.parent / "assets" / "modelo-relatorio-sessao.docx"

B = "<w:rPr><w:b/><w:bCs/></w:rPr>"
I = "<w:rPr><w:i/><w:iCs/></w:rPr>"


def run(texto, rpr=""):
    return f'<w:r>{rpr}<w:t xml:space="preserve">{escape(texto)}</w:t></w:r>'


def p(conteudo="", ppr=""):
    return f"<w:p>{ppr}{conteudo}</w:p>"


def vazio():
    return p(ppr="<w:pPr>" + B + "</w:pPr>")


def item_lista(texto, num_id):
    ppr = (f'<w:pPr><w:pStyle w:val="ListParagraph"/><w:numPr><w:ilvl w:val="0"/>'
           f'<w:numId w:val="{num_id}"/></w:numPr></w:pPr>')
    return p(run(texto), ppr)


def titulo_secao(texto):
    return p(run(texto, B), "<w:pPr>" + B + "</w:pPr>")


def linha_charter(rotulo, texto):
    return p(run(rotulo, I) + run(" " + texto))


def celula(largura, texto, negrito=False):
    ppr = "<w:pPr>" + B + "</w:pPr>" if negrito else ""
    return (f'<w:tc><w:tcPr><w:tcW w:w="{largura}" w:type="dxa"/></w:tcPr>'
            f'{p(run(texto, B if negrito else ""), ppr)}</w:tc>')


def montar_corpo(d):
    larguras = (3270, 3232, 2848)
    cab = ("Data e Hora do Início", "Nome do Testador", "Módulo")
    val = (d["data_hora_inicio"], d["testador"], d["modulo"])
    tabela = (
        '<w:tbl><w:tblPr><w:tblStyle w:val="TableGrid"/><w:tblW w:w="0" w:type="auto"/>'
        '<w:tblLook w:val="04A0" w:firstRow="1" w:lastRow="0" w:firstColumn="1" '
        'w:lastColumn="0" w:noHBand="0" w:noVBand="1"/></w:tblPr><w:tblGrid>'
        + "".join(f'<w:gridCol w:w="{w}"/>' for w in larguras) + "</w:tblGrid>"
        + "<w:tr>" + "".join(celula(w, t, True) for w, t in zip(larguras, cab)) + "</w:tr>"
        + "<w:tr>" + "".join(celula(w, t) for w, t in zip(larguras, val)) + "</w:tr>"
        + "</w:tbl>"
    )
    grande = "<w:rPr><w:b/><w:bCs/><w:sz w:val=\"72\"/><w:szCs w:val=\"72\"/></w:rPr>"
    cinza = ('<w:rPr><w:rStyle w:val="oypena"/><w:color w:val="808080" '
             'w:themeColor="background1" w:themeShade="80"/></w:rPr>')
    c = d["charter"]
    partes = [
        p(ppr="<w:pPr>" + grande + "</w:pPr>"),
        p(run("Relatório de Sessão", grande), "<w:pPr>" + grande + "</w:pPr>"),
        p(run("Inspirado no artigo de Jonathan Bach sobre Session-Based Test Management (2000)", cinza),
          '<w:pPr><w:pStyle w:val="Header"/></w:pPr>'),
        vazio(),
        tabela,
        vazio(),
        p(run("Test Charter:", B) + "<w:r><w:br/></w:r>" + run("Explore", I) + run(" " + c["explore"])),
        linha_charter("Com", c["com"]),
        linha_charter("Para descobrir", c["para_descobrir"]),
        p(),
        p(run("Tamanho da Sessão:", B) + "<w:r><w:br/></w:r>" + run(d["duracao"])),
        p(),
        titulo_secao("Notas*:"),
    ]
    partes += [item_lista(f'({n["tipo"].upper()}) {n["texto"]}', 1) for n in d.get("notas", [])]
    partes += [
        vazio(),
        p(run("(*) Podem ser (I)nformações ou (R)iscos.",
              "<w:rPr><w:i/><w:iCs/><w:sz w:val=\"21\"/><w:szCs w:val=\"21\"/></w:rPr>")),
        vazio(),
        titulo_secao("Defeitos:"),
    ]
    defeitos = d.get("defeitos") or ["Nenhum defeito encontrado nesta sessão."]
    partes += [item_lista(t, 3) for t in defeitos]
    partes += [vazio(), titulo_secao("Perguntas:")]
    perguntas = d.get("perguntas") or ["Nenhuma pergunta em aberto nesta sessão."]
    partes += [item_lista(t, 2) for t in perguntas]
    return "".join(partes)


def main():
    if len(sys.argv) != 3:
        sys.exit("uso: gerar_relatorio.py sessao.json saida.docx")
    dados = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
    saida = Path(sys.argv[2])
    saida.parent.mkdir(parents=True, exist_ok=True)

    with zipfile.ZipFile(MODELO) as zin:
        doc = zin.read("word/document.xml").decode("utf-8")
        ini = doc.index("<w:body>") + len("<w:body>")
        fim = doc.index("<w:sectPr")  # mantém seção, cabeçalho e rodapé do modelo
        novo = doc[:ini] + montar_corpo(dados) + doc[fim:]
        with zipfile.ZipFile(saida, "w", zipfile.ZIP_DEFLATED) as zout:
            for item in zin.infolist():
                conteudo = novo.encode("utf-8") if item.filename == "word/document.xml" else zin.read(item)
                zout.writestr(item, conteudo)
    print(f"Relatório gerado: {saida}")


if __name__ == "__main__":
    main()
