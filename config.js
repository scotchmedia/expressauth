'use strict';

module.exports = {
  db: {
    production: "mongodb://user:pass@example.com:1234/stroeski-prod",
    development: "mongodb://localhost/storeski-dev",
    test: "mongodb://localhost/storeski-test",
  },
  mailer: {
    auth: {
      user: 'test@example.com',
      pass: 'secret',
    },
    defaultFromAddress: 'First Last <test@examle.com>'
  }
};
