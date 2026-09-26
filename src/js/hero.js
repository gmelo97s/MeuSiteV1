// Hero no modelo Linktree.
// Computador: texto à esquerda, torre de cards de vídeo subindo à direita.
// Celular: carrossel 3D (o card do centro na frente, os vizinhos inclinados), que troca sozinho,
// obedece ao dedo e tem o indicador de páginas do iOS.
// Nos dois, quando a pessoa digita o nome do negócio, o projeto mais parecido vem para o centro.
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

const loadAndPlay = (v) => {
  if (!v || reduced) return;
  if (!v.dataset.loaded) {
    v.querySelectorAll('source').forEach((s) => { s.src = s.dataset.src; });
    v.load();
    v.dataset.loaded = '1';
  }
  v.currentTime = 0;
  v.play().catch(() => {});
};

let introCards = null;
export function heroIntro() {
  if (reduced) return;
  const tl = gsap.timeline({ delay: 0.05 })
    .from('.hero__title .mask__in', { yPercent: 112, duration: 1.1, ease: 'power4.out', stagger: 0.1 })
    .from('.hero__lede, .claim, .deck-dots', { y: 26, opacity: 0, duration: 0.9, ease: 'power4.out', stagger: 0.08, clearProps: 'transform,opacity' }, '-=0.8');
  introCards?.(tl);
}

// ---------- computador: torre ----------
function tower({ stage, track, onFocus }) {
  track.innerHTML = Array.from({ length: COPIES }, (_, c) => PROJECTS.map((p) => cardHTML(p, c)).join('')).join('');
  const cards = [...track.children];
  const n = PROJECTS.length;

  let setH = 0;
  let pitch = 0;
  let y = 0;
  let focused = false;
  let visible = true;
  let tween = null;

  const measure = () => {
    setH = cards[n].offsetTop - cards[0].offsetTop;
    pitch = cards[1].offsetTop - cards[0].offsetTop;
  };
  const apply = () => { track.style.transform = `translate3d(0,${y.toFixed(2)}px,0)`; };
  const wrap = () => {
    while (y <= -2 * setH) y += setH;
    while (y > -setH + 1) y -= setH;
  };
  // posição que deixa o card no centro do palco
  const centerOf = (c) => stage.clientHeight / 2 - (c.offsetTop + c.offsetHeight / 2);

  // Só o card do centro toca o vídeo; os outros ficam na capa.
  let current = null;
  const playCenter = () => {
    const mid = stage.clientHeight / 2 - y;
    const hit = cards.find((c) => c.offsetTop <= mid && c.offsetTop + c.offsetHeight >= mid) || null;
    if (hit === current) return;
    current?.querySelector('video')?.pause();
    current = hit;
    if (hit) loadAndPlay(hit.querySelector('video'));
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

  const io = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (!visible) { stop(); current?.querySelector('video')?.pause(); return; }
    if (current && !reduced) current.querySelector('video').play().catch(() => {});
    start();
  });
  io.observe(stage);

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
  onFocus.current = (p) => {
    const was = focused;
    focused = Boolean(p);
    if (p) focusOn(p.id);
    else if (was) { stop(); start(); }
  };

  introCards = (tl) => tl.from(cards, { y: 90, opacity: 0, duration: 1.2, ease: 'power4.out', stagger: 0.07, clearProps: 'opacity' }, '-=1');

  const remeasure = () => { measure(); wrap(); apply(); if (!tween) start(); };
  window.addEventListener('resize', remeasure);
  document.fonts?.ready.then(remeasure);
  return () => {
    stop(); io.disconnect(); window.removeEventListener('resize', remeasure);
    current?.querySelector('video')?.pause();
    track.style.transform = '';
  };
}

// ---------- celular: carrossel 3D ----------
function deck({ stage, track, onFocus }) {
  stage.classList.add('is-deck');
  // na barra estreita do celular o texto do campo precisa caber inteiro
  const input = document.getElementById('negocio');
  const ph = input.placeholder;
  if (window.innerWidth < 400) input.placeholder = 'Nome do negócio';
  track.innerHTML = PROJECTS.map((p) => cardHTML(p, 0)).join('');
  const cards = [...track.children];
  const n = cards.length;
  const dots = document.createElement('div');
  dots.className = 'deck-dots';
  dots.setAttribute('aria-hidden', 'true');
  dots.innerHTML = cards.map(() => '<i></i>').join('');
  stage.after(dots);
  const dotEls = [...dots.children];

  let active = 0;
  let drag = 0; // arrasto em fração de card
  let focused = false;
  let visible = true;
  let timer = null;
  let drift = null;

  const relOf = (i) => {
    let r = (((i - active) % n) + n) % n;
    if (r > n / 2) r -= n;
    return r;
  };
  const pose = (r) => {
    const a = Math.min(Math.abs(r), 2);
    return {
      xPercent: -50 + r * 74,
      yPercent: -50,
      z: -a * 150,
      rotationY: -Math.max(-1.6, Math.min(1.6, r)) * 34,
      scale: 1 - Math.min(a, 1) * 0.16,
      opacity: a > 1.4 ? 0 : 1 - Math.min(a, 1) * 0.28,
    };
  };
  const place = (animate) => {
    cards.forEach((c, i) => {
      const r = relOf(i) + drag;
      c.style.zIndex = String(10 - Math.round(Math.abs(r) * 2));
      c.classList.toggle('is-active', relOf(i) === 0);
      if (animate) gsap.to(c, { ...pose(r), duration: MOVE * 0.82, ease: EASE, overwrite: 'auto' });
      else gsap.set(c, pose(r));
    });
    dotEls.forEach((d, i) => d.classList.toggle('is-on', i === active));
  };

  const play = () => {
    cards.forEach((c, i) => { if (i !== active) c.querySelector('video').pause(); });
    if (visible) loadAndPlay(cards[active].querySelector('video'));
    // o card da frente anda devagar enquanto espera (o "respiro" do Linktree)
    drift?.kill();
    if (!reduced) drift = gsap.fromTo(cards[active].querySelector('.pcard__video'), { scale: 1 }, { scale: 1.05, duration: DWELL + MOVE, ease: 'none' });
  };
  const schedule = () => {
    clearTimeout(timer);
    if (reduced || focused || !visible) return;
    timer = setTimeout(() => go(active + 1), DWELL * 1000);
  };
  const go = (i) => {
    active = ((i % n) + n) % n;
    drag = 0;
    place(true);
    play();
    schedule();
  };

  place(false);
  play();
  schedule();

  // arrastar com o dedo (a rolagem vertical continua livre)
  let sx = 0; let sy = 0; let dragging = false; let decided = false;
  const w = () => cards[0].offsetWidth || 300;
  const down = (e) => {
    sx = e.clientX; sy = e.clientY; dragging = true; decided = false;
    clearTimeout(timer);
  };
  const move = (e) => {
    if (!dragging) return;
    const dx = e.clientX - sx; const dy = e.clientY - sy;
    if (!decided) {
      if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
      decided = true;
      if (Math.abs(dy) > Math.abs(dx)) { dragging = false; schedule(); return; }
    }
    drag = -dx / (w() * 0.74);
    drag = Math.max(-1.2, Math.min(1.2, drag));
    cards.forEach((c, i) => gsap.set(c, pose(relOf(i) - drag)));
  };
  const up = () => {
    if (!dragging) return;
    dragging = false;
    const d = drag;
    drag = 0;
    if (d > 0.18) go(active + 1);
    else if (d < -0.18) go(active - 1);
    else { place(true); schedule(); }
  };
  stage.addEventListener('pointerdown', down);
  window.addEventListener('pointermove', move, { passive: true });
  window.addEventListener('pointerup', up);
  window.addEventListener('pointercancel', up);
  cards.forEach((c, i) => c.addEventListener('click', () => { if (relOf(i) !== 0) go(i); }));

  const io = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (!visible) { clearTimeout(timer); cards[active].querySelector('video').pause(); return; }
    play(); schedule();
  });
  io.observe(stage);

  onFocus.current = (p) => {
    focused = Boolean(p);
    if (p) go(PROJECTS.findIndex((x) => x.id === p.id));
    else schedule();
  };

  introCards = (tl) => {
    tl.fromTo(cards, { y: 120, opacity: 0 }, { y: 0, opacity: (i) => pose(relOf(i)).opacity, duration: 1.2, ease: 'power4.out', stagger: 0.06 }, '-=1');
  };

  return () => {
    clearTimeout(timer); drift?.kill(); io.disconnect();
    stage.removeEventListener('pointerdown', down);
    window.removeEventListener('pointermove', move);
    window.removeEventListener('pointerup', up);
    window.removeEventListener('pointercancel', up);
    cards.forEach((c) => c.querySelector('video').pause());
    dots.remove();
    input.placeholder = ph;
    stage.classList.remove('is-deck');
  };
}

export function initHero() {
  const stage = document.querySelector('.hero__stage');
  const track = document.getElementById('tower-track');
  const form = document.getElementById('claim');
  const input = document.getElementById('negocio');
  if (!track) return;

  const onFocus = { current: null };
  const mm = gsap.matchMedia();
  mm.add({ desk: '(min-width: 901px)', mob: '(max-width: 900px)' }, (ctx) => (
    ctx.conditions.mob ? deck({ stage, track, onFocus }) : tower({ stage, track, onFocus })
  ));

  let lastId = null;
  store.on((d) => {
    const p = projectForName(d.nm);
    const id = p ? p.id : null;
    if (id !== lastId) onFocus.current?.(p);
    lastId = id;
  });

  input.addEventListener('input', () => store.set({ name: input.value.slice(0, 32) }));
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    input.blur();
    window.open(waLink('default', store.get().nm), '_blank', 'noopener');
  });
}
