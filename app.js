var express = require('express');
var path = require('path');

var routes = require('./routes/index');
var setup = require('./routes/setup');
var connect = require('./routes/connect');

var app = express();
app.locals.moment = require('moment'); // used in jade templates

// view engine setup
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'public')));
app.use('bower_components', express.static(path.join(__dirname, 'bower_components')));

app.use('/', routes);
app.use('/setup', setup);
app.use('/connect', connect);

module.exports = app;
