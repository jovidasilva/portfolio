import { test } from "node:test";
import assert from "node:assert/strict";
import { pareceIngles, verificarLimites } from "./nadia-limites.ts";
import { dataHora } from "./nadia-ferramentas.ts";

test("pedidos fora do alcance voltam com o motivo", () => {
  const casos: [string, RegExp][] = [
    ["Manda um email pro João", /não envio/],
    ["Gera uma imagem de um gato", /imagens/],
    ["Escreve uma redação sobre meio ambiente", /Textos longos/],
    ["Faz um código em Python que ordena uma lista", /Textos longos/],
    ["Traduza isso para o inglês", /Textos longos/],
    ["Como está o clima em São Luís?", /tempo real/],
    ["Quanto está o dólar hoje?", /tempo real/],
    ["10 km em milhas", /Conversão/],
    ["Qual é o meu nome?", /sobre você/],
    ["Quem vai ganhar a próxima eleição?", /futuro/],
    ["Lembra o que eu disse ontem na conversa?", /esqueço/],
  ];
  for (const [pedido, motivo] of casos) assert.match(verificarLimites(pedido, "pt") ?? "", motivo, pedido);
  // com o servidor do chat, clima e conversões têm ferramenta
  assert.equal(verificarLimites("10 km em milhas", "pt", true), null);
});

test("perguntas normais passam", () => {
  for (const pergunta of ["Quem escreveu Dom Casmurro?", "Qual é a capital do Japão?", "O que é uma rede neural?", "Qual é a moeda do Brasil?",
    "O que é o euro?", "Quem fez a Mona Lisa?", "Quantos lados tem um triângulo?", "Me conta uma curiosidade", "eoso sosidkm2 sapsoia?"])
    assert.equal(verificarLimites(pergunta, "pt"), null, pergunta);
});

test("inglês é detectado só quando é inglês", () => {
  assert.ok(pareceIngles("What is the capital of Japan?"));
  assert.ok(pareceIngles("who are you"));
  for (const pt of ["Qual é a capital do Japão?", "Me fale sobre Python", "Quem é você?", "oi"]) assert.ok(!pareceIngles(pt), pt);
});

test("data e hora sem o modelo", () => {
  const agora = new Date(2026, 9, 22, 14, 5);
  assert.equal(dataHora("Que horas são?", "pt", agora)?.texto, "14:05");
  assert.equal(dataHora("Que dia é hoje?", "pt", agora)?.texto, "Quinta-feira, 22 de outubro de 2026");
  assert.equal(dataHora("Qual é a capital do Japão?", "pt", agora), null);
});
