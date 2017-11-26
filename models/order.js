var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var orderSchema = new Schema({
  // actually store an id, but behind the scenes you should be aware that this id
  // links to the User model
  user: {
    type: Schema.Types.ObjectId,
    ref: "User"
    // required: true
  },
  cart: {
    type: Object,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  paymentId: {
    type: String,
    required: true
  }
});

// Actually using the blueprint to create the model in which we can work with
var Order = mongoose.model("Order", orderSchema);

module.exports = {
  Order
};
