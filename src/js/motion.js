// Movimento compartilhado: rolagem suave, revelar ao rolar, palavras que sobem, botões vivos, inclinação 3D.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

export const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
export const coarse = matchMedia('(pointer: coarse)').matches;

export function initLenis() {
  if (reduced || coarse) return null;
  const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  return lenis;
}

// Posição do elemento na página. No celular as seções ficam presas (folhas), então
// a medida é feita com elas de volta ao fluxo normal.
export function docTop(el) {
  const root = document.documentElement;
  const sheets = root.classList.contains('has-sheets');
  if (sheets) root.classList.add('sheets-off');
  const y = el.getBoundingClientRect().top + window.scrollY;
  if (sheets) root.classList.remove('sheets-off');
  return y;
}

export function scrollToTarget(lenis, target, offset = -84) {
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  if (typeof target === 'number') {
    if (lenis) lenis.scrollTo(target, { duration: 1.4 });
    else window.scrollTo({ top: target, behavior: reduced ? 'auto' : 'smooth' });
    return;
  }
  if (!el) return;
  const top = Math.max(0, docTop(el) + offset);
  if (lenis) lenis.scrollTo(top, { duration: 1.4 });
  else window.scrollTo({ top, behavior: reduced ? 'auto' : 'smooth' });
}

export function initAnchors(lenis) {
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href');
    if (id.length < 2) return;
    const el = document.querySelector(id);
    if (!el) return;
    e.preventDefault();
    scrollToTarget(lenis, el, id === '#topo' ? 0 : -84);
    if (id === '#conteudo') {
      el.setAttribute('tabindex', '-1');
      el.focus({ preventScroll: true });
    }
  });
}

// Quebra o texto em palavras mascaradas, preservando <em>/<strong>.
export function splitWords(root) {
  const walk = (node) => {
    [...node.childNodes].forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const parts = child.textContent.split(/(\s+)/);
        const frag = document.createDocumentFragment();
        parts.forEach((p) => {
          if (!p) return;
          if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(' ')); return; }
          const w = document.createElement('span');
          w.className = 'w';
          const inner = document.createElement('span');
          inner.textContent = p;
          w.appendChild(inner);
          frag.appendChild(w);
        });
        child.replaceWith(frag);
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        walk(child);
      }
    });
  };
  walk(root);
  return root.querySelectorAll('.w > span');
}

export function initReveals() {
  document.querySelectorAll('[data-words]').forEach((el) => {
    const words = splitWords(el);
    if (reduced) return;
    gsap.set(words, { yPercent: 115 });
    ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      once: true,
      onEnter: () => gsap.to(words, { yPercent: 0, duration: 1, ease: 'power4.out', stagger: 0.035 }),
    });
  });

  const items = gsap.utils.toArray('[data-reveal]');
  if (reduced) { gsap.set(items, { opacity: 1 }); return; }
  gsap.set(items, { opacity: 0, y: 40, filter: 'blur(6px)' });
  ScrollTrigger.batch(items, {
    start: 'top 90%',
    once: true,
    onEnter: (batch) => gsap.to(batch, {
      opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.9, ease: 'power4.out', stagger: 0.09,
      clearProps: 'filter,transform',
    }),
  });
}

// Brilho do botão segue o ponteiro (referência APUS).
export function initButtons() {
  document.addEventListener('pointermove', (e) => {
    const b = e.target.closest('.btn');
    if (!b) return;
    const r = b.getBoundingClientRect();
    b.style.setProperty('--mx', `${e.clientX - r.left}px`);
    b.style.setProperty('--my', `${e.clientY - r.top}px`);
  }, { passive: true });
}

export function initTilt() {
  if (reduced || coarse) return;
  document.querySelectorAll('[data-tilt]').forEach((el) => {
    const base = getComputedStyle(el).transform;
    const rot = base && base !== 'none' ? base : '';
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `perspective(1000px) rotateX(${(-y * 8).toFixed(2)}deg) rotateY(${(x * 8).toFixed(2)}deg) ${rot}`;
    });
    el.addEventListener('pointerleave', () => { el.style.transform = ''; });
  });
}

export function initNav() {
  const nav = document.getElementById('nav');
  const wa = document.getElementById('wa-float');
  const onScroll = () => {
    const y = window.scrollY;
    nav.classList.toggle('is-scrolled', y > 40);
    wa.classList.toggle('is-on', y > window.innerHeight * 0.85);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

export { gsap, ScrollTrigger };
