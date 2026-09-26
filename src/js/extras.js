// Detalhes de cada seção: crachá, foto, lousa, perguntas, letreiro neon.
import { gsap, ScrollTrigger, reduced } from './motion.js';

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

export function initFinal() {
  const neon = document.getElementById('neon');
  const ribs = document.querySelector('.final__ribs');
  if (reduced) { neon?.classList.add('is-on'); gsap.set(ribs, { scaleY: 0.25 }); return; }
  ScrollTrigger.create({ trigger: neon, start: 'top 75%', once: true, onEnter: () => neon.classList.add('is-on') });
  gsap.fromTo(ribs, { scaleY: 1 }, {
    scaleY: 0.22, ease: 'none',
    scrollTrigger: { trigger: '#final', start: 'top 85%', end: 'top 15%', scrub: 0.5 },
  });
}
