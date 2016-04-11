window.onload = init;

function init(){

  var app = {};
  var Storage = window.localStorage;
  var clientes = [];
  var veiculos = [];
  var clienteSelecionado = null;
  var veiculoSelecionado = null;

  function simularLocacao(){
    if (camposValidados()){
      if (opcaoPeriodo().checked){
        var quantidadeDias = 0;
        var ValorTotal = 0;
        var valorDiaria = veiculoSelecionado.valorDiaria.replace('.', '').replace(',', '.');

        quantidadeDias = Math.ceil((getDataFim().getTime()-getDataInicio().getTime())/1000/60/60/24);

        if (quantidadeDias === 0){
          quantidadeDias = 1;
        }

        edQuantidadeDias().value = quantidadeDias;

        if (!(isNaN(valorDiaria))){
          var total = quantidadeDias * valorDiaria;
          edValorSimulacao().value = UTIL.formatarValorMonetario(total, 2, ',', '.');
        }
      } else {
        var quantidadeKm = edQuantidadeKm().value.replace('.', '').replace(',', '.');
        var valorKm = veiculoSelecionado.valorKm.replace('.', '').replace(',', '.');

        if (!(isNaN(valorKm)) && !(isNaN(quantidadeKm))){
          var total = quantidadeKm * valorKm;
          edValorSimulacao().value = UTIL.formatarValorMonetario(total, 2, ',', '.');
        }
      }
    }
  }

  function camposValidados(){
    var erros = [];

    var lista = document.getElementById('mensagens-erro');
    lista.textContent = '';

    if (clienteSelecionado == null){
      erros.push(novoErro('Cliente não selecionado', 'Cliente deve ser selecionado para realizar uma simulação !'));
    }

    if (veiculoSelecionado == null){
      erros.push(novoErro('Veículo não selecionado', 'Veículo deve ser selecionado para realizar uma simulação !'));
    }

    if (opcaoPeriodo().checked){
      if (edDataInicio().value.length < 1){
        erros.push(novoErro('Data de início não selecionado', 'Data de início deve ser informada para realizar uma simulação !'));
      }

      if (edDataFim().value.length < 1){
        erros.push(novoErro('Data fim não selecionado', 'Data fim deve ser informada para realizar uma simulação !'));
      }

      var data_1 = getDataInicio();
      var data_2 = getDataFim();

      if (data_1 > data_2) {
        erros.push(novoErro('Data fim menor que data início', 'Data de fim deve ser maior ou igual a data início !'));
      }

      if (data_1 < getDataCorrente()) {
        erros.push(novoErro('Data início menor que a data atual', 'Data de início deve ser maior ou igual a data atual !'));
      }
    } else {
      if (edOrigem().value.length < 1){
        erros.push(novoErro('Origem não informado', 'Origem deve ser informado para realizar a simulação !'));
      }

      if (edDestino().value.length < 1){
        erros.push(novoErro('Destino não informado', 'Destino deve ser informado para realizar a simulação !'));
      }
    }

    if (erros.length === 0){
      return true;
    } else{
      UTIL.imprimirErros(erros, 'mensagens-erro', 'template-mensagem-erro');
      return false;
    }
  }

  function Locacao(id, idCliente, nomeCliente, idVeiculo, descricaoVeiculo, valor, resumo){
    this.id = id;
    this.data = getDataCorrenteToString();
    this.status = 'ABERTA';
    this.idCliente = idCliente;
    this.nomeCliente = nomeCliente;
    this.idVeiculo = idVeiculo;
    this.descricaoVeiculo = descricaoVeiculo;
    this.valor = valor;
    this.resumo = resumo;
  }

  function gerarSimulacao(){
    var erros = [];
    var isContinuar = true;

    if (edValorSimulacao().value.length < 1){
      erros.push(novoErro('Valor simulação não informado', 'Valor da simulação deve ser informado !'));
      isContinuar = false;
    }

    if (camposValidados() && isContinuar){

      var resumo = '';
      if (opcaoPeriodo().checked){
        resumo = 'Locação realizada para o período ' + edDataInicio().value + ' a ' + edDataFim().value + ' (' + edQuantidadeDias().value +' dia(s)), valor de diária R$ ' + edValorDiaria().value + ', valor total R$ ' + edValorSimulacao().value;
      } else{
        resumo = 'Locação realizada para o roteiro de ' + edOrigem().value + ' a ' + edDestino().value + ' (' + edQuantidadeKm().value +' km), valor por KM R$ ' + edValorKm().value + ', valor total R$ ' + edValorSimulacao().value;
      }

      var id = UTIL.proximaSequencia('SEQ_TB_LOCACAO');

      var locacoes = [];

      var TB_LOCACAO = Storage.getItem('TB_LOCACAO');
      if (TB_LOCACAO!==null) {
        locacoes = JSON.parse(TB_LOCACAO);
      } else {
        locacoes = [];
      }

      var locacao = new Locacao(id, clienteSelecionado.id, clienteSelecionado.nome, veiculoSelecionado.id, veiculoSelecionado.modelo + '(' + veiculoSelecionado.marca + ')', edValorSimulacao().value, resumo);

      locacoes.push(locacao);
      Storage.setItem('TB_LOCACAO', JSON.stringify(locacoes));
      UTIL.limparCampos();

      //var url = 'file:///Volumes/Dados%20mac/MAIKO/WORKSPACE_JAVASCRIPT/locadora/Locacao.html?id=' + id;
      var url =  'http://' + window.location.host + '/Locacao.html?id=' + id;
      window.open(url);
    }

    if (!isContinuar){
      UTIL.imprimirErros(erros, 'mensagens-erro', 'template-mensagem-erro');
    }
  }

  function getDataInicio(){
    var dataString = edDataInicio().value;
    return new Date(dataString.substr(6,4), dataString.substr(3,2)-1, dataString.substr(0,2));
  }

  function getDataFim(){
    var dataString = edDataFim().value;
    return new Date(dataString.substr(6,4), dataString.substr(3,2)-1, dataString.substr(0,2));
  }

  function getDataCorrente(){
    data = new Date();
    return new Date(data.getFullYear(), data.getMonth(), data.getDate());
  }

  function getDataCorrenteToString(){
    var data = new Date();
    var dia = data.getDate();
    var mes = data.getMonth();
    var ano = data.getFullYear();

    var diaStr = ' ';
    var mesStr = ' ';

    if (dia < 10){
      diaStr = '0' + dia;
    } else {
      diaStr = dia;
    }

    if (mes < 10){
      mesStr = '0' + mes;
    } else {
      mesStr = mes;
    }

    console.log(diaStr);
    return  diaStr + '/' + mesStr + '/' + ano;
  }

  function novoErro(causa, mensagem){
    return new UTIL.Erro(causa, mensagem);
  }

  function buscarClientes(){
    var TB_CLIENTE = Storage.getItem('TB_CLIENTE');
    if (TB_CLIENTE!==null) {
      clientes = JSON.parse(TB_CLIENTE);
    } else {
      clientes = [];
    }
  }

  function buscarVeiculos(){
    var TB_VEICULO = Storage.getItem('TB_VEICULO');
    if (TB_VEICULO!==null) {
      veiculos = JSON.parse(TB_VEICULO);
    } else {
      veiculos = [];
    }
  }

  function inicializarSelects(){
    buscarVeiculos();

    var selectVeiculo = document.getElementById('select-veiculo');
    for (var i = 0; i < veiculos.length; i++) {
      var veiculo = veiculos[i];
      var option = document.createElement('option');
      option.setAttribute('value', veiculo.id);
      option.innerText = veiculo.id + ' - ' + veiculo.modelo + ' (' + veiculo.marca + ')';
      selectVeiculo.appendChild(option);
    }

    buscarClientes();

    var selectCliente = document.getElementById('select-cliente');
    for (var i = 0; i < clientes.length; i++) {
      var cliente = clientes[i];
      var option = document.createElement('option');
      option.setAttribute('value', cliente.id);
      option.innerText = cliente.id + ' - ' + cliente.nome + ' (' + cliente.documento + ')';
      selectCliente.appendChild(option);
    }
  }

  $('#select-veiculo').on('changed.bs.select', function (e) {
    veiculoSelecionado = getVeiculoSelecionado();
    if (veiculoSelecionado != null){
      setVeiculoSelecionado();
    }
  });

  $('#select-cliente').on('changed.bs.select', function (e) {
    clienteSelecionado = getClienteSelecionado();
    if (clienteSelecionado != null){
      setClienteSelecionado();
    }
  });

  function setVeiculoSelecionado(){
    edValorDiaria().value = veiculoSelecionado.valorDiaria;
    edValorKm().value = veiculoSelecionado.valorKm;
  }

  function setClienteSelecionado(){
    console.log(clienteSelecionado);
  }

  function getVeiculoSelecionado(){
    var idSelecionado = $('#select-veiculo').selectpicker('val');
    for (var i = 0; i < veiculos.length; i++){
      var veiculo = veiculos[i];
      if (veiculo.id == idSelecionado){
        return veiculo;
      }
    }
    return null;
  }

  function getClienteSelecionado(){
    var idSelecionado = $('#select-cliente').selectpicker('val');
    for (var i = 0; i < clientes.length; i++){
      var cliente = clientes[i];
      if (cliente.id == idSelecionado){
        return cliente;
      }
    }
    return null;
  }


  function grupoLocacaoPeriodo(){
    return document.getElementById('grupoLocacaoPeriodo');
  }

  function grupoLocacaoTrajeto(){
    return document.getElementById('grupoLocacaoTrajeto');
  }

  function grupoInfoPeriodo(){
    return document.getElementById('grupoInfoPeriodo');
  }

  function grupoInfoTrajeto(){
    return document.getElementById('grupoInfoTrajeto');
  }

  function opcaoPeriodo(){
    return document.getElementById('opcaoPeriodo');
  }

  function opcaoTrajeto(){
    return document.getElementById('opcaoTrajeto');
  }

  function edDataInicio(){
    return document.getElementById('edDataInicio');
  }

  function edDataFim(){
    return document.getElementById('edDataFim');
  }

  function edOrigem(){
    return document.getElementById('edOrigem');
  }

  function edDestino(){
    return document.getElementById('edDestino');
  }

  function edValorDiaria(){
    return document.getElementById('edValorDiaria');
  }

  function edQuantidadeDias(){
    return document.getElementById('edQuantidadeDias');
  }

  function edValorKm(){
    return document.getElementById('edValorKm');
  }

  function edQuantidadeKm(){
    return document.getElementById('edQuantidadeKm');
  }

  function btnSimular(){
    return document.getElementById('btnSimular');
  }

  function edValorSimulacao(){
    return document.getElementById('edValorSimulacao');
  }

  function btnGerarLocacao (){
    return document.getElementById('btnGerarLocacao');
  }

  function mapa(){
    return document.getElementById('mapa');
  }

  function defineOpcaoLocacao(){
    edDataInicio().value = '';
    edDataFim().value = '';
    edOrigem().value = '';
    edDestino().value = '';

    if (opcaoPeriodo().checked){
      grupoLocacaoPeriodo().style.display = 'block';
      grupoLocacaoTrajeto().style.display = 'none';

      grupoInfoPeriodo().style.display = 'block';
      grupoInfoTrajeto().style.display = 'none';

      mapa().style.display = 'none';
    } else {
      grupoLocacaoPeriodo().style.display = 'none';
      grupoLocacaoTrajeto().style.display = 'block';

      grupoInfoPeriodo().style.display = 'none';
      grupoInfoTrajeto().style.display = 'block';

      mapa().style.display = 'block';
    }
  }


  inicializarSelects();
  $('select').selectpicker('refresh');

  veiculoSelecionado = getVeiculoSelecionado();
  clienteSelecionado = getClienteSelecionado()
  setVeiculoSelecionado();
  setClienteSelecionado();

  btnSimular().addEventListener('click', simularLocacao, true);
  btnGerarLocacao().addEventListener('click', gerarSimulacao, true);
  opcaoPeriodo().addEventListener('click', defineOpcaoLocacao, true);
  opcaoTrajeto().addEventListener('click', defineOpcaoLocacao, true);

  defineOpcaoLocacao();


  $('#edGrupoDataInicio').datetimepicker({
    locale: 'pt-br',
    format: 'DD/MM/YYYY'
  });

  $('#edGrupoDataFim').datetimepicker({
    locale: 'pt-br',
    format: 'DD/MM/YYYY'
  });


  $('#edValorSimulacao').mask('000.000.000.000.000,00', {reverse: true});


}
