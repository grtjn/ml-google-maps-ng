(function() {
  'use strict';

  angular.module('ml.google-maps', ['ui.map'])
  .filter('object2Array', function() {
    return function(input) {
      var out = [];
      for (var name in input) {
        input[name].__key = name;
        out.push(input[name]);
      }
      return out;
    };
  });

}());
