'use strict';

var SwaggerExpress = require('swagger-express-mw');
var app = require('express')();
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var session = require('express-session');

var dbOptions = { promiseLibrary: require('bluebird') };
global.db = (global.db ? global.db : mongoose.createConnection('mongodb://localhost/travel_planner', dbOptions));

var authentication = require('./middleware/authentication');
var authorization = require('./middleware/authorization');
var cors = require('./middleware/cors');
cors.setHeaders(app);

module.exports = app; // for testing
app.use(cookieParser());
app.set('trust proxy', 1) // trust first proxy
app.use(session({
    secret: 'keyboard cat',
    cookie: {}
  }
));


authentication.authenticateUser(app);
authorization.authorizeRoutes(app);

var config = {
  appRoot: __dirname // required config
};

SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }

  // install middleware
  swaggerExpress.register(app);

  var port = process.env.PORT || 10010;
  app.listen(port);

  if (swaggerExpress.runner.swagger.paths['/hello']) {
    console.log('try this:\ncurl http://127.0.0.1:' + port + '/hello?name=Scott');
  }
});
