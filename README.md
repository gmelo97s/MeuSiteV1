# MeuSiteV1 · Origem Digital

Site de vendas da Origem Digital: sites para o comércio de bairro.

- No ar: https://meu-site-v1-sigma.vercel.app/
- Referências e planejamento: [`docs/01-analise-referencias.md`](docs/01-analise-referencias.md) e [`docs/02-briefing-e-mapa-do-site.md`](docs/02-briefing-e-mapa-do-site.md)

## Rodar

```bash
npm install
npm run dev      # desenvolvimento
npm run build    # gera dist/ (é o que a Vercel publica)
```

Cada push no GitHub publica sozinho na Vercel.

## Onde mexer

| Quero mudar… | Arquivo |
|---|---|
| Textos fixos (títulos, parágrafos, FAQ, rodapé) | `index.html` |
| Ramos do hero, horários do "dia comum", projetos, contatos | `src/js/data.js` |
| Mensagens que vão pro WhatsApp | `src/js/store.js` |
| Cores, fontes, espaçamentos | `src/styles/base.css` (tokens no topo) |
| Visual de cada seção | `src/styles/sections.css` |
| Foto do "Quem sou" | `public/img/guilherme.webp` e `.jpg` |

## Vídeos do portfólio

Os vídeos em `public/videos/` são gravações reais dos sites, em loop (desce, para, sobe).
Para gravar um projeto novo:

```bash
node scripts/gravar-demo.cjs meuprojeto https://meuprojeto.vercel.app/ m 10 2   # celular
node scripts/gravar-demo.cjs meuprojeto https://meuprojeto.vercel.app/ d 10 1.5 # computador
scripts/converter-demo.sh meuprojeto-m 480
scripts/converter-demo.sh meuprojeto-d 1280
```

Depois é só acrescentar o projeto em `PROJECTS`, no `src/js/data.js`.

## Estrutura

- `src/main.js`: liga tudo.
- `src/js/curtain.js`: a porta de aço de abertura.
- `src/js/hero.js`: torre de vitrines e o campo "nome do seu negócio".
- `src/js/day.js`: o celular fixo com o céu mudando de cor.
- `src/js/work.js`: projetos com vídeo.
- `src/js/calc.js`, `chat.js`, `extras.js`, `exit.js`: calculadora, conversa, detalhes e pop-up de saída.
- `src/js/motion.js`: rolagem suave (Lenis), revelar ao rolar e efeitos compartilhados (GSAP).
