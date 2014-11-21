var express = require('express');
var path = require('path');

var routes = require('./routes/index');
var users = require('./routes/users');
var connect = require('./routes/connect');

var app = express();

// view engine setup
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/connect', connect);

module.exports = app;
