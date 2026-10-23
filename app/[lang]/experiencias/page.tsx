import CabecalhoPagina from "@/components/CabecalhoPagina";
import { textos } from "@/lib/textos";
import { idiomaDa, metadadosDa } from "../pagina";

export const generateMetadata = metadadosDa("experiencias");

export default async function ExperienciasPage({ params }: PageProps<"/[lang]/experiencias">) {
  const lang = await idiomaDa(params);
  const t = textos[lang].experiencias;

  return (
    <>
      <CabecalhoPagina voltar={{ href: `/${lang}`, rotulo: textos[lang].voltarInicio }} pagina="experiencias" titulo={t.titulo} intro={textos[lang].paginas.experiencias} />
      <div className="tracejado">
        <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
          <ol className="border-l border-dashed border-borda">
            {t.itens.map((item) => (
              <li key={item.titulo} className="relative grid gap-x-10 gap-y-2 pb-14 pl-8 last:pb-0 lg:grid-cols-[20rem_1fr]">
                <span aria-hidden className="degrade absolute -left-[6px] top-1.5 size-3" />
                <div>
                  <p className="font-pixel text-sm degrade-texto">{item.periodo}</p>
                  <h2 className="mt-1 text-lg font-semibold">{item.titulo}</h2>
                </div>
                <p className="max-w-[62ch] text-lg leading-relaxed text-suave">{item.texto}</p>
              </li>
            ))}
          </ol>
          <p className="mt-14 border-t border-dashed border-borda pt-8 text-suave">{t.idiomas}</p>
        </div>
      </div>
    </>
  );
}
