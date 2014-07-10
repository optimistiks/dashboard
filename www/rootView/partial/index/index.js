angular.module('rootView').controller('IndexCtrl', function ($scope, sockjs) {

    $scope.messages = [];

    sockjs.setHandler('open', function (event) {
        console.log('SOCKET open', arguments);
    });

    sockjs.setHandler('close', function (event) {
        console.log('SOCKET close', arguments);
    });

    sockjs.setHandler('message', function (event) {
        $scope.messages.push(event.data);
        console.log('SOCKET message', arguments);
    });
});