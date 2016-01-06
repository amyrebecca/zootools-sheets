var SheetManager = (function(sheet){
 
  var getValues = function(varName){
    var data = sheet.getDataRange().getValues();
    for(var colIdx = 0; colIdx < data[0].length; colIdx++){
      if(data[0][colIdx]==varName) break;
    }

    var rowIdx = 1;
    do{
      rowIdx++;
    } while(data[rowIdx] && data[rowIdx][colIdx]);
  
    return sheet.getRange(2, colIdx+1, rowIdx-1).getValues().map(function(e){ return e[0]; });
  }
  
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
  
  var addChart = function(config, type) {
    // Fetch charts sheet
    var sheetName = 'Charts';
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
    SpreadsheetApp.setActiveSheet(sheet);
    
    if (sheet === undefined || sheet === null) {
      SpreadsheetApp.getActiveSpreadsheet().insertSheet(sheetName);
    }
    
    var xRange = fetchRange(config.x.variable);
    var yRange = fetchRange(config.y.variable);
    
    switch (type) {
      case "scatter":
        return ChartBuilder.addScatterChart(xRange, yRange, config);
    }
  }
  
  var destroyCharts = function(){
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Charts');
    var charts = sheet.getCharts();
    for(var idx in charts){
      sheet.removeChart(charts[idx]);
    }
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
  
  function getFormResponseSheet() {
    var sheetName = 'Student Responses';
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);

    if (sheet === undefined || sheet === null) {
       sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet(sheetName);
       var lastColumnWithContent = sheet.getLastColumn();

       // Setup headers for new sheet
       var headerRow = sheet.getRange(1, lastColumnWithContent + 1, 1, 8);
       headerRow.setValues([['DateTime', 'Where are you from?', 'What is your institution?', 'Student latitude', 'Student longitude', 'Institution latitude', 'Institution longitude', 'Calculated Distance']]);
       sheet.setFrozenRows(1); // Freeze header row
    }
 
    return sheet;
  }
  
  function getDate() {
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

  function geolocate(geocoder, location) {
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
  
  function addFormSubmission(institution, institutionAddress, location, locationAddress) {
    var geocoder = Maps.newGeocoder(),
        date = getDate(),   
        institutionGeocoded = geolocate(geocoder, institutionAddress),
        locationGeocoded = geolocate(geocoder, locationAddress);

    // Setup latitude and longitude headers if needed
    var formResponseSheet = getFormResponseSheet();
    var rowPositionToStart = formResponseSheet.getLastRow() + 1;
    
    formResponseSheet.appendRow([date, location, institution, locationGeocoded[0], locationGeocoded[1], institutionGeocoded[0], institutionGeocoded[1]]);
  }
  
  function getMultipleValues(varnameX, varnameY) {
    var returnedValues = { x: getValues(varnameX), y: getValues(varnameY) };
    
    return returnedValues;
  }
  
  return {
    getVariables: getVariables,
    destroyCharts: destroyCharts,
    getValues: getValues,
    getMultipleValues: getMultipleValues,
    getCoordinates: getCoordinates,
    addFormSubmission: addFormSubmission,
    addChart: addChart
  };
  
})(SpreadsheetApp.getActiveSheet());
