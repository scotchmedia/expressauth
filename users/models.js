'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// define the emailSchema
var emailSchema = new Schema({
  // Since `type` is special keyword in mongoose we must set the def. to
  // and object. I.e. this would not work:
  // type: String,
  type  : {type: String},
  value : String
});

// define the userSchema
var userSchema = new Schema({
  name  : {
    givenName   : String,
    familyName  : String
  },
  emails: [emailSchema]
});

// Export the User model
exports.User = mongoose.model('User', userSchema);
