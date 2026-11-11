/* =====================================================================
   07-tela-neutra.js
   Tela neutra de proteção ("Sair rápido").
   ===================================================================== */


// Tela disfarce mostrada pelo botão "Sair rápido": uma lista de compras comum.
// O título da aba do navegador também muda (ver render no 11-render.js).
function viewNeutral(){
  return `<div class="neutral"><h1>Lista de compras</h1>
    <ul><li>Arroz</li><li>Feijão</li><li>Leite</li><li>Pão</li><li>Frutas</li></ul>
    <p class="hint" style="margin-top:40px">No protótipo: <button class="btn small" data-act="back">voltar</button></p></div>`;
}
