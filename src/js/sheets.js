// Celular: cada seção é uma "folha" que desliza por cima da anterior, como os cartões do iOS.
// A de trás fica parada (sticky), encolhe um pouco, arredonda os cantos e escurece.
import { gsap, ScrollTrigger, reduced } from './motion.js';

const MQ = '(max-width: 900px)';

export function initSheets() {
  if (reduced) return;
  const root = document.documentElement;
  const sheets = [...document.querySelectorAll('main > section')];
  if (sheets.length < 2) return;

  // Com as folhas presas, a posição na tela não é a posição na página:
  // durante as medições do ScrollTrigger elas voltam ao fluxo normal por um instante.
  ScrollTrigger.addEventListener('refreshInit', () => root.classList.add('sheets-off'));
  ScrollTrigger.addEventListener('refresh', () => root.classList.remove('sheets-off'));

  const mm = gsap.matchMedia();
  mm.add(MQ, () => {
    root.classList.add('has-sheets');
    const extras = [];
    sheets.forEach((s, i) => {
      s.classList.add('sheet');
      s.style.zIndex = String(i + 1);
      if (i > 0) {
        const grab = document.createElement('span');
        grab.className = 'sheet__grab';
        grab.setAttribute('aria-hidden', 'true');
        s.prepend(grab);
        extras.push(grab);
      }
      const dim = document.createElement('span');
      dim.className = 'sheet__dim';
      dim.setAttribute('aria-hidden', 'true');
      s.appendChild(dim);
      extras.push(dim);
    });

    // cada folha prende quando o fim dela encosta no pé da tela
    const layout = () => sheets.forEach((s) => { s.style.top = `${Math.min(0, window.innerHeight - s.offsetHeight)}px`; });
    layout();

    const vis = (s) => Math.max(0, s.offsetHeight - window.innerHeight); // parte da folha acima da tela quando presa
    sheets.slice(0, -1).forEach((s, i) => {
      const next = sheets[i + 1];
      const dim = s.querySelector(':scope > .sheet__dim');
      // o recorte (cantos redondos na parte visível) só entra quando a folha já está presa,
      // senão esconderia o topo dela enquanto ainda sobe pela tela
      gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: next, start: 'top bottom', end: 'top top', scrub: true, invalidateOnRefresh: true },
      })
        .set(s, {
          transformOrigin: () => `50% ${vis(s) + window.innerHeight / 2}px`,
          clipPath: () => `inset(${vis(s)}px 0px 0px 0px round 0px)`,
        }, 0.001)
        .to(s, { scale: 0.9, clipPath: () => `inset(${vis(s)}px 0px 0px 0px round 34px)`, duration: 1 }, 0.001)
        .fromTo(dim, { opacity: 0 }, { opacity: 0.6, duration: 1 }, 0.001);
    });

    const ro = new ResizeObserver(() => { layout(); });
    sheets.forEach((s) => ro.observe(s));
    window.addEventListener('resize', layout);
    ScrollTrigger.refresh();

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', layout);
      root.classList.remove('has-sheets');
      extras.forEach((x) => x.remove());
      sheets.forEach((s) => { s.classList.remove('sheet'); s.style.zIndex = ''; s.style.top = ''; });
    };
  });
}
