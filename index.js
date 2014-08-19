exports.name = 'acs';
exports.pattern = '/:year/:state/:variable/:for';
exports.controller = require('./controller');
exports.routes = require('./routes');
exports.model = require('./models/acs.js');  
