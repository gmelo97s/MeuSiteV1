# CODEM · Sites com estética de agência, entregues em 24 horas

Página de vendas da CODEM. Mostra ao dono do negócio como fica um site com cara de aplicativo, prova com sites reais no ar e leva para a prévia grátis pelo WhatsApp. Ele só paga depois de ver o site pronto e no ar.

## Rodar

```bash
npm install
npm run dev      # desenvolvimento
npm run build    # gera dist/ (é o que a Vercel publica)
```

A Vercel publica a partir da branch `main`.

## A página, seção por seção

1. Topo: a promessa, o botão "Quero ver como fica o meu" e um celular em 3D navegando por sites reais (embaixo, só o segmento de cada um).
2. Pense na última vez que você escolheu um lugar novo: dois celulares lado a lado, o concorrente com site e você com link e PDF.
3. Cliente não compra o melhor, compra o que parece melhor: antes e depois de uma hamburgueria, um bar, uma loja de bolsas e uma adega.
4. Quanto custa ficar apagado: a pessoa ajusta clientes por semana e ticket e vê quanto vai para o concorrente.
5. Criamos tudo aquilo que você já imaginou: os recursos giram em órbita e cada um abre um vídeo num carrossel.
6. Sites que já estão no ar: portfólio por segmento, com notebook e celular.
7. Agência cobra antes e mostra depois: a comparação com a CODEM.
8. Como funciona: quatro passos e uma conversa de WhatsApp de exemplo.
9. Prazer, Guilherme.
10. Oferta: tudo o que um site premium tem, somado, e o preço da CODEM.
11. Dúvidas e rodapé com a marca.

O botão "Quero ver como fica o meu" abre um formulário de três perguntas, uma por vez, que monta a mensagem e envia pelo WhatsApp.

## Onde mexer

Tudo fica em `index.html`: textos, estilos (variáveis de cor no topo do `<style>`) e o script no fim do arquivo.

| Quero mudar… | Onde |
|---|---|
| Número do WhatsApp | `const PHONE` no script e os links `wa.me/5511937654207` |
| Recursos do carrossel | lista `const F` no script |
| Antes e depois | lista `const CASES` no script |
| Projetos do portfólio | lista `const P` no script |
| Sites que passam no celular do topo | vídeos `.hero-vid` logo depois do menu |
| Vídeos e imagens | `public/media/` |
| Imagem que aparece ao compartilhar o link | `public/og.jpg` (1200 × 630) |

## Identidade

- Branco como cor principal e preto como segunda cor. Laranja `#FF5B1F` e azul `#3355FF` só quando precisam chamar atenção.
- Unbounded nos títulos, Geist nos textos e Instrument Serif itálica nos destaques.
- Formas arredondadas que mudam de forma ligam uma seção à outra.

## Bibliotecas

GSAP com ScrollTrigger, Lenis (rolagem suave no computador) e Three.js (celular em 3D), carregadas por CDN. O CSS sai sem minificação de propósito, para o site publicado ficar idêntico ao que foi testado.
