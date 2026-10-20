import { NextResponse, type NextRequest } from "next/server";
import { ehIdioma, escolherIdioma } from "@/lib/idioma";

// Sem idioma na URL, manda para /pt ou /en. O país vem da Vercel (x-vercel-ip-country) quando o site roda lá.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (ehIdioma(pathname.split("/")[1])) return;

  const idioma = escolherIdioma({
    cookie: request.cookies.get("idioma")?.value,
    pais: request.headers.get("x-vercel-ip-country"),
    aceita: request.headers.get("accept-language"),
  });
  request.nextUrl.pathname = `/${idioma}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  // Ignora arquivos (currículo, ícones, favicon), internos do Next e as rotas de SEO
  matcher: ["/((?!_next|.*\\..*|sitemap.xml|robots.txt).*)"],
};
