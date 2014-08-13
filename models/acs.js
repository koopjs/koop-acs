var request = require('request'),
  async = require('async'),
  pg = require('pg');

var config = require('./config');

// American Community Survery API model
// handles all calls to ACS and interacts with the koop cache

var ACS = function(){

  // connect to postgis for geom lookups 
  this.client = new pg.Client(config.db);
  this.client.connect(function(err) {
    if(err) {
      console.error('could not connect to postgres', err);
    }
  });
  
  // generates a key used to lookup data in the cache
  this.genKey = function(params){
    return [params['year'], params['state'], params['for'], params['variable']].join('::');
  };

  // looks at the cache and checks for data
  // requests it from the API if not found in cache 
  this.find = function( params, options, callback ){
    var self = this;
var k = 0;
    var q = async.queue(function (task, cb) {
      console.log(k++, geojson.features.length);
      self.client.query(task.query, function(err, result) {
        task.feature.geometry = JSON.parse( result.rows[0].geom );
        geojson.features.push(task.feature);
        cb( ); 
      });
    }, 4);
  
    q.drain = function(){
      // insert data 
      console.log('DONE', geojson.features.length);  
      Cache.insert( type, key, geojson, 0, function( err, success){
        if ( success ) {
          callback( null, geojson );
        }
      });
    };

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
                feature = {type:'Feature', properties:{}};
                row.forEach(function(col,j){
                  feature.properties[headers[j]] = col;
                });
                  if ( feature.properties.tract ){
                    query = "select st_asgeojson(geom) as geom from tracts where tractce = '"+feature.properties.tract+"' AND statefp = '"+feature.properties.state+"' AND countyfp = '"+feature.properties.county+"'";
                    q.push({query: query, feature: feature}, function(f){
                      //console.log('wtf'); 
                      //geojson.features.push( f );
                    });
                    //console.log('look up tract ', col);
                  }
                  //geojson.features.push( feature );
              }
            });
            //console.log('wtf');
            //callback(null, geojson)
            
          } catch(e){
            console.log(e);
            callback(res.body, null);
          }  
        });
      } else {
        // We have data already, send it back
        console.log('good');
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
