// Defines the routes and params name that will be passed in req.params 
module.exports = {
  'get /acs/': 'index',
  'get /acs': 'index',
  'get /acs/search': 'search',
  'get /acs/:year/state/:state/:variable/FeatureServer/:layer/:method': 'featureservice',
  'get /acs/:year/state/:state/:variable/FeatureServer/:layer': 'featureservice',
  'get /acs/:year/state/:state/:variable/FeatureServer': 'featureservice',
  'get /acs/:year/state/:state/:variable': 'get',
  'get /acs/:year/state/:state/county/:county/:variable/FeatureServer/:layer/:method': 'featureservice',
  'get /acs/:year/state/:state/county/:county/:variable/FeatureServer/:layer': 'featureservice',
  'get /acs/:year/state/:state/county/:county/:variable/FeatureServer': 'featureservice',
  'get /acs/:year/state/:state/county/:county/:variable': 'get',
  'get /acs/:year/state/:state/county/:county/tract/:tract/:variable/FeatureServer/:layer/:method': 'featureservice',
  'get /acs/:year/state/:state/county/:county/tract/:tract/:variable/FeatureServer/:layer': 'featureservice',
  'get /acs/:year/state/:state/county/:county/tract/:tract/:variable/FeatureServer': 'featureservice',
  'get /acs/:year/state/:state/county/:county/tract/:tract/:variable': 'get',
  'get /acs/:year/state/:state/county/:county/tract/:tract/:variable/drop': 'drop',
  'get /acs/:year/state/:state/county/:county/:variable/drop': 'drop',
  'get /acs/:year/state/:state/:variable/drop': 'drop'
}
