"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Icone from "./Icone";

type Pagina = { href: string; rotulo: string };

// Menu em linha a partir de xl; abaixo disso, um botão abre a lista com alvos de toque grandes
export default function NavLinks({ links, rotulos }: { links: Pagina[]; rotulos: { abrir: string; fechar: string } }) {
  const pathname = usePathname();
  // Guarda a página em que o menu abriu: ao navegar para outra, ele fecha sozinho
  const [abertoEm, setAbertoEm] = useState<string | null>(null);
  const aberto = abertoEm === pathname;
  const botao = useRef<HTMLButtonElement>(null);
  const painel = useRef<HTMLElement>(null);

  // Toque fora do menu ou Esc fecham
  useEffect(() => {
    if (!aberto) return;
    const fora = (e: PointerEvent) => {
      const alvo = e.target as Node;
      if (!botao.current?.contains(alvo) && !painel.current?.contains(alvo)) setAbertoEm(null);
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setAbertoEm(null);
    document.addEventListener("pointerdown", fora);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("pointerdown", fora);
      document.removeEventListener("keydown", esc);
    };
  }, [aberto]);

  const item = (link: Pagina, classe: string) => (
    <Link
      key={link.href}
      href={link.href}
      aria-current={pathname.startsWith(link.href) ? "page" : undefined}
      onClick={() => setAbertoEm(null)}
      className={`text-suave hover:text-texto aria-[current=page]:bg-roxo/15 aria-[current=page]:text-texto ${classe}`}
    >
      {link.rotulo}
    </Link>
  );

  return (
    <>
      <nav className="hidden gap-x-1 text-sm xl:flex">{links.map((link) => item(link, "rounded-full px-3 py-1.5"))}</nav>
      <button
        ref={botao}
        type="button"
        onClick={() => setAbertoEm(aberto ? null : pathname)}
        aria-expanded={aberto}
        aria-controls="menu-celular"
        aria-label={aberto ? rotulos.fechar : rotulos.abrir}
        title={aberto ? rotulos.fechar : rotulos.abrir}
        className="order-last grid size-10 place-items-center rounded-full border border-borda text-suave hover:border-roxo hover:text-texto xl:hidden"
      >
        <Icone nome={aberto ? "fechar" : "menu"} />
      </button>
      {aberto && (
        <nav ref={painel} id="menu-celular" className="absolute inset-x-0 top-full max-h-[calc(100dvh-4rem)] overflow-y-auto border-b border-dashed border-borda bg-fundo shadow-xl xl:hidden">
          <div className="mx-auto grid max-w-6xl gap-1 px-5 py-4 sm:px-8">{links.map((link) => item(link, "rounded-xl px-4 py-3 text-base"))}</div>
        </nav>
      )}
    </>
  );
}
