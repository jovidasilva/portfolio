import CabecalhoPagina from "@/components/CabecalhoPagina";
import Seta from "@/components/Seta";
import { certificados } from "@/content/certificados";
import { formatarData } from "@/lib/conteudo";
import { textos } from "@/lib/textos";
import { idiomaDa, metadadosDa } from "../pagina";

export const generateMetadata = metadadosDa("certificados");

const ehImagem = (arquivo?: string) => /\.(png|jpe?g|webp)$/i.test(arquivo ?? "");

export default async function CertificadosPage({ params }: PageProps<"/[lang]/certificados">) {
  const lang = await idiomaDa(params);
  const t = textos[lang];
  const lista = [...certificados].sort((a, b) => b.data.localeCompare(a.data));

  return (
    <>
      <CabecalhoPagina voltar={{ href: `/${lang}`, rotulo: textos[lang].voltarInicio }} pagina="certificados" titulo={t.nav.certificados} intro={t.paginas.certificados} />
      <div className="tracejado">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
          {lista.length === 0 ? (
            <p className="cartao max-w-2xl p-8 text-lg text-suave">
              {t.certificados.vazio}{" "}
              <a href={t.linkedin} className="text-roxo underline underline-offset-4">
                LinkedIn
              </a>
            </p>
          ) : (
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {lista.map((certificado) => (
                <li key={certificado.titulo + certificado.data} className="cartao flex flex-col overflow-hidden">
                  {ehImagem(certificado.arquivo) && (
                    // eslint-disable-next-line @next/next/no-img-element -- imagens variadas em public, sem tamanho fixo
                    <img src={certificado.arquivo} alt="" className="aspect-[4/3] w-full border-b border-borda object-cover" />
                  )}
                  <div className="flex flex-1 flex-col p-6">
                    <time dateTime={certificado.data} className="text-sm text-suave">
                      {formatarData(certificado.data, lang)}
                    </time>
                    <h2 className="mt-2 font-semibold">{certificado.titulo}</h2>
                    <p className="mt-1 text-sm text-suave">
                      {t.certificados.emitidoPor} {certificado.emissor}
                    </p>
                    {(certificado.link ?? certificado.arquivo) && (
                      <a href={certificado.link ?? certificado.arquivo} className="mt-auto flex items-center gap-2 pt-6 text-sm text-roxo hover:underline">
                        {t.certificados.ver} <Seta />
                      </a>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
