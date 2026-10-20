import CabecalhoPagina from "@/components/CabecalhoPagina";
import Painel from "@/components/Painel";
import Projetos from "@/components/Projetos";
import { getProjetos } from "@/lib/conteudo";
import { textos } from "@/lib/textos";
import { idiomaDa, metadadosDa } from "../pagina";

export const generateMetadata = metadadosDa("projetos");

export default async function ProjetosPage({ params }: PageProps<"/[lang]/projetos">) {
  const lang = await idiomaDa(params);
  const t = textos[lang];
  const projetos = await getProjetos(lang);

  return (
    <>
      <CabecalhoPagina voltar={{ href: `/${lang}`, rotulo: textos[lang].voltarInicio }} pagina="projetos" titulo={t.projetos.titulo} intro={t.paginas.projetos} cor="azul" />
      <div className="tracejado">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
          <Projetos projetos={projetos} lang={lang} areas={t.areas} rotulos={{ todos: t.projetos.todos, filtro: t.projetos.filtro, detalhes: t.projetos.detalhes }} />
        </div>
      </div>
      <section aria-labelledby="atividade" className="tracejado">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
          <div className="mb-8 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
            <h2 id="atividade" className="font-pixel text-3xl">
              {t.painel.titulo}
            </h2>
            <p className="text-sm text-suave">{t.painel.fonte}</p>
          </div>
          <Painel lang={lang} />
        </div>
      </section>
    </>
  );
}
