// Pop-up de saída: oferece uma prévia grátis antes da pessoa ir embora. Aparece no máximo uma vez por visita.
import { store, waLink } from './store.js';

const KEY = 'od-exit-shown';
const seen = () => { try { return sessionStorage.getItem(KEY) === '1'; } catch { return false; } };
const markSeen = () => { try { sessionStorage.setItem(KEY, '1'); } catch { /* sem armazenamento, segue a vida */ } };

export function initExit({ lenis }) {
  const root = document.getElementById('exit');
  if (!root) return;
  const card = root.querySelector('.exit__card');
  const form = document.getElementById('exit-form');
  const input = document.getElementById('exit-name');
  const wa = document.getElementById('wa-float');
  let lastFocus = null;
  let armed = false;
  let blocked = seen();

  setTimeout(() => { armed = true; }, 8000);

  // Quem já clicou pra falar no WhatsApp não precisa do pop-up.
  document.addEventListener('click', (e) => { if (e.target.closest('[data-wa]')) { blocked = true; markSeen(); } });
  document.getElementById('claim')?.addEventListener('submit', () => { blocked = true; markSeen(); });

  const focusables = () => [...card.querySelectorAll('button, input, a[href]')].filter((el) => !el.disabled);

  const onKey = (e) => {
    if (e.key === 'Escape') { close(); return; }
    if (e.key !== 'Tab') return;
    const f = focusables();
    const first = f[0];
    const last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  };

  function open() {
    if (blocked || !armed || !root.hidden) return;
    blocked = true;
    markSeen();
    lastFocus = document.activeElement;
    input.value = store.get().nm;
    root.hidden = false;
    document.documentElement.classList.add('is-locked');
    lenis?.stop();
    wa?.classList.remove('is-on');
    requestAnimationFrame(() => requestAnimationFrame(() => root.classList.add('is-open')));
    setTimeout(() => input.focus({ preventScroll: true }), 350);
    document.addEventListener('keydown', onKey);
  }

  function close() {
    root.classList.remove('is-open');
    document.removeEventListener('keydown', onKey);
    document.documentElement.classList.remove('is-locked');
    lenis?.start();
    setTimeout(() => { root.hidden = true; }, 420);
    lastFocus?.focus?.({ preventScroll: true });
  }

  root.addEventListener('click', (e) => { if (e.target.closest('[data-exit-close]')) close(); });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nm = input.value.replace(/\s+/g, ' ').trim();
    if (nm && !store.get().hasName) store.set({ name: nm });
    window.open(waLink('preview', nm), '_blank', 'noopener');
    close();
  });

  // Computador: o mouse sai pela parte de cima da janela.
  document.addEventListener('mouseout', (e) => {
    if (!e.relatedTarget && e.clientY <= 4) open();
  });

  // Celular: depois de ler boa parte, sobe a página rápido (gesto típico de quem vai sair).
  if (matchMedia('(pointer: coarse)').matches) {
    let maxDepth = 0;
    let lastY = window.scrollY;
    let lastT = performance.now();
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      const t = performance.now();
      const h = document.documentElement.scrollHeight - window.innerHeight;
      maxDepth = Math.max(maxDepth, y / Math.max(1, h));
      const v = (y - lastY) / Math.max(1, t - lastT);
      lastY = y;
      lastT = t;
      if (maxDepth > 0.5 && v < -3.2) open();
    }, { passive: true });
  }
}
