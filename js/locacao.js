window.onload = init;

function init(){

  var Storage = window.localStorage;
  var locacoes = [];

  function getLocacao(id){
    for (var i = 0; i < locacoes.length; i++){
      var locacao = locacoes[i];
      if (locacao.id == id){
        return locacao;
      }
    }
    return null;
  }

  function buscarLocacoes(){
    var TB_LOCACAO = Storage.getItem('TB_LOCACAO');
    if (TB_LOCACAO!==null) {
      locacoes = JSON.parse(TB_LOCACAO);
    } else {
      locacoes = [];
    }
  }

  function setDadosLocacao(locacao){
    edId().value = locacao.id;
    edDataLocacao().value = locacao.data;
    edStatus().value = locacao.status;
    edCliente().value = locacao.nomeCliente;
    edVeiculo().value = locacao.descricaoVeiculo;
    edValor().value = locacao.valor;
    edResumo().value = locacao.resumo;
  }

  function edId(){
    return document.getElementById('edId');
  }

  function edDataLocacao(){
    return document.getElementById('edDataLocacao');
  }

  function edStatus(){
    return document.getElementById('edStatus');
  }

  function edCliente(){
    return document.getElementById('edCliente');
  }

  function edVeiculo(){
    return document.getElementById('edVeiculo');
  }

  function edValor(){
    return document.getElementById('edValor');
  }

  function edResumo(){
    return document.getElementById('edResumo');
  }


  /* Inicialização */

  var id = UTIL.getParameterURL('id');

  buscarLocacoes();
  var locacao = getLocacao(id);

  if (locacao != null){
    setDadosLocacao(locacao);
  }



  /* Fim da inicialização */

};
