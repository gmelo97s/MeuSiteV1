// CODEM · página de vendas. Tudo leve: só IntersectionObserver e transições de CSS.
// Nada de rolagem forçada, seções presas ou animação amarrada ao scroll.
import '@fontsource-variable/inter/opsz.css';
import '@fontsource/instrument-serif/400-italic.css';
import './styles/main.css';

const root = document.documentElement;
const reduced = root.classList.contains('reduced');
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

const CONTACT = { whatsapp: '5511937654207' };
const WA_TEXT = 'Oi, Guilherme! Quero ver como fica o site do meu negócio.\n\nNome do negócio: \nInstagram: @';

// ---------- WhatsApp com a mensagem pronta ----------
const waHref = `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(WA_TEXT)}`;
$$('[data-wa]').forEach((a) => { a.href = waHref; a.target = '_blank'; a.rel = 'noopener'; });
const y = $('#year'); if (y) y.textContent = String(new Date().getFullYear());

// ---------- abertura: só na primeira visita da sessão ----------
const intro = $('#intro');
if (intro) {
  const done = () => { intro.remove(); try { sessionStorage.setItem('codem-intro', '1'); } catch { /* sem armazenamento */ } };
  if (root.classList.contains('no-intro') || reduced) done();
  else setTimeout(done, 1700);
}

// ---------- entradas ao rolar ----------
const rv = $$('.rv');
if (reduced || !('IntersectionObserver' in window)) rv.forEach((el) => el.classList.add('in'));
else {
  const io = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  rv.forEach((el) => (el.closest('.hero') ? requestAnimationFrame(() => el.classList.add('in')) : io.observe(el)));
}

// ---------- vídeos: tocam só quando aparecem ----------
const vio = new IntersectionObserver((entries) => entries.forEach((e) => {
  const v = e.target;
  if (e.isIntersecting && !reduced) v.play().catch(() => {});
  else v.pause();
}), { threshold: 0.3 });
$$('video[data-auto]').forEach((v) => vio.observe(v));

// ---------- botão fixo: aparece depois do topo e some no final ----------
const dock = $('#dock');
if (dock) {
  const seen = { hero: true, final: false, foot: false };
  const upd = () => dock.classList.toggle('is-on', !seen.hero && !seen.final && !seen.foot);
  const dio = new IntersectionObserver((entries) => {
    entries.forEach((e) => { seen[e.target.dataset.dock] = e.isIntersecting; });
    upd();
  }, { threshold: 0 });
  [['#topo', 'hero'], ['#final', 'final'], ['.foot', 'foot']].forEach(([s, k]) => { const el = $(s); if (el) { el.dataset.dock = k; dio.observe(el); } });
}

// ---------- a conta ----------
const TICKETS = [20, 30, 50, 80, 100, 150, 200, 300, 500, 800, 1000, 2000];
const calc = { pw: 3, tk: 2 };
const brl = (v) => `R$ ${Math.round(v).toLocaleString('pt-BR')}`;
const yearEl = $('#calc-year');
const monthEl = $('#calc-month');
let shown = 0;
let raf = 0;
function updateCalc() {
  const ticket = TICKETS[calc.tk];
  $('#calc-pw').textContent = String(calc.pw);
  $('#calc-tk').textContent = brl(ticket);
  const year = calc.pw * ticket * 52;
  monthEl.textContent = brl(year / 12);
  cancelAnimationFrame(raf);
  if (reduced) { shown = year; yearEl.textContent = brl(year); return; }
  const from = shown; const t0 = performance.now();
  const tick = (t) => {
    const p = Math.min(1, (t - t0) / 420);
    shown = from + (year - from) * (1 - Math.pow(1 - p, 3));
    yearEl.textContent = brl(shown);
    if (p < 1) raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);
}
if (yearEl) {
  $$('.step button').forEach((b) => b.addEventListener('click', () => {
    const k = b.dataset.k; const d = Number(b.dataset.d);
    if (k === 'pw') calc.pw = Math.min(30, Math.max(1, calc.pw + d));
    else calc.tk = Math.min(TICKETS.length - 1, Math.max(0, calc.tk + d));
    updateCalc();
  }));
  shown = calc.pw * TICKETS[calc.tk] * 52;
  updateCalc();
}

// ---------- projetos no ar ----------
const PROJECTS = [
  { id: 'mitte', name: 'Mitte', url: 'https://mittebar.vercel.app/' },
  { id: 'burger', name: 'Hamburgueria do Gui', url: 'https://testeburguerking.lovable.app/' },
  { id: 'bolsa', name: 'Bolsa & Verso', url: 'https://bolsaeverso.lovable.app/' },
  { id: 'echofi', name: 'Echofi', url: 'https://echofi-bp.webflow.io/' },
];
const tabs = $('#work-tabs');
const wv = $('#work-video');
const wl = $('#work-link');
if (tabs && wv) {
  let cur = 0; let auto = true; let timer = 0; let visible = false;
  tabs.innerHTML = PROJECTS.map((p, i) => `<button type="button" class="work__tab" role="tab" aria-selected="${i === 0}">${p.name}</button>`).join('');
  const btns = $$('.work__tab', tabs);
  const show = (i) => {
    cur = i;
    btns.forEach((b, j) => b.setAttribute('aria-selected', String(j === i)));
    const p = PROJECTS[i];
    wv.poster = `/videos/${p.id}-m.webp`;
    wv.querySelector('source').src = `/videos/${p.id}-m.mp4`;
    wv.load();
    if (visible && !reduced) wv.play().catch(() => {});
    wl.href = p.url;
  };
  const schedule = () => { clearTimeout(timer); if (auto && visible) timer = setTimeout(() => { show((cur + 1) % PROJECTS.length); schedule(); }, 6500); };
  btns.forEach((b, i) => b.addEventListener('click', () => { auto = false; clearTimeout(timer); show(i); }));
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) schedule(); else clearTimeout(timer); }, { threshold: 0.3 }).observe(wv);
}

// ---------- conversa no WhatsApp (toca quando aparece) ----------
const CHAT = [
  { who: 'me', text: 'Oi! Quero ver como fica o site do meu negócio. Hamburgueria do Gui, @hamburgueriadogui', time: '09:12' },
  { who: 'them', text: 'Fechado! Em até 48h te mando aqui o link pra você ver.', time: '09:13', typing: 1100 },
  { div: 'no dia seguinte' },
  { who: 'them', link: true, text: 'Tá aqui o seu. Olha com calma.', time: '18:30', typing: 1000 },
  { who: 'me', text: 'Gente!! Ficou a nossa cara.', time: '18:41', typing: 800 },
  { who: 'me', text: 'Quanto fica pra colocar no ar?', time: '18:41', typing: 700 },
  { who: 'them', text: 'Te mando agora, por escrito.', time: '18:42', typing: 800 },
];
const body = $('#chat-body');
const chatPhone = $('#chat-phone');
if (body && chatPhone) {
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  let run = 0; let inView = false; let playing = false;
  const bubble = (m) => {
    const li = document.createElement('li');
    if (m.div) { li.className = 'msg msg--div is-in'; li.textContent = m.div; return li; }
    li.className = `msg msg--${m.who}`;
    const link = m.link ? '<span class="lk"><img src="/videos/burger-m.webp" alt="" width="480" height="1038" /><span><b>Hamburgueria do Gui</b><i>hamburgueriadogui.com.br</i></span></span>' : '';
    li.innerHTML = `${link}${m.text}<time>${m.time}</time>`;
    return li;
  };
  const play = async () => {
    const id = ++run; playing = true;
    body.innerHTML = '';
    for (const m of CHAT) {
      if (id !== run) return;
      if (m.typing && !reduced) {
        const t = document.createElement('li');
        t.className = `typing${m.who === 'me' ? ' typing--me' : ''}`;
        t.setAttribute('aria-hidden', 'true');
        t.innerHTML = '<i></i><i></i><i></i>';
        body.appendChild(t);
        await wait(m.typing);
        t.remove();
      }
      const b = bubble(m);
      body.appendChild(b);
      if (reduced) b.classList.add('is-in'); else requestAnimationFrame(() => requestAnimationFrame(() => b.classList.add('is-in')));
      await wait(reduced ? 0 : (m.div ? 800 : 700));
    }
    await wait(5000);
    playing = false;
    if (id === run && inView) play();
  };
  new IntersectionObserver(([e]) => {
    inView = e.isIntersecting;
    if (inView && !playing) play();
  }, { threshold: 0.4 }).observe(chatPhone);
}
