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
//   match = palavras do nome digitado que trazem este card para o centro.
export const PROJECTS = [
  {
    id: 'echofi', name: 'Echofi', type: 'Landing page de app de música',
    url: 'https://echofi-bp.webflow.io/', accent: '#FF4A1C',
    hero: { photo: '/img/hero/echofi.webp', fit: 'cover', pos: '50% 22%', bg: '#1a0905', caption: 'Echofi. Landing page de app de música.' },
    match: /music|musica|\bapp\b|aplicativo|startup|tecnolog|software|saas|digital|produtora|estudio|podcast|\bdj\b|banda|streaming|plataforma|evento/,
  },
  {
    id: 'burger', name: 'Hamburgueria do Gui', type: 'Cardápio com pedido pra retirada e delivery',
    url: 'https://testeburguerking.lovable.app/', accent: '#E4432D',
    hero: { photo: '/img/hero/burger.webp', fit: 'contain', cut: true, pos: '50% 38%', bg: '#E4432D', caption: 'Hamburgueria do Gui. Pedido na retirada e no delivery.' },
    match: /hamburg|burger|lanch|restaur|pizz|comida|cozinha|marmit|pastel|churras|sushi|espeto|acai|sorvet|padaria|confeit|doce|bolo|cafe/,
  },
  {
    id: 'mitte', name: 'Mitte', type: 'Agenda de aniversários para bar',
    url: 'https://mittebar.vercel.app/', accent: '#FF3EA5',
    hero: { photo: '/img/hero/mitte.webp', fit: 'cover', pos: '50% 50%', bg: '#10202a', caption: 'Mitte. Agenda de aniversários do bar.' },
    match: /\bbar\b|boteco|buteco|chopp|adega|cervej|drink|pub\b|choperia|festa|aniversar|balada|buffet|casa de show|boate/,
  },
  {
    id: 'bolsa', name: 'Bolsa & Verso', type: 'Loja de bolsas com pedido pelo WhatsApp',
    url: 'https://bolsaeverso.lovable.app/', accent: '#C9A27A',
    hero: { photo: '/img/hero/bolsa.webp', fit: 'contain', tone: 'light', pos: '50% 45%', bg: '#EFE4D6', caption: 'Bolsa & Verso. Loja de bolsas com pedido no WhatsApp.' },
    match: /loja|bolsa|moda|roupa|boutique|calcad|sapat|acessor|joia|otica|presente|brecho|perfum|cosmet|store|shop/,
  },
];

// Qual projeto do hero combina com o nome digitado (ou null).
export function projectForName(name) {
  const s = String(name || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  if (!s.trim()) return null;
  return PROJECTS.find((p) => p.match.test(s)) || null;
}
