import type { Metadata } from "next";
import Voltar from "@/components/Voltar";
import { notFound } from "next/navigation";
import Tecnologias from "@/components/Tecnologias";
import { carregarMdx, formatarData, listarSlugs } from "@/lib/conteudo";
import { ehIdioma, idiomas } from "@/lib/idioma";
import { textos } from "@/lib/textos";

// Todos os slugs já são gerados no build; isto só desliga o aviso de "navegação instantânea" do modo dev
export const instant = false;

export function generateStaticParams() {
  return idiomas.flatMap((lang) => listarSlugs(lang, "artigos").map((slug) => ({ lang, slug })));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/artigos/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!ehIdioma(lang)) return {};
  const { metadata } = await carregarMdx(lang, "artigos", slug);
  return {
    title: metadata.titulo,
    description: metadata.resumo,
    alternates: { languages: { "pt-BR": `/pt/artigos/${slug}`, en: `/en/artigos/${slug}` } },
  };
}

export default async function ArtigoPage({ params }: PageProps<"/[lang]/artigos/[slug]">) {
  const { lang, slug } = await params;
  if (!ehIdioma(lang)) notFound();
  const t = textos[lang];
  const { default: Conteudo, metadata } = await carregarMdx(lang, "artigos", slug);

  return (
    <article>
      <header className="brilho">
        <div className="mx-auto max-w-6xl px-5 pb-10 pt-8 sm:px-8 sm:pt-10">
          <Voltar href={`/${lang}/artigos`} rotulo={t.artigos.voltar} />
          <h1 className="mt-10 max-w-[18ch] font-pixel text-4xl leading-[1.1] sm:text-6xl">{metadata.titulo}</h1>
          <p className="mt-6 text-suave">
            <time dateTime={metadata.data}>{formatarData(metadata.data, lang)}</time>
          </p>
          <Tecnologias lista={metadata.tags} rotulo="Tags" className="mt-4" />
        </div>
      </header>
      <div className="tracejado">
        <div className="prose mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:prose-lg prose-headings:font-pixel prose-headings:font-normal">
          <div className="max-w-[70ch]">
            <Conteudo />
          </div>
        </div>
      </div>
    </article>
  );
}
