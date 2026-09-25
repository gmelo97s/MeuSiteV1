// Detalhes de cada seção: carimbo da ficha, foto e assinatura, lousa, perguntas, letreiro neon.
import { gsap, ScrollTrigger, reduced } from './motion.js';

export function initStamp() {
  const stamp = document.getElementById('stamp');
  const ficha = document.getElementById('ficha');
  if (!stamp || reduced) return;
  ScrollTrigger.create({
    trigger: ficha,
    start: 'top 62%',
    once: true,
    onEnter: () => {
      gsap.timeline({ delay: 0.3 })
        .fromTo(stamp, { scale: 2.8, opacity: 0, rotate: -26 }, { scale: 1, opacity: 0.88, rotate: -12, duration: 0.5, ease: 'back.out(2.4)' })
        .fromTo(ficha, { x: 0 }, { keyframes: [{ x: -5 }, { x: 4 }, { x: -2 }, { x: 0 }], duration: 0.28, ease: 'none' }, '-=0.2');
    },
  });
}

export function initPortrait() {
  const fig = document.getElementById('me-photo');
  if (!fig || reduced) return;
  const img = fig.querySelector('img');
  const sign = fig.querySelector('.me__sign');
  gsap.fromTo(fig.querySelector('picture'), { clipPath: 'inset(100% 0% 0% 0%)' }, {
    clipPath: 'inset(0% 0% 0% 0%)', ease: 'none',
    scrollTrigger: { trigger: fig, start: 'top 90%', end: 'top 35%', scrub: 0.6 },
  });
  gsap.fromTo(img, { scale: 1.18 }, {
    scale: 1, ease: 'none',
    scrollTrigger: { trigger: fig, start: 'top bottom', end: 'bottom top', scrub: true },
  });
  ScrollTrigger.create({
    trigger: fig,
    start: 'top 45%',
    once: true,
    onEnter: () => gsap.to(sign, { clipPath: 'inset(-20% 0% -20% 0)', duration: 1.8, ease: 'power2.inOut' }),
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
