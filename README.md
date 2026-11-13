# CODEM · Sites que vendem

Página de vendas da CODEM. Leva o dono de qualquer negócio de "nem sei que tenho um problema" até "quero ver como fica o meu", com a prévia grátis como convite.

## Rodar

```bash
npm install
npm run dev      # desenvolvimento
npm run build    # gera dist/ (é o que a Vercel publica)
```

A Vercel publica o projeto origemdigitalv1 a partir da branch `main`.

## A página, seção por seção

1. Topo: "Tem gente pior que você levando os seus clientes." e o botão da prévia grátis.
2. A busca: vídeo de uma busca em que três concorrentes aparecem e o negócio da pessoa não.
3. Antes e depois: sem site, site ruim e com a CODEM, lado a lado.
4. A conta: quanto a pessoa perde por ano, com os números dela.
5. Projetos no ar.
6. A prévia grátis: três passos e uma conversa de WhatsApp de exemplo.
7. Quem faz, dúvidas e o convite final.

## Onde mexer

| Quero mudar… | Arquivo |
|---|---|
| Textos | `index.html` |
| Cores, fontes e espaçamentos | `src/styles/main.css` (variáveis no topo) |
| WhatsApp, mensagem pronta, projetos, conversa de exemplo e valores da conta | `src/main.js` |
| Vídeo do topo | `public/videos/topo-m.mp4` e capa `.webp` |
| Vídeo da busca | `public/videos/busca-m.mp4` e capa `.webp` |
| Telas de "sem site" e "site ruim" | `public/img/antes-sem-site.webp` e `antes-site-ruim.webp` |

## Identidade

- Preto `#0A0A0A`, off-white `#F4F4F1`, azul `#3355FF` e laranja `#FF5B1F`.
- Inter nos textos e Instrument Serif itálica nas palavras de destaque.
- Sem etiquetas acima dos títulos, sem ícones decorativos e sem menu: a página respira.

## Leveza no celular

Nada de rolagem forçada nem seção presa na tela. As entradas são só transições de CSS, os vídeos tocam apenas quando aparecem e a abertura dura cerca de 1 segundo, só na primeira visita.
