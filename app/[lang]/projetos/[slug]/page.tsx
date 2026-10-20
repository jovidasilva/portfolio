import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import Seta from "@/components/Seta";
import Tecnologias from "@/components/Tecnologias";
import Voltar from "@/components/Voltar";
import { carregarMdx, listarSlugs } from "@/lib/conteudo";
import { ehIdioma, idiomas } from "@/lib/idioma";
import { textos } from "@/lib/textos";

// Todos os slugs já são gerados no build; isto só desliga o aviso de "navegação instantânea" do modo dev
export const instant = false;

export function generateStaticParams() {
  return idiomas.flatMap((lang) => listarSlugs(lang, "projetos").map((slug) => ({ lang, slug })));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/projetos/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!ehIdioma(lang)) return {};
  const { metadata } = await carregarMdx(lang, "projetos", slug);
  return {
    title: metadata.titulo,
    description: metadata.resumo,
    alternates: { languages: { "pt-BR": `/pt/projetos/${slug}`, en: `/en/projetos/${slug}` } },
  };
}

export default async function ProjetoPage({ params }: PageProps<"/[lang]/projetos/[slug]">) {
  const { lang, slug } = await params;
  if (!ehIdioma(lang)) notFound();
  const t = textos[lang];
  const { default: Conteudo, metadata } = await carregarMdx(lang, "projetos", slug);

  return (
    <article>
      <header className="brilho">
        <div className="mx-auto max-w-6xl px-5 pb-12 pt-8 sm:px-8 sm:pt-10">
          <Voltar href={`/${lang}/projetos`} rotulo={t.projetos.voltar} />
          <p className="mt-10 text-sm text-suave">
            {t.areas[metadata.area as keyof typeof t.areas]}, {metadata.data.slice(0, 4)}
          </p>
          <h1 className="mt-3 font-pixel text-5xl leading-[1.05] sm:text-7xl">{metadata.titulo}</h1>
          <p className="mt-6 max-w-[60ch] text-lg leading-relaxed">{metadata.resumo}</p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            {metadata.repo ? (
              <a href={`https://github.com/jovidasilva/${metadata.repo}`} className="inline-flex items-center gap-2 rounded-lg bg-texto px-5 py-3 text-sm font-semibold text-fundo hover:opacity-90">
                {t.projetos.acessar} <Seta />
              </a>
            ) : (
              <span className="inline-flex items-center gap-2 rounded-lg border border-dashed border-borda px-4 py-3 text-sm text-suave">
                <svg aria-hidden viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="7" width="10" height="7" rx="1.5" />
                  <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" />
                </svg>
                {t.projetos.privado}
              </span>
            )}
          </div>
          <h2 className="mt-10 text-sm text-suave">{t.projetos.tecnologias}</h2>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            {metadata.icones?.map((icone: string) => (
              <Image key={icone} src={`/skills/${icone}.svg`} alt="" width={40} height={40} />
            ))}
            <Tecnologias lista={metadata.tecnologias} rotulo={t.projetos.tecnologias} />
          </div>
        </div>
      </header>
      <div className="tracejado">
        <div className="prose mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:prose-lg prose-headings:font-pixel prose-headings:font-normal">
          <div className="max-w-[70ch]">
            <Conteudo />
          </div>
        </div>
      </div>
    </article>
  );
}
