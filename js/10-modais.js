/* =====================================================================
   10-modais.js
   Modais de ação do profissional: registrar atendimento, enviar retorno
   e criar novo encaminhamento.
   ===================================================================== */


// ---------- modais ----------
// Gera o HTML do modal aberto: registrar atendimento, enviar retorno ou novo encaminhamento
function modalHTML(){
  const m = state.modal; if (!m) return '';
  const R = ROLES[state.role], c = caseById(m.case), r = c.refs.find(x=>x.id===m.ref);
  if (m.type==='attend') return wrapModal('Registrar atendimento', `
    <p class="muted">${esc(c.name)} · encaminhada por ${esc(sname(r.from))}</p>
    <div class="field"><label for="f-text">O que foi feito</label><input id="f-text" value="Escuta técnica inicial e plano de acompanhamento"></div>
    <div class="field"><label for="f-ext">Número no sistema do seu serviço (opcional)</label><input id="f-ext" placeholder="Ex.: prontuário, registro SUAS"><span class="hint">O registro completo continua no sistema do seu serviço.</span></div>`,
    'Registrar');
  if (m.type==='feedback') return wrapModal(`Enviar retorno para ${esc(sname(r.from))}`, `
    <div class="field"><label for="f-text">Retorno</label><textarea id="f-text">Atendimento realizado. Caso incluído em acompanhamento pelo serviço.</textarea><span class="hint">Escreva só o necessário para o serviço de origem seguir o caso.</span></div>`,
    'Enviar retorno');
  // Novo encaminhamento: destino, motivo, o que compartilhar, próximo passo e consentimento
  if (m.type==='newref'){
    const vis = visibleItems(c, R.svc);
    const opts = Object.entries(SVC).filter(([k])=>k!==R.svc).map(([k,s])=>`<option value="${k}">${esc(sname(k))}${s.sei?' (SEI)':''}</option>`).join('');
    return wrapModal('Novo encaminhamento', `
      <p class="muted">${esc(c.name)} · ${c.id}</p>
      <div class="field"><label for="f-to">Para qual serviço</label><select id="f-to">${opts}</select></div>
      <div class="alert sei" id="f-seinote" hidden><span>Os dois serviços usam o SEI. Faça o encaminhamento no SEI e informe o número abaixo. O Elo só registra a passagem na jornada.</span></div>
      <div class="field"><label for="f-text">Motivo</label><input id="f-text" placeholder="Ex.: orientação jurídica"></div>
      <div class="field"><span class="lbl">O que compartilhar</span><span class="hint">Marque só o necessário para o próximo atendimento.</span>
        ${vis.map(i=>`<label class="opt"><input type="checkbox" name="share" value="${i.id}" ${i.kind==='contato'?'checked':''}> <span>${esc(KINDS[i.kind])} <span class="hint">· ${esc(sname(i.origin))}</span></span></label>`).join('')}</div>
      <div class="field"><label for="f-when">Próximo passo para ela: data e hora</label><input id="f-when" type="datetime-local" value="2026-11-17T09:00"></div>
      <div class="field"><label for="f-bring">O que ela deve levar (separe por vírgula)</label><input id="f-bring" value="Documento com foto, CPF"></div>
      <div class="field"><label for="f-ext" id="f-extlbl">Referência em outro sistema (opcional)</label><input id="f-ext" placeholder="Ex.: SEI 00401-…"></div>
      <label class="opt"><input type="checkbox" id="f-ok"> <span><b>Ela concordou com o encaminhamento e com o que será compartilhado.</b></span></label>
      <p class="err" id="f-err" hidden></p>`, 'Encaminhar');
  }
  return '';
}
// Moldura comum de todos os modais (título, corpo e botões Cancelar/Confirmar)
function wrapModal(title, body, ok){
  return `<div class="ov" data-act="close"><form class="modal" id="mform" role="dialog" aria-modal="true" aria-label="${title}">
    <h2>${title}</h2>${body}
    <div class="row" style="justify-content:flex-end"><button type="button" class="btn" data-act="close">Cancelar</button><button class="btn primary" type="submit">${ok}</button></div>
  </form></div>`;
}
// Se origem e destino usam o SEI, mostra o aviso e torna o número do SEI obrigatório
function syncSeiNote(){
  const sel = document.getElementById('f-to'); if (!sel) return;
  const both = SVC[ROLES[state.role].svc].sei && SVC[sel.value].sei;
  $('#f-seinote').hidden = !both;
  $('#f-extlbl').textContent = both ? 'Número do processo no SEI (obrigatório)' : 'Referência em outro sistema (opcional)';
}

// Salva o que foi preenchido no modal, atualiza o caso e registra a ação
function submitModal(){
  const m = state.modal, R = ROLES[state.role], c = caseById(m.case), r = c.refs.find(x=>x.id===m.ref);
  const v = id => (document.getElementById(id)?.value || '').trim();
  if (m.type==='attend'){
    r.status='atendido'; r.attended=TODAY; if (v('f-ext')) r.ext = v('f-ext');
    c.visits.push({date:TODAY, svc:R.svc, text:v('f-text')||'Atendimento', her:`Você foi atendida no ${sname(R.svc)}.`});
    log(c.id, R.svc, R.user, 'registrou atendimento');
    toast('Atendimento registrado');
  }
  if (m.type==='feedback'){
    r.status='retorno'; r.feedback=v('f-text'); r.feedbackDate=TODAY;
    log(c.id, R.svc, R.user, `enviou retorno para ${sname(r.from)}`);
    toast(`Retorno enviado para ${sname(r.from)}`);
  }
  // Validações: motivo, número do SEI (quando obrigatório) e consentimento da mulher
  if (m.type==='newref'){
    const err = $('#f-err'), to = v('f-to');
    const sei = SVC[R.svc].sei && SVC[to].sei;
    const fail = msg => { err.textContent = msg; err.hidden = false; };
    if (!v('f-text')) return fail('Escreva o motivo do encaminhamento.');
    if (sei && !v('f-ext')) return fail('Informe o número do processo no SEI.');
    if (!$('#f-ok').checked) return fail('Confirme que ela concordou antes de encaminhar.');
    const when = v('f-when').replace('T',' ');
    const shared = [...document.querySelectorAll('input[name=share]:checked')].map(x=>x.value);
    c.refs.push({id:'r'+Date.now(), from:R.svc, to, date:TODAY, reason:v('f-text'), shared, status:'enviado', ext:v('f-ext'),
      next: when ? {when, bring:v('f-bring').split(',').map(s=>s.trim()).filter(Boolean)} : undefined});
    log(c.id, R.svc, R.user, `encaminhou para ${sname(to)}${sei?' (via SEI)':''}`);
    toast(sei ? `Passagem registrada. O encaminhamento segue no SEI.` : `Encaminhado para ${sname(to)}`);
  }
  state.modal=null; render();
}
