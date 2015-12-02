var UIManager = (function(){
  return {
    registerMenu: function(){
      SpreadsheetApp.getUi()
          .createMenu('Zoo Tools')
          .addItem('Scatter Plot Helper', 'clientShowSidebar')
          .addToUi();
    },
    showSidebar: function(){
      var html = HtmlService
          .createTemplateFromFile('sidebar')
          .evaluate()
          .setSandboxMode(HtmlService.SandboxMode.IFRAME)
          .setTitle('Zoo Tools');
  
      SpreadsheetApp.getUi() // Or DocumentApp or FormApp.
          .showSidebar(html);
    }
  }
})();
