'use strict';

var User = require('./models').User;

/*
 * POST /signup
 */

exports.signup = function (req, res) {
  res.redirect('/account');
};
