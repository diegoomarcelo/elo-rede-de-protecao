/* =====================================================================
   04-tela-login.js
   Telas antes do login: tela inicial, login da mulher e login
   institucional, além da validação do login.
   ===================================================================== */


// ---------- telas de entrada e login ----------
// Ícones das duas portas de entrada
const ICON_HER = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/></svg>`;
const ICON_ORG = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 21h18M5 21V10l7-5 7 5v11M9 21v-6h6v6"/></svg>`;
// Tela inicial: escolha entre entrar como mulher atendida ou como profissional
function viewHome(){
  return `<div class="gate">
    <div class="gate-head"><p class="eyebrow">Elo</p><h1>Acompanhe a jornada de proteção entre os serviços da rede</h1>
      <p class="muted">Escolha como você vai entrar.</p></div>
    <div class="doors">
      <button class="door" data-go="login-mulher">
        <span class="ic">${ICON_HER}</span>
        <h2>Sou atendida pela rede</h2>
        <span class="muted">Veja para onde ir, o que levar e quem acompanha seu caso.</span>
        <span class="go">Entrar →</span>
      </button>
      <button class="door org" data-go="login-org">
        <span class="ic">${ICON_ORG}</span>
        <h2>Sou profissional da rede</h2>
        <span class="muted">Casa da Mulher, Comitê, saúde, assistência social e gestão. Acesso com e-mail institucional.</span>
        <span class="go">Acesso institucional →</span>
      </button>
    </div>
  </div>`;
}
// Caixa de erro do login e caixa com as credenciais de teste
const errBox = () => state.loginErr ? `<p class="err" role="alert">${esc(state.loginErr)}</p>` : '';
const credBox = `<div class="testcred">Protótipo · use <b class="mono">${TEST.email}</b> e senha <b class="mono">${TEST.pass}</b></div>`;
// Login da mulher atendida (com botão "Sair rápido")
function viewLoginMulher(){
  return `<div class="login">
    <button class="linkbtn" data-go="home">← Voltar</button>
    <div class="stack" style="gap:6px"><h1>Entrar na minha jornada</h1>
      <p class="muted">Use o e-mail e a senha que você cadastrou com o serviço que atende você.</p></div>
    <form id="lform" data-kind="mulher" autocomplete="off">
      <div class="field"><label for="l-email">E-mail</label><input id="l-email" type="email" inputmode="email" value="${TEST.email}"></div>
      <div class="field"><label for="l-pass">Senha</label><input id="l-pass" type="password" value="${TEST.pass}"></div>
      ${errBox()}
      <button class="btn primary" type="submit">Entrar</button>
    </form>
    ${credBox}
    <div class="note"><span class="ico ok">✓</span><span>Ninguém é avisado quando você entra. Use um aparelho em que você se sinta segura.</span></div>
    <div class="note"><span class="ico need">?</span><span>Esqueceu a senha ou não tem cadastro? Peça ao serviço que atende você. Eles criam o acesso com você.</span></div>
  </div>
  <button class="exit" data-act="exit">Sair rápido</button>`;
}
// Login institucional (o serviço escolhido define a tela no protótipo)
function viewLoginOrg(){
  const opts = ORGS.map(k => `<option value="${k}">${esc(k==='gestao' ? 'Gestão da rede' : SVC[k].name)}</option>`).join('');
  return `<div class="login org">
    <button class="linkbtn" data-go="home">← Voltar</button>
    <div class="stack" style="gap:6px"><p class="eyebrow">Acesso institucional</p><h1>Entrar como profissional</h1>
      <p class="muted">O que você vê depende do seu serviço e da sua função.</p></div>
    <form id="lform" data-kind="org" autocomplete="off">
      <div class="field"><label for="l-org">Serviço</label><select id="l-org">${opts}</select></div>
      <div class="field"><label for="l-email">E-mail institucional</label><input id="l-email" type="email" value="${TEST.email}"></div>
      <div class="field"><label for="l-pass">Senha</label><input id="l-pass" type="password" value="${TEST.pass}"></div>
      ${errBox()}
      <button class="btn primary" type="submit">Entrar</button>
    </form>
    ${credBox}
    <div class="note"><span class="ico need">!</span><span>Todos os acessos ficam registrados, e a mulher atendida pode ver quais serviços consultaram as informações dela.</span></div>
    <p class="hint">No protótipo, o serviço escolhido define a tela. Na versão real, ele viria do cadastro do profissional.</p>
  </div>`;
}
// Valida o login com a credencial de teste e abre a tela do perfil.
// Para profissionais, a entrada fica registrada no registro de acessos.
function doLogin(form){
  const email = $('#l-email').value.trim().toLowerCase(), pass = $('#l-pass').value;
  if (!email || !pass){ state.loginErr = 'Preencha e-mail e senha.'; return render(); }
  if (email !== TEST.email || pass !== TEST.pass){ state.loginErr = 'E-mail ou senha incorretos. Confira e tente de novo.'; return render(); }
  state.loginErr = '';
  state.role = form.dataset.kind === 'mulher' ? 'mulher' : $('#l-org').value;
  state.auth = true; state.modal = null;
  const R = ROLES[state.role];
  if (R.kind==='prof') AUDIT.push({at:now(), case:'—', svc:R.svc, who:R.user, act:'entrou no sistema'});
  render(); window.scrollTo(0,0);
}
