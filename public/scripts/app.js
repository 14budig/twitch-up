console.log('Sanity');

angular.module('twitch-up', ['ngRoute','ui.bootstrap']).config(config);

config.$inject = ['$routeProvider', '$locationProvider'];

function config ($routeProvider, $locationProvider) {}
