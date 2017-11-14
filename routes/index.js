var express = require("express");
var router = express.Router();
var { Product } = require("../models/product");

/* GET home page. */
router.get("/", function(req, res, next) {
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
