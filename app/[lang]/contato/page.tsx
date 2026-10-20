import CabecalhoPagina from "@/components/CabecalhoPagina";
import Seta from "@/components/Seta";
import { textos } from "@/lib/textos";
import { idiomaDa, metadadosDa } from "../pagina";

export const generateMetadata = metadadosDa("contato");

export default async function ContatoPage({ params }: PageProps<"/[lang]/contato">) {
  const lang = await idiomaDa(params);
  const t = textos[lang];
  const links = [
    { href: t.linkedin, rotulo: "LinkedIn" },
    { href: "https://github.com/jovidasilva", rotulo: "GitHub" },
    { href: t.curriculo.href, rotulo: t.contato.curriculo },
  ];

  return (
    <>
      <CabecalhoPagina voltar={{ href: `/${lang}`, rotulo: textos[lang].voltarInicio }} pagina="contato" titulo={t.contato.chamada} intro={t.contato.texto} />
      <div className="tracejado">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
          <a href="mailto:jvdasilva25@gmail.com" className="inline-block break-all text-3xl font-semibold degrade-texto sm:text-5xl">
            jvdasilva25@gmail.com
          </a>
          <ul className="mt-12 flex flex-wrap gap-3">
            {links.map((link) => (
              <li key={link.rotulo}>
                <a href={link.href} className="flex items-center gap-2 rounded-lg border border-borda px-5 py-3 hover:border-roxo">
                  {link.rotulo} <Seta />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
