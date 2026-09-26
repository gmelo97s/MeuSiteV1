// Estado da personalização: o nome digitado no hero passa a aparecer no site inteiro.
import { CONTACT, kindById, detectKind, slugify } from './data.js';

const state = { name: '', pick: null, lit: false };
const subs = new Set();

function derive() {
  const nm = state.name.replace(/\s+/g, ' ').trim();
  const detected = detectKind(nm);
  const kindId = state.pick || detected || 'outro';
  const k = kindById(kindId);
  const knowsKind = Boolean(state.pick || detected) && kindId !== 'outro';
  return {
    ...state,
    nm,
    hasName: nm.length > 0,
    kindId,
    k,
    signName: nm || 'Seu Negócio',
    slug: slugify(nm) || 'seunegocio',
    siteName: nm ? `Site ${nm}` : 'O site do seu negócio',
    searchLine: knowsKind ? k.search : 'aberto agora perto de mim',
    kindShow: k.show,
    kindVerb: k.verb,
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

const MESSAGES = {
  default: (nm) => nm
    ? `Oi, ${CONTACT.person}! Vim pelo site da ${CONTACT.brand}. Meu negócio se chama ${nm} e quero um site pra ser encontrado.`
    : `Oi, ${CONTACT.person}! Vim pelo site da ${CONTACT.brand} e quero um site pra ser encontrado.`,
  price: (nm) => `Oi, ${CONTACT.person}! Quanto custa um site pro meu negócio${nm ? ` (${nm})` : ''}?`,
  search: (nm) => `Oi, ${CONTACT.person}! Vi a simulação de busca no seu site${nm ? ` com o nome ${nm}` : ''}. Quero aparecer quando me procurarem.`,
  preview: (nm) => `Oi, ${CONTACT.person}! Quero uma prévia grátis do site ${nm ? `da ${nm}` : 'do meu negócio'}.`,
};
MESSAGES.lit = MESSAGES.default;
MESSAGES.final = MESSAGES.default;

export function waLink(kind = 'default', nm = store.get().nm) {
  const msg = (MESSAGES[kind] || MESSAGES.default)(nm);
  return `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(msg)}`;
}

// Liga [data-bind] e [data-wa] ao estado.
export function bindDom() {
  const today = new Date();
  document.querySelectorAll('[data-bind="today"]').forEach((el) => { el.textContent = today.toLocaleDateString('pt-BR'); });
  document.querySelectorAll('[data-bind="year"]').forEach((el) => { el.textContent = String(today.getFullYear()); });

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
