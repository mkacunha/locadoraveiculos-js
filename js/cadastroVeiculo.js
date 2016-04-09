var AppCadastroVeiculo = (function cadastroVeiculo(){

  var app = {};
  var Storage = window.localStorage;
  var veiculos = [];
  var acao = '';

  function Veiculo(id, marca, modelo, ano, cor, placa, opcionais, valorDiaria, valorKm){
    this.id = id;
    this.marca = marca;
    this.modelo = modelo;
    this.ano = ano;
    this.cor = cor;
    this.placa = placa;
    this.opcionais = opcionais;
    this.valorDiaria = valorDiaria;
    this.valorKm = valorKm;
  }

  function limparCampos(){
    UTIL.limparCampos();
  }

  function salvar(){
    if (camposValidados()){
      var veiculo = novoVeiculo();
      var veiculosAux = [];
      var mensagem = '';
      buscarVeiculos();

      if (acao === 'editar'){
        for (var i = 0; i < veiculos.length; i++) {
          var veiculoAux = veiculos[i];
          if (veiculoAux.id == veiculo.id){
            veiculosAux.push(veiculo);
          } else{
            veiculosAux.push(veiculoAux);
          }
        }
        veiculos = veiculosAux;

        mensagem = 'Registro alterado com sucesso !';
      } else {
        veiculos.push(veiculo);
        mensagem = 'Novo registro salvo com sucesso !';
      }

      Storage.setItem('TB_VEICULO', JSON.stringify(veiculos));
      limparCampos();

      redirecionarConsulta('informacao', mensagem);
    }
  }

  function redirecionarConsulta(tipoMensagem, mensagem){
  //  var url = 'file:///Volumes/Dados%20mac/MAIKO/WORKSPACE_JAVASCRIPT/locadora/ConsultaVeiculo.html?tipomensagem=' + tipoMensagem + '&mensagem=' + mensagem;
    var url =  'http://' + window.location.host + '/ConsultaVeiculo.html?tipomensagem=' + tipoMensagem + '&mensagem=' + mensagem;
    window.location = url;
  }

  function camposValidados(){
    var erros = UTIL.validaCamposRequeridos();
    var isContinuar = true;

    if ((edPlaca().value.length > 0) && (edPlaca().value.length != 8)){
      erros.push(novoErro('Placa inválida', 'Placa do veículo informada é inválida !'));
    }

    if (erros.length === 0){
      return true;
    } else{
      UTIL.imprimirErros(erros, 'mensagens-erro', 'template-mensagem-erro');
      return false;
    }
  }

  function novoErro(causa, mensagem){
    return new UTIL.Erro(causa, mensagem);
  }

  function novoVeiculo(){
    var id = null;

    if (acao === 'editar'){
      id = edID().value;
    } else {
      id = UTIL.proximaSequencia('SEQ_TB_VEICULO');
    }

    var veiculo  = new Veiculo(id, edMarca().value,edModelo().value,edAno().value,edCor().value,edPlaca().value,edOpcionais().value, edValorDiaria().value, edValorKm().value);
    return veiculo;
  }

  function edID(){
    return document.getElementById('edId');
  }

  function edMarca(){
    return document.getElementById('edMarca');
  }

  function edModelo(){
    return document.getElementById('edModelo');
  }

  function edAno(){
    return document.getElementById('edAno');
  }

  function edCor(){
    return document.getElementById('edCor');
  }

  function edPlaca(){
    return document.getElementById('edPlaca');
  }

  function edOpcionais(){
    return document.getElementById('edOpcionais');
  }

  function edValorDiaria(){
    return document.getElementById('edValorDiaria');
  }

  function edValorKm(){
    return document.getElementById('edValorKm');
  }

  function validaAno(){
    edAno().value = edAno().value.replace(/[^0-9 ]/gmi,'');
  }

  function buscarVeiculos(){
    var TB_VEICULO = Storage.getItem('TB_VEICULO');
    if (TB_VEICULO!==null) {
      veiculos = JSON.parse(TB_VEICULO);
    } else {
      veiculos = [];
    }
  }

  function editarVeiculo(){
    var id = UTIL.getParameterURL('id');

    buscarVeiculos();
    for (var i = 0; i < veiculos.length; i++) {
      var veiculo = veiculos[i];
      if (veiculo.id == id){
        preencheCampos(veiculo);
        continue;
      }
    }
  }

  function preencheCampos(veiculo){
    edID().value = veiculo.id;
    edMarca().value = veiculo.marca;
    edModelo().value = veiculo.modelo;
    edAno().value = veiculo.ano;
    edCor().value = veiculo.cor;
    edPlaca().value = veiculo.placa;
    edOpcionais().value = veiculo.opcionais;
    edValorDiaria().value = veiculo.valorDiaria;
    edValorKm().value = veiculo.valorKm;
  }

  function cancelar(){
    var mensagem = 'Ação cancelada !'
    if (acao === 'editar'){
      mensagem = 'Edição do registro foi cancelada !'
    }
    redirecionarConsulta('erro', mensagem);
  }

  function init(){
    btnSalvar = document.getElementById('btnSalvar');
    btnSalvar.addEventListener('click', salvar);

    btnCancelar = document.getElementById('btnCancelar');
    btnCancelar.addEventListener('click', cancelar);

    edAno().addEventListener('keyup', validaAno, true);
    $('#edPlaca').mask('AAA-9999');
    $('#edValorDiaria').mask('000.000.000.000.000,00', {reverse: true});
    $('#edValorKm').mask('000.000.000.000.000,00', {reverse: true});



    acao = UTIL.getParameterURL('acao');

    if (acao === 'editar'){
      editarVeiculo();
    }
  }

  app.init = function(){
    init();
  }

  return app;

})();
