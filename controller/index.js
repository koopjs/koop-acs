var extend = require('node.extend'),
  crypto = require('crypto'),
  BaseController = require('koop-server/lib/Controller.js'),
  fs = require('fs');

// inherit from base controller (global via koop-server)
var Controller = function( acs ){

  // general helper for not found repos
  this.notFound = function(req, res){
    res.send('A useful error for missing data', 404);
  };
  
  
  // general helper for error'd requests
  this.Error = function(req, res, code, message){
    res.send(message, code);
  };
  
  this.index = function(req, res){
   res.json({'American Community Survey API': 'http://api.census.gov/data/2012/acs5/geo.html'} );
  };
  
  // Pass the params and query to the model  
  this.get = function(req, res){
      acs.find(req.params, req.query, function(err, data){
        if (err){
          Controller.Error(req, res, 500, err);
        } else {
          res.json( data );
        }
      });
  };
  
  this.featureserver = function(req, res){
      var callback = req.query.callback, self = this;
      delete req.query.callback;
  
      acs.find(req.params, req.query, function(err, data){
        if (err) {
          res.send(err, 500);
        } else {
          delete req.query.geometry;
          BaseController._processFeatureServer( req, res, err, data, callback);
        }
      });
  };
  
  
  // drops the cache
  this.drop = function(req, res){
    acs.drop( req.params, req.query, function(error, result){
      if (error) {
        res.send( error, 500);
      } else {
        res.json( result );
      }
    });
  };

  return this;
};

module.exports = Controller;
