import type { Metadata } from "next";
import Uses from "@/content/uses.mdx";

export const metadata: Metadata = { title: "Uses", description: "Hardware e software que eu uso no dia a dia." };

export default function UsesPage() {
  return (
    <article className="prose dark:prose-invert">
      <Uses />
    </article>
  );
}
