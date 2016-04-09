var AppConsultaLocacao = (function consultaLocacao(){

  var app = {};
  var Storage = window.localStorage;
  var locacoes = [];

  function buscarLocacoes(){
    var TB_LOCACAO = Storage.getItem('TB_LOCACAO');
    if (TB_LOCACAO!==null) {
      locacoes = JSON.parse(TB_LOCACAO);
    } else {
      locacoes = [];
    }
  }

  function imprimeListaLocacoes(){
    var lista = document.getElementById('lista-imprimir');
    lista.textContent = '';
    for (var i = 0; i < locacoes.length; i++) {
      var locacao = locacoes[i];

      var classLabel = 'label-danger';
      var classDisplay = 'display-blick';

      if (locacao.status === 'CONCLUÍDA'){
        classLabel = 'label-success';
        classDisplay = 'display-none';
      }

      var templateLista = document.getElementById('template-lista-imprimir');
      var copiaTemplate = templateLista.content.firstElementChild.cloneNode(true);

      var pattern = '\{\{' + 'label-status' + '\}\}';
      var er = new RegExp(pattern, 'g');
      copiaTemplate.innerHTML = copiaTemplate.innerHTML.replace(er,classLabel);

      pattern = '\{\{' + 'class-display' + '\}\}';
      er = new RegExp(pattern, 'g');
      copiaTemplate.innerHTML = copiaTemplate.innerHTML.replace(er,classDisplay);

      UTIL.replaceWithData(copiaTemplate, locacao);
      lista.appendChild(copiaTemplate);
    }

    var btnsConcluir = document.getElementsByClassName('display-none');

    if (btnsConcluir != undefined && btnsConcluir.length > 0){
      for (var i = 0; i < btnsConcluir.length; i++){
        var btn = btnsConcluir[i];
        btn.style.display = 'none';
      }
    }

  }

  function concluirLocacao(){
    var input = document.getElementById('id-concluir');
    var idLocacao = input.innerText;

    var locacoesAux = [];

    for (var i = 0; i < locacoes.length; i++) {
      var locacao = locacoes[i];
      if (locacao.id == idLocacao){
        locacao.status = 'CONCLUÍDA';
      }
      locacoesAux.push(locacao);
    }

    Storage.setItem('TB_LOCACAO', JSON.stringify(locacoes));
    buscarLocacoes();
    imprimeListaLocacoes();
  }

  $('#modal-concluir').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget);
    var descricao =  button.data('data-descricao-veiculo');

    var modal = $(this)
    modal.find('#ed-descricao-veiculo-concluir').text(descricao);
    modal.find('#id-concluir').text(button.data('id-locacao'));

  });


  function init(){
    buscarLocacoes();
    imprimeListaLocacoes();

    var btnConcluirLocacao = document.getElementById('btn-modal-concluir');
    btnConcluirLocacao.addEventListener('click', concluirLocacao);
  }

  app.init = function(){
    init();
  }

  return app;

})();
