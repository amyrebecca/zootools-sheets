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

function clientGetValues(varname){
  return SheetManager.getValues(varname);
}