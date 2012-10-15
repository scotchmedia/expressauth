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
  emails: [emailSchema],
  passwordHash: String,
  roles: Array
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

userSchema.statics.comparePasswordAndHash = function (password, passwordHash, fn) {
  // compare the password to the passwordHash
  bcrypt.compare(password, passwordHash, fn);
};

userSchema.methods.hasRole = function (role) {
  for (var i = 0; i < this.roles.length; i++) {
    if (this.roles[i] === role) {
      // if the role that we are chekign matches the 'role' we are
      // looking for return true
      return true;
    }
    
  };
  // if the role does not match return false
  return false;
};

// Export the User model
exports.User = mongoose.model('User', userSchema);
