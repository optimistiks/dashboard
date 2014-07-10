var Metric = require('../metric/index');
var moment = require('moment');

var OrderQtyDaily = function () {
    var today = moment();
    today.hour(0);
    today.minute(0);
    today.second(0);

    this.value = 0;
    this.today = today;
};

OrderQtyDaily.prototype = new Metric();

OrderQtyDaily.prototype.recalculate = function (order) {
    var created = moment(order.created);
    if (created.isAfter(this.today) || created.isSame(this.today, 'seconds')) {
        this.value++;
    }
};

module.exports = new OrderQtyDaily();