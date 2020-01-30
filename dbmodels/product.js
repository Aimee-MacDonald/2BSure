const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var schema = new Schema({
  imageURL: {type: String, required: true},
  name: {type: String, required: true},
  price: {type: Number, required: true},
  description: {type: String, required: true}
});

module.exports = mongoose.model("product", schema);
