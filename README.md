# CODEM · Sites sob medida que não deixam venda escapar

Página de vendas da CODEM. Mostra ao dono do negócio o que um site bem feito muda na venda, prova com sites reais no ar e leva para a prévia grátis pelo WhatsApp. Ele só paga depois de aprovar o site no ar.

## Rodar

```bash
npm install
npm run dev      # desenvolvimento
npm run build    # gera dist/ (é o que a Vercel publica)
```

A Vercel publica a partir da branch `main`.

## A página, seção por seção

1. Topo: a headline em dois estados que se alternam, o botão da prévia e um celular em 3D com quatro cenas (loja, hamburgueria, drinks e reservas). Cada recurso salta da tela para a coluna ao lado, ligado por uma linha ao ponto da tela de onde saiu.
2. O que seu cliente encontra quando clica no seu link: o mesmo celular do topo desce com a rolagem e para à direita. À esquerda, o "antes" da mesma cena (preço só no direct, PDF, reserva por mensagem).
3. Caso real do bar: seis passos, do direct à planilha, ao formulário, ao painel, à aprovação e aos números.
4. Onde você está perdendo vendas agora: o visitante toca no que acontece com ele e o placar conta as portas abertas para o concorrente.
5. Sites que já estão vendendo: notebook, tablet e celular, e cartões que se abrem com os porquês de cada site.
6. Tudo o que faz o seu cliente comprar mais: recursos com vídeo.
7. Como funciona: quatro passos e um exemplo de conversa com um cliente novo.
8. Você não paga para ver: R$ 0 para ver o site no ar, 24 horas e risco zero, mais a comparação com agência e site genérico de IA.
9. Dúvidas e rodapé com a marca.

O botão "Quero minha prévia grátis" abre um formulário de três perguntas, uma por vez, que monta a mensagem e envia pelo WhatsApp.

## Onde mexer

Tudo fica em `index.html`: textos, estilos (variáveis de cor no topo do `<style>`) e o script no fim do arquivo.

| Quero mudar… | Onde |
|---|---|
| Número do WhatsApp | `const PHONE` no script e os links `wa.me/5511937654207` |
| Cenas do topo e recursos que saltam da tela | lista `const SC` no script (tempo de cada recurso em segundos do vídeo) |
| "Antes" de cada cena na segunda dobra | objeto `const BEFORE` no script |
| Sites do portfólio e os porquês de cada um | lista `const SITES` no script |
| Recursos com vídeo | lista `const F` no script |
| Vídeos e imagens | `public/media/` (`-s.mp4` é a versão leve para celular fraco ou internet lenta) |
| Imagem que aparece ao compartilhar o link | `public/og.jpg` (1200 × 630) |

## Identidade

- Branco como cor principal e preto nos capítulos escuros. Azul `#2B44FF` como cor da marca: títulos do topo, botões e a dobra das perdas.
- Vermelho só para o "antes" e verde só para o resultado bom, para a comparação ficar clara.
- Unbounded nos títulos e Geist nos textos.

## Bibliotecas

GSAP e Lenis (rolagem suave no computador) por CDN. O Three.js (celular em 3D) só carrega depois que a página abre e só em aparelhos que aguentam; nos outros o celular é feito em CSS. O CSS sai sem minificação de propósito, para o site publicado ficar idêntico ao que foi testado.
