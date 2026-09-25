# Análise das referências visuais

Referências definidas: **[linktr.ee](https://linktr.ee/)** e **[apus-institucional.vercel.app](https://apus-institucional.vercel.app/)**.
Análise feita em 25/09/2026 lendo o HTML, o CSS e o JS de cada site e capturando telas em desktop (1440px) e celular (390px).

---

## 1. Linktree: estética

| Item | O que eles fazem |
|---|---|
| **Cor** | Cada dobra é um bloco de cor chapada e saturada: lima `#D2E823` (hero), azul-cobalto `#2665D6`, vinho `#780016`, sálvia/creme `#EFF0EC`, roxo `#502274` (rodapé). O texto contrasta dentro da própria família: lima sobre azul, rosa `#E9C0E9` sobre vinho, verde-floresta `#254F1A` sobre lima. |
| **Tipografia** | Grotesca pesada própria (Link Sans, variável), peso ~800, espaçamento negativo, títulos de 56 a 90px (`clamp(62px, 6.28vw, 90px)`). Texto de apoio 16 a 20px. |
| **Navegação** | Pílula branca flutuante com cantos bem arredondados, afastada das bordas. Botões em pílula ("Log in" cinza-claro, "Sign up free" escuro). |
| **Formas** | Raios de 16, 24, 32 e 48px. Botões 100% arredondados. |
| **Hero** | Duas colunas: à esquerda a headline e um **campo de "reservar" o endereço** (`linktr.ee/ [ Get started for free ]`); à direita uma **coluna de cards de foto arredondados que sobe em loop**, com criadores reais segurando o celular. |
| **Mockups** | Celulares 3D inclinados flutuando, com "adesivos" em volta (cereja, discos, moedas). Cards empilhados em leque. |
| **Métricas** | Bento de cards coloridos com números grandes (cliques, plays, vendas, visitas). |
| **Prova social** | "The only link in bio trusted by 70M+ **musicians / podcasters / bands**" com a palavra final trocando, e um letreiro horizontal de cards com formatos variados (círculo, retângulo, card 3D inclinado). |
| **Recursos** | Bento de 2 colunas em lilás, lima e azul-marinho, cada card com um mockup. |
| **Depoimento** | Foto recortada em pílula com listras atrás, citação grande centralizada, setas. |
| **FAQ** | Acordeão de pílulas escuras sobre fundo vinho. |
| **CTA final** | Fundo roxo com ilustração de silhueta ciano, repete o campo de "reservar" o endereço. Rodapé é um card branco arredondado dentro do roxo. |

## 2. Linktree: animações

- **Torre do hero**: keyframes `home-hero-tower-up` / `home-hero-tower-left`, coluna de cards subindo continuamente.
- **Lottie** no hero (animação vetorial), com pôster `.webp` enquanto carrega.
- **Palavra rotativa** na headline de prova social.
- **Letreiro** (`marquee`) horizontal infinito, alguns cards com perspectiva 3D.
- Acordeão (`accordion-down/up`), menus (`nav-dropdown-in`), overlays (`overlay-in/out`).
- Curva padrão `cubic-bezier(.4, 0, .2, 1)`.
- O movimento é discreto: o impacto vem da cor e das fotos, sem prender a rolagem.

---

## 3. APUS: estética

| Item | O que eles fazem |
|---|---|
| **Cor** | Noite premium: preto `#000`/`#0D0D0D`, luz amarela `#FBCC2F` → laranja `#F9942F` (gradiente 135°), CTA verde neon `#00E676`, cinzas frios (`#71717A`, `#A1A1AA`, `#18181B`). |
| **Tipografia** | Roboto **300 (fina)** em tudo. Títulos grandes com espaçamento `-0.03em` e entrelinha 1.08. A elegância vem da leveza. |
| **Header** | Barra preta translúcida (75% → 92% ao rolar, ganha sombra), links ao centro, 2 CTAs à direita (contorno + amarelo) com seta ↗. |
| **Detalhes** | Selo entre colchetes: `[ Mais de um milhão de brasileiros… ]`. Largura máx. 1720px. Cards com raio de 20 a 24px. |
| **Ritmo** | Seções alternando preto, amarelo e branco-gelo. |
| **Mockups** | Moldura de iPhone 14 Pro com telas reais, cartões 3D, pessoa sobre fundo amarelo. |
| **Produtos** | Bento com **vídeos em loop** (autoplay, mudo, inline) e degradê escuro para o texto. |
| **"Por que escolher"** | Órbita: logo no centro e 4 pílulas girando com linhas radiais. |
| **Fechamento** | Timeline de 3 passos, FAQ com foto ao lado, pré-rodapé centralizado, rodapé em 5 colunas. |

## 4. APUS: animações (técnica exata)

1. **Vinheta de entrada (cortina)**: tela amarela cheia com o logo, que sobe (`translateY(-100%)`, 0,5s, `cubic-bezier(.85,0,.15,1)`) após ~450ms. Um clique pula.
2. **Splash entre páginas**: overlay em gradiente amarelo com o logo "saltando" (0,6s, curva com leve ultrapassagem), 620ms antes de trocar de página.
3. **Rolagem suave própria**: intercepta a roda do mouse e interpola 10% por quadro. Fica desligada no toque e para quem pede menos movimento. Âncoras com recuo de 72px.
4. **Título do hero**: a 2ª linha nasce de dentro de uma máscara (0,9s, curva expo-out) e tem **texto holográfico** (gradiente de 5 tons animado em 5s). Brilho radial amarelo no topo (desfoque de 140px).
5. **Storytelling com o celular fixo** (seção de 420vh, janela fixa):
   - 0–22% da rolagem: o hero some (opacidade e −70px), a camada amarela acende, o celular sobe de +345px até o centro e cresce de 0,9 para 1.
   - 22–100%: 3 etapas. Trocam juntos o texto da esquerda, o checklist da direita, a tela do celular e os pontinhos de progresso (clicáveis, pulam para a etapa).
6. **Celulares em leque**: quando a seção aparece, os laterais saem de trás do central (±162% / 62%, girados ∓7°, de 0,72 a 1; 1,15s com atraso de 0,18s). O central pulsa com "Toque para simular".
7. **Simulador do app** em modal: Pix funcionando, saldo, extrato, congelar cartão. A interação vira argumento de venda.
8. **Pilha de cartões**: seção fixa; a 25% e 55% do progresso entra mais um cartão (surge e desce 30px mantendo a inclinação de 12°), com linha-ponteiro ligando a descrição.
9. **Hover do bento**: sobe 6px, borda amarela, vídeo cresce 5%.
10. **Órbita**: anel gira em 32–40s, pílulas contra-giram para ficar de pé; o hover pausa e mostra o detalhe no centro.
11. **Revelar ao rolar**: surge de baixo com desfoque de 6px que some. 0,85s, `cubic-bezier(.22,1,.36,1)`, escalonado em 90ms por item.
12. **Botões vivos**: gradiente animado em 5s, que também **segue o ponteiro**. Seta ↗ desloca 2px no hover, botão sobe 2px com sombra.
13. **Inclinação 3D** em cards (perspectiva 1000, ±10°, 1.02).
14. **Celular**: desliga as animações fixas pesadas e troca por lista simples; respeita "reduzir movimento".

Curvas mais usadas: `cubic-bezier(.22,1,.36,1)` (31×), `cubic-bezier(.16,1,.3,1)` (12×), `cubic-bezier(.34,1.56,.64,1)` (9×, para "saltos").

---

## 5. Síntese: o que levar para o Origem Digital

**Do Linktree**
- Energia de cor em blocos e headline pesada.
- Campo de "reservar" o endereço → `seunegocio.com.br [ Acender minha vitrine ]`.
- Coluna de cards subindo no hero.
- Letreiro de prova com palavra que troca ("…para **padarias / barbearias / clínicas**").
- Bento de números coloridos (serve para a calculadora "Quanto custa ficar apagado?").
- FAQ em pílulas e rodapé em card.

**Da APUS**
- Base noturna com luz âmbar.
- Cortina de entrada: aqui ela vira a **porta de aço da loja subindo**.
- Celular fixo que liga o hero à 2ª dobra e troca de tela por etapa.
- Revelar com desfoque, botões com gradiente vivo, leque de celulares, simulação interativa, órbita.

**Tensão a resolver**: Linktree é claro e colorido, APUS é escuro e luxuoso.
Proposta: a **noite é a base** (combina com a copy "23h47 · Sua loja fechou · Deixa a luz acesa") e os **blocos de cor saturada entram quando a "luz acende"**. O gradiente brasa/âmbar marcado no Miro ("Gosto desse tipo de gradiente") é a ponte entre os dois.
