// Ícones em pixel art, um por página. Cada "X" vira um quadrado pintado.
const desenhos = {
  sobre: ["..XXXX..", "..XXXX..", "..XXXX..", "...XX...", ".XXXXXX.", "X.XXXX.X", "..X..X..", "..X..X.."],
  conhecimento: [".X.X.X.", "XXXXXXX", ".X...X.", "XX.X.XX", ".X...X.", "XXXXXXX", ".X.X.X."],
  experiencias: ["......XX", "......X.", "....XXX.", "....X...", "..XXX...", "..X.....", "XXX.....", "X......."],
  projetos: ["..XXXX..", ".X....X.", "XXXXXXXX", "X..XX..X", "X......X", "X......X", "XXXXXXXX"],
  certificados: [".XXXXX.", "X.....X", "X.XXX.X", "X.....X", ".XXXXX.", "..X.X..", ".X...X."],
  artigos: ["XXXXXX", "X....X", "X.XX.X", "X....X", "X.XX.X", "X....X", "XXXXXX"],
  contato: ["XXXXXXXXX", "XX.....XX", "X.X...X.X", "X..X.X..X", "X...X...X", "XXXXXXXXX"],
};

export type Pagina = keyof typeof desenhos;

export default function PixelIcone({ nome, className = "size-12" }: { nome: Pagina; className?: string }) {
  const linhas = desenhos[nome];
  const largura = Math.max(...linhas.map((linha) => linha.length));
  return (
    <svg aria-hidden viewBox={`0 0 ${largura} ${linhas.length}`} className={className} shapeRendering="crispEdges">
      <defs>
        <linearGradient id={`pixel-${nome}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--roxo)" />
          <stop offset="1" stopColor="var(--azul)" />
        </linearGradient>
      </defs>
      {linhas.flatMap((linha, y) =>
        [...linha].map((celula, x) => (celula === "X" ? <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={`url(#pixel-${nome})`} /> : null)),
      )}
    </svg>
  );
}
