var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var schema = new Schema({
  imagePath: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  }
});

// Actually using the blueprint to create the model in which we can work with
var Product = mongoose.model("Product", schema);

module.exports = {
  Product
};
