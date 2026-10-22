import type { Idioma } from "./idioma.ts";

// A NADIA do site responde em duas camadas, como o chat original: o que é sobre o site
// (páginas, projetos, contato) sai daqui, exato e na hora; o resto vai para o modelo.

export type LinkNadia = { href: string; rotulo: string };

export type MapaSite = {
  paginas: { secao: string; href: string; rotulo: string; descricao: string }[];
  projetos: { slug: string; href: string; titulo: string; resumo: string }[];
  contatos: { rotulo: string; href: string; usuario: string }[];
  curriculo: LinkNadia;
  sobre: string;
};

export type RespostaSite = { texto: string; links: LinkNadia[]; ir?: string };

export function normalizar(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

const tem = (t: string, palavras: string[]) => palavras.some((p) => new RegExp(`\\b${p}\\b`).test(t));

// Palavras de cada página do menu (texto já normalizado, nos dois idiomas)
const SECOES: Record<string, string[]> = {
  sobre: ["sobre", "about", "joao", "jovi", "biografia", "bio"],
  conhecimento: ["conhecimentos?", "tecnologias?", "skills?", "habilidades?", "stack", "linguagens?", "technologies", "knowledge"],
  experiencias: ["experiencias?", "estagios?", "formacao", "faculdade", "carreira", "trajetoria", "experiences?", "internships?", "education"],
  projetos: ["projetos?", "projects?", "portfolio", "trabalhos"],
  certificados: ["certificados?", "cursos?", "certificates?", "courses?"],
  artigos: ["artigos?", "publicac(?:ao|oes)", "papers?", "articles?", "publications?"],
  contato: ["contatos?", "contatar", "falar com", "e ?mail", "linkedin", "instagram", "github", "contact", "reach", "get in touch"],
};
// Ordem de teste: "falar com o João" é contato, não "sobre"
const PRIORIDADE = ["contato", "certificados", "artigos", "experiencias", "conhecimento", "projetos", "sobre"];
// Assuntos que só fazem sentido sobre o site, mesmo numa frase longa
const FORTES = ["contato", "certificados"];
const CURRICULO = ["curriculo", "cv", "resume"];

// Apelidos dos projetos, além do slug e do título
const APELIDOS: Record<string, string[]> = {
  "ia-generativa": ["nadia", "chatbot", "modelo de linguagem", "llm"],
  steadyhand: ["luva", "parkinson", "glove"],
  "monitoramento-tea": ["tea", "autismo", "autism", "vestivel", "wearable"],
  slimegame: ["slime", "metroidvania", "godot"],
  oxyrcuits: ["circuitos?", "circuits?", "simulador", "protoboard"],
  intermed: ["internato", "medicina"],
  "analise-ecg": ["ecg", "eletrocardiograma", "arritmias?", "ecg analysis"],
};

const NAVEGAR =
  /\b(?:me )?(?:leva|leve|levar|mostra|mostre|mostrar|abre|abra|abrir|ir|vai|va|navega|navegue|quero ver|ver|go|take me|show me|open|navigate|visit)\b/;
const SAUDACAO = /^(?:oi+|ola|opa|e ai|bom dia|boa tarde|boa noite|hey|hi|hello)(?: nadia)?$/;
const AJUDA = /^(?:ajuda|help|menu)$|o que (?:voce|vc) (?:faz|pode fazer|sabe fazer)|what can you do|como (?:voce )?funciona|how does this work/;

const TEXTOS = {
  pt: {
    ola: "Olá! Sou a NADIA. Posso te mostrar os projetos, falar do João e te levar a qualquer página do site. Também converso sobre outros assuntos com o modelo que ele treinou do zero.",
    ajuda:
      "Aqui no site, eu levo você às páginas (\"me leva aos projetos\"), conto sobre cada projeto (\"o que é o INTERMED?\") e passo os contatos do João. Para o resto, quem responde é o meu modelo de linguagem, treinado do zero, com ferramentas de cálculo, conversão e pesquisa. Pergunte \"quais são suas ferramentas?\" para ver todas.",
    abrindo: (rotulo: string) => `Abrindo ${rotulo}.`,
    projetos: "Estes são os projetos do João:",
    contato: "Você pode falar com o João por aqui. Ele responde pelo e-mail.",
    curriculo: "O currículo do João está neste PDF:",
    verProjeto: "Ver o projeto",
  },
  en: {
    ola: "Hi! I'm NADIA. I can show you the projects, tell you about João and take you to any page of the site. I also chat about other topics with the model he trained from scratch (that part only speaks Portuguese).",
    ajuda:
      "On this site, I take you to pages (\"take me to the projects\"), explain each project (\"what is INTERMED?\") and share João's contacts. Anything else goes to my language model, trained from scratch, which only speaks Portuguese.",
    abrindo: (rotulo: string) => `Opening ${rotulo}.`,
    projetos: "These are João's projects:",
    contato: "You can reach João here. He replies by e-mail.",
    curriculo: "João's resume is in this PDF:",
    verProjeto: "See the project",
  },
};

export const textosNadia = TEXTOS;

// Resposta sobre o site, ou null quando a pergunta é para o modelo
export function responderSobreOSite(mensagem: string, lang: Idioma, mapa: MapaSite): RespostaSite | null {
  const t = normalizar(mensagem);
  const tx = TEXTOS[lang];
  if (!t) return null;
  if (SAUDACAO.test(t)) return { texto: tx.ola, links: [] };
  if (AJUDA.test(t)) return { texto: tx.ajuda, links: [] };

  const navegar = NAVEGAR.test(t);

  if (tem(t, CURRICULO)) return { texto: tx.curriculo, links: [mapa.curriculo] };

  const projeto = mapa.projetos.find((p) => tem(t, [p.slug.replace(/-/g, " "), normalizar(p.titulo), ...(APELIDOS[p.slug] ?? [])]));
  if (projeto) {
    const link = { href: projeto.href, rotulo: projeto.titulo };
    return navegar
      ? { texto: tx.abrindo(projeto.titulo), links: [link], ir: projeto.href }
      : { texto: `${projeto.titulo}: ${projeto.resumo}`, links: [{ ...link, rotulo: tx.verProjeto }] };
  }

  const curta = t.split(" ").length <= 4;
  const sobreJoao = /\b(?:joao|ele|dele|site|portfolio|aqui|he|his)\b/.test(t);
  for (const secao of PRIORIDADE) {
    const pagina = mapa.paginas.find((p) => p.secao === secao);
    if (!pagina || !tem(t, SECOES[secao])) continue;
    if (!(navegar || curta || sobreJoao || FORTES.includes(pagina.secao))) continue;
    const link = { href: pagina.href, rotulo: pagina.rotulo };
    if (navegar) return { texto: tx.abrindo(pagina.rotulo), links: [link], ir: pagina.href };
    if (pagina.secao === "projetos")
      return { texto: tx.projetos, links: [...mapa.projetos.map((p) => ({ href: p.href, rotulo: p.titulo })), link] };
    if (pagina.secao === "contato")
      return { texto: tx.contato, links: [...mapa.contatos.map((c) => ({ href: c.href, rotulo: `${c.rotulo}: ${c.usuario}` })), link] };
    if (pagina.secao === "sobre") return { texto: mapa.sobre, links: [link] };
    return { texto: pagina.descricao, links: [link] };
  }
  return null;
}

// Só caminhos do próprio site viram navegação: nada de "javascript:" ou outro domínio
export const ehCaminhoInterno = (href: string) => href.startsWith("/") && !href.startsWith("//");
