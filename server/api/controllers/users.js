'use strict';

var User = require('../../models/user');
var utils = require('../helpers/utils')();

module.exports = {getAll, save, getOne, login, logout, updateOne, deleteOne};

function getAll(req, res, next) {
  var query = {username: req.user.username};

  if(req.user.role === 'admin' || req.user.role === 'manager' ){
    query = {}
  }
  User.find(query, function(err, users){
    if(err){
      console.log(err);
      res.statusCode = 500;
      res.send(err)
    }else{
      res.send(users);
    }
  })
}

function save(req, res, next) {
  var name = req.swagger.params.body.value.name;
  var username = req.swagger.params.body.value.username;
  var password = req.swagger.params.body.value.password;
  var role = req.swagger.params.body.value.role;

  var userData = {
    name: name,
    username: username,
    password: password
  };

  if(role && req.user && (req.user.role === 'admin' || req.user.role === 'manager')) {
    //admin & manager can set role
    userData.role = role;
  }

  var user = new User(userData);

  user.save(function (err) {
    if(err){
      if(err.code === 11000) {
        res.statusCode = 409;
      } else {
        res.statusCode = 400;
      }
      res.send(err);
    }else {
      if(!req.session.user || !req.session.user.username ) {
        req.session.user = user.toJSON();
      }
      res.json(utils.obfuscate(user.toJSON()));
    }
  })
}

function getOne(req, res, next) {
  var userBeingEdited = req.swagger.params.username.value;

  if( req.user.username !== userBeingEdited && (req.user.role !== 'admin' && req.user.role !== 'manager') ){
    return res.status(401).send('You can only view your own profile');
  }

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

function updateOne(req, res, next) {
  var userBeingEdited = req.swagger.params.username.value;

  var name = req.swagger.params.body.value.name;
  var username = req.swagger.params.body.value.username;
  var password = req.swagger.params.body.value.password;
  var role = req.swagger.params.body.value.role;

  var updatedUserData = {name, username, password};

  if(req.user.role === 'admin' || req.user.role === 'manager' ) {
    updatedUserData.role = role;
  } else if (userBeingEdited !== req.user.username) {
    return res.status(401).send('You can only change your own profile');
  }

  User.findOne({username: userBeingEdited}, function(err, user){
    if(err){
      console.log(err);
      res.statusCode = 400;
      res.send(err)
    }else if(user){
      user.name = name;
      user.username = userBeingEdited;
      user.password = password;
      if(req.user.role === 'admin' || req.user.role === 'manager' ) {
        user.role = role;
      }
      user.save(function (err) {
        if(err){
          if(err.code === 11000) {
            res.statusCode = 409;
          } else {
            res.statusCode = 400;
          }
          res.send(err);
        } else {
          res.json({});
        }
      })
    } else {
      res.statusCode = 404;
      res.send();
    }
  });
}


function deleteOne(req, res, next) {
  var userBeingEdited = req.swagger.params.username.value;
  var query = {username: userBeingEdited};

  if( req.user.username !== userBeingEdited && (req.user.role !== 'admin' && req.user.role !== 'manager') ){
    return res.status(401).send('You can only delete your own profile');
  }

  User.remove(query, function(err) {
    if(err){
      console.log(err);
      res.statusCode = 500;
      res.send(err)
    } else {
      if( req.user.username === userBeingEdited )
      {
        req.session.destroy();
      }
      res.statusCode = 204;
      res.end();
    }
  });
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
      req.session.user = user.toJSON();

      res.json(utils.obfuscate(user.toJSON()));
    }
  });
}

function logout(req, res, next) {
  req.session.destroy();
  res.statusCode = 204;
  res.json({success: true});
}
