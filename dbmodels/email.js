const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var schema = new Schema({
  name: {type: String, required: true},
  email: {type: String, required: true}
});

module.exports = mongoose.model("email", schema);
