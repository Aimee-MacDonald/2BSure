const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var schema = new Schema({
  upc: {type: String, required: true},
  sku: {type: String, required: true},
  name: {type: String, required: true},
  description: {type: String, required: true},
  price: {type: Number, required: true},
  inStock: {type: Number, required: true},
  imageURL: {type: String, required: true}
});

module.exports = mongoose.model("product", schema);
