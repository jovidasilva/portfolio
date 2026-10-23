import Link from "next/link";
import type { Idioma } from "@/lib/idioma";
import { textos } from "@/lib/textos";
import NavLinks from "./NavLinks";
import TrocarIdioma from "./TrocarIdioma";
import TrocarTema from "./TrocarTema";

export const paginas = ["sobre", "conhecimento", "experiencias", "projetos", "certificados", "artigos", "contato"] as const;

export default function Header({ lang }: { lang: Idioma }) {
  const t = textos[lang];

  return (
    <header className="sticky top-0 z-40 border-b border-dashed border-borda bg-fundo/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-3 gap-y-3 px-5 py-3 sm:px-8 xl:gap-x-6 xl:py-4">
        <Link href={`/${lang}`} className="-my-2 mr-auto py-2 font-pixel text-lg degrade-texto sm:text-xl">
          {t.nav.inicio}
        </Link>
        <NavLinks links={paginas.map((pagina) => ({ href: `/${lang}/${pagina}`, rotulo: t.nav[pagina] }))} rotulos={t.menu} />
        <div className="flex items-center gap-2">
          <TrocarIdioma lang={lang} rotulo={t.trocarIdioma} />
          <TrocarTema rotulos={t.tema} />
        </div>
      </div>
    </header>
  );
}
