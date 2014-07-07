var Metric = function () {
    this.value = 0;
};

Metric.prototype = {};

Metric.prototype.recalculate = function () {};

Metric.prototype.getValue = function () {
    return parseInt(this.value, 10);
};

module.exports = Metric;