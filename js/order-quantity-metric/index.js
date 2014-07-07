var Metric = require('../metric/index');

var OrderQuantityMetric = function () {
    this.today = new Date();
    this.today.setHours(0);
    this.today.setMinutes(0);
    this.today.setSeconds(0);
};

OrderQuantityMetric.prototype = new Metric();

OrderQuantityMetric.prototype.recalculate = function (order) {
    var created = new Date(order.created);
    if (created >= this.today) {
        this.value++;
    }
};

module.exports = new OrderQuantityMetric();