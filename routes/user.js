var express = require("express");
var router = express.Router(); //creates an instance of a router which we can attach routes to and export in app.js file
var { Product } = require("../models/product");
var csrf = require("csurf");
var passport = require("passport");

/* 
    CSRF protection make sure that our session can't get stolen
    or that if it gets stolen, other users still aren't able to create
    users with our session or our sign in session.
*/
csrfProtection = csrf();
//all the routes included in router should be protected by csrf protection
router.use(csrfProtection);

router.get("/profile", isLoggedIn, (req, res, next) => {
  res.render("user/profile");
});

// middleware to ensure user can't redirect to these urls if already logged in
router.use("/", notLoggedIn, (req, res, next) => {
  next();
});

router.get("/signup", (req, res, next) => {
  var messages = req.flash("error");
  res.render("user/signup", {
    csrfToken: req.csrfToken(),
    messages,
    hasErrors: messages.length > 0
  });
});

router.post(
  "/signup",
  passport.authenticate("local.signup", {
    successRedirect: "/user/profile",
    failureRedirect: "/user/signup",
    failureFlash: true
  })
);

router.get("/signin", (req, res, next) => {
  var messages = req.flash("error");
  res.render("user/signin", {
    csrfToken: req.csrfToken(),
    messages,
    hasErrors: messages.length > 0
  });
});

router.post(
  "/signin",
  passport.authenticate("local.signin", {
    successRedirect: "/user/profile",
    failureRedirect: "/user/signin",
    failureFlash: true
  })
);

router.get("/logout", (req, res, next) => {
  //method added by passport
  req.logout();
  res.redirect("/");
});

module.exports = router;

function isLoggedIn(req, res, next) {
  // method added by passport, manages the authentication state on this session.
  // when logged in it's set to true, otherwise false
  if (req.isAuthenticated()) {
    return next(); //next() == continue
  }
  res.redirect("/"); //otherwise, redirect to starting page
}

function notLoggedIn(req, res, next) {
  // method added by passport, manages the authentication state on this session.
  // when logged in it's set to true, otherwise false
  if (!req.isAuthenticated()) {
    return next(); //next() == continue
  }
  res.redirect("/"); //otherwise, redirect to starting page
}
