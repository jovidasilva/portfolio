"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { Idioma } from "@/lib/idioma";
import { ehCaminhoInterno, responderSobreOSite, textosNadia, type LinkNadia, type MapaSite } from "@/lib/nadia";
import Icone from "./Icone";

// Endereço do servidor do modelo (o chat em Flask do projeto IAgenerativa). Sem ele, a NADIA
// continua respondendo sobre o site e avisa que o modelo está fora do ar.
const API = process.env.NEXT_PUBLIC_NADIA_URL?.replace(/\/$/, "");

type Mensagem = {
  autor: "eu" | "nadia";
  texto: string;
  links?: LinkNadia[];
  fontes?: string[];
  ferramenta?: string | null;
  confianca?: number | null;
  limiar?: number | null;
};

const TEXTOS = {
  pt: {
    abrir: "Conversar com a NADIA",
    fechar: "Fechar o chat",
    subtitulo: "Assistente do site · modelo treinado do zero",
    placeholder: "Pergunte algo ou peça uma página…",
    enviar: "Enviar",
    pensando: "Pensando…",
    sugestoes: ["Me mostra os projetos", "Como falar com o João?", "O que é a NADIA?", "Qual é a capital do Japão?"],
    offline: "O meu modelo de linguagem está fora do ar agora, então só consigo responder sobre o site. Experimente pedir uma página, um projeto ou o contato do João.",
    erro: "Não consegui falar com o modelo agora. Tente de novo em instantes.",
    confianca: (c: number, l: number | null | undefined) =>
      `confiança ${Math.round(c * 100)}%${l != null && c < l ? ` · abaixo de ${Math.round(l * 100)}%, preferi não arriscar` : ""}`,
    fonte: (i: number) => `fonte ${i}`,
  },
  en: {
    abrir: "Chat with NADIA",
    fechar: "Close the chat",
    subtitulo: "Site assistant · model trained from scratch",
    placeholder: "Ask something or request a page…",
    enviar: "Send",
    pensando: "Thinking…",
    sugestoes: ["Show me the projects", "How can I contact João?", "What is NADIA?", "Qual é a capital do Japão?"],
    offline: "My language model is offline right now, so I can only answer about the site. Try asking for a page, a project or João's contact.",
    erro: "I couldn't reach the model right now. Please try again in a moment.",
    confianca: (c: number, l: number | null | undefined) =>
      `confidence ${Math.round(c * 100)}%${l != null && c < l ? ` · below ${Math.round(l * 100)}%, so I didn't guess` : ""}`,
    fonte: (i: number) => `source ${i}`,
  },
};

// **negrito** das ferramentas do modelo vira <strong>; o resto é texto puro (nunca HTML)
function Texto({ texto }: { texto: string }) {
  return texto.split(/\*\*(.+?)\*\*/g).map((parte, i) => (i % 2 ? <strong key={i}>{parte}</strong> : parte));
}

export default function ChatNadia({ lang, mapa }: { lang: Idioma; mapa: MapaSite }) {
  const t = TEXTOS[lang];
  const router = useRouter();
  const [aberto, setAberto] = useState(false);
  const [mensagens, setMensagens] = useState<Mensagem[]>([{ autor: "nadia", texto: textosNadia[lang].ola }]);
  const [texto, setTexto] = useState("");
  const [esperando, setEsperando] = useState(false);
  // Só as trocas com o modelo vão no histórico: as respostas do site não são texto que ele aprendeu
  const historico = useRef<[string, string][]>([]);
  const lista = useRef<HTMLDivElement>(null);
  const campo = useRef<HTMLInputElement>(null);
  const botao = useRef<HTMLButtonElement>(null);

  // Outros componentes abrem o chat com window.dispatchEvent(new Event("nadia:abrir"))
  useEffect(() => {
    const abrir = () => setAberto(true);
    window.addEventListener("nadia:abrir", abrir);
    return () => window.removeEventListener("nadia:abrir", abrir);
  }, []);

  useEffect(() => {
    if (aberto) campo.current?.focus();
  }, [aberto]);

  useEffect(() => {
    lista.current?.scrollTo({ top: lista.current.scrollHeight });
  }, [mensagens, esperando]);

  function fechar() {
    setAberto(false);
    botao.current?.focus();
  }

  async function enviar(pergunta: string) {
    pergunta = pergunta.trim().slice(0, 2000);
    if (!pergunta || esperando) return;
    setTexto("");
    setMensagens((m) => [...m, { autor: "eu", texto: pergunta }]);

    const site = responderSobreOSite(pergunta, lang, mapa);
    if (site) {
      setMensagens((m) => [...m, { autor: "nadia", texto: site.texto, links: site.links }]);
      if (site.ir && ehCaminhoInterno(site.ir)) router.push(site.ir);
      return;
    }
    if (!API) {
      setMensagens((m) => [...m, { autor: "nadia", texto: t.offline }]);
      return;
    }

    setEsperando(true);
    try {
      const resp = await fetch(`${API}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: pergunta, history: historico.current.slice(-6) }),
        signal: AbortSignal.timeout(60_000),
      });
      const dados = await resp.json();
      if (!resp.ok) throw new Error(dados.error);
      historico.current.push(["user", pergunta], ["assistant", dados.reply]);
      setMensagens((m) => [
        ...m,
        {
          autor: "nadia",
          texto: dados.reply,
          fontes: (dados.sources ?? []).filter((u: string) => /^https?:\/\//.test(u)),
          ferramenta: dados.tool,
          confianca: dados.tool ? null : dados.confianca,
          limiar: dados.limiar,
        },
      ]);
    } catch (erro) {
      // Erro com mensagem do servidor (ex.: muitas mensagens seguidas) aparece como veio
      const doServidor = erro instanceof Error && erro.message && erro.name === "Error" ? erro.message : null;
      setMensagens((m) => [...m, { autor: "nadia", texto: doServidor ?? t.erro }]);
    } finally {
      setEsperando(false);
    }
  }

  return (
    <>
      {aberto && (
        <section
          id="chat-nadia"
          aria-label="NADIA"
          onKeyDown={(e) => e.key === "Escape" && fechar()}
          className="fixed inset-x-3 bottom-20 z-50 flex h-[min(34rem,calc(100dvh-7rem))] flex-col overflow-hidden rounded-2xl border border-borda bg-superficie shadow-2xl sm:inset-x-auto sm:right-5 sm:w-96"
        >
          <header className="flex items-center gap-3 border-b border-borda px-4 py-3">
            <span className="degrade grid size-9 shrink-0 place-items-center rounded-full font-pixel text-sm text-white">N</span>
            <div className="mr-auto min-w-0">
              <p className="font-pixel text-lg leading-none">NADIA</p>
              <p className="truncate text-xs text-suave">{t.subtitulo}</p>
            </div>
            <button type="button" onClick={fechar} aria-label={t.fechar} className="grid size-8 place-items-center rounded-full text-suave hover:text-texto">
              <Icone nome="fechar" className="size-4" />
            </button>
          </header>

          <div ref={lista} aria-live="polite" className="flex-1 space-y-3 overflow-y-auto px-4 py-4 text-sm">
            {mensagens.map((m, i) => (
              <div key={i} className={m.autor === "eu" ? "flex justify-end" : "flex"}>
                <div
                  className={
                    m.autor === "eu"
                      ? "max-w-[85%] rounded-2xl rounded-br-sm bg-roxo px-3 py-2 text-fundo"
                      : "max-w-[90%] whitespace-pre-line rounded-2xl rounded-bl-sm border border-borda px-3 py-2"
                  }
                >
                  <Texto texto={m.texto} />
                  {m.links && m.links.length > 0 && (
                    <ul className="mt-2 flex flex-wrap gap-1.5">
                      {m.links.map((link) =>
                        <li key={link.href}>
                          {ehCaminhoInterno(link.href) && !link.href.endsWith(".pdf") ? (
                            <Link href={link.href} className="inline-block rounded-full border border-borda px-2.5 py-1 text-xs hover:border-roxo">
                              {link.rotulo}
                            </Link>
                          ) : (
                            <a href={link.href} target="_blank" rel="noopener noreferrer" className="inline-block rounded-full border border-borda px-2.5 py-1 text-xs hover:border-roxo">
                              {link.rotulo}
                            </a>
                          )}
                        </li>,
                      )}
                    </ul>
                  )}
                  {(m.ferramenta || m.confianca != null || (m.fontes && m.fontes.length > 0)) && (
                    <p className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-suave">
                      {m.ferramenta && <span>{m.ferramenta}</span>}
                      {m.confianca != null && <span>{t.confianca(m.confianca, m.limiar)}</span>}
                      {m.fontes?.map((url, j) => (
                        <a key={url} href={url} target="_blank" rel="noopener noreferrer" title={url} className="underline underline-offset-2 hover:text-texto">
                          {t.fonte(j + 1)}
                        </a>
                      ))}
                    </p>
                  )}
                </div>
              </div>
            ))}
            {esperando && <p className="text-suave">{t.pensando}</p>}
            {mensagens.length === 1 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {t.sugestoes.map((s) => (
                  <button key={s} type="button" onClick={() => enviar(s)} className="rounded-full border border-borda px-2.5 py-1 text-xs text-suave hover:border-roxo hover:text-texto">
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              enviar(texto);
            }}
            className="flex gap-2 border-t border-borda p-3"
          >
            <input
              ref={campo}
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder={t.placeholder}
              maxLength={2000}
              aria-label={t.placeholder}
              className="min-w-0 flex-1 rounded-full border border-borda bg-fundo px-4 py-2 text-sm outline-none focus:border-roxo"
            />
            <button type="submit" disabled={esperando || !texto.trim()} aria-label={t.enviar} className="degrade grid size-9 shrink-0 place-items-center rounded-full text-white disabled:opacity-40">
              <Icone nome="enviar" className="size-4" />
            </button>
          </form>
        </section>
      )}

      <button
        ref={botao}
        type="button"
        onClick={() => (aberto ? fechar() : setAberto(true))}
        aria-label={aberto ? t.fechar : t.abrir}
        title={aberto ? t.fechar : t.abrir}
        aria-expanded={aberto}
        aria-controls="chat-nadia"
        className="degrade fixed bottom-5 right-5 z-50 grid size-13 place-items-center rounded-full text-white shadow-lg transition-transform hover:scale-105"
      >
        <Icone nome={aberto ? "fechar" : "chat"} className="size-6" />
      </button>
    </>
  );
}
