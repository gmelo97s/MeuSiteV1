// "Quanto custa ficar apagado?": a conta de padaria com os números da própria pessoa.
import { gsap, reduced } from './motion.js';

const brl = (v) => `R$ ${Math.round(v).toLocaleString('pt-BR')}`;

export function initCalc() {
  const pw = document.getElementById('calc-pw');
  const tk = document.getElementById('calc-tk');
  if (!pw || !tk) return;
  const $ = (id) => document.getElementById(id);
  const out = { month: $('calc-month'), year: $('calc-year') };
  const tally = $('tally');
  const shown = { month: 0, year: 0 };
  let groups = 0;

  const fill = (input) => {
    const p = ((input.value - input.min) / (input.max - input.min)) * 100;
    input.style.setProperty('--p', `${p}%`);
  };

  const drawTally = (marks) => {
    const need = Math.ceil(marks / 5);
    const frag = document.createDocumentFragment();
    tally.innerHTML = '';
    for (let g = 0; g < need; g++) {
      const n = Math.min(5, marks - g * 5);
      const el = document.createElement('span');
      el.className = 'tally__g' + (g >= groups ? ' is-new' : '');
      el.innerHTML = '<i></i>'.repeat(Math.min(4, n)) + (n === 5 ? '<b></b>' : '');
      if (g >= groups) el.style.animationDelay = `${(g - groups) * 40}ms`;
      frag.appendChild(el);
    }
    tally.appendChild(frag);
    groups = need;
  };

  const update = () => {
    const p = Number(pw.value);
    const t = Number(tk.value);
    fill(pw); fill(tk);
    $('calc-people').textContent = p === 1 ? 'uma pessoa' : `${p} pessoas`;
    $('calc-desist').textContent = p === 1 ? 'desistisse' : 'desistissem';
    $('calc-found').textContent = p === 1 ? 'achou' : 'acharam';
    $('calc-each').textContent = p === 1 ? 'ela' : 'cada uma';
    $('calc-ticket').textContent = brl(t);
    const month = (p * t * 52) / 12;
    const year = p * t * 52;
    if (reduced) {
      out.month.textContent = brl(month);
      out.year.textContent = brl(year);
    } else {
      gsap.to(shown, {
        month, year, duration: 0.6, ease: 'power3.out', overwrite: true,
        onUpdate: () => { out.month.textContent = brl(shown.month); out.year.textContent = brl(shown.year); },
      });
    }
    drawTally(Math.round((p * 52) / 12));
    pw.setAttribute('aria-valuetext', `${p} ${p === 1 ? 'pessoa' : 'pessoas'} por semana`);
    tk.setAttribute('aria-valuetext', `${brl(t)} por cliente`);
  };

  pw.addEventListener('input', update);
  tk.addEventListener('input', update);
  update();
}
