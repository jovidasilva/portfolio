import type { Metadata } from "next";

export const metadata: Metadata = { title: "Contato" };

export default function ContatoPage() {
  return (
    <>
      <h1 className="mb-6 text-3xl font-bold">Contato</h1>
      <p>
        Me mande um e-mail:{" "}
        <a href="mailto:seu-email@exemplo.com" className="underline">
          seu-email@exemplo.com
        </a>
      </p>
    </>
  );
}
