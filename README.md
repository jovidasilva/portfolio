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
Ela responde em camadas, da mais exata para a menos:

1. **Site** (`lib/nadia.ts`): páginas, projetos, contato e currículo, e navega entre as páginas.
2. **Ferramentas** (`lib/nadia-ferramentas.ts`): contas e a Wikipédia em português, com a fonte.
3. **Modelo no navegador** (`NEXT_PUBLIC_NADIA_MODELO`, endereço do `model_q8.onnx`): 126M de parâmetros em int8 (~140 MB), baixado uma vez com o consentimento do visitante e guardado no cache. Roda num Web Worker com o ONNX Runtime Web (`lib/nadia.worker.ts`), com o mesmo tokenizer, a mesma geração e o mesmo filtro de confiança do servidor.
4. **Servidor** (`NEXT_PUBLIC_NADIA_URL`): o chat em Flask do IAgenerativa, se não houver modelo no navegador.

Sem nenhuma das duas variáveis, ficam só o site e as ferramentas. As duas são lidas na hora do build.

```bash
# modelo no navegador, testando localmente: copie model_q8.onnx para public/nadia/ (fica fora do git)
NEXT_PUBLIC_NADIA_MODELO=/nadia/model_q8.onnx npm run dev

# conferir a NADIA em TypeScript contra a referência em Python do IAgenerativa
node scripts/conferir-nadia.ts public/nadia/model_q8.onnx referencia.json
```

O modelo, o `tokenizer.json` e o `config.json` de `public/nadia/` saem do `scripts/exportar_onnx.py` do IAgenerativa.
