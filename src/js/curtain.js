// Cortina de entrada: a porta de aço amarela sobe e revela o site.
import { gsap, reduced } from './motion.js';

export function runCurtain({ lenis }) {
  return new Promise((resolve) => {
    const el = document.getElementById('curtain');
    const html = document.documentElement;
    if (!el) { resolve(); return; }
    html.classList.add('is-locked');
    lenis?.stop();

    const cleanup = () => {
      html.classList.remove('is-locked');
      lenis?.start();
      el.remove();
    };

    if (reduced) {
      gsap.to(el, { opacity: 0, duration: 0.35, delay: 0.25, onComplete: () => { cleanup(); } });
      resolve();
      return;
    }

    const mark = el.querySelector('.curtain__mark');
    const words = el.querySelectorAll('.curtain__brand span, .curtain__hint');
    const bar = el.querySelector('.curtain__bar i');
    const center = el.querySelector('.curtain__center');

    gsap.set(mark, { scale: 0.5, opacity: 0, rotate: -10 });
    gsap.set(words, { yPercent: 70, opacity: 0 });
    const intro = gsap.timeline()
      .to(mark, { scale: 1, opacity: 1, rotate: 0, duration: 0.7, ease: 'back.out(1.9)' })
      .to(words, { yPercent: 0, opacity: 1, duration: 0.6, ease: 'power4.out', stagger: 0.08 }, '-=0.45')
      .to(bar, { scaleX: 1, duration: 1.1, ease: 'power2.inOut' }, '-=0.5');

    let lifted = false;
    const lift = () => {
      if (lifted) return;
      lifted = true;
      intro.progress(1);
      window.removeEventListener('keydown', lift);
      gsap.timeline({ onComplete: cleanup })
        .to(center, { y: -50, opacity: 0, duration: 0.35, ease: 'power2.in' })
        .to(el, { yPercent: -100, duration: 1.05, ease: 'expo.inOut' }, '-=0.12');
      setTimeout(resolve, 420);
    };

    const fonts = document.fonts ? document.fonts.ready : Promise.resolve();
    const minTime = new Promise((r) => setTimeout(r, 1500));
    const maxTime = new Promise((r) => setTimeout(r, 3200));
    Promise.race([Promise.all([fonts, minTime]), maxTime]).then(lift);
    el.addEventListener('click', lift);
    window.addEventListener('keydown', lift);
  });
}
