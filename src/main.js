import 'lenis/dist/lenis.css';
import './styles/base.css';
import './styles/sections.css';

import { initLenis, initAnchors, initReveals, initButtons, initTilt, initNav, ScrollTrigger } from './js/motion.js';
import { bindDom } from './js/store.js';
import { runCurtain } from './js/curtain.js';
import { initHero, heroIntro } from './js/hero.js';
import { initDay } from './js/day.js';
import { initFacade } from './js/facade.js';
import { initWork } from './js/work.js';
import { initCalc } from './js/calc.js';
import { initChat } from './js/chat.js';
import { initStamp, initPortrait, initChalk, initFaq, initFinal } from './js/extras.js';
import { initExit } from './js/exit.js';

window.__odReady = true;

const lenis = initLenis();

bindDom();
initAnchors(lenis);
initButtons();
initNav();
initHero({ lenis });
initDay({ lenis });
initFacade({ lenis });
initWork();
initCalc();
initChat();
initFaq();
initReveals();
initStamp();
initPortrait();
initChalk();
initFinal();
initTilt();
initExit({ lenis });

runCurtain({ lenis }).then(() => {
  heroIntro();
  ScrollTrigger.refresh();
});

document.fonts?.ready.then(() => ScrollTrigger.refresh());
window.addEventListener('load', () => ScrollTrigger.refresh());
