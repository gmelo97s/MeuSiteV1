// Simulador de faturamento perdido, com cara de app de banco: a conta é feita com os números da pessoa.
import { gsap, reduced } from './motion.js';

const brl = (v) => `R$ ${Math.round(v).toLocaleString('pt-BR')}`;
const loss = (v) => `− ${brl(v)}`;

// Teto "redondo" para o eixo: 1, 2, 2,5 ou 5 vezes uma potência de 10.
function niceMax(v) {
  const p = 10 ** Math.floor(Math.log10(Math.max(1, v)));
  return [1, 2, 2.5, 5, 10].map((m) => m * p).find((x) => x >= v);
}
const short = (v) => (v >= 1000 ? `R$ ${(v / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 1 })} mil` : brl(v));

export function initCalc() {
  const pw = document.getElementById('calc-pw');
  const tk = document.getElementById('calc-tk');
  if (!pw || !tk) return;
  const $ = (id) => document.getElementById(id);
  const plot = $('bars');
  const tbody = $('bars-table').querySelector('tbody');
  const shown = { year: 0, month: 0 };

  plot.innerHTML = Array.from({ length: 12 }, (_, i) => `<div class="bar" data-m="${i + 1}"><i></i>${i === 11 ? '<span class="bar__label"></span>' : ''}</div>`).join('')
    + '<span class="bars__grid" aria-hidden="true"><b></b></span><span class="bars__tip" aria-hidden="true"></span>';
  const bars = [...plot.querySelectorAll('.bar')];
  const lastLabel = plot.querySelector('.bar__label');
  const gridLabel = plot.querySelector('.bars__grid b');
  const tip = plot.querySelector('.bars__tip');
  let month = 0;

  const fill = (input) => {
    const p = ((input.value - input.min) / (input.max - input.min)) * 100;
    input.style.setProperty('--p', `${p}%`);
  };

  const update = () => {
    const p = Number(pw.value);
    const t = Number(tk.value);
    fill(pw);
    fill(tk);
    $('calc-pw-out').textContent = String(p);
    $('calc-tk-out').textContent = brl(t);
    month = (p * t * 52) / 12;
    const year = p * t * 52;
    const max = niceMax(year);

    if (reduced) {
      $('calc-year').textContent = loss(year);
      $('calc-month').textContent = loss(month);
    } else {
      gsap.to(shown, {
        year, month, duration: 0.6, ease: 'power3.out', overwrite: true,
        onUpdate: () => {
          $('calc-year').textContent = loss(shown.year);
          $('calc-month').textContent = loss(shown.month);
        },
      });
    }
    $('calc-lost').textContent = String(Math.round((p * 52) / 12));
    document.querySelectorAll('[data-bind-ticket]').forEach((el) => { el.textContent = loss(t); });

    bars.forEach((b, i) => b.style.setProperty('--h', `${((month * (i + 1)) / max) * 100}%`));
    lastLabel.textContent = loss(year);
    gridLabel.textContent = short(max);
    tbody.innerHTML = bars.map((_, i) => `<tr><td>Mês ${i + 1}</td><td>${loss(month * (i + 1))}</td></tr>`).join('');

    pw.setAttribute('aria-valuetext', `${p} ${p === 1 ? 'cliente' : 'clientes'} por semana`);
    tk.setAttribute('aria-valuetext', `${brl(t)} por cliente`);
  };

  pw.addEventListener('input', update);
  tk.addEventListener('input', update);

  // Botões de mais e menos
  document.querySelectorAll('.sim__step').forEach((btn) => {
    btn.addEventListener('click', () => {
      const input = $(btn.dataset.step);
      const step = Number(input.step) || 1;
      const v = Number(input.value) + Number(btn.dataset.dir) * step;
      input.value = String(Math.min(Number(input.max), Math.max(Number(input.min), v)));
      update();
    });
  });

  // Detalhe de cada barra ao passar o mouse
  plot.addEventListener('pointerover', (e) => {
    const b = e.target.closest('.bar');
    if (!b) return;
    const m = Number(b.dataset.m);
    const bar = b.querySelector('i').getBoundingClientRect();
    const box = plot.getBoundingClientRect();
    tip.textContent = `Mês ${m}: ${loss(month * m)} acumulado`;
    const x = Math.min(Math.max(bar.left + bar.width / 2 - box.left, 70), box.width - 70);
    tip.style.left = `${x}px`;
    tip.style.top = `${bar.top - box.top}px`;
    tip.classList.add('is-on');
  });
  plot.addEventListener('pointerleave', () => tip.classList.remove('is-on'));

  update();
}
