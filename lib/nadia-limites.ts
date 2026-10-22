import type { Idioma } from "./idioma.ts";
import { normalizar } from "./nadia.ts";

// O que a NADIA não consegue fazer. Em vez de mandar para o modelo (que inventaria uma
// resposta com cara de certa), ela diz na hora que não faz e por quê.

type Limite = { padrao: RegExp; pt: string; en: string; soSemServidor?: boolean };

const LIMITES: Limite[] = [
  {
    padrao:
      /\b(?:envi[ae]r?|mand[ae]r?)\b.*\b(?:e ?mail|mensagem|whats ?app|zap|sms)\b|\b(?:agend[ae]r?|lembr[ae] me|me lembr[ae]|compr[ae]r?|reserv[ae]r?|lig(?:ue|ar) (?:para|pra))\b|\bsend\b.*\b(?:e ?mail|message|text)\b|\b(?:schedule|remind me|buy|book a)\b/,
    pt: "Isso eu não consigo fazer: não envio mensagens, não agendo, não ligo e não compro nada. Aqui eu respondo perguntas e navego pelo site.",
    en: "I can't do that: I don't send messages, schedule, call or buy anything. Here I answer questions and navigate the site.",
  },
  {
    padrao:
      /\b(?:ger[ae]r?|cri[ae]r?|desenh[ae]r?|mont[ae]r?|fa(?:z|ca)(?: me)? (?:um|uma))\b.*\b(?:imagem|imagens|foto|fotos|desenho|logo|logotipo|video|musica|audio|figurinha)\b|\btoc[ae]r? (?:uma )?musica\b|\b(?:generate|create|draw|make)\b.*\b(?:image|picture|photo|drawing|logo|video|song|music)\b|\bplay (?:a |some )?(?:song|music)\b/,
    pt: "Não gero imagens, áudio nem vídeo: sou um modelo só de texto.",
    en: "I don't generate images, audio or video: I'm a text-only model.",
  },
  {
    padrao:
      /\b(?:escrev[ae]r?|redij[ae]|redigir|elabor[ae]r?|compo(?:r|nha))\b.*\b(?:redacao|texto|poema|poesia|historia|conto|carta|e ?mail|artigo|trabalho|codigo|programa|funcao|script|musica|letra)\b|\b(?:cri[ae]r?|fa(?:z|ca)) (?:me |pra mim )?(?:um|uma)\b.*\b(?:redacao|texto|poema|historia|carta|codigo|programa|funcao|script|site|aplicativo|app)\b|\btraduz(?:a|ir)?\b|\b(?:corrij[ae]|corrigir|revis[ae]r?)\b|\bresum(?:a|ir|e) (?:esse|este|o|um|meu) (?:texto|livro|filme|video)\b|\b(?:write|translate|proofread)\b/,
    pt: "Textos longos, código, traduções e revisões estão além de mim: sou um modelo pequeno (126 milhões de parâmetros) e acabaria inventando. Respondo bem perguntas curtas.",
    en: "Long texts, code, translations and proofreading are beyond me: I'm a small model (126 million parameters) and would end up making things up. I do well with short questions.",
  },
  {
    padrao:
      /\b(?:clima (?:em|de|hoje|agora|amanha)|como (?:esta|ta) o (?:clima|tempo)|previsao do tempo|vai chover|esta chovendo|temperatura (?:em|de|hoje|agora)|cotac(?:ao|oes)|(?:quanto (?:esta|ta|vale|custa)|preco|valor) (?:o |do )?(?:dolar|euro|bitcoin)|(?:dolar|euro|bitcoin) hoje|bolsa de valores|noticias?|placar|resultado do jogo)\b|\b(?:weather|forecast|exchange rate|stock price|news|score)\b/,
    pt: "Aqui no site eu não tenho acesso a dados em tempo real (clima, cotações, notícias), então prefiro não chutar.",
    en: "On this site I have no access to real-time data (weather, prices, news), so I'd rather not guess.",
    soSemServidor: true,
  },
  {
    padrao: /\b(?:convert[ae]r?|converta)\b|\d+(?:[.,]\d+)?\s*(?:km|kg|cm|mm|ml|metros?|quilos?|gramas?|litros?|milhas?|libras?|pes|polegadas?|graus?|celsius|fahrenheit|miles|pounds|feet|inches)\s+(?:em|para|pra|to|in)\b/,
    pt: "Conversão de unidades ainda não funciona aqui no site. Contas eu faço: tente, por exemplo, \"10 * 1,609\" para 10 milhas em km.",
    en: "Unit conversion doesn't work on this site yet. I can do math, though: try \"10 * 1.609\" for 10 miles in km.",
    soSemServidor: true,
  },
  {
    padrao: /\b(?:lembra (?:do que|o que|quando) eu|salv[ae]r?|guard[ae]r?|anot[ae]r?)\b.*\b(?:conversa|isso|disse|falei|nota)\b|\bremember (?:what|this|that)\b/,
    pt: "Não guardo nada entre conversas: quando você fecha a página, eu esqueço tudo.",
    en: "I don't keep anything between conversations: when you close the page, I forget everything.",
  },
  {
    padrao:
      /^(?:qual (?:e )?(?:o |a )?(?:meu|minha)|quantos anos eu|onde eu (?:moro|nasci|trabalho|estudo)|o que eu (?:comi|fiz|vou)|como eu me chamo|quem sou eu|em que cidade eu)\b|^(?:what s|what is) my\b|^(?:where do i|how old am i|who am i)\b/,
    pt: "Não sei nada sobre você: não tenho acesso a dados pessoais e não guardo conversas.",
    en: "I don't know anything about you: I have no access to personal data and keep no conversations.",
  },
  {
    padrao: /\b(?:quem vai (?:ganhar|vencer|ser)|qual vai ser|o que vai acontecer|numeros? da (?:loteria|mega ?sena)|who will win|what will happen)\b/,
    pt: "Não tenho como prever o futuro.",
    en: "I have no way to predict the future.",
  },
];

// Pedido que a NADIA não atende, com o motivo; null quando ela pode tentar
export function verificarLimites(mensagem: string, lang: Idioma, temServidor = false): string | null {
  const t = normalizar(mensagem);
  const limite = LIMITES.find((l) => !(temServidor && l.soSemServidor) && l.padrao.test(t));
  return limite ? limite[lang] : null;
}

// O modelo só aprendeu português: pergunta em inglês volta com aviso em vez de resposta torta
const EN = /\b(?:the|what|who|how|why|where|when|is|are|do|does|did|can|could|you|your|of|and|tell|me|please)\b/g;
const PT = /\b(?:o|a|os|as|e|de|do|da|que|um|uma|nao|como|qual|quem|por|para|voce|eu|me|sobre|tem|esta|sao)\b/g;
export function pareceIngles(mensagem: string) {
  const t = normalizar(mensagem);
  return (t.match(EN)?.length ?? 0) >= 2 && (t.match(PT)?.length ?? 0) <= 1;
}

export const AVISO_INGLES = {
  pt: "O meu modelo de linguagem só entende português. Pergunte de novo em português, ou peça uma página do site.",
  en: "My language model only understands Portuguese. Try asking in Portuguese (\"Qual é a capital do Japão?\"), or ask me for a page or a project.",
};
