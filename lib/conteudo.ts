import fs from "node:fs";
import path from "node:path";
import { notFound } from "next/navigation";
import type { Idioma } from "./idioma";

export type Area = "Web" | "Hardware" | "IA" | "Dados" | "Jogos";

export type Projeto = {
  slug: string;
  titulo: string;
  resumo: string;
  area: Area;
  tecnologias: string[];
  icones?: string[]; // nomes dos arquivos em public/skills
  data: string; // AAAA-MM-DD
  repo?: string; // nome do repositório em github.com/jovidasilva
  destaque?: boolean;
};

export type Artigo = {
  slug: string;
  titulo: string;
  resumo: string;
  data: string; // AAAA-MM-DD
  tags: string[];
};

type Pasta = "projetos" | "artigos";

// Nomes dos arquivos .mdx de content/<idioma>/<pasta>, sem a extensão
export function listarSlugs(lang: Idioma, pasta: Pasta) {
  return fs
    .readdirSync(path.join(process.cwd(), "content", lang, pasta))
    .filter((arquivo) => arquivo.endsWith(".mdx"))
    .map((arquivo) => arquivo.replace(/\.mdx$/, ""));
}

// Importa um .mdx de content/; slug que não existe vira página 404
export async function carregarMdx(lang: Idioma, pasta: Pasta, slug: string) {
  if (!listarSlugs(lang, pasta).includes(slug)) notFound();
  return import(`@/content/${lang}/${pasta}/${slug}.mdx`);
}

async function listar<T extends { data: string }>(lang: Idioma, pasta: Pasta): Promise<T[]> {
  const itens = await Promise.all(
    listarSlugs(lang, pasta).map(async (slug) => {
      const { metadata } = await carregarMdx(lang, pasta, slug);
      return { slug, ...metadata } as T;
    }),
  );
  return itens.sort((a, b) => b.data.localeCompare(a.data)); // mais recentes primeiro
}

export const getProjetos = (lang: Idioma) => listar<Projeto>(lang, "projetos");
export const getArtigos = (lang: Idioma) => listar<Artigo>(lang, "artigos");

// "2026-10-12" vira "12/10/2026" em português e "Oct 12, 2026" em inglês, sem passar por fuso horário
export function formatarData(data: string, lang: Idioma) {
  const [ano, mes, dia] = data.split("-");
  if (lang === "pt") return `${dia}/${mes}/${ano}`;
  const meses = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${meses[Number(mes) - 1]} ${Number(dia)}, ${ano}`;
}
