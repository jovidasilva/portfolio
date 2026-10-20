# jovidasilva.com.br

Meu portfólio: projetos, artigos, currículo e as ferramentas que uso.

Feito com Next.js 16 (App Router), React 19, MDX e Tailwind CSS 4. Uma página inicial que leva a páginas próprias: Sobre mim, Conhecimento, Experiências, Projetos (com um painel que lê a API do GitHub e se atualiza a cada hora), Certificados, Artigos e Contato. Visual escuro em preto, roxo e azul, com títulos em fonte pixel (Silkscreen) e texto em Sora.

## Idioma e tema

- O site existe em `/pt` e `/en`. Na primeira visita, `proxy.ts` escolhe o idioma: a escolha salva no botão de idioma vem primeiro, depois o país do visitante (na Vercel, Brasil vê em português e o resto em inglês) e, sem país, o idioma do navegador. O currículo acompanha o idioma (`curriculo.pdf` ou `resume.pdf`).
- O tema segue o claro/escuro do sistema, e o botão no topo troca e lembra a escolha no navegador.

## Rodar

```bash
npm install
npm run dev        # http://localhost:3000
npm run lint
npm run typecheck
npm test           # testes de lib/*.test.ts
npm run build
```

O CI no GitHub Actions roda lint, typecheck, testes e build a cada push.

## Painel do GitHub

Sem configuração, o painel usa só os repositórios públicos. Para contar também os privados, crie um token *fine-grained* com acesso somente leitura a **Contents** e **Metadata** dos seus repositórios e configure na hospedagem como `GITHUB_TOKEN`. O painel nunca mostra o nome de um repositório privado, só os números somados.

## Onde fica cada coisa

- `content/pt/...` e `content/en/...`: um `.mdx` por projeto ou artigo, com o mesmo nome nos dois idiomas. Os metadados vêm no `export const metadata` no topo do arquivo; `icones` usa os nomes de `public/skills`.
- `lib/textos.ts`: todos os textos fixos do site em português e inglês.
- `content/certificados.ts`: a lista de certificados. Coloque o PDF ou a imagem em `public/certificados/` e adicione um objeto com título, emissor, data e o caminho do arquivo.
- `app/[lang]/`: as páginas; `proxy.ts` redireciona quem chega sem idioma na URL.
- `public/curriculo.pdf` e `public/resume.pdf`: currículo em português e em inglês.
- `lib/github.ts`: busca e cache dos dados do painel; as contas ficam em `lib/numeros.ts`.
- `public/skills/`: ícones do [skillicons.dev](https://skillicons.dev) usados na página Uses.
