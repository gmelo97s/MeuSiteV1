// Hero: quando a pessoa digita o nome do negócio, aparece por cima dos vídeos uma página
// de resultados de busca. O nome dela vai na barra, não há site nenhum para ele, e quem
// aparece são três concorrentes do mesmo ramo (fictícios), com site, nota e WhatsApp.
// É uma simulação (e diz isso): não consulta buscador nenhum nem usa a marca de ninguém.
import { gsap, reduced } from './motion.js';
import { searchFor } from './data.js';
import { store, waLink } from './store.js';
import { mapSVG, PIN, stars } from './facade.js';

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const MIN = 2;
const WAIT = 450; // ms depois da última tecla para "pesquisar"

export function initSearchSim() {
  const hero = document.querySelector('.hero');
  const stage = document.querySelector('.hero__stage');
  const input = document.getElementById('negocio');
  if (!stage || !input) return;

  const box = document.createElement('div');
  box.className = 'gsr';
  box.id = 'gsr';
  box.setAttribute('role', 'region');
  box.setAttribute('aria-label', 'Simulação de busca');
  box.hidden = true;
  box.innerHTML = `
    <p class="gsr__tag"><i aria-hidden="true"></i>Simulação: sem site, é isso que o cliente vê</p>
    <div class="gsr__card">
      <div class="gsr__bar">
        <svg class="ico" aria-hidden="true"><use href="#i-search"/></svg>
        <span class="gsr__q"></span>
        <button class="gsr__x" type="button" aria-label="Apagar o nome"><svg class="ico" aria-hidden="true"><use href="#i-close"/></svg></button>
      </div>
      <div class="gsr__tabs" aria-hidden="true"><span class="is-on">Todos</span><span>Mapas</span><span>Imagens</span><span>Notícias</span></div>
      <div class="gsr__body">
        <p class="gsr__none">Nenhum site encontrado para <b class="gsr__nm"></b>.</p>
        <p class="gsr__for">Mostrando <b class="gsr__pl"></b> perto de você</p>
        <div class="gsr__map" aria-hidden="true">${mapSVG()}
          <span class="gsr__pin" style="left:28%;top:38%">${PIN}<b>1</b></span>
          <span class="gsr__pin" style="left:62%;top:30%">${PIN}<b>2</b></span>
          <span class="gsr__pin" style="left:47%;top:66%">${PIN}<b>3</b></span>
          <span class="gsr__me"></span>
        </div>
        <ol class="gsr__list"></ol>
        <a class="btn btn--green gsr__cta" data-wa="search" href="#" target="_blank" rel="noopener">Quero aparecer aqui <svg class="ico" aria-hidden="true"><use href="#i-arrow"/></svg></a>
      </div>
      <div class="gsr__skel" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
    </div>
    <p class="sr-only gsr__live" aria-live="polite"></p>`;
  stage.appendChild(box);

  const $ = (s) => box.querySelector(s);
  const q = $('.gsr__q');
  const list = $('.gsr__list');
  const card = $('.gsr__card');
  const cta = $('.gsr__cta');
  const live = $('.gsr__live');

  $('.gsr__x').addEventListener('click', () => {
    input.value = '';
    store.set({ name: '' });
    input.focus();
  });

  let open = false;
  let timer = 0;
  let tl = null;
  let lastRun = '';

  const show = () => {
    if (open) return;
    open = true;
    box.hidden = false;
    hero.classList.add('is-searching');
    if (!reduced) gsap.fromTo(box, { opacity: 0, y: 26, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power4.out' });
  };
  const hide = () => {
    if (!open) return;
    open = false;
    lastRun = '';
    hero.classList.remove('is-searching');
    tl?.kill();
    if (reduced) { box.hidden = true; return; }
    gsap.to(box, { opacity: 0, y: 18, scale: 0.98, duration: 0.35, ease: 'power2.in', onComplete: () => { if (!open) box.hidden = true; } });
  };

  // monta e anima os resultados para o nome digitado
  const run = (nm) => {
    if (nm === lastRun) return;
    lastRun = nm;
    const { plural, rivals } = searchFor(nm);
    $('.gsr__nm').textContent = `“${nm}”`;
    $('.gsr__pl').textContent = plural;
    list.innerHTML = rivals.map((r, i) => `
      <li class="gsr__res">
        <span class="gsr__n">${i + 1}</span>
        <div class="gsr__txt">
          <b>${esc(r.name)}</b>
          <span class="gsr__meta">${r.rate} ${stars()} <em>(${r.n})</em> · <strong>${r.open}</strong></span>
          <span class="gsr__chips">${r.tags.map((t) => `<i>${t}</i>`).join('')}</span>
        </div>
      </li>`).join('') + `
      <li class="gsr__res gsr__res--you">
        <span class="gsr__n"><svg class="ico" aria-hidden="true"><use href="#i-close"/></svg></span>
        <div class="gsr__txt"><b>${esc(nm)}</b><span class="gsr__meta">Não aparece. Sem site, sem fotos, sem horário.</span></div>
      </li>`;
    cta.href = waLink('search', nm);
    live.textContent = `Simulação: ao procurar ${nm}, aparecem três concorrentes com site e o seu negócio não aparece.`;

    const rows = [...list.children];
    const you = rows[rows.length - 1];
    tl?.kill();
    if (reduced) return;
    card.classList.add('is-loading');
    tl = gsap.timeline()
      .set(['.gsr__none', '.gsr__for', '.gsr__map', cta].map((s) => (typeof s === 'string' ? box.querySelector(s) : s)), { opacity: 0, y: 10 })
      .set(rows, { opacity: 0, y: 16 })
      .set(box.querySelectorAll('.gsr__pin'), { opacity: 0, y: -18 })
      .add(() => card.classList.remove('is-loading'), 0.38)
      .to($('.gsr__none'), { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' }, 0.4)
      .to($('.gsr__for'), { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' }, 0.5)
      .to($('.gsr__map'), { opacity: 1, y: 0, duration: 0.45, ease: 'power3.out' }, 0.58)
      .to(box.querySelectorAll('.gsr__pin'), { opacity: 1, y: 0, duration: 0.5, ease: 'back.out(2.6)', stagger: 0.08 }, 0.7)
      .to(rows.slice(0, -1), { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out', stagger: 0.09 }, 0.75)
      .to(you, { opacity: 1, y: 0, duration: 0.45, ease: 'power3.out' }, 1.15)
      .fromTo(you, { x: 0 }, { x: 8, duration: 0.06, repeat: 5, yoyo: true, ease: 'none' }, 1.5)
      .to(cta, { opacity: 1, y: 0, duration: 0.5, ease: 'back.out(2)' }, 1.7);
  };

  store.on((d) => {
    const nm = d.nm;
    q.textContent = nm;
    clearTimeout(timer);
    if (nm.length < MIN) { hide(); return; }
    show();
    timer = setTimeout(() => run(nm), WAIT);
  });
}
