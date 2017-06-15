var SheetManager = (function() {
  
  var getID = function() {
    return SpreadsheetApp.getActiveSpreadsheet().getId();
  }
  
  var flatten = function(array) {
    if (array.length > 0) {
      return array.reduce(function(a, b) {
        return a.concat(b);
      });
    }
    
    return array;
  }
  
  var convertArrayValuesToString = function(array) {
    var convertedValuesArray = [];
    for (var i = 0; i < array.length; i++) {
      if (typeof array[i] !== 'string') {
        convertedValuesArray.push(array[i].toString());
      } else {
        convertedValuesArray.push(array[i]);
      }
    }
    
    return convertedValuesArray;
  }

  var flattenAndConvert = function(array) {
    var flattenedArray = flatten(array);

    return convertArrayValuesToString(flattenedArray);
  }
  
  var cleanVariableList = function(variableList) {
    return variableList.filter(function(variable){
      return variable;
    });
  }
  
  var findVariableIndex = function(array, varName) {
    var index;
    
    if (array.indexOf(varName) > -1) {
      index = array.indexOf(varName);
    }
    
    return index;
  }
  
  // Headers for the data is in the first row
  var getColumnVariables = function(){
    var sheet = SpreadsheetApp.getActiveSheet();
    var data = sheet.getDataRange().getValues() || [];
    var variableList = convertArrayValuesToString(data[0]);
    
    var cleanedVariables = cleanVariableList(variableList)
    
    return cleanedVariables;
  }
  
  // Headers for the data is in the first column
  var getRowVariables = function(){
    var data = [];
    var sheet = SpreadsheetApp.getActiveSheet();
    if (sheet.getLastRow()) {
      data = sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).getValues();
    }
    
    var flattenedData = flattenAndConvert(data);
    var cleanedVariables = cleanVariableList(flattenedData);

    return cleanedVariables;
  }
  
  var getColumnValues = function(varName) {
    var activeSheet = SpreadsheetApp.getActiveSheet();
    var columnVariables = getColumnVariables();
    var selectedColumnIndex = findVariableIndex(columnVariables, varName);

    var columnValues = activeSheet.getRange(2, selectedColumnIndex + 1, activeSheet.getLastRow() - 1).getValues() || [];
    var flattenedColumnValues = flatten(columnValues);
    return flattenedColumnValues;
  }
  
  var getMultipleColumnValues = function(varNameX, varNameY) {
    var returnedValues = { x: getColumnValues(varNameX), y: getColumnValues(varNameY) };
    
    return returnedValues;
  }
  
  var getRowValues = function(varName) {
    var sheet = SpreadsheetApp.getActiveSheet();
    var rowVariables = getRowVariables();
    var selectedRowIndex = findVariableIndex(rowVariables, varName);

    var rowValues = sheet.getRange(selectedRowIndex + 2, 2, 1, sheet.getLastColumn() - 2).getValues() || [];
    var flattenedRowValues = flatten(rowValues);

    return flattenedRowValues;
  }
  
  var fetchRange = function(varName){
    var activeSheet = SpreadsheetApp.getActiveSheet();
    var data = activeSheet.getDataRange().getValues();
    var flattenedData = flatten(data);
    var selectedColumnIndex = findVariableIndex(flattenedData, varName);
  
    return activeSheet.getRange(1, selectedColumnIndex + 1, activeSheet.getLastRow() - 1);
  }
  
  var getA1Notation = function(varName) {
    var A1Notation = {
      sheetName: SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getName(),
      range: fetchRange(varName).getA1Notation()
    };
    return A1Notation;
  }
  
  var getQuery = function(varName1, varName2) {
    var A1Notation, firstA1, secondA1, endRow;
    var query = {};
    firstA1 = fetchRange(varName1).getA1Notation();

    if (varName2) {
      secondA1 = fetchRange(varName2).getA1Notation();
      query.A1Notation = [firstA1, secondA1].join(',');
      query.columnTwo = secondA1[0];
    } else {
      query.A1Notation = firstA1;
    }
    
    query.columnOne = firstA1[0];
    query.sheetName = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getName();
    
    return query;
  }
  
  var setupNamedSheet = function(sheetName) {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
    var sheets = SpreadsheetApp.getActiveSpreadsheet().getSheets();
    
    if (sheet === undefined || sheet === null) {
      SpreadsheetApp.getActiveSpreadsheet().insertSheet(sheetName, sheets.length + 1);
    } else {
      SpreadsheetApp.setActiveSheet(sheet);
    }
    
    return sheet;
  }
  
  var setupUniqueNamedSheet = function(sheetName) {
    var sheets = SpreadsheetApp.getActiveSpreadsheet().getSheets();
    var randomString = (Math.random()*1e32).toString(36);
    var newSheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet(sheetName + '-' + randomString, sheets.length + 1);
    
    return newSheet;
  }
  
  var filterData = function(A1Notation) {
    var randomString = (Math.random()*1e32).toString(36);
    var filteredDataSheet = setupUniqueNamedSheet('Filtered Data');
    addFilteredData(A1Notation, filteredDataSheet);
  }
  
  var addFilteredData = function(A1Notation, filteredDataSheet) {
    var rangeToInsert = filteredDataSheet.getRange(1, filteredDataSheet.getLastColumn() + 1);
    
    rangeToInsert.setFormula(A1Notation);
  }
  
  var addChart = function(config, data, type) {
    var xRange, yRange;
    var sheet = SpreadsheetApp.getActiveSheet();
    if (config.x) {
      xRange = fetchRange(config.x.variable);
    }

    if (config.y) {
      yRange = fetchRange(config.y.variable);
    }
    
    if (data) {
      if (type === 'pie') {
        setupNamedSheet('Pie Chart Data');
      }
    }

    setupNamedSheet('Charts');

    switch (type) {
      case "scatter":
        return ChartBuilder.addScatterChart(xRange, yRange, config);
      case "histogram":
        return ChartBuilder.addHistogramChart(xRange, config);
      case "pie":
        return ChartBuilder.addPieChart(data, config);
    }
  }
  
  var destroyCharts = function(){
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Charts');
    var charts = sheet.getCharts();
    for(var idx in charts){
      sheet.removeChart(charts[idx]);
    }
  }
  
  var addStats = function(data) {
    setupNamedSheet('Statistics');    
    addStatsValues(data);
  }
  
  var addStatsValues = function(data) {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Statistics');
    var rowToStart = sheet.getLastRow() + 1;

    sheet.getRange(rowToStart + 1, 1, 5, 2).setValues(data);
  }
        
  var getCoordinates = function(latitude, longitude){
    // Latitude and longitude will already be validated from the form submission
    var coordinates = [['Lat','Long', 'Name']];
    var latitudeValues = getColumnValues(latitude);
    var longitudeValues = getColumnValues(longitude);
    
    // Setup array for use with Maps API
    for (var i = latitudeValues.length - 1; i >= 0; i--) {
      // create row of lat, long, and use lat, long for tooltip popup on map
      var row = [latitudeValues[i], longitudeValues[i], latitudeValues[i] + ', ' + longitudeValues[i]];
      coordinates.push(row);
    };
    
    return coordinates;
  }

  return {
    getID: getID,
    getColumnVariables: getColumnVariables,
    destroyCharts: destroyCharts,
    getColumnValues: getColumnValues,
    getMultipleColumnValues: getMultipleColumnValues,
    getRowValues: getRowValues,
    getRowVariables: getRowVariables,
    getA1Notation: getA1Notation,
    getQuery: getQuery,
    getCoordinates: getCoordinates,
    addChart: addChart,
    addStats: addStats,
    filterData: filterData
  };
  
})();
