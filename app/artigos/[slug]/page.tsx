import type { Metadata } from "next";
import { carregarMdx, formatarData, listarSlugs } from "@/lib/conteudo";

export function generateStaticParams() {
  return listarSlugs("artigos").map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/artigos/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const { metadata } = await carregarMdx("artigos", slug);
  return { title: metadata.titulo, description: metadata.resumo };
}

export default async function ArtigoPage({ params }: PageProps<"/artigos/[slug]">) {
  const { slug } = await params;
  const { default: Conteudo, metadata } = await carregarMdx("artigos", slug);

  return (
    <article className="prose dark:prose-invert">
      <h1>{metadata.titulo}</h1>
      <p className="text-sm opacity-60">{formatarData(metadata.data)}</p>
      <Conteudo />
    </article>
  );
}
