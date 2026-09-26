# MeuSiteV1 · Origem Digital

Site de vendas da Origem Digital: sites para negócios e profissionais que estão perdendo clientes por não aparecer.

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
| Projetos (nome, legenda, link), horários do "dia comum", ramos de negócio, contatos | `src/js/data.js` |
| Mensagens que vão pro WhatsApp | `src/js/store.js` |
| Cores, fontes, espaçamentos | `src/styles/base.css` (tokens no topo) |
| Visual de cada seção | `src/styles/sections.css` |
| Versão celular (cara de app: hero em carrossel 3D, seções em camadas, barra inferior) | `src/styles/mobile.css` |
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

Depois é só acrescentar o projeto em `PROJECTS`, no `src/js/data.js`. Ele entra sozinho no hero e na seção de projetos.

## Vídeos dos cards do hero

Cada card do hero é um vídeo de 8 s em loop (`public/videos/card-<id>.webm/.mp4`, capa `.webp`): o tour real do site no celular, com o computador em 3D atrás, zoom da câmera em cada toque e recortes da tela saltando em camadas.

```bash
node scripts/cards/rec.cjs              # grava os tours com interação (o roteiro de cada site fica no próprio arquivo)
node scripts/cards/crender.cjs burger   # monta e gera card-burger.webm/.mp4/.webp
```

A montagem (zooms, recortes, cores) fica em `scripts/cards/card.html`, no objeto `CFG`.

## Vídeo de apresentação

Os vídeos em `media/` apresentam o próprio site como produto: `origem-digital-demo-desktop.mp4` (1920x1080) e `origem-digital-demo-reels.mp4` (1080x1920). Os dois têm 30 fps e saem sem áudio, para a trilha entrar no editor ou no Reels.
São gravações reais do site em uso, montadas numa composição com GSAP (câmera, 3D, camadas) e renderizadas quadro a quadro.
Para refazer depois de mudar o site:

```bash
npm run build && npm run preview &     # o site em localhost:4173
node scripts/video/clips.cjs           # grava os trechos (computador e celular)
node scripts/video/render.cjs desk     # gera media/origem-digital-demo-desktop.mp4
node scripts/video/render.cjs reel     # gera media/origem-digital-demo-reels.mp4
```

A montagem (cenas, tempos, textos) fica em `scripts/video/compose.html`. Para conferir só alguns momentos: `node scripts/video/render.cjs desk 3.5,12,30`.

## Estrutura

- `src/main.js`: liga tudo.
- `src/js/splash.js`: abertura institucional (o logo pousa no menu).
- `src/js/hero.js`: hero no modelo Linktree: no computador, torre de cards de vídeo que trocam acelerando e ficam 4 s no centro; no celular, carrossel 3D que obedece ao dedo. Mais o campo "nome do seu negócio".
- `src/js/facade.js`: "passam o dedo": a rua, a mão com o celular e a busca no mapa rodando na tela, com cards em 3D.
- `src/js/day.js`: o celular fixo com o céu mudando de cor.
- `src/js/work.js`: projetos com vídeo.
- `src/js/calc.js`: simulador de faturamento perdido (valores, barrinhas e extrato).
- `src/js/chat.js`, `extras.js`, `exit.js`: conversa, crachá do "Contratado", busca do final ("E não achou você.") e pop-up de saída.
- `src/js/sheets.js`: no celular, cada seção desliza por cima da anterior como as folhas do iOS (a de trás encolhe e escurece).
- `src/js/dock.js`: no celular, a barra inferior de vidro com as seções e o WhatsApp.
- `src/js/motion.js`: rolagem suave (Lenis), revelar ao rolar e efeitos compartilhados (GSAP).

## Créditos das fotos

Fotos da seção "passam o dedo" (`public/img/fachada/`): Unsplash, via Picsum, com licença livre para uso comercial. Rua: David Marcu. Mão com o celular: Jordan McQueen. As fotos dos negócios fictícios da busca também são do Unsplash.
