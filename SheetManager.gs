var SheetManager = (function(sheet){
  
  var chart = null;
  var isNew = false;
  
  var fetchRange = function(varName){
    var data = sheet.getDataRange().getValues();
    for(var colIdx = 0; colIdx < data[0].length; colIdx++){
      if(data[0][colIdx]==varName) break;
    }

    var rowIdx = 1;
    do{
      rowIdx++;
    } while(data[rowIdx] && data[rowIdx][colIdx]);
  
    return sheet.getRange(1, colIdx+1, rowIdx-1);
  }

  var getRanges = function(){ 
    var config = ConfigurationManager.getConfiguration();
    var newX = fetchRange(config.xVal);
    var newY = fetchRange(config.yVal);
    return [newX, newY];
  }
  
  var getChart = function(){
    if(!chart){
      isNew = true;
      chart = sheet.newChart()
        .setChartType(Charts.ChartType.SCATTER)
        .setPosition(3, 2, 0, 0)
        .addRange(sheet.getRange("A1:A1"))
        .addRange(sheet.getRange("B1:B1"))
        .build();
    }
  }
  
  var getMetadata = function(){
    var sheet = null;
    var accum = {};
    var sheets = SpreadsheetApp.getActiveSpreadsheet().getSheets();
    for(var idx in sheets){
      if(sheets[idx].getName().toLowerCase()=='metadata'){
        sheet = sheets[idx];
        break;
      }
    }
    
    if(sheet){
      var ct = 2;
      var row = sheet.getRange(ct, 1, 1, 3).getValues()[0];
      while(row && row[0]){
        accum[row[0]] = { invert: row[1], log: row[2] };
        ct++;
        var row = sheet.getRange(ct, 1, 1, 3).getValues()[0];
      }
    }
    
    return accum;
  }
  
  var getVariables = function(){
    var lookup = getMetadata();
    var sheet = SpreadsheetApp.getActiveSheet();
    var data = sheet.getDataRange().getValues();
    var variableList = data[0].sort();
    
    var augmented = [];
    for(var idx in variableList){
      if(!variableList[idx]) continue;
      if(lookup[variableList[idx]]){
        augmented.push({name: variableList[idx], invert: lookup[variableList[idx]].invert, log: lookup[variableList[idx]].log });
      }
      else
      {
        augmented.push({name: variableList[idx], invert: false, log: false});
      }
    }

    return augmented;
  }

  var mutateChart = function(mutator){
    getChart();
    chart = chart.modify();
    mutator();
    chart = chart.build();
  }
  
  var updateChart = function(){
    
    var config = ConfigurationManager.getConfiguration();
    var xOpts = config.xOpts, yOpts=config.yOpts;
    
    purgeChartRanges();

    mutateChart(function(){
      var ranges = getRanges();
      chart = chart.asScatterChart()
        .setTitle([config.yVal, 'vs', config.xVal].join(' '))
        .setYAxisTitle(config.yVal)
        .setXAxisTitle(config.xVal)
        .addRange(ranges[0])
        .addRange(ranges[1])
        .setOption('aggregationTarget', 'category') // !!!!! this took forever to figure out
        .setOption('pointSize', 1)
        .setOption('legend.position', 'none');
      
      if(xOpts && xOpts.invert){ chart.setOption('hAxis.direction', -1); }
      if(xOpts && xOpts.log){ chart.setOption('hAxis.logScale', true); }
      if(yOpts && yOpts.invert){ chart.setOption('vAxis.direction', -1); }
      if(yOpts && yOpts.log){ chart.setOption('vAxis.logScale', true); }

      if(xOpts && xOpts.range && !!xOpts.range.min){ chart.setOption('hAxis.minValue',xOpts.range.min); }
      if(xOpts && xOpts.range && !!xOpts.range.max){ chart.setOption('hAxis.maxValue',xOpts.range.max); }
      if(yOpts && yOpts.range && !!yOpts.range.min){ chart.setOption('vAxis.minValue',yOpts.range.min); }
      if(yOpts && yOpts.range && !!yOpts.range.max){ chart.setOption('vAxis.maxValue',yOpts.range.max); }
    });
    
    if(isNew){
      sheet.insertChart(chart);
      isNew = false;
    }
    else
      sheet.updateChart(chart);
  }
  
  var purgeChartRanges = function(){
    mutateChart(function(){
      var ranges = chart.getRanges();
      for(var idx in ranges){ 
        chart = chart.removeRange(ranges[idx]); 
      }
    });
  }
  
  var destroyCharts = function(){
    chart = null;
    var charts = sheet.getCharts();
    for(var idx in charts){
      sheet.removeChart(charts[idx]);
    }
  }
  
  return {
    getVariables: getVariables,
    updateChart: updateChart,
    destroyCharts: destroyCharts
  };
  
})(SpreadsheetApp.getActiveSheet());
