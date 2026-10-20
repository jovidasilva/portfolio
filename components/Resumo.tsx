import Link from "next/link";
import type { ReactNode } from "react";
import PixelIcone, { type Pagina } from "./PixelIcone";

// Seção da página inicial que resume uma aba e leva até ela
export default function Resumo({ pagina, titulo, href, link, children }: { pagina: Pagina; titulo: string; href: string; link: string; children: ReactNode }) {
  return (
    <section aria-labelledby={`resumo-${pagina}`} className="tracejado">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
          <Link href={href} className="group flex items-center gap-4">
            <PixelIcone nome={pagina} className="h-9 w-auto" />
            <h2 id={`resumo-${pagina}`} className="font-pixel text-3xl group-hover:degrade-texto sm:text-4xl">
              {titulo}
            </h2>
          </Link>
          <Link href={href} className="group inline-flex items-center gap-1.5 text-sm text-roxo">
            <span className="group-hover:underline">{link}</span>
            <svg aria-hidden viewBox="0 0 16 16" className="size-3.5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="m6 3 5 5-5 5" />
            </svg>
          </Link>
        </div>
        <div className="mt-10">{children}</div>
      </div>
    </section>
  );
}
