var express = require("express");
var router = express.Router(); //creates an instance of a router which we can attach routes to and export in app.js file
var { Product } = require("../models/product");

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

module.exports = router;
