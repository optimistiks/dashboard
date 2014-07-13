angular.module('map').controller('MapCtrl', function ($scope) {

    $(document).ready(function () {
        var width = 960;
        var height = 500;

        var svg = d3.select("#map")
            .attr("viewBox", "0 0 " + width + " " + height)
            .attr("preserveAspectRatio", "xMinYMin");

        var projection = d3.geo.albers()
            .rotate([-105, 0])
            .center([-10, 65])
            .parallels([52, 64])
            .scale(700)
            .translate([width / 2, height / 2]);

        var path = d3.geo.path().projection(projection);

//        var color_domain = [50, 150, 350, 750, 1500];
//        var color = d3.scale.threshold()
//            .domain(color_domain)
//            .range(["#adfcad", "#ffcb40", "#ffba00", "#ff7d73", "#ff4e40", "#ff1300"]);;

        var colors = ["#2b908f", "#90ee7e", "#f45b5b", "#7798BF", "#aaeeee", "#ff0066", "#eeaaee",
            "#55BF3B", "#DF5353", "#7798BF", "#aaeeee"];

        var ready = function (error, map, data) {
            console.log('MAP READY', error, map, data);

            var regions = svg.append('g');
            var points = svg.append('g');
            var arcs = svg.append('g');

            regions
                .attr("class", "russia")
                .selectAll("path")
                .data(topojson.feature(map, map.objects.russia).features)
                .enter().append("path")
                .attr("d", path)
                .style("fill", function (d) {
                    return '#2b908f';
                })
                .style("opacity", 0.8);

            var locations = [
                {
                    name: 'Балашиха',
                    lng: 37.9327,
                    lat: 55.796985
                },
                {
                    name: 'Южно-Сахалинск',
                    lng: 142.736913,
                    lat: 46.94379
                }
            ];

            angular.forEach(locations, function (location) {
                var point = points
                    .append("g")
                    .attr("class", "city")
                    .attr("transform", function (d) {
                        return "translate(" + projection([location.lng, location.lat]) + ")";
                    });

                point.append("circle")
                    .attr("r", 3)
                    .style("fill", "white")
                    .style("opacity", 0.1);

                point.append("text")
                    .attr("x", 5)
                    .text(function (d) {
                        return location.name;
                    });
            });
        };

        queue()
            .defer(d3.json, "/map/russia_1e-7sr.json")
            .await(ready);
    });

});