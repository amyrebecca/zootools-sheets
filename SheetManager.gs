var SheetManager = (function(sheet){
  
  var chart = null;
  var isNew = false;
  
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

  var getChart = function(){
    if(!chart){
      isNew = true;
      chart = sheet.newChart()
        .setChartType(Charts.ChartType.SCATTER)
        .setPosition(3, 2, 0, 0)
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
      var row = sheet.getRange(ct, 1, 1, 5).getValues()[0];
      while(row && row[0]){
        accum[row[0]] = { invert: row[1], log: row[2], min: row[3], max: row[4] };
        ct++;
        var row = sheet.getRange(ct, 1, 1, 5).getValues()[0];
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
        augmented.push({
          name: variableList[idx], 
          invert: lookup[variableList[idx]].invert, 
          log: lookup[variableList[idx]].log,
          min: lookup[variableList[idx]].min,
          max: lookup[variableList[idx]].max
        });
      }
      else
      {
        augmented.push({name: variableList[idx], invert: false, log: false, min: null, max: null});
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
  
  var updateChart = function(config){
    
    purgeChartRanges();
    
    mutateChart(function(){
      
      var xRange = fetchRange(config.x.variable);
      var yRange = fetchRange(config.y.variable);
      
      chart = chart.asScatterChart()
        .setTitle([config.y.variable, 'vs', config.x.variable].join(' '))
        .setYAxisTitle(config.y.variable)
        .setXAxisTitle(config.x.variable)
        .addRange(xRange)
        .addRange(yRange)
        .setOption('aggregationTarget', 'category') // !!!!! this took forever to figure out
        .setOption('pointSize', 1)
        .setOption('legend.position', 'none');
      
      if(config.x.axes.invert){ chart.setOption('hAxis.direction', -1); }
      if(config.x.axes.log){ chart.setOption('hAxis.logScale', true); }
      if(config.y.axes.invert){ chart.setOption('vAxis.direction', -1); }
      if(config.y.axes.log){ chart.setOption('vAxis.logScale', true); }

      if(config.x.range && config.x.range.min){ chart.setOption('hAxis.minValue',config.x.range.min); }
      if(config.x.range && config.x.range.max){ chart.setOption('hAxis.maxValue',config.x.range.max); }
      if(config.y.range && config.y.range.min){ chart.setOption('vAxis.minValue',config.y.range.min); }
      if(config.y.range && config.y.range.max){ chart.setOption('vAxis.maxValue',config.y.range.max); }
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
  
  return {
    getVariables: getVariables,
    updateChart: updateChart,
    destroyCharts: destroyCharts,
    getValues: getValues,
    getCoordinates: getCoordinates,
    addFormSubmission: addFormSubmission
  };
  
})(SpreadsheetApp.getActiveSheet());
