import Link from "next/link";
import { getProjetos } from "@/lib/conteudo";
import CardProjeto from "@/components/CardProjeto";

export default async function Home() {
  const destaques = (await getProjetos()).filter((projeto) => projeto.destaque);

  return (
    <>
      <section className="space-y-4">
        <h1 className="text-3xl font-bold">Olá, eu sou o João Victor</h1>
        <p>Estudante de Engenharia da Computação. Aqui ficam meus projetos, artigos e as ferramentas que uso.</p>
        <div className="flex gap-3">
          <Link href="/projetos" className="rounded-md bg-foreground px-4 py-2 text-background">
            Ver projetos
          </Link>
          <Link href="/contato" className="rounded-md border border-foreground/20 px-4 py-2">
            Falar comigo
          </Link>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="mb-4 text-xl font-semibold">Em destaque</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {destaques.map((projeto) => (
            <CardProjeto key={projeto.slug} projeto={projeto} />
          ))}
        </div>
      </section>
    </>
  );
}
