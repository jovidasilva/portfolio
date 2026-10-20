import fs from "node:fs";
import path from "node:path";
import { notFound } from "next/navigation";

export type Area = "Web" | "Hardware" | "IA" | "Dados";

export type Projeto = {
  slug: string;
  titulo: string;
  resumo: string;
  area: Area;
  tecnologias: string[];
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

// Nomes dos arquivos .mdx de content/<pasta>, sem a extensão
export function listarSlugs(pasta: Pasta) {
  return fs
    .readdirSync(path.join(process.cwd(), "content", pasta))
    .filter((arquivo) => arquivo.endsWith(".mdx"))
    .map((arquivo) => arquivo.replace(/\.mdx$/, ""));
}

// Importa um .mdx de content/; slug que não existe vira página 404
export async function carregarMdx(pasta: Pasta, slug: string) {
  if (!listarSlugs(pasta).includes(slug)) notFound();
  return import(`@/content/${pasta}/${slug}.mdx`);
}

async function listar<T extends { data: string }>(pasta: Pasta): Promise<T[]> {
  const itens = await Promise.all(
    listarSlugs(pasta).map(async (slug) => {
      const { metadata } = await carregarMdx(pasta, slug);
      return { slug, ...metadata } as T;
    }),
  );
  return itens.sort((a, b) => b.data.localeCompare(a.data)); // mais recentes primeiro
}

export const getProjetos = () => listar<Projeto>("projetos");
export const getArtigos = () => listar<Artigo>("artigos");

// "2026-10-12" vira "12/10/2026" sem passar por fuso horário
export function formatarData(data: string) {
  return data.split("-").reverse().join("/");
}
