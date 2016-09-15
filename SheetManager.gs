var SheetManager = (function() {
  
  var getID = function() {
    return SpreadsheetApp.getActiveSpreadsheet().getId();
  }
  
  var getValues = function(varName){
    var activeSheet = SpreadsheetApp.getActiveSheet();
    var data = activeSheet.getDataRange().getValues();
    
    for (var colIdx = 0; colIdx < data[0].length; colIdx++) {
      if(data[0][colIdx] === varName) break;
    }

    return activeSheet.getRange(2, colIdx+1, activeSheet.getDataRange().getLastRow() - 1).getValues().map(function(e){ return e[0]; });
  }
  
  var getMultipleValues = function(varNameX, varNameY) {
    var returnedValues = { x: getValues(varNameX), y: getValues(varNameY) };
    
    return returnedValues;
  }
  
  var getRowValues = function(varName) {
    var selectedRowIndex;
    var sheet = SpreadsheetApp.getActiveSheet();
    var rowIdValues = sheet.getRange(2, 1, sheet.getLastRow(), 1).getValues();
    var flattenedRow = [];
    
    for (var i = 0; i < rowIdValues.length; i++) {
      if (typeof(rowIdValues[i][0]) === 'number') {
        flattenedRow.push(rowIdValues[i][0].toString());
      } else {
        flattenedRow.push(rowIdValues[i][0]);
      }
    }

    if (flattenedRow.indexOf(varName) > -1) {
      selectedRowIndex = flattenedRow.indexOf(varName);
    }
    return {headers: sheet.getRange(1, 2, 1, sheet.getLastColumn() - 1).getValues(), values: sheet.getRange(selectedRowIndex + 2, 2, 1, sheet.getLastColumn() - 1).getValues()};
  }
  
  var fetchRange = function(varName){
    var data = SpreadsheetApp.getActiveSheet().getDataRange().getValues();
    for(var colIdx = 0; colIdx < data[0].length; colIdx++){
      if(data[0][colIdx]==varName) break;
    }

    var rowIdx = 1;
    do{
      rowIdx++;
    } while(data[rowIdx] && data[rowIdx][colIdx]);
  
    return SpreadsheetApp.getActiveSheet().getRange(1, colIdx+1, rowIdx-1);
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
  
  var getVariables = function(){
    var sheet = SpreadsheetApp.getActiveSheet();
    var data = sheet.getDataRange().getValues();
    var variableList = data[0].sort();
    
    // Clean variableList
    variableList = variableList.filter(function(v){ 
      if (v != undefined || v != null || v.length === 0) {
        return v
      }
    });

    var augmented = [];
    for(var idx in variableList){
      augmented.push({name: variableList[idx]});
    }
    
    return augmented;
  }
  
  // Custom for Activity 2
  var getRowIds = function(){
    var data;
    var sheet = SpreadsheetApp.getActiveSheet();
    if (sheet.getLastRow()) {
      data = sheet.getRange(2, 1, sheet.getLastRow(), 1).getValues();
    }
    
    var augmented = [];
    for(var idx in data){
      augmented.push({name: data[idx]});
    }
    
    return augmented;
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
      if (type === 'histogram') {
        setupNamedSheet('Histogram Chart Data');
      } else {
        setupNamedSheet('Galaxy Column Chart Data');
      }
    }

    setupNamedSheet('Charts');

    switch (type) {
      case "scatter":
        return ChartBuilder.addScatterChart(xRange, yRange, config);
      case "histogram":
        return ChartBuilder.addHistogramChart(data, config);
      case "column":
        return ChartBuilder.addColumnChart(data, config);
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

    sheet.getRange(rowToStart + 1, 1, 4, 2).setValues(data);
  }
        
  var getCoordinates = function(latitude, longitude){
    // Latitude and longitude will already be validated from the form submission
    var coordinates = [['Lat','Long', 'Name']];
    var latitudeValues = getValues(latitude);
    var longitudeValues = getValues(longitude);
    
    // Setup array for use with Maps API
    for (var i = latitudeValues.length - 1; i >= 0; i--) {
      // create row of lat, long, and use lat, long for tooltip popup on map
      var row = [latitudeValues[i], longitudeValues[i], latitudeValues[i] + ', ' + longitudeValues[i]];
      coordinates.push(row);
    };
    
    return coordinates;
  }
  
  var getFormResponseSheet = function() {
    var sheetName = 'Student Responses';
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
    var sheets = SpreadsheetApp.getActiveSpreadsheet().getSheets();
    
    if (sheet === undefined || sheet === null) {
       sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet(sheetName, sheets.length + 1);
       var lastColumnWithContent = sheet.getLastColumn();

       // Setup headers for new sheet
       var headerRow = sheet.getRange(1, lastColumnWithContent + 1, 1, 8);
       headerRow.setValues([['DateTime', 'Where are you from?', 'What is your institution?', 'Student latitude', 'Student longitude', 'Institution latitude', 'Institution longitude', 'Calculated Distance in km']]);
       sheet.setFrozenRows(1); // Freeze header row
    } else {
      SpreadsheetApp.setActiveSheet(sheet);
    }
    
    return sheet;
  }
  
  var getDate = function() {
    var formattedDate;
    var date = new Date();
  
    var year = date.getUTCFullYear(),
        month = date.getUTCMonth(),
        day = date.getUTCDate(),
        hour = date.getUTCHours(),
        minutes = date.getUTCMinutes(),
        seconds = date.getUTCSeconds();
  
    //month 2 digits
    month = ("0" + (month + 1)).slice(-2);
    formattedDate = month + '/' + day  + "/" + year + " " + hour + ":" + minutes + ":" + seconds;
  
    return formattedDate;
  }

  var geolocate = function(geocoder, location) {
    var latLongResults = [];
    var ui = SpreadsheetApp.getUi()
  
    var geocodedLocation = geocoder.geocode(location);

    if (geocodedLocation.status === "OK") {
      var results = geocodedLocation.results;
      var lat = results[0].geometry.location.lat;
      var long = results[0].geometry.location.lng;

      latLongResults = [lat, long];
    } else {
      ui.alert("Error parsing location. Check form responses for invalid location.");
      latLongResults = ["invalid", "invalid"];
    }

    return latLongResults;
  }
  
  var addFormSubmission = function(institution, institutionAddress, location, locationAddress) {
    // Setup latitude and longitude headers if needed
    var formResponseSheet = getFormResponseSheet();
    
    addFormRow(institution, institutionAddress, location, locationAddress, formResponseSheet);
  }
  
  var addFormRow = function(institution, institutionAddress, location, locationAddress, sheet) {
    var geocoder = Maps.newGeocoder(),
        date = getDate(),   
        institutionGeocoded = geolocate(geocoder, institutionAddress),
        locationGeocoded = geolocate(geocoder, locationAddress);
    
    sheet.appendRow([date, location, institution, locationGeocoded[0], locationGeocoded[1], institutionGeocoded[0], institutionGeocoded[1]]);
  }
  
  
  return {
    getID: getID,
    getVariables: getVariables,
    destroyCharts: destroyCharts,
    getValues: getValues,
    getMultipleValues: getMultipleValues,
    getRowValues: getRowValues,
    getRowIds: getRowIds,
    getA1Notation: getA1Notation,
    getQuery: getQuery,
    getCoordinates: getCoordinates,
    addFormSubmission: addFormSubmission,
    addChart: addChart,
    addStats: addStats,
    filterData: filterData
  };
  
})();
