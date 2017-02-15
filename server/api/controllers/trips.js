'use strict';

var Trip = require('../../models/trip');

module.exports = {getAllTrips: getAll, saveTrip: save, getOneTrip: getOne, deleteTrip: deleteOne, updateTrip: updateOne};

function getAll(req, res, next) {
  var query = {owner: req.user.username};

  if(req.user.role === 'admin' ){
    query = {}
  }

  Trip.find(query, function(err, trips){
    if(err){
      console.log(err);
      res.statusCode = 500;
      res.send(err)
    }else{
      res.send(trips);
    }
  })
}

function save(req, res, next) {
  var destination = req.swagger.params.body.value.destination;
  var startDate = req.swagger.params.body.value.startDate;
  var endDate = req.swagger.params.body.value.endDate;
  var comment = req.swagger.params.body.value.comment;

  var trip = new Trip({
    destination,
    startDate,
    endDate,
    comment,
    owner: req.user.username
  });

  trip.save(function (err) {
    if(err){
      console.log(err);
      res.statusCode = 400;
      res.send(err)
    }else if(trip){
      res.json(trip);
    } else {
      res.statusCode = 400;
      res.send();
    }
  })
}

function getOne(req, res, next) {
  var tripBeingEdited = req.swagger.params.tripId.value;

  var query = {_id: tripBeingEdited, owner: req.user.username}

  if(req.user.role === 'admin' ){
    query = {_id: tripBeingEdited}
  }

  Trip.findOne(query, function(err, trip){
    if(err){
      console.log(err);
      res.statusCode = 500;
      res.send(err)
    }else if(trip){
      res.send(trip);
    } else {
      res.statusCode = 404;
      res.send();
    }
  })
}

function updateOne(req, res, next) {
  var tripBeingEdited = req.swagger.params.tripId.value;

  var destination = req.swagger.params.body.value.destination;
  var startDate = req.swagger.params.body.value.startDate;
  var endDate = req.swagger.params.body.value.endDate;
  var comment = req.swagger.params.body.value.comment;

  var query = {_id: tripBeingEdited, owner: req.user.username}

  if(req.user.role === 'admin' ){
    query = {_id: tripBeingEdited}
  }

  Trip.findOne(query, function(err, trip){
    if(err){
      console.log(err);
      res.statusCode = 400;
      res.send(err)
    }else if(trip){
      trip.destination = destination;
      trip.startDate = startDate;
      trip.endDate = endDate;
      trip.comment = comment;

      trip.save(function (err) {
        if(err){
          res.statusCode = 400;
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
  var tripBeingEdited = req.swagger.params.tripId.value;
  var query = {_id: tripBeingEdited, owner: req.user.username}

  if(req.user.role === 'admin' ){
    query = {_id: tripBeingEdited}
  }

  Trip.remove(query, function(err) {
    if(err){
      console.log(err);
      res.statusCode = 500;
      res.send(err)
    } else {
      res.statusCode = 204;
      res.end();
    }
  });
}