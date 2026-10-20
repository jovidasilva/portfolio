import type { Area, Projeto } from "./conteudo";

export function filtrarProjetos(projetos: Projeto[], area: Area | "Todos") {
  return area === "Todos" ? projetos : projetos.filter((projeto) => projeto.area === area);
}
