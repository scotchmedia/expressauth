'use strict';

/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var mongoose = require('mongoose');
var path = require('path');
var config = require('./config');
var expressValidator = require('express-validator');

var app = exports.app = express();

app.configure(function () {
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  // set the 'dbUrl' to the mongodb url that corresponds to the
  // environment we are in
  app.set('dbUrl', config.db[app.settings.env]);
  // connect mongoose to the mongo dbUrl
  mongoose.connect(app.get('dbUrl'));
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  // add the express-validator middleware. 
  // Important: This must come before the app.router middleware
  app.use(expressValidator);
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function () {
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/users', user.list);

app.get('/add/:first/:second', function (req, res) {
  // convert the two values to floats and add them together
  var sum = parseFloat(req.params.first) + parseFloat(req.params.second);
  res.send(200, String(sum));
});

http.createServer(app).listen(app.get('port'), function () {
  console.log("Express server listening on port " + app.get('port'));
});
