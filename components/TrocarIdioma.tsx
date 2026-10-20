"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { idiomas, type Idioma } from "@/lib/idioma";

const nomes: Record<Idioma, { sigla: string; nome: string; html: string }> = {
  pt: { sigla: "PT", nome: "Português", html: "pt-BR" },
  en: { sigla: "EN", nome: "English", html: "en" },
};

// Seletor PT | EN: o idioma atual fica destacado e o outro leva à mesma página traduzida, lembrando a escolha por um ano
export default function TrocarIdioma({ lang, rotulo }: { lang: Idioma; rotulo: string }) {
  const pathname = usePathname();

  return (
    <div role="group" aria-label={rotulo} className="flex items-center gap-1 rounded-full border border-borda p-1 text-xs font-semibold">
      <svg aria-hidden viewBox="0 0 24 24" className="ml-1.5 mr-0.5 size-4 text-suave" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3Z" />
      </svg>
      {idiomas.map((idioma) =>
        idioma === lang ? (
          <span key={idioma} aria-current="true" title={nomes[idioma].nome} className="degrade rounded-full px-2.5 py-1 text-white">
            {nomes[idioma].sigla}
          </span>
        ) : (
          <Link
            key={idioma}
            href={pathname.replace(/^\/(pt|en)(?=\/|$)/, `/${idioma}`)}
            hrefLang={nomes[idioma].html}
            lang={nomes[idioma].html}
            aria-label={nomes[idioma].nome}
            title={nomes[idioma].nome}
            onClick={() => {
              document.cookie = `idioma=${idioma}; path=/; max-age=31536000; samesite=lax`;
            }}
            className="rounded-full px-2.5 py-1 text-suave hover:bg-roxo/15 hover:text-texto"
          >
            {nomes[idioma].sigla}
          </Link>
        ),
      )}
    </div>
  );
}
