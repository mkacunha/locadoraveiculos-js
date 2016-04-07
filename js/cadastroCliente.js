window.onload = init;

function init(){

  var Storage = window.localStorage;
  var clientes = [];
  var acao = '';

  function Cliente(id, tipoDocumento, documento, cnh, nome, telefone, celular, cep, logradouro, numero, complemento, bairro, cidade, uf){
    this.id = id;
    this.tipoDocumento = tipoDocumento;
    this.documento = documento;
    this.cnh = cnh;
    this.nome = nome;
    this.telefone = telefone;
    this.celular = celular;
    this.cep = cep;
    this.logradouro = logradouro;
    this.numero = numero;
    this.complemento = complemento;
    this.bairro = bairro;
    this.cidade = cidade;
    this.uf = uf;
  }

  function novoCliente(){
    var tipoDocumento = 'CPF';
    if (opcaoCnpj().checked){
      tipoDocumento = 'CNPJ';
    }

    var id = null;

    if (acao === 'editar'){
      id = edId().value;
    } else {
      id = UTIL.proximaSequencia('SEQ_TB_CLIENTE');
    }
    return new Cliente(id, tipoDocumento, edDocumento().value, edCnh().value, edNome().value, edTelefone().value, edCelular().value, edCep().value, edLogradouro().value, edNumero().value, edComplemento().value, edBairro().value, edCidade().value, edUf().value);
  }


  function limparCampos(){
    UTIL.limparCampos();
  }

  function salvar(){
    if (camposValidados()){
      var cliente = novoCliente();
      var clientesAux = [];
      var mensagem = '';
      buscarClientes();

      if (acao === 'editar'){
        for (var i = 0; i < clientes.length; i++) {
          var clienteAux = clientes[i];
          if (clienteAux.id == cliente.id){
            clientesAux.push(cliente);
          } else{
            clientesAux.push(clienteAux);
          }
        }
        clientes = clientesAux;

        mensagem = 'Registro alterado com sucesso !';
      } else {
        clientes.push(cliente);
        mensagem = 'Novo registro salvo com sucesso !';
      }

      Storage.setItem('TB_CLIENTE', JSON.stringify(clientes));
      limparCampos();

      redirecionarConsulta('informacao', mensagem);
    }
  }

  function redirecionarConsulta(tipoMensagem, mensagem){
    var url = 'file:///Volumes/Dados%20mac/MAIKO/WORKSPACE_JAVASCRIPT/locadora/ConsultaCliente.html?tipomensagem=' + tipoMensagem + '&mensagem=' + mensagem;
    window.location = url;
  }

  function camposValidados(){
    var erros = UTIL.validaCamposRequeridos();

    if (edDocumento().value.length > 0) {
      if (opcaoCpf().checked){
        if (edDocumento().value.length < 14){
          erros.push(novoErro('CPF inválido', 'CPF do cliente informado é inválido !'));
        }
      } else {
        if (edDocumento().value.length < 18){
          erros.push(novoErro('CNPJ inválido', 'CNPJ do cliente informado é inválido !'));
        }
      }
    }

    if ((edTelefone().value.length > 0) && (edTelefone().value.length < 14)){
      erros.push(novoErro('Telefone inválido', 'Telefone do cliente informado é inválido !'));
    }

    if ((edCelular().value.length > 0) && (edCelular().value.length < 14)){
      erros.push(novoErro('Celular inválido', 'Celular do cliente informado é inválido !'));
    }

    if ((edCep().value.length > 0) && (edCep().value.length < 9)){
      erros.push(novoErro('CEP inválido', 'CEP do cliente informado é inválido !'));
    }

    if (erros.length === 0){
      return true;
    } else{
      UTIL.imprimirErros(erros, 'mensagens-erro', 'template-mensagem-erro');
      return false;
    }
  }


  function buscarClientes(){
    var TB_CLIENTE = Storage.getItem('TB_CLIENTE');
    if (TB_CLIENTE!==null) {
      clientes = JSON.parse(TB_CLIENTE);
    } else {
      clientes = [];
    }
  }

  function editarCliente(){
    var id = UTIL.getParameterURL('id');

    buscarClientes();
    for (var i = 0; i < clientes.length; i++) {
      var cliente = clientes[i];
      if (cliente.id == id){
        preencheCampos(cliente);
        continue;
      }
    }
  }

  function preencheCampos(cliente){
    opcaoCpf().checked = true;
    if (cliente.tipoDocumento === 'CNPJ'){
      opcaoCnpj().checked = true;
    }

    definirMascaraDocumento();

    edId().value = cliente.id;
    edDocumento().value = cliente.documento;
    edCnh().value = cliente.cnh;
    edNome().value = cliente.nome;
    edTelefone().value = cliente.telefone;
    edCelular().value = cliente.celular;
    edCep().value = cliente.cep;
    edLogradouro().value = cliente.logradouro;
    edNumero().value = cliente.numero;
    edComplemento().value = cliente.complemento;
    edBairro().value = cliente.bairro;
    edCidade().value = cliente.cidade;
    edUf().value = cliente.uf;
  }

  function consultaCep() {
    var cep = edCep().value;

    if ((cep != "") && (cep.length === 9)) {
      $.get('https://viacep.com.br/ws/' + cep + '/json/',
      function(result){
        if (!result.erro){
          edLogradouro().value = (result.logradouro);
          edBairro().value = (result.bairro);
          edCidade().value = (result.localidade);
          edUf().value = (result.uf);
        }
      });
    }
  }

  function cancelar(){
    var mensagem = 'Ação cancelada !'
    if (acao === 'editar'){
      mensagem = 'Edição do registro foi cancelada !'
    }
    redirecionarConsulta('erro', mensagem);
  }


  function novoErro(causa, mensagem){
    return new UTIL.Erro(causa, mensagem);
  }


  function edId(){
    return document.getElementById('edId');
  }

  function opcaoCpf(){
    return document.getElementById('opcaoCpf');
  }

  function opcaoCnpj(){
    return document.getElementById('opcaoCnpj');
  }

  function edDocumento(){
    return document.getElementById('edDocumento');
  }

  function edCnh(){
    return document.getElementById('edCnh');
  }

  function edNome(){
    return document.getElementById('edNome');
  }

  function edTelefone(){
    return document.getElementById('edTelefone');
  }

  function edCelular(){
    return document.getElementById('edCelular');
  }

  function edCep(){
    return document.getElementById('edCep');
  }

  function edLogradouro(){
    return document.getElementById('edLogradouro');
  }

  function edNumero(){
    return document.getElementById('edNumero');
  }

  function edComplemento(){
    return document.getElementById('edComplemento');
  }

  function edBairro(){
    return document.getElementById('edBairro');
  }

  function edCidade(){
    return document.getElementById('edCidade');
  }

  function edUf(){
    return document.getElementById('edUf');
  }

  function definirMascaraDocumento(){
    edDocumento().value = '';
    var mascara = "000.000.000-00";
    if (opcaoCnpj().checked){
      mascara = "00.000.000/0000-00"
    }
    $('#edDocumento').mask(mascara);
  }

  function limparCampos(){
    UTIL.limparCampos();
  }

  /* Inicialização */
  btnSalvar = document.getElementById('btnSalvar');
  btnSalvar.addEventListener('click', salvar);

  btnCancelar = document.getElementById('btnCancelar');
  btnCancelar.addEventListener('click', cancelar);

  acao = UTIL.getParameterURL('acao');

  opcaoCpf().addEventListener('click', definirMascaraDocumento, true);
  opcaoCnpj().addEventListener('click', definirMascaraDocumento, true);
  edCep().addEventListener("focusout", consultaCep);

  $('#edTelefone').mask('(00) 0000-00000');
  $('#edCelular').mask('(00) 0000-00000');
  $('#edCep').mask('00000-000');
  $('#edUf').mask('SS');
  $('#edCnh').mask('000000000000000');

  definirMascaraDocumento();

  if (acao === 'editar'){
    editarCliente();
  }

  /* Fim inicialização */
}
