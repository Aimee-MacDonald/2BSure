const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var schema = new Schema({
  userID: {type: String, required: true},
  lastEdit: {type: Date, required: true},
  products: {type: Array, required: false},
  total: {type: Number, required: true}
});

module.exports = mongoose.model("cart", schema);
