// Conteúdo que alimenta as partes interativas do site.
// A copy fixa fica no index.html; aqui ficam os dados que o JS monta ou personaliza.

export const CONTACT = {
  brand: 'Origem Digital',
  person: 'Guilherme',
  whatsapp: '5511937654207',
  phoneLabel: '(11) 93765-4207',
  instagram: 'gmelo97s',
};

// Ramos de negócio: cor do card de exemplo, textos e a busca típica do cliente.
export const KINDS = [
  {
    id: 'saude', label: 'Saúde', demo: 'Clínica Sorriso',
    a: '#23707A', b: '#E7F1EF', th: ['#23707A', '#8FC1C0', '#D8CDBB'],
    search: 'dentista perto de mim', show: 'os tratamentos', verb: 'Marca consulta',
  },
  {
    id: 'escritorio', label: 'Escritório', demo: 'Almeida Advocacia',
    a: '#27456B', b: '#EEF1F6', th: ['#27456B', '#9FB2CC', '#C9B79C'],
    search: 'advogado perto de mim', show: 'as áreas de atuação', verb: 'Agenda conversa',
  },
  {
    id: 'beleza', label: 'Beleza', demo: 'Studio Navalha',
    a: '#B3372B', b: '#F4EEE2', th: ['#B3372B', '#E2A7BD', '#27456B'],
    search: 'barbearia agendar online', show: 'os serviços', verb: 'Agenda horário',
  },
  {
    id: 'treino', label: 'Treino', demo: 'Move Studio',
    a: '#1F7A4D', b: '#E6F3EA', th: ['#1F7A4D', '#9ED3B2', '#2B2B2B'],
    search: 'personal trainer perto de mim', show: 'as modalidades', verb: 'Agenda aula',
  },
  {
    id: 'comida', label: 'Comida', demo: 'Cantina da Praça',
    a: '#C9722E', b: '#F2ECDD', th: ['#C9722E', '#2F6B4F', '#E8C27A'],
    search: 'restaurante aberto agora', show: 'o cardápio', verb: 'Recebe pedido',
  },
  {
    id: 'servicos', label: 'Serviços', demo: 'Reforma Já',
    a: '#B7791F', b: '#F7EDD6', th: ['#B7791F', '#3E6A7A', '#E7C98F'],
    search: 'eletricista perto de mim', show: 'os serviços', verb: 'Recebe orçamento',
  },
  {
    id: 'loja', label: 'Loja', demo: 'Loja Aurora',
    a: '#8A5A2E', b: '#F4EADB', th: ['#8A5A2E', '#C9A77A', '#5E7A52'],
    search: 'loja perto de mim', show: 'os produtos', verb: 'Separa pedido',
  },
  {
    id: 'aulas', label: 'Aulas', demo: 'Escola Horizonte',
    a: '#5B3E96', b: '#EFEAF7', th: ['#5B3E96', '#B7A6DA', '#E7C98F'],
    search: 'aula particular de inglês', show: 'os cursos', verb: 'Matricula aluno',
  },
  {
    id: 'outro', label: 'Outro', demo: 'Seu Negócio',
    a: '#8A5A2E', b: '#F4EADB', th: ['#8A5A2E', '#C9A77A', '#5E7A52'],
    search: 'o que você faz', show: 'os serviços', verb: 'Recebe pedido',
  },
];

// Faixa de cor do card de exemplo (substitui o toldo listrado).
export const coverOf = (k) => `linear-gradient(120deg,${k.a} 0%,color-mix(in srgb,${k.a} 60%,#000) 100%)`;

export const kindById = (id) => KINDS.find((k) => k.id === id) || KINDS[KINDS.length - 1];

const norm = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

// Descobre o ramo pelo nome digitado ("Barbearia do Zé" → barbearia).
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

// Simulação de busca do hero: como o negócio é chamado no plural ("mostrando barbearias perto de você")
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

// Um dia comum na vida do próximo cliente.
export const MOMENTS = [
  {
    time: '07h12', clock: '07:12', kind: 'saude', bg: '#F8C66A', ink: '#1A120A',
    who: 'Sílvia quebrou um dente no café da manhã. Ainda de pijama, procura quem atende hoje.',
    query: 'dentista atende hoje', lesson: 'Quem aparece primeiro, com horário, leva.',
  },
  {
    time: '12h40', clock: '12:40', kind: 'escritorio', bg: '#FBCC2F', ink: '#1A120A',
    who: 'Rodrigo precisa de um advogado. No intervalo do almoço, compara três e chama o que parece mais sério.',
    query: 'advogado trabalhista', lesson: 'Ninguém liga pra perguntar. Olha antes.',
  },
  {
    time: '18h05', clock: '18:05', kind: 'treino', bg: '#EC5F24', ink: '#1A120A',
    who: 'Carla decidiu que vai voltar a treinar. Quer ver o espaço, os horários e o preço antes de sair de casa.',
    query: 'personal trainer perto de mim', lesson: 'O que não está no celular, não existe.',
  },
  {
    time: '23h47', clock: '23:47', kind: 'beleza', bg: '#0F0B08', ink: '#F6ECDF',
    who: 'Paulo não consegue dormir e resolve marcar o corte de amanhã. Marca onde dá pra marcar sem falar com ninguém.',
    query: 'barbearia agendar online', lesson: 'O cliente da madrugada é o mais decidido.',
  },
];

// Projetos no ar (vídeos gravados dos sites reais).
// hero: foto real do projeto no card (Linktree), com o celular rodando o site por cima.
//   fit "cover" = foto preenchendo o card; "contain" = produto sobre a cor de fundo (bg).
//   cut = imagem recortada (ganha sombra); tone "light" = fundo claro (legenda escura).
export const PROJECTS = [
  {
    id: 'echofi', name: 'Echofi', type: 'Landing page de app de música',
    url: 'https://echofi-bp.webflow.io/', accent: '#FF4A1C',
    hero: { photo: '/img/hero/echofi.webp', fit: 'cover', pos: '50% 22%', bg: '#1a0905', caption: 'Echofi. Landing page de app de música.' },
  },
  {
    id: 'burger', name: 'Hamburgueria do Gui', type: 'Cardápio com pedido pra retirada e delivery',
    url: 'https://testeburguerking.lovable.app/', accent: '#E4432D',
    hero: { photo: '/img/hero/burger.webp', fit: 'contain', cut: true, pos: '50% 38%', bg: '#E4432D', caption: 'Hamburgueria do Gui. Pedido na retirada e no delivery.' },
  },
  {
    id: 'mitte', name: 'Mitte', type: 'Agenda de aniversários para bar',
    url: 'https://mittebar.vercel.app/', accent: '#FF3EA5',
    hero: { photo: '/img/hero/mitte.webp', fit: 'cover', pos: '50% 50%', bg: '#10202a', caption: 'Mitte. Agenda de aniversários do bar.' },
  },
  {
    id: 'bolsa', name: 'Bolsa & Verso', type: 'Loja de bolsas com pedido pelo WhatsApp',
    url: 'https://bolsaeverso.lovable.app/', accent: '#C9A27A',
    hero: { photo: '/img/hero/bolsa.webp', fit: 'contain', tone: 'light', pos: '50% 45%', bg: '#EFE4D6', caption: 'Bolsa & Verso. Loja de bolsas com pedido no WhatsApp.' },
  },
];
