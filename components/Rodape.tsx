import type { Idioma } from "@/lib/idioma";
import { textos } from "@/lib/textos";

export default function Rodape({ lang }: { lang: Idioma }) {
  const t = textos[lang];
  const links = [
    { href: "mailto:jvdasilva25@gmail.com", rotulo: "E-mail" },
    { href: t.linkedin, rotulo: "LinkedIn" },
    { href: "https://github.com/jovidasilva", rotulo: "GitHub" },
  ];

  return (
    <footer className="tracejado">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-3 px-5 py-8 text-sm text-suave sm:px-8">
        <p className="mr-auto">
          {t.contato.rodape}{" "}
          <a href="https://github.com/jovidasilva/portfolio" className="underline underline-offset-4 hover:text-texto">
            {t.contato.codigo}
          </a>
        </p>
        {links.map((link) => (
          <a key={link.rotulo} href={link.href} className="hover:text-texto">
            {link.rotulo}
          </a>
        ))}
      </div>
    </footer>
  );
}
