# CODEM · Sites sob medida pro seu negócio

Página de vendas da CODEM. Mostra ao dono do negócio o que um site bem feito muda na venda, prova com sites reais no ar e leva para a prévia grátis pelo WhatsApp. Ele só paga depois de aprovar o site no ar.

## Rodar

```bash
npm install
npm run dev      # desenvolvimento
npm run build    # gera dist/ (é o que a Vercel publica)
```

A Vercel publica a partir da branch `main`.

## A página, seção por seção

1. Abertura: sem barra de carregamento. As letras do logo saem do centro, se abrem e formam a palavra CODEM; o logo sobe para o lugar dele no topo e a página aparece.
2. Topo escuro: a headline em dois estados que se alternam, o botão da prévia e o celular aparecendo por baixo.
3. Vídeo automático: com um toque de rolagem o celular vai para o centro e mostra quatro sites (loja, hamburgueria, drinks e reservas). Em cada recurso o vídeo para, as peças da tela se descolam em camadas 3D e montam o recurso ao lado do celular, com uma seta saindo do ponto exato da tela. Depois as peças voltam ao lugar e o vídeo segue. A frase muda de lado conforme o recurso.
4. Antes e depois: o mesmo celular desce e para à direita. À esquerda, o "antes" da mesma cena (preço só no direct, PDF, reserva por mensagem).
5. Caso real do bar: reservas e cardápio inteligente, com tempo, clientes e pedidos.
6. Onde você está perdendo vendas agora: a pessoa escolhe a situação dela (sem site, site antigo, PDF nos destaques, tudo no Instagram, plataforma pronta, tudo no WhatsApp e no direct) e faz a conta dentro do próprio texto.
7. Sites que já estão vendendo: notebook, tablet e celular, e cartões que se abrem com os porquês de cada site.
8. Tudo o que faz o seu cliente comprar mais: recursos com vídeo.
9. Como funciona: quatro passos e a conversa do jeito que o cliente vai ver, ele mandando mensagem e o Guilherme respondendo.
10. Você não paga para ver: R$ 0 para ver o site no ar, 24 horas e risco zero, mais a comparação com agência e site genérico de IA.
11. Dúvidas e rodapé com a marca.

O botão "Quero minha prévia grátis" abre um formulário de três perguntas, uma por vez, que monta a mensagem e envia pelo WhatsApp.

## Onde mexer

Tudo fica em `index.html`: textos, estilos (variáveis de cor no topo do `<style>`) e o script no fim do arquivo.

| Quero mudar… | Onde |
|---|---|
| Número do WhatsApp | `const PHONE` no script e os links `wa.me/5511937654207` |
| Abertura com o logo | módulo `loader` no script e `#loader` no começo do `<body>` |
| Cenas do vídeo e recursos que saem da tela | lista `const SC` no script: tempo de cada recurso em segundos do vídeo, região da tela de onde ele sai e as frases |
| Situações da calculadora | botões `#cases` no HTML e lista `const WHY` no script |
| Foto do WhatsApp em "Como funciona" | `public/media/gui-av.webp` |
| "Antes" de cada cena na segunda dobra | objeto `const BEFORE` no script |
| Sites do portfólio e os porquês de cada um | lista `const SITES` no script |
| Recursos com vídeo | lista `const F` no script |
| Vídeos e imagens | `public/media/` (`-s.mp4` é a versão leve para celular fraco ou internet lenta) |
| Imagem que aparece ao compartilhar o link | `public/og.jpg` (1200 × 630) |

## Identidade

- Preto na abertura, no topo e no vídeo; branco a partir do antes e depois.
- Laranja `#FF5B1F` só no que é destaque: palavras-chave, botões (com texto preto) e a dobra das perdas.
- Vermelho só para o "antes" e verde só para o resultado bom, para a comparação ficar clara.
- Unbounded nos títulos e Geist nos textos.

## Bibliotecas

GSAP e Lenis (rolagem suave no computador) por CDN. O Three.js (celular em 3D) só carrega em aparelhos que aguentam e monta a cena enquanto o logo da abertura está parado, para nada engasgar; nos outros o celular é feito em CSS e os recursos saem da tela do mesmo jeito. O CSS sai sem minificação de propósito, para o site publicado ficar idêntico ao que foi testado.
