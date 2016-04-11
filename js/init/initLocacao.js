window.onload = init;

function init(){
  UTIL.loadScript('lib/jquery/dist/jquery.min.js', function(){
    UTIL.loadScript('lib/bootstrap/dist/js/bootstrap.min.js', function(){
      UTIL.loadScript('js/menu.js');

      UTIL.loadScript('js/mask.js', function(){
        UTIL.loadScript('js/locacao.js', function(){
          AppLocacao.init();
        });
      });

    });
  });
}
