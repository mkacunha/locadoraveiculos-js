window.onload = init;

function init(){
  var Storage = window.localStorage;

  function imprimeListaClientes(){
    var lista = document.getElementById('lista-imprimir');
    lista.textContent = '';
    for (var i = 0; i < clientes.length; i++) {
      var cliente = clientes[i];
      var templateLista = document.getElementById('template-lista-imprimir');
      var copiaTemplate = templateLista.content.firstElementChild.cloneNode(true);
      UTIL.replaceWithData(copiaTemplate, cliente);
      lista.appendChild(copiaTemplate);
    }
  }

  function removerCliente(){
    var input = document.getElementById('id-remover');
    var idCliente = input.innerText;

    var clientesAux = [];

    for (var i = 0; i < clientes.length; i++) {
      var cliente = clientes[i];
      if (cliente.id != idCliente){
        clientesAux.push(cliente);
      }
    }

    Storage.setItem('TB_CLIENTE', JSON.stringify(clientesAux));
    buscarClientes();
    imprimeListaClientes();
  }

  $('#modal-remover').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget);
    var descricao =  button.data('id-cliente') + '  ' + button.data('nome-cliente');

    var modal = $(this)
    modal.find('#ed-nome-cliente-remover').text(descricao);
    modal.find('#id-remover').text(button.data('id-.cliente'));

  });

  function buscarClientes(){
    var TB_CLIENTE = Storage.getItem('TB_CLIENTE');
    if (TB_CLIENTE!==null) {
      clientes = JSON.parse(TB_CLIENTE);
    } else {
      clientes = [];
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

  var clientes = [];
  /*Início que deve ser inicializado*/
  buscarClientes();
  imprimeListaClientes();

  var btnModalRemover = document.getElementById('btn-modal-remover');
  btnModalRemover.addEventListener('click', removerCliente);

  var tipoMensagem = UTIL.getParameterURL('tipomensagem');
  var mensagem = UTIL.getParameterURL('mensagem');

  if (tipoMensagem !== undefined && mensagem !== undefined){
    mostrarMensagem(tipoMensagem, mensagem);
  }

  /*Fim inicializacao*/
}
