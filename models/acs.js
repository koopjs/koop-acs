var request = require('request');


// American Community Survery API model
// handles all calls to ACS and interacts with the koop cache

var ACS = function(){

  // generates a key used to lookup data in the cache
  this.genKey = function(params){
    return [params['year'], params['state'], params['for'], params['variable']].join('::');
  };

  // looks at the cache and checks for data
  // requests it from the API if not found in cache 
  this.find = function( params, options, callback ){
    var self = this;
var k = 0;

    // check for the needed params 
    // we could add some validation to the terms used here (in a new method _validate)
    if ( !params['year'] || !params['state'] || !params['for'] || !params['variable']){
      callback('Must specify a year, state, for, and a variable', null );
      return;
    }
  
    // Okay all good, move on ...
  
    var type = 'acs';
    var key = this.genKey( params );
    var headers, query, feature, geojson = { type:'FeatureCollection', features:[] };
    
    // check the cache for data with this type & key
    Cache.get( type, key, options, function(err, entry ){
      if ( err){
        // if we get an err then get the data and insert it 
        var url = 'http://api.census.gov/data/'+params['year']+'/acs5?get='+params['variable']+'&for='+params['for']+'&in=state:'+params['state']+'&key=b2410e6888e5e1e6038d4e115bd8a453f692e820'; 
  
        request.get(url, function(e, res){
          try {
            var json = JSON.parse(res.body);
            json.forEach(function(row,i){
              if (i == 0){
                headers = row;
              } else {
                feature = { type: 'Feature', properties: {}, geometry: null };
                row.forEach(function(col,j){
                  feature.properties[headers[j]] = col;
                });
                geojson.features.push( feature );
              }
            });
            Cache.insert( type, key, geojson, 0, function( err, success){
              if ( success ) {
                callback( null, geojson );
              }
            });
            
          } catch(e){
            callback(res.body, null);
          }  
        });
      } else {
        // We have data already, send it back
        callback( null, entry );
      }
    });
  };
  
  // drops from the cache
  this.drop = function( params, options, callback ){
    var key = this.genKey( params ); 
    Cache.remove('acs', key, options, function(err, res){
      callback(err, res);
    });
  };
}

module.exports = new ACS();
