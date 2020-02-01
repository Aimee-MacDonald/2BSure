const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var schema = new Schema({
  userID: {type: String, required: true},
  status: {type: String, required: true},
  products: {type: Array, required: true},
  total: {type: Number, required: true}
});

module.exports = mongoose.model("order", schema);
