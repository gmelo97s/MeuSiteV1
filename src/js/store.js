// Estado da personalização: o nome digitado no hero passa a aparecer no site inteiro.
import { CONTACT, kindById, detectKind, slugify } from './data.js';

const state = { name: '' };
const subs = new Set();

function derive() {
  const nm = state.name.replace(/\s+/g, ' ').trim();
  const detected = detectKind(nm);
  const kindId = detected || 'outro';
  const k = kindById(kindId);
  return {
    ...state,
    nm,
    hasName: nm.length > 0,
    kindId,
    k,
    signName: nm || 'Seu Negócio',
    slug: slugify(nm) || 'seunegocio',
    searchLine: detected ? k.search : 'aberto agora perto de mim',
    kindShow: k.show,
    phone: CONTACT.phoneLabel,
    igLabel: `@${CONTACT.instagram}`,
  };
}

export const store = {
  get: derive,
  set(patch) {
    Object.assign(state, patch);
    const d = derive();
    subs.forEach((fn) => fn(d));
  },
  on(fn) {
    subs.add(fn);
    fn(derive());
    return () => subs.delete(fn);
  },
};

const hi = `Oi, ${CONTACT.person}!`;
const MESSAGES = {
  default: (nm) => (nm
    ? `${hi} Vim pelo site da ${CONTACT.brand}. Meu negócio se chama ${nm} e quero um site.`
    : `${hi} Vim pelo site da ${CONTACT.brand} e quero um site pro meu negócio.`),
  price: (nm) => `${hi} Quanto custa um site pro meu negócio${nm ? ` (${nm})` : ''}?`,
  search: (nm) => `${hi} Fiz a simulação de busca no site da ${CONTACT.brand}${nm ? ` com o nome ${nm}` : ''}. Quero aparecer quando me procurarem.`,
  preview: (nm) => `${hi} Quero uma prévia grátis do site ${nm ? `da ${nm}` : 'do meu negócio'}.`,
  video: (nm) => `${hi} Vi o vídeo da ${CONTACT.brand} e quero vídeos assim pro meu negócio${nm ? ` (${nm})` : ''}.`,
};
MESSAGES.final = MESSAGES.default;

export function waLink(kind = 'default', nm = store.get().nm) {
  const msg = (MESSAGES[kind] || MESSAGES.default)(nm);
  return `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(msg)}`;
}

// Liga [data-bind], [data-wa] e [data-ig] ao estado.
export function bindDom() {
  const today = new Date();
  document.querySelectorAll('[data-bind="today"]').forEach((el) => { el.textContent = today.toLocaleDateString('pt-BR'); });
  document.querySelectorAll('[data-bind="year"]').forEach((el) => { el.textContent = String(today.getFullYear()); });
  document.querySelectorAll('[data-ig]').forEach((a) => { a.href = `https://instagram.com/${CONTACT.instagram}`; });

  const binds = [...document.querySelectorAll('[data-bind]')].filter((el) => !['today', 'year'].includes(el.dataset.bind));
  const links = [...document.querySelectorAll('[data-wa]')];
  store.on((d) => {
    binds.forEach((el) => {
      const v = d[el.dataset.bind];
      if (v != null && el.textContent !== v) el.textContent = v;
    });
    links.forEach((a) => { a.href = waLink(a.dataset.wa, d.nm); });
  });
}
