// Detalhes de cada seção: crachá, foto, lousa, perguntas e a busca do final.
import { gsap, ScrollTrigger, reduced } from './motion.js';
import { store } from './store.js';

// Crachá: começa "Em análise" e vira "Contratado", como uma aprovação de banco. Os números contam.
export function initHire() {
  const badge = document.getElementById('badge');
  if (!badge || reduced) return;
  const state = badge.querySelector('.badge__state');
  const status = badge.querySelector('.badge__status');
  badge.classList.add('is-pending');
  state.textContent = 'Em análise';
  ScrollTrigger.create({
    trigger: badge,
    start: 'top 70%',
    once: true,
    onEnter: () => setTimeout(() => {
      badge.classList.remove('is-pending');
      state.textContent = 'Contratado';
      gsap.fromTo(status, { scale: 0.95 }, { scale: 1, duration: 0.6, ease: 'back.out(3)' });
    }, 1400),
  });

  document.querySelectorAll('.stat [data-count]').forEach((b) => {
    const to = Number(b.dataset.count);
    const o = { v: 0 };
    b.textContent = '0';
    ScrollTrigger.create({
      trigger: b,
      start: 'top 88%',
      once: true,
      onEnter: () => gsap.to(o, { v: to, duration: 1.4, ease: 'power3.out', onUpdate: () => { b.textContent = String(Math.round(o.v)); } }),
    });
  });
}

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

export function initChalk() {
  const lines = document.querySelectorAll('.chalk__w');
  if (!lines.length || reduced) return;
  ScrollTrigger.create({
    trigger: '#chalk',
    start: 'top 70%',
    once: true,
    onEnter: () => gsap.to(lines, { clipPath: 'inset(-10% 0% -10% 0)', duration: 0.55, ease: 'power2.out', stagger: 0.14 }),
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
  // se a pessoa preencher o nome depois, a busca acompanha
  store.on(() => { if (tl.progress() === 1) q.textContent = query(); });
}
