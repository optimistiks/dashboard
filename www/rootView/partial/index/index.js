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

    //d3
    $(document).ready(function () {
        var width = 960;
        var height = 500;

        var svg = d3.select("body").append("svg")
            .attr("width", width)
            .attr("height", height);

        var projection = d3.geo.albers()
            .rotate([-105, 0])
            .center([-10, 65])
            .parallels([52, 64])
            .scale(700)
            .translate([width / 2, height / 2]);

        var path = d3.geo.path().projection(projection);
    });
});