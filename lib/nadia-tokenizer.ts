// Tokenizer BPE da NADIA em TypeScript: o mesmo algoritmo do core/tokenizer.py do IAgenerativa,
// para o navegador transformar texto em ids exatamente como no treino (um id diferente muda a resposta).
// O vocabulário vem de public/nadia/tokenizer.json, gerado a partir do tokenizer do treino.

export type TokenizerWeb = {
  vocab: string[]; // id -> bytes em hexadecimal
  merges: [number, number, number][]; // [esquerda, direita, novo id], na ordem em que foram aprendidas
  especiais: string[]; // ex.: "<|end|>", que vira um id só
  proibidos: number[]; // ids que o modelo nunca pode gerar (tokens com colchetes)
};

const FIM_DE_PALAVRA = "</w>";
// Pré-tokenização igual à do Python (" ?\w+| ?[^\w\s]+|\s+(?!\S)|\s+"), com \w em Unicode
const PALAVRAS = / ?[\p{L}\p{N}_]+| ?[^\p{L}\p{N}_\s]+|\s+(?!\S)|\s+/gu;

const deHex = (h: string) => Uint8Array.from(h.match(/../g) ?? [], (b) => parseInt(b, 16));

export class Tokenizer {
  private bytes: Uint8Array[];
  private rank = new Map<number, number>(); // par (esq * N + dir) -> ordem da fusão
  private novo = new Map<number, number>(); // par -> id resultante
  private especiais = new Map<string, number>();
  private divisor: RegExp | null;
  private fim: number;
  private cache = new Map<string, number[]>();
  readonly proibidos: number[];
  readonly tamanho: number;

  constructor(dados: TokenizerWeb) {
    this.bytes = dados.vocab.map(deHex);
    this.tamanho = this.bytes.length;
    dados.merges.forEach(([a, b, c], i) => {
      this.rank.set(a * this.tamanho + b, i);
      this.novo.set(a * this.tamanho + b, c);
    });
    const indice = new Map(dados.vocab.map((h, i) => [h, i]));
    const hex = (s: string) => Array.from(new TextEncoder().encode(s), (b) => b.toString(16).padStart(2, "0")).join("");
    for (const e of dados.especiais) this.especiais.set(e, indice.get(hex(e))!);
    this.fim = indice.get(hex(FIM_DE_PALAVRA))!;
    const escapar = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    this.divisor = dados.especiais.length ? new RegExp(`(${dados.especiais.map(escapar).join("|")})`) : null;
    this.proibidos = dados.proibidos;
  }

  idEspecial(marcador: string) {
    return this.especiais.get(marcador);
  }

  encode(texto: string): number[] {
    const ids: number[] = [];
    for (const parte of this.divisor ? texto.split(this.divisor) : [texto]) {
      const especial = this.especiais.get(parte);
      if (especial !== undefined) ids.push(especial);
      else if (parte) for (const palavra of parte.match(PALAVRAS) ?? []) ids.push(...this.palavra(palavra));
    }
    return ids;
  }

  // Aplica sempre a fusão mais antiga entre os pares presentes, como no treino
  private palavra(palavra: string): number[] {
    const guardado = this.cache.get(palavra);
    if (guardado) return guardado;
    let s = [...new TextEncoder().encode(palavra), this.fim];
    while (s.length > 1) {
      let melhor = -1;
      let melhorRank = Infinity;
      for (let i = 0; i < s.length - 1; i++) {
        const r = this.rank.get(s[i] * this.tamanho + s[i + 1]);
        if (r !== undefined && r < melhorRank) [melhor, melhorRank] = [i, r];
      }
      if (melhor < 0) break;
      const [a, b] = [s[melhor], s[melhor + 1]];
      const id = this.novo.get(a * this.tamanho + b)!;
      const junto: number[] = [];
      for (let i = 0; i < s.length; ) {
        if (i < s.length - 1 && s[i] === a && s[i + 1] === b) {
          junto.push(id);
          i += 2;
        } else junto.push(s[i++]);
      }
      s = junto;
    }
    if (this.cache.size > 50_000) this.cache.clear();
    this.cache.set(palavra, s);
    return s;
  }

  decode(ids: number[]): string {
    const partes = ids.map((i) => this.bytes[i]);
    const todos = new Uint8Array(partes.reduce((n, p) => n + p.length, 0));
    let o = 0;
    for (const p of partes) {
      todos.set(p, o);
      o += p.length;
    }
    return new TextDecoder().decode(todos).replaceAll(FIM_DE_PALAVRA, "");
  }
}
