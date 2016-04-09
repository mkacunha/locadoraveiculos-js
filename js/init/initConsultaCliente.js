window.onload = init;

function init(){
  UTIL.loadScript('lib/jquery/dist/jquery.min.js', function(){
    UTIL.loadScript('lib/bootstrap/dist/js/bootstrap.min.js', function(){
      UTIL.loadScript('js/menu.js');
      UTIL.loadScript('js/consultaCliente.js', function(){
        AppConsultaCliente.init();
      });

    });
  });
}
