const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var schema = new Schema({
  email: {type: String, required: true},
  password: {type: String, required: true},
  access: {type: String, required: true}
});

module.exports = mongoose.model("user", schema);
