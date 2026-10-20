export const idiomas = ["pt", "en"] as const;
export type Idioma = (typeof idiomas)[number];

export const ehIdioma = (valor: string | undefined): valor is Idioma => idiomas.includes(valor as Idioma);

// Escolhe o idioma da primeira visita: escolha salva > país do visitante > idioma do navegador > inglês
export function escolherIdioma({ cookie, pais, aceita }: { cookie?: string; pais?: string | null; aceita?: string | null }): Idioma {
  if (ehIdioma(cookie)) return cookie;
  if (pais) return pais.toUpperCase() === "BR" ? "pt" : "en";
  const preferido = (aceita ?? "")
    .split(",")
    .map((parte) => {
      const [tag, q] = parte.trim().split(";q=");
      return { tag: tag.toLowerCase(), q: q === undefined ? 1 : Number(q) };
    })
    .filter((item) => item.tag && item.tag !== "*")
    .sort((a, b) => b.q - a.q)[0];
  return preferido?.tag.startsWith("pt") ? "pt" : "en";
}
