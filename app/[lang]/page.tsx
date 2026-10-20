import Image from "next/image";
import Link from "next/link";
import CardProjeto from "@/components/CardProjeto";
import Cubos from "@/components/Cubos";
import Resumo from "@/components/Resumo";
import Seta from "@/components/Seta";
import { certificados } from "@/content/certificados";
import { formatarData, getArtigos, getProjetos } from "@/lib/conteudo";
import { grupos } from "@/lib/skills";
import { textos } from "@/lib/textos";
import { idiomaDa } from "./pagina";

export default async function Home({ params }: PageProps<"/[lang]">) {
  const lang = await idiomaDa(params);
  const t = textos[lang];
  const destaques = (await getProjetos(lang)).filter((projeto) => projeto.destaque);
  const artigos = (await getArtigos(lang)).slice(0, 2);
  const ultimosCertificados = [...certificados].sort((a, b) => b.data.localeCompare(a.data)).slice(0, 3);
  const icones = grupos.flatMap(([, itens]) => itens);
  const href = (pagina: string) => `/${lang}/${pagina}`;

  return (
    <>
      <section aria-labelledby="manchete" className="brilho">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <p className="text-suave">{t.titulo}</p>
            <h1 id="manchete" className="mt-5 font-pixel text-5xl leading-[1.05] sm:text-7xl">
              {t.sobre.manchete}
            </h1>
            <p className="mt-8 max-w-[56ch] text-lg leading-relaxed">
              <strong>{t.sobre.ola}</strong> {t.sobre.texto}
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href={href("projetos")} className="flex items-center gap-2 rounded-lg bg-texto px-5 py-3 text-sm font-semibold text-fundo hover:opacity-90">
                {t.projetos.verProjetos} <Seta />
              </Link>
              <a href={t.curriculo.href} className="flex items-center gap-2 rounded-lg border border-borda px-5 py-3 text-sm font-semibold hover:border-roxo">
                {t.curriculo.rotulo}
              </a>
            </div>
          </div>
          <div className="flex justify-center">
            <Cubos />
          </div>
        </div>
      </section>

      <Resumo pagina="sobre" titulo={t.nav.sobre} href={href("sobre")} link={t.inicio.links.sobre}>
        <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
          <p className="max-w-[60ch] text-xl leading-relaxed">{t.sobre.resumo}</p>
          <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 self-start text-sm">
            <dt className="text-suave">{t.sobre.rotulos.local}</dt>
            <dd>{t.sobre.local}</dd>
            <dt className="text-suave">{t.sobre.rotulos.idiomas}</dt>
            <dd>{t.experiencias.idiomas}</dd>
          </dl>
        </div>
      </Resumo>

      <Resumo pagina="conhecimento" titulo={t.nav.conhecimento} href={href("conhecimento")} link={t.inicio.links.conhecimento}>
        <ul className="flex flex-wrap gap-3">
          {icones.map(([icone, nome]) => (
            <li key={icone}>
              <Link href={href("conhecimento")} title={nome} className="block rounded-xl border border-transparent p-1.5 hover:border-roxo">
                <Image src={`/skills/${icone}.svg`} alt={nome} width={44} height={44} />
              </Link>
            </li>
          ))}
        </ul>
      </Resumo>

      <Resumo pagina="experiencias" titulo={t.nav.experiencias} href={href("experiencias")} link={t.inicio.links.experiencias}>
        <ol className="grid gap-5 md:grid-cols-2">
          {t.experiencias.itens.slice(0, 2).map((item) => (
            <li key={item.titulo} className="cartao p-6">
              <p className="font-pixel text-sm degrade-texto">{item.periodo}</p>
              <h3 className="mt-2 font-semibold">{item.titulo}</h3>
              <p className="mt-2 leading-relaxed text-suave">{item.texto}</p>
            </li>
          ))}
        </ol>
      </Resumo>

      <Resumo pagina="projetos" titulo={t.nav.projetos} href={href("projetos")} link={t.inicio.links.projetos}>
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {destaques.map((projeto) => (
            <CardProjeto key={projeto.slug} projeto={projeto} lang={lang} areas={t.areas} detalhes={t.projetos.detalhes} />
          ))}
        </ul>
      </Resumo>

      <Resumo pagina="certificados" titulo={t.nav.certificados} href={href("certificados")} link={t.inicio.links.certificados}>
        {ultimosCertificados.length === 0 ? (
          <p className="max-w-[60ch] text-lg text-suave">{t.certificados.vazio}</p>
        ) : (
          <ul className="grid gap-5 sm:grid-cols-3">
            {ultimosCertificados.map((certificado) => (
              <li key={certificado.titulo + certificado.data} className="cartao p-6">
                <time dateTime={certificado.data} className="text-sm text-suave">
                  {formatarData(certificado.data, lang)}
                </time>
                <h3 className="mt-2 font-semibold">{certificado.titulo}</h3>
                <p className="mt-1 text-sm text-suave">{certificado.emissor}</p>
              </li>
            ))}
          </ul>
        )}
      </Resumo>

      <Resumo pagina="artigos" titulo={t.nav.artigos} href={href("artigos")} link={t.inicio.links.artigos}>
        <ul className="grid gap-5 md:grid-cols-2">
          {artigos.map((artigo) => (
            <li key={artigo.slug} className="cartao relative p-6 hover:border-roxo">
              <time dateTime={artigo.data} className="text-sm text-suave">
                {formatarData(artigo.data, lang)}
              </time>
              <h3 className="mt-2 font-pixel text-lg">
                <Link href={`/${lang}/artigos/${artigo.slug}`} className="after:absolute after:inset-0 after:rounded-[1.25rem]">
                  {artigo.titulo}
                </Link>
              </h3>
              <p className="mt-2 text-sm text-suave">{artigo.resumo}</p>
            </li>
          ))}
        </ul>
      </Resumo>

      <Resumo pagina="contato" titulo={t.contato.chamada} href={href("contato")} link={t.inicio.links.contato}>
        <p className="max-w-[56ch] text-lg text-suave">{t.contato.texto}</p>
        <a href="mailto:jvdasilva25@gmail.com" className="mt-6 inline-block break-all text-2xl font-semibold degrade-texto sm:text-4xl">
          jvdasilva25@gmail.com
        </a>
      </Resumo>
    </>
  );
}
