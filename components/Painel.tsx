import { getGithub, SEMANAS } from "@/lib/github";
import { formatarData } from "@/lib/conteudo";
import type { Idioma } from "@/lib/idioma";
import { textos } from "@/lib/textos";

// Tons do mesmo roxo, do mais forte ao mais fraco, para as fatias de linguagem
const tons = [1, 0.72, 0.52, 0.36, 0.24, 0.14];

export default async function Painel({ lang }: { lang: Idioma }) {
  const t = textos[lang].painel;
  const github = await getGithub();
  const total = github?.commitsPorSemana.reduce((a, b) => a + b, 0) ?? 0;
  const maior = Math.max(1, ...(github?.commitsPorSemana ?? []));

  if (!github) {
    return (
      <p className="cartao p-6 text-suave">
        {t.falhou}{" "}
        <a href="https://github.com/jovidasilva" className="text-roxo underline underline-offset-4">
          github.com/jovidasilva
        </a>
        .
      </p>
    );
  }

  return (
    <div className="cartao grid gap-x-10 gap-y-12 p-6 sm:p-8 lg:grid-cols-12">
      <figure className="lg:col-span-7">
        <figcaption className="text-sm text-suave">{t.commits(SEMANAS)}</figcaption>
        <p className="mt-2 font-pixel text-5xl">{total}</p>
        <svg role="img" aria-label={t.grafico(github.commitsPorSemana.join(", "))} viewBox="0 0 600 140" preserveAspectRatio="none" className="mt-6 h-36 w-full">
          <defs>
            <linearGradient id="barra" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0" stopColor="var(--azul)" />
              <stop offset="1" stopColor="var(--roxo)" />
            </linearGradient>
          </defs>
          {github.commitsPorSemana.map((quantidade, i) => {
            const altura = (quantidade / maior) * 132;
            return <rect key={i} x={i * 50 + 5} y={138 - altura} width={40} height={altura} rx={3} fill="url(#barra)" />;
          })}
          <line x1="0" x2="600" y1="139" y2="139" stroke="var(--borda)" strokeWidth="2" strokeDasharray="6 6" />
        </svg>
        <div className="mt-2 flex justify-between text-xs text-suave">
          <span>{t.inicio(SEMANAS)}</span>
          <span>{t.fim}</span>
        </div>
        {github.ultimoPublico && (
          <p className="mt-6 text-sm text-suave">
            {t.ultimoPush}{" "}
            <a href={`https://github.com/jovidasilva/${github.ultimoPublico.nome}`} className="text-roxo underline underline-offset-4">
              {github.ultimoPublico.nome}
            </a>
            , {formatarData(github.ultimoPublico.data, lang)}.
          </p>
        )}
      </figure>

      <figure className="lg:col-span-5">
        <figcaption className="text-sm text-suave">{t.linguagens}</figcaption>
        <div aria-hidden className="mt-6 flex h-3 w-full overflow-hidden rounded-full">
          {github.linguagens.map((linguagem, i) => (
            <span key={linguagem.nome} style={{ width: `${linguagem.parte * 100}%`, opacity: tons[i] }} className="bg-roxo" />
          ))}
        </div>
        <ul className="mt-6 divide-y divide-dashed divide-borda">
          {github.linguagens.map((linguagem, i) => (
            <li key={linguagem.nome} className="flex items-center gap-3 py-2 text-sm">
              <span aria-hidden style={{ opacity: tons[i] }} className="size-2.5 bg-roxo" />
              <span className="mr-auto">{linguagem.nome === "Outras" ? t.outras : linguagem.nome}</span>
              <span className="tabular-nums text-suave">{Math.round(linguagem.parte * 100)}%</span>
            </li>
          ))}
        </ul>
        {!github.incluiPrivados && <p className="mt-4 text-xs text-suave">{t.soPublicos}</p>}
      </figure>
    </div>
  );
}
