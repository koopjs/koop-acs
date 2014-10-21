// Defines the routes and params name that will be passed in req.params 
module.exports = {
  'get /acs/': 'index',
  'get /acs': 'index',
  'get /acs/:year/:state/:variable/:for': 'get',
  'get /acs/:year/state/:state/county/:county/:variable': 'getCounties'
}
