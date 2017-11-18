var express = require("express");
var router = express.Router();
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

/* GET home page. */
router.get("/", (req, res, next) => {
  //Product.find is asynchronous
  var products = Product.find((err, docs) => {
    var productChunks = [];
    var chunkSize = 3;
    for (let i = 0; i < docs.length; i += chunkSize) {
      productChunks.push(docs.slice(i, i + chunkSize));
    }
    res.render("shop/index", {
      greeting: "Greetings!",
      title: "Shopping Cart",
      products: productChunks
    });
  });
});

router.get("/user/signup", (req, res, next) => {
  var messages = req.flash("error");
  res.render("user/signup", {
    csrfToken: req.csrfToken(),
    messages,
    hasErrors: messages.length > 0
  });
});

router.post(
  "/user/signup",
  passport.authenticate("local.signup", {
    successRedirect: "/user/profile",
    failureRedirect: "/user/signup",
    failureFlash: true
  })
);

router.get("/user/profile", (req, res, next) => {
  res.render("user/profile");
});

module.exports = router;
