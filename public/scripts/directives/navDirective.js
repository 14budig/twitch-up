angular.module('twitch-up').directive('navbar', navbar);

function navbar(){
  var directive = {
    restrict: 'E',
    templateUrl: '/templates/navbarDirective',
    replace: true
  }
  return directive;
}
