// Celular: barra inferior de vidro (estilo iOS). Mostra em que parte do site a pessoa está,
// leva às seções e deixa o WhatsApp sempre a um toque. Some quando o teclado abre.
import { ScrollTrigger, docTop } from './motion.js';

export function initDock() {
  const dock = document.getElementById('dock');
  if (!dock) return;
  const tabs = [...dock.querySelectorAll('a[data-tab]')];
  const pill = dock.querySelector('.dock__pill');
  const marks = tabs.flatMap((t) => t.dataset.tab.split(' ').map((id) => ({ el: document.getElementById(id), tab: t }))).filter((m) => m.el);

  let tops = [];
  const measure = () => {
    tops = marks.map((m) => ({ top: docTop(m.el), tab: m.tab })).sort((a, b) => a.top - b.top);
    place(current, false);
  };

  let current = null;
  const place = (tab, animate = true) => {
    if (!tab) return;
    tabs.forEach((t) => t.classList.toggle('is-active', t === tab));
    if (!animate) pill.style.transition = 'none';
    pill.style.width = `${tab.offsetWidth}px`;
    pill.style.transform = `translateX(${tab.offsetLeft}px)`;
    if (!animate) requestAnimationFrame(() => { pill.style.transition = ''; });
  };

  let typing = false;
  const onScroll = () => {
    const y = window.scrollY;
    dock.classList.toggle('is-on', y > window.innerHeight * 0.55 && !typing);
    const probe = y + window.innerHeight * 0.45;
    let tab = tops[0]?.tab;
    for (const m of tops) { if (m.top <= probe) tab = m.tab; else break; }
    if (tab !== current) { current = tab; place(tab); }
  };

  // teclado aberto: a barra sai da frente
  document.addEventListener('focusin', (e) => { if (e.target.matches('input, textarea')) { typing = true; onScroll(); } });
  document.addEventListener('focusout', (e) => { if (e.target.matches('input, textarea')) { typing = false; onScroll(); } });

  window.addEventListener('scroll', onScroll, { passive: true });
  ScrollTrigger.addEventListener('refresh', () => { measure(); onScroll(); });
  window.addEventListener('resize', measure);
  measure();
  onScroll();
}
