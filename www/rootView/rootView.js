angular.module('rootView', ['ui.bootstrap','ui.utils','ui.router','ngAnimate']);

angular.module('rootView').config(function($stateProvider) {

    $stateProvider.state('index', {
        url: '/',
        templateUrl: 'rootView/partial/index/index.html'
    });
    /* Add New States Above */

});

