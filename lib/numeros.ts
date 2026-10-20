const semanaMs = 7 * 24 * 60 * 60 * 1000;

// Conta quantas datas caem em cada uma das últimas `semanas` semanas, da mais antiga para a mais recente
export function porSemana(datas: string[], agora: number, semanas: number) {
  const contagem = Array<number>(semanas).fill(0);
  for (const data of datas) {
    const atras = Math.floor((agora - Date.parse(data)) / semanaMs);
    if (atras >= 0 && atras < semanas) contagem[semanas - 1 - atras]++;
  }
  return contagem;
}

// Soma os bytes por linguagem de vários repositórios e devolve até `limite` linguagens como fração do total.
// As que ficam abaixo de 1% vão para "Outras", que só aparece se passar de 1%.
export function somarLinguagens(porRepo: Record<string, number>[], limite: number) {
  const soma: Record<string, number> = {};
  for (const repo of porRepo) for (const [nome, bytes] of Object.entries(repo)) soma[nome] = (soma[nome] ?? 0) + bytes;
  const total = Object.values(soma).reduce((a, b) => a + b, 0);
  if (total === 0) return [];
  const partes = Object.entries(soma)
    .map(([nome, bytes]) => ({ nome, parte: bytes / total }))
    .sort((a, b) => b.parte - a.parte);
  const topo = partes.slice(0, limite).filter((linguagem) => linguagem.parte >= 0.01);
  const resto = 1 - topo.reduce((a, linguagem) => a + linguagem.parte, 0);
  return resto >= 0.01 ? [...topo, { nome: "Outras", parte: resto }] : topo;
}
