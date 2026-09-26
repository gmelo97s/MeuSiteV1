// Conversa simulada de WhatsApp: toca sozinha quando aparece na tela.
import { reduced } from './motion.js';
import { store } from './store.js';
import { coverOf } from './data.js';

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

function script(d) {
  const first = d.hasName
    ? `Oi! Vi o site e quero um desses. Meu negócio se chama ${d.nm}. Como funciona?`
    : 'Oi! Vi o site e quero um desses pro meu negócio. Como funciona?';
  const aw = coverOf(d.k);
  return [
    { who: 'me', html: esc(first), time: '09:12' },
    { who: 'them', html: 'Oi! É simples: me conta o que você faz, como atende e onde fica. Pode ser por áudio mesmo.', time: '09:14', typing: 1200 },
    { who: 'me', audio: '0:47', time: '09:15', typing: 900 },
    { who: 'them', html: 'Anotado! Em poucos dias te mando o link pra você ver funcionando. Aí você decide.', time: '09:16', typing: 1100 },
    { divider: 'alguns dias depois' },
    {
      who: 'them', time: '18:30', typing: 900,
      html: `<span class="lk" style="--a:${d.k.a};--aw:${aw}"><span class="lk__aw" style="display:block"></span><span class="lk__in" style="display:block"><span class="lk__name" style="display:block">${esc(d.signName)}</span><span class="lk__url">${esc(d.slug)}.com.br</span></span></span>Tá aqui o seu site. Olha com calma.`,
      link: true,
    },
    { who: 'me', html: 'Gente!! Ficou a nossa cara.', time: '18:41', typing: 800 },
    { who: 'me', html: 'E se eu precisar mudar o horário depois?', time: '18:41', typing: 700 },
    { who: 'them', html: 'Manda um áudio.', time: '18:42', typing: 700 },
  ];
}

const WAVE = [6, 10, 16, 9, 20, 14, 8, 18, 12, 22, 10, 7, 15, 19, 11, 8, 13, 17, 9, 6];

function bubble(m) {
  const li = document.createElement('li');
  if (m.divider) {
    li.className = 'msg msg--divider';
    li.textContent = m.divider;
    return li;
  }
  li.className = `msg msg--${m.who}${m.audio ? ' msg--audio' : ''}${m.link ? ' msg--link' : ''}`;
  if (m.audio) {
    li.innerHTML = `<span class="play"><svg class="ico" aria-hidden="true"><use href="#i-play"/></svg></span><span class="wave" aria-hidden="true">${WAVE.map((h) => `<i style="height:${h}px"></i>`).join('')}</span><span class="sr-only">Áudio de ${m.audio}</span><time>${m.audio}</time>`;
  } else {
    li.innerHTML = `${m.html}<time>${m.time}</time>`;
  }
  return li;
}

export function initChat() {
  const body = document.getElementById('chat-body');
  const phone = document.getElementById('chat-phone');
  const replay = document.getElementById('chat-replay');
  if (!body) return;
  let run = 0;

  const play = async () => {
    const id = ++run;
    body.innerHTML = '';
    const items = script(store.get());
    if (reduced) {
      items.forEach((m) => { const b = bubble(m); b.classList.add('is-in'); body.appendChild(b); });
      return;
    }
    for (const m of items) {
      if (id !== run) return;
      if (m.typing) {
        const t = document.createElement('li');
        t.className = `typing${m.who === 'me' ? ' typing--me' : ''}`;
        t.setAttribute('aria-hidden', 'true');
        t.innerHTML = '<i></i><i></i><i></i>';
        body.appendChild(t);
        await wait(m.typing);
        t.remove();
        if (id !== run) return;
      }
      const b = bubble(m);
      body.appendChild(b);
      requestAnimationFrame(() => b.classList.add('is-in'));
      await wait(m.divider ? 900 : 650);
    }
  };

  let played = false;
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting && !played) { played = true; play(); }
  }, { threshold: 0.45 }).observe(phone);
  replay.addEventListener('click', play);
}
