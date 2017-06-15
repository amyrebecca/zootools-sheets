var ChartBuilder = (function() {
  var determineOffset = function() {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Charts');
    var charts = sheet.getCharts();
    if (charts.length > 0) {
      return charts[charts.length - 1].getContainerInfo().getAnchorRow() + 100;
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

    if(config.trendlines !== 'none'){ 
      var options = {
        0: {
          type: config.trendlines,
          lineWidth: 3,
          opacity: 0.3
        }
      };
      chart.setOption('trendlines', options);
    } 

    chart = chart.build();
    sheet.insertChart(chart);
  }
  
  var addHistogramChart = function(xRange, config) {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Charts');
    var offset = determineOffset();
    var chart = sheet.newChart().asHistogramChart();
    chart.setTitle('Frequency vs ' + config.x.variable)
      .addRange(xRange)
      .setPosition(3, 2, 0, offset);
    
    chart = chart.build();
    sheet.insertChart(chart);
  }

  var addPieChart = function(data, config) {
    var chartDataRange;
    var pieDataSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Pie Chart Data');
    var numColumns = data[0].length;
    var numRows = data.length;
    var columnToStart = pieDataSheet.getLastColumn() + 1;
    var range = pieDataSheet.getRange(1, columnToStart, numRows, numColumns);
    range.setValues(data);
    chartDataRange = pieDataSheet.getRange(1, columnToStart, numRows, numColumns);
    
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Charts');
    var offset = determineOffset();
    var chart = sheet.newChart().asPieChart();
    
    chart.setTitle(config.title)
      .addRange(chartDataRange)
      .setPosition(3, 2, 0, offset);
    
    chart = chart.build();
    sheet.insertChart(chart);
  }
  
  return {
    addScatterChart: addScatterChart,
    addHistogramChart: addHistogramChart,
    addPieChart: addPieChart
  };
})();
