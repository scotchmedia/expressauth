'use strict';

var User = require('./models').User;
var UserToken = require('./models').UserToken;
var mailer = require('../mailer/models');

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
  // If the form is valid craete a new user
  var newUser = {
    name: {
      givenName: req.body.givenName,
      familyName: req.body.familyName
    },
    emails: [
      {
        value: req.body.email
      }
    ]
  };
  // hash password
  User.hashPassword(req.body.password, function (err, passwordHash) {
    // update attributes
    newUser.passwordHash = passwordHash;
    // Create new user
    User.create(newUser, function (err, user) {
      return res.redirect('/account');
    });
  });
};

/*
 * POST /password_rest
 */

exports.passwordRest = function (req, res) {
  req.onValidationError(function (msg) {
    //Redirect to `/password_rest` if email is bogus
    return res.redirect('/password_rest');
  });

  req.check('email', 'Please enter a valid email').len(1).isEmail();
  // get the user
  User.findOne({email: req.body.email}, function (err, usr) {
    if (err) {
      // TODO return error
    }
    if (!usr) {
      // TODO return message if user is not found
    }
    // Create a token UserToken
    UserToken.new(usr._id, function (err, token) {
      // build the rest url:
      // http://localhost:3000/password_rest/12345TOKEN
      var resetUrl = req.protocol + '://' + req.host + '/password_rest/' + token.token;
      // Create the template vars 
      var locals = {
        resetUrl: resetUrl,
        // TODO confirm that the user has email prior to sending this.
        email: usr.emails[0].value
      };
      mailer.sendOne('password_reset', locals, function (err, respMs) {
        // TODO add success message.
        // redirect to password_rest success page.
        return req.redirect('/');
      });
    });
  });
};

/*
 * POST /password_rest/<token>
 *
 */

exports.passwordTokenCheck = function (req, res) {
  // Check for a UserToken using the supplied token.
  UserToken({token: req.params.token}, function (err, token) {
    if (err) {
      // TODO return error
    }
    if (!token) {
      // TODO return message if token is not found
    }
    // get the user
    User.findOne({_id: token.userId}, function (err, user) {
      if (err) {
        // TODO return error
      }
      if (!user) {
        // TODO return message if token is not found
      }
      // log the user in
      req.logIn(user, function (err) {
        if (err) {
          // TODO return error
        }
        // redirect the user to a password reset form
        return res.redirect('/account/password');
      });
    });
  });
};
