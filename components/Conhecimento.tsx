"use client";

import Image from "next/image";
import { useState } from "react";
import { grupos, type Grupo } from "@/lib/skills";

type Props = { dica: string; extras: string; titulos: Record<Grupo, string>; descricoes: Record<string, string> };

export default function Conhecimento({ dica, extras, titulos, descricoes }: Props) {
  const [ativa, setAtiva] = useState<string | null>(null);
  const nome = grupos.flatMap(([, itens]) => itens).find(([icone]) => icone === ativa)?.[1];

  const descricao = ativa ? (
    <>
      <p className="font-pixel text-xl degrade-texto">{nome}</p>
      <p className="mt-3 leading-relaxed">{descricoes[ativa]}</p>
    </>
  ) : (
    <p className="text-suave">{dica}</p>
  );

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr]">
      {/* No desktop a descrição fica fixa ao lado; no celular aparece embaixo do grupo tocado */}
      <aside aria-live="polite" className="cartao hidden self-start p-8 lg:sticky lg:top-28 lg:block">
        <div className="min-h-32">{descricao}</div>
        <p className="mt-8 text-sm text-suave">{extras}</p>
      </aside>
      <div className="space-y-12">
        {grupos.map(([grupo, itens]) => (
          <section key={grupo} aria-labelledby={`grupo-${grupo}`}>
            <h2 id={`grupo-${grupo}`} className="font-pixel text-xl">
              {titulos[grupo]}
            </h2>
            <ul className="mt-5 grid grid-cols-[repeat(auto-fill,minmax(4.5rem,1fr))] gap-3">
              {itens.map(([icone, rotulo]) => (
                <li key={icone}>
                  <button
                    type="button"
                    aria-pressed={ativa === icone}
                    onMouseEnter={() => setAtiva(icone)}
                    onFocus={() => setAtiva(icone)}
                    onClick={() => setAtiva(icone)}
                    className={`flex w-full flex-col items-center gap-2 rounded-xl border p-3 text-xs transition ${
                      ativa === icone ? "border-roxo bg-roxo/10 text-texto" : "border-transparent text-suave hover:text-texto"
                    }`}
                  >
                    <Image src={`/skills/${icone}.svg`} alt="" width={44} height={44} />
                    {rotulo}
                  </button>
                </li>
              ))}
            </ul>
            {itens.some(([icone]) => icone === ativa) && (
              <div aria-live="polite" className="cartao mt-4 p-5 lg:hidden">
                {descricao}
              </div>
            )}
          </section>
        ))}
        <p className="text-sm text-suave lg:hidden">{extras}</p>
      </div>
    </div>
  );
}
