'use strict';

var SwaggerExpress = require('swagger-express-mw');
var app = require('express')();
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var authenticate = require('./middleware/authenticate');
var authorize = require('./middleware/authorize');

var dbOptions = { promiseLibrary: require('bluebird') };

global.db = (global.db ? global.db : mongoose.createConnection('mongodb://localhost/travel_planner', dbOptions));

module.exports = app; // for testing
app.use(cookieParser());

app.use(authenticate);
authorize(app);
app.all('*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

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
