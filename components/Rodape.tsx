import type { Idioma } from "@/lib/idioma";
import { contatos, textos } from "@/lib/textos";
import Icone from "./Icone";

export default function Rodape({ lang }: { lang: Idioma }) {
  const t = textos[lang];

  return (
    <footer className="tracejado">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-4 px-5 py-8 text-sm text-suave sm:px-8">
        <p className="mr-auto">
          {t.contato.rodape}{" "}
          <a href="https://github.com/jovidasilva/portfolio" className="underline underline-offset-4 hover:text-texto">
            {t.contato.codigo}
          </a>
        </p>
        <ul className="flex gap-2">
          {contatos.map((contato) => (
            <li key={contato.rotulo}>
              <a
                href={contato.href}
                aria-label={contato.rotulo}
                title={contato.rotulo}
                className="grid size-9 place-items-center rounded-full border border-borda hover:border-roxo hover:text-texto"
              >
                <Icone nome={contato.icone} className="size-4" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
