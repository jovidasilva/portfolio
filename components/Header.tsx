import Link from "next/link";

const links = [
  { href: "/projetos", label: "Projetos" },
  { href: "/artigos", label: "Artigos" },
  { href: "/sobre", label: "Sobre" },
  { href: "/uses", label: "Uses" },
  { href: "/contato", label: "Contato" },
];

export default function Header() {
  return (
    <header className="border-b border-foreground/10">
      <nav className="mx-auto flex max-w-3xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-4">
        <Link href="/" className="mr-auto font-semibold">
          João Victor
        </Link>
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="text-sm hover:underline">
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
