import CabecalhoPagina from "@/components/CabecalhoPagina";
import Cubos from "@/components/Cubos";
import Seta from "@/components/Seta";
import { textos } from "@/lib/textos";
import { idiomaDa, metadadosDa } from "../pagina";

export const generateMetadata = metadadosDa("sobre");

export default async function SobrePage({ params }: PageProps<"/[lang]/sobre">) {
  const lang = await idiomaDa(params);
  const t = textos[lang];
  const formacao = t.experiencias.itens[1];

  return (
    <>
      <CabecalhoPagina voltar={{ href: `/${lang}`, rotulo: t.voltarInicio }} pagina="sobre" titulo={t.sobre.titulo} intro={t.paginas.sobre} />
      <div className="tracejado">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[1.5fr_1fr]">
          <div className="max-w-[62ch] space-y-6 text-lg leading-relaxed">
            {t.sobre.paragrafos.map((paragrafo) => (
              <p key={paragrafo}>{paragrafo}</p>
            ))}
            <a href={t.curriculo.href} className="!mt-10 inline-flex items-center gap-2 rounded-lg bg-texto px-5 py-3 text-sm font-semibold text-fundo hover:opacity-90">
              {t.curriculo.rotulo} <Seta />
            </a>
          </div>
          <div className="space-y-8 self-start">
            <Cubos />
            <dl className="cartao grid grid-cols-[auto_1fr] gap-x-6 gap-y-4 p-6">
              <dt className="text-suave">{t.sobre.rotulos.local}</dt>
              <dd>{t.sobre.local}</dd>
              <dt className="text-suave">{t.sobre.rotulos.formacao}</dt>
              <dd>
                {formacao.titulo} ({formacao.periodo})
              </dd>
              <dt className="text-suave">{t.sobre.rotulos.idiomas}</dt>
              <dd>{t.experiencias.idiomas}</dd>
            </dl>
          </div>
        </div>
      </div>
    </>
  );
}
