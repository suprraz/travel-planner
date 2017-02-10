'use strict';

var User = require('../../models/user');
var utils = require('../helpers/utils')();

// Exports all the functions to perform on the db
module.exports = {getAll, save, getOne, login, logout};

//GET /users operationId
function getAll(req, res, next) {
  User.find({}, function(err, users){
    if(err){
      console.log(err);
      res.statusCode = 500;
      res.send(err)
    }else{
      res.send(users);
    }
  })
}


//POST /game operationId
function save(req, res, next) {
  var name = req.swagger.params.body.value.name;
  var username = req.swagger.params.body.value.username;
  var password = req.swagger.params.body.value.password;

  var user = new User({
    name: name,
    username: username,
    password: password,
    sessionId: 'random_' + Math.random()
  });

  user.save(function (err) {
    if(err){
      if(err.code === 11000) {
        res.statusCode = 409;
      } else {
        res.statusCode = 400;
      }
      res.send(err);
    }else if(user){
      req.session.user = user;

      res.json(utils.obfuscate(user.toJSON()));
    } else {
      res.statusCode = 400;
      res.send();
    }
  })
}

//GET /users operationId
function getOne(req, res, next) {
  var userBeingEdited = req.swagger.params.username.value;

  User.findOne({username: userBeingEdited}, function(err, user){
    if(err){
      console.log(err);
      res.statusCode = 500;
      res.send(err)
    }else if(user){
      res.send(user);
    } else {
      res.statusCode = 404;
      res.send();
    }
  })
}

function login(req, res, next) {
  var username = req.swagger.params.body.value.username;
  var password = req.swagger.params.body.value.password;

  User.findOne({username: username}, function(err, user){
    if (!user || user.password !== password) {
      // Login failed
      res.status(401).send('Invalid username or password');
    }
    else {
      user.sessionId = 'random_' + Math.random();

      user.save(function (err) {
        if(err) {
          console.error('ERROR!');
          res.json(err);
        } else {
          req.session.user = user.toJSON();

          res.json(utils.obfuscate(user.toJSON()));
        }
      });
    }
  });
}
function logout(req, res, next) {
  req.session.destroy();
  res.statusCode = 204;
  res.json({success: true});
}
