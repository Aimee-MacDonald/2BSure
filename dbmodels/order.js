const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var schema = new Schema({
  userID: {type: String, required: true},
  status: {type: String, required: true},
  product1: {type: Number, required: false},
  product2: {type: Number, required: false},
  product3: {type: Number, required: false}
});

module.exports = mongoose.model("order", schema);
