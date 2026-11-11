/* =====================================================================
   02-estado.js
   Estado da aplicação (o que está na tela neste momento).
   ===================================================================== */


// Estado global da interface:
//  role/auth  → quem está logado
//  screen     → tela antes do login (home, login-mulher, login-org)
//  sel        → caso selecionado por serviço
//  modal      → modal aberto (ou null)
//  toast      → mensagem temporária
//  hidden     → modo "Sair rápido" ativo (tela disfarce)
//  herTab     → aba ativa na tela da mulher
//  helpIdx    → slide atual do carrossel de ajuda
const state = {role:null, auth:false, screen:'home', loginErr:'', sel:{}, modal:null, toast:null, hidden:false, herTab:'jornada', helpIdx:0};
// Casos já abertos nesta sessão (evita registrar o mesmo acesso duas vezes)
const seen = new Set();
