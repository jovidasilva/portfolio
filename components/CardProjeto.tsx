import Link from "next/link";
import type { Projeto } from "@/lib/conteudo";

export default function CardProjeto({ projeto }: { projeto: Projeto }) {
  return (
    <Link
      href={`/projetos/${projeto.slug}`}
      className="block rounded-lg border border-foreground/10 p-4 hover:border-foreground/30"
    >
      <p className="text-xs uppercase tracking-wide opacity-60">{projeto.area}</p>
      <h3 className="font-semibold">{projeto.titulo}</h3>
      <p className="text-sm opacity-80">{projeto.resumo}</p>
      <p className="mt-2 text-xs opacity-60">{projeto.tecnologias.join(" · ")}</p>
    </Link>
  );
}
