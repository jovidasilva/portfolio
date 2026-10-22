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
    { slug: "intermed", href: "/pt/projetos/intermed", titulo: "INTERMED", resumo: "Sistema web de internato.", tecnologias: ["Laravel", "React"] },
    { slug: "ia-generativa", href: "/pt/projetos/ia-generativa", titulo: "NADIA", resumo: "Modelo treinado do zero." },
    { slug: "monitoramento-tea", href: "/pt/projetos/monitoramento-tea", titulo: "Monitoramento de TEA", resumo: "Pesquisa." },
  ],
  contatos: [{ rotulo: "E-mail", href: "mailto:jvdasilva25@gmail.com", usuario: "jvdasilva25@gmail.com" }],
  artigos: [{ titulo: "Dispositivo para TEA", resumo: "Um vestível com IA.", href: "https://doi.org/x", projeto: "monitoramento-tea" }],
  curriculo: { href: "/curriculo.pdf", rotulo: "Baixar currículo" },
  sobre: "Sou o João Victor.",
  fatos: [
    { texto: "Este é o portfólio do João, feito com Next.js.", link: { href: "/pt", rotulo: "Início" }, chaves: "site portfolio feito fez" },
    { texto: "Sobre mim: “Sou estudante de Engenharia da Computação na Universidade Ceuma.”", link: { href: "/pt/sobre", rotulo: "Sobre" } },
    { texto: "Idiomas: português nativo e inglês avançado.", chaves: "idiomas fala" },
    { texto: "Estágio (Atual): “Trabalho no Steadyhand.”" },
    { texto: "Sobre mim: “Procuro vaga de estágio em desenvolvimento de software.”" },
  ],
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
  assert.match(r("Manda um email pro João dizendo oi")?.texto ?? "", /não envio/);
  assert.equal(r("Tem currículo?")?.links[0].href, "/curriculo.pdf");
  assert.match(r("oi nadia")?.texto ?? "", /Sou a NADIA/);
  // "resume" em português é resumir, não currículo
  const artigo = r("Resume pra mim o artigo sobre TEA");
  assert.match(artigo?.texto ?? "", /vestível/);
  assert.equal(artigo?.links[0].href, "https://doi.org/x");
  assert.equal(responderSobreOSite("Download the resume", "en", mapa)?.links[0].href, "/curriculo.pdf");
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

test("responde sobre o João e o site com o trecho certo do conteúdo", () => {
  assert.match(r("Que site é esse?")?.texto ?? "", /portfólio/);
  assert.match(r("Onde o João estuda?")?.texto ?? "", /Ceuma/);
  assert.match(r("Ele fala inglês?")?.texto ?? "", /inglês avançado/);
  assert.match(r("Ele faz estágio?")?.texto ?? "", /Steadyhand/);
  assert.match(r("Ele está procurando emprego?")?.texto ?? "", /vaga/);
  const react = r("Quais projetos usam React?");
  assert.deepEqual(react?.links.map((l) => l.href), ["/pt/projetos/intermed", "/pt/projetos"]);
  // sem menção ao João ou ao site, a pergunta continua indo para o modelo
  assert.equal(r("Qual é o idioma oficial do Brasil?"), null);
  assert.equal(r("Me fale sobre Python"), null);
});
