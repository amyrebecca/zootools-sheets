// these need to be exposed as bare functions so that the Apps Script
// scripting environment / host will proxy them to the client side

function clientGetSpreadsheetID() {
  return SheetManager.getID();
};

function clientGetColumnVariables(){ 
  return SheetManager.getColumnVariables(); 
};

function clientGetRowVariables(){
  return SheetManager.getRowVariables();
};

function clientShowStats(){
  return UIManager.showSidebar('stats'); 
};

function clientShowScatter(){
  return UIManager.showSidebar('scatter'); 
};

function clientShowHistogram(){
  return UIManager.showSidebar('histogram'); 
};

function clientShowPie(){
  return UIManager.showSidebar('pie'); 
};

function clientShowGalaxyColumn(){
  return UIManager.showSidebar('galaxy-column'); 
};

function clientShowFilter(){
  return UIManager.showSidebar('filter');
};

function clientShowMapDialog(){
  return UIManager.showDialog('map');
};

function clientShowFormDialog(){
  return UIManager.showDialog('form');
};

function clientGetCoordinates(latitude, longitude){
  return SheetManager.getCoordinates(latitude, longitude);
};

function clientGetColumnValues(varName){
  return SheetManager.getColumnValues(varName);
};

function clientGetMultipleColumnValues(varNameX, varNameY) {
  return SheetManager.getMultipleColumnValues(varNameX, varNameY);
};

function clientGetRowValues(varName) {
  return SheetManager.getRowValues(varName);
};

function clientGetA1Notation(varName) {
  return SheetManager.getA1Notation(varName);
};

function clientGetQuery(varName1, varName2) {
  return SheetManager.getQuery(varName1, varName2);
}; 

function clientAddFormSubmission(institution, institutionAddress, location, locationAddress, eyeColor){
  return SheetManager.addFormSubmission(institution, institutionAddress, location, locationAddress, eyeColor);
};

function clientAddChart(config, data, type) {
  return SheetManager.addChart(config, data, type);
};

function clientAddStats(data) {
  return SheetManager.addStats(data);
};

function clientShowGenericDialog(prompt) {
  return UIManager.showGenericDialog(prompt);
};

function clientFilterData(A1Notation) {
  return SheetManager.filterData(A1Notation);
};