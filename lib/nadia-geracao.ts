import { normalizar } from "./nadia.ts";

// Regras de geração da NADIA, as mesmas do app/chat_engine.py do IAgenerativa, para o modelo
// rodando no navegador responder igual ao servidor (e igual ao que a avaliação mediu).

export const FIM = "<|end|>";
export const CONTEXTO = 320; // tokens que o modelo enxerga
export const MAX_NOVOS = 80; // tamanho máximo da resposta, em tokens
export const PENALIDADE = 1.2; // desconto em tokens já usados, contra repetição ("de fantasia de fantasia...")
export const LIMIAR = 0.7; // confiança mínima para responder (calibrada em docs/resultados.md)
export const NAO_SEI = "Não sei responder isso com segurança.";

// Anti prompt injection: sem quebras de linha nem <|end|>, ninguém forja um turno "Assistente:"
const limpar = (texto: string) => texto.replaceAll(FIM, " ").split(/\s+/).filter(Boolean).join(" ");

// Pergunta que continua a anterior ("E a do Piauí?", "Ele escreveu outro livro?"). As outras vão sem
// histórico: com a troca anterior no prompt, "Quem foi Fulano?" depois de falar de Dom Casmurro virava
// uma resposta sobre Machado de Assis.
const CONTINUACAO = /^(?:e|mas)\b|\b(?:ele|ela|eles|elas|dele|dela|deles|delas|isso|disso|nisso|la|ali)\b/;

// Só a última troca entra como histórico: é o formato das conversas de vários turnos do treino
export function montarPrompt(historico: [string, string][], mensagem: string) {
  if (!CONTINUACAO.test(normalizar(mensagem))) historico = [];
  const turnos = historico
    .slice(-2)
    .map(([papel, texto]) => (papel === "user" ? `Usuário: ${limpar(texto)}` : `Assistente: ${limpar(texto)}${FIM}`));
  return [...turnos, `Usuário: ${limpar(mensagem)}`, "Assistente:"].join("\n");
}

// Escolhe o próximo token (o mais provável, depois das penalidades) e devolve também o log da
// probabilidade "crua" dele, que é a base da confiança
export function escolherProximo(logits: ArrayLike<number>, usados: Set<number>, proibidos: number[]) {
  let maior = -Infinity;
  for (let i = 0; i < logits.length; i++) if (logits[i] > maior) maior = logits[i];
  let soma = 0;
  for (let i = 0; i < logits.length; i++) soma += Math.exp(logits[i] - maior);
  const logZ = maior + Math.log(soma);

  const z = Float64Array.from(logits);
  for (const u of usados) z[u] = z[u] > 0 ? z[u] / PENALIDADE : z[u] * PENALIDADE;
  for (const p of proibidos) z[p] = -Infinity;
  let id = 0;
  for (let i = 1; i < z.length; i++) if (z[i] > z[id]) id = i;
  return { id, logp: logits[id] - logZ };
}

// Corta a resposta se o modelo começar a inventar o próximo turno sozinho
export function posprocessar(texto: string) {
  const cortes = ["Usuário:", "Assistente:", FIM].map((m) => texto.indexOf(m)).filter((i) => i >= 0);
  return (cortes.length ? texto.slice(0, Math.min(...cortes)) : texto).trim();
}

// Confiança = média geométrica da probabilidade de cada token gerado; abaixo do limiar, "não sei"
export function decidir(texto: string, logps: number[]) {
  const confianca = logps.length ? Math.exp(logps.reduce((a, b) => a + b, 0) / logps.length) : 0;
  return { texto: confianca < LIMIAR ? NAO_SEI : texto || NAO_SEI, confianca, limiar: LIMIAR };
}
