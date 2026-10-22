import type { Idioma } from "./idioma.ts";

// A NADIA do site responde em duas camadas, como o chat original: o que é sobre o site
// (páginas, projetos, contato) sai daqui, exato e na hora; o resto vai para o modelo.

export type LinkNadia = { href: string; rotulo: string };

// Um trecho do conteúdo do site (parágrafo do "sobre", experiência, tecnologia, projeto...),
// com palavras extras que ajudam a achá-lo
export type FatoSite = { texto: string; link?: LinkNadia; chaves?: string };

export type MapaSite = {
  paginas: { secao: string; href: string; rotulo: string; descricao: string }[];
  projetos: { slug: string; href: string; titulo: string; resumo: string; tecnologias?: string[] }[];
  contatos: { rotulo: string; href: string; usuario: string }[];
  artigos: { titulo: string; resumo: string; href: string; projeto?: string }[];
  curriculo: LinkNadia;
  sobre: string;
  fatos: FatoSite[];
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
  // "sobre" sozinho pegava "me fale sobre Python"; "joao" sozinho pegava qualquer pergunta sobre ele
  sobre: ["sobre (?:mim|ele|o joao)", "quem e (?:o )?joao", "about (?:me|him|joao)", "who is joao", "biografia", "bio"],
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
// "resume" é currículo em inglês, mas "resumir" em português ("resume o artigo sobre TEA")
const CURRICULO = { pt: ["curriculo", "cv"], en: ["resume", "cv", "curriculum"] };
const ARTIGO = ["artigos?", "publicac(?:ao|oes)", "papers?", "articles?", "publications?"];

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
      "Aqui no site, eu levo você às páginas (\"me leva aos projetos\"), conto sobre cada projeto e artigo (\"resume o artigo sobre TEA\") e passo os contatos do João. Também faço contas, digo a data e a hora e busco definições na Wikipédia. O resto vai para o meu modelo de linguagem, treinado do zero: perguntas curtas de conhecimento geral, em português. Não envio mensagens, não gero imagens nem textos longos e não vejo clima, cotações ou notícias.",
    abrindo: (rotulo: string) => `Abrindo ${rotulo}.`,
    projetos: "Estes são os projetos do João:",
    projetosCom: "Os projetos do João que usam isso:",
    contato: "Você pode falar com o João por aqui. Ele responde pelo e-mail.",
    contatoSemEnvio: "Eu não envio mensagens, mas você pode falar com o João direto por aqui. Ele responde pelo e-mail.",
    curriculo: "O currículo do João está neste PDF:",
    verProjeto: "Ver o projeto",
    lerArtigo: "Ler o artigo",
  },
  en: {
    ola: "Hi! I'm NADIA. I can show you the projects, tell you about João and take you to any page of the site. I also chat about other topics with the model he trained from scratch (that part only speaks Portuguese).",
    ajuda:
      "On this site, I take you to pages (\"take me to the projects\"), explain each project and paper (\"summarize the paper on autism\") and share João's contacts. I also do math, tell the date and time and look up definitions on Portuguese Wikipedia. Anything else goes to my language model, trained from scratch, which only handles short general-knowledge questions in Portuguese. I don't send messages, generate images or long texts, or see weather, prices or news.",
    abrindo: (rotulo: string) => `Opening ${rotulo}.`,
    projetos: "These are João's projects:",
    projetosCom: "João's projects that use it:",
    contato: "You can reach João here. He replies by e-mail.",
    contatoSemEnvio: "I can't send messages, but you can reach João directly here. He replies by e-mail.",
    curriculo: "João's resume is in this PDF:",
    verProjeto: "See the project",
    lerArtigo: "Read the paper",
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

  const nomesDo = (slug: string) => {
    const p = mapa.projetos.find((x) => x.slug === slug);
    return [slug.replace(/-/g, " "), ...(p ? [normalizar(p.titulo)] : []), ...(APELIDOS[slug] ?? [])];
  };

  // Artigo de um assunto ("resume o artigo sobre TEA"): resumo publicado + link
  if (tem(t, ARTIGO)) {
    const artigo = mapa.artigos.find((a) => a.projeto && tem(t, nomesDo(a.projeto)));
    if (artigo) {
      const projeto = mapa.projetos.find((p) => p.slug === artigo.projeto);
      return {
        texto: `${artigo.titulo}\n\n${artigo.resumo}`,
        links: [{ href: artigo.href, rotulo: tx.lerArtigo }, ...(projeto ? [{ href: projeto.href, rotulo: tx.verProjeto }] : [])],
      };
    }
  }

  if (tem(t, CURRICULO[lang])) return { texto: tx.curriculo, links: [mapa.curriculo] };

  const projeto = mapa.projetos.find((p) => tem(t, nomesDo(p.slug)));
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
    if (pagina.secao === "projetos") {
      // "Quais projetos usam React?": só os que usam a tecnologia citada
      const comTec = mapa.projetos.filter((p) => p.tecnologias?.some((tec) => tem(t, [normalizar(tec)])));
      const lista = comTec.length ? comTec : mapa.projetos;
      return { texto: comTec.length ? tx.projetosCom : tx.projetos, links: [...lista.map((p) => ({ href: p.href, rotulo: p.titulo })), link] };
    }
    if (pagina.secao === "contato")
      return { texto: /\b(?:envi|mand|send)/.test(t) ? tx.contatoSemEnvio : tx.contato, links: [...mapa.contatos.map((c) => ({ href: c.href, rotulo: `${c.rotulo}: ${c.usuario}` })), link] };
    if (pagina.secao === "sobre") return { texto: mapa.sobre, links: [link] };
    // "Quais tecnologias ele usa?", "Onde ele trabalha?": o trecho certo vale mais que a descrição da página
    const fato = !navegar && ["conhecimento", "experiencias", "certificados", "artigos"].includes(secao) ? buscarFato(mensagem, mapa.fatos) : null;
    return fato ? { texto: fato.texto, links: [fato.link ?? link] } : { texto: pagina.descricao, links: [link] };
  }

  // Perguntas sobre o João ou o site que não são uma página inteira: um trecho do conteúdo
  if (ANCORA.test(t)) {
    const fato = buscarFato(mensagem, mapa.fatos);
    if (fato) return { texto: fato.texto, links: fato.link ? [fato.link] : [] };
  }
  return null;
}

// Palavras que não ajudam a achar o assunto (perguntas, artigos, pronomes, o próprio "João")
const PARADAS = new Set(
  ("o a os as um uma uns umas de do da dos das em no na nos nas por pelo pela para pra com sem e ou que qual quais quem como onde " +
    "quando quanto quantos quantas porque se ja tem ter tenho eh esse essa isso este esta isto aquele ele ela eles elas dele dela " +
    "joao seu sua seus suas meu minha voce vc me te lhe sim nao mais muito sobre ao aos ate foi ser sao era fala falar diz dizer " +
    "conta contar sabe saber pode posso quero queria gostaria aqui alguma algum coisa coisas faz fazer ja " +
    "the an of to in on at for with and or what which who how where when why is are was were do does did can could you your " +
    "he his him it this that these those about tell please any some").split(" "),
);
const ANCORA = /\b(?:joao|ele|dele|site|portfolio|pagina|aqui|he|his|him)\b/;

// Busca simples no conteúdo do site: o trecho que mais cobre as palavras da pergunta, com peso
// maior para palavras raras. Compara pelo começo da palavra ("estuda" acha "estudante").
export function buscarFato(pergunta: string, fatos: FatoSite[]): FatoSite | null {
  const termos = [...new Set(normalizar(pergunta).split(" "))].filter((p) => p.length > 1 && !PARADAS.has(p));
  if (!termos.length || !fatos.length) return null;
  const raiz = (p: string) => (p.length <= 4 ? p : p.slice(0, Math.max(4, p.length - 4)));
  const docs = fatos.map((f) => normalizar(`${f.texto} ${f.chaves ?? ""}`).split(" "));
  const casa = (termo: string, palavras: string[]) => palavras.some((p) => p.startsWith(raiz(termo)));
  const peso = Object.fromEntries(termos.map((t) => [t, Math.log(1 + fatos.length / (1 + docs.filter((d) => casa(t, d)).length))]));
  let melhor: { fato: FatoSite; nota: number } | null = null;
  docs.forEach((palavras, i) => {
    const achados = termos.filter((t) => casa(t, palavras));
    if (achados.length < Math.ceil(termos.length / 2)) return;
    // Bônus quando o termo está no começo, que é onde fica o título ("Estágio (Atual): ...")
    const nota = achados.reduce((s, t) => s + peso[t] * (casa(t, palavras.slice(0, 3)) ? 1.5 : 1), 0);
    if (!melhor || nota > melhor.nota) melhor = { fato: fatos[i], nota };
  });
  return melhor ? (melhor as { fato: FatoSite }).fato : null;
}

// Só caminhos do próprio site viram navegação: nada de "javascript:" ou outro domínio
export const ehCaminhoInterno = (href: string) => href.startsWith("/") && !href.startsWith("//");
