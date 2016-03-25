var UTIL = (function(){

  var util = {};

  util.loadScript = function (url, callback){
    var script = document.createElement('script');
    script.src = url;
    if (callback!==undefined) {
      script.addEventListener('load', callback);
    }
    var local = document.getElementsByTagName('script')[0].parentNode;
    local.appendChild(script);
  };

  return util;

})();
