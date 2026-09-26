// "Um dia comum": o celular fica fixo, o céu muda de cor e a tela mostra a busca de cada horário.
import { gsap, ScrollTrigger, scrollToTarget } from './motion.js';
import { MOMENTS, kindById, coverOf } from './data.js';
import { store } from './store.js';


function momentHTML(m, i) {
  return `<div class="moment" data-i="${i}" style="--m-bg:${m.bg};--m-ink:${m.ink}">
    <div class="moment__left">
      <p class="moment__time">${m.time}</p>
      <p class="moment__who">${m.who}</p>
    </div>
    <div class="moment__right">
      <p class="moment__query"><svg class="ico" aria-hidden="true"><use href="#i-search"/></svg>${m.query}</p>
      <p class="moment__lesson">${m.lesson}</p>
    </div>
  </div>`;
}

function screenHTML(m) {
  const k = kindById(m.kind);
  return `<div class="dscreen" data-kind="${k.id}">
    <div class="dscreen__status"><span>${m.clock}</span><span class="dscreen__icons"><i></i><i></i><i></i><b></b></span></div>
    <div class="dscreen__search"><svg class="ico"><use href="#i-search"/></svg><span class="dscreen__q"></span></div>
    <p class="dscreen__label">Perto de você</p>
    <div class="dres dres--top" style="--a:${k.a};--b:${k.b};--aw:${coverOf(k)}">
      <div class="dres__aw"></div>
      <div class="dres__in">
        <span class="dres__tag">Tem site</span>
        <p class="dres__name">${k.demo}</p>
        <p class="dres__meta">Aberto agora</p>
        <div class="dres__thumbs">${k.th.map((c) => `<i style="--c:${c}"></i>`).join('')}</div>
        <div class="dres__btns"><span>WhatsApp</span><span>Como chegar</span></div>
      </div>
    </div>
    <div class="dres dres--dim"><span class="sk" style="width:62%"></span><span class="sk" style="width:40%"></span><div class="dres__tags"><span>Sem site</span><span>Sem horário</span></div></div>
    <div class="dres dres--dim"><span class="sk" style="width:54%"></span><span class="sk" style="width:70%"></span><div class="dres__tags"><span>Sem fotos</span><span>Sem preço</span></div></div>
  </div>`;
}

export function initDay({ lenis }) {
  const section = document.getElementById('dia');
  const pin = document.getElementById('day-pin');
  const wrap = document.getElementById('moments');
  const screensEl = document.getElementById('day-screens');
  const dotsEl = document.getElementById('day-dots');
  const phone = section.querySelector('.phone--day');

  wrap.insertAdjacentHTML('afterbegin', MOMENTS.map(momentHTML).join(''));
  screensEl.innerHTML = MOMENTS.map(screenHTML).join('');
  dotsEl.innerHTML = MOMENTS.map((m, i) => `<button type="button" data-i="${i}">${m.time}</button>`).join('');

  const moments = [...wrap.querySelectorAll('.moment')];
  const screens = [...screensEl.children];
  const dots = [...dotsEl.children];

  // O card de cima ganha o nome digitado quando o ramo bate.
  store.on((d) => {
    screens.forEach((s) => {
      const k = kindById(s.dataset.kind);
      const name = d.hasName && d.kindId === k.id ? d.nm : k.demo;
      const el = s.querySelector('.dres__name');
      if (el.textContent !== name) el.textContent = name;
    });
  });

  let current = -2;
  let typing = 0;
  const typeQuery = (i) => {
    clearInterval(typing);
    const s = screens[i];
    const q = s.querySelector('.dscreen__q');
    const text = MOMENTS[i].query;
    s.classList.remove('is-typed');
    q.textContent = '';
    let n = 0;
    typing = setInterval(() => {
      n += 1;
      q.textContent = text.slice(0, n);
      if (n >= text.length) { clearInterval(typing); s.classList.add('is-typed'); }
    }, 42);
  };

  const setStep = (i) => {
    if (i === current) return;
    current = i;
    moments.forEach((m, j) => m.classList.toggle('is-active', j === i));
    screens.forEach((s, j) => s.classList.toggle('is-active', j === Math.max(0, i)));
    dots.forEach((b, j) => b.setAttribute('aria-current', String(j === i)));
    if (i >= 0) typeQuery(i);
    else { screens[0].classList.remove('is-typed'); screens[0].querySelector('.dscreen__q').textContent = ''; }
  };

  const RANGES = [0.14, 0.355, 0.57, 0.785];
  const stepFor = (p) => (p < RANGES[0] ? -1 : p < RANGES[1] ? 0 : p < RANGES[2] ? 1 : p < RANGES[3] ? 2 : 3);

  const mm = gsap.matchMedia();
  mm.add({
    desktop: '(min-width: 901px) and (prefers-reduced-motion: no-preference)',
    list: '(max-width: 900px), (prefers-reduced-motion: reduce)',
  }, (ctx) => {
    if (ctx.conditions.list) {
      section.classList.add('day--list');
      // celular: os horários passam de lado; os botões de horário mostram onde a pessoa está
      const nearest = () => {
        const mid = wrap.scrollLeft + wrap.clientWidth / 2;
        let best = 0; let dist = Infinity;
        moments.forEach((m, j) => { const d = Math.abs(m.offsetLeft + m.offsetWidth / 2 - mid); if (d < dist) { dist = d; best = j; } });
        dots.forEach((b, j) => b.setAttribute('aria-current', String(j === best)));
      };
      const onDotList = (e) => {
        const m = moments[Number(e.currentTarget.dataset.i)];
        wrap.scrollTo({ left: m.offsetLeft - (wrap.clientWidth - m.offsetWidth) / 2, behavior: 'smooth' });
      };
      wrap.addEventListener('scroll', nearest, { passive: true });
      dots.forEach((b) => b.addEventListener('click', onDotList));
      nearest();
      return () => {
        wrap.removeEventListener('scroll', nearest);
        dots.forEach((b) => { b.removeEventListener('click', onDotList); b.removeAttribute('aria-current'); });
        section.classList.remove('day--list');
      };
    }

    current = -2;
    gsap.set(pin, { '--day-bg': '#0f0b08', '--day-ink': '#f6ecdf', '--day-glow': 0 });
    setStep(-1);
    const [m0, m1, m2, m3] = MOMENTS;
    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: pin,
        start: 'top top',
        end: () => `+=${Math.round(window.innerHeight * 3)}`,
        pin: true,
        scrub: 0.6,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => setStep(stepFor(self.progress)),
      },
    });
    tl.fromTo(phone, { y: () => window.innerHeight * 0.62, scale: 0.86 }, { y: 0, scale: 1, duration: 0.14, ease: 'power2.out' }, 0)
      // o fundo muda devagar; a cor do texto vira de uma vez no meio, para nunca ficar ilegível
      .to(pin, { '--day-bg': m0.bg, '--day-glow': 0.9, duration: 0.12 }, 0.02)
      .to(pin, { '--day-ink': m0.ink, duration: 0.004 }, 0.075)
      .to(pin, { '--day-bg': m1.bg, '--day-ink': m1.ink, duration: 0.06 }, 0.32)
      .to(pin, { '--day-bg': m2.bg, '--day-ink': m2.ink, '--day-glow': 0.5, duration: 0.06 }, 0.535)
      .to(pin, { '--day-bg': m3.bg, '--day-glow': 0, duration: 0.06 }, 0.75)
      .to(pin, { '--day-ink': m3.ink, duration: 0.004 }, 0.775)
      .to(phone, { y: -10, duration: 0.86 }, 0.14);

    dots.forEach((b, j) => b.addEventListener('click', onDot));
    function onDot(e) {
      const j = Number(e.currentTarget.dataset.i);
      const st = tl.scrollTrigger;
      const mid = (RANGES[j] + (RANGES[j + 1] ?? 1)) / 2;
      scrollToTarget(lenis, Math.round(st.start + (st.end - st.start) * mid));
    }

    return () => {
      dots.forEach((b) => b.removeEventListener('click', onDot));
      clearInterval(typing);
      gsap.set(pin, { clearProps: '--day-bg,--day-ink,--day-glow' });
    };
  });

  ScrollTrigger.refresh();
}
