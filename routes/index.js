var express = require("express");
var router = express.Router();
var { Product } = require("../models/product");
var csrf = require("csurf");

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
  res.render("user/signup", {
    csrfToken: req.csrfToken()
  });
});

router.post("/user/signup", (req, res, next) => {
  res.redirect("/");
});

module.exports = router;
