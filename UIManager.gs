var UIManager = (function(){
  return {
    registerMenu: function(){
      SpreadsheetApp.getUi()
          .createMenu('Zoo Tools')
          .addItem('Scatter Plot Helper', 'clientShowScatter')
          .addItem('Bar Chart Helper', 'clientShowBar')
          .addItem('Histogram Helper', 'clientShowHistogram')
          .addItem('Summary Stats Helper', 'clientShowStats')
          .addToUi();
    },
    showSidebar: function(which){
      var html = HtmlService
          .createTemplateFromFile(which)
          .evaluate()
          .setSandboxMode(HtmlService.SandboxMode.IFRAME)
          .setTitle('Zoo Tools');
  
      SpreadsheetApp.getUi() // Or DocumentApp or FormApp.
          .showSidebar(html);
    }
  }
})();
