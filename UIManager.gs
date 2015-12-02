var UIManager = (function(){
  return {
    registerMenu: function(){
      SpreadsheetApp.getUi()
          .createMenu('Zoo Tools')
          .addItem('Scatter Plot Helper', 'clientShowSidebar')
          .addItem('Bar Chart Helper', 'clientShowSidebar')
          .addItem('Histogram Helper', 'clientShowSidebar')
          .addItem('Summary Stats Helper', 'clientShowSidebar')
          .addToUi();
    },
    showSidebar: function(){
      var html = HtmlService
          .createTemplateFromFile('scatter')
          .evaluate()
          .setSandboxMode(HtmlService.SandboxMode.IFRAME)
          .setTitle('Zoo Tools');
  
      SpreadsheetApp.getUi() // Or DocumentApp or FormApp.
          .showSidebar(html);
    }
  }
})();
