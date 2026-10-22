# jovidasilva.com.br

Portfólio de João Victor da Silva Alves, em português e inglês.

**Next.js 16 · React 19 · TypeScript · MDX · Tailwind CSS 4**

- Projetos em MDX, um arquivo por idioma em `content/pt` e `content/en`
- Rotas `/pt` e `/en`, com o idioma detectado na primeira visita
- Painel com dados da API do GitHub, em cache e atualizado a cada hora
- Tema claro e escuro
- CI no GitHub Actions: lint, tipos, testes e build a cada push

## Rodando localmente

```bash
npm install
npm run dev        # http://localhost:3000
npm run build
npm run lint
npm run typecheck
npm test
```

Opcional: `GITHUB_TOKEN` (somente leitura) para o painel incluir os repositórios privados nos totais.

## NADIA, o chat do site

O ícone de chat no canto de todas as páginas é a NADIA, o modelo que treinei do zero ([IAgenerativa](https://github.com/jovidasilva/IAgenerativa)).
Perguntas sobre o site (páginas, projetos, contato) são respondidas aqui mesmo, em `lib/nadia.ts`, e podem navegar entre as páginas.
O resto vai para o servidor do modelo, definido em `NEXT_PUBLIC_NADIA_URL` (lida na hora do build). Sem essa variável, a NADIA só responde sobre o site.

```bash
# com o chat do IAgenerativa rodando (docker compose up -d), que já aceita localhost:3000:
NEXT_PUBLIC_NADIA_URL=http://localhost:8080 npm run dev
```
