import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Silkscreen, Sora } from "next/font/google";
import Header from "@/components/Header";
import Rodape from "@/components/Rodape";
import { ehIdioma, idiomas } from "@/lib/idioma";
import { textos } from "@/lib/textos";
import "../globals.css";

const sora = Sora({ variable: "--font-sora", subsets: ["latin"] });
const silkscreen = Silkscreen({ variable: "--font-silkscreen", subsets: ["latin"], weight: ["400", "700"] });

export function generateStaticParams() {
  return idiomas.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!ehIdioma(lang)) return {};
  const t = textos[lang];
  return {
    metadataBase: new URL("https://jovidasilva.com.br"),
    title: { default: t.titulo, template: `%s · João Victor` },
    description: t.descricao,
    alternates: { canonical: `/${lang}`, languages: { "pt-BR": "/pt", en: "/en" } },
  };
}

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!ehIdioma(lang)) notFound();
  const t = textos[lang];

  return (
    <html lang={t.html} className={`${sora.variable} ${silkscreen.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="flex min-h-full flex-col">
        <a href="#conteudo" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-superficie focus:px-3 focus:py-2">
          {t.pularConteudo}
        </a>
        <Header lang={lang} />
        <main id="conteudo" className="flex-1">
          {children}
        </main>
        <Rodape lang={lang} />
      </body>
    </html>
  );
}
