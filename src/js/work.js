// Projetos no ar: lista à esquerda, vídeo em loop à direita (computador + celular).
import { gsap, reduced } from './motion.js';
import { PROJECTS } from './data.js';

const AUTO_MS = 7000;

const videoTag = (id, kind) => `<video muted playsinline loop preload="none" data-poster="/videos/${id}-${kind}.webp" aria-hidden="true">
  <source data-src="/videos/${id}-${kind}.webm" type="video/webm" />
  <source data-src="/videos/${id}-${kind}.mp4" type="video/mp4" />
</video>`;

export function initWork() {
  const root = document.getElementById('work');
  const list = document.getElementById('work-list');
  const stage = document.getElementById('work-stage');
  if (!root) return;

  list.innerHTML = PROJECTS.map((p, i) => `
    <button class="wtab" type="button" role="tab" id="wtab-${p.id}" aria-controls="wpanel-${p.id}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" style="--acc:${p.accent}">
      <span class="wtab__name"><i aria-hidden="true"></i>${p.name}</span>
      <span class="wtab__type">${p.type}</span>
      <span class="wtab__domain">${p.domain}</span>
      <span class="wtab__bar" aria-hidden="true"><i></i></span>
    </button>`).join('');

  stage.innerHTML = PROJECTS.map((p, i) => `
    <div class="wscreen${i === 0 ? ' is-active' : ''}" role="tabpanel" id="wpanel-${p.id}" aria-labelledby="wtab-${p.id}">
      <div class="browser">
        <div class="browser__bar"><i></i><i></i><i></i><span class="browser__url"><svg class="ico" aria-hidden="true"><use href="#i-lock"/></svg>${p.domain}</span></div>
        ${videoTag(p.id, 'd')}
      </div>
      <div class="phone"><span class="phone__island"></span><div class="phone__screen">${videoTag(p.id, 'm')}</div></div>
      <a class="btn btn--ghost btn--sm wscreen__open" href="${p.url}" target="_blank" rel="noopener">Abrir o site no ar <svg class="ico" aria-hidden="true"><use href="#i-arrow"/></svg></a>
    </div>`).join('');

  const tabs = [...list.children];
  const panels = [...stage.children];
  let active = 0;
  let inView = false;
  let hovering = false;
  let progress = null;

  const loadAndPlay = (panel) => {
    panel.querySelectorAll('video').forEach((v) => {
      // quem pediu menos movimento fica com a imagem de capa; e vídeo escondido não é baixado
      if (reduced || getComputedStyle(v.closest('.browser, .phone')).display === 'none') return;
      if (!v.dataset.loaded) {
        v.querySelectorAll('source').forEach((s) => { s.src = s.dataset.src; });
        v.load();
        v.dataset.loaded = '1';
      }
      if (!reduced) v.play().catch(() => {});
    });
  };
  const pause = (panel) => panel.querySelectorAll('video').forEach((v) => v.pause());

  const runProgress = () => {
    progress?.kill();
    tabs.forEach((t) => gsap.set(t.querySelector('.wtab__bar i'), { scaleX: 0 }));
    if (reduced) return;
    progress = gsap.fromTo(tabs[active].querySelector('.wtab__bar i'), { scaleX: 0 }, {
      scaleX: 1, duration: AUTO_MS / 1000, ease: 'none',
      onComplete: () => activate((active + 1) % PROJECTS.length),
    });
    if (!inView || hovering) progress.pause();
  };

  function activate(i, { focus = false } = {}) {
    if (i === active) { runProgress(); return; }
    const prev = panels[active];
    const next = panels[i];
    tabs[active].setAttribute('aria-selected', 'false');
    tabs[active].tabIndex = -1;
    tabs[i].setAttribute('aria-selected', 'true');
    tabs[i].tabIndex = 0;
    if (focus) tabs[i].focus();
    active = i;

    next.classList.add('is-active');
    if (inView) loadAndPlay(next);
    if (reduced) {
      prev.classList.remove('is-active');
      pause(prev);
    } else {
      gsap.set(next, { zIndex: 2, autoAlpha: 1 });
      gsap.set(prev, { zIndex: 1 });
      gsap.fromTo(next, { clipPath: 'inset(0% 50% 0% 50% round 28px)' }, { clipPath: 'inset(0% 0% 0% 0% round 28px)', duration: 0.95, ease: 'power4.inOut', clearProps: 'clipPath' });
      gsap.fromTo(next.querySelectorAll('.browser, .phone'), { y: 30 }, { y: 0, duration: 1.1, ease: 'power4.out', stagger: 0.08, clearProps: 'transform' });
      gsap.to(prev, {
        scale: 0.96, autoAlpha: 0.4, duration: 0.9, ease: 'power3.inOut',
        onComplete: () => { prev.classList.remove('is-active'); gsap.set(prev, { clearProps: 'all' }); pause(prev); },
      });
    }
    runProgress();
  }

  list.addEventListener('click', (e) => {
    const t = e.target.closest('.wtab');
    if (t) activate(tabs.indexOf(t));
  });
  list.addEventListener('keydown', (e) => {
    const keys = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
    if (e.key in keys) {
      e.preventDefault();
      activate((active + keys[e.key] + PROJECTS.length) % PROJECTS.length, { focus: true });
    } else if (e.key === 'Home') { e.preventDefault(); activate(0, { focus: true }); }
    else if (e.key === 'End') { e.preventDefault(); activate(PROJECTS.length - 1, { focus: true }); }
  });

  root.addEventListener('pointerenter', () => { hovering = true; progress?.pause(); });
  root.addEventListener('pointerleave', () => { hovering = false; if (inView) progress?.resume(); });
  root.addEventListener('focusin', () => { hovering = true; progress?.pause(); });
  root.addEventListener('focusout', () => { hovering = false; if (inView) progress?.resume(); });

  // capas só quando a seção se aproxima (e só dos vídeos visíveis nesse tamanho de tela)
  const posterIO = new IntersectionObserver(([e]) => {
    if (!e.isIntersecting) return;
    posterIO.disconnect();
    stage.querySelectorAll('video[data-poster]').forEach((v) => {
      if (getComputedStyle(v.closest('.browser, .phone')).display !== 'none') v.poster = v.dataset.poster;
    });
  }, { rootMargin: '900px 0px' });
  posterIO.observe(root);

  new IntersectionObserver(([e]) => {
    inView = e.isIntersecting;
    if (inView) {
      loadAndPlay(panels[active]);
      if (!progress) runProgress();
      else if (!hovering) progress.resume();
    } else {
      pause(panels[active]);
      progress?.pause();
    }
  }, { threshold: 0.25 }).observe(root);
}
