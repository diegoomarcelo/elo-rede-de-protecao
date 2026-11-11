/* =====================================================================
   12-eventos.js
   Eventos da interface: cliques, mudanças, envios de formulário e teclado.
   ===================================================================== */


// Um único ouvinte de clique para a página toda (delegação de eventos).
// Os botões são identificados pelos atributos data-tab, data-help, data-go,
// data-case e data-act.
document.addEventListener('click', e => {
  const tb = e.target.closest('[data-tab]');
  if (tb){ state.herTab = tb.dataset.tab; render(); window.scrollTo(0,0); return; }
  const hb = e.target.closest('[data-help]');
  if (hb){ const v = hb.dataset.help; setHelp(v==='prev' ? state.helpIdx-1 : v==='next' ? state.helpIdx+1 : +v); return; }
  const go = e.target.closest('[data-go]');
  if (go){ state.screen = go.dataset.go; state.loginErr=''; render(); window.scrollTo(0,0); return; }
  const cb = e.target.closest('[data-case].case-btn');
  if (cb){ state.sel[ROLES[state.role].svc] = cb.dataset.case; render(); return; }
  const a = e.target.closest('[data-act]'); if (!a) return;
  const act = a.dataset.act;
  if (act==='close'){ if (e.target===a){ state.modal=null; render(); } return; }
  if (act==='exit'){ state.hidden=true; state.auth=false; state.role=null; state.screen='home'; state.modal=null; state.herTab='jornada'; render(); window.scrollTo(0,0); return; }
  if (act==='back'){ state.hidden=false; render(); return; }
  if (act==='logout'){ state.auth=false; state.role=null; state.screen='home'; state.modal=null; toast('Você saiu.'); render(); window.scrollTo(0,0); return; }
  const R = ROLES[state.role], c = caseById(state.sel[R.svc]);
  const r = c?.refs.find(x=>x.id===a.dataset.ref);
  // Ações do profissional sobre um encaminhamento
  switch(act){
    case 'confirm': r.status='recebido'; r.received=TODAY; log(c.id,R.svc,R.user,`confirmou o recebimento do encaminhamento de ${sname(r.from)}`); toast(`Recebimento confirmado. ${sname(r.from)} foi avisada.`); render(); break;
    case 'nudge': log(c.id,R.svc,R.user,`enviou lembrete para ${sname(r.to)}`); toast(`Lembrete enviado para ${sname(r.to)}`); break;
    case 'attend': case 'feedback': state.modal={type:act, case:c.id, ref:r.id}; render(); break;
    case 'newref': state.modal={type:'newref', case:a.dataset.case}; render(); break;
  }
});
// Ao trocar o serviço de destino no novo encaminhamento, atualiza o aviso do SEI
document.addEventListener('change', e => {
  if (e.target.id==='f-to') syncSeiNote();
});
// Envio dos formulários (modal e login) sem recarregar a página
document.addEventListener('submit', e => {
  if (e.target.id==='mform'){ e.preventDefault(); submitModal(); }
  if (e.target.id==='lform'){ e.preventDefault(); doLogin(e.target); }
});
// Tecla Esc fecha o modal
document.addEventListener('keydown', e => { if (e.key==='Escape' && state.modal){ state.modal=null; render(); } });
