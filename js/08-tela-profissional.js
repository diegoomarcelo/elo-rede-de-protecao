/* =====================================================================
   08-tela-profissional.js
   Tela do profissional da rede: caixa de casos e detalhe de cada caso.
   ===================================================================== */


// ---------- visão profissional ----------
// Tela do profissional: lista de casos à esquerda e detalhe do caso selecionado à direita
function viewProf(){
  // Casos recebidos pelo serviço e casos que o serviço acompanha (referência ou encaminhou)
  const R = ROLES[state.role], svc = R.svc;
  const incoming = CASES.filter(c => c.refs.some(r => r.to === svc));
  const following = CASES.filter(c => (c.ref === svc || c.refs.some(r => r.from === svc)) && !incoming.includes(c));
  const all = [...incoming, ...following];
  // Mantém o caso selecionado; se não houver, seleciona o primeiro
  let sel = caseById(state.sel[svc]);
  if (!sel || !all.includes(sel)) sel = all[0];
  if (sel) state.sel[svc] = sel.id;
  // Botão de cada caso na lista, com o encaminhamento mais recente e sua situação
  const btn = c => {
    const r = c.refs.filter(r => r.to === svc || r.from === svc).sort((a,b)=>b.date.localeCompare(a.date))[0];
    return `<li><button class="case-btn" data-case="${c.id}" aria-current="${sel && sel.id===c.id}">
      <span class="l1"><b>${esc(c.name)}</b><span class="mono muted">${c.id}</span></span>
      ${r ? `<span class="muted" style="font-size:.82rem">${r.to===svc?'De '+esc(sname(r.from)):'Para '+esc(sname(r.to))}</span>${pill(r)}`:''}
    </button></li>`;
  };
  // Montagem: cabeçalho do profissional, aviso de SEI (se houver) e as duas colunas
  return `<div class="stack">
    <div><p class="eyebrow">${esc(SVC[svc].name)} · ${esc(SVC[svc].area)}</p>
      <h1>${esc(R.user)} <span class="muted" style="font-weight:500;font-size:1rem">· ${esc(R.fn)}</span></h1></div>
    ${SVC[svc].sei ? `<div class="alert sei"><div><b>Seu serviço já usa o SEI</b><br><span class="muted">Encaminhamentos para outros serviços que estão no SEI continuam lá. O Elo só acompanha as passagens para serviços fora do SEI e mostra a jornada completa.</span></div></div>`:''}
    <div class="pro">
      <aside class="inbox card">
        <div class="stack" style="gap:8px"><h3>Encaminhamentos recebidos</h3>
          ${incoming.length ? `<ul>${incoming.map(btn).join('')}</ul>` : '<p class="muted">Nenhum por enquanto.</p>'}</div>
        <div class="stack" style="gap:8px"><h3>Casos que acompanho</h3>
          ${following.length ? `<ul>${following.map(btn).join('')}</ul>` : '<p class="muted">Nenhum caso de referência.</p>'}</div>
      </aside>
      <div>${sel ? caseDetail(sel, svc) : '<div class="card">Selecione um caso.</div>'}</div>
    </div></div>`;
}

// Detalhe de um caso para o serviço `svc`
function caseDetail(c, svc){
  const R = ROLES[state.role];
  // Na primeira vez que o caso é aberto, registra o acesso às informações compartilhadas
  const key = state.role+'|'+c.id;
  const vis = visibleItems(c, svc);
  if (!seen.has(key)){ seen.add(key); if (vis.some(i=>i.origin!==svc)) log(c.id, svc, R.user, 'abriu o caso e consultou as informações compartilhadas'); }
  // Encaminhamentos por situação, para mostrar os alertas de ação certos:
  // pend = aguardando confirmar, open = aguardando registrar atendimento,
  // noFb = aguardando retorno, seiIn = tramita no SEI, lateOut = enviados e atrasados
  const hidden = c.items.length - vis.length;
  const toMe = c.refs.filter(r => r.to === svc && !viaSEI(r));
  const pend = toMe.find(r => r.status === 'enviado');
  const open = toMe.find(r => r.status === 'recebido');
  const noFb = toMe.find(r => r.status === 'atendido');
  const seiIn = c.refs.find(r => r.to === svc && viaSEI(r) && r.status !== 'retorno');
  const lateOut = c.refs.filter(r => r.from === svc && !viaSEI(r) && r.status === 'enviado' && days(r.date) > LATE);
  const visKinds = new Set(vis.map(i=>i.kind));
  const tl = [...c.visits].sort((a,b)=>a.date.localeCompare(b.date));
  const audit = AUDIT.filter(a=>a.case===c.id).slice().reverse();

  // Montagem: identificação do caso, alertas, informações disponíveis,
  // checklist "antes de perguntar de novo", tabela de encaminhamentos,
  // jornada entre serviços e registro de acessos
  return `<div class="stack">
   <div class="card stack" style="gap:6px">
     <div class="row" style="justify-content:space-between"><h2>${esc(c.name)}</h2><span class="mono muted">${c.id}</span></div>
     <p class="muted">Referência do caso: <b style="color:var(--ink)">${esc(sname(c.ref))}</b> · ${esc(c.refUser)} (${esc(c.refFn)})</p>
   </div>
   ${pend ? `<div class="alert info"><div><b>Encaminhamento recebido de ${esc(sname(pend.from))}</b><br><span class="muted">${dm(pend.date)} · ${esc(pend.reason)}</span></div>
      <button class="btn primary" data-act="confirm" data-ref="${pend.id}">Confirmar recebimento</button></div>`:''}
   ${open ? `<div class="alert info"><div><b>Encaminhamento de ${esc(sname(open.from))} recebido</b><br><span class="muted">Registre quando o atendimento acontecer.</span></div>
      <button class="btn primary" data-act="attend" data-ref="${open.id}">Registrar atendimento</button></div>`:''}
   ${noFb ? `<div class="alert warn"><div><b>${esc(sname(noFb.from))} aguarda retorno</b><br><span class="muted">Conte ao serviço de origem como o caso seguiu.</span></div>
      <button class="btn primary" data-act="feedback" data-ref="${noFb.id}">Enviar retorno</button></div>`:''}
   ${seiIn ? `<div class="alert sei"><div><b>Encaminhamento de ${esc(sname(seiIn.from))} tramita no SEI</b><br><span class="muted">${esc(seiIn.ext)} · confirmações e retornos seguem por lá.</span></div></div>`:''}
   ${lateOut.map(r=>`<div class="alert crit"><div><b>${esc(sname(r.to))} ainda não confirmou o recebimento</b><br><span class="muted">Encaminhado em ${dm(r.date)}, há ${days(r.date)} dias.</span></div>
      <button class="btn" data-act="nudge" data-ref="${r.id}">Lembrar o serviço</button></div>`).join('')}

   <div class="grid2">
     <section class="card stack">
       <div><h3>Informações disponíveis para você</h3><p class="hint">Só o que foi registrado pelo seu serviço ou compartilhado com ele.</p></div>
       <ul class="items">${vis.map(i=>`<li><b>${esc(KINDS[i.kind])}</b><span>${esc(i.text)}</span>
          <span class="src">${esc(sname(i.origin))} · ${dm(i.date)}${i.origin===svc?' · registro do seu serviço':''}</span></li>`).join('')}</ul>
       ${hidden>0?`<p class="hint">${hidden} ${hidden>1?'registros de outros serviços não foram compartilhados':'registro de outro serviço não foi compartilhado'} com o seu serviço.</p>`:''}
     </section>
     <section class="card stack">
       <div><h3>Antes de perguntar de novo</h3><p class="hint">Evite repetir o que já foi registrado. Pergunte só o que sua função exige.</p></div>
       <ul class="check">
         ${Object.entries(KINDS).filter(([k])=>visKinds.has(k)).map(([k,l])=>`<li><span class="ico ok">✓</span><span>${l}<br><span class="hint">Já disponível. Não precisa perguntar.</span></span></li>`).join('')}
         ${(OWN[svc]||[]).map(l=>`<li><span class="ico need">!</span><span>${esc(l)}<br><span class="hint">Nova escuta necessária pela função do serviço.</span></span></li>`).join('')}
         ${Object.entries(KINDS).filter(([k])=>!visKinds.has(k)&&['contato','risco','filhos'].includes(k)).map(([k,l])=>`<li><span class="ico ask">?</span><span>${l}<br><span class="hint">Não foi compartilhado. Pergunte só se for necessário.</span></span></li>`).join('')}
       </ul>
     </section>
   </div>

   <section class="card stack">
     <div class="row" style="justify-content:space-between"><h3>Encaminhamentos do caso</h3>
       <button class="btn" data-act="newref" data-case="${c.id}">Novo encaminhamento</button></div>
     <div class="tbl"><table>
       <thead><tr><th>Data</th><th>De → Para</th><th>Motivo</th><th>Situação</th><th>Canal / referência</th></tr></thead>
       <tbody>${c.refs.slice().sort((a,b)=>b.date.localeCompare(a.date)).map(r=>`<tr>
         <td class="num">${dm(r.date)}</td>
         <td>${esc(sname(r.from))} → <b>${esc(sname(r.to))}</b></td>
         <td>${esc(r.reason)}${r.feedback && (r.from===svc||r.to===svc)?`<br><span class="hint">Retorno ${dm(r.feedbackDate)}: ${esc(r.feedback)}</span>`:''}</td>
         <td>${pill(r)}</td>
         <td>${viaSEI(r)?`<span class="tag sei">${esc(r.ext||'SEI')}</span>`:`<span class="tag">Elo</span>${r.ext?` <span class="tag">${esc(r.ext)}</span>`:''}`}</td></tr>`).join('')}</tbody>
     </table></div>
   </section>

   <div class="grid2">
     <section class="card stack"><h3>Jornada entre serviços</h3>
       <ol class="tl">${tl.map(v=>`<li><span class="d">${dm(v.date)}</span><span class="dot"></span><div class="t"><b>${esc(sname(v.svc))}</b><span class="muted">${esc(v.text)}</span></div></li>`).join('')}</ol>
       <p class="hint">Mostra onde a mulher foi atendida. O conteúdo de cada atendimento continua no sistema de cada serviço.</p></section>
     <section class="card stack"><h3>Registro de acessos</h3>
       <ul class="audit">${audit.slice(0,8).map(a=>`<li><span class="when">${dm(a.at)} ${a.at.slice(11)}</span><span><b>${esc(a.who)}</b> (${esc(sname(a.svc))}) ${esc(a.act)}</span></li>`).join('')}</ul></section>
   </div>
  </div>`;
}
