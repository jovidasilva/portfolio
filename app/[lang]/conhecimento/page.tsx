import CabecalhoPagina from "@/components/CabecalhoPagina";
import Conhecimento from "@/components/Conhecimento";
import { textos } from "@/lib/textos";
import { idiomaDa, metadadosDa } from "../pagina";

export const generateMetadata = metadadosDa("conhecimento");

export default async function ConhecimentoPage({ params }: PageProps<"/[lang]/conhecimento">) {
  const lang = await idiomaDa(params);
  const t = textos[lang].conhecimento;

  return (
    <>
      <CabecalhoPagina voltar={{ href: `/${lang}`, rotulo: textos[lang].voltarInicio }} pagina="conhecimento" titulo={t.titulo} intro={textos[lang].paginas.conhecimento} cor="azul" />
      <div className="tracejado">
        <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
          <Conhecimento dica={t.dica} titulos={t.grupos} descricoes={t.skills} />
        </div>
      </div>
    </>
  );
}
