import Image from "next/image";
import Link from "next/link";
import type { Area, Projeto } from "@/lib/conteudo";

export default function CardProjeto({ projeto, lang, areas, detalhes }: { projeto: Projeto; lang: string; areas: Record<Area, string>; detalhes: string }) {
  return (
    <li className="cartao group relative flex flex-col p-6 hover:border-roxo">
      <div className="flex h-10 items-center gap-2">
        {projeto.icones?.length
          ? projeto.icones.map((icone) => <Image key={icone} src={`/skills/${icone}.svg`} alt="" width={36} height={36} />)
          : projeto.tecnologias.slice(0, 3).map((item) => (
              <span key={item} aria-hidden className="rounded-full border border-dashed border-borda px-3 py-1 text-xs text-suave">
                {item}
              </span>
            ))}
      </div>
      <h3 className="mt-6 font-pixel text-xl">
        <Link href={`/${lang}/projetos/${projeto.slug}`} className="after:absolute after:inset-0 after:rounded-[1.25rem]">
          {projeto.titulo}
        </Link>
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-suave">{projeto.resumo}</p>
      <p className="mt-auto flex justify-between pt-6 text-sm">
        <span className="text-suave">
          {areas[projeto.area]}, {projeto.data.slice(0, 4)}
        </span>
        <span aria-hidden className="text-roxo group-hover:underline">
          {detalhes} ↗
        </span>
      </p>
    </li>
  );
}
