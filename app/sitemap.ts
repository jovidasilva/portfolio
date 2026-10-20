import type { MetadataRoute } from "next";
import { paginas } from "@/components/Header";
import { getArtigos, getProjetos } from "@/lib/conteudo";

const site = "https://jovidasilva.com.br";

// Cada página aparece nos dois idiomas, ligadas entre si por hreflang
function entrada(caminho: string, lastModified?: string): MetadataRoute.Sitemap {
  const languages = { "pt-BR": `${site}/pt${caminho}`, en: `${site}/en${caminho}` };
  return Object.values(languages).map((url) => ({ url, lastModified, alternates: { languages } }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projetos = await getProjetos("pt");
  const artigos = await getArtigos("pt");
  return [
    ...["", ...paginas.map((pagina) => `/${pagina}`)].flatMap((caminho) => entrada(caminho)),
    ...projetos.flatMap((projeto) => entrada(`/projetos/${projeto.slug}`, projeto.data)),
    ...artigos.flatMap((artigo) => entrada(`/artigos/${artigo.slug}`, artigo.data)),
  ];
}
