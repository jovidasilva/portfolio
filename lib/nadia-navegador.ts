// Ponte entre o chat e o worker da NADIA (lib/nadia.worker.ts)
export const CACHE_MODELO = "nadia-modelo-v1";

export type RespostaModelo = { texto: string; confianca: number; limiar: number };

let worker: Worker | null = null;
let proximoId = 0;
const esperando = new Map<number, { ok: (r: RespostaModelo) => void; falha: (e: Error) => void }>();

function obterWorker() {
  if (!worker) {
    worker = new Worker(new URL("./nadia.worker.ts", import.meta.url), { type: "module" });
    worker.addEventListener("message", ({ data }) => {
      const pedido = esperando.get(data.id);
      if (!pedido) return;
      esperando.delete(data.id);
      if (data.tipo === "erro") pedido.falha(new Error(data.mensagem));
      else pedido.ok(data);
    });
  }
  return worker;
}

export function carregarModelo(url: string, aoProgredir: (fracao: number) => void): Promise<void> {
  const w = obterWorker();
  return new Promise((ok, falha) => {
    const ouvir = ({ data }: MessageEvent) => {
      if (data.tipo === "progresso") return aoProgredir(data.fracao);
      if (data.id !== undefined) return;
      w.removeEventListener("message", ouvir);
      if (data.tipo === "pronto") ok();
      else falha(new Error(data.mensagem));
    };
    w.addEventListener("message", ouvir);
    w.postMessage({ tipo: "carregar", url });
  });
}

export function perguntarAoModelo(historico: [string, string][], mensagem: string): Promise<RespostaModelo> {
  const id = proximoId++;
  return new Promise((ok, falha) => {
    esperando.set(id, { ok, falha });
    obterWorker().postMessage({ tipo: "responder", id, historico, mensagem });
  });
}

// O modelo já está no cache do navegador? Então carrega sem perguntar de novo
export async function modeloJaBaixado(url: string) {
  try {
    return Boolean(await (await caches.open(CACHE_MODELO)).match(url));
  } catch {
    return false;
  }
}
