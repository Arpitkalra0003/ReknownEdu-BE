const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/user');
const config = require('../config/database');
const configAuth = require('./auth');
const FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

module.exports = function (passport) {
  let opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
  opts.secretOrKey = config.secret;
  passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
    User.getUserById(jwt_payload._id, (err, user) => {
      if (err) {
        return done(err, false);
      }

      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    });
  }));



  passport.use(new FacebookStrategy({
    clientID: configAuth.facebookAuth.clientID,
    clientSecret: configAuth.facebookAuth.clientSecret,
    callbackURL: configAuth.facebookAuth.callbackURL
  },
    function (accessToken, refreshToken, profile, done) {
      process.nextTick(function () {
        User.findOne({ 'facebook.id': profile.id }, function (err, user) {
          if (err)
            return done(err);
          if (user)
            return done(null, user);
          else {
            var newUser = new User();
            newUser.facebook.id = profile.id;
            newUser.facebook.token = accessToken;
            newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
            newUser.facebook.email = profile.emails[0].value;

            newUser.save(function (err) {
              if (err)
                throw err;
              return done(null, newUser);
            });
          }
        });
      });
    }
  ));

  passport.use(new GoogleStrategy({
    clientID: configAuth.google.clientID,
    clientSecret: configAuth.google.clientSecret,
    callbackURL: "http://localhost:3000/auth/google/redirect"
  },
    function (accessToken, refreshToken, profile, done) {
      process.nextTick(function () {
        User.findOne({ 'google.id': profile.id }, function (err, user) {
          if (err)
            return done(err);
          if (user)
            return done(null, user);
          else {
            var newUser = new User();
            newUser.google.id = profile.id;
            newUser.google.token = accessToken;
            newUser.google.name = profile.name.givenName + ' ' + profile.name.familyName;
            newUser.google.email = profile.emails[0].value;

            newUser.save(function (err) {
              if (err)
                throw err;
              return done(null, newUser);
            });
          }
        });
      });
    }
  ));
}
