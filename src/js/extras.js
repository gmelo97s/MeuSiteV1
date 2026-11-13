// Detalhes de cada seção: foto, nota do preço, perguntas, a busca do final e a marca do rodapé.
import { gsap, ScrollTrigger, reduced } from './motion.js';
import { store } from './store.js';

export function initPortrait() {
  const fig = document.getElementById('me-photo');
  if (!fig || reduced) return;
  const img = fig.querySelector('img');
  gsap.fromTo(fig.querySelector('picture'), { clipPath: 'inset(100% 0% 0% 0%)' }, {
    clipPath: 'inset(0% 0% 0% 0%)', ease: 'none',
    scrollTrigger: { trigger: fig, start: 'top 90%', end: 'top 35%', scrub: 0.6 },
  });
  gsap.fromTo(img, { scale: 1.18 }, {
    scale: 1, ease: 'none',
    scrollTrigger: { trigger: fig, start: 'top bottom', end: 'bottom top', scrub: true },
  });
}

// A nota sai da "impressora" e as linhas aparecem uma a uma.
export function initReceipt() {
  const r = document.getElementById('receipt');
  if (!r || reduced) return;
  const rows = r.querySelectorAll('.receipt__row');
  gsap.set(r, { clipPath: 'inset(0% 0% 100% 0%)' });
  gsap.set(rows, { opacity: 0, x: -10 });
  ScrollTrigger.create({
    trigger: r,
    start: 'top 75%',
    once: true,
    onEnter: () => gsap.timeline()
      .to(r, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.1, ease: 'power3.inOut', clearProps: 'clipPath' })
      .to(rows, { opacity: 1, x: 0, duration: 0.45, ease: 'power3.out', stagger: 0.07 }, 0.35)
      .fromTo(r.querySelectorAll('.receipt__list .ico'), { scale: 0, rotate: -40 }, { scale: 1, rotate: 0, duration: 0.5, ease: 'back.out(3)', stagger: 0.07 }, 0.45),
  });
}

export function initFaq() {
  document.querySelectorAll('.qa').forEach((qa) => {
    const btn = qa.querySelector('button');
    btn.addEventListener('click', () => {
      const open = !qa.classList.contains('is-open');
      qa.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', String(open));
    });
  });
}

// Final: alguém digita a busca, os concorrentes aparecem e o seu negócio não.
export function initFinal() {
  const box = document.getElementById('fsearch');
  const q = document.getElementById('fsearch-q');
  if (!box) return;
  const rows = [...box.querySelectorAll('.fres')];
  const you = box.querySelector('.fres--you');
  const tag = box.querySelector('.fres__tag');
  const words = [...document.querySelectorAll('.final__w')];
  const query = () => store.get().searchLine;

  if (reduced) { q.textContent = query(); return; }

  gsap.set(rows, { opacity: 0, y: 26 });
  gsap.set(tag, { opacity: 0, scale: 0.6 });
  gsap.set(words, { opacity: 0, yPercent: 40, scale: 1.25, filter: 'blur(14px)' });

  const typed = { n: 0 };
  const tl = gsap.timeline({ paused: true });
  tl.to(typed, {
    n: 1, duration: 1.2, ease: 'none',
    onUpdate: () => { const t = query(); q.textContent = t.slice(0, Math.round(typed.n * t.length)); },
  });
  tl.to(rows.slice(0, 3), { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', stagger: 0.12 }, '+=0.15');
  tl.to(tag, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(2.2)' }, '-=0.2');
  tl.to(you, { opacity: 0.9, y: 0, duration: 0.5, ease: 'power3.out' }, '+=0.25');
  tl.fromTo(you, { x: 0 }, { x: 10, duration: 0.07, repeat: 5, yoyo: true, ease: 'none' });
  tl.to(words, { opacity: 1, yPercent: 0, scale: 1, filter: 'blur(0px)', duration: 0.8, ease: 'expo.out', stagger: 0.12 }, '+=0.1');

  ScrollTrigger.create({ trigger: box, start: 'top 78%', once: true, onEnter: () => tl.play() });
  store.on(() => { if (tl.progress() === 1) q.textContent = query(); });
}

// Rodapé: o nome CODEM sobe de dentro da linha conforme a página chega ao fim.
export function initFootMark() {
  const mark = document.getElementById('foot-mark');
  if (!mark || reduced) return;
  gsap.fromTo(mark.querySelector('svg'), { yPercent: 100 }, {
    yPercent: 0, ease: 'none',
    scrollTrigger: { trigger: mark, start: 'top bottom', end: 'bottom bottom', scrub: 0.6 },
  });
}
