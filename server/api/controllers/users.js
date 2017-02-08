'use strict';
// Include our "db"
var db = require('../../config/db')();
var utils = require('../helpers/utils')();
var words = require("an-array-of-english-words");

// Exports all the functions to perform on the db
module.exports = {getAll, login};

function authenticateUser(req, res, next) {
  // Get the session ID from the session cookie
  var sessionId = req.cookies['demo-session-id'];
  req.user = {};

  if (sessionId) {
    // Find the user account for this session ID
    var results = server.mockDataStore.fetchCollection('/users', { sessionId: sessionId });

    if (results.length === 1) {
      // Found 'em!  Add the user object to the request, so other middleware can use it
      req.user = results[0];
      console.log('User: %s', req.user.username);
    }
  }

  next();
}

//GET /users operationId
function getAll(req, res, next) {
  authenticateUser(req,res,next);

  res.json({ games: db.find()});
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