const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var schema = new Schema({
  userID: {type: String, required: true},
  line1: {type: String, required: true},
  line2: {type: String, required: false},
  town: {type: String, required: true},
  province: {type: String, required: true},
  postcode: {type: String, required: true},
});

module.exports = mongoose.model("order", schema);
