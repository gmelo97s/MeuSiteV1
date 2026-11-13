// "Parecer profissional começa aqui": o celular fica parado e troca de site a cada motivo.
// Computador: a seção prende na tela e a rolagem passa pelos quatro motivos (as barrinhas enchem).
// Celular: os motivos trocam sozinhos a cada poucos segundos e respondem ao toque.
import { gsap, ScrollTrigger, reduced } from './motion.js';

const AUTO = 5200; // ms por motivo no celular

const videoTag = (id) => `<video muted playsinline loop preload="none" poster="/videos/${id}-m.webp" aria-hidden="true">
  <source data-src="/videos/${id}-m.webm" type="video/webm" />
  <source data-src="/videos/${id}-m.mp4" type="video/mp4" />
</video>`;

export function initLook({ lenis } = {}) {
  const pin = document.getElementById('look-pin');
  const list = document.getElementById('look-list');
  const screens = document.getElementById('look-screens');
  const glow = document.getElementById('look-glow');
  const phone = document.getElementById('look-phone');
  if (!pin) return;

  const items = [...list.children];
  const n = items.length;
  screens.innerHTML = items.map((it, i) => `<div class="look__screen${i === 0 ? ' is-active' : ''}">${videoTag(it.dataset.video)}</div>`).join('');
  const panes = [...screens.children];
  const bars = items.map((it) => it.querySelector('.look__bar i'));
  const btns = items.map((it) => it.querySelector('.look__btn'));

  let active = -1;
  let inView = false;
  let mode = 'auto';
  let timer = 0;
  let st = null;

  const load = (v) => {
    if (reduced || v.dataset.loaded) return;
    v.querySelectorAll('source').forEach((s) => { s.src = s.dataset.src; });
    v.load();
    v.dataset.loaded = '1';
  };
  const playActive = () => {
    const v = panes[active]?.querySelector('video');
    if (!v) return;
    load(v);
    if (inView && !reduced) v.play().catch(() => {});
  };

  const setActive = (i, animate = true) => {
    if (i === active) return;
    const prev = active;
    active = i;
    items.forEach((it, j) => it.classList.toggle('is-active', j === i));
    btns.forEach((b, j) => b.setAttribute('aria-current', j === i ? 'true' : 'false'));
    panes.forEach((p, j) => { if (j !== i) p.querySelector('video').pause(); });
    glow.style.setProperty('--glow', items[i].dataset.glow);
    const next = panes[i];
    if (!animate || reduced || prev < 0) {
      panes.forEach((p, j) => p.classList.toggle('is-active', j === i));
    } else {
      const old = panes[prev];
      next.classList.add('is-active');
      gsap.set(next, { zIndex: 2 });
      gsap.set(old, { zIndex: 1 });
      gsap.fromTo(next, { clipPath: `inset(${prev < i ? '100% 0% 0% 0%' : '0% 0% 100% 0%'} round 30px)` }, {
        clipPath: 'inset(0% 0% 0% 0% round 30px)', duration: 0.85, ease: 'power4.inOut', overwrite: true,
        onComplete: () => { old.classList.remove('is-active'); gsap.set([next, old], { clearProps: 'zIndex,clipPath' }); },
      });
      gsap.fromTo(phone, { rotate: prev < i ? -3 : 3, scale: 0.97 }, { rotate: 0, scale: 1, duration: 1, ease: 'power3.out', overwrite: 'auto' });
    }
    playActive();
  };

  // ----- modo automático (celular e "menos movimento") -----
  const fillBars = () => bars.forEach((b, j) => { gsap.killTweensOf(b); gsap.set(b, { scaleX: j < active ? 1 : 0 }); });
  const schedule = () => {
    clearTimeout(timer);
    fillBars();
    if (mode !== 'auto' || reduced || !inView) return;
    gsap.fromTo(bars[active], { scaleX: 0 }, { scaleX: 1, duration: AUTO / 1000, ease: 'none' });
    timer = setTimeout(() => { setActive((active + 1) % n); schedule(); }, AUTO);
  };

  btns.forEach((b, i) => b.addEventListener('click', () => {
    if (mode === 'pin' && st) {
      // no computador, o clique leva a rolagem até o motivo
      const y = st.start + ((i + 0.5) / n) * (st.end - st.start);
      if (lenis) lenis.scrollTo(y, { duration: 1.2 });
      else window.scrollTo({ top: y, behavior: 'smooth' });
      return;
    }
    setActive(i);
    schedule();
  }));

  setActive(0, false);

  new IntersectionObserver(([e]) => {
    inView = e.isIntersecting;
    if (inView) playActive();
    else panes[active]?.querySelector('video').pause();
    if (mode === 'auto') { if (inView) schedule(); else clearTimeout(timer); }
  }, { threshold: 0.25 }).observe(pin);

  const mm = gsap.matchMedia();
  mm.add({ desk: '(min-width: 901px)', mob: '(max-width: 900px)' }, (ctx) => {
    if (ctx.conditions.desk && !reduced) {
      mode = 'pin';
      clearTimeout(timer);
      st = ScrollTrigger.create({
        trigger: pin,
        start: 'top top',
        end: () => `+=${window.innerHeight * 0.8 * n}`,
        pin: true,
        anticipatePin: 1,
        scrub: true,
        onUpdate: (self) => {
          const p = self.progress * n;
          setActive(Math.min(n - 1, Math.floor(p)));
          bars.forEach((b, j) => gsap.set(b, { scaleX: Math.max(0, Math.min(1, p - j)) }));
        },
      });
      return () => { st = null; mode = 'auto'; };
    }
    mode = 'auto';
    if (inView) schedule();
    return () => { clearTimeout(timer); };
  });
}
