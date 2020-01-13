const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var schema = new Schema({
  userID: {type: String, required: true},
  lastEdit: {type: Date, required: true},
  product1: {type: Number, required: false},
  product2: {type: Number, required: false},
  product3: {type: Number, required: false},
  product4: {type: Number, required: false},
});

module.exports = mongoose.model("cart", schema);
