// Abertura institucional: logo e nome surgem, a barra carrega e o logo pousa no menu.
import { gsap, reduced } from './motion.js';

export function runSplash({ lenis }) {
  return new Promise((resolve) => {
    const el = document.getElementById('splash');
    const html = document.documentElement;
    if (!el) { resolve(); return; }
    const navMark = document.querySelector('.nav .brand__mark');
    html.classList.add('is-locked');
    lenis?.stop();

    const cleanup = () => {
      html.classList.remove('is-locked');
      lenis?.start();
      if (navMark) navMark.style.visibility = '';
      el.remove();
    };

    if (reduced) {
      gsap.to(el, { opacity: 0, duration: 0.3, delay: 0.2, onComplete: cleanup });
      resolve();
      return;
    }

    const mark = el.querySelector('.splash__mark');
    const words = el.querySelectorAll('.splash__mask > span');
    const brand = el.querySelector('.splash__brand');
    const foot = el.querySelector('.splash__foot');
    const line = el.querySelector('.splash__line i');
    const count = document.getElementById('splash-count');
    if (navMark) navMark.style.visibility = 'hidden';

    gsap.set(mark, { scale: 0.82, opacity: 0 });
    gsap.set(words, { yPercent: 110 });
    const prog = { v: 0 };
    const intro = gsap.timeline()
      .to(mark, { scale: 1, opacity: 1, duration: 0.6, ease: 'power3.out' })
      .to(words, { yPercent: 0, duration: 0.7, ease: 'power4.out', stagger: 0.08 }, '-=0.35')
      .to(prog, {
        v: 100, duration: 1.3, ease: 'power2.inOut',
        onUpdate: () => {
          count.textContent = String(Math.round(prog.v));
          line.style.transform = `scaleX(${prog.v / 100})`;
        },
      }, 0.1);

    let done = false;
    const exit = () => {
      if (done) return;
      done = true;
      intro.progress(1);
      window.removeEventListener('keydown', exit);
      el.style.pointerEvents = 'none';

      const tl = gsap.timeline({ onComplete: cleanup })
        .to([brand, foot], { opacity: 0, y: -10, duration: 0.3, ease: 'power2.in' });
      if (navMark) {
        // o logo voa até o lugar dele no menu
        const a = mark.getBoundingClientRect();
        const b = navMark.getBoundingClientRect();
        tl.to(mark, {
          x: b.left + b.width / 2 - (a.left + a.width / 2),
          y: b.top + b.height / 2 - (a.top + a.height / 2),
          scale: b.width / a.width,
          duration: 0.95, ease: 'expo.inOut',
        }, 0.12);
      } else {
        tl.to(mark, { opacity: 0, duration: 0.4 }, 0.12);
      }
      tl.to(el, { backgroundColor: 'rgba(15, 11, 8, 0)', duration: 0.75, ease: 'power2.inOut' }, 0.4);
      setTimeout(resolve, 420);
    };

    const fonts = document.fonts ? document.fonts.ready : Promise.resolve();
    const minTime = new Promise((r) => setTimeout(r, 1650));
    const maxTime = new Promise((r) => setTimeout(r, 3400));
    Promise.race([Promise.all([fonts, minTime]), maxTime]).then(exit);
    el.addEventListener('click', exit);
    window.addEventListener('keydown', exit);
  });
}
