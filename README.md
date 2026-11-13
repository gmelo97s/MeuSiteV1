# CODEM · Sites que vendem

Página de vendas e portfólio da CODEM: sites, vídeos e marketing pra negócios que querem parecer do tamanho que são.

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
| Textos fixos (títulos, parágrafos, nota do preço, dúvidas, rodapé) | `index.html` |
| WhatsApp, Instagram e projetos do portfólio | `src/js/data.js` (`CONTACT` e `PROJECTS`) |
| Mensagens que vão prontas pro WhatsApp | `src/js/store.js` (`MESSAGES`) |
| Cores, fontes e espaçamentos | `src/styles/base.css` (tokens no topo) |
| Visual de cada seção | `src/styles/sections.css` |
| Versão celular (carrossel 3D no topo, seções em camadas) | `src/styles/mobile.css` |
| Foto do "Quem faz" | `public/img/guilherme.webp` e `.jpg` |
| Vídeo da seção "Vídeo" | `public/videos/codem-reels.webm`, `.mp4` e capa `.webp` |
| Logo (ícone e nome) | símbolos `#c-icon` e `#c-word` no começo do `index.html` e `public/favicon.svg` |

## Identidade

- Base preto (`#0A0A0A`) e branco (`#F4F4F1`), com três cores vivas que entram por seção: verde-limão `#D4FF3F`, azul `#3355FF` e laranja `#FF5B1F`.
- No computador, o fundo da página muda de cor quando cada seção chega no meio da tela. No celular, cada seção desliza por cima da anterior.
- Fontes: Inter (títulos e texto) e Instrument Serif itálica (as palavras de destaque).

## Projetos do portfólio

Os projetos aparecem em dois lugares: nos cards de vídeo do topo e na seção "Projetos no ar".
Cada um precisa destes arquivos em `public/videos/` (em `.webm`, `.mp4` e capa `.webp`):

- `card-<id>`: card de 8 s do topo (o tour do site em 3D)
- `<id>-d`: gravação no computador
- `<id>-m`: gravação no celular

Para gravar um projeto novo:

```bash
node scripts/gravar-demo.cjs meuprojeto https://meuprojeto.vercel.app/ m 10 2   # celular
node scripts/gravar-demo.cjs meuprojeto https://meuprojeto.vercel.app/ d 10 1.5 # computador
scripts/converter-demo.sh meuprojeto-m 480
scripts/converter-demo.sh meuprojeto-d 1280
node scripts/cards/rec.cjs                # tours com interação (o roteiro de cada site fica no arquivo)
node scripts/cards/crender.cjs meuprojeto # gera card-meuprojeto.webm/.mp4/.webp
```

Depois é só acrescentar o projeto em `PROJECTS`, no `src/js/data.js`.

## Estrutura

- `src/main.js`: liga tudo.
- `src/js/motion.js`: rolagem suave (Lenis), cores por seção, revelar ao rolar, contadores, botões magnéticos, cursor, barra de progresso e a faixa de nichos.
- `src/js/splash.js`: abertura (o ícone pousa no menu).
- `src/js/hero.js`: no computador, torre de cards de vídeo que trocam sozinhos; no celular, carrossel 3D que obedece ao dedo.
- `src/js/search.js`: simulação de busca: com o nome digitado, aparecem concorrentes fictícios com site e o negócio da pessoa não aparece.
- `src/js/look.js`: o celular fixo com os quatro motivos (preso na tela no computador, automático no celular).
- `src/js/work.js`: projetos no ar, computador e celular, trocando sozinhos.
- `src/js/reel.js`: o vídeo da CODEM com botão de som.
- `src/js/belief.js`: o texto que acende palavra por palavra.
- `src/js/calc.js`: simulador de faturamento perdido.
- `src/js/chat.js`, `extras.js`, `exit.js`: conversa no WhatsApp, nota do preço, dúvidas, busca do final e pop-up de saída.
- `src/js/sheets.js`: no celular, cada seção desliza por cima da anterior.

## Fontes dos números

- 0,05 s pra formar a primeira impressão de um site: Lindgaard e outros, 2006 (*Behaviour & Information Technology*).
- 53% das visitas no celular abandonadas quando a página leva mais de 3 s: Google, 2016.
