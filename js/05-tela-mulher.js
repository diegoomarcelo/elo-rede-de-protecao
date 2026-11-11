/* =====================================================================
   05-tela-mulher.js
   Tela da mulher atendida: próximo passo, ajuda, encaminhamentos,
   linha do tempo e privacidade (quem acessou suas informações).
   ===================================================================== */


// ---------- visão da mulher ----------
// Monta a tela da mulher atendida (abas "Minha jornada" e "Privacidade e acessos")
function viewMulher(){
  // Dados do caso: próximo atendimento pendente, linha do tempo, referência,
  // informações compartilhadas, serviços envolvidos e acessos ao caso
  const c = caseById(ROLES.mulher.caseId);
  const pending = c.refs.find(r => r.next && r.status !== 'retorno' && r.status !== 'atendido');
  const nx = pending?.next, dest = pending && SVC[pending.to];
  const tl = [...c.visits].sort((a,b)=>a.date.localeCompare(b.date));
  const ref = SVC[c.ref];
  const shared = pending ? c.items.filter(i => pending.shared.includes(i.id)) : [];
  const servicesSeen = [...new Set([...c.items.map(i=>i.origin), ...c.refs.map(r=>r.to)])].filter(s=>SVC[s]);
  const myAudit = AUDIT.filter(a => a.case === c.id).slice().reverse();
  const first = c.name.split(' ')[0];
  const tab = state.herTab || 'jornada';

  // Abas e saudação no topo
  const tabs = `<div class="tabs" role="tablist" aria-label="Seções">
    <button role="tab" data-tab="jornada" aria-selected="${tab==='jornada'}">Minha jornada</button>
    <button role="tab" data-tab="privacidade" aria-selected="${tab==='privacidade'}">Privacidade e acessos</button>
  </div>`;
  const head = `<div class="her-top">
    <div class="stack" style="gap:2px"><p class="eyebrow">${weekday(TODAY)}, ${dm(TODAY)}</p><h1>Olá, ${esc(first)}</h1>
      <p class="muted">Sua referência é ${esc(c.refUser.split(' ')[0])}, na ${esc(sname(c.ref))}.</p></div>
    ${tabs}</div>`;

  // ----- Aba "Privacidade e acessos": quem pode ver o quê e últimos acessos -----
  if (tab === 'privacidade'){
    return `<div class="her">${head}
      <section class="card stack">
        <div><h2>Quem pode ver suas informações</h2><p class="muted">Cada serviço vê só o que precisa para atender você. Nada é compartilhado sem a sua autorização.</p></div>
        <div class="principles">
          <div><span class="ico ok">✓</span><b>Só o necessário</b><span class="muted">O serviço recebe apenas o que ajuda no atendimento dele.</span></div>
          <div><span class="ico ok">✓</span><b>Com sua autorização</b><span class="muted">O compartilhamento é combinado com você a cada encaminhamento.</span></div>
          <div><span class="ico ok">✓</span><b>Tudo registrado</b><span class="muted">Você vê abaixo quem consultou suas informações e quando.</span></div>
        </div>
      </section>
      <div class="priv-grid">
        ${servicesSeen.map(s=>{const v=visibleItems(c,s); return `<article class="svc-card">
          <div class="stack" style="gap:6px;align-items:flex-start"><h3>${esc(sname(s))}</h3><span class="tag">${esc(SVC[s].area)}</span></div>
          <div><span class="count">${v.length}</span> <span class="muted">${v.length===1?'informação':'informações'}</span></div>
          <ul>${v.length?v.map(i=>`<li>${esc(KINDS_HER[i.kind])}</li>`).join(''):'<li>Só sabe que você foi encaminhada.</li>'}</ul>
        </article>`}).join('')}
      </div>
      <section class="card stack">
        <h2>Últimos acessos</h2>
        <div class="tbl"><table><thead><tr><th>Quando</th><th>Serviço</th><th>O que fez</th></tr></thead>
        <tbody>${myAudit.map(a=>`<tr><td class="num" style="text-align:left;white-space:nowrap">${dm(a.at)} · ${a.at.slice(11)}</td><td>${esc(sname(a.svc))}</td><td class="muted">${esc(a.act.replace(/^consultou /,'Consultou ').replace(/^registrou /,'Registrou ').replace(/^confirmou /,'Confirmou ').replace(/^encaminhou /,'Encaminhou ').replace(/^abriu /,'Abriu ').replace(/^enviou /,'Enviou '))}</td></tr>`).join('')}</tbody></table></div>
        <p class="hint">Viu algum acesso que não reconhece? Fale com ${esc(c.refUser.split(' ')[0])}: ${esc(ref.phone)}.</p>
      </section>
    </div>
    <button class="exit" data-act="exit">Sair rápido</button>`;
  }

  // ----- Aba "Minha jornada" -----
  // Ícones usados no card do próximo passo
  const I = {
    clock:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    pin:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>',
    door:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 21h16M6 21V4h12v17M14 12h.01"/></svg>',
    doc:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 3h7l5 5v13H7zM14 3v5h5"/></svg>',
  };
  const MONTH = ['JAN','FEV','MAR','ABR','MAI','JUN','JUL','AGO','SET','OUT','NOV','DEZ'];
  // Card "Seu próximo passo": data, local, horário e o que levar
  const nextCard = nx ? `<section class="next" aria-label="Próximo passo">
      <div class="next-head"><p class="eyebrow">Seu próximo passo</p>${pillHer(pending)}</div>
      <div class="next-body">
        <div class="cal" aria-hidden="true"><div class="m">${MONTH[+nx.when.slice(5,7)-1]}</div><div class="d">${nx.when.slice(8,10)}</div><div class="w">${weekday(nx.when).slice(0,3)}</div></div>
        <div style="min-width:0">
          <h2>${esc(SVC[pending.to].name)}</h2>
          <p class="muted">${esc(pending.reason)}</p>
          <div class="facts">
            <div class="fact">${I.clock}<span><b>Quando</b>${weekday(nx.when)}, ${dm(nx.when)} às ${nx.when.slice(11)}</span></div>
            <div class="fact">${I.pin}<span><b>Onde</b>${esc(dest.addr)}</span></div>
            <div class="fact">${I.door}<span><b>Funcionamento</b>${esc(dest.hours)}</span></div>
            <div class="fact">${I.doc}<span><b>Levar</b><span class="chips" style="margin-top:4px">${nx.bring.map(b=>`<span class="chip">${esc(b)}</span>`).join('')}</span></span></div>
          </div>
        </div>
      </div>
      <div class="next-foot"><span>Não consegue ir? Fale com ${esc(c.refUser.split(' ')[0])}: <b>${esc(ref.phone)}</b></span><span>Se faltar documento, vá mesmo assim.</span></div>
    </section>` : `<section class="next"><p class="eyebrow">Seu próximo passo</p><h2>Nenhum atendimento marcado agora</h2><p class="muted">Quando você for encaminhada, o próximo passo aparece aqui.</p></section>`;

  // Carrossel com telefones de ajuda (os dados estão em HELP, no 06-carrossel-ajuda.js)
  const helpCard = `<section class="help" aria-roledescription="carrossel" aria-label="Telefones de ajuda" id="help">
      <p class="eyebrow">Precisa de ajuda agora?</p>
      <div class="help-viewport"><div class="help-track" id="help-track">
        ${HELP.map((h,i)=>`<div class="slide" role="group" aria-roledescription="slide" aria-label="${i+1} de ${HELP.length}" ${i!==state.helpIdx?'aria-hidden="true"':''}>
          <span class="num ${h.num.length>4?'sm':''}">${esc(h.num)}</span><span class="t">${esc(h.title)}</span><p>${esc(h.text)}</p>
          ${h.tel?`<a href="tel:${h.tel}" tabindex="${i===state.helpIdx?0:-1}">Ligar para ${esc(h.num)}</a>`:''}
        </div>`).join('')}
      </div></div>
      <div class="help-nav">
        <div class="dots">${HELP.map((h,i)=>`<button data-help="${i}" aria-label="Mostrar ${esc(h.num)}" aria-current="${i===state.helpIdx}"></button>`).join('')}</div>
        <div class="arrows"><button data-help="prev" aria-label="Anterior">‹</button><button data-help="next" aria-label="Próximo">›</button></div>
      </div>
    </section>`;

  // Montagem final: próximo passo + ajuda, encaminhamentos, linha do tempo,
  // "você não precisa contar tudo de novo" e quem acompanha o caso
  return `<div class="her">${head}
    <div class="hero">${nextCard}${helpCard}</div>
    <div class="cols">
      <div class="stack">
        <section class="card stack">
          <div class="sec-title"><h2>Seus encaminhamentos</h2><span class="hint">${c.refs.length} no total</span></div>
          <ul class="refs">${c.refs.slice().sort((a,b)=>b.date.localeCompare(a.date)).map(r=>{
            const step = {enviado:1, recebido:2, atendido:3, retorno:3}[r.status];
            return `<li>
              <div style="min-width:0"><b>${esc(sname(r.to))}</b><br><span class="muted" style="font-size:.88rem">${esc(r.reason)}</span></div>
              <span class="hint" style="white-space:nowrap">${dm(r.date)}</span>
              <div class="steps" aria-label="Andamento">
                <span class="${step>=1?'on':''}">Enviado</span><span class="${step>=2?'on':''}">Serviço recebeu</span><span class="${step>=3?'on':''}">Você foi atendida</span>
              </div></li>`}).join('')}</ul>
        </section>
        <section class="card stack">
          <h2>Por onde você já passou</h2>
          <ol class="tl">
            ${tl.map(v=>`<li><span class="d">${dm(v.date)}</span><span class="dot"></span><div class="t"><b>${esc(sname(v.svc))}</b><span class="muted">${esc(v.her)}</span></div></li>`).join('')}
            ${nx ? `<li class="future"><span class="d">${dm(nx.when)}</span><span class="dot"></span><div class="t"><b>${esc(sname(pending.to))}</b><span class="muted">Próximo atendimento</span></div></li>`:''}
          </ol>
        </section>
      </div>
      <div class="stack">
        ${pending ? `<section class="card knows">
          <h2>Você não precisa contar tudo de novo</h2>
          <p class="muted">Com a sua autorização, o ${esc(sname(pending.to))} já recebeu:</p>
          <ul>${shared.map(i=>`<li><span class="ico ok">✓</span><span>${esc(KINDS_HER[i.kind])}</span></li>`).join('')}</ul>
          ${OWN_HER[pending.to] ? `<ul><li><span class="ico need">!</span><span>${esc(OWN_HER[pending.to])}</span></li></ul>` : ''}
          <p class="hint">Você pode pedir para não falar de algum assunto.</p>
        </section>` : ''}
        <section class="card stack">
          <h2>Quem acompanha seu caso</h2>
          <p><b>${esc(c.refUser)}</b><br><span class="muted">${esc(c.refFn[0].toUpperCase()+c.refFn.slice(1))} · ${esc(SVC[c.ref].name)}</span></p>
          <div class="facts" style="grid-template-columns:1fr;margin-top:0">
            <div class="fact">${I.clock}<span><b>Atendimento</b>${esc(ref.hours)}</span></div>
            <div class="fact"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/></svg><span><b>Telefone</b>${esc(ref.phone)}</span></div>
          </div>
        </section>
        <button class="btn" data-tab="privacidade" style="align-self:flex-start">Ver quem pode acessar suas informações →</button>
      </div>
    </div>
  </div>
  <button class="exit" data-act="exit">Sair rápido</button>`;
}

// Pílula de situação com texto simples, para a mulher
function pillHer(r){
  const m = {enviado:['p-enviado','Aguardando o serviço'], recebido:['p-recebido','O serviço já recebeu'], atendido:['p-atendido','Você foi atendida'], retorno:['p-retorno','Concluído']}[r.status];
  return `<span class="pill ${m[0]}">${m[1]}</span>`;
}
