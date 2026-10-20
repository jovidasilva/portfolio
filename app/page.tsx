import Link from "next/link";

export default function Home() {
  return (
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
  );
}
