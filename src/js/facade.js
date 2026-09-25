// Letreiro de placas de loja: corre sozinho e acelera com a rolagem.
import { gsap, reduced } from './motion.js';

export function initFacade({ lenis }) {
  const rows = [...document.querySelectorAll('[data-marquee]')];
  if (!rows.length) return;

  const state = rows.map((row) => {
    const set = row.querySelector('.signs__set');
    // duplica até cobrir duas larguras de tela
    const copies = Math.max(2, Math.ceil((window.innerWidth * 2) / Math.max(1, set.offsetWidth)) + 1);
    for (let i = 1; i < copies; i++) {
      const c = set.cloneNode(true);
      c.setAttribute('aria-hidden', 'true');
      row.appendChild(c);
    }
    return { row, set, dir: Number(row.dataset.marquee) || -1, x: 0, w: set.offsetWidth };
  });

  if (reduced) return;

  let visible = false;
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { rootMargin: '200px' })
    .observe(document.querySelector('.signs'));

  let boost = 0;
  let lastY = window.scrollY;
  gsap.ticker.add((time, dt) => {
    const y = window.scrollY;
    const v = lenis ? lenis.velocity : (y - lastY);
    lastY = y;
    boost += (Math.min(Math.abs(v) * 30, 900) - boost) * 0.08;
    if (!visible) return;
    const speed = (60 + boost) * (dt / 1000);
    state.forEach((s) => {
      s.x += s.dir * speed;
      if (s.x <= -s.w) s.x += s.w;
      if (s.x > 0) s.x -= s.w;
      s.row.style.transform = `translate3d(${s.x.toFixed(2)}px,0,0)`;
    });
  });

  window.addEventListener('resize', () => state.forEach((s) => { s.w = s.set.offsetWidth; }));
  document.fonts?.ready.then(() => state.forEach((s) => { s.w = s.set.offsetWidth; }));
}
