var express = require('express'),
    fs = require('fs'),
    passport = require('passport');

var env = process.env.NODE_ENV || 'development',
    config = require('./config/config')[env],
    mongoose = require('mongoose');

var connect = function () {
  var options = { server: { socketOptions: { keepAlive: 1 } } };
  mongoose.connect(config.db, options)
};
connect();

mongoose.connection.on('error', function (err) {
  console.log(err)
});

mongoose.connection.on('disconnected', function () {
  connect()
});

var models_path = __dirname + '/app/models';
fs.readdirSync(models_path).forEach(function (file) {
  if (~file.indexOf('.js')) require(models_path + '/' + file)
});

require('./config/passport')(passport, config);

var app = express();
require('./config/express')(app, config, passport);
require('./config/routes')(app, passport);

var port = process.env.PORT || 3000;
app.listen(port);

console.log('Server started on port: ' + port);

exports = module.exports = app;