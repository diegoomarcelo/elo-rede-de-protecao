/* =====================================================================
   11-render.js
   Renderização: decide qual tela mostrar a partir do estado.
   ===================================================================== */


// ---------- render e eventos ----------
// Redesenha a tela inteira conforme o estado:
// modo disfarce → login → tela do perfil (mulher, profissional ou gestão) + modal + toast
function render(){
  const hide = state.hidden;
  $('#hdr').hidden = hide; $('#proto').hidden = hide;
  document.title = hide ? 'Lista de compras' : 'Elo Rede de Proteção';
  if (hide){ $('#app').innerHTML = viewNeutral(); $('#layer').innerHTML=''; return; }
  renderWho();
  if (!state.auth){
    $('#app').innerHTML = state.screen==='login-mulher' ? viewLoginMulher() : state.screen==='login-org' ? viewLoginOrg() : viewHome();
    $('#layer').innerHTML = ''; renderToast(); return;
  }
  const k = ROLES[state.role].kind;
  $('#app').innerHTML = k==='mulher' ? viewMulher() : k==='prof' ? viewProf() : viewGestao();
  $('#layer').innerHTML = modalHTML();
  syncSeiNote();
  setHelp(state.helpIdx);
  renderToast();
}
// Cria, atualiza ou remove o toast no rodapé
function renderToast(){
  let t = document.getElementById('toast');
  if (!state.toast){ t && t.remove(); return; }
  if (!t){ t = document.createElement('div'); t.id='toast'; t.className='toast'; t.setAttribute('role','status'); document.body.appendChild(t); }
  t.textContent = state.toast;
}
