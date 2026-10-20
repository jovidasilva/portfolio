"use client";

import { useState } from "react";
import type { Area, Projeto } from "@/lib/conteudo";
import CardProjeto from "./CardProjeto";

type Props = {
  projetos: Projeto[];
  lang: string;
  rotulos: { todos: string; filtro: string; detalhes: string };
  areas: Record<Area, string>;
};

const ordem: Area[] = ["Web", "IA", "Hardware", "Jogos", "Dados"];

export default function Projetos({ projetos, lang, rotulos, areas }: Props) {
  const [area, setArea] = useState<Area | null>(null);
  // Só mostra abas de áreas que têm projeto
  const abas = ordem.filter((opcao) => projetos.some((projeto) => projeto.area === opcao));
  const visiveis = area ? projetos.filter((projeto) => projeto.area === area) : projetos;

  return (
    <>
      <div role="group" aria-label={rotulos.filtro} className="mb-10 flex flex-wrap justify-center gap-2">
        {[null, ...abas].map((opcao) => (
          <button
            key={opcao ?? "todos"}
            type="button"
            onClick={() => setArea(opcao)}
            aria-pressed={area === opcao}
            className="rounded-full border border-borda px-4 py-1.5 text-sm text-suave hover:text-texto aria-pressed:border-transparent aria-pressed:degrade aria-pressed:text-white"
          >
            {opcao ? areas[opcao] : rotulos.todos}
          </button>
        ))}
      </div>
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visiveis.map((projeto) => (
          <CardProjeto key={projeto.slug} projeto={projeto} lang={lang} areas={areas} detalhes={rotulos.detalhes} />
        ))}
      </ul>
    </>
  );
}
