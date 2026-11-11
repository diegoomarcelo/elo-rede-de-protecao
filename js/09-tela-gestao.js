/* =====================================================================
   09-tela-gestao.js
   Tela de gestão da rede: indicadores e pontos de interrupção.
   ===================================================================== */


// ---------- visão de gestão ----------
// Tela de gestão: números agregados, sem nomes nem conteúdo dos atendimentos
function viewGestao(){
  // Indicadores: pelo Elo, pelo SEI, sem confirmação, atrasados, sem retorno
  // e tempo médio até a confirmação
  const all = CASES.flatMap(c => c.refs.map(r => ({...r, case:c.id})));
  const refs = all.filter(r=>!viaSEI(r));
  const sei = all.filter(viaSEI);
  const pend = refs.filter(r=>r.status==='enviado');
  const late = pend.filter(r=>days(r.date)>LATE);
  const noFb = refs.filter(r=>r.status==='recebido'||r.status==='atendido');
  const conf = refs.filter(r=>r.received);
  const avg = conf.length ? (conf.reduce((s,r)=>s+days(r.date)-days(r.received),0)/conf.length) : 0;
  // Agrupa os encaminhamentos por par origem → destino
  const pairs = {};
  all.forEach(r=>{ const k=r.from+'>'+r.to; (pairs[k] ||= {from:r.from,to:r.to,sei:viaSEI(r),n:0,conf:0,fb:0}); pairs[k].n++; if(r.received) pairs[k].conf++; if(r.status==='retorno') pairs[k].fb++; });
  const rows = Object.values(pairs).sort((a,b)=>a.sei-b.sei || b.n-a.n);
  // Montagem: KPIs, tabela por par de serviços e pontos de interrupção
  return `<div class="stack">
    <div><p class="eyebrow">Visão da rede</p><h1>Transições entre serviços</h1>
      <p class="muted">Números agregados. A gestão não vê o conteúdo dos atendimentos nem o nome das mulheres.</p></div>
    <div class="kpis">
      <div class="kpi"><p class="eyebrow">Pelo Elo</p><p class="v">${refs.length}</p><p class="hint">entre serviços sem sistema comum</p></div>
      <div class="kpi"><p class="eyebrow">Sem confirmação</p><p class="v" style="color:var(--warn)">${pend.length}</p><p class="hint">${late.length} há mais de ${LATE} dias</p></div>
      <div class="kpi"><p class="eyebrow">Sem retorno</p><p class="v">${noFb.length}</p><p class="hint">recebidos, sem contrarreferência</p></div>
      <div class="kpi"><p class="eyebrow">Pelo SEI</p><p class="v" style="color:var(--sei)">${sei.length}</p><p class="hint">já acompanhados no SEI</p></div>
    </div>
    <p class="hint">Tempo médio até a confirmação, nos encaminhamentos pelo Elo: ${avg.toFixed(1).replace('.',',')} dias.</p>
    <section class="card stack"><h2>Por par de serviços</h2>
      <div class="tbl"><table><thead><tr><th>Origem</th><th>Destino</th><th>Canal</th><th style="text-align:right">Enviados</th><th>Confirmados</th><th style="text-align:right">Com retorno</th></tr></thead>
      <tbody>${rows.map(p=>`<tr><td>${esc(sname(p.from))}</td><td>${esc(sname(p.to))}</td><td>${p.sei?'<span class="tag sei">SEI</span>':'<span class="tag">Elo</span>'}</td><td class="num">${p.n}</td>
        <td><div class="row" style="flex-wrap:nowrap"><div class="bar" style="flex:1"><span style="width:${p.conf/p.n*100}%"></span></div><span class="mono">${p.conf}/${p.n}</span></div></td>
        <td class="num">${p.fb}</td></tr>`).join('')}</tbody></table></div>
      <p class="hint">O Elo atua nas passagens sem sistema comum. As do SEI aparecem só para a jornada ficar completa.</p></section>
    <section class="card stack"><h2>Pontos de interrupção</h2>
      ${late.length?`<ul class="items">${late.map(r=>`<li><div class="row" style="justify-content:space-between"><b>${esc(sname(r.from))} → ${esc(sname(r.to))}</b>${pill(r)}</div><span class="src">Caso ${r.case} · enviado em ${dm(r.date)}</span></li>`).join('')}</ul>`:'<p class="muted">Nenhum encaminhamento parado.</p>'}
    </section>
  </div>`;
}
