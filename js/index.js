var Menu = ( function controleMenu(){

  var menu = {};
  function abrirCadastroCliente(){
    var div = $('#load-pagina');
    div.empty();
    div.load('/CadastroVeiculo.html');
  }
  function init(){
    $('.navbar-toggle').click(function () {
      $('.navbar-nav').toggleClass('slide-in');
      $('.side-body').toggleClass('body-slide-in');
      $('#search').removeClass('in').addClass('collapse').slideUp(200);
    });

    $('#search-trigger').click(function () {
      $('.navbar-nav').removeClass('slide-in');
      $('.side-body').removeClass('body-slide-in');

    });

    $('#btn-cadastro-veiculo').click(abrirCadastroCliente);
  }

  menu.init = function(){
    init();
  };

  return menu;
})();
