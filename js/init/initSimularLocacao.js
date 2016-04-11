window.onload = init;

function init(){
  UTIL.loadScript('lib/jquery/dist/jquery.min.js', function(){
    UTIL.loadScript('lib/bootstrap/dist/js/bootstrap.min.js', function(){
      UTIL.loadScript('js/menu.js');
      UTIL.loadScript('lib/moment/min/moment.min.js');
      UTIL.loadScript('lib/bootstrap-select/dist/js/bootstrap-select.min.js');
      UTIL.loadScript('lib/eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min.js');
      UTIL.loadScript('lib/moment/locale/pt-br.js');

      UTIL.loadScript('js/mask.js', function(){
        UTIL.loadScript('js/simularLocacao.js', function(){
          AppSimularLocacao.init();
          UTIL.loadScript('js/mapa.js');
          UTIL.loadScript('js/jquery-ui.custom.min.js');
        });
      });

    });
  });
}
