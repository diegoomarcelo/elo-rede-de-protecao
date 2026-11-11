/* =====================================================================
   03-utilidades.js
   Funções auxiliares usadas por todas as telas: formatação de datas,
   escape de HTML, pílulas de status, permissões de visualização,
   registro de acessos e toast.
   ===================================================================== */


// ---------- utilidades ----------
// $       → atalho para document.querySelector
// esc     → escapa texto para inserir em HTML com segurança
// dm      → formata 'AAAA-MM-DD' como 'DD/MM'
// days    → quantos dias se passaram desde a data até TODAY
// now     → data e hora atual no formato do registro de acessos
const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const dm = d => d ? d.slice(8,10)+'/'+d.slice(5,7) : '';
const days = d => Math.round((new Date(TODAY) - new Date(d.slice(0,10))) / 864e5);
const now = () => TODAY + ' ' + new Date().toTimeString().slice(0,5);
// Busca um caso pelo ID
const caseById = id => CASES.find(c => c.id === id);
const viaSEI = r => SVC[r.from].sei && SVC[r.to].sei;   // os dois serviços já se falam pelo SEI
// Encaminhamento sem confirmação há mais de LATE dias é considerado atrasado
const LATE = 7;
// Dia da semana por extenso
const WEEK = ['domingo','segunda-feira','terça-feira','quarta-feira','quinta-feira','sexta-feira','sábado'];
const weekday = d => WEEK[new Date(d.slice(0,10)+'T12:00').getDay()];

// Texto de cada situação de encaminhamento (visão do profissional)
const STATUS = {enviado:'Aguardando confirmação', recebido:'Recebido', atendido:'Atendida no destino', retorno:'Retorno enviado'};
// Pílula colorida com a situação do encaminhamento (SEI, atrasado ou status normal)
function pill(r){
  if (viaSEI(r)) return `<span class="pill p-sei">No SEI · ${STATUS[r.status].toLowerCase()}</span>`;
  let cls = 'p-'+r.status, txt = STATUS[r.status];
  if (r.status === 'enviado' && days(r.date) > LATE){ cls = 'p-atrasado'; txt = `Sem confirmação há ${days(r.date)} dias`; }
  return `<span class="pill ${cls}">${txt}</span>`;
}
// Informações que um serviço pode ver: as que ele registrou, as enviadas
// diretamente para ele (alsoTo) e as compartilhadas nos encaminhamentos recebidos
function visibleItems(c, svc){
  return c.items.filter(i => i.origin === svc || (i.alsoTo||[]).includes(svc) ||
    c.refs.some(r => r.to === svc && r.shared.includes(i.id)));
}
// Adiciona uma linha ao registro de acessos
function log(caseId, svc, who, act){ AUDIT.push({at:now(), case:caseId, svc, who, act}); }
// Mostra uma mensagem temporária por 2,6 segundos
function toast(msg){ state.toast = msg; renderToast(); clearTimeout(toast.t); toast.t = setTimeout(()=>{state.toast=null;renderToast();}, 2600); }

// Preenche a área do usuário logado no cabeçalho
function renderWho(){
  if (!state.auth){ $('#who').innerHTML = ''; return; }
  const R = ROLES[state.role];
  const name = R.kind==='mulher' ? caseById(R.caseId).name.split(' ')[0] : R.user;
  const sub = R.kind==='mulher' ? 'Minha jornada' : R.kind==='gestao' ? 'Gestão da rede' : sname(R.svc);
  $('#who').innerHTML = `<span class="u"><b>${esc(name)}</b><small>${esc(sub)}</small></span><button class="btn small" data-act="logout">Sair</button>`;
}
