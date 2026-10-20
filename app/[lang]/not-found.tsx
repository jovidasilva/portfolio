import Link from "next/link";

// Não recebe o idioma da rota, então fala as duas línguas
export default function NaoEncontrada() {
  return (
    <div className="brilho">
      <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
        <p className="font-pixel text-7xl degrade-texto">404</p>
        <h1 className="mt-6 text-2xl font-semibold">Página não encontrada · Page not found</h1>
        <p className="mt-6 flex gap-4">
          <Link href="/pt" className="text-roxo underline underline-offset-4">
            Voltar ao início
          </Link>
          <Link href="/en" className="text-roxo underline underline-offset-4">
            Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
