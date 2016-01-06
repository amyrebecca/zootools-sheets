// these need to be exposed as bare functions so that the Apps Script
// scripting environment / host will proxy them to the client side

function clientGetConfiguration(){ 
  return ConfigurationManager.getConfiguration(); 
};

function clientSetConfiguration(config){ 
  ConfigurationManager.setConfiguration(config);
  SheetManager.updateChart(config);
}

function clientGetVariables(){ 
  return SheetManager.getVariables(); 
};

function clientShowStats(){
  return UIManager.showSidebar('stats'); 
}

function clientShowScatter(){
  return UIManager.showSidebar('scatter'); 
}

function clientShowHistogram(){
  return UIManager.showSidebar('histogram'); 
}

function clientShowBar(){
  return UIManager.showSidebar('bar'); 
}

function clientShowMapDialog(){
  return UIManager.showDialog('map');
};

function clientShowFormDialog(){
  return UIManager.showDialog('form');
};

function clientGetCoordinates(latitude, longitude){
  return SheetManager.getCoordinates(latitude, longitude);
};

function clientGetValues(varname){
  return SheetManager.getValues(varname);
};

function clientGetMultipleValues(varnameX, varnameY) {
  return SheetManager.getMultipleValues(varnameX, varnameY);
}

function clientAddFormSubmission(institution, institutionAddress, location, locationAddress){
  return SheetManager.addFormSubmission(institution, institutionAddress, location, locationAddress);
};

function clientAddChart(config, type) {
  return SheetManager.addChart(config, type);
}
