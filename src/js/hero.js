// Hero no modelo Linktree: texto à esquerda, torre de projetos reais subindo à direita.
// Quando a pessoa digita o nome do negócio, a torre traz para o centro o projeto mais parecido.
import { gsap, reduced } from './motion.js';
import { PROJECTS, projectForName } from './data.js';
import { store, waLink } from './store.js';

const COPIES = 3;
// Ritmo do Linktree: o card entra e sai acelerando forte e, no meio, fica parado
// quase o tempo todo, andando bem devagar.
const MOVE = 1.1; // s da troca de card
const DWELL = 4; // s com o card no centro
const DRIFT = 22; // px que ele anda devagar durante a pausa
const EASE = 'expo.inOut';

// Cada card é um vídeo de 8 s em loop: o tour do site em 3D, com zoom nas interações.
function cardHTML(p, copy) {
  const hidden = copy > 0 ? ' aria-hidden="true"' : '';
  return `<article class="pcard" data-id="${p.id}" style="--bg:${p.hero.bg}" aria-label="${p.name}: ${p.type}"${hidden}>
    <video class="pcard__video" muted playsinline loop preload="none" poster="/videos/card-${p.id}.webp" aria-hidden="true">
      <source data-src="/videos/card-${p.id}.webm" type="video/webm" />
      <source data-src="/videos/card-${p.id}.mp4" type="video/mp4" />
    </video>
    <span class="pcard__shade"></span>
    <p class="pcard__cap">${p.hero.caption}</p>
  </article>`;
}

export function heroIntro() {
  if (reduced) return;
  gsap.timeline({ delay: 0.05 })
    .from('.hero__title .mask__in', { yPercent: 112, duration: 1.1, ease: 'power4.out', stagger: 0.1 })
    .from('.hero__lede, .claim', { y: 26, opacity: 0, duration: 0.9, ease: 'power4.out', stagger: 0.08, clearProps: 'transform,opacity' }, '-=0.8')
    .from('#tower-track .pcard', { y: 90, opacity: 0, duration: 1.2, ease: 'power4.out', stagger: 0.07, clearProps: 'transform,opacity' }, '-=1');
}

export function initHero() {
  const stage = document.querySelector('.hero__stage');
  const track = document.getElementById('tower-track');
  const form = document.getElementById('claim');
  const input = document.getElementById('negocio');
  if (!track) return;

  track.innerHTML = Array.from({ length: COPIES }, (_, c) => PROJECTS.map((p) => cardHTML(p, c)).join('')).join('');
  const cards = [...track.children];
  const n = PROJECTS.length;

  let setH = 0;
  let pitch = 0;
  let y = 0;
  let focused = false;
  let visible = true;
  let tween = null;
  let loop = null;

  const measure = () => {
    setH = cards[n].offsetTop - cards[0].offsetTop;
    pitch = cards[1].offsetTop - cards[0].offsetTop;
  };
  const apply = () => { track.style.transform = `translate3d(0,${y.toFixed(2)}px,0)`; };
  const wrap = () => {
    while (y <= -2 * setH) y += setH;
    while (y > -setH + 1) y -= setH;
  };
  // posição que deixa o card i no centro do palco
  const centerOf = (c) => stage.clientHeight / 2 - (c.offsetTop + c.offsetHeight / 2);

  // Só o card do centro toca o vídeo; os outros ficam na capa.
  let current = null;
  const playCenter = () => {
    const mid = stage.clientHeight / 2 - y;
    const hit = cards.find((c) => c.offsetTop <= mid && c.offsetTop + c.offsetHeight >= mid) || null;
    if (hit === current) return;
    current?.querySelector('video')?.pause();
    current = hit;
    if (!hit || reduced) return;
    const v = hit.querySelector('video');
    if (!v.dataset.loaded) {
      v.querySelectorAll('source').forEach((s) => { s.src = s.dataset.src; });
      v.load();
      v.dataset.loaded = '1';
    }
    v.currentTime = 0;
    v.play().catch(() => {});
  };

  const go = (to, duration, ease, then) => {
    tween?.kill();
    const o = { v: y };
    tween = gsap.to(o, {
      v: to, duration, ease,
      onUpdate: () => { y = o.v; apply(); playCenter(); },
      onComplete: () => { tween = null; then?.(); },
    });
  };

  // pausa lenta no card atual e depois troca pelo próximo
  const dwell = () => {
    if (focused || !visible) return;
    go(y - DRIFT, DWELL, 'none', next);
  };
  const next = () => {
    if (focused || !visible) return;
    go(y - (pitch - DRIFT), MOVE, EASE, () => { wrap(); apply(); dwell(); });
  };
  const start = () => {
    if (reduced || focused || !visible || tween) return;
    // encaixa no card mais perto do centro e começa a pausa dele
    const c = cards.reduce((b, c) => (Math.abs(centerOf(c) - y) < Math.abs(centerOf(b) - y) ? c : b));
    go(centerOf(c) + DRIFT / 2, 0.6, 'power3.out', dwell);
  };
  const stop = () => { tween?.kill(); tween = null; };

  measure();
  y = centerOf(cards[n]) + DRIFT / 2;
  apply();
  playCenter();
  if (!reduced) dwell();

  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (!visible) { stop(); current?.querySelector('video')?.pause(); return; }
    if (current && !reduced) current.querySelector('video').play().catch(() => {});
    start();
  }).observe(stage);

  // Centraliza o card do projeto que combina com o nome digitado.
  const focusOn = (id) => {
    let best = null;
    cards.forEach((c) => {
      if (c.dataset.id !== id) return;
      const t = centerOf(c);
      if (best === null || Math.abs(t - y) < Math.abs(best - y)) best = t;
    });
    if (best === null) return;
    if (reduced) { stop(); y = best; apply(); playCenter(); return; }
    go(best, MOVE, EASE, () => { wrap(); apply(); });
  };

  let lastId = null;
  store.on((d) => {
    const p = projectForName(d.nm);
    const was = focused;
    focused = Boolean(p);
    if (p && p.id !== lastId) focusOn(p.id);
    if (!p && was) { stop(); start(); }
    lastId = p ? p.id : null;
  });

  input.addEventListener('input', () => store.set({ name: input.value.slice(0, 32) }));
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    input.blur();
    window.open(waLink('default', store.get().nm), '_blank', 'noopener');
  });

  const remeasure = () => { measure(); wrap(); apply(); if (!tween) start(); };
  window.addEventListener('resize', remeasure);
  document.fonts?.ready.then(remeasure);
}
