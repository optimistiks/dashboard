angular.module('map', ['ui.bootstrap','ui.utils','ui.router','ngAnimate']);

angular.module('map').config(function($stateProvider) {

    $stateProvider.state('map', {
        url: '/',
        templateUrl: 'map/partial/map/map.html'
    });
    /* Add New States Above */

});

