import type * as Ort from "onnxruntime-web";
import { CONTEXTO, decidir, escolherProximo, FIM, MAX_NOVOS, montarPrompt, posprocessar } from "./nadia-geracao.ts";
import type { Tokenizer } from "./nadia-tokenizer.ts";

// Formato do modelo (public/nadia/config.json): o cache de atenção começa vazio com essas dimensões
export type FormaModelo = { camadas: number; cabecas: number; dimCabeca: number };

// Gera a resposta da NADIA com o modelo ONNX. Com o cache de atenção ("past_key_values"), cada
// passo processa só o token novo, em vez da conversa inteira de novo.
export async function gerarResposta(
  ort: typeof Ort,
  sessao: Ort.InferenceSession,
  tok: Tokenizer,
  forma: FormaModelo,
  historico: [string, string][],
  mensagem: string,
) {
  const fim = tok.idEspecial(FIM);
  const prompt = tok.encode(montarPrompt(historico, mensagem)).slice(-(CONTEXTO - MAX_NOVOS));
  const usados = new Set(prompt);
  const gerados: number[] = [];
  const logps: number[] = [];
  const int64 = (valores: number[]) => new ort.Tensor("int64", BigInt64Array.from(valores, BigInt), [1, valores.length]);

  let cache: Record<string, Ort.Tensor> = {};
  for (let i = 0; i < forma.camadas; i++)
    for (const kv of ["key", "value"])
      cache[`past_key_values.${i}.${kv}`] = new ort.Tensor("float32", new Float32Array(0), [1, forma.cabecas, 0, forma.dimCabeca]);

  let entrada = prompt;
  let posicao = 0;
  for (let passo = 0; passo < MAX_NOVOS; passo++) {
    const n = entrada.length;
    const saida = await sessao.run({
      input_ids: int64(entrada),
      attention_mask: int64(Array(posicao + n).fill(1)),
      position_ids: int64(Array.from({ length: n }, (_, i) => posicao + i)),
      ...cache,
    });
    const tamanhoVocab = saida.logits.dims[2];
    const logits = (saida.logits.data as Float32Array).subarray((n - 1) * tamanhoVocab, n * tamanhoVocab);
    const novo: Record<string, Ort.Tensor> = {};
    for (let i = 0; i < forma.camadas; i++)
      for (const kv of ["key", "value"]) novo[`past_key_values.${i}.${kv}`] = saida[`present.${i}.${kv}`];
    cache = novo;
    posicao += n;

    const { id, logp } = escolherProximo(logits, usados, tok.proibidos);
    gerados.push(id);
    logps.push(logp);
    usados.add(id);
    entrada = [id];
    if (id === fim) break;
  }
  return decidir(posprocessar(tok.decode(gerados)), logps);
}
