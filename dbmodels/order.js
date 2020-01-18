const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var schema = new Schema({
  userID: {type: String, required: true},
  status: {type: String, required: true}
});

module.exports = mongoose.model("order", schema);
