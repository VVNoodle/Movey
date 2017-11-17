var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var schema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

/* 
    CSRF protection make sure that our session can't get stolen
    or that if it gets stolen, other users still aren't able to create
    users with our session or our sign in session.
*/

var User = mongoose.model("User", schema);
module.exports = {
  User
};
