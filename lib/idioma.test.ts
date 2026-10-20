import { test } from "node:test";
import assert from "node:assert/strict";
import { escolherIdioma } from "./idioma.ts";

test("a escolha manual salva vence tudo", () => {
  assert.equal(escolherIdioma({ cookie: "en", pais: "BR", aceita: "pt-BR" }), "en");
});

test("o país decide quando existe: Brasil vê em português, o resto em inglês", () => {
  assert.equal(escolherIdioma({ pais: "BR", aceita: "en-US,en;q=0.9" }), "pt");
  assert.equal(escolherIdioma({ pais: "us", aceita: "pt-BR" }), "en");
});

test("sem país, vale o idioma preferido do navegador", () => {
  assert.equal(escolherIdioma({ aceita: "pt-BR,pt;q=0.9,en;q=0.8" }), "pt");
  assert.equal(escolherIdioma({ aceita: "en;q=0.5,pt-PT;q=0.9" }), "pt");
  assert.equal(escolherIdioma({ aceita: "de-DE,de;q=0.9" }), "en");
  assert.equal(escolherIdioma({ cookie: "fr", aceita: "" }), "en");
});
