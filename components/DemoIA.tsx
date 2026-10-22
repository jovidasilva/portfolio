import type { ReactNode } from "react";
import Icone from "./Icone";

// Lugar reservado para o chat do modelo da IA Generativa; quando o servidor dele estiver no ar, o chat entra aqui
export default function DemoIA({ status, children }: { status: string; children: ReactNode }) {
  return (
    <div className="not-prose cartao my-8 flex items-start gap-4 p-6">
      <span className="grid size-11 shrink-0 place-items-center rounded-full border border-borda text-roxo">
        <Icone nome="chat" />
      </span>
      <div>
        <span className="inline-block rounded-full bg-roxo/15 px-2.5 py-0.5 text-xs font-semibold text-roxo">{status}</span>
        <div className="mt-2 leading-relaxed text-suave">{children}</div>
      </div>
    </div>
  );
}
