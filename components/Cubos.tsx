// Cubos isométricos em wireframe com "pixels" soltos, traçados em degradê roxo → azul
const s = 46; // aresta do cubo
const cx = 200; // origem do desenho
const cy = 230;

function ponto(x: number, y: number, z: number) {
  return [cx + (x - y) * s * 0.866, cy + (x + y) * s * 0.5 - z * s] as const;
}

function cubo(x: number, y: number, z: number) {
  const v = [0, 1].flatMap((a) => [0, 1].flatMap((b) => [0, 1].map((c) => ponto(x + a, y + b, z + c))));
  // 12 arestas entre vértices que diferem em um eixo
  const arestas = [[0, 1], [0, 2], [0, 4], [1, 3], [1, 5], [2, 3], [2, 6], [3, 7], [4, 5], [4, 6], [5, 7], [6, 7]];
  return arestas.map(([a, b]) => `M${v[a][0].toFixed(1)} ${v[a][1].toFixed(1)}L${v[b][0].toFixed(1)} ${v[b][1].toFixed(1)}`).join("");
}

const cubos: [number, number, number][] = [
  [0, 0, 0], [1, 0, 0], [0, 1, 0], [0, 0, 1], [1.6, -1.4, 1.6], [-1.2, 1.8, 0.8], [2.2, 1.2, 0],
];
const pixels: [number, number, number][] = [
  [3, -1, 2.6], [2.6, 0.4, 2.2], [-0.6, -1.2, 2.4], [3.4, 1.6, 1], [-2, 0.6, 2], [1.4, 2.8, 0.4], [-1.6, -0.4, 0.2], [2.8, -2, 0.6], [0.4, -2.2, 1.6],
];

export default function Cubos() {
  return (
    <svg aria-hidden viewBox="0 0 400 400" className="h-auto w-full max-w-md">
      <defs>
        <linearGradient id="traco" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--roxo)" />
          <stop offset="1" stopColor="var(--azul)" />
        </linearGradient>
      </defs>
      {cubos.map(([x, y, z], i) => (
        <path key={i} d={cubo(x, y, z)} fill="none" stroke="url(#traco)" strokeWidth="1.5" strokeLinecap="round" />
      ))}
      {pixels.map(([x, y, z], i) => {
        const [px, py] = ponto(x, y, z);
        return <rect key={i} x={px - 4} y={py - 4} width={8} height={8} fill={i % 2 ? "var(--azul)" : "var(--roxo)"} opacity={0.85} />;
      })}
    </svg>
  );
}
