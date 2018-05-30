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

router.get('/', function (req, res, next) {
    res.redirect('/supervisor');
});

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
  Rol.findOne({nombre: "administrador"}, function(err, rol){
    if(err) {
      return res.send(err);
  }
  console.log(req.user.rol + "-" + rol._id) ;
  if(req.user.rol==rol._id){
      return res.render('signup', {
        title: "Sign Up",
        baseUrl: config.baseUrl
        });
  }else{
    return res.redirect('/supervisor');
  }
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
        res.redirect(config.baseUrl + 'signup');

    });
  });
});

router.get('/login', function (req, res, next) {
  if(req.user){
    res.redirect(config.baseUrl);
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
  Rol.findOne({nombre: "supervisor"}, function(err, rol){
    if(err) {
      return res.send(err);
    }
    console.log(req.user.rol+ "-" + rol._id);
    if(req.user.rol==rol._id){
      return res.redirect('/supervisor');
    }else{
      return res.redirect('/signup');
    }
 // res.redirect(config.baseUrl + 'supervisor');
});
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
