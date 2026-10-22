// Confere a NADIA em TypeScript (a mesma que roda no navegador) contra a referência em Python:
//   node scripts/conferir-nadia.ts <model_q8.onnx> <referencia.json>
import { readFileSync } from "node:fs";
import * as ort from "onnxruntime-web";
import { LIMIAR, NAO_SEI } from "../lib/nadia-geracao.ts";
import { gerarResposta } from "../lib/nadia-inferencia.ts";
import { Tokenizer } from "../lib/nadia-tokenizer.ts";

const [modelo, referencia] = process.argv.slice(2);
const tok = new Tokenizer(JSON.parse(readFileSync("public/nadia/tokenizer.json", "utf-8")));
const forma = JSON.parse(readFileSync("public/nadia/config.json", "utf-8"));
ort.env.wasm.numThreads = 1;
const sessao = await ort.InferenceSession.create(readFileSync(modelo));
const casos = JSON.parse(readFileSync(referencia, "utf-8"));
let iguais = 0;
const t0 = Date.now();
for (const c of casos) {
  const r = await gerarResposta(ort, sessao, tok, forma, c.historico, c.pergunta);
  const esperado = c.confianca < LIMIAR ? NAO_SEI : c.texto;
  const ok = r.texto === esperado && Math.abs(r.confianca - c.confianca) < 2e-3;
  iguais += Number(ok);
  if (!ok) console.log("DIFERENTE:", c.pergunta, "\n  ts:", r.texto, r.confianca, "\n  py:", esperado, c.confianca);
}
console.log(`${iguais}/${casos.length} iguais à referência em Python; ${((Date.now() - t0) / casos.length).toFixed(0)} ms por resposta`);
