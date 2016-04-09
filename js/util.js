var UTIL = (function(){

  var util = {};
  var Storage = window.localStorage;

  util.loadScript = function (url, callback){
    var script = document.createElement('script');
    script.src = url;
    if (callback!==undefined) {
      script.addEventListener('load', callback);
    }
    var local = document.getElementsByTagName('script')[0].parentNode;
    local.appendChild(script);
  };

  util.somenteNumero =  function (event){
    var _key = (window.Event) ? event.which : event.keyCode;

    if (_key > 95 && _key < 106) {
      return true;
    }
    else if (_key > 47 && _key < 58) {
      return true;
    }
    else {
      console.log('aqui');
      return false;
    }
  }

  util.replaceWithData = function (target, obj) {
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        var pattern = '\{\{' + prop + '\}\}';
        var er = new RegExp(pattern, 'g');
        target.innerHTML = target.innerHTML.replace(er,obj[prop]);
      }
    }
  };

  util.getParameterURL = function (parameter){
    var  a =  window.location.search.substr(1).split('&').concat(window.location.hash.substr(1).split("&"));

    if (typeof a === "string")
    a = a.split("#").join("&").split("&");

    if (!a) return {};

    var b = {};
    for (var i = 0; i < a.length; ++i){
      var p = a[i].split('=');

      if (p.length != 2) continue;

      b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
    }
    return b[parameter];
  }

  util.Erro = function(causa, descricao){
    this.causa = causa;
    this.descricao = descricao;
  }

  util.imprimirErros = function (erros, listaImprimirErros, templateMensagemErro){
    var lista = document.getElementById(listaImprimirErros);    
    lista.textContent = '';
    for (var i = 0; i < erros.length; i++) {
      var erro = erros[i];
      var templateLista = document.getElementById(templateMensagemErro);
      var copiaTemplate = templateLista.content.firstElementChild.cloneNode(true);
      UTIL.replaceWithData(copiaTemplate, erro);
      lista.appendChild(copiaTemplate);
    }
  }

  util.validaCamposRequeridos = function(){
    var erros = []
    var camposRequeridos = document.getElementsByClassName('requerido');
    for (var i  = 0; i < camposRequeridos.length; i++){
      campo = camposRequeridos[i];
      if (campo.value.length < 1){
        var labelCampo = campo.getAttribute('data-label');
        if (labelCampo == null){
          labelCampo =  campo.getAttribute('id')
        }

        var erro =  new util.Erro('Campo obrigatório', 'O campo "' +  labelCampo + '" é requerido, deve ter um valor !');
        erros.push(erro);
      }
    }
    return erros;
  }

  util.limparCampos = function(){
    var campos = document.getElementsByClassName('limpar');
    for (var i  = 0; i < campos.length; i++){
      campo = campos[i];
      campo.value = '';
    }
  }

  util.proximaSequencia = function(nomeSequencia){
    var sequencia = Storage.getItem(nomeSequencia);
    if (sequencia !== null){
      sequencia++;
    } else {
      sequencia = 1;
    }

    Storage.setItem(nomeSequencia, sequencia);
    return sequencia;
  }

  /*
  n = numero a converter
  c = numero de casas decimais
  d = separador decimal
  t = separador milhar
  */
  util.formatarValorMonetario = function (n, c, d, t){
    c = isNaN(c = Math.abs(c)) ? 2 : c, d = d == undefined ? "," : d, t = t == undefined ? "." : t, s = n < 0 ? "-" : "", i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", j = (j = i.length) > 3 ? j % 3 : 0;
    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
  }

  return util;
})();
