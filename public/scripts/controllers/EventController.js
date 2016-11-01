angular.module('twitch-up').controller('EventController', EventController);
EventController.$inject = ['eventsService','$scope', '$routeParams'];

function EventController(eventsService, $scope, $routeParams){
  var vm = this;
  vm.event = eventsService.getEvent($routeParams.id);
}
