var crypto = require('crypto'),
  BaseController = require('koop-server/lib/BaseController.js'),
  fs = require('fs');

// inherit from base controller (global via koop-server)
var Controller = function( acs ){

  var controller = {};
  controller.__proto__ = BaseController();

  // general helper for not found repos
  controller.notFound = function(req, res){
    res.send('A useful error for missing data', 404);
  };
  
  // general helper for error'd requests
  controller.Error = function(req, res, code, message){
    res.send(message, code);
  };
  
  controller.index = function(req, res){
   res.json({'American Community Survey API': 'http://api.census.gov/data/2012/acs5/geo.html'} );
  };
  
  // Pass the params and query to the model  
  controller.get = function(req, res){

    var send = function(err, data){
      if (err) {
        res.send(err, 500);
      } else {
        res.json( data );
      }
    };

    var params = req.params;
    if (req.params.state && req.params.county && params.tract){
      acs.find('tract', req.params, req.query, send);
    } else if (req.params.state && req.params.county){
      acs.find('county', req.params, req.query, send);
    } else if ( req.params.state ){
      acs.find('state', req.params, req.query, send);
    } else {
      res.send('Malformed query. Must provide at least a state value', 500);
    }

  };
  
  controller.featureservice = function(req, res){
      var callback = req.query.callback, self = this;
      delete req.query.callback;

      var send = function(err, data){
        if (err) {
          res.send(err, 500);
        } else {
          delete req.query.geometry;
          controller.processFeatureServer( req, res, err, data, callback);
        }
      };
 
      var params = req.params;
      if (req.params.state && req.params.county && params.tract){
        acs.findTract(req.params, req.query, send);
      } else if (req.params.state && req.params.county){
        acs.findCounty(req.params, req.query, send);
      } else if ( req.params.state ){
        acs.findState(req.params, req.query, send);
      } else {
        res.send('Malformed query. Must provide at least a state value', 500);
      }
  };
  
  
  // drops the cache
  controller.drop = function(req, res){
    acs.drop( req.params, req.query, function(error, result){
      if (error) {
        res.send( error, 500);
      } else {
        res.json( result );
      }
    });
  };

  return controller;
};

module.exports = Controller;
