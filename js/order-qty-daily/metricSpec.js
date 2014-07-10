var metric = require("./index");
var moment = require('moment');

describe("orders qty daily", function () {
    beforeEach(function() {
        metric.value = 0;
    });

    it("should increase it's value if order which created today passed", function () {
        expect(metric.getValue()).toBe(0);
        var today = moment();
        today.hour(0);
        today.minute(0);
        today.second(0);
        metric.recalculate({created: today.toDate()});
        expect(metric.getValue()).toBe(1);
    });

    it("should not increase it's value if order which created yesterday passed", function () {
        expect(metric.getValue()).toBe(0);
        var yesterday = moment();
        yesterday.subtract('days', 1);
        metric.recalculate({created: yesterday.toDate()});
        expect(metric.getValue()).toBe(0);
    });
}); 