/* =====================================================================
   06-carrossel-ajuda.js
   Carrossel "Precisa de ajuda agora?" com telefones de emergência,
   navegação e avanço automático.
   ===================================================================== */


// Canais de ajuda (números públicos; conferidos em nov/2026 em fontes do GDF, PCDF e TJDFT)
const HELP = [
  {num:'180', title:'Central de Atendimento à Mulher', text:'Orientação e denúncia. Gratuito, 24 horas, todos os dias. Também atende em Libras.', tel:'180'},
  {num:'190', title:'Polícia Militar', text:'Emergência ou agressão acontecendo agora. Ligue imediatamente.', tel:'190'},
  {num:'197', title:'Polícia Civil do DF', text:'Denúncias 24 horas, de forma anônima se você preferir.', tel:'197'},
  {num:'(61) 98626-1197', title:'WhatsApp da Polícia Civil do DF', text:'Para denunciar por mensagem, quando ligar não for seguro.'},
  {num:'192', title:'SAMU', text:'Se você ou alguém precisar de atendimento médico urgente.', tel:'192'},
];
// Vai para o slide i (dá a volta no fim/início) e atualiza acessibilidade:
// só o slide visível pode receber foco e ser lido pelo leitor de tela
function setHelp(i){
  state.helpIdx = (i + HELP.length) % HELP.length;
  const t = document.getElementById('help-track'); if (!t) return;
  t.style.transform = `translateX(-${state.helpIdx*100}%)`;
  t.querySelectorAll('.slide').forEach((s,k)=>{ s.toggleAttribute('aria-hidden', k!==state.helpIdx); const a=s.querySelector('a'); if(a) a.tabIndex = k===state.helpIdx?0:-1; });
  document.querySelectorAll('[data-help]').forEach(b=>{ if(/^\d+$/.test(b.dataset.help)) b.setAttribute('aria-current', +b.dataset.help===state.helpIdx); });
}
// Avança sozinho a cada 6s; pausa com o mouse ou foco em cima, e não anima com movimento reduzido
setInterval(()=>{
  const h = document.getElementById('help');
  if (!h || h.matches(':hover') || h.contains(document.activeElement) || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  setHelp(state.helpIdx + 1);
}, 6000);
