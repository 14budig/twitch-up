angular.module('twitch-up').service('eventsService', eventsService);

eventsService.$inject = ['$http', '$q', '$location'];
function eventsService($http, $q, $location){
  var self = this;
  self.events = [];
  self.event = {};
  self.getEvents = getEvents;
  self.getEvent = getEvent;
  self.getTimeZone = getTimeZone;
  self.post = post;
  self.update = update;

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

  self.name = function(){
    var cookies = document.cookie.split('; ');
    for(var i = 0; i < cookies.length; i++){
      var cookie = cookies[i].trim();
      if(cookie.indexOf('name=') == 0){
        return cookie.slice(5)
      }
    }
  }

  function post(form){
    console.log(form);
    $http.post('/api/events', form)
      .then(submitSuccess, submitError);


    function submitSuccess(response){
      console.log(response.data);
      $location.path('/events/'+response.data._id);
    }
    function submitError(error){
      console.log('there was an error: ', error);
    }
  }

  function update(name, event){
    console.log('updating');
    console.log(name);
    console.log(event);
    var def = $q.defer();
    $http({
      method:'PUT',
      url: '/api/events/'+event._id,
      data: {name: name, participants: event.participants}
    }).then(function(response){
      self.event = response.data;
      def.resolve(self.event);
    },function(err){
      console.log('there was an error: ', error);
      self.ladder.error = {error: error};
      // oh noes!  error - reject the deferred - at this point we get to choose what we send on to the controller
      def.reject(self.ladder.error);
    });
    return def.promise;
  }


  function getTimeZone(){
    return "-0700";
  }
}
