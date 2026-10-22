import { normalizar } from "./nadia.ts";

// Ferramentas que rodam no navegador, antes do modelo: contas e a Wikipédia. Um modelo deste
// tamanho imita o formato de uma conta mas não calcula, e fatos com fonte valem mais que um palpite.

export type RespostaFerramenta = { texto: string; ferramenta: string; fontes?: string[] };

// ------------------------------------------------------------------ calculadora
// Analisador próprio (nunca eval): números, + - * / ^, parênteses e raiz
const PALAVRAS_CONTA: [RegExp, string][] = [
  [/\braiz quadrada de\b|\braiz de\b|\bsquare root of\b|\bsqrt\b/g, " r "],
  [/\bmais\b|\bplus\b/g, " + "],
  [/\bmenos\b|\bminus\b/g, " - "],
  [/\bvezes\b|\btimes\b|×/g, " * "],
  [/\bdividido por\b|\bdivided by\b|÷/g, " / "],
  [/\belevado a\b|\bto the power of\b|\*\*/g, " ^ "],
];
const PREFIXO = /^(?:quanto (?:e|da|vale)|calcul[ea]r?|qual (?:e )?o resultado de|what is|what s|calculate)\s+/;

export function calcular(mensagem: string, lang: "pt" | "en"): RespostaFerramenta | null {
  let t = mensagem.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim().replace(/[?=!\s]+$/, "");
  t = t.replace(PREFIXO, "");
  for (const [re, op] of PALAVRAS_CONTA) t = t.replace(re, op);
  t = t.replace(/(\d)\s*x\s*(?=\d)/g, "$1 * ");
  if (t.length > 200 || !/^[\d\s+\-*/^().,r]+$/.test(t) || !/\d/.test(t) || !/[+\-*/^r]/.test(t.replace(/^\s*-/, ""))) return null;
  const tokens = t.match(/\d+(?:[.,]\d+)?|[+\-*/^()r]/g) ?? [];
  let i = 0;
  const ver = () => tokens[i];
  const expr = (): number => {
    let v = termo();
    while (ver() === "+" || ver() === "-") v = tokens[i++] === "+" ? v + termo() : v - termo();
    return v;
  };
  const termo = (): number => {
    let v = fator();
    while (ver() === "*" || ver() === "/") v = tokens[i++] === "*" ? v * fator() : v / fator();
    return v;
  };
  const fator = (): number => {
    const base = unario();
    if (ver() === "^") {
      i++;
      return base ** fator();
    }
    return base;
  };
  const unario = (): number => {
    if (ver() === "-") return i++, -unario();
    if (ver() === "+") return i++, unario();
    if (ver() === "r") return i++, Math.sqrt(unario());
    if (ver() === "(") {
      i++;
      const v = expr();
      if (tokens[i++] !== ")") throw new Error("parêntese");
      return v;
    }
    const n = Number(tokens[i++]?.replace(",", "."));
    if (Number.isNaN(n)) throw new Error("número");
    return n;
  };
  let resultado: number;
  try {
    resultado = expr();
    if (i !== tokens.length) return null;
  } catch {
    return null;
  }
  const ferramenta = lang === "pt" ? "🧮 Calculadora" : "🧮 Calculator";
  if (!Number.isFinite(resultado))
    return { texto: lang === "pt" ? "Essa conta não tem resultado finito (divisão por zero ou número grande demais)." : "That has no finite result (division by zero or a number too large).", ferramenta };
  const formatado = resultado.toLocaleString(lang === "pt" ? "pt-BR" : "en-US", { maximumFractionDigits: 6 });
  return { texto: `${tokens.join(" ").replace(/r /g, "√").replace(/\( /g, "(").replace(/ \)/g, ")")} = ${formatado}`, ferramenta };
}

// ---------------------------------------------------------------- data e hora
// Sem isto, "que horas são?" ia para o modelo, que inventava um horário
export function dataHora(mensagem: string, lang: "pt" | "en", agora = new Date()): RespostaFerramenta | null {
  const t = normalizar(mensagem);
  const local = lang === "pt" ? "pt-BR" : "en-US";
  const ferramenta = lang === "pt" ? "📅 Data e hora" : "📅 Date and time";
  if (/\b(?:que horas sao|que hora e|horas agora|what time is it|current time)\b/.test(t))
    return { texto: agora.toLocaleTimeString(local, { hour: "2-digit", minute: "2-digit" }), ferramenta };
  if (/\b(?:que dia e hoje|hoje e que dia|qual (?:e )?a data(?: de hoje)?|data de hoje|dia da semana hoje|what day is (?:it|today)|today s date|what s the date)\b/.test(t)) {
    const data = agora.toLocaleDateString(local, { weekday: "long", day: "numeric", month: "long", year: "numeric" });
    return { texto: data.charAt(0).toUpperCase() + data.slice(1), ferramenta };
  }
  return null;
}

// ------------------------------------------------------------------- Wikipédia
const PERGUNTA = /^(?:quem (?:e|foi|era|eram|sao|foram)|o que (?:e|sao|foi|foram|significa)|me fale sobre|fale sobre)\s+(?:o |a |os |as |um |uma )?(.+)$/;
// Perguntas sobre a própria NADIA ficam com ela, nunca com a Wikipédia
const SOBRE_MIM = /\b(?:voce|vc|te|teu|tua|seu|sua|seus|suas|nadia)\b/;

export async function pesquisarWikipedia(mensagem: string, buscar: typeof fetch = fetch): Promise<RespostaFerramenta | null> {
  const t = normalizar(mensagem);
  const m = t.match(PERGUNTA);
  if (!m || SOBRE_MIM.test(t)) return null;
  const termo = m[1].trim();
  const url =
    "https://pt.wikipedia.org/w/api.php?action=query&format=json&formatversion=2&origin=*" +
    `&generator=search&gsrsearch=${encodeURIComponent(termo)}&gsrlimit=5` +
    "&prop=pageviews|extracts&pvipdays=30&exintro=1&explaintext=1&exlimit=5";
  try {
    const dados = await (await buscar(url, { signal: AbortSignal.timeout(6000) })).json();
    const paginas: { title: string; extract?: string; pageviews?: Record<string, number | null> }[] = dados?.query?.pages ?? [];
    // Só artigos com o termo no título: a busca sempre devolve algo, e um nome inventado
    // traria um artigo qualquer como se fosse a resposta
    const candidatas = paginas.filter((p) => normalizar(p.title).includes(termo) && p.extract && !/pode (?:se )?referir/.test(p.extract));
    if (!candidatas.length) return null;
    const leituras = (p: (typeof candidatas)[number]) => Object.values(p.pageviews ?? {}).reduce<number>((s, v) => s + (v ?? 0), 0);
    const melhor = candidatas.reduce((a, b) => (leituras(b) > leituras(a) ? b : a));
    let texto = melhor.extract!.trim();
    if (texto.length > 500) texto = texto.slice(0, 500).replace(/\.[^.]*$/, ".");
    return { texto, ferramenta: "🔍 Wikipédia", fontes: [`https://pt.wikipedia.org/wiki/${encodeURIComponent(melhor.title.replaceAll(" ", "_"))}`] };
  } catch {
    return null;
  }
}
