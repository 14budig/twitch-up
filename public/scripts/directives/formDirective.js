angular.module('twitch-up').directive('formD', formD);

function formD(){
  var directive = {
    restrict: 'C',
    templateUrl: '/templates/formDirective',
    replace: false
  }
  return directive;
}
