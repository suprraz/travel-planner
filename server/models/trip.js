// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var tripSchema = new Schema({
  destination: { type: String, required: true},
  startDate: { type: String, required: true, unique: true },
  endDate: { type: String, required: true },
  comment: { type: String, required: true, default: 'trip' },
  owner: { type: String, required: true}
});

// the schema is useless so far
// we need to create a model using it
var Trip = db.model('Trip', tripSchema);

// make this available to our trips in our Node applications
module.exports = Trip;