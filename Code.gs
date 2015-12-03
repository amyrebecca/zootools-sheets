// when opening the file, destroy existing charts and
// regenerate them from the configuration, after loading
// the menu items and the sidebar
function onOpen() {
  UIManager.registerMenu();
}

// use this function to separate client side stuff into multiple files
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
      .getContent();
}
