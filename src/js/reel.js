// Vídeo da CODEM: toca mudo quando aparece, com botão de som. O selo gira com a rolagem.
import { gsap, reduced } from './motion.js';

export function initReel() {
  const v = document.getElementById('reel-video');
  const btn = document.getElementById('reel-sound');
  if (!v) return;
  let loaded = false;
  let inView = false;

  const load = () => {
    if (loaded) return;
    loaded = true;
    v.querySelectorAll('source').forEach((s) => { s.src = s.dataset.src; });
    v.load();
  };

  new IntersectionObserver(([e]) => {
    inView = e.isIntersecting;
    if (inView) {
      load();
      // quem pediu menos movimento só vê o vídeo se apertar o botão
      if (!reduced || !v.muted) v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, { threshold: 0.35 }).observe(v);

  const label = btn.querySelector('span');
  const icon = btn.querySelector('use');
  btn.addEventListener('click', () => {
    load();
    v.muted = !v.muted;
    if (!v.muted) v.play().catch(() => {});
    btn.setAttribute('aria-pressed', String(!v.muted));
    icon.setAttribute('href', v.muted ? '#i-mute' : '#i-sound');
    label.textContent = v.muted ? 'Ativar som' : 'Desativar som';
  });

  if (reduced) return;
  gsap.to('.reel__badge', {
    rotate: 360, ease: 'none',
    scrollTrigger: { trigger: '.reel', start: 'top bottom', end: 'bottom top', scrub: 0.5 },
  });
  gsap.fromTo('.reel__phone', { rotate: -9, yPercent: 10, scale: 0.9 }, {
    rotate: 4, yPercent: -6, scale: 1, ease: 'none',
    scrollTrigger: { trigger: '.reel', start: 'top bottom', end: 'bottom top', scrub: true },
  });
}
