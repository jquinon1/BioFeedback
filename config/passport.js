var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;

// Para SSO
var GoogleStrategy = require('passport-google-oauth20').Strategy;

var mongoose = require('mongoose'),
  User = mongoose.model('User');

module.exports = function (app) {
  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser(function (user, done) {
    done(null, user);
  });

  passport.deserializeUser(function (user, done){
    done(null, user);
  });

  passport.use(new LocalStrategy({
      usernameField: 'username',
      passwordField: 'password'
    },
    function(username, password, done) {
      User.findOne({ username: username }, function(err, userData) {
        if (!userData) {
          done(null, false, {message: 'User Not Found'});
        }
        else if(userData.password === password){
          var user = userData;
          console.log(user);
          done(null, user);
        } else {
          done(null, false, {message: 'Bad Password'});
        }

      });

    }
  ));

  // SSO strategy
  passport.use(new GoogleStrategy({
    clientID: '328457622075-36bqle48ai28v5ettjnrsq2d8ng7delo.apps.googleusercontent.com',
    clientSecret: 'nhoyKEExqq8AfB5TI-GDPnVE',
    callbackURL: "http://proyecto22.dis.eafit.edu.co/auth/google/callback"
  },
  function (accessToken, refreshToken, profile, done) {
    console.log(profile);

    User.findOne({'google.id': profile.id}, function(err, user){
      if(err)
        return done(err);
      if(user)
        return done(null, user);
      else {
        
        var newUser = new User();
        newUser.google.id = profile.id;
        newUser.google.token = accessToken;
        newUser.google.name = profile.displayName;
        //newUser.google.email = profile.emails[0].value;

        newUser.save(function(err){
          if(err)
            throw err;
          return done(null, newUser);
        })
        console.log(profile);
      }
    });
  }));

};
