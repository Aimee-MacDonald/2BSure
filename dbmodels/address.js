const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var schema = new Schema({
  userID: {type: String, required: true},
  firstname: {type: String, required: true},
  lastname: {type: String, required: true},
  number: {type: String, required: true},
  street: {type: String, required: false},
  city: {type: String, required: true},
  postcode: {type: String, required: true},
  province: {type: String, required: true}
});

module.exports = mongoose.model("address", schema);
