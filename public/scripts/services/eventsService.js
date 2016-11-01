angular.module('twitch-up').service('eventsService', eventsService);

eventsService.$inject = ['$http', '$q'];
function eventsService($http, $q){
  var self = this;
  self.events = [];
  self.event = {};
  self.getEvents = getEvents;
  self.getEvent = getEvent;
  self.getTimeZone = getTimeZone;

  function getEvents(){
    var def = $q.defer();
    $http({
      url:'/api/events',
      method: 'GET'
    }).then(onGetEventsSuccess, onError);

    return def.promise;

    function onGetEventsSuccess(response){
      self.events = response.data;
      def.resolve(self.events);
    }

    function onError(error){
      console.log('there was an error: ', error);
      self.ladder.error = {error: error};
      // oh noes!  error - reject the deferred - at this point we get to choose what we send on to the controller
      def.reject(self.ladder.error);
    }
  }

  function getEvent(eventId){
    var def = $q.defer();
    $http({
      url: '/api/events/'+eventId,
      method: 'GET'
    }).then(getEventSuccess, onEventError);

    return def.promise;

    function getEventSuccess(response){
      self.event = response.data;
      console.log(response.data);
      def.resolve(self.event)
    }

    function onEventError(error){
      console.log('there was an error: ', error);
      self.ladder.error = {error: error};
      // oh noes!  error - reject the deferred - at this point we get to choose what we send on to the controller
      def.reject(self.ladder.error);
    }
  }



  function getTimeZone(){
    return "-0700";
  }
}
