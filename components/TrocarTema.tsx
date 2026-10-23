"use client";

import { useLayoutEffect, useSyncExternalStore } from "react";

type Tema = "claro" | "escuro";
const escuroDoSistema = "(prefers-color-scheme: dark)";

// A barra do navegador no celular acompanha o tema escolhido (mesmas cores de --fundo em globals.css)
function pintarBarra(tema: Tema) {
  document.querySelectorAll('meta[name="theme-color"]').forEach((meta) => meta.setAttribute("content", tema === "escuro" ? "#000000" : "#fafafb"));
}

function aplicarSalvo() {
  try {
    const salvo = localStorage.getItem("tema");
    if (salvo === "claro" || salvo === "escuro") {
      document.documentElement.dataset.tema = salvo;
      pintarBarra(salvo);
    }
  } catch {}
}

// Aplica o tema salvo assim que este arquivo carrega, antes do React hidratar a página.
// shortcut: quem escolheu um tema diferente do sistema pode ver um piscar ao recarregar; um script bloqueante no <head> evitaria, mas o React 19 reclama dele
if (typeof window !== "undefined") aplicarSalvo();

function lerTema(): Tema {
  const salvo = document.documentElement.dataset.tema;
  if (salvo === "claro" || salvo === "escuro") return salvo;
  return matchMedia(escuroDoSistema).matches ? "escuro" : "claro";
}

function assinar(avisar: () => void) {
  const sistema = matchMedia(escuroDoSistema);
  sistema.addEventListener("change", avisar);
  window.addEventListener("tema", avisar);
  return () => {
    sistema.removeEventListener("change", avisar);
    window.removeEventListener("tema", avisar);
  };
}

export default function TrocarTema({ rotulos }: { rotulos: { claro: string; escuro: string } }) {
  // No servidor o tema é desconhecido; o botão só ganha ícone depois de montar
  const tema = useSyncExternalStore(assinar, lerTema, () => null);
  // Trocar de idioma remonta o layout raiz, e o React apaga os atributos do <html>; reaplica o tema antes de a tela pintar
  useLayoutEffect(aplicarSalvo, []);

  function trocar() {
    const novo: Tema = lerTema() === "escuro" ? "claro" : "escuro";
    document.documentElement.dataset.tema = novo;
    pintarBarra(novo);
    try {
      localStorage.setItem("tema", novo);
    } catch {}
    window.dispatchEvent(new Event("tema"));
  }

  const rotulo = tema === "escuro" ? rotulos.claro : rotulos.escuro;

  return (
    <button
      type="button"
      onClick={trocar}
      aria-label={rotulo}
      title={rotulo}
      className="grid size-10 place-items-center rounded-full border border-borda text-suave hover:border-roxo hover:text-texto"
    >
      {tema === "escuro" ? (
        <svg aria-hidden viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      ) : tema === "claro" ? (
        <svg aria-hidden viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
          <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />
        </svg>
      ) : null}
    </button>
  );
}
