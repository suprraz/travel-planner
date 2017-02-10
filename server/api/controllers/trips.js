'use strict';

var Trip = require('../../models/trip');
var utils = require('../helpers/utils')();

// Exports all the functions to perform on the db
module.exports = {getAllTrips: getAll, saveTrip: save, getOneTrip: getOne};

//GET /trips operationId
function getAll(req, res, next) {
  Trip.find({}, function(err, trips){
    if(err){
      console.log(err);
      res.statusCode = 500;
      res.send(err)
    }else{
      res.send(trips);
    }
  })
}

//POST /game operationId
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

//GET /trips operationId
function getOne(req, res, next) {
  var tripBeingEdited = req.swagger.params.tripname.value;

  Trip.findOne({tripname: tripBeingEdited}, function(err, trip){
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