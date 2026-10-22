"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavLinks({ links }: { links: { href: string; rotulo: string }[] }) {
  const pathname = usePathname();
  return (
    <nav className="order-last -mx-1 flex w-full gap-x-1 overflow-x-auto pr-8 text-sm [mask-image:linear-gradient(to_right,#000_calc(100%-2.5rem),transparent)] [scrollbar-width:none] xl:order-none xl:w-auto xl:pr-0 xl:[mask-image:none] [&::-webkit-scrollbar]:hidden">
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
