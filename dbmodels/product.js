const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var schema = new Schema({
  name: {type: String, required: true}
});

module.exports = mongoose.model("product", schema);
