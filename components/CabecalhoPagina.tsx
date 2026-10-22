import type { ReactNode } from "react";
import PixelIcone, { type Pagina } from "./PixelIcone";
import Voltar from "./Voltar";

// Topo de cada página: ícone em pixel, título grande e o brilho na cor da seção
type Props = { pagina: Pagina; titulo: string; intro: string; voltar: { href: string; rotulo: string }; cor?: "roxo" | "azul"; children?: ReactNode };

export default function CabecalhoPagina({ pagina, titulo, intro, voltar, cor = "roxo", children }: Props) {
  return (
    <header className="brilho" style={{ "--brilho": `color-mix(in srgb, var(--${cor}) 26%, transparent)` } as React.CSSProperties}>
      <div className="mx-auto max-w-6xl px-5 pb-12 pt-8 sm:px-8 sm:pt-10">
        <Voltar href={voltar.href} rotulo={voltar.rotulo} />
        <PixelIcone nome={pagina} className="mt-10 h-12 w-auto" />
        <h1 className="mt-6 break-words font-pixel text-[clamp(1.75rem,9vw,3rem)] leading-[1.05] sm:text-6xl md:text-7xl">{titulo}</h1>
        <p className="mt-5 max-w-[60ch] text-lg leading-relaxed text-suave">{intro}</p>
        {children}
      </div>
    </header>
  );
}
