// PACKAGES //
var path = require('path');
var fs = require('fs');
var express = require('express');

// IMPORTS //
var indexRoutes = require('./routes/index');

// CREATE APP //
var app = express();

// VIEW ENGINE //
app.set('view engine', 'html');
app.engine('html', function(path, options, callbacks) {
  fs.readFile(path, 'utf-8', callbacks);
});

// ROUTES //
app.use('/', indexRoutes);

// MIDDLEWARE //
app.use(express.static(path.join(__dirname, '../client')));

// ERROR //
app.use(function(err, req, res, next) {
  ress.status(err.status || 500);
});

module.exports = app;
