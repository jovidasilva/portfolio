import type { Metadata } from "next";
import Sobre from "@/content/sobre.mdx";

export const metadata: Metadata = { title: "Sobre" };

export default function SobrePage() {
  return (
    <article className="prose dark:prose-invert">
      <Sobre />
    </article>
  );
}
