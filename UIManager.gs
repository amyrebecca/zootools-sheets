var UIManager = (function(){
  return {
    registerMenu: function(){
      var ui = SpreadsheetApp.getUi();
      ui.createAddonMenu()
          .addItem('Scatter Plot Helper', 'clientShowScatter')
          .addItem('Histogram Helper', 'clientShowHistogram')
          .addItem('Summary Stats Helper', 'clientShowStats')
          .addItem('Map Helper', 'clientShowMapDialog')
          .addItem('Student Location Survey', 'clientShowFormDialog')
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
        form: {
          height: 215,
          width: 400,
          title: 'Student Location Survey'
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
