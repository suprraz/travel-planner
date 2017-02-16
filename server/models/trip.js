var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var tripSchema = new Schema({
  destination: { type: String, required: true},
  startDate: { type: String, required: true, unique: true },
  endDate: { type: String, required: true },
  comment: { type: String, required: true, default: 'trip' },
  owner: { type: String, required: true}
});

var Trip = db.model('Trip', tripSchema);

module.exports = Trip;