angular.module('connection').factory('sockjs', function (socketFactory) {
    return socketFactory({
        url: 'http://localhost:9999'
    });
});