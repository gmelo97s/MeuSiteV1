// Hero: torre de vitrines que sobe sozinha e, quando a pessoa digita, para no ramo dela.
import { gsap, reduced, scrollToTarget } from './motion.js';
import { KINDS } from './data.js';
import { store } from './store.js';

const N = KINDS.length;
const COPIES = 3;

const awning = (k) => k.stripes || `repeating-linear-gradient(90deg,${k.a} 0 16px,${k.b} 16px 32px)`;

function cardHTML(k) {
  return `<article class="vcard" data-kind="${k.id}" style="--a:${k.a};--b:${k.b};--aw:${awning(k)}">
    <div class="vcard__awning"></div>
    <span class="vcard__neon">Aberto</span>
    <div class="vcard__sign"><span class="vcard__name">${k.demo}</span><span class="vcard__sub">${k.sub}</span></div>
    <div class="vcard__body">
      <span class="vcard__status">Vitrine aberta 24h</span>
      <p class="vcard__night">${k.night}</p>
      <span class="vcard__cta">${k.action}</span>
      <p class="vcard__listT">${k.listT}</p>
      <ul class="vcard__list">${k.items.map((t, i) => `<li><i style="--c:${k.th[i]}"></i>${t}</li>`).join('')}</ul>
    </div>
    <div class="vcard__bar"><span>Como chegar</span><span>WhatsApp</span></div>
  </article>`;
}

// Tamanho da placa conforme o comprimento do nome.
function fitName(el, name) {
  const n = name.length;
  const size = n <= 8 ? 30 : n <= 12 ? 26 : n <= 17 ? 22 : n <= 23 ? 19 : 17;
  el.style.setProperty('--fsn', String(size));
}

export function heroIntro() {
  if (reduced) return;
  gsap.timeline({ delay: 0.15 })
    .from('.hero__title .mask__in', { yPercent: 112, duration: 1.15, ease: 'power4.out', stagger: 0.1 })
    .from('.hero__eyebrow, .hero__lede, .claim', { y: 30, opacity: 0, filter: 'blur(6px)', duration: 0.9, ease: 'power4.out', stagger: 0.08, clearProps: 'filter,transform' }, '-=0.85')
    .from('.hero__stage', { y: 70, opacity: 0, duration: 1.2, ease: 'power4.out', clearProps: 'transform' }, '-=0.95');
}

export function initHero({ lenis }) {
  const tower = document.getElementById('tower');
  const track = document.getElementById('tower-track');
  const caption = document.getElementById('tower-caption');
  const form = document.getElementById('claim');
  const input = document.getElementById('negocio');
  const chips = document.getElementById('chips');
  const litMsg = document.getElementById('lit-msg');
  const litReset = document.getElementById('lit-reset');

  track.innerHTML = Array.from({ length: COPIES }, () => KINDS.map(cardHTML).join('')).join('');
  const cards = [...track.children];
  cards.forEach((c) => fitName(c.querySelector('.vcard__name'), c.querySelector('.vcard__name').textContent));

  let idx = N;
  let step = 0;
  let cardH = 0;
  let tween = null;

  const measure = () => {
    cardH = cards[0].offsetHeight;
    const gap = parseFloat(getComputedStyle(track).rowGap) || 22;
    step = cardH + gap;
  };
  const yFor = (i) => tower.clientHeight / 2 - (i * step + cardH / 2);
  const setActive = () => cards.forEach((c, i) => c.classList.toggle('is-active', i === idx));

  // Volta para a cópia do meio sem animar, para o loop nunca acabar.
  const normalize = () => {
    if (idx >= 2 * N) idx -= N;
    else if (idx < N) idx += N;
    track.classList.add('no-trans');
    setActive();
    gsap.set(track, { y: yFor(idx) });
    void track.offsetHeight;
    track.classList.remove('no-trans');
  };

  const go = (i, dur = 0.95) => {
    idx = i;
    setActive();
    tween?.kill();
    if (reduced) { normalize(); return; }
    tween = gsap.to(track, { y: yFor(idx), duration: dur, ease: 'power3.inOut', onComplete: normalize });
  };

  const target = (kindId) => {
    const k = KINDS.findIndex((x) => x.id === kindId);
    let best = idx;
    let bestDist = Infinity;
    for (let j = idx - N; j <= idx + N; j++) {
      if (((j % N) + N) % N === k && Math.abs(j - idx) < bestDist) { best = j; bestDist = Math.abs(j - idx); }
    }
    if (best !== idx) go(best, 1.05);
  };

  // Autoplay: um card por vez, subindo.
  let auto = !reduced;
  let visible = true;
  let timer = 0;
  const schedule = () => {
    clearTimeout(timer);
    if (!auto || !visible || document.hidden) return;
    timer = setTimeout(() => { go(idx + 1); schedule(); }, 2600);
  };
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; schedule(); }).observe(tower);
  document.addEventListener('visibilitychange', schedule);

  measure();
  normalize();
  schedule();
  const remeasure = () => { measure(); tween?.kill(); normalize(); };
  window.addEventListener('resize', remeasure);
  document.fonts?.ready.then(remeasure);

  // Ramos
  chips.innerHTML = KINDS.map((k) => `<button type="button" class="chip" data-kind="${k.id}" aria-pressed="false">${k.label}</button>`).join('');
  chips.addEventListener('click', (e) => {
    const b = e.target.closest('.chip');
    if (!b) return;
    const cur = store.get().pick;
    store.set({ pick: cur === b.dataset.kind ? null : b.dataset.kind });
  });

  input.addEventListener('input', () => store.set({ name: input.value.slice(0, 32) }));

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    store.set({ lit: true });
    litMsg.hidden = false;
    if (!reduced) gsap.from(litMsg, { y: 16, opacity: 0, duration: 0.6, ease: 'power4.out' });
    if (window.matchMedia('(max-width: 1080px)').matches) {
      input.blur();
      setTimeout(() => scrollToTarget(lenis, tower, -90), 250);
    } else if (litMsg.getBoundingClientRect().bottom > window.innerHeight - 20) {
      setTimeout(() => scrollToTarget(lenis, window.scrollY + litMsg.getBoundingClientRect().bottom - window.innerHeight + 40), 150);
    }
  });

  litReset.addEventListener('click', () => {
    store.set({ lit: false });
    litMsg.hidden = true;
    input.focus();
  });

  let lastTarget = null;
  store.on((d) => {
    const personal = d.hasName || Boolean(d.pick);
    auto = !reduced && !personal;
    if (personal) {
      clearTimeout(timer);
      if (d.kindId !== lastTarget) { target(d.kindId); lastTarget = d.kindId; }
    } else if (lastTarget !== null) {
      lastTarget = null;
      schedule();
    }

    cards.forEach((c) => {
      const k = KINDS.find((x) => x.id === c.dataset.kind);
      const isTarget = personal && c.dataset.kind === d.kindId;
      const name = isTarget && d.hasName ? d.nm : k.demo;
      const el = c.querySelector('.vcard__name');
      if (el.textContent !== name) { el.textContent = name; fitName(el, name); }
      c.classList.toggle('is-lit', isTarget && d.lit);
    });

    const pressed = personal ? d.kindId : null;
    chips.querySelectorAll('.chip').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.kind === pressed)));
    caption.textContent = personal ? `${d.signName} · ${d.k.label}` : 'vitrines acesas agora';
  });
}
