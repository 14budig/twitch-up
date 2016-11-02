angular.module('twitch-up').controller('EventController', EventController);
EventController.$inject = ['eventsService','$scope', '$routeParams'];

function EventController(eventsService, $scope, $routeParams){
  var vm = this;
  vm.current=eventsService.name()
  eventsService.getEvent($routeParams.id).then(function(response){
    vm.event = response;
  });
  console.log(vm.event);

  vm.join=function(){
    vm.event.participants.push(vm.current);
    eventsService.update(vm.current, vm.event).then(function(response){
      vm.event=response;
    });
  }

  vm.leave=function(){
    vm.event.participants.splice(vm.event.participants.indexOf(vm.current));
    eventsService.update(vm.current, vm.event).then(function(response){
      vm.event=response;
    });
  }
}
