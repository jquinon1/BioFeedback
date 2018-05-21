var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Rol = mongoose.model('Rol');

var config = require('../../config/config');

var passport = require('passport');

module.exports = function (app) {
  app.use('/', router);
};

router.get('/users', function (req, res, next) {
  User.find(function (err, users) {
    if(err) {
      console.log(err);
      return next();
    }
    res.json(users);
  });
});

router.get('/signup', function (req, res, next) {
  if(req.user){
    res.redirect(config.baseUrl);
    return next();
  }
  res.render('signup', {
    title: "Sign Up",
    baseUrl: config.baseUrl
  });
});

router.post('/signup', function (req, res) {
  Rol.findOne({nombre: "supervisor"}, function(err, rol){
    if(err) {
      return res.send(err);
    }
    user = new User({
      name: req.body.name,
      lastname: req.body.lastname,
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      telefono: req.body.telefono,
      rol: rol._id   
    });
    User.create(user, function (err, user) {
      if(err)
        res.send(err);
      req.login(user, function () {
        res.redirect(config.baseUrl + '');
      });
    });
  });
});

router.get('/login', function (req, res, next) {
    if(req.user){
      res.redirect('/supervisor');
      return next();
    }
    res.render('login', {
      title: 'Log In',
      baseUrl: config.baseUrl
    });
});

router.post('/login', passport.authenticate('local', {
  failureRedirect: '/login'
}), function (req, res) {
  res.redirect(config.baseUrl + 'supervisor');
});


router.get('/logout', function (req, res) {
  req.logout();
  res.redirect(config.baseUrl + '');
});

// SSO
router.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }));

router.get('/auth/google/callback', passport.authenticate('google', { 
  failureRedirect: '/login' 
}), function (req, res) {
  console.log('GOOGLE AUTH SUCCESSFUL!');
  //console.log(req);
  res.redirect('/');
});
