import type { Metadata } from "next";
import { carregarMdx, listarSlugs } from "@/lib/conteudo";

export function generateStaticParams() {
  return listarSlugs("projetos").map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/projetos/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const { metadata } = await carregarMdx("projetos", slug);
  return { title: metadata.titulo, description: metadata.resumo };
}

export default async function ProjetoPage({ params }: PageProps<"/projetos/[slug]">) {
  const { slug } = await params;
  const { default: Conteudo, metadata } = await carregarMdx("projetos", slug);

  return (
    <article className="prose dark:prose-invert">
      <h1>{metadata.titulo}</h1>
      <p className="lead">{metadata.resumo}</p>
      <Conteudo />
    </article>
  );
}
