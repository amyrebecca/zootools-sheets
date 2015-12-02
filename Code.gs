// when opening the file, destroy existing charts and
// regenerate them from the configuration, after loading
// the menu items and the sidebar
function onOpen() {
  SheetManager.destroyCharts();
  UIManager.registerMenu();
  UIManager.showSidebar();
  SheetManager.updateChart(ConfigurationManager.getConfiguration());
}

// use this function to separate client side stuff into multiple files
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
      .getContent();
}

// these need to be exposed as bare functions so that the Apps Script
// scripting environment / host will proxy them to the client side
function clientGetConfiguration(){ return ConfigurationManager.getConfiguration(); };
function clientSetConfiguration(config){ 
  ConfigurationManager.setConfiguration(config);
  SheetManager.updateChart(config);
}
function clientGetVariables(){ return SheetManager.getVariables(); };
function clientShowSidebar(){ return UIManager.showSidebar(); };
