import { paginas } from "@/components/Header";
import { certificados } from "@/content/certificados";
import { publicacoes } from "@/content/publicacoes";
import { getProjetos } from "./conteudo";
import type { Idioma } from "./idioma";
import type { FatoSite, MapaSite } from "./nadia";
import { grupos } from "./skills";
import { contatos, textos } from "./textos";

// Tudo o que a NADIA sabe do site, montado no servidor a partir do mesmo conteúdo das
// páginas: mudou um texto do site, ela já responde com o texto novo.
export async function mapaDaNadia(lang: Idioma): Promise<MapaSite> {
  const t = textos[lang];
  const pt = lang === "pt";
  const projetos = await getProjetos(lang);
  const link = (secao: (typeof paginas)[number]) => ({ href: `/${lang}/${secao}`, rotulo: t.nav[secao] });
  const nomesSkills = grupos.flatMap(([, itens]) => itens);
  // Textos em primeira pessoa (do João) aparecem citados, com a página de onde vêm
  const citacao = (pagina: (typeof paginas)[number], texto: string) => `${t.nav[pagina]}: “${texto}”`;

  const fatos: FatoSite[] = [
    {
      texto: pt
        ? "Este é o portfólio do João Victor da Silva Alves, estudante de Engenharia da Computação na Universidade Ceuma. Ele fez o site com Next.js, React, MDX e Tailwind, em português e inglês, para reunir os projetos, os artigos, os certificados e as tecnologias com que trabalha. Eu sou a NADIA, a assistente do site: um modelo de linguagem que ele treinou do zero."
        : "This is the portfolio of João Victor da Silva Alves, a Computer Engineering student at Universidade Ceuma, Brazil. He built the site with Next.js, React, MDX and Tailwind, in Portuguese and English, to gather his projects, papers, certificates and the technologies he works with. I'm NADIA, the site's assistant: a language model he trained from scratch.",
      link: { href: `/${lang}`, rotulo: t.nav.inicio },
      chaves: "site portfolio pagina feito fez construiu criou codigo website built made",
    },
    ...t.sobre.paragrafos.map((texto) => ({ texto: citacao("sobre", texto), link: link("sobre") })),
    { texto: `${t.sobre.rotulos.local}: ${t.sobre.local}.`, link: link("sobre"), chaves: "mora cidade lives city where" },
    { texto: `${t.sobre.rotulos.idiomas}: ${t.experiencias.idiomas}`, link: link("experiencias"), chaves: "idiomas languages fala speaks" },
    ...t.experiencias.itens.map((e) => ({ texto: `${e.titulo} (${e.periodo}): “${e.texto}”`, link: link("experiencias") })),
    {
      texto: `${pt ? "Tecnologias com que o João trabalha" : "Technologies João works with"}: ${nomesSkills.map(([, nome]) => nome).join(", ")}.`,
      link: link("conhecimento"),
      chaves: "tecnologias linguagens sabe usa conhece programa stack skills technologies languages uses knows",
    },
    ...nomesSkills.map(([chave, nome]) => ({ texto: `${nome}: ${t.conhecimento.skills[chave as keyof typeof t.conhecimento.skills]}`, link: link("conhecimento") })),
    ...projetos.map((p) => ({
      texto: `${p.titulo}: ${p.resumo} ${pt ? "Tecnologias" : "Technologies"}: ${p.tecnologias.join(", ")}.`,
      link: { href: `/${lang}/projetos/${p.slug}`, rotulo: p.titulo },
    })),
    {
      texto: `${t.nav.certificados}: ${certificados.map((c) => c[lang].titulo).join(", ")}.`,
      link: link("certificados"),
      chaves: "certificados cursos certificates courses quais tem",
    },
    {
      texto: `${t.nav.artigos}: ${publicacoes.map((a) => `“${a.titulo}” (${a.ano})`).join("; ")}.`,
      link: link("artigos"),
      chaves: "artigos publicou publicados publicacoes papers articles published quais tem",
    },
    ...certificados.map((c) => ({ texto: `${c[lang].titulo}: ${c[lang].descricao}`, link: link("certificados"), chaves: "certificado curso certificate course" })),
  ];

  return {
    paginas: paginas.map((secao) => ({ secao, href: `/${lang}/${secao}`, rotulo: t.nav[secao], descricao: t.paginas[secao] })),
    projetos: projetos.map((p) => ({ slug: p.slug, href: `/${lang}/projetos/${p.slug}`, titulo: p.titulo, resumo: p.resumo, tecnologias: p.tecnologias })),
    contatos: contatos.map(({ rotulo, href, usuario }) => ({ rotulo, href, usuario })),
    artigos: publicacoes.map((a) => ({ titulo: a.titulo, resumo: a.resumo[lang], href: a.link, projeto: a.projeto })),
    curriculo: t.curriculo,
    sobre: t.sobre.texto,
    fatos,
  };
}
