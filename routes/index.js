var express = require("express");
var router = express.Router(); //creates an instance of a router which we can attach routes to and export in app.js file
var { Product } = require("../models/product");
var { Order } = require("../models/order");
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
    var successMsg = req.flash("success");
    console.log(successMsg);
    // console.log(res.locals.session);
    res.render("shop/index", {
      greeting: "Greetings!",
      title: "Shopping Cart",
      products: productChunks,
      successMsg: successMsg[0],
      noMsg: successMsg.length === 0
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
    console.log(JSON.stringify(req.session.cart, null, 2));
    res.redirect("/");
  });
});

router.get("/reduce/:id", (req, res) => {
  var cartId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  cart.reduceByOne(cartId);
  req.session.cart = cart;
  res.redirect("/shopping-cart");
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

router.get("/checkout", isLoggedIn, (req, res) => {
  if (!req.session.cart) {
    return res.redirect("/shopping-cart");
  }
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  var errMsg = req.flash("error");
  res.render("shop/checkout", {
    total: cart.totalPrice,
    errMsg: errMsg[0],
    noError: errMsg.length === 0
  });
});
router.post("/checkout", isLoggedIn, (req, res) => {
  if (!req.session.cart) {
    return res.redirect("/shopping-cart");
  }
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  var stripe = require("stripe")("sk_test_fO9WoGfVlqCadUaMnNHVK46e");
  stripe.charges.create(
    {
      amount: cart.totalPrice * 100, //in cents
      currency: "usd",
      source: req.body.stripeToken, // obtained with Stripe.js
      description: "Charge for"
    },
    function(err, charge) {
      if (err) {
        req.flash("error", err.message);
        return res.redirect("/checkout");
      }
      var order = new Order({
        user: req.user, //passport does this for us after we log in
        cart,
        address: req.body.address, //gets the value from form of name "address"
        name: req.body.name,
        paymentId: charge.id
      });
      order.save((err, result) => {
        if (err) {
          req.flash("error", err.message);
          return res.redirect("/checkout");
        }
        req.flash("success", "Successfully purchased product!");
        req.session.cart = null;
        res.redirect("/");
      });
    }
  );
});

function isLoggedIn(req, res, next) {
  // method added by passport, manages the authentication state on this session.
  // when logged in it's set to true, otherwise false
  if (req.isAuthenticated()) {
    return next(); //next() == continue
  }
  req.session.oldUrl = req.url; //url the user tried to access
  res.redirect("/user/signin"); //otherwise, redirect to starting page
}

module.exports = router;
