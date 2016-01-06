var ChartBuilder = (function() {
  var determineOffset = function() {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Charts');
    var charts = sheet.getCharts();
    if (charts.length > 0) {
      return charts[charts.length - 1].getContainerInfo().getAnchorRow() + 1;
    } else {
      return 0;
    }
  }
  
  var addScatterChart = function(xRange, yRange, config) {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Charts');
    var offset = determineOffset();
    
    var chart = sheet.newChart().asScatterChart();
    chart.setTitle([config.y.variable, 'vs', config.x.variable].join(' '))
      .setYAxisTitle(config.y.variable)
      .setXAxisTitle(config.x.variable)
      .addRange(xRange)
      .addRange(yRange)
      .setOption('aggregationTarget', 'category')
      .setOption('pointSize', 1)
      .setOption('legend.position', 'none')
      .setPosition(3, 2, 0 , offset);
      
    if(config.x.axes.invert){ chart.setOption('hAxis.direction', -1); }
    if(config.x.axes.log){ chart.setOption('hAxis.logScale', true); }
    if(config.y.axes.invert){ chart.setOption('vAxis.direction', -1); }
    if(config.y.axes.log){ chart.setOption('vAxis.logScale', true); }

    if(config.x.range && config.x.range.min){ chart.setOption('hAxis.minValue',config.x.range.min); }
    if(config.x.range && config.x.range.max){ chart.setOption('hAxis.maxValue',config.x.range.max); }
    if(config.y.range && config.y.range.min){ chart.setOption('vAxis.minValue',config.y.range.min); }
    if(config.y.range && config.y.range.max){ chart.setOption('vAxis.maxValue',config.y.range.max); }
    
    chart = chart.build();
    sheet.insertChart(chart);
  }
  
  return {
    addScatterChart: addScatterChart
  };
})();
