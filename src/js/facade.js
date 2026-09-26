// "A fachada mudou de lugar": a rua cheia, a mão com o celular e a busca no mapa.
// A rolagem conduz a câmera (rua → mão → frase final); a tela do celular roda sozinha,
// como uma gravação: digita a busca, os pinos caem, o dedo passa rápido pelos resultados,
// pula quem não tem site e abre o perfil de quem tem. Cards saltam da tela em 3D.
import { gsap, ScrollTrigger, reduced } from './motion.js';
import { store } from './store.js';

const IMG = (id) => `/img/fachada/p${id}.webp`;
const QUERY = 'aberto agora perto de mim';

// Negócios fictícios da busca (fotos livres do Unsplash).
const RESULTS = [
  { name: 'Café Aurora', kind: 'Cafeteria', rate: '4,8', n: '1.204', dist: '350 m', close: 'Fecha às 22h', photos: [1060, 431, 42], site: true },
  { you: true },
  { name: 'Almeida Advocacia', kind: 'Escritório de advocacia', rate: '4,9', n: '218', dist: '600 m', close: 'Fecha às 19h', photos: [180, 201, 0], site: true },
  { name: 'Ateliê Norte', kind: 'Loja de roupas', rate: '4,7', n: '96', dist: '850 m', close: 'Fecha às 20h', photos: [1059, 42, 431], site: true },
  { name: 'Cantina da Praça', kind: 'Restaurante', rate: '4,9', n: '742', dist: '1,1 km', close: 'Fecha às 23h', photos: [488, 292, 493], site: true },
];

const stars = (r = 5) => `<span class="ms__stars" aria-hidden="true">${'★'.repeat(r)}</span>`;
const PIN = '<svg viewBox="0 0 24 32" class="ms__pinsvg"><path d="M12 31s10-11.3 10-19A10 10 0 0 0 2 12c0 7.7 10 19 10 19Z"/><circle cx="12" cy="12" r="4.2" fill="#fff"/></svg>';

function mapSVG() {
  // bairro estilizado: quadras, parque, rio e uma avenida
  const minor = [];
  for (let i = -2; i < 12; i++) minor.push(`M${-40 + i * 58} -40 L${120 + i * 58} 900`);
  for (let j = -2; j < 16; j++) minor.push(`M-60 ${j * 64} L560 ${j * 64 - 140}`);
  return `<svg class="ms__mapsvg" viewBox="0 0 480 820" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <rect width="480" height="820" fill="#f1efe9"/>
    <path d="M300 120 l120 -30 l40 130 l-130 40z" fill="#cfe6c4"/>
    <path d="M40 520 l110 -20 l30 90 l-120 28z" fill="#cfe6c4"/>
    <path d="M-20 700 C120 640 200 700 300 640 S470 560 520 600 L520 690 C440 660 380 720 300 730 S120 760 -20 790z" fill="#a9d3f2"/>
    <g stroke="#e3dfd6" stroke-width="10" fill="none">${minor.map((d) => `<path d="${d}"/>`).join('')}</g>
    <g stroke="#ffffff" stroke-width="7" fill="none">${minor.map((d) => `<path d="${d}"/>`).join('')}</g>
    <path d="M-30 330 C140 300 260 360 520 250" stroke="#f3c55a" stroke-width="16" fill="none"/>
    <path d="M-30 330 C140 300 260 360 520 250" stroke="#ffe08e" stroke-width="11" fill="none"/>
    <text x="330" y="296" font-size="11" fill="#8a847a" transform="rotate(-18 330 296)" font-family="Figtree, sans-serif" font-weight="600">Av. Central</text>
    <text x="318" y="168" font-size="10" fill="#4f8a48" font-family="Figtree, sans-serif" font-weight="700">Praça da Matriz</text>
  </svg>`;
}

function resultHTML(r, i) {
  if (r.you) {
    return `<article class="mres mres--you" data-i="${i}">
      <div class="mres__thumbs"><i></i><i></i><i></i></div>
      <p class="mres__name" data-you-name>Seu Negócio</p>
      <p class="mres__meta">Sem avaliações · Sem site</p>
      <p class="mres__meta">Horário não informado</p>
      <div class="mres__btns"><span class="is-off">Site</span><span class="is-off">Rota</span></div>
    </article>`;
  }
  return `<article class="mres" data-i="${i}">
    <div class="mres__thumbs">${r.photos.map((p) => `<img src="${IMG(p)}" alt="" loading="lazy" decoding="async">`).join('')}</div>
    <p class="mres__name">${r.name}</p>
    <p class="mres__meta"><b>${r.rate}</b> ${stars()} <span>(${r.n})</span> · ${r.dist}</p>
    <p class="mres__meta">${r.kind} · <em>Aberto</em> · ${r.close}</p>
    <div class="mres__btns"><span class="is-main">Site</span><span>WhatsApp</span><span>Rota</span></div>
  </article>`;
}

function screenHTML() {
  const pins = [
    [150, 250, 'Café Aurora', true], [262, 196], [96, 358], [300, 330], [212, 420], [120, 190],
  ];
  const cafe = RESULTS[0];
  return `<div class="ms" id="ms">
    <div class="ms__map">
      ${mapSVG()}
      <span class="ms__me"></span>
      ${pins.map(([x, y, label, main]) => `<span class="ms__pin${main ? ' ms__pin--main' : ''}" style="left:${x}px;top:${y}px">${PIN}${label ? `<b>${label}</b>` : ''}</span>`).join('')}
    </div>
    <div class="ms__status"><span>9:41</span><span class="ms__icons"><i></i><i></i><i></i><b></b></span></div>
    <div class="ms__search"><svg class="ico" aria-hidden="true"><use href="#i-search"/></svg><span class="ms__q"></span><i class="ms__caret"></i><span class="ms__avatar"></span></div>
    <div class="ms__chips"><span>Aberto agora</span><span>4,5+ ★</span><span>Perto de mim</span></div>
    <div class="ms__sheet"><span class="ms__grab"></span><p class="ms__count">5 resultados perto de você</p><div class="ms__list">${RESULTS.map(resultHTML).join('')}</div></div>
    <div class="ms__profile">
      <div class="ms__pbody">
        <img class="ms__cover" src="${IMG(834)}" alt="" loading="lazy" decoding="async">
        <div class="ms__pinfo">
          <p class="ms__pname">${cafe.name}</p>
          <p class="mres__meta"><b>${cafe.rate}</b> ${stars()} <span>(${cafe.n})</span></p>
          <p class="mres__meta">${cafe.kind} · <em>Aberto agora</em> · ${cafe.close}</p>
          <div class="ms__pbtns"><span class="is-main">Site</span><span class="ms__wa">WhatsApp</span><span>Rota</span><span>Salvar</span></div>
          <p class="ms__ph">Fotos</p>
          <div class="ms__grid">${[1060, 431, 42, 766, 63, 493].map((p) => `<img src="${IMG(p)}" alt="" loading="lazy" decoding="async">`).join('')}</div>
          <p class="ms__ph">Avaliações</p>
          <div class="ms__rev"><span></span><span></span><span></span></div>
          <div class="ms__rev"><span></span><span></span></div>
        </div>
      </div>
    </div>
    <span class="ms__touch"></span>
  </div>`;
}

function cardsHTML() {
  return `
    <div class="ar ar--map" data-z="140"><div class="ar__mini">${mapSVG()}<span class="ar__route"></span><span class="ms__pin ms__pin--main" style="left:62%;top:34%">${PIN}</span></div><p><b>350 m</b> · 5 min a pé</p></div>
    <div class="ar ar--skip" data-z="90"><span class="ar__x">✕</span><div><b data-you-name>Seu Negócio</b><p>Sem site · Sem fotos</p></div></div>
    <div class="ar ar--rate" data-z="170"><p class="ar__big">4,8</p><div>${stars()}<p>1.204 avaliações</p></div></div>
    <div class="ar ar--photo" data-z="210"><img src="${IMG(431)}" alt="" loading="lazy" decoding="async"><p>Fotos · 86</p></div>
    <div class="ar ar--open" data-z="110"><i></i>Aberto agora</div>
    <div class="ar ar--wa" data-z="190"><svg class="ico" aria-hidden="true"><use href="#i-wa"/></svg><div><b>WhatsApp</b><p>Mensagem enviada</p></div></div>`;
}

// Linha do tempo da tela (≈11 s, em loop), com os cards AR sincronizados.
function screenLoop(ms, cardsEl) {
  const $ = (s) => ms.querySelector(s);
  const q = $('.ms__q');
  const list = $('.ms__list');
  const touch = $('.ms__touch');
  const card = (c) => cardsEl.querySelector(`.ar--${c}`);
  const items = [...list.children];
  const rowY = (i) => -items[i].offsetTop + 6;

  const tl = gsap.timeline({ repeat: -1, paused: true, defaults: { ease: 'power3.out' } });
  const typed = { n: 0 };

  // estado inicial de cada volta
  tl.call(() => {
    q.textContent = '';
    ms.classList.remove('is-typed');
  }, null, 0);
  tl.set($('.ms__map'), { scale: 1, x: 0, y: 0 }, 0);
  tl.set(ms.querySelectorAll('.ms__pin'), { y: -40, opacity: 0 }, 0);
  tl.set($('.ms__chips'), { opacity: 0, y: -6 }, 0);
  tl.set($('.ms__sheet'), { yPercent: 100 }, 0);
  tl.set(list, { y: 0, filter: 'blur(0px)' }, 0);
  tl.set($('.ms__profile'), { yPercent: 100 }, 0);
  tl.set($('.ms__pbody'), { y: 0 }, 0);
  tl.set(touch, { opacity: 0, scale: 1 }, 0);
  tl.set(cardsEl.querySelectorAll('.ar'), { opacity: 0, scale: 0.4, z: -200, rotationY: 0, rotation: 0, y: 0 }, 0);

  // 1. digita a busca
  tl.to(typed, {
    n: QUERY.length, duration: 1.3, ease: 'none',
    onUpdate: () => { q.textContent = QUERY.slice(0, Math.round(typed.n)); },
    onStart: () => { typed.n = 0; },
  }, 0.3);
  tl.call(() => ms.classList.add('is-typed'), null, 1.65);

  // 2. filtros e pinos caindo; o mapa aproxima
  tl.to($('.ms__chips'), { opacity: 1, y: 0, duration: 0.4 }, 1.7);
  tl.to(ms.querySelectorAll('.ms__pin'), { y: 0, opacity: 1, duration: 0.55, ease: 'back.out(2.4)', stagger: 0.07 }, 1.8);
  tl.to($('.ms__map'), { scale: 1.14, x: 10, y: 18, duration: 2.2, ease: 'power2.inOut' }, 1.8);
  pop(tl, card('map'), 2.2);
  pop(tl, card('open'), 2.45);

  // 3. a lista sobe e o dedo passa rápido
  tl.to($('.ms__sheet'), { yPercent: 36, duration: 0.6, ease: 'power4.out' }, 2.8);
  swipe(tl, touch, 3.5, 0.45);
  tl.to(list, { y: () => rowY(1), duration: 0.45 }, 3.55);
  // o "Seu Negócio" passa voando: ninguém para em quem não tem site
  pop(tl, card('skip'), 3.9);
  swipe(tl, touch, 4.25, 0.3);
  tl.to(list, { y: () => rowY(3), duration: 0.32, ease: 'power2.out' }, 4.28);
  tl.to(list, { filter: 'blur(2.5px)', duration: 0.12, yoyo: true, repeat: 1, ease: 'none' }, 4.28);
  tl.to(card('skip'), { y: 160, rotation: 14, opacity: 0, duration: 0.8, ease: 'power2.in' }, 4.55);
  swipe(tl, touch, 4.85, 0.3, true);
  tl.to(list, { y: () => rowY(0), duration: 0.55, ease: 'power3.inOut' }, 4.88);

  // 4. toca no primeiro com site e abre o perfil
  tap(tl, touch, '50%', '64%', 5.6);
  tl.to($('.ms__profile'), { yPercent: 0, duration: 0.6, ease: 'power4.out' }, 5.8);
  pop(tl, card('rate'), 6.05);
  pop(tl, card('photo'), 6.25);
  swipe(tl, touch, 6.9, 0.4);
  tl.to($('.ms__pbody'), { y: -250, duration: 0.5 }, 6.95);
  swipe(tl, touch, 7.55, 0.35);
  tl.to($('.ms__pbody'), { y: -470, duration: 0.45 }, 7.6);
  swipe(tl, touch, 8.15, 0.4, true);
  tl.to($('.ms__pbody'), { y: 0, duration: 0.55, ease: 'power3.inOut' }, 8.2);
  // 5. chama no WhatsApp
  tap(tl, touch, '45%', '53%', 8.95);
  tl.fromTo($('.ms__wa'), { scale: 1 }, { scale: 0.9, duration: 0.12, yoyo: true, repeat: 1 }, 9.05);
  pop(tl, card('wa'), 9.2);

  // 6. recolhe tudo
  tl.to(cardsEl.querySelectorAll('.ar'), { opacity: 0, scale: 0.6, z: -160, duration: 0.5, ease: 'power2.in', stagger: 0.03 }, 10.4);
  tl.to($('.ms__profile'), { yPercent: 100, duration: 0.5, ease: 'power3.in' }, 10.5);
  tl.to($('.ms__sheet'), { yPercent: 100, duration: 0.45, ease: 'power3.in' }, 10.6);
  tl.to({}, { duration: 0.3 }, 11.1);
  return tl;
}

function pop(tl, el, at) {
  if (!el) return;
  tl.to(el, { opacity: 1, scale: 1, z: Number(el.dataset.z) || 120, duration: 0.7, ease: 'back.out(1.7)' }, at);
}

// dedo passando: bolinha de toque sobe rápido pela tela
function swipe(tl, touch, at, dur, down = false) {
  const [y0, y1] = down ? ['30%', '78%'] : ['80%', '24%'];
  tl.fromTo(touch, { left: '58%', top: y0, opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.08, ease: 'none' }, at);
  tl.to(touch, { top: y1, left: '54%', duration: dur, ease: 'power2.in' }, at + 0.06);
  tl.to(touch, { opacity: 0, duration: 0.12, ease: 'none' }, at + dur);
}

// toque: a bolinha aparece e pulsa
function tap(tl, touch, x, y, at) {
  tl.fromTo(touch, { left: x, top: y, opacity: 0, scale: 1.5 }, { opacity: 1, scale: 0.85, duration: 0.18, ease: 'power2.out' }, at);
  tl.to(touch, { opacity: 0, scale: 1.3, duration: 0.3, ease: 'power2.out' }, at + 0.22);
}

export function initFacade() {
  const section = document.getElementById('fachada');
  const screen = document.getElementById('swipe-screen');
  const cardsEl = document.getElementById('swipe-cards');
  const scene = document.getElementById('swipe3d');
  if (!section || !screen) return;

  screen.innerHTML = screenHTML();
  cardsEl.innerHTML = cardsHTML();
  const ms = screen.querySelector('.ms');

  // a tela é desenhada em 360x640 e escalada para caber no display da foto
  const fit = () => { ms.style.setProperty('--k', String(screen.clientWidth / 360)); };
  fit();
  new ResizeObserver(fit).observe(screen);

  const youNames = [...section.querySelectorAll('[data-you-name]')];
  store.on((d) => youNames.forEach((el) => { if (el.textContent !== d.signName) el.textContent = d.signName; }));

  const street = section.querySelector('.facade__street');
  const l1 = section.querySelector('.facade__l1');
  const l2 = section.querySelector('.facade__l2');
  const punch = document.getElementById('facade-punch');

  if (reduced) {
    section.classList.add('is-static');
    const tl = screenLoop(ms, cardsEl);
    tl.progress(0.8).pause();
    return;
  }

  const loop = screenLoop(ms, cardsEl);
  let loopOn = false;
  const setLoop = (on) => {
    if (on === loopOn) return;
    loopOn = on;
    if (on) loop.play(); else loop.pause();
  };

  const mobile = () => window.matchMedia('(max-width: 899px)').matches;

  // Câmera guiada pela rolagem (a seção é alta e o palco fica preso na tela).
  const cam = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: section, start: 'top top', end: 'bottom bottom', scrub: 0.6, invalidateOnRefresh: true,
      onUpdate: (st) => setLoop(st.progress > 0.2 && st.progress < 0.995),
      onLeave: () => setLoop(false),
      onLeaveBack: () => setLoop(false),
    },
  });
  cam.fromTo(street, { scale: 1.2 }, { scale: 1.02, duration: 0.45 }, 0);
  cam.fromTo(l1, { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 0.1, ease: 'power2.out' }, 0);
  cam.to(street, { opacity: 0.28, filter: 'blur(6px) saturate(.7)', duration: 0.18 }, 0.2);
  cam.to(l1, { opacity: 0.42, duration: 0.14 }, 0.22);
  cam.fromTo(l2, { opacity: 0, yPercent: 60 }, { opacity: 1, yPercent: 0, duration: 0.12, ease: 'power2.out' }, 0.26);
  cam.fromTo(scene,
    { yPercent: 70, rotationX: 32, rotationY: -26, rotationZ: 6, opacity: 0 },
    { yPercent: 0, rotationX: 6, rotationY: -12, rotationZ: 0, opacity: 1, duration: 0.24, ease: 'power2.out' }, 0.2);
  cam.to(scene, { rotationX: 2, rotationY: 8, scale: () => (mobile() ? 1.04 : 1.1), duration: 0.5, ease: 'sine.inOut' }, 0.44);
  cam.fromTo(punch, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.08, ease: 'power2.out' }, 0.86);
  cam.to([l1, l2], { opacity: () => (mobile() ? 0 : 0.18), duration: 0.08 }, 0.86);
  cam.to({}, { duration: 0.06 }, 0.94);

  // um pouco de inclinação com o mouse no computador
  const tiltTo = gsap.quickTo(scene.querySelector('.swipe3d__tilt'), 'rotationY', { duration: 0.8, ease: 'power3.out' });
  const tiltX = gsap.quickTo(scene.querySelector('.swipe3d__tilt'), 'rotationX', { duration: 0.8, ease: 'power3.out' });
  section.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    const r = section.getBoundingClientRect();
    tiltTo(((e.clientX - r.left) / r.width - 0.5) * 10);
    tiltX(((e.clientY - r.top) / r.height - 0.5) * -8);
  });

  new IntersectionObserver(([e]) => { if (!e.isIntersecting) setLoop(false); }).observe(section);
  ScrollTrigger.refresh();
}
