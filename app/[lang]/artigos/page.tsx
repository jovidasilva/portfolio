import Link from "next/link";
import CabecalhoPagina from "@/components/CabecalhoPagina";
import { formatarData, getArtigos } from "@/lib/conteudo";
import { textos } from "@/lib/textos";
import { idiomaDa, metadadosDa } from "../pagina";

export const generateMetadata = metadadosDa("artigos");

export default async function ArtigosPage({ params }: PageProps<"/[lang]/artigos">) {
  const lang = await idiomaDa(params);
  const t = textos[lang];
  const artigos = await getArtigos(lang);

  return (
    <>
      <CabecalhoPagina voltar={{ href: `/${lang}`, rotulo: textos[lang].voltarInicio }} pagina="artigos" titulo={t.artigos.titulo} intro={t.paginas.artigos} cor="azul" />
      <div className="tracejado">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
          <ul className="grid gap-5 sm:grid-cols-2">
            {artigos.map((artigo) => (
              <li key={artigo.slug} className="cartao relative p-6 hover:border-roxo">
                <time dateTime={artigo.data} className="text-sm text-suave">
                  {formatarData(artigo.data, lang)}
                </time>
                <h2 className="mt-3 font-pixel text-xl">
                  <Link href={`/${lang}/artigos/${artigo.slug}`} className="after:absolute after:inset-0">
                    {artigo.titulo}
                  </Link>
                </h2>
                <p className="mt-2 text-sm text-suave">{artigo.resumo}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
