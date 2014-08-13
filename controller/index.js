var extend = require('node.extend'),
  crypto = require('crypto'),
  fs = require('fs');

// inherit from base controller (global via koop-server)
var Controller = extend( {}, BaseController );

// general helper for not found repos
Controller.notFound = function(req, res){
  res.send('A useful error for missing data', 404);
};


// general helper for error'd requests
Controller.Error = function(req, res, code, message){
  res.send(message, code);
};

Controller.index = function(req, res){
 res.json({'American Community Survey API': 'http://api.census.gov/data/2012/acs5/geo.html'} );
};

// Pass the params and query to the model  
Controller.get = function(req, res){
    acs.find(req.params, req.query, function(err, data){
      if (err){
        Controller.Error(req, res, 500, err);
      } else {
        res.json( data );
      }
    });
};

Controller.featureservice = function(req, res){
    var callback = req.query.callback, self = this;
    delete req.query.callback;

    acs.find(req.params, req.query, function(err, data){
      if (err) {
        res.send(err, 500);
      } else {
        delete req.query.geometry;
        Controller._processFeatureServer( req, res, err, data, callback);
      }
    });
};


// drops the cache
Controller.drop = function(req, res){
  acs.drop( req.params, req.query, function(error, result){
    if (error) {
      res.send( error, 500);
    } else {
      res.json( result );
    }
  });
};


module.exports = Controller;
