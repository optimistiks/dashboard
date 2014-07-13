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

        var color_domain = [50, 150, 350, 750, 1500]
        var color = d3.scale.threshold()
            .domain(color_domain)
            .range(["#adfcad", "#ffcb40", "#ffba00", "#ff7d73", "#ff4e40", "#ff1300"]);

        var ready = function (error, map, data) {
            console.log('MAP READY', error, map, data);

            svg.append("g")
                .attr("class", "region")
                .selectAll("path")
                .data(topojson.feature(map, map.objects.russia).features)
                .enter().append("path")
                .attr("d", path)
                .style("fill", function(d) {
                    console.log('REGION', d.properties.region);
                    return color(50);
                })
                .style("opacity", 0.8)
        };

        queue()
            .defer(d3.json, "/rootView/partial/index/russia_1e-7sr.json")
            .await(ready);
    });
});