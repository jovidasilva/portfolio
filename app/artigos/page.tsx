import type { Metadata } from "next";
import Link from "next/link";
import { formatarData, getArtigos } from "@/lib/conteudo";

export const metadata: Metadata = { title: "Artigos" };

export default async function ArtigosPage() {
  const artigos = await getArtigos();

  return (
    <>
      <h1 className="mb-6 text-3xl font-bold">Artigos</h1>
      <ul className="space-y-6">
        {artigos.map((artigo) => (
          <li key={artigo.slug}>
            <Link href={`/artigos/${artigo.slug}`} className="font-semibold hover:underline">
              {artigo.titulo}
            </Link>
            <p className="text-sm opacity-80">{artigo.resumo}</p>
            <p className="text-xs opacity-60">
              {formatarData(artigo.data)} · {artigo.tags.join(", ")}
            </p>
          </li>
        ))}
      </ul>
    </>
  );
}
