import Link from "next/link";

export default function Voltar({ href, rotulo }: { href: string; rotulo: string }) {
  return (
    <Link href={href} className="inline-flex items-center gap-1.5 rounded-full border border-borda py-2 pl-2.5 pr-3.5 text-sm text-suave hover:border-roxo hover:text-texto">
      <svg aria-hidden viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M10 3 5 8l5 5" />
      </svg>
      {rotulo}
    </Link>
  );
}
