// Defines the routes and params name that will be passed in req.params 
module.exports = {
  
  'get /acs/': {
    controller: 'acs',
    action: 'index'
  },

  'get /acs': {
    controller: 'acs',
    action: 'index'
  },

  'get /acs/:year/:state/:variable/:for': {
    controller: 'acs',
    action: 'get'
  },

  'get /acs/:year/:state/:variable/:for/drop': {
    controller: 'acs',
    action: 'drop'
  },

  'get /acs/:year/:state/:variable/:for/FeatureServer': {
    controller: 'acs',
    action: 'featureservice'
  },

  'get /acs/:year/:state/:variable/:for/FeatureServer/:layer': {
    controller: 'acs',
    action: 'featureservice'
  },

  'get /acs/:year/:state/:variable/:for/FeatureServer/:layer/:method': {
    controller: 'acs',
    action: 'featureservice'
  }


}
