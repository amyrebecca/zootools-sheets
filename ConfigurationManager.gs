var ConfigurationManager = (function(sheet){

  var configuration = null;
  
  var parseConfiguration = function(){

    var range = sheet.getRange("metadata!H2:H12");
    var vals = range.getValues();
    vals = vals.map(function(e){ return e[0]; });

    return {
      x: {
        variable: vals[0],
        axes: { invert: vals[1], log: vals[2] },
        range: ((!vals[3] && !vals[4]) ? null : {
          min: !!vals[3] ? vals[3] : null,
          max: !!vals[4] ? vals[4] : null
        })
      },
      y: {
        variable: vals[6],
        axes: { invert: vals[7], log: vals[8] },
        range: ((!vals[9] && !vals[10]) ? null : {
          min: !!vals[9] ? vals[9] : null,
          max: !!vals[10] ? vals[10] : null
        })
      }
    };
  };

  var persistConfiguration = function(config){
    var range = sheet.getRange("metadata!H2:H12");
    
    range.setValues([
      [config.x.variable],
      [!!config.x.axes.invert], [!!config.x.axes.log],
      [config.x.range ? config.x.range.min : null], [config.x.range ? config.x.range.max : null], 
      [''],
      [config.y.variable],
      [!!config.y.axes.invert], [!!config.y.axes.log],
      [config.y.range ? config.y.range.min : null], [config.y.range ? config.y.range.max : null], 
    ]);
  };
  
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
