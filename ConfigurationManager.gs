var ConfigurationManager = (function(sheet){

  var configuration = null;
  
  var parseConfiguration = function(){

    var range = sheet.getRange("metadata!H2:H12");
    var vals = range.getValues();
    vals = vals.map(function(e){ return e[0]; });
    
    var selection = {
      xVal: vals[0],
      yVal: vals[6],
      xOpts: {
        invert: vals[1],
        log: vals[2],
        range: ((!vals[3] && !vals[4]) ? null : {
          min: !!vals[3] ? vals[3] : null,
          max: !!vals[4] ? vals[4] : null
        })
      },
      yOpts: {
        invert: vals[7],
        log: vals[8],
        range: ((!vals[9] && !vals[10]) ? null : {
          min: !!vals[9] ? vals[9] : null,
          max: !!vals[10] ? vals[10] : null
        })
      }
    };
    
    return selection;
  }

  var persistConfiguration = function(config){
    var range = sheet.getRange("metadata!H2:H12");
    
    var newOpts = [
      [config.xVal],
      [config.xOpts ? !!config.xOpts.invert : false],
      [config.xOpts ? !!config.xOpts.log : false],
      [config.xOpts && config.xOpts.range && !!config.xOpts.range.min ? config.xOpts.range.min : null],
      [config.xOpts && config.xOpts.range && !!config.xOpts.range.max ? config.xOpts.range.max : null],
      [''],
      [config.yVal],
      [config.yOpts ? !!config.yOpts.invert : false],
      [config.yOpts ? !!config.yOpts.log : false],
      [config.yOpts && config.yOpts.range && !!config.yOpts.range.min ? config.yOpts.range.min : null],
      [config.yOpts && config.yOpts.range && !!config.yOpts.range.max ? config.yOpts.range.max : null]
    ];
    range.setValues(newOpts);
  }
  
  return {
    getConfiguration: function(){
      configuration = configuration || parseConfiguration();
      return configuration;    
    },
    setConfiguration: function(config){
      configuration = config;
      persistConfiguration(config);
    }
  };
  
})(SpreadsheetApp.getActiveSheet());
