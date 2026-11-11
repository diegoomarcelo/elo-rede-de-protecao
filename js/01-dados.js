/* =====================================================================
   01-dados.js
   Dados fictícios do protótipo: serviços, perfis, tipos de informação,
   casos, registro de acessos e credencial de teste.
   Este arquivo é carregado primeiro porque todos os outros dependem dele.
   ===================================================================== */


// Data "de hoje" fixa do protótipo (usada para calcular atrasos e datas)

const TODAY = '2026-11-10';

// ---------- Serviços da rede ----------
// Cada serviço tem nome, área, sistema que usa e contatos (fictícios).
// sei: o serviço já tramita encaminhamentos pelo SEI (configurável por serviço)
const SVC = {
  ubs:    {name:'UBS 1 Águas Claras', area:'Saúde', sys:'Prontuário e-SUS', sei:false,
           addr:'Rua 12 Norte, Águas Claras (fictício)', phone:'(61) 0000-1001', hours:'Seg a sex, 7h às 19h'},
  cmb:    {name:'Casa da Mulher Brasileira', area:'Atendimento especializado', sys:'Registro próprio', sei:false,
           addr:'Endereço fictício para o protótipo', phone:'(61) 0000-1002', hours:'Todos os dias, 24h'},
  comite: {name:'Comitê de Proteção à Mulher – Águas Claras', short:'Comitê de Águas Claras', area:'Articulação da rede local', sys:'SEI', sei:true,
           addr:'Administração Regional de Águas Claras (fictício)', phone:'(61) 0000-1003', hours:'Seg a sex, 9h às 17h'},
  deam:   {name:'DEAM', area:'Segurança pública', sys:'Sistema policial', sei:false,
           addr:'Endereço fictício para o protótipo', phone:'(61) 0000-1004', hours:'Todos os dias, 24h'},
  tj:     {name:'Juizado de Violência Doméstica', area:'Justiça', sys:'PJe', sei:false},
  def:    {name:'Defensoria Pública – Núcleo da Mulher', short:'Defensoria Pública', area:'Justiça', sys:'SEI', sei:true,
           addr:'Endereço fictício para o protótipo', phone:'(61) 0000-1005', hours:'Seg a sex, 12h às 18h'},
  creas:  {name:'CREAS Águas Claras', area:'Assistência social', sys:'Registro SUAS', sei:false,
           addr:'Quadra 301, Águas Claras (fictício)', phone:'(61) 0000-1006', hours:'Seg a sex, 8h às 18h'},
};
// Nome curto do serviço (usa `short` quando existir)
const sname = k => SVC[k].short || SVC[k].name;

// ---------- Perfis de acesso ----------
// kind: 'mulher' (atendida), 'prof' (profissional de um serviço) ou 'gestao'.
const ROLES = {
  mulher: {label:'Mariana', kind:'mulher', caseId:'C-0142'},
  cmb:    {label:'Casa da Mulher', kind:'prof', svc:'cmb', user:'Ana Souza', fn:'Psicóloga'},
  comite: {label:'Comitê Águas Claras', kind:'prof', svc:'comite', user:'Carla Nunes', fn:'Articuladora do comitê'},
  ubs:    {label:'UBS', kind:'prof', svc:'ubs', user:'Paula Lima', fn:'Enfermeira'},
  creas:  {label:'CREAS', kind:'prof', svc:'creas', user:'Lucas Pereira', fn:'Assistente social'},
  gestao: {label:'Gestão da rede', kind:'gestao', user:'Coordenação da rede'},
};

// ---------- Tipos de informação ----------
// Rótulos técnicos, usados na tela do profissional.
const KINDS = {
  contato: 'Contato seguro', relato: 'Resumo do relato já colhido', risco: 'Avaliação de risco (Fonar)',
  medida: 'Situação da medida protetiva', filhos: 'Filhos e dependentes', plano: 'Plano de acompanhamento', saude: 'Atendimento de saúde',
};
// As mesmas informações em palavras simples, para a mulher
const KINDS_HER = {
  contato: 'Como falar com você com segurança', relato: 'Um resumo do que você já contou', risco: 'A avaliação de risco feita com você',
  medida: 'Sua medida protetiva', filhos: 'Informações sobre seus filhos', plano: 'Seu plano de acompanhamento', saude: 'Que você foi atendida na saúde (sem detalhes médicos)',
};
// Perguntas que cada serviço precisa fazer por causa da própria função (repetição necessária)
const OWN = {
  creas:  ['Escuta técnica inicial do CREAS', 'Situação de renda e moradia para benefícios'],
  def:    ['Detalhes para a ação de guarda e pensão'],
  deam:   ['Depoimento formal para o registro da ocorrência'],
  cmb:    ['Acolhimento e escuta psicossocial'],
  ubs:    ['Avaliação clínica'],
  comite: ['Situação atual no território (moradia, rede de apoio)'],
  tj:     [],
};
// Avisos em linguagem simples, mostrados para a mulher no próximo passo
const OWN_HER = {
  creas: 'Eles vão fazer algumas perguntas sobre renda e moradia, porque precisam disso para ver benefícios.',
  def:   'Eles podem perguntar detalhes sobre guarda e pensão dos seus filhos.',
  deam:  'Na delegacia você precisa dar um depoimento formal. Isso faz parte do registro.',
  comite:'Eles podem perguntar como está sua situação hoje, para organizar o apoio perto de casa.',
};

// ---------- Casos (dados fictícios) ----------
// items  = informações registradas (quem registrou e quando)
// visits = por onde a mulher passou (linha do tempo)
// refs   = encaminhamentos entre serviços e sua situação
//          status: enviado → recebido → atendido → retorno
let CASES = [
 {id:'C-0142', name:'Mariana Costa', ref:'cmb', refUser:'Ana Souza', refFn:'psicóloga',
  items:[
   {id:'i1', kind:'contato', origin:'cmb', date:'2026-10-03', text:'Falar pelo telefone da irmã. Não ligar depois das 18h.'},
   {id:'i2', kind:'relato', origin:'cmb', date:'2026-10-03', text:'Violência psicológica e física recorrente pelo companheiro, há cerca de 2 anos. Relato completo no registro da Casa.'},
   {id:'i3', kind:'risco', origin:'cmb', date:'2026-10-03', text:'Risco elevado. Formulário aplicado no acolhimento.'},
   {id:'i4', kind:'medida', origin:'tj', date:'2026-10-10', text:'Deferida: afastamento do lar e proibição de contato.', alsoTo:['cmb','deam','comite']},
   {id:'i5', kind:'saude', origin:'ubs', date:'2026-10-02', text:'Atendimento realizado e notificação compulsória registrada. Detalhes clínicos ficam no prontuário.'},
   {id:'i6', kind:'plano', origin:'cmb', date:'2026-10-14', text:'Atendimento psicológico quinzenal; apoio para inclusão em benefício e acompanhamento jurídico.'},
   {id:'i7', kind:'filhos', origin:'cmb', date:'2026-10-03', text:'Dois filhos, 6 e 9 anos, matriculados em escola pública.'},
  ],
  visits:[
   {date:'2026-10-02', svc:'ubs', text:'Atendimento de saúde e notificação', her:'Você foi atendida na UBS.'},
   {date:'2026-10-03', svc:'cmb', text:'Acolhimento e avaliação de risco', her:'Você foi acolhida na Casa da Mulher Brasileira.'},
   {date:'2026-10-04', svc:'deam', text:'Registro de ocorrência e pedido de medida protetiva', her:'Você registrou a ocorrência na delegacia da mulher.'},
   {date:'2026-10-09', svc:'comite', text:'Reunião de acompanhamento do caso no território', her:'O Comitê de Águas Claras passou a acompanhar seu caso perto de casa.'},
   {date:'2026-10-10', svc:'tj', text:'Medida protetiva deferida', her:'A medida protetiva foi concedida pela Justiça.'},
   {date:'2026-10-14', svc:'cmb', text:'Atendimento psicológico de acompanhamento', her:'Você teve atendimento psicológico na Casa da Mulher.'},
   {date:'2026-10-22', svc:'def', text:'Orientação jurídica sobre guarda e pensão', her:'Você recebeu orientação na Defensoria Pública.'},
  ],
  refs:[
   {id:'r1', from:'ubs', to:'cmb', date:'2026-10-02', reason:'Acolhimento especializado após atendimento de saúde', shared:['i5'], status:'retorno', received:'2026-10-03', attended:'2026-10-03', feedback:'Acolhida realizada. Caso em acompanhamento pela Casa.', feedbackDate:'2026-10-06', ext:'Notificação no e-SUS'},
   {id:'r2', from:'cmb', to:'deam', date:'2026-10-03', reason:'Registro de ocorrência e pedido de medida protetiva', shared:['i1','i2','i3'], status:'atendido', received:'2026-10-03', attended:'2026-10-04', ext:'Fonar anexado ao pedido'},
   {id:'r5', from:'cmb', to:'comite', date:'2026-10-06', reason:'Acompanhamento do caso no território (Águas Claras)', shared:['i1','i3'], status:'retorno', received:'2026-10-07', attended:'2026-10-09', feedback:'Caso incluído no acompanhamento do Comitê. Encaminhado à Defensoria pelo SEI.', feedbackDate:'2026-10-09', ext:''},
   {id:'r3', from:'comite', to:'def', date:'2026-10-09', reason:'Orientação jurídica sobre guarda e pensão', shared:['i1','i7'], status:'atendido', received:'2026-10-13', attended:'2026-10-22', ext:'SEI 00401-00012345/2026-11'},
   {id:'r4', from:'cmb', to:'creas', date:'2026-10-15', reason:'Acompanhamento socioassistencial e inclusão em benefício', shared:['i1','i6','i7'], status:'enviado', ext:'',
    next:{when:'2026-11-12 14:00', bring:['Documento com foto','CPF','Comprovante de endereço, se tiver','Certidão de nascimento dos filhos']}},
  ]},
 {id:'C-0157', name:'Juliana Alves', ref:'cmb', refUser:'Ana Souza', refFn:'psicóloga',
  items:[
   {id:'i1', kind:'contato', origin:'cmb', date:'2026-10-28', text:'Celular próprio. Preferir mensagem antes de ligar.'},
   {id:'i2', kind:'risco', origin:'cmb', date:'2026-10-28', text:'Risco moderado.'},
   {id:'i3', kind:'plano', origin:'cmb', date:'2026-11-01', text:'Apoio para aluguel social e cadastro em programas de renda.'},
  ],
  visits:[{date:'2026-10-28', svc:'cmb', text:'Acolhimento e avaliação de risco', her:''}],
  refs:[{id:'r1', from:'cmb', to:'creas', date:'2026-11-03', reason:'Avaliação para aluguel social', shared:['i1','i3'], status:'enviado', ext:''}]},
 {id:'C-0163', name:'Renata Lopes', ref:'ubs', refUser:'Paula Lima', refFn:'enfermeira',
  items:[
   {id:'i1', kind:'saude', origin:'ubs', date:'2026-11-09', text:'Atendimento realizado e notificação registrada.'},
   {id:'i2', kind:'contato', origin:'ubs', date:'2026-11-09', text:'Contato pelo telefone do trabalho, em horário comercial.'},
   {id:'i3', kind:'relato', origin:'ubs', date:'2026-11-09', text:'Relata agressões do ex-companheiro após a separação. Detalhes no prontuário.'},
  ],
  visits:[{date:'2026-11-09', svc:'ubs', text:'Atendimento de saúde e notificação', her:''}],
  refs:[{id:'r1', from:'ubs', to:'cmb', date:'2026-11-09', reason:'Acolhimento especializado', shared:['i1','i2','i3'], status:'enviado', ext:'Notificação no e-SUS'}]},
 {id:'C-0170', name:'Sandra Reis', ref:'comite', refUser:'Carla Nunes', refFn:'articuladora',
  items:[
   {id:'i1', kind:'contato', origin:'comite', date:'2026-10-30', text:'Contato pela filha mais velha.'},
   {id:'i2', kind:'medida', origin:'tj', date:'2026-10-27', text:'Deferida: proibição de aproximação.', alsoTo:['comite']},
   {id:'i3', kind:'plano', origin:'comite', date:'2026-10-30', text:'Acompanhamento mensal pelo comitê; avaliar atendimento de saúde.'},
  ],
  visits:[{date:'2026-10-30', svc:'comite', text:'Reunião de acompanhamento', her:''}],
  refs:[
   {id:'r1', from:'comite', to:'def', date:'2026-10-31', reason:'Orientação sobre divórcio', shared:['i1'], status:'recebido', received:'2026-11-04', ext:'SEI 00401-00013377/2026-02'},
   {id:'r2', from:'comite', to:'ubs', date:'2026-11-06', reason:'Avaliação de saúde e acompanhamento', shared:['i1','i3'], status:'enviado', ext:''},
  ]},
 {id:'C-0151', name:'Beatriz Campos', ref:'cmb', refUser:'Ana Souza', refFn:'psicóloga',
  items:[
   {id:'i1', kind:'contato', origin:'cmb', date:'2026-10-18', text:'Contato pelo celular próprio.'},
   {id:'i2', kind:'relato', origin:'cmb', date:'2026-10-18', text:'Violência psicológica pelo ex-companheiro.'},
  ],
  visits:[{date:'2026-10-18', svc:'cmb', text:'Acolhimento', her:''},{date:'2026-10-22', svc:'ubs', text:'Consulta de saúde', her:''}],
  refs:[{id:'r1', from:'cmb', to:'ubs', date:'2026-10-20', reason:'Acompanhamento de saúde', shared:['i1'], status:'retorno', received:'2026-10-21', attended:'2026-10-22', feedback:'Consulta realizada, retorno marcado na UBS.', feedbackDate:'2026-10-23', ext:''}]},
];

// ---------- Registro de acessos (auditoria) ----------
// Toda consulta ou ação de um profissional entra aqui.
let AUDIT = [
 {at:'2026-10-02 10:40', case:'C-0142', svc:'ubs', who:'Paula Lima', act:'registrou atendimento'},
 {at:'2026-10-03 09:15', case:'C-0142', svc:'cmb', who:'Ana Souza', act:'confirmou o recebimento do encaminhamento da UBS'},
 {at:'2026-10-03 16:02', case:'C-0142', svc:'deam', who:'Agente Rocha', act:'consultou contato seguro, relato e avaliação de risco'},
 {at:'2026-10-07 10:12', case:'C-0142', svc:'comite', who:'Carla Nunes', act:'consultou contato seguro e avaliação de risco'},
 {at:'2026-10-13 11:30', case:'C-0142', svc:'def', who:'Dra. Mendes', act:'consultou contato seguro e dados dos filhos'},
 {at:'2026-10-15 14:20', case:'C-0142', svc:'cmb', who:'Ana Souza', act:'encaminhou para o CREAS'},
];

// Credencial de teste (só no protótipo; a versão real valida no servidor)
const TEST = {email:'teste@teste.com', pass:'123456'};
// Serviços que aparecem no login institucional
const ORGS = ['cmb','comite','ubs','creas','gestao'];
