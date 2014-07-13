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

        var tweenDash = function () {
            //This function is used to animate the dash-array property, which is a
            //  nice hack that gives us animation along some arbitrary path (in this
            //  case, makes it look like a line is being drawn from point A to B)
            var len = this.getTotalLength(),
                interpolate = d3.interpolateString("0," + len, len + "," + len);

            return function (t) {
                return interpolate(t);
            };
        };

        var lineTransition = function (path) {
            path.transition()
                //NOTE: Change this number (in ms) to make lines draw faster or slower
                .duration(3000)
                .attrTween("stroke-dasharray", tweenDash)
                .each("end", function (d, i) {
                    ////Uncomment following line to re-transition
                    //d3.select(this).call(transition);

                    //We might want to do stuff when the line reaches the target,
                    //  like start the pulsating or add a new point or tell the
                    //  NSA to listen to this guy's phone calls
                    //doStuffWhenLineFinishes(d,i);
                });
        };

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
                    .attr("r", 1)
                    .style("fill", "white")
                    .style("opacity", 0.5);

                point.append("text")
                    .attr("x", 5)
                    .text(function (d) {
                        return location.name;
                    });
            });

            var links = [
                {
                    type: "LineString",
                    coordinates: [
                        [ locations[0].lng, locations[0].lat ],
                        [ locations[1].lng, locations[1].lat ]
                    ]
                }
            ];

            var pathArcs = arcs.selectAll(".arc")
                .data(links);

            //enter
            pathArcs.enter()
                .append("path").attr({
                    'class': 'arc'
                }).style({
                    fill: 'none',
                });

            //update
            pathArcs.attr({
                //d is the points attribute for this path, we'll draw
                //  an arc between the points using the arc function
                d: path
            })
                .style({
                    'stroke': '#7798BF',
                    'stroke-width': '1px'
                })
                // Uncomment this line to remove the transition
                .call(lineTransition);

            //exit
            pathArcs.exit().remove();

        };

        queue()
            .defer(d3.json, "/map/russia_1e-7sr.json")
            .await(ready);
    });

});