import CabecalhoPagina from "@/components/CabecalhoPagina";
import Icone from "@/components/Icone";
import Seta from "@/components/Seta";
import { contatos, textos } from "@/lib/textos";
import { idiomaDa, metadadosDa } from "../pagina";

export const generateMetadata = metadadosDa("contato");

export default async function ContatoPage({ params }: PageProps<"/[lang]/contato">) {
  const lang = await idiomaDa(params);
  const t = textos[lang];
  // O e-mail já é o destaque da página; os cartões ficam com as redes e o currículo
  const cartoes = [
    ...contatos.filter((contato) => contato.icone !== "email"),
    { icone: "curriculo", rotulo: t.contato.curriculo, href: t.curriculo.href, usuario: "PDF" },
  ] as const;

  return (
    <>
      <CabecalhoPagina voltar={{ href: `/${lang}`, rotulo: textos[lang].voltarInicio }} pagina="contato" titulo={t.contato.chamada} intro={t.contato.texto} />
      <div className="tracejado">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
          <a href="mailto:jvdasilva25@gmail.com" className="inline-flex items-center gap-3 sm:gap-4">
            <span className="grid size-10 shrink-0 place-items-center rounded-full degrade text-white sm:size-14">
              <Icone nome="email" className="size-6" />
            </span>
            <span className="break-all text-xl font-semibold degrade-texto sm:text-5xl">jvdasilva25@gmail.com</span>
          </a>
          <ul className="mt-12 grid gap-4 sm:grid-cols-2">
            {cartoes.map((cartao) => (
              <li key={cartao.rotulo}>
                <a href={cartao.href} className="cartao group flex items-center gap-4 p-5 hover:border-roxo">
                  <span className="grid size-11 shrink-0 place-items-center rounded-full border border-borda text-suave group-hover:border-roxo group-hover:text-roxo">
                    <Icone nome={cartao.icone} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold">{cartao.rotulo}</span>
                    <span className="block truncate text-sm text-suave">{cartao.usuario}</span>
                  </span>
                  <span className="text-suave group-hover:text-roxo">
                    <Seta />
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
