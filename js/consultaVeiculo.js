window.onload = init;

function init(){
  var Storage = window.localStorage;

  function imprimeListaVeiculos(){
    var lista = document.getElementById('lista-veiculos');
    lista.textContent = '';
    for (var i = 0; i < veiculos.length; i++) {
      var veiculo = veiculos[i];
      var templateLista = document.getElementById('template-lista-veiculos');
      var copiaTemplate = templateLista.content.firstElementChild.cloneNode(true);
      UTIL.replaceWithData(copiaTemplate, veiculo);
      lista.appendChild(copiaTemplate);
    }
  }

  function removerVeiculo(){
    var input = document.getElementById('id-veiculo-remover');
    var idVeiculo = input.innerText;

    var veiculosAux = [];

    for (var i = 0; i < veiculos.length; i++) {
      var veiculo = veiculos[i];
      if (veiculo.id != idVeiculo){
        veiculosAux.push(veiculo);
      }
    }

    Storage.setItem('TB_VEICULO', JSON.stringify(veiculosAux));
    buscarVeiculos();
    imprimeListaVeiculos();
  }

  $('#modal-remover').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget);
    var descricao =  button.data('id-veiculo') + '  ' + button.data('descricao-veiculo');

    var modal = $(this)
    modal.find('#ed-descricao-veiculo-remover').text(descricao);
    modal.find('#id-veiculo-remover').text(button.data('id-veiculo'));

  });

  function buscarVeiculos(){
    var TB_VEICULO = Storage.getItem('TB_VEICULO');
    if (TB_VEICULO!==null) {
      veiculos = JSON.parse(TB_VEICULO);
      imprimeListaVeiculos();
    } else {
      veiculos = [];
    }
  }

  function mostrarMensagem(tipoMensagem, mensagem){
    var alerta;
    var edMensagem;
    if (tipoMensagem === 'erro'){
      edMensagem =  document.getElementById('ds-alerta-erro');
      alerta =  document.getElementById('alerta-erro');
    } else if (tipoMensagem === 'informacao'){
      edMensagem =  document.getElementById('ds-alerta-informacao');
      alerta = document.getElementById('alerta-informacao');
    }

    edMensagem.innerText = mensagem;
    alerta.style.display = 'block';
  }

  var veiculos = [];
  /*Início que deve ser inicializado*/
  buscarVeiculos();

  var btnModalRemover = document.getElementById('btn-modal-remover');
  btnModalRemover.addEventListener('click', removerVeiculo);

  var tipoMensagem = UTIL.getParameterURL('tipomensagem');
  var mensagem = UTIL.getParameterURL('mensagem');

  if (tipoMensagem !== undefined && mensagem !== undefined){
    mostrarMensagem(tipoMensagem, mensagem);
  }

  /*Fim inicializacao*/
}
