"use client";

import { useState } from "react";
import type { Area, Projeto } from "@/lib/conteudo";
import { filtrarProjetos } from "@/lib/filtros";
import CardProjeto from "./CardProjeto";

const areas: (Area | "Todos")[] = ["Todos", "Web", "Hardware", "IA", "Dados"];

export default function FiltroProjetos({ projetos }: { projetos: Projeto[] }) {
  const [area, setArea] = useState<Area | "Todos">("Todos");

  return (
    <>
      <div className="mb-6 flex flex-wrap gap-2">
        {areas.map((opcao) => (
          <button
            key={opcao}
            onClick={() => setArea(opcao)}
            aria-pressed={area === opcao}
            className="rounded-full border border-foreground/20 px-3 py-1 text-sm aria-pressed:bg-foreground aria-pressed:text-background"
          >
            {opcao}
          </button>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {filtrarProjetos(projetos, area).map((projeto) => (
          <CardProjeto key={projeto.slug} projeto={projeto} />
        ))}
      </div>
    </>
  );
}
