import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ehIdioma } from "@/lib/idioma";
import { textos } from "@/lib/textos";

type Secao = "sobre" | "conhecimento" | "experiencias" | "projetos" | "certificados" | "artigos" | "contato";

// Lê e valida o idioma da rota (idioma inválido vira 404)
export async function idiomaDa(params: Promise<{ lang: string }>) {
  const { lang } = await params;
  if (!ehIdioma(lang)) notFound();
  return lang;
}

// Título, descrição e versões nos dois idiomas de uma página do menu
export function metadadosDa(secao: Secao) {
  return async ({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> => {
    const { lang } = await params;
    if (!ehIdioma(lang)) return {};
    return {
      title: textos[lang].nav[secao],
      description: textos[lang].paginas[secao],
      alternates: { languages: { "pt-BR": `/pt/${secao}`, en: `/en/${secao}` } },
    };
  };
}
