angular.module('twitch-up').controller('RootController', RootController);
RootController.$inject = ['eventsService','$scope'];

console.log('log');

function RootController(eventsService, $scope){
  var vm = this;
  vm.current=eventsService.name();
  if(document.cookie.name){
    vm.link="/events/new";
  }
  vm.today = new Date();
  vm.timeZone = eventsService.getTimeZone();
  console.log(vm.timeZone);
  console.log('woo!');
  eventsService.getEvents().then(function(data){
    console.log(data);
    vm.events = data;
  });

}
