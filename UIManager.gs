var UIManager = (function(){
  return {
    registerMenu: function(){
      var ui = SpreadsheetApp.getUi();
      ui.createAddonMenu()
          .addItem('Scatter Plot Helper', 'clientShowScatter')
          .addItem('Histogram Helper', 'clientShowHistogram')
          .addItem('Pie Chart Helper', 'clientShowPie')
          .addItem('Summary Stats Helper', 'clientShowStats')
          .addItem('Data Filter Helper', 'clientShowFilter')
          .addItem('Map Helper', 'clientShowMapDialog')
          .addToUi();
    },
    showSidebar: function(which){
      var html = HtmlService
          .createTemplateFromFile(which)
          .evaluate()
          .setSandboxMode(HtmlService.SandboxMode.IFRAME)
          .setTitle('Zoo Tools');
  
      SpreadsheetApp.getUi()
          .showSidebar(html);
    },
    showDialog: function(menuItem){
      var dialog = {
        map: {
          height: 400,
          width: 600,
          title: 'Google Map'
        },
        working: {
          height: 100,
          width: 100,
          title: 'Working...'
        }
      };
      
      var ui = HtmlService.createTemplateFromFile(menuItem + '-dialog')
        .evaluate()
        .setWidth(dialog[menuItem].width)
        .setHeight(dialog[menuItem].height)
        .setSandboxMode(HtmlService.SandboxMode.IFRAME);
      SpreadsheetApp.getUi().showModalDialog(ui, dialog[menuItem].title);
    },
    showGenericDialog: function(prompt) {
      var ui = SpreadsheetApp.getUi();
      
      ui.alert(prompt);
    }
  }
})();
