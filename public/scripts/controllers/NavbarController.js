angular.module('twitch-up').controller('NavbarController', NavbarController);
NavbarController.$inject = ['eventsService','$scope'];

function NavbarController(eventsService, $scope){
  var vm = this;
  vm.name = eventsService.name();

}
