// these need to be exposed as bare functions so that the Apps Script
// scripting environment / host will proxy them to the client side

function clientGetSpreadsheetID() {
  return SheetManager.getID();
}

function clientGetVariables(){ 
  return SheetManager.getVariables(); 
};

function clientGetRowIds(){
  return SheetManager.getRowIds();
}

function clientShowStats(){
  return UIManager.showSidebar('stats'); 
}

function clientShowScatter(){
  return UIManager.showSidebar('scatter'); 
}

function clientShowHistogram(){
  return UIManager.showSidebar('histogram'); 
}

function clientShowGalaxyColumn(){
  return UIManager.showSidebar('galaxy-column'); 
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

function clientGetValues(varName){
  return SheetManager.getValues(varName);
};

function clientGetMultipleValues(varNameX, varNameY) {
  return SheetManager.getMultipleValues(varNameX, varNameY);
}

function clientGetRowValues(varName) {
  return SheetManager.getRowValues(varName);
};

function clientQuery(varName1, varName2) {
  return SheetManager.getQuery(varName1, varName2);
} 

function clientAddFormSubmission(institution, institutionAddress, location, locationAddress){
  return SheetManager.addFormSubmission(institution, institutionAddress, location, locationAddress);
};

function clientAddChart(config, data, type) {
  return SheetManager.addChart(config, data, type);
}

function clientAddStats(data) {
  return SheetManager.addStats(data);
}

function clientShowGenericDialog(prompt) {
  return UIManager.showGenericDialog(prompt);
}