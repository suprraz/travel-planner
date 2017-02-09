'use strict';

var User = require('../../models/user');
var utils = require('../helpers/utils')();

// Exports all the functions to perform on the db
module.exports = {getAll, login};

//GET /users operationId
function getAll(req, res, next) {
  User.find({}, function(err, users){
    if(err || true){
      console.log(err);
      res.statusCode = 500;
      res.send(err)
    }else{
      res.send(users);
    }
  })

}

function login(req, res, next) {
  var username = req.swagger.params.body.username;
  var password = req.swagger.params.body.password;

  var user = server.mockDataStore.fetchResource('/users/' + username);
  if (!user || user.password !== password) {
    // Login failed
    res.status(401).send('Invalid username or password');
  }
  else {
    // Login succeeded, so update the user's lastLoginDate
    user.lastLoginDate = new Date();

    // Set a session cookie that expires waaaaaay in the future
    user.sessionId = 'random_' + Math.random();
    res.set('Set-Cookie', 'demo-session-id=' + user.sessionId + '; Expires=Sat, 31-Dec-2050 00:00:00 GMT; Path=/');

    // Save the user's data
    server.mockDataStore.overwriteResource('/users/' + username, user);

    // Return the user
    res.json(user);
  }
}