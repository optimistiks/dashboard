var metric = require("./index");
var moment = require('moment');

describe("orders qty monthly", function () {
    beforeEach(function() {
        metric.value = 0;
    });

    it("should increase it's value if order which created this month passed", function () {
        expect(metric.getValue()).toBe(0);
        var month = moment();
        month.date(1);
        month.hour(0);
        month.minute(0);
        month.second(0);
        metric.recalculate({created: month.toDate()});
        expect(metric.getValue()).toBe(1);
    });

    it("should not increase it's value if order which created before this month passed", function () {
        expect(metric.getValue()).toBe(0);
        var monthBefore = moment();
        monthBefore.subtract('month', 1);
        metric.recalculate({created: monthBefore.toDate()});
        expect(metric.getValue()).toBe(0);
    });
}); 