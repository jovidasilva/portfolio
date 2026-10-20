import type { MetadataRoute } from "next";
import { getArtigos, getProjetos } from "@/lib/conteudo";

const site = "https://jovidasilva.com.br";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const paginas = ["", "/projetos", "/artigos", "/sobre", "/uses", "/contato"].map((pagina) => ({
    url: `${site}${pagina}`,
  }));
  const projetos = (await getProjetos()).map((projeto) => ({
    url: `${site}/projetos/${projeto.slug}`,
    lastModified: projeto.data,
  }));
  const artigos = (await getArtigos()).map((artigo) => ({
    url: `${site}/artigos/${artigo.slug}`,
    lastModified: artigo.data,
  }));
  return [...paginas, ...projetos, ...artigos];
}
