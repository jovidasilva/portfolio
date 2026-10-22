import { test } from "node:test";
import assert from "node:assert/strict";
import { calcular, pesquisarWikipedia } from "./nadia-ferramentas.ts";

test("calculadora resolve contas sem eval e ignora o que não é conta", () => {
  assert.equal(calcular("Quanto é 2^10?", "pt")?.texto, "2 ^ 10 = 1.024");
  assert.equal(calcular("3 + 4 * 2", "pt")?.texto, "3 + 4 * 2 = 11");
  assert.equal(calcular("(1+2)*3", "pt")?.texto, "(1 + 2) * 3 = 9");
  assert.equal(calcular("raiz de 144", "pt")?.texto, "√144 = 12");
  assert.equal(calcular("2,5 vezes 4", "pt")?.texto, "2,5 * 4 = 10");
  assert.match(calcular("1/0", "pt")?.texto ?? "", /finito/);
  assert.equal(calcular("what is 7 times 6?", "en")?.texto, "7 * 6 = 42");
  for (const nao of ["Qual é a capital do Japão?", "2026", "-5", "alert(1)+1", "Tenho 2 gatos e 3 cachorros", "1+"]) assert.equal(calcular(nao, "pt"), null, nao);
});

test("Wikipédia escolhe o artigo mais lido com o termo no título e recusa o resto", async () => {
  const falso = (paginas: object[]) => (async () => ({ json: async () => ({ query: { pages: paginas } }) })) as unknown as typeof fetch;
  const lula = await pesquisarWikipedia("Quem é Lula da Silva?", falso([
    { title: "Rosângela Lula da Silva", extract: "Janja.", pageviews: { a: 900 } },
    { title: "Luiz Inácio Lula da Silva", extract: "Presidente do Brasil.", pageviews: { a: 9000, b: null } },
  ]));
  assert.equal(lula?.texto, "Presidente do Brasil.");
  assert.match(lula?.fontes?.[0] ?? "", /Luiz_In/);
  assert.equal(await pesquisarWikipedia("Quem foi Marcelo Tavirendo?", falso([{ title: "Marcelo", extract: "Nome." }])), null);
  assert.equal(await pesquisarWikipedia("Quem é você?", falso([])), null);
  assert.equal(await pesquisarWikipedia("Qual a capital do Japão?", falso([])), null);
});
