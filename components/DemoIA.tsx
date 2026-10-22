"use client";

import type { ReactNode } from "react";
import Icone from "./Icone";

// Cartão da página do projeto: o botão abre o chat flutuante da NADIA (components/ChatNadia.tsx)
export default function DemoIA({ status, botao, children }: { status: string; botao: string; children: ReactNode }) {
  return (
    <div className="not-prose cartao my-8 flex items-start gap-4 p-6">
      <span className="grid size-11 shrink-0 place-items-center rounded-full border border-borda text-roxo">
        <Icone nome="chat" />
      </span>
      <div>
        <span className="inline-block rounded-full bg-roxo/15 px-2.5 py-0.5 text-xs font-semibold text-roxo">{status}</span>
        <div className="mt-2 leading-relaxed text-suave">{children}</div>
        <button
          type="button"
          onClick={() => window.dispatchEvent(new Event("nadia:abrir"))}
          className="degrade mt-4 rounded-full px-4 py-2 text-sm font-semibold text-white"
        >
          {botao}
        </button>
      </div>
    </div>
  );
}
