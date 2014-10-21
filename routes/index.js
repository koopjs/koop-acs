// Defines the routes and params name that will be passed in req.params 
module.exports = {
  'get /acs/': 'index',
  'get /acs': 'index',
  'get /acs/:year/state/:state/:variable': 'getState',
  'get /acs/:year/state/:state/county/:county/:variable': 'getCounty',
  'get /acs/:year/state/:state/county/:county/tract/:tract/:variable': 'getTract'
}
