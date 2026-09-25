// Conteúdo que alimenta as partes interativas do site.
// A copy fixa fica no index.html; aqui ficam os dados que o JS monta ou personaliza.

export const CONTACT = {
  brand: 'Origem Digital',
  person: 'Guilherme',
  whatsapp: '5511937654207',
  phoneLabel: '(11) 93765-4207',
  instagram: 'gmelo97s',
  email: 'guilherme21imp@gmail.com',
  city: 'Santo André · SP',
};

// Ramos de negócio: cores da vitrine ilustrada, textos do card e a busca típica do cliente.
export const KINDS = [
  {
    id: 'padaria', label: 'Padaria', demo: 'Padaria Estrela',
    sub: 'Pães · Bolos · Encomendas', a: '#C4462A', b: '#F6E9D2',
    action: 'Fazer encomenda', listT: 'Os mais pedidos',
    items: ['Pão na chapa', 'Bolo de fubá', 'Sonho de creme'], th: ['#E3B36A', '#D9A24B', '#F0D9A8'],
    night: 'Abrimos às 7h. Já deixa sua encomenda.', search: 'padaria perto de mim',
    show: 'o cardápio', verb: 'Anota encomenda',
  },
  {
    id: 'barbearia', label: 'Barbearia', demo: 'Barbearia Navalha',
    sub: 'Cabelo · Barba · Bigode', a: '#B3372B', b: '#F4EEE2',
    stripes: 'repeating-linear-gradient(135deg,#B3372B 0 10px,#F4EEE2 10px 20px,#27456B 20px 30px,#F4EEE2 30px 40px)',
    action: 'Agendar horário', listT: 'Serviços',
    items: ['Corte na tesoura', 'Barba na toalha quente', 'Pezinho e sobrancelha'], th: ['#27456B', '#B3372B', '#C9B79C'],
    night: 'Agenda de amanhã aberta. Escolha seu horário.', search: 'barbearia perto de mim',
    show: 'os cortes', verb: 'Agenda horário',
  },
  {
    id: 'salao', label: 'Salão', demo: 'Salão Bella',
    sub: 'Cabelo · Unhas · Beleza', a: '#B2557A', b: '#F8EAF0',
    action: 'Agendar horário', listT: 'Serviços',
    items: ['Corte e escova', 'Coloração', 'Mão e pé'], th: ['#B2557A', '#E2A7BD', '#8C6A5A'],
    night: 'Agenda de amanhã aberta. Reserve seu horário.', search: 'salão de beleza perto de mim',
    show: 'os serviços', verb: 'Agenda horário',
  },
  {
    id: 'restaurante', label: 'Restaurante', demo: 'Cantina da Praça',
    sub: 'Almoço · Porções · Delivery', a: '#2F6B4F', b: '#F2ECDD',
    action: 'Reservar mesa', listT: 'Hoje tem',
    items: ['Prato do dia', 'Porção da casa', 'Sobremesa'], th: ['#C9722E', '#2F6B4F', '#E8C27A'],
    night: 'Cozinha fechada. Reserve a mesa de amanhã.', search: 'restaurante perto de mim',
    show: 'o cardápio', verb: 'Recebe reserva',
  },
  {
    id: 'clinica', label: 'Clínica', demo: 'Clínica Bem-Estar',
    sub: 'Cuidado de perto', a: '#23707A', b: '#E7F1EF',
    action: 'Marcar consulta', listT: 'Atendimentos',
    items: ['Avaliação', 'Tratamentos', 'Convênios aceitos'], th: ['#23707A', '#8FC1C0', '#D8CDBB'],
    night: 'Marque sua consulta sem precisar ligar.', search: 'clínica perto de mim',
    show: 'os tratamentos', verb: 'Marca consulta',
  },
  {
    id: 'loja', label: 'Loja', demo: 'Loja Aurora',
    sub: 'Novidades toda semana', a: '#B7791F', b: '#F7EDD6',
    action: 'Pedir pelo WhatsApp', listT: 'Na vitrine',
    items: ['Novidades', 'Mais vendidos', 'Retire na loja'], th: ['#B7791F', '#3E6A7A', '#E7C98F'],
    night: 'Loja fechada, vitrine aberta. Separe o seu.', search: 'loja perto de mim',
    show: 'os produtos', verb: 'Separa pedido',
  },
  {
    id: 'outro', label: 'Outro', demo: 'Seu Negócio',
    sub: 'Aqui no seu bairro', a: '#8A5A2E', b: '#F4EADB',
    action: 'Pedir orçamento', listT: 'O que fazemos',
    items: ['Serviços', 'Como funciona', 'Orçamento sem compromisso'], th: ['#8A5A2E', '#C9A77A', '#5E7A52'],
    night: 'Fechado agora. Deixe sua mensagem e respondemos cedo.', search: 'aberto agora perto de mim',
    show: 'os serviços', verb: 'Recebe pedido',
  },
];

export const kindById = (id) => KINDS.find((k) => k.id === id) || KINDS[KINDS.length - 1];

const norm = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

// Descobre o ramo pelo nome digitado ("Barbearia do Zé" → barbearia).
export function detectKind(name) {
  const s = norm(name);
  if (!s) return null;
  if (/barb/.test(s)) return 'barbearia';
  if (/salao|beleza|cabele|manicure|unha|estetica|sobrancelha|hair|nail|makeup|maquiag/.test(s)) return 'salao';
  if (/padaria|panific|confeit|doceria|doces|bolo|\bpao\b|\bpaes\b|cafeteria|biscoit/.test(s)) return 'padaria';
  if (/clinic|consult|odonto|dent|fisio|psic|nutri|medic|saude|terap|pilates|fono|derma|veterin|laborat|ortop|pediat|acupun/.test(s)) return 'clinica';
  if (/restaur|lanch|pizz|hamburg|burger|cozinha|churras|sushi|temak|marmit|comida|espeto|bistr|pastel|acai|sorvet|\bbar\b|boteco|buteco|chopp|adega|grill|cantina|trattoria|\bcafe\b/.test(s)) return 'restaurante';
  if (/loja|store|moda|boutique|\bpet|otica|papelaria|calcad|roupa|presente|floric|mercad|empori|acessor|brecho|joia|relog|celular|eletro|magazine|atelie|shop|armarinho|perfum|cosmet|livrar|brinqued|bolsa/.test(s)) return 'loja';
  return null;
}

export const slugify = (s) => norm(s).replace(/[^a-z0-9]+/g, '').slice(0, 28);

// Um dia comum na vida do próximo cliente.
export const MOMENTS = [
  {
    time: '07h12', clock: '07:12', kind: 'padaria', bg: '#F8C66A', ink: '#1A120A',
    who: 'Sílvia está no ponto de ônibus e lembra que o aniversário da sogra é sábado. Pesquisa ali mesmo, com uma mão só.',
    query: 'bolo de aniversário sob encomenda', lesson: 'Encomenda de quem aparecer primeiro, com foto.',
  },
  {
    time: '12h40', clock: '12:40', kind: 'restaurante', bg: '#FBCC2F', ink: '#1A120A',
    who: 'Rodrigo tem cinquenta minutos de almoço. Abre o mapa, compara três lugares e escolhe o que mostra o prato e o preço.',
    query: 'almoço perto de mim', lesson: 'Ninguém entra pra perguntar o preço. Olha antes.',
  },
  {
    time: '18h05', clock: '18:05', kind: 'clinica', bg: '#EC5F24', ink: '#1A120A',
    who: 'Dona Lurdes quer saber se a clínica atende no feriado. Ligar? Ninguém mais liga. Procura o horário. Não achou, marcou em outra.',
    query: 'fisioterapia atende feriado', lesson: 'O que não está no celular, não existe.',
  },
  {
    time: '23h47', clock: '23:47', kind: 'barbearia', bg: '#0F0B08', ink: '#F6ECDF',
    who: 'Paulo não consegue dormir e resolve, finalmente, cortar o cabelo amanhã cedo. Marca onde dá pra marcar sem falar com ninguém.',
    query: 'barbearia agendar online', lesson: 'O cliente da madrugada é o mais decidido.',
  },
];

// Projetos no ar (vídeos gravados dos sites reais).
export const PROJECTS = [
  {
    id: 'burger', name: 'Hamburgueria do Gui', type: 'Cardápio com pedido pra retirada e delivery',
    url: 'https://testeburguerking.lovable.app/', domain: 'testeburguerking.lovable.app', accent: '#E4432D',
  },
  {
    id: 'supra', name: 'Supra Bar', type: 'Cardápio digital e ambiente · Vila Madalena',
    url: 'https://cardapio-supra-vila-madalena.lovable.app/', domain: 'cardapio-supra-vila-madalena.lovable.app', accent: '#FF6A1A',
  },
  {
    id: 'mitte', name: 'Mitte', type: 'Agenda de aniversários para bar',
    url: 'https://mittebar.vercel.app/', domain: 'mittebar.vercel.app', accent: '#FF3EA5',
  },
  {
    id: 'bolsa', name: 'Bolsa & Verso', type: 'Loja de bolsas com pedido pelo WhatsApp',
    url: 'https://bolsaeverso.lovable.app/', domain: 'bolsaeverso.lovable.app', accent: '#C9A27A',
  },
];
