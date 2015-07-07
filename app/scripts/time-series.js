// Adapted from http://nvd3.org/examples/lineWithFocus.html

(function(window, d3, nv, data, container) {
  nv.addGraph(function() {
    var chart = nv.models.lineWithFocusChart();

    chart.xAxis
        .tickFormat(d3.format(',f'));

    chart.yAxis
        .tickFormat(d3.format(',.2f'));

    chart.y2Axis
        .tickFormat(d3.format(',.2f'));

    d3.select(container)
        .datum(data)
        .transition().duration(500)
        .call(chart);

    nv.utils.windowResize(chart.update);

    return chart;
  });
})(window, d3, nv, window.data.timeSeries, '.time-series svg');