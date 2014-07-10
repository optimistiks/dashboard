var Metric = require('../metric/index');

var OrderQtyDaily = function () {
    this.value = 0;
    this.today = new Date();
    this.today.setHours(0);
    this.today.setMinutes(0);
    this.today.setSeconds(0);
};

OrderQtyDaily.prototype = new Metric();

OrderQtyDaily.prototype.recalculate = function (order) {
    var created = new Date(order.created);
    if (created >= this.today) {
        this.value++;
    }
};

module.exports = new OrderQtyDaily();