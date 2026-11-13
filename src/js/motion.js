// Movimento compartilhado: rolagem suave, cores que trocam por seção, revelar ao rolar,
// palavras que sobem, botões vivos e magnéticos, cursor, contadores e a faixa de nichos.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

export const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
export const coarse = matchMedia('(pointer: coarse)').matches;

// Cores de fundo de cada tema (as mesmas do CSS).
export const THEMES = { dark: '#0A0A0A', light: '#F4F4F1', lime: '#D4FF3F', blue: '#3355FF', orange: '#FF5B1F' };

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
  if (typeof target === 'number') {
    if (lenis) lenis.scrollTo(target, { duration: 1.4 });
    else window.scrollTo({ top: target, behavior: reduced ? 'auto' : 'smooth' });
    return;
  }
  const el = typeof target === 'string' ? document.querySelector(target) : target;
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
    scrollToTarget(lenis, el, id === '#topo' ? 0 : -20);
    if (id === '#conteudo') {
      el.setAttribute('tabindex', '-1');
      el.focus({ preventScroll: true });
    }
  });
}

// Fundo da página troca de cor a cada seção (no computador) e o menu acompanha (em todos).
export function initThemes() {
  const root = document.documentElement;
  const secs = [...document.querySelectorAll('main > section[data-theme], .foot[data-theme]')];
  if (!secs.length) return;
  root.dataset.nav = secs[0].dataset.theme;
  secs.forEach((s) => ScrollTrigger.create({
    trigger: s, start: 'top 46px', end: 'bottom 46px',
    onToggle: (st) => { if (st.isActive) root.dataset.nav = s.dataset.theme; },
  }));

  const mm = gsap.matchMedia();
  mm.add('(min-width: 901px)', () => {
    root.classList.add('morph');
    let cur = null;
    const paint = (t, instant) => {
      if (t === cur) return;
      cur = t;
      root.dataset.theme = t;
      gsap.to(document.body, { backgroundColor: THEMES[t], duration: instant || reduced ? 0 : 0.8, ease: 'power2.inOut', overwrite: true });
    };
    paint(secs[0].dataset.theme, true);
    // o rodapé tem fundo próprio: a última seção continua com a cor dela até o fim
    secs.filter((s) => !s.classList.contains('foot')).forEach((s) => ScrollTrigger.create({
      trigger: s, start: 'top 55%', end: 'bottom 55%',
      onToggle: (st) => { if (st.isActive) paint(s.dataset.theme); },
    }));
    return () => {
      root.classList.remove('morph');
      gsap.set(document.body, { clearProps: 'backgroundColor' });
    };
  });
}

// Quebra o texto em palavras mascaradas, preservando <em>/<strong>.
export function splitWords(root, cls = 'w') {
  const walk = (node) => {
    [...node.childNodes].forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const parts = child.textContent.split(/(\s+)/);
        const frag = document.createDocumentFragment();
        parts.forEach((p) => {
          if (!p) return;
          if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(' ')); return; }
          const w = document.createElement('span');
          w.className = cls;
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
  return root.querySelectorAll(`.${cls} > span`);
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
      onEnter: () => gsap.to(words, { yPercent: 0, duration: 1.05, ease: 'power4.out', stagger: 0.035 }),
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

// Números que contam ao aparecer (aceita decimais e contagem para baixo).
export function initCounters() {
  const fmt = (v, dec) => v.toLocaleString('pt-BR', { minimumFractionDigits: dec, maximumFractionDigits: dec });
  document.querySelectorAll('[data-count]').forEach((b) => {
    const to = Number(b.dataset.count);
    const from = Number(b.dataset.from || 0);
    const dec = Number(b.dataset.dec || 0);
    if (reduced) { b.textContent = fmt(to, dec); return; }
    const o = { v: from };
    b.textContent = fmt(from, dec);
    ScrollTrigger.create({
      trigger: b,
      start: 'top 88%',
      once: true,
      onEnter: () => gsap.to(o, { v: to, duration: 1.6, ease: 'power3.out', onUpdate: () => { b.textContent = fmt(o.v, dec); } }),
    });
  });
}

// Brilho do botão segue o ponteiro.
export function initButtons() {
  document.addEventListener('pointermove', (e) => {
    const b = e.target.closest('.btn');
    if (!b) return;
    const r = b.getBoundingClientRect();
    b.style.setProperty('--mx', `${e.clientX - r.left}px`);
    b.style.setProperty('--my', `${e.clientY - r.top}px`);
  }, { passive: true });
}

// Botões grandes puxam o ponteiro de leve, como um ímã.
export function initMagnetic() {
  if (reduced || coarse) return;
  document.querySelectorAll('[data-magnetic]').forEach((el) => {
    const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' });
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - r.left - r.width / 2) * 0.25);
      yTo((e.clientY - r.top - r.height / 2) * 0.35);
    });
    el.addEventListener('pointerleave', () => { xTo(0); yTo(0); });
  });
}

export function initTilt() {
  if (reduced || coarse) return;
  document.querySelectorAll('[data-tilt]').forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      el.style.setProperty('--rx', `${(-y * 8).toFixed(2)}deg`);
      el.style.setProperty('--ry', `${(x * 8).toFixed(2)}deg`);
    });
    el.addEventListener('pointerleave', () => { el.style.setProperty('--rx', '0deg'); el.style.setProperty('--ry', '0deg'); });
  });
}

// Cursor próprio (só com mouse): ponto, anel e uma etiqueta onde houver [data-cursor].
export function initCursor() {
  const el = document.getElementById('cursor');
  if (!el) return;
  if (reduced || coarse || !matchMedia('(pointer: fine)').matches) { el.remove(); return; }
  document.documentElement.classList.add('has-cursor');
  const dot = el.querySelector('.cursor__dot');
  const ring = el.querySelector('.cursor__ring');
  const label = el.querySelector('.cursor__label');
  let mx = -100; let my = -100; let rx = mx; let ry = my;
  window.addEventListener('pointermove', (e) => { mx = e.clientX; my = e.clientY; el.classList.add('is-on'); }, { passive: true });
  document.documentElement.addEventListener('pointerleave', () => el.classList.remove('is-on'));
  gsap.ticker.add(() => {
    rx += (mx - rx) * 0.2;
    ry += (my - ry) * 0.2;
    dot.style.transform = `translate3d(${mx}px,${my}px,0)`;
    ring.style.transform = `translate3d(${rx}px,${ry}px,0)`;
  });
  document.addEventListener('pointerover', (e) => {
    const c = e.target.closest('[data-cursor]');
    const active = c && !c.closest('.is-searching');
    const link = e.target.closest('a, button, input, label, select, textarea');
    el.classList.toggle('is-label', Boolean(active && !link));
    el.classList.toggle('is-link', Boolean(link));
    label.textContent = active && !link ? c.dataset.cursor : '';
  });
  document.addEventListener('pointerdown', () => el.classList.add('is-down'));
  document.addEventListener('pointerup', () => el.classList.remove('is-down'));
}

// Barra fina de progresso no topo.
export function initProgress() {
  const bar = document.getElementById('progress');
  if (!bar) return;
  const update = () => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = `scaleX(${h > 0 ? Math.min(1, window.scrollY / h) : 0})`;
  };
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
}

// Menu: ganha fundo ao rolar, some quando a pessoa desce rápido e volta quando sobe.
export function initNav() {
  const nav = document.getElementById('nav');
  const wa = document.getElementById('wa-float');
  let lastY = window.scrollY;
  const onScroll = () => {
    const y = window.scrollY;
    nav.classList.toggle('is-scrolled', y > 40);
    if (y > window.innerHeight * 0.9 && y > lastY + 6) nav.classList.add('is-hidden');
    else if (y < lastY - 6 || y < window.innerHeight * 0.9) nav.classList.remove('is-hidden');
    lastY = y;
    wa.classList.toggle('is-on', y > window.innerHeight * 0.85);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  nav.addEventListener('focusin', () => nav.classList.remove('is-hidden'));
  onScroll();
}

// Faixa de nichos: anda sozinha, acelera com a rolagem e vira de sentido junto com ela.
export function initTicker(lenis) {
  const track = document.getElementById('ticker');
  if (!track) return;
  track.innerHTML += track.innerHTML;
  [...track.children].slice(track.children.length / 2).forEach((c) => c.setAttribute('aria-hidden', 'true'));
  let w = 0;
  const measure = () => { w = track.scrollWidth / 2; };
  measure();
  window.addEventListener('resize', measure);
  document.fonts?.ready.then(measure);
  if (reduced) return;

  let x = 0; let dir = -1; let boost = 0; let lastY = window.scrollY; let visible = true;
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(track);
  gsap.ticker.add((_, dt) => {
    if (!visible || !w) return;
    const y = window.scrollY;
    const v = lenis ? lenis.velocity : y - lastY;
    lastY = y;
    if (Math.abs(v) > 0.4) dir = v > 0 ? -1 : 1;
    boost += (Math.min(Math.abs(v), 50) - boost) * 0.08;
    x += dir * (0.55 + boost * 0.3) * (dt / 16.67);
    if (x <= -w) x += w;
    if (x > 0) x -= w;
    track.style.transform = `translate3d(${x.toFixed(2)}px,0,0) skewX(${(dir * Math.min(boost, 30) * 0.18).toFixed(2)}deg)`;
  });
}

export { gsap, ScrollTrigger };
