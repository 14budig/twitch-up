angular.module('twitch-up').controller('FormController', FormController);
FormController.$inject = ['eventsService','$scope'];

function FormController(eventsService, $scope){
  var vm=this;
  $scope.today = function() {
    $scope.dt = new Date();
  };
  $scope.today();

  $scope.inlineOptions = {
    minDate: new Date(),
    showWeeks: false
  };

  $scope.dateOptions = {
    formatYear: 'yy',
    maxDate: new Date(2020, 5, 22),
    minDate: new Date(),
    startingDay: 1
  };

  $scope.toggleMin = function() {
    $scope.inlineOptions.minDate = new Date();
    $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
  };

  $scope.toggleMin();

  $scope.open = function() {
    $scope.popup.opened = true;
  };

  $scope.setDate = function(year, month, day) {
    $scope.dt = new Date(year, month, day);
    console.log('woo');
  };

  $scope.popup = {
    opened: false
  };

  vm.submit=function(){
    var data = {
      name: $scope.name,
      game:$scope.game,
      description:$scope.description,
      time: $scope.dt,
      creator: eventsService.name()
    }
    console.log($scope.name);
    console.log(data);
    eventsService.post(data);
  }
}
