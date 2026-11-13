// Conteúdo que alimenta as partes interativas do site.
// A copy fixa fica no index.html; aqui ficam os dados que o JS monta ou personaliza.

export const CONTACT = {
  brand: 'CODEM',
  person: 'Guilherme',
  whatsapp: '5511937654207',
  phoneLabel: '(11) 93765-4207',
  // troque pelo @ da CODEM quando o perfil novo estiver no ar
  instagram: 'gmelo97s',
};

// Projetos no ar (vídeos gravados dos sites reais, em public/videos/).
// Cada projeto precisa de: card-<id> (hero), <id>-d (computador) e <id>-m (celular),
// em .webm, .mp4 e capa .webp. O roteiro pra gravar está no README.
export const PROJECTS = [
  {
    id: 'echofi', name: 'Echofi', type: 'Landing page de app de música',
    url: 'https://echofi-bp.webflow.io/', accent: '#FF4A1C',
    caption: 'Echofi. Landing page de app de música.',
  },
  {
    id: 'burger', name: 'Hamburgueria do Gui', type: 'Cardápio com pedido pra retirada e delivery',
    url: 'https://testeburguerking.lovable.app/', accent: '#E4432D',
    caption: 'Hamburgueria do Gui. Pedido na retirada e no delivery.',
  },
  {
    id: 'mitte', name: 'Mitte', type: 'Agenda de aniversários para bar',
    url: 'https://mittebar.vercel.app/', accent: '#FF3EA5',
    caption: 'Mitte. Agenda de aniversários do bar.',
  },
  {
    id: 'bolsa', name: 'Bolsa & Verso', type: 'Loja de bolsas com pedido pelo WhatsApp',
    url: 'https://bolsaeverso.lovable.app/', accent: '#C9A27A',
    caption: 'Bolsa & Verso. Loja de bolsas com pedido no WhatsApp.',
  },
];

// Ramos de negócio: cor do link de exemplo na conversa e a busca típica do cliente.
export const KINDS = [
  { id: 'saude', label: 'Saúde', a: '#23707A', search: 'dentista perto de mim', show: 'os tratamentos' },
  { id: 'escritorio', label: 'Escritório', a: '#27456B', search: 'advogado perto de mim', show: 'as áreas de atuação' },
  { id: 'beleza', label: 'Beleza', a: '#B3372B', search: 'barbearia agendar online', show: 'os serviços' },
  { id: 'treino', label: 'Treino', a: '#1F7A4D', search: 'personal trainer perto de mim', show: 'as modalidades' },
  { id: 'comida', label: 'Comida', a: '#C9722E', search: 'restaurante aberto agora', show: 'o cardápio' },
  { id: 'servicos', label: 'Serviços', a: '#B7791F', search: 'eletricista perto de mim', show: 'os serviços' },
  { id: 'loja', label: 'Loja', a: '#8A5A2E', search: 'loja perto de mim', show: 'os produtos' },
  { id: 'aulas', label: 'Aulas', a: '#5B3E96', search: 'aula particular de inglês', show: 'os cursos' },
  { id: 'outro', label: 'Outro', a: '#0A0A0A', search: 'o que você faz', show: 'os serviços' },
];

export const kindById = (id) => KINDS.find((k) => k.id === id) || KINDS[KINDS.length - 1];
export const coverOf = (k) => `linear-gradient(120deg,${k.a} 0%,color-mix(in srgb,${k.a} 60%,#000) 100%)`;

const norm = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

// Descobre o ramo pelo nome digitado ("Barbearia do Zé" → beleza).
export function detectKind(name) {
  const s = norm(name);
  if (!s) return null;
  if (/clinic|consult|odonto|dent|fisio|psic|nutri|medic|saude|terap|fono|derma|veterin|laborat|ortop|pediat|acupun|cardio|ginec|oftalm|enferm|farmac/.test(s)) return 'saude';
  if (/advoc|advog|juridic|contab|contador|escritor|consultor|assessor|imobili|corretor|arquitet|engenh|despach|seguro|financ|marketing|agencia|design|fotograf/.test(s)) return 'escritorio';
  if (/barb|salao|beleza|cabele|manicure|unha|estetica|sobrancelha|hair|nail|makeup|maquiag|tatu|spa\b|depila|cilios/.test(s)) return 'beleza';
  if (/personal|academia|pilates|crossfit|yoga|treino|fitness|luta|jiu|muay|funcional|danca|natacao|studio/.test(s)) return 'treino';
  if (/restaur|lanch|pizz|hamburg|burger|cozinha|churras|sushi|temak|marmit|comida|espeto|bistr|pastel|acai|sorvet|\bbar\b|boteco|buteco|chopp|adega|grill|cantina|trattoria|\bcafe\b|padaria|confeit|doceria|doces|bolo|buffet/.test(s)) return 'comida';
  if (/eletric|encanad|reforma|pintor|pintura|pedreiro|marceneir|serralher|vidrac|oficina|mecanic|auto ?center|funilar|lava ?rapido|dedetiz|limpeza|faxin|jardin|chaveir|assistencia|conserto|manutenc|instalac|frete|mudanc|transport/.test(s)) return 'servicos';
  if (/escola|curso|aula|professor|idioma|ingles|reforco|colegio|ensino|mentoria|musica/.test(s)) return 'aulas';
  if (/loja|store|moda|boutique|\bpet|otica|papelaria|calcad|roupa|presente|floric|mercad|empori|acessor|brecho|joia|relog|celular|eletro|magazine|atelie|shop|armarinho|perfum|cosmet|livrar|brinqued|bolsa/.test(s)) return 'loja';
  return null;
}

// Simulação de busca do hero: o ramo no plural ("mostrando barbearias perto de você")
// e três concorrentes fictícios do mesmo ramo.
const CATEGORY = [
  [/barbear/, 'barbearias'], [/salao|cabele/, 'salões de beleza'], [/estetica|sobrancelha|manicure|unha|nail/, 'estúdios de beleza'],
  [/padaria|panific/, 'padarias'], [/confeit|doceria|doces|bolo/, 'docerias'], [/pizz/, 'pizzarias'], [/hamburg|burger/, 'hamburguerias'],
  [/lanch/, 'lanchonetes'], [/\bbar\b|boteco|buteco|chopp|adega/, 'bares'], [/cafeteria|\bcafe\b/, 'cafeterias'], [/acai|sorvet/, 'açaiterias'],
  [/restaur|cantina|bistr|comida|marmit/, 'restaurantes'], [/odonto|dent/, 'dentistas'], [/clinic|consult|saude|medic/, 'clínicas'],
  [/fisio/, 'fisioterapeutas'], [/psic/, 'psicólogos'], [/nutri/, 'nutricionistas'], [/veterin|\bpet/, 'pet shops e veterinários'],
  [/advoc|advog|juridic/, 'escritórios de advocacia'], [/contab|contador/, 'contadores'], [/imobili|corretor/, 'imobiliárias'],
  [/arquitet/, 'arquitetos'], [/academia|crossfit|fitness/, 'academias'], [/personal/, 'personal trainers'], [/pilates|yoga/, 'estúdios de pilates'],
  [/oficina|mecanic|auto ?center|funilar/, 'oficinas'], [/eletric/, 'eletricistas'], [/encanad/, 'encanadores'], [/reforma|pedreiro|pintor|constru/, 'empresas de reforma'],
  [/escola|colegio|ensino/, 'escolas'], [/curso|aula|professor|idioma|ingles/, 'cursos'], [/otica/, 'óticas'], [/farmac/, 'farmácias'],
  [/floric/, 'floriculturas'], [/mercad|empori/, 'mercados'], [/loja|store|moda|boutique|roupa|shop/, 'lojas'],
];
const KIND_PLURAL = {
  saude: 'clínicas', escritorio: 'escritórios', beleza: 'salões e barbearias', treino: 'academias e estúdios', comida: 'restaurantes',
  servicos: 'prestadores de serviço', loja: 'lojas', aulas: 'escolas e cursos', outro: 'negócios parecidos',
};
const RIVAL_NAMES = {
  saude: ['Clínica Sorriso Vivo', 'OdontoCenter Plus', 'Espaço Bem-Estar'],
  escritorio: ['Almeida & Rocha Advogados', 'Contábil Prime', 'Martins Consultoria'],
  beleza: ['Barbearia Central', 'Studio Navalha', 'Espaço Bella'],
  treino: ['Move Studio', 'Fit Center 24h', 'Pilates Equilíbrio'],
  comida: ['Cantina da Praça', 'Burger House', 'Forno a Lenha'],
  servicos: ['Reforma Já', 'Elétrica Rápida', 'Casa & Conserto'],
  loja: ['Loja Aurora', 'Empório Central', 'Ateliê Norte'],
  aulas: ['Escola Horizonte', 'Inglês Já', 'Instituto Saber'],
  outro: ['Concorrente com site', 'Outro concorrente', 'Mais um concorrente'],
};
const RIVAL_BY_WORD = [
  [/\bbar\b|boteco|buteco|chopp|adega/, ['Bar do Centro', 'Boteco da Esquina', 'Choperia Real']],
  [/pizz/, ['Pizzaria Bella Napoli', 'Forno a Lenha', 'Pizza da Vila']],
  [/padaria|panific/, ['Padaria Estrela', 'Pão Quente', 'Panificadora Central']],
  [/\bpet|veterin/, ['Pet Feliz', 'Clínica Vet Amigo', 'Mundo Pet']],
  [/oficina|mecanic|auto ?center/, ['Auto Center Silva', 'Oficina do Bairro', 'Mecânica Rápida']],
];
const RIVAL_META = [
  { rate: '4,9', n: '1,2 mil', tags: ['Site', 'WhatsApp', 'Rota'], open: 'Aberto agora' },
  { rate: '4,8', n: '318', tags: ['Site', 'Fotos', 'Preços'], open: 'Aberto agora' },
  { rate: '4,7', n: '96', tags: ['Site', 'Agendar'], open: 'Fecha às 22h' },
];

export function searchFor(name) {
  const s = norm(name);
  const kind = detectKind(name) || 'outro';
  const plural = (CATEGORY.find(([re]) => re.test(s)) || [])[1] || KIND_PLURAL[kind];
  const names = (RIVAL_BY_WORD.find(([re]) => re.test(s)) || [])[1] || RIVAL_NAMES[kind];
  return { plural, rivals: names.map((nm, i) => ({ name: nm, ...RIVAL_META[i] })) };
}

export const slugify = (s) => norm(s).replace(/[^a-z0-9]+/g, '').slice(0, 28);
