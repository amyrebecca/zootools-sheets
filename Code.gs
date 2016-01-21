/**
 * @OnlyCurrentDoc  Limits the script to only accessing the current spreadsheet.
 */

// Ensure onOpen is called when add-on is first installed
function onInstall(e) {
  onOpen(e);
}

// when opening the file, destroy existing charts and
// regenerate them from the configuration, after loading
// the menu items and the sidebar
function onOpen(e) {
  UIManager.registerMenu();
}

// use this function to separate client side stuff into multiple files
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
      .getContent();
}
