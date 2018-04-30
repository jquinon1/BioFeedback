var express = require('express');
var glob = require('glob');

var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compress = require('compression');
var methodOverride = require('method-override');

var passport = require('passport');

var session = require('express-session');

var config = require('./config');


module.exports = function(app, config) {
  var env = process.env.NODE_ENV || 'development';
  app.locals.ENV = env;
  app.locals.ENV_DEVELOPMENT = env == 'development';

  app.set('views', config.root + '/app/views');
  app.set('view engine', 'ejs');

  // app.use(favicon(config.root + '/public/img/favicon.ico'));
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(cookieParser());
  app.use(session({secret: 'library'}));

  require('./passport')(app);

  app.all(config.baseUrl + 'auth/profile',function (req, res, next) {
    console.log('Middleware para verificar usuario');
    if(!req.user){
      res.redirect(config.baseUrl + 'unauthorized');
    }
    next();
  });

  app.all(config.baseUrl + 'videos/upload',function (req, res, next) {
    console.log('Middleware para verificar usuario');
    if(!req.user){
      res.redirect(config.baseUrl + 'unauthorized');
    }
    next();
  });

  app.all(config.baseUrl + 'videos/me',function (req, res, next) {
    console.log('Middleware para verificar usuario');
    console.log("Roooooooooot " + config.root);
    if(!req.user){
      res.redirect(config.baseUrl + 'unauthorized');
    }
    next();
  });

  app.all(config.baseUrl + 'videos/me/share',function (req, res, next) {
    console.log('Middleware para verificar usuario');
    if(!req.user){
      res.redirect(config.baseUrl + 'unauthorized');
    }
    next();
  });

  app.all(config.baseUrl + 'videos/shared/me',function (req, res, next) {
    console.log('Middleware para verificar usuario');
    if(!req.user){
      res.redirect(config.baseUrl + 'unauthorized');
    }
    next();
  });

  app.all(config.baseUrl + 'videos/delete',function (req, res, next) {
    console.log('Middleware para verificar usuario');
    if(!req.user){
      res.redirect(config.baseUrl + 'unauthorized');
    }
    next();
  });

  app.all(config.baseUrl + 'videos/edit',function (req, res, next) {
    console.log('Middleware para verificar usuario');
    if(!req.user){
      res.redirect(config.baseUrl + 'unauthorized');
    }
    next();
  });

  app.use(compress());
  app.use(express.static(config.root + '/public'));
  app.use(methodOverride());

  var controllers = glob.sync(config.root + '/app/controllers/*.js');
  controllers.forEach(function (controller) {
    require(controller)(app);
  });

  app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  if(app.get('env') === 'development'){
    app.use(function (err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: err,
        title: 'error'
      });
    });
  }

  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: {},
        title: 'error'
      });
  });

  return app;
};
