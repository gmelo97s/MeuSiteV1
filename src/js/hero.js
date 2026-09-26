// Hero no modelo Linktree: texto à esquerda, torre de projetos reais subindo à direita.
// Quando a pessoa digita o nome do negócio, a torre traz para o centro o projeto mais parecido.
import { gsap, reduced } from './motion.js';
import { PROJECTS, projectForName } from './data.js';
import { store, waLink } from './store.js';

const COPIES = 3;
const SPEED = 36; // px por segundo

function cardHTML(p, copy) {
  const h = p.hero;
  const cls = [
    'pcard',
    h.fit === 'contain' ? 'pcard--contain' : '',
    h.cut ? 'pcard--cut' : '',
    h.tone === 'light' ? 'pcard--light' : '',
  ].filter(Boolean).join(' ');
  const hidden = copy > 0 ? ' aria-hidden="true"' : '';
  return `<article class="${cls}" data-id="${p.id}" style="--bg:${h.bg};--pos:${h.pos}" aria-label="${p.name}: ${p.type}"${hidden}>
    <img class="pcard__photo" src="${h.photo}" alt="" decoding="async" />
    <span class="pcard__shade"></span>
    <div class="phone" aria-hidden="true"><span class="phone__island"></span><div class="phone__screen">
      <video muted playsinline loop preload="none" poster="/videos/${p.id}-m.webp">
        <source data-src="/videos/${p.id}-m.webm" type="video/webm" />
        <source data-src="/videos/${p.id}-m.mp4" type="video/mp4" />
      </video>
    </div></div>
    <p class="pcard__cap">${h.caption}</p>
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
  let y = 0;
  let focused = false;
  let visible = true;
  let tween = null;

  const measure = () => {
    setH = cards[n].offsetTop - cards[0].offsetTop;
  };
  const apply = () => { track.style.transform = `translate3d(0,${y.toFixed(2)}px,0)`; };
  const wrap = () => {
    while (y <= -2 * setH) y += setH;
    while (y > -setH + 1) y -= setH;
  };

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
    v.play().catch(() => {});
  };

  measure();
  y = -setH;
  apply();
  playCenter();

  if (!reduced) {
    gsap.ticker.add((time, dt) => {
      if (focused || !visible || tween) return;
      y -= (SPEED * dt) / 1000;
      wrap();
      apply();
      playCenter();
    });
  }
  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (!visible) current?.querySelector('video')?.pause();
    else if (current && !reduced) current.querySelector('video').play().catch(() => {});
  }).observe(stage);

  // Centraliza o card do projeto que combina com o nome digitado.
  const focusOn = (id) => {
    const mid = stage.clientHeight / 2;
    let best = null;
    cards.forEach((c) => {
      if (c.dataset.id !== id) return;
      const t = mid - (c.offsetTop + c.offsetHeight / 2);
      if (best === null || Math.abs(t - y) < Math.abs(best - y)) best = t;
    });
    if (best === null) return;
    tween?.kill();
    if (reduced) { y = best; apply(); playCenter(); return; }
    tween = gsap.to({ v: y }, {
      v: best, duration: 1.1, ease: 'power3.inOut',
      onUpdate() { y = this.targets()[0].v; apply(); playCenter(); },
      onComplete: () => { tween = null; wrap(); apply(); },
    });
  };

  let lastId = null;
  store.on((d) => {
    const p = projectForName(d.nm);
    focused = Boolean(p);
    if (p && p.id !== lastId) focusOn(p.id);
    lastId = p ? p.id : null;
  });

  input.addEventListener('input', () => store.set({ name: input.value.slice(0, 32) }));
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    input.blur();
    window.open(waLink('default', store.get().nm), '_blank', 'noopener');
  });

  const remeasure = () => { measure(); wrap(); apply(); };
  window.addEventListener('resize', remeasure);
  document.fonts?.ready.then(remeasure);
  track.querySelectorAll('img').forEach((img) => img.addEventListener('load', remeasure, { once: true }));
}
