'use strict';

// import the moongoose helper utilities
var utils = require('../utils');

// import our express app. We will be passing this to supertest
var app = require('../../app').app;
var should = require('should');
var request = require('supertest');
var User = require('../../users/models').User;


describe('Passport: routes', function () {

  var baseUrl = '/auth/local';
  var emailAddress = 'berry@example.com';
  var realPassword = 'secret1';

  // This function will run before each test.
  beforeEach(function (done) {
    // TODO this should be refactored into a User.new() function.
    // Hash the password
    User.hashPassword(realPassword, function (err, passwordHash) {
      // Create a User
      var u = {
        passwordHash: passwordHash,
        emails: [
          {
            value: emailAddress
          }
        ]
      };
      User.create(u, function (err, u) {
        // call the done() method so the mocha knows we are done.
        done();
      });
    });
  });

  describe('POST /auth/local', function () {
    it('should redirect to "/account" if authentication fails', function (done) {
      // post is what we will be sending to the /auth/local
      var post = {
        email: 'berry@example.com',
        password: realPassword
      };
      request(app)
        .post(baseUrl)
        .send(post)
        .expect(302)
        .end(function (err, res) {
          should.not.exist(err);
          // confirm the redirect
          res.header.location.should.include('/account');
          done();
        });
    });
    it('should redirect to "/login" if authentication fails', function (done) {
      var post = {
        email: 'berry@example.com',
        password: 'fakepassword'
      };
      request(app)
        .post(baseUrl)
        .send(post)
        .expect(302)
        .end(function (err, res) {
          should.not.exist(err);
          // confirm the redirect
          res.header.location.should.include('/login');
          done();
        });
    });
  });

});
