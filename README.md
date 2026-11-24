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
2. Topo escuro: a headline em dois estados que se alternam, a subheadline e o botão da prévia, com o celular aparecendo por baixo.
3. Vídeo automático: o celular vai para o centro e mostra quatro negócios, nesta ordem: hamburgueria, cardápio do bar, reservas e loja de bolsas. Em cada recurso o vídeo para, as peças da tela se soltam em camadas 3D (recortadas de quadros em alta resolução) e montam o recurso ao lado do celular, que continua girando e respirando enquanto ele está fora. Entre um recurso e outro, um anel percorre a tela com uma etiqueta explicando o que acontece, e os trechos sem novidade passam acelerados.
4. Antes e depois: o mesmo celular desce e para à direita; à esquerda, o "antes" da mesma cena.
5. Números, em fundo branco e numa tela só: a pergunta de 2027 e quatro números de pesquisa real que contam até o valor com um gráfico pequeno cada (PwC, Sebrae, Locaweb e a projeção do EBANX para 2027, com a fonte embaixo de cada um).
6. Pense em 100 clientes: 79 pesquisam antes de comprar e, sem site, vão embora; a dobra termina chamando o caso do bar.
7. Caso real do bar: reservas e cardápio inteligente, com tempo, clientes e pedidos.
8. Três sites em um: o mesmo site no computador, no tablet e no celular, cada um com o seu layout, saindo de um aparelho só e rolando juntos.
9. Simulador de perdas, com cara de app de banco: a pessoa escolhe a situação dela e as perguntas mudam para aquele cenário, com uma luz saindo da opção até as perguntas. São quatro controles (pessoas, quantas desistem antes de te achar, quantas desistem depois, gasto médio) e o resultado, em vermelho, mostra quanto ela deixa de faturar por mês, por dia e em 12 meses, e quantos clientes perde.
10. Sites que já estão vendendo: notebook, tablet e celular, e cartões que se abrem como stories, um destaque curto por vez que passa sozinho (toque nas laterais para voltar ou avançar, segure para pausar) e, no fim, segue para o próximo site.
11. Tudo o que faz o seu cliente comprar mais: recursos com vídeo.
12. Como funciona: quatro passos e a conversa do jeito que o cliente vai ver, ele mandando mensagem e a CODEM respondendo.
13. Você não paga para ver: R$ 0 para ver o site no ar, 24 horas e risco zero, mais a comparação com agência e site genérico de IA.
14. Dúvidas e rodapé com a marca.

O botão "Quero minha prévia grátis" abre um formulário de três perguntas, uma por vez, que monta a mensagem e envia pelo WhatsApp.

## Onde mexer

Tudo fica em `index.html`: textos, estilos (variáveis de cor no topo do `<style>`) e o script no fim do arquivo.

| Quero mudar… | Onde |
|---|---|
| Número do WhatsApp | `const PHONE` no script e os links `wa.me/5511937654207` |
| Abertura com o logo | módulo `loader` no script e `#loader` no começo do `<body>` |
| Cenas do vídeo e recursos que saem da tela | lista `const SC` no script: tempo de cada recurso em segundos do vídeo, região da tela de onde ele sai e as frases |
| Etiquetas entre um recurso e outro | campo `spots` de cada cena em `const SC` (tempo de início e fim, região da tela e texto) |
| Quadros nítidos dos recursos | `public/media/hi-*.webp` e a tabela `const HIRES` no script |
| Três sites em um | `#telas` no HTML e `public/media/tri-*.webp` (o site capturado no celular, tablet e computador) |
| Situações, perguntas e números do simulador | botões `#cases` no HTML e, no módulo `calc` do script, a lista `SITU` (perguntas, valores iniciais e o porquê de cada situação) e `VALS` (valores de cada controle) |
| Números de pesquisa | `#numeros` e `#cem` no HTML (o número, a frase e a fonte de cada um) |
| Foto do WhatsApp em "Como funciona" | `public/media/gui-av.webp` |
| "Antes" de cada cena na segunda dobra | objeto `const BEFORE` no script |
| Sites do portfólio e os stories de cada um | lista `const SITES` no script (campo `st`: etiqueta, frase grande e linha de apoio de cada story) |
| Recursos com vídeo | lista `const F` no script |
| Vídeos e imagens | `public/media/` (`-s.mp4` é a versão leve para celular fraco ou internet lenta) |
| Imagem que aparece ao compartilhar o link | `public/og.jpg` (1200 × 630) |

## Identidade

- Preto na abertura, no topo, no vídeo, no caso e no simulador; branco e cinza-claro no resto, alternando as dobras.
- Laranja `#FF5B1F` só no que é destaque: palavras-chave, botões (com texto preto) e a dobra das perdas.
- Vermelho só para o "antes" e verde só para o resultado bom, para a comparação ficar clara.
- Unbounded nos títulos e Geist nos textos.

## Bibliotecas

GSAP e Lenis (rolagem suave no computador) por CDN. O Three.js (celular em 3D) só carrega em aparelhos que aguentam e monta a cena enquanto o logo da abertura está parado, para nada engasgar; nos outros o celular é feito em CSS e os recursos saem da tela do mesmo jeito. O CSS sai sem minificação de propósito, para o site publicado ficar idêntico ao que foi testado.
