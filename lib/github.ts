import { cacheLife } from "next/cache";
import { porSemana, somarLinguagens } from "./numeros";

const usuario = "jovidasilva";
export const SEMANAS = 12;

type Repo = { full_name: string; name: string; private: boolean; fork: boolean; pushed_at: string };
type Commit = { commit: { author: { date: string } } };

export type Github = {
  commitsPorSemana: number[]; // da semana mais antiga para a mais recente
  linguagens: { nome: string; parte: number }[];
  ultimoPublico?: { nome: string; data: string };
  incluiPrivados: boolean;
};

// Com GITHUB_TOKEN (só leitura) o painel também conta os repositórios privados, sem mostrar o nome deles
async function api<T>(caminho: string): Promise<T> {
  const token = process.env.GITHUB_TOKEN;
  const resposta = await fetch(`https://api.github.com${caminho}`, {
    headers: { Accept: "application/vnd.github+json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
  });
  if (!resposta.ok) throw new Error(`GitHub respondeu ${resposta.status} em ${caminho}`);
  return resposta.json();
}

async function commitsDesde(repo: string, desde: string) {
  const datas: string[] = [];
  for (let pagina = 1; pagina <= 5; pagina++) {
    const lote = await api<Commit[]>(`/repos/${repo}/commits?author=${usuario}&since=${desde}&per_page=100&page=${pagina}`);
    datas.push(...lote.map((c) => c.commit.author.date));
    if (lote.length < 100) break;
  }
  return datas;
}

export async function getGithub(): Promise<Github | null> {
  "use cache";
  cacheLife("hours");

  try {
    const incluiPrivados = Boolean(process.env.GITHUB_TOKEN);
    const caminho = incluiPrivados ? "/user/repos?affiliation=owner&per_page=100" : `/users/${usuario}/repos?per_page=100`;
    const repos = (await api<Repo[]>(caminho)).filter((repo) => !repo.fork);
    const agora = Date.now();
    const desde = new Date(agora - SEMANAS * 7 * 24 * 60 * 60 * 1000).toISOString();

    // Repositório vazio responde 409: conta como zero em vez de derrubar o painel
    const [commits, linguagens] = await Promise.all([
      Promise.all(repos.map((repo) => commitsDesde(repo.full_name, desde).catch(() => []))),
      Promise.all(repos.map((repo) => api<Record<string, number>>(`/repos/${repo.full_name}/languages`).catch(() => ({})))),
    ]);

    const ultimo = repos.filter((repo) => !repo.private).sort((a, b) => b.pushed_at.localeCompare(a.pushed_at))[0];

    return {
      commitsPorSemana: porSemana(commits.flat(), agora, SEMANAS),
      linguagens: somarLinguagens(linguagens, 5),
      ultimoPublico: ultimo && { nome: ultimo.name, data: ultimo.pushed_at.slice(0, 10) },
      incluiPrivados,
    };
  } catch (erro) {
    console.error("Painel do GitHub sem dados:", erro);
    return null;
  }
}
