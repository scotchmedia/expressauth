'use strict';

// import the moongoose helper utilites
var utils = require('../utils');
var should = require('should');
// import our User mongoose model
var User = require('../../users/models').User;


describe('Users: models', function () {
  
  describe('#create()', function () {
    it('should create a new User', function (done) {
      // Create a User object to pass to User.create()
      var u = {
        name: {
          givenName: 'Barack',
          familyName: 'Obama'
        },
        emails: [
          {
            type: 'home',
            value: 'home@example.com'
          },
          {
            type: 'work',
            value: 'work@example.com'
          }
        ]
      };
      User.create(u, function (err, createdUser) {
        // Confirm that that an error does not exist
        should.not.exist(err);
        // verify that the returned user is what we expect
        createdUser.name.givenName.should.equal('Barack');
        createdUser.name.familyName.should.equal('Obama');
        // new tests
        createdUser.emails[0].type.should.equal('home');
        createdUser.emails[0].value.should.equal('home@example.com');
        createdUser.emails[1].type.should.equal('work');
        createdUser.emails[1].value.should.equal('work@example.com');
        // Call done to tell mocha that we are done with this test
        done();
      });
    });
  });

});
