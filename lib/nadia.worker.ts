/// <reference lib="webworker" />
// Roda a NADIA num Web Worker: baixar 140 MB e gerar texto não travam a página.
import type * as Ort from "onnxruntime-web";
import { gerarResposta, type FormaModelo } from "./nadia-inferencia";
import { Tokenizer } from "./nadia-tokenizer";

const CACHE_MODELO = "nadia-modelo-v1"; // o mesmo de lib/nadia-navegador.ts

type Carregado = { ort: typeof Ort; sessao: Ort.InferenceSession; tok: Tokenizer; forma: FormaModelo };
let carregado: Promise<Carregado> | null = null;

// Baixa o modelo uma vez e guarda no cache do navegador; nas próximas visitas vem do disco
async function baixar(url: string, progresso: (fracao: number) => void): Promise<ArrayBuffer> {
  let cache: Cache | null = null;
  try {
    cache = await caches.open(CACHE_MODELO);
    const salvo = await cache.match(url);
    if (salvo) return salvo.arrayBuffer();
  } catch {
    cache = null; // sem Cache API (aba anônima, http): baixa sempre
  }
  const resp = await fetch(url);
  if (!resp.ok || !resp.body) throw new Error(`download do modelo falhou (${resp.status})`);
  const total = Number(resp.headers.get("content-length")) || 0;
  const partes: Uint8Array[] = [];
  let recebido = 0;
  const leitor = resp.body.getReader();
  for (;;) {
    const { done, value } = await leitor.read();
    if (done) break;
    partes.push(value);
    recebido += value.length;
    if (total) progresso(recebido / total);
  }
  const arquivo = new Blob(partes as BlobPart[]);
  try {
    await cache?.put(url, new Response(arquivo));
  } catch {
    // cache cheio: segue sem guardar
  }
  return arquivo.arrayBuffer();
}

async function carregar(url: string): Promise<Carregado> {
  // O ONNX Runtime fica em public/nadia/ort (copiado de node_modules por scripts/copiar-ort.mjs)
  // e é importado em tempo de execução, fora do bundle
  const caminhoOrt = new URL("/nadia/ort/ort.wasm.min.mjs", self.location.origin).href;
  const ort = (await import(/* turbopackIgnore: true */ /* webpackIgnore: true */ caminhoOrt)) as typeof Ort;
  ort.env.wasm.numThreads = 1; // várias threads exigiriam isolamento de origem (COOP/COEP) no site todo
  const [bytes, tokenizer, forma] = await Promise.all([
    baixar(url, (fracao) => postMessage({ tipo: "progresso", fracao })),
    fetch("/nadia/tokenizer.json").then((r) => r.json()),
    fetch("/nadia/config.json").then((r) => r.json()),
  ]);
  const sessao = await ort.InferenceSession.create(new Uint8Array(bytes), { executionProviders: ["wasm"] });
  return { ort, sessao, tok: new Tokenizer(tokenizer), forma };
}

self.onmessage = async ({ data }: MessageEvent) => {
  try {
    if (data.tipo === "carregar") {
      carregado ??= carregar(data.url);
      await carregado;
      postMessage({ tipo: "pronto" });
    } else if (data.tipo === "responder") {
      if (!carregado) throw new Error("modelo não carregado");
      const { ort, sessao, tok, forma } = await carregado;
      const resposta = await gerarResposta(ort, sessao, tok, forma, data.historico, data.mensagem);
      postMessage({ tipo: "resposta", id: data.id, ...resposta });
    }
  } catch (erro) {
    if (data.tipo === "carregar") carregado = null; // deixa tentar de novo
    postMessage({ tipo: "erro", id: data.id, mensagem: erro instanceof Error ? erro.message : String(erro) });
  }
};
