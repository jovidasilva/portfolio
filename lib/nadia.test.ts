import { test } from "node:test";
import assert from "node:assert/strict";
import { ehCaminhoInterno, normalizar, responderSobreOSite, type MapaSite } from "./nadia.ts";

const mapa: MapaSite = {
  paginas: ["sobre", "conhecimento", "experiencias", "projetos", "certificados", "artigos", "contato"].map((secao) => ({
    secao,
    href: `/pt/${secao}`,
    rotulo: secao,
    descricao: `descrição de ${secao}`,
  })),
  projetos: [
    { slug: "intermed", href: "/pt/projetos/intermed", titulo: "INTERMED", resumo: "Sistema web de internato." },
    { slug: "ia-generativa", href: "/pt/projetos/ia-generativa", titulo: "NADIA", resumo: "Modelo treinado do zero." },
  ],
  contatos: [{ rotulo: "E-mail", href: "mailto:jvdasilva25@gmail.com", usuario: "jvdasilva25@gmail.com" }],
  curriculo: { href: "/curriculo.pdf", rotulo: "Baixar currículo" },
  sobre: "Sou o João Victor.",
};
const r = (m: string) => responderSobreOSite(m, "pt", mapa);

test("normalizar tira acento, maiúscula e pontuação", () => {
  assert.equal(normalizar("Olá, João! Tudo BEM?"), "ola joao tudo bem");
});

test("navega quando o pedido é para ir a uma página ou projeto", () => {
  assert.equal(r("Me leva aos projetos")?.ir, "/pt/projetos");
  assert.equal(r("quero ver os certificados")?.ir, "/pt/certificados");
  assert.equal(r("abre o INTERMED")?.ir, "/pt/projetos/intermed");
});

test("responde sobre o site sem navegar quando é pergunta", () => {
  const projetos = r("Quais projetos ele tem?");
  assert.equal(projetos?.ir, undefined);
  assert.ok(projetos?.links.some((l) => l.href === "/pt/projetos/intermed"));
  assert.match(r("O que é o INTERMED?")?.texto ?? "", /internato/);
  assert.ok(r("Como falar com o João?")?.links.some((l) => l.href.startsWith("mailto:")));
  assert.equal(r("Tem currículo?")?.links[0].href, "/curriculo.pdf");
  assert.match(r("oi nadia")?.texto ?? "", /Sou a NADIA/);
});

test("o resto vai para o modelo", () => {
  for (const pergunta of ["Qual é a capital do Japão?", "Quanto é 2 + 2?", "Quem é você?", "Quais são suas ferramentas?",
    "Me explique o que é uma rede neural e como ela aprende com os dados"]) {
    assert.equal(r(pergunta), null, pergunta);
  }
});

test("só caminhos internos viram navegação", () => {
  assert.ok(ehCaminhoInterno("/pt/projetos"));
  for (const ruim of ["javascript:alert(1)", "//evil.example", "https://evil.example"]) assert.ok(!ehCaminhoInterno(ruim));
});
