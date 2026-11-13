import 'lenis/dist/lenis.css';
import '@fontsource-variable/inter/opsz.css';
import '@fontsource/instrument-serif/400.css';
import '@fontsource/instrument-serif/400-italic.css';
import './styles/base.css';
import './styles/sections.css';
import './styles/mobile.css';

import {
  initLenis, initAnchors, initThemes, initReveals, initCounters, initButtons, initMagnetic,
  initTilt, initCursor, initProgress, initNav, initTicker, ScrollTrigger,
} from './js/motion.js';
import { bindDom } from './js/store.js';
import { runSplash } from './js/splash.js';
import { initHero, heroIntro } from './js/hero.js';
import { initSearchSim } from './js/search.js';
import { initLook } from './js/look.js';
import { initWork } from './js/work.js';
import { initReel } from './js/reel.js';
import { initBelief } from './js/belief.js';
import { initCalc } from './js/calc.js';
import { initChat } from './js/chat.js';
import { initPortrait, initReceipt, initFaq, initFinal, initFootMark } from './js/extras.js';
import { initExit } from './js/exit.js';
import { initSheets } from './js/sheets.js';

window.__codemReady = true;
if (import.meta.env.DEV) window.__ST = ScrollTrigger;

const lenis = initLenis();

bindDom();
initAnchors(lenis);
initButtons();
initNav();
initProgress();
initHero();
initSearchSim();
initTicker(lenis);
initLook({ lenis });
initWork();
initReel();
initBelief();
initCalc();
initChat();
initFaq();
initReveals();
initCounters();
initPortrait();
initReceipt();
initFinal();
initFootMark();
initTilt();
initMagnetic();
initCursor();
initExit({ lenis });
initSheets();
initThemes();

runSplash({ lenis }).then(() => {
  heroIntro();
  ScrollTrigger.refresh();
});

document.fonts?.ready.then(() => ScrollTrigger.refresh());
window.addEventListener('load', () => ScrollTrigger.refresh());
