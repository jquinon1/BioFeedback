var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Article = mongoose.model('Article');


var config = require('../../config/config');

module.exports = function (app) {
  app.use('/', router);
};

router.get('/', function (req, res, next) {
  res.redirect(config.baseUrl + 'videos');
});

router.get('/unauthorized', function (req, res, next) {
  res.status(401).send('You are not authorized to access this page');
  return next();
});


