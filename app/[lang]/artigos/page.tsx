import Link from "next/link";
import CabecalhoPagina from "@/components/CabecalhoPagina";
import Seta from "@/components/Seta";
import { publicacoes } from "@/content/publicacoes";
import { textos } from "@/lib/textos";
import { idiomaDa, metadadosDa } from "../pagina";

export const generateMetadata = metadadosDa("artigos");

export default async function ArtigosPage({ params }: PageProps<"/[lang]/artigos">) {
  const lang = await idiomaDa(params);
  const t = textos[lang];

  return (
    <>
      <CabecalhoPagina voltar={{ href: `/${lang}`, rotulo: textos[lang].voltarInicio }} pagina="artigos" titulo={t.artigos.titulo} intro={t.paginas.artigos} cor="azul" />
      <div className="tracejado">
        <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
          <ul className="grid gap-5">
            {publicacoes.map((publicacao) => (
              <li key={publicacao.link} className="cartao p-6">
                <p className="text-sm text-suave">
                  {publicacao.veiculo}, {publicacao.ano}
                </p>
                <h2 className="mt-3 max-w-[70ch] text-lg font-semibold">
                  <a href={publicacao.link} className="hover:text-roxo">
                    {publicacao.titulo}
                  </a>
                </h2>
                <p className="mt-3 max-w-[70ch] leading-relaxed">{publicacao.resumo[lang]}</p>
                <p className="mt-3 text-sm text-suave">
                  {publicacao.autores.split(/(João Victor da Silva Alves)/).map((parte, i) => (i % 2 ? <strong key={i} className="font-semibold text-texto">{parte}</strong> : parte))}
                </p>
                <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                  <a href={publicacao.link} className="-my-2 flex items-center gap-2 py-2 text-roxo hover:underline">
                    {t.artigos.ler} <Seta />
                  </a>
                  {publicacao.projeto && (
                    <Link href={`/${lang}/projetos/${publicacao.projeto}`} className="-my-2 py-2 text-roxo hover:underline">
                      {t.artigos.verProjeto}
                    </Link>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
