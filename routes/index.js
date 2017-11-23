var express = require("express");
var router = express.Router(); //creates an instance of a router which we can attach routes to and export in app.js file
var { Product } = require("../models/product");
var Cart = require("../models/cart");

/* GET home page. */
router.get("/", (req, res) => {
  //Product.find is asynchronous
  var products = Product.find((err, docs) => {
    var productChunks = [];
    var chunkSize = 3;
    for (let i = 0; i < docs.length; i += chunkSize) {
      productChunks.push(docs.slice(i, i + chunkSize));
    }
    // console.log(res.locals.session);
    res.render("shop/index", {
      greeting: "Greetings!",
      title: "Shopping Cart",
      products: productChunks
    });
  });
});

router.get("/add-to-cart/:id", (req, res) => {
  var productId = req.params.id;
  // if previous cart exists, assign it. Else, return empty object
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  Product.findById(productId, (err, product) => {
    if (err) {
      return res.redirect("/");
    }
    cart.add(product, product.id);
    req.session.cart = cart;
    // console.log(JSON.stringify(req.session.cart, null, 2));
    res.redirect("/");
  });
});

router.get("/shopping-cart", (req, res) => {
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  var cartArray = cart.generateArray();
  console.log(JSON.stringify(cartArray, undefined, 2));
  res.render("shop/shopping-cart", {
    cartArray,
    cart,
    empty: cart.totalQty === 0
  });
});

router.get("/checkout", (req, res) => {
  if (!req.session.cart) {
    return res.redirect("/shopping-cart");
  }
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  res.render("shop/checkout", {
    total: cart.totalPrice
  });
});
router.post("/checkout", (req, res) => {});

module.exports = router;
