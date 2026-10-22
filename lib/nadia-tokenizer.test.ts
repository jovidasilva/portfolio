import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { Tokenizer } from "./nadia-tokenizer.ts";

const tok = new Tokenizer(JSON.parse(readFileSync(new URL("../public/nadia/tokenizer.json", import.meta.url), "utf-8")));
// Ids gerados pelo tokenizer em Python do IAgenerativa (core/tokenizer.py) para os mesmos textos
const casos: { texto: string; ids: number[]; volta: string }[] = JSON.parse(readFileSync(new URL("./nadia-tokenizer.casos.json", import.meta.url), "utf-8"));

test("o tokenizer em TypeScript produz os mesmos ids que o do treino", () => {
  for (const c of casos) {
    assert.deepEqual(tok.encode(c.texto), c.ids, c.texto);
    assert.equal(tok.decode(c.ids), c.volta, c.texto);
  }
  assert.equal(tok.idEspecial("<|end|>"), 16000);
});
