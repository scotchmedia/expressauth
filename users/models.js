'use strict';

var bcrypt = require('bcrypt');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Constants
var BCRYPT_COST = 12;


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

userSchema.statics.hashPassword = function (passwordRaw, fn) {
  // To speed up tests, we do a NODE_ENV check.
  // If we are in the test evironment we set the BCRYPT_COST = 1
  if (process.env.NODE_ENV === 'test') {
    BCRYPT_COST = 1;
  }
  // encrypt the password using bcrypt; pass the callback function
  // `fn` to bcrypt.hash()
  bcrypt.hash(passwordRaw, BCRYPT_COST, fn);
};

// Export the User model
exports.User = mongoose.model('User', userSchema);
