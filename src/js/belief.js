// "O que a gente acredita": as palavras acendem uma a uma com a rolagem.
// No computador a seção prende na tela enquanto o texto acende.
import { gsap, reduced } from './motion.js';

function splitPlain(root) {
  const walk = (node) => {
    [...node.childNodes].forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const frag = document.createDocumentFragment();
        child.textContent.split(/(\s+)/).forEach((p) => {
          if (!p) return;
          if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(' ')); return; }
          const s = document.createElement('span');
          s.className = 'bw';
          s.textContent = p;
          frag.appendChild(s);
        });
        child.replaceWith(frag);
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        walk(child);
      }
    });
  };
  walk(root);
  return [...root.querySelectorAll('.bw')];
}

export function initBelief() {
  const text = document.getElementById('belief-text');
  const pin = document.getElementById('belief-pin');
  if (!text) return;
  const words = splitPlain(text);
  if (reduced) { words.forEach((w) => w.classList.add('is-lit')); return; }

  gsap.set(words, { opacity: 0.16 });
  const mm = gsap.matchMedia();
  mm.add({ desk: '(min-width: 901px)', mob: '(max-width: 900px)' }, (ctx) => {
    const trigger = ctx.conditions.desk
      ? { trigger: pin, start: 'top top', end: '+=170%', pin: true, anticipatePin: 1, scrub: 0.5 }
      : { trigger: text, start: 'top 82%', end: 'bottom 50%', scrub: 0.5 };
    // os destaques (em) já são coloridos no CSS: acendem junto com o resto
    gsap.timeline({ scrollTrigger: trigger })
      .to(words, { opacity: 1, ease: 'none', duration: 0.4, stagger: 0.12 });
    return () => { gsap.set(words, { opacity: 0.16 }); };
  });
}
