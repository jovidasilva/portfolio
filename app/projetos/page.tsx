import type { Metadata } from "next";
import { getProjetos } from "@/lib/conteudo";
import FiltroProjetos from "@/components/FiltroProjetos";

export const metadata: Metadata = { title: "Projetos" };

export default async function ProjetosPage() {
  const projetos = await getProjetos();

  return (
    <>
      <h1 className="mb-6 text-3xl font-bold">Projetos</h1>
      <FiltroProjetos projetos={projetos} />
    </>
  );
}
