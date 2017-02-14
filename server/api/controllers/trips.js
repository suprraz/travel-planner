'use strict';

var Trip = require('../../models/trip');

module.exports = {getAllTrips: getAll, saveTrip: save, getOneTrip: getOne, deleteTrip: deleteOne, updateTrip: updateOne};

function getAll(req, res, next) {
  var query = {owner: req.user.username};

  if(req.user.role === 'admin' || req.user.role === 'manager' ){
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

  Trip.findOne({_id: tripBeingEdited}, function(err, trip){
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

  Trip.findByIdAndUpdate(tripBeingEdited, { $set: { destination, startDate, endDate, comment }}, { new: true }, function (err, trip) {
    if(err){
      console.log(err);
      res.statusCode = 500;
      res.send(err)
    } else {
      res.statusCode = 204;
      res.json(trip.toJSON());
    }
  });
}

function deleteOne(req, res, next) {
  var tripBeingEdited = req.swagger.params.tripId.value;

  Trip.remove({ _id: tripBeingEdited }, function(err) {
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