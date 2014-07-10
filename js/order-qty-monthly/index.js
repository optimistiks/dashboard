var Metric = require('../metric/index');
var moment = require('moment');

var OrderQtyMonthly = function () {
    this.value = 0;

    var month = moment();
    month.date(1);
    month.hour(0);
    month.minute(0);
    month.second(0);

    this.month = month;
};

OrderQtyMonthly.prototype = new Metric();

OrderQtyMonthly.prototype.recalculate = function (order) {
    var created = moment(order.created);
    if (created.isAfter(this.month) || created.isSame(this.month, 'seconds')) {
        this.value++;
    }
};

module.exports = new OrderQtyMonthly();