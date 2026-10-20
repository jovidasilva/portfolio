"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavLinks({ links }: { links: { href: string; rotulo: string }[] }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Principal" className="order-last -mx-1 flex w-full gap-x-1 overflow-x-auto text-sm xl:order-none xl:w-auto">
      {links.map((link) => {
        const atual = pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={atual ? "page" : undefined}
            className="shrink-0 rounded-full px-3 py-1.5 text-suave hover:text-texto aria-[current=page]:bg-roxo/15 aria-[current=page]:text-texto"
          >
            {link.rotulo}
          </Link>
        );
      })}
    </nav>
  );
}
