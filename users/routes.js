'use strict';

var User = require('./models').User;

/*
 * POST /signup
 */

exports.signup = function (req, res) {
  req.onValidationError(function (msg) {
    //Redirect to `/signup` if validation fails
    return res.redirect('/signup');
  });
  req.check('email', 'Please enter a valid email').len(1).isEmail();
  req.check('password', 'Please enter a password with a length between 4 and 34 digits').len(4, 34);
  req.check('givenName', 'Please enter your first name').len(1);
  req.check('familyName', 'Please enter your last name').len(1);
  res.redirect('/account');
};
