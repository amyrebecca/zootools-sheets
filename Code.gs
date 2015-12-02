var SelectionManager = (function(sheet){
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
  
  var parseSelection = function(){
    var range = sheet.getRange("metadata!H2:H12");
    var vals = range.getValues();
    vals = vals.map(function(e){ return e[0]; });
    
    var selection = {
      xVal: vals[0],
      yVal: vals[6],
      xOpts: {
        invert: vals[1],
        log: vals[2],
        range: ((!vals[3] && !vals[4]) ? null : {
          min: !!vals[3] ? vals[3] : null,
          max: !!vals[4] ? vals[4] : null
        })
      },
      yOpts: {
        invert: vals[7],
        log: vals[8],
        range: ((!vals[9] && !vals[10]) ? null : {
          min: !!vals[9] ? vals[9] : null,
          max: !!vals[10] ? vals[10] : null
        })
      }
    };
    
    return selection;
  }

  var persistSelection = function(xVal, yVal, xOpts, yOpts){
    var range = sheet.getRange("metadata!H2:H12");
    var newOpts = [
      [xVal],
      [xOpts ? !!xOpts.invert : false],
      [xOpts ? !!xOpts.log : false],
      [xOpts && xOpts.range && !!xOpts.range.min ? xOpts.range.min : null],
      [xOpts && xOpts.range && !!xOpts.range.max ? xOpts.range.max : null],
      [''],
      [yVal],
      [yOpts ? !!yOpts.invert : false],
      [yOpts ? !!yOpts.log : false],
      [yOpts && yOpts.range && !!yOpts.range.min ? yOpts.range.min : null],
      [yOpts && yOpts.range && !!yOpts.range.max ? yOpts.range.max : null]
    ];
    range.setValues(newOpts);
  }
  
  return {
    getNames: function(){ 
      var sel = parseSelection(); 
      return [sel.xVal, sel.yVal] 
    }, 
    getRanges: function(){ 
      var names = this.getNames();
      var newX = fetchRange(names[0]);
      var newY = fetchRange(names[1]);
      return [newX, newY];
    },
    setNames: function(xVal, yVal, xOpts, yOpts){ 
      persistSelection(xVal, yVal, xOpts, yOpts);
      SheetManager.updateChart(xVal, yVal, xOpts, yOpts);
    }
  };
})(SpreadsheetApp.getActiveSheet());

var SheetManager = (function(sheet){
  
  var chart = null;
  var isNew = false;
  
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
    
    var xName, yName, xOpts, yOpts;
    if(arguments[0] instanceof Array){
      xName = arguments[0][0];
      yName = arguments[0][1];
      xOpts = arguments[0][2];
      yOpts = arguments[0][3];
    } else {
      xName = arguments[0];
      yName = arguments[1];
      xOpts = arguments[2];
      yOpts = arguments[3];
    }
    
    purgeChartRanges();

    mutateChart(function(){
      var ranges = SelectionManager.getRanges();
      chart = chart.asScatterChart()
        .setTitle([yName, 'vs', xName].join(' '))
        .setYAxisTitle(yName)
        .setXAxisTitle(xName)
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

var UIManager = (function(){
  return {
    registerMenu: function(){
      SpreadsheetApp.getUi()
          .createMenu('Zoo Tools')
          .addItem('Scatter Plot Helper', 'clientShowSidebar')
          .addToUi();
    },
    showSidebar: function(){
      var html = HtmlService
          .createTemplateFromFile('sidebar')
          .evaluate()
          .setSandboxMode(HtmlService.SandboxMode.IFRAME)
          .setTitle('Zoo Tools');
  
      SpreadsheetApp.getUi() // Or DocumentApp or FormApp.
          .showSidebar(html);
    }
  }
})();

function onOpen() {
  SheetManager.destroyCharts();
  UIManager.registerMenu();
  UIManager.showSidebar();
  SheetManager.updateChart(SelectionManager.getNames());
}

function clientGetNames(){ return SelectionManager.getNames(); };
function clientSetNames(xVal, yVal, xOpts, yOpts){ return SelectionManager.setNames(xVal, yVal, xOpts, yOpts); };
function clientGetVariables(){ return SheetManager.getVariables(); };
function clientShowSidebar(){ return UIManager.showSidebar(); };

