// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var userSchema = new Schema({
  name: { type: String, required: true},
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, default: 'user' }
});

// the schema is useless so far
// we need to create a model using it
var User = db.model('User', userSchema);

// make this available to our users in our Node applications
module.exports = User;