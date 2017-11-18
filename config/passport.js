//this passport instance has all the same data as the instance from app.js
var passport = require("passport");
var { User } = require("../models/user");
var LocalStrategy = require("passport-local").Strategy;

// How to store the user in the session
passport.serializeUser((user, done) => {
  done(null, user.id); //Whenever you want to store use in session, serialize it by id. First argument is the error case
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

passport.use(
  "local.signup",
  new LocalStrategy(
    {
      usernameField: "email",
      password: "password",
      passReqToCallback: true //literally lets you pass request in callback
    },
    (req, email, password, done) => {
      User.findOne(
        {
          email
        },
        (err, user) => {
          if (err) {
            return done(err);
          }
          if (user) {
            return done(null, false, { message: "Email is already in use" });
          }
          var newUser = new User();
          newUser.email = email;
          newUser.password = newUser.encryptPassword(password);
          newUser.save(function(err, result) {
            if (err) {
              return done(err);
            }
            return done(null, newUser);
          });
        }
      );
    }
  )
);
